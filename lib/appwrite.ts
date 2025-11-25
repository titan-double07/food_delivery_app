// contains all appwrite configurations

import {
  Account,
  AppwriteException,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";
import { CreateUserParams, GetMenuParams, MenuItemtype } from "@/type";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  platform: `food_delivery_app (com.titanic.food-delivery-app)`,
  databaseId: "68c497f100170337df78",
  bucketId: "68e140c90011aba854b0",
  userCollectionId: "user",
  menuCollectionId: "menu",
  categoriesCollectionId: "categories",
  cartCollectionId: "cart",
  customizationsCollectionId: "customization",
  menuCustomizationsCollectionId: "menu_customizations",
  // ordersCollectionId: "orders",
  // paymentsCollectionId: "payments",
  // reviewsCollectionId: "reviews",
};

// create appwrite client
export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client); // used to create a new user
export const database = new Databases(client); // used to create a new database
export const storage = new Storage(client);
const avatars = new Avatars(client); // used to create a new avatar

// define appwrite services for creating a new user

export const appWriteServices = {
  createUser: async ({ email, name, password }: CreateUserParams) => {
    try {
      //crate a new user account
      const newAccount = await account.create({
        userId: ID.unique(),
        email,
        password,
        name,
      });

      if (!newAccount) throw new Error("Failed to create user");

      //sign in the user

      await appWriteServices.signInUser(email, password);

      // create user avatar

      const avatarUrl = avatars.getInitialsURL(name);

      //  add user to database

      return await database.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        ID.unique(),
        { email, name, accountId: newAccount.$id, avatar: avatarUrl },
      );
    } catch (error) {
      throw new Error((error as AppwriteException).message);
    }
  },

  signInUser: async (email: string, password: string) => {
    try {
      const session = await account.createEmailPasswordSession({
        email,
        password,
      });
      console.log("🚀 ~ session:", session);

      return session;
    } catch (error) {
      console.error("🚀 ~ error:", error as AppwriteException);
      throw new Error((error as AppwriteException).message);
    }
  },

  getCurrentUser: async () => {
    try {
      // get the current user
      const currentAccount = await account.get();
      //if currentAccount is not found, throw an error
      if (!currentAccount) throw new Error("Account not found");
      // get user from database

      const currentUser = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal("accountId", currentAccount.$id)],
      );
      return currentUser.documents[0];
    } catch (error) {
      throw new Error((error as AppwriteException).message);
    }
  },

  getMenu: async ({
    category,
    query,
    limit = 10,
    offset = 0,
  }: GetMenuParams) => {
    try {
      /**
       * ISSUE: 
       * when i click on a filter fro the 1st time even tho category was logged an empty array was returned
       * when i searched "patty" while on the "all" filter ("") it returned the empty array
       * */ 
      console.log("🚀 ~ category,query,:", category, query,)
      
      // Create an array to hold all our query conditions
      const queries: string[] = [];

      // Add pagination queries (these are ALWAYS included)
      queries.push(Query.limit(limit)); // How many items to fetch per request
      queries.push(Query.offset(offset)); // Skip this many items (for pagination)
      queries.push(Query.orderDesc("$createdAt")); // Sort by newest first

      // IMPORTANT: Only add category filter if category is provided AND not empty
      if (category && category.trim() !== "") {
        queries.push(Query.equal("categories", category));
      }

      // Only add search query if query is provided AND not empty
      if (query && query.trim() !== "") {
        queries.push(Query.search("name", query));
      }

      // Fetch menu items from the database with all our queries
      const menus = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.menuCollectionId,
        queries, // Pass all query conditions
      );

      console.log(
        "Menus documents:",
        JSON.stringify(menus.documents, null, 2)
      );
      // Return just the documents array (the actual menu items)
      
      return menus.documents;
    } catch (e) {
      throw new Error(e as string);
    }
  },

  getMenuItemById: async ({ itemId }: { itemId: string }) => {
    try {
      const menuItem = await database.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.menuCollectionId,
        itemId,
      );

      return menuItem as unknown as MenuItemtype;
    } catch (e) {
      throw new Error((e as AppwriteException).message);
    }
  },

  getCategories: async () => {
    try {
      const categories = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.categoriesCollectionId,
      );

      return categories.documents;
    } catch (e) {
      throw new Error(e as string);
    }
  },
  signOutUser: async () => {
    try {
      await account.deleteSession({ sessionId: "current" });
    } catch (error) {
      throw new Error((error as AppwriteException).message);
    }
  },
};

// Note you need to eneble the appwrite services in your appwrite dashboard
