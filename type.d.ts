import { Models } from "react-native-appwrite";

export interface MenuItemtype extends Models.Document {
  name: string;
  price: number;
  image_url: string;
  description: string;
  calories: number;
  protein: number;
  rating: number;
  type: string;
}


export interface Category extends Models.Document {
  name: string;
  description: string;
}

export interface User extends Models.Session {
  name: string;
  email: string;
  avatar: string;
}

/**
 * Customization option (topping or side)
 * This represents a single option the user can add
 */
export interface CustomizationOption {
  id: string; // Unique identifier
  name: string; // Display name (e.g., "Bacon", "Fries")
  price: number; // Additional cost
  image: any; // Image source (local or remote)
  type: "topping" | "side"; // Category
}

/**
 * Selected customization
 * This is what gets stored in the cart
 */
export interface CartCustomization {
  id: string;
  name: string;
  price: number;
  type: string;
}

/**
 * Cart Item
 * This is what gets stored in the cart store
 */
export interface CartItemType {
  id: string; // Menu item ID
  name: string; // Menu item name
  price: number; // Base price (without customizations)
  image_url: string; // Item image
  quantity: number; // How many of this item (with these customizations)
  customizations?: CartCustomization[]; // Selected toppings/sides
  cartKey?: string; //Unique key for React rendering
}

export interface CartStore {
  items: CartItemType[];
  selectedItems: string[]; // ← NEW: Array of selected cart keys

  // Item management
  addItem: (item: Omit<CartItemType, "quantity">) => void;
  removeItem: (id: string, customizations?: CartCustomization[]) => void;
  increaseQty: (id: string, customizations?: CartCustomization[]) => void;
  decreaseQty: (id: string, customizations?: CartCustomization[]) => void;
  clearCart: () => void;

  // Selection management (NEW)
  toggleItemSelection: (cartKey: string) => void;
  selectAllItems: () => void;
  deselectAllItems: () => void;
  isItemSelected: (cartKey: string) => boolean;
  removeSelectedItems: () => void;

  // Calculations
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getSelectedItemsTotal: () => number; // ← NEW
  getSelectedItemsCount: () => number; // ← NEW
}

interface TabBarIconProps {
  focused: boolean;
  icon: ImageSourcePropType;
  title: string;
}

interface PaymentInfoStripeProps {
  label: string;
  value: string;
  labelStyle?: string;
  valueStyle?: string;
}

interface CustomButtonProps {
  onPress?: () => void;
  title?: string;
  style?: string;
  leftIcon?: React.ReactNode;
  textStyle?: string;
  isLoading?: boolean;
}

interface CustomHeaderProps {
  title?: string;
}

interface CustomInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  label: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
}

export interface ProfileFieldProps {
  label: string;
  value: string;
  icon: ImageSourcePropType;
}

export interface CreateUserParams {
  email: string;
  password: string;
  name: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface GetMenuParams {
  category?: string;
  query?: string;
  limit?: number;
  offset?: number;
}
