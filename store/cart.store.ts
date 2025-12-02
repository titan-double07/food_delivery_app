import { CartCustomization, CartStore } from "@/type";
import { create } from "zustand";
import { showToast } from "@/utils/toast"; // Import the toast utility
/**
 * Generate a unique cart key for an item + customizations
 * This ensures items with same ID but different customizations get unique keys
 *
 * @param itemId - The base item ID
 * @param customizations - Array of customizations
 * @returns Unique string key for this specific configuration
 *
 * @example
 * getCartItemKey('burger_001', [bacon, cheese])
 * // Returns: 'burger_001_topping_bacon_topping_cheese'
 *
 * getCartItemKey('burger_001', [cheese, bacon])
 * // Returns: 'burger_001_topping_bacon_topping_cheese' (same order after sorting)
 */
export function getCartItemKey(
  itemId: string,
  customizations: CartCustomization[] = [],
): string {
  // If no customizations, just return the item ID
  if (customizations.length === 0) {
    return itemId;
  }

  // Sort customizations by ID to ensure consistent key regardless of selection order
  const sortedCustomizations = [...customizations]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((c) => c.id)
    .join("_");

  // Combine item ID with sorted customization IDs
  return `${itemId}_${sortedCustomizations}`;
}

/**
 * Function to check if two arrays of customizations are equal
 * @param a {CartCustomization[]} - first array of customizations
 * @param b {CartCustomization[]} - second array of customizations
 * @returns {boolean} - true if the arrays are equal, false otherwise
 */
function areCustomizationsEqual(
  a: CartCustomization[] = [],
  b: CartCustomization[] = [],
): boolean {
  // if the lengths of the two arrays are not equal, they cannot be equal
  if (a.length !== b.length) return false;

  // sort both arrays by id to make comparison easier
  const aSorted = [...a].sort((x, y) => x.id.localeCompare(y.id));
  const bSorted = [...b].sort((x, y) => x.id.localeCompare(y.id));

  // compare each customization in the sorted arrays
  return aSorted.every((item, idx) => item.id === bSorted[idx].id);
}

/**
 * Cart store
 * @see https://github.com/pmndrs/zustand#cart-example
 */
export const useCartStore = create<CartStore>((set, get) => ({
  // initial state
  items: [],
  // track check items
  selectedItems: [],

  /**
   * Add an item to the cart
   * @param item {CartItemType} - item to add
   *
   * This function handles two scenarios:
   * 1. If item exists with same customizations → increase quantity
   * 2. If item is new or has different customizations → add as new item
   */
  addItem: (item) => {
    const customizations = item.customizations ?? [];

    // Generate unique cart key for this item + customizations
    const cartKey = getCartItemKey(item.id, customizations);

    // Check if item with same ID and customizations exists
    const existing = get().items.find(
      (i) =>
        i.id === item.id &&
        areCustomizationsEqual(i.customizations ?? [], customizations),
    );

    if (existing) {
      // Item exists → Increase quantity
      set({
        items: get().items.map((i) =>
          i.id === item.id &&
          areCustomizationsEqual(i.customizations ?? [], customizations)
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        ),
      });

      showToast(
        "success",
        "Quantity Updated!",
        `${item.name} quantity is now ${existing.quantity + 1}`,
      );
    } else {
      // New item → Add with unique cartKey
      set({
        items: [
          ...get().items,
          {
            ...item,
            quantity: 1,
            customizations,
            cartKey, // ← Add unique key for React rendering
          },
        ],
      });

      showToast("success", "Added to Cart! 🛒", `${item.name} has been added`);
    }
  },

  /**
   * Remove an item from the cart
   * @param id {string} - id of the item to remove
   * @param customizations {CartCustomization[]} - customizations of the item to remove
   */
  removeItem: (id, customizations = []) => {
    // Get the item before removing it (so we can show its name in the toast)
    const itemToRemove = get().items.find(
      (i) =>
        i.id === id &&
        areCustomizationsEqual(i.customizations ?? [], customizations),
    );

    // filter out the item with the given id and customizations
    set({
      items: get().items.filter(
        (i) =>
          !(
            i.id === id &&
            areCustomizationsEqual(i.customizations ?? [], customizations)
          ),
      ),
    });

    // Show toast notification for item removal
    if (itemToRemove) {
      showToast(
        "error",
        "Removed from Cart",
        `${itemToRemove.name} has been removed`,
      );
    }
  },

  /**
   * Increase the quantity of an item in the cart
   * @param id {string} - id of the item to increase
   * @param customizations {CartCustomization[]} - customizations of the item to increase
   */
  increaseQty: (id, customizations = []) => {
    // Map through items and increase quantity for matching item
    const items = get().items.map((i) =>
      i.id === id &&
      areCustomizationsEqual(i.customizations ?? [], customizations)
        ? { ...i, quantity: i.quantity + 1 }
        : i,
    );

    // Find the updated item to show in toast
    const item = items.find(
      (i) =>
        i.id === id &&
        areCustomizationsEqual(i.customizations ?? [], customizations),
    );

    // Update the store
    set({ items });

    // Show feedback in console and toast
    if (item) {
      showToast(
        "success",
        "Quantity Updated",
        `${item.name} × ${item.quantity}`,
      );
    }
  },

  /**
   * Decrease the quantity of an item in the cart
   * @param id {string} - id of the item to decrease
   * @param customizations {CartCustomization[]} - customizations of the item to decrease
   */
  decreaseQty: (id, customizations = []) => {
    // Find the item before decreasing to check if it will be removed
    const item = get().items.find(
      (i) =>
        i.id === id &&
        areCustomizationsEqual(i.customizations ?? [], customizations),
    );

    set({
      items: get()
        .items.map((i) =>
          i.id === id &&
          areCustomizationsEqual(i.customizations ?? [], customizations)
            ? { ...i, quantity: i.quantity - 1 }
            : i,
        )
        .filter((i) => i.quantity > 0), // Remove items with 0 quantity
    });

    // Show appropriate toast based on whether item was removed or quantity decreased
    if (item) {
      if (item.quantity === 1) {
        // Item will be removed
        showToast("info", "Removed from Cart", `${item.name} has been removed`);
      } else {
        // Just decreased quantity
        showToast(
          "success",
          "Quantity Updated",
          `${item.name} × ${item.quantity - 1}`,
        );
      }
    }
  },
  /**
   * Toggle item selection (checkbox)
   * @param cartKey - The unique cart key for the item
   */
  toggleItemSelection: (cartKey: string) => {
    const selectedItems = get().selectedItems;
    const isSelected = selectedItems.includes(cartKey);

    if (isSelected) {
      // Deselect
      set({
        selectedItems: selectedItems.filter((key) => key !== cartKey),
      });
    } else {
      // Select
      set({
        selectedItems: [...selectedItems, cartKey],
      });
    }
  },

  /**
   * Select all items
   */
  selectAllItems: () => {
    const allCartKeys = get()
      .items.map((item) => item.cartKey)
      .filter(Boolean) as string[];
    set({ selectedItems: allCartKeys });
  },

  /**
   * Deselect all items
   */
  deselectAllItems: () => {
    set({ selectedItems: [] });
  },

  /**
   * Check if an item is selected
   * @param cartKey - The unique cart key
   */
  isItemSelected: (cartKey: string) => {
    return get().selectedItems.includes(cartKey);
  },
  /**
   * Remove all selected items
   */
  removeSelectedItems: () => {
    const selectedKeys = get().selectedItems;
    const remainingItems = get().items.filter(
      (item) => !selectedKeys.includes(item.cartKey!),
    );

    set({
      items: remainingItems,
      selectedItems: [],
    });

    showToast(
      "success",
      "Items Removed",
      `${selectedKeys.length} item(s) removed from cart`,
    );
  },
  /**
   * Clear entire cart
   */
  clearCart: () => {
    set({ items: [], selectedItems: [] });
    showToast("info", "Cart Cleared", "All items have been removed");
  },

  /**
   * Get the total number of items in the cart
   * @returns {number} - total number of items
   */
  getTotalItems: () =>
    get().items.reduce((total, item) => total + item.quantity, 0),

  /**
   * Get the total price of all items in the cart
   * @returns {number} - total price of all items
   */
  getTotalPrice: () =>
    get().items.reduce((total, item) => {
      const base = item.price;
      const customPrice =
        item.customizations?.reduce(
          (s: number, c: CartCustomization) => s + c.price,
          0,
        ) ?? 0;
      return total + item.quantity * (base + customPrice);
    }, 0),
  /**
   * Get total price of selected items only
   */
  getSelectedItemsTotal: () => {
    const selectedKeys = get().selectedItems;
    return get().items.reduce((total, item) => {
      // Only count if item is selected
      if (!selectedKeys.includes(item.cartKey!)) return total;

      const base = item.price;
      const customPrice =
        item.customizations?.reduce(
          (s: number, c: CartCustomization) => s + c.price,
          0,
        ) ?? 0;
      return total + item.quantity * (base + customPrice);
    }, 0);
  },

  /**
   * Get number of selected items
   */
  getSelectedItemsCount: () => get().selectedItems.length,
}));
