// store/delivery.store.ts
import { create } from "zustand";

export interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  fullAddress?: string;
}

interface DeliveryStore {
  address: DeliveryAddress | null;
  setAddress: (address: DeliveryAddress) => void;
  clearAddress: () => void;
  hasAddress: () => boolean;
}

 const useDeliveryStore = create<DeliveryStore>((set, get) => ({
  address: null,
  setAddress: (address) => set({ address }),
  clearAddress: () => set({ address: null }),
  hasAddress: () => get().address !== null,
}));

export default useDeliveryStore;