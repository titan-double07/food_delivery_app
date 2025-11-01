// contains all appwrite configurations

import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";
import { CreateUserParams, GetMenuParams } from "@/type";

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
      throw new Error(error as string);
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
      throw new Error(error as string);
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
      throw new Error(error as string);
    }
  },

  getMenu: async ({ category, query }: GetMenuParams) => {
    try {
      const queries: string[] = [];
      // if there is category add it to the query array
      if (category) queries.push(Query.equal("categories", category));

      // if there is query add it to the query array
      if (query) queries.push(Query.search("name", query));

      // get the menu from the database
      const menus = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.menuCollectionId,
        queries,
      );

      return menus.documents;
    } catch (e) {
      throw new Error(e as string);
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
      throw new Error(error as string);
    }
  },
};

// Note you need to eneble the appwrite services in your appwrite dashboard
