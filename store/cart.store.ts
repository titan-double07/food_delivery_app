import { CartCustomization, CartStore } from "@/type";
import { create } from "zustand";

/**
 * Function to check if two arrays of customizations are equal
 * @param a {CartCustomization[]} - first array of customizations
 * @param b {CartCustomization[]} - second array of customizations
 * @returns {boolean} - true if the arrays are equal, false otherwise
 */
function areCustomizationsEqual(
    a: CartCustomization[] = [],
    b: CartCustomization[] = []
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

    /**
     * Add an item to the cart
     * @param item {CartItemType} - item to add
     */
    addItem: (item) => {
        const customizations = item.customizations ?? [];

        // check if the item already exists in the cart
        const existing = get().items.find(
            (i) =>
                i.id === item.id &&
                areCustomizationsEqual(i.customizations ?? [], customizations)
        );

        // if the item already exists, increase its quantity
        if (existing) {
            set({
                items: get().items.map((i) =>
                    i.id === item.id &&
                    areCustomizationsEqual(i.customizations ?? [], customizations)
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                ),
            });
        } else {
            // if the item does not exist, add it to the cart
            set({
                items: [...get().items, { ...item, quantity: 1, customizations }],
            });
        }
    },

    /**
     * Remove an item from the cart
     * @param id {string} - id of the item to remove
     * @param customizations {CartCustomization[]} - customizations of the item to remove
     */
    removeItem: (id, customizations = []) => {
        // filter out the item with the given id and customizations
        set({
            items: get().items.filter(
                (i) =>
                    !(
                        i.id === id &&
                        areCustomizationsEqual(i.customizations ?? [], customizations)
                    )
            ),
        });
    },

    /**
     * Increase the quantity of an item in the cart
     * @param id {string} - id of the item to increase
     * @param customizations {CartCustomization[]} - customizations of the item to increase
     */
    increaseQty: (id, customizations = []) => {
        set({
            items: get().items.map((i) =>
                i.id === id &&
                areCustomizationsEqual(i.customizations ?? [], customizations)
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
            ),
        });
    },

    /**
     * Decrease the quantity of an item in the cart
     * @param id {string} - id of the item to decrease
     * @param customizations {CartCustomization[]} - customizations of the item to decrease
     */
    decreaseQty: (id, customizations = []) => {
        set({
            items: get()
                .items.map((i) =>
                    i.id === id &&
                    areCustomizationsEqual(i.customizations ?? [], customizations)
                        ? { ...i, quantity: i.quantity - 1 }
                        : i
                )
                .filter((i) => i.quantity > 0),
        });
    },

    /**
     * Clear the cart
     */
    clearCart: () => set({ items: [] }),

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
                    0
                ) ?? 0;
            return total + item.quantity * (base + customPrice);
        }, 0),
}));

