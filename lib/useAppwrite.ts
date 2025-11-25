import { useCallback, useEffect, useState } from "react";
import { showAlert } from "@/utils/alert";

/**
 * Configuration options for the useAppwrite hook
 *
 * @template T - The type of data returned by the function
 * @template P - The type of parameters passed to the function
 */
interface UseAppwriteOptions<T, P extends Record<string, any>> {
  fn: (params: P) => Promise<T>; // The Appwrite function to call
  params?: P; // Parameters to pass to the function
  skip?: boolean; // Skip initial fetch if true
}

/**
 * Return type of the useAppwrite hook
 *
 * @template T - The type of data returned
 * @template P - The type of parameters
 */
interface UseAppwriteReturn<T, P> {
  data: T | null; // The fetched data
  loading: boolean; // Initial loading state
  error: string | null; // Error message if any
  refetch: (newParams?: P) => Promise<void>; // Function to refetch
  refresh: () => void; // Function for pull-to-refresh
  refreshing: boolean; // Pull-to-refresh loading state
  loadMore: () => void; // Function for infinite scroll
  loadingMore: boolean; // Infinite scroll loading state
  hasMore: boolean; // Whether there are more items
}

/**
 * Custom hook for Appwrite data fetching with pagination support
 *
 * Handles:
 * - Initial data loading
 * - Pull-to-refresh
 * - Infinite scroll
 * - Error handling
 * - Type safety
 *
 * @example
 * ```typescript
 * const { data, loading, refetch } = useAppwrite({
 *   fn: appWriteServices.getMenu,
 *   params: { category: 'pizza', limit: 10 }
 * });
 * ```
 */
const useAppwrite = <T, P extends Record<string, any>>({
  fn,
  params = {} as P,
  skip = false,
}: UseAppwriteOptions<T, P>): UseAppwriteReturn<T, P> => {
  // State for storing the fetched data
  const [data, setData] = useState<T | null>(null);

  // State for initial loading (first time fetching data)
  const [loading, setLoading] = useState(!skip);

  // State for pull-to-refresh loading
  const [refreshing, setRefreshing] = useState(false);

  // State for loading more items (infinite scroll)
  const [loadingMore, setLoadingMore] = useState(false);

  // State to track if there are more items to load
  const [hasMore, setHasMore] = useState(true);

  // State for error messages
  const [error, setError] = useState<string | null>(null);

  // Track the current offset for pagination
  const [offset, setOffset] = useState(0);

  /**
   * Main function to fetch data
   *
   * @param fetchParams - Parameters to pass to the function
   * @param isRefresh - true when user pulls to refresh
   * @param isLoadMore - true when user scrolls to bottom (infinite scroll)
   */
  const fetchData = useCallback(
    async (fetchParams: P, isRefresh = false, isLoadMore = false) => {
      // Handle refresh state
      if (isRefresh) {
        setRefreshing(true);
        setOffset(0);
        setHasMore(true);
      }
      // Handle load more state
      else if (isLoadMore) {
        // Don't load more if we're already loading or no more items exist
        if (!hasMore || loadingMore) return;
        setLoadingMore(true);
      }
      // Handle initial load state
      else {
        setLoading(true);
      }

      setError(null);

      try {
        // Determine which offset to use
        const currentOffset = isRefresh ? 0 : offset;

        // Call the API function with params and offset
        const response = await fn({
          ...fetchParams,
          offset: currentOffset,
        });

        // Check if response is an array (for paginated data) or single item
        const isArray = Array.isArray(response);

        if (isArray) {
          // Handle array responses (like getMenu)
          if (isRefresh) {
            setData(response as T);
          } else if (isLoadMore) {
            setData((prev) =>
              prev && Array.isArray(prev)
                ? ([...prev, ...response] as T)
                : (response as T),
            );
          } else {
            setData(response as T);
          }

          // Check if there are more items to load
          const limit = fetchParams.limit || 10;
          if (response.length < limit) {
            setHasMore(false);
          } else {
            setOffset(currentOffset + response.length);
          }
        } else {
          // Handle single item responses (like getMenuItemById)
          setData(response);
          setHasMore(false); // Single items don't paginate
        }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);

        // Only show alert for non-refresh/load-more errors
        if (!isRefresh && !isLoadMore) {
          showAlert("error", "Error", errorMessage);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [fn, hasMore, loadingMore, offset],
  );

  /**
   * Initial data fetch on mount
   */
  useEffect(() => {
    if (!skip) {
      fetchData(params);
    }
  }, []); // Only run on mount

  /**
   * Refetch data with new parameters
   * Used when search query or category changes
   *
   * @param newParams - New parameters to pass to the function
   */
  const refetch = async (newParams?: P) => {
    setOffset(0);
    setHasMore(true);
    await fetchData(newParams || params, false, false);
  };

  /**
   * Refresh data (pull to refresh)
   */
  const refresh = useCallback(() => {
    fetchData(params, true, false);
  }, [fetchData, params]);

  /**
   * Load more data (infinite scroll)
   */
  const loadMore = useCallback(() => {
    if (hasMore && !loadingMore) {
      fetchData(params, false, true);
    }
  }, [fetchData, params, hasMore, loadingMore]);

  return {
    data,
    loading,
    error,
    refetch,
    refresh,
    refreshing,
    loadMore,
    loadingMore,
    hasMore,
  };
};

export default useAppwrite;
