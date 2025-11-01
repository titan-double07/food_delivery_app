import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

/**
 * A hook that wraps an Appwrite function and handles loading and error states.
 *
 * @param {UseAppwriteOptions<T, P>} options - An object containing the Appwrite function to wrap and its parameters.
 * @param {T} options.fn - The Appwrite function to wrap.
 * @param {P} options.params - The parameters to pass to the Appwrite function.
 * @param {boolean} options.skip - Whether to skip the initial fetch. Defaults to false.
 * @returns {UseAppwriteReturn<T, P>} - An object containing the data, loading state, error message, and a refetch function.
 */
interface UseAppwriteOptions<T, P extends Record<string, string | number>> {
  fn: (params: P) => Promise<T>;
  params?: P;
  skip?: boolean;
}

/**
 * The return type of the useAppwrite hook.
 */
interface UseAppwriteReturn<T, P> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: (newParams?: P) => Promise<void>;
}

const useAppwrite = <T, P extends Record<string, string | number>>({
  fn,
  params = {} as P,
  skip = false,
}: UseAppwriteOptions<T, P>): UseAppwriteReturn<T, P> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);

  /**
   * A function to fetch the data from the Appwrite function.
   *
   * @param {P} fetchParams - The parameters to pass to the Appwrite function.
   * @returns {Promise<void>}
   */
  const fetchData = useCallback(
    async (fetchParams: P) => {
      setLoading(true);
      setError(null);

      try {
        const result = await fn({ ...fetchParams });
        setData(result);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        Alert.alert("Error", errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fn],
  );

  useEffect(() => {
    if (!skip) {
      fetchData(params);
    }
  }, []);

  /**
   * A function to retry the Appwrite function with new parameters.
   *
   * @param {P} newParams - The new parameters to pass to the Appwrite function.
   * @returns {Promise<void>}
   */
  const refetch = async (newParams?: P) => await fetchData(newParams!);

  return { data, loading, error, refetch };
};

export default useAppwrite;
