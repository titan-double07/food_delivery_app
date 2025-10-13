import { ID } from "react-native-appwrite";
import { appwriteConfig,  database,  storage } from "./appwrite";
import dummyData from "./data";

interface Category {
  name: string;
  description: string;
}

interface Customization {
  name: string;
  price: number;
  type: "topping" | "side" | "drink" | "crust" | string; // extend as needed
}

interface MenuItem {
  name: string;
  description: string;
  image_url: string;
  price: number;
  rating: number;
  calories: number;
  protein: number;
  category_name: string;
  customizations: string[]; // list of customization names
}

interface DummyData {
  categories: Category[];
  customizations: Customization[];
  menu: MenuItem[];
}

// ensure dummyData has correct shape
const data = dummyData as DummyData;

async function clearAll(collectionId: string): Promise<void> {
  const list = await database.listDocuments(
    appwriteConfig.databaseId,
    collectionId,
  );

  await Promise.all(
    list.documents.map((doc) =>
      database.deleteDocument(
        appwriteConfig.databaseId,
        collectionId,
        doc.$id,
      ),
    ),
  );
}

async function clearStorage(): Promise<void> {
  const list = await storage.listFiles(appwriteConfig.bucketId);

  await Promise.all(
    list.files.map((file) =>
      storage.deleteFile(appwriteConfig.bucketId, file.$id),
    ),
  );
}

async function uploadImageToStorage(imageUrl: string) {
  console.log('uploading images...', imageUrl);
try {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  console.log("🚀 ~ uploadImageToStorage ~ blob:", blob)

  // const fileObj = {
  //   name: imageUrl.split("/").pop() || `file-${Date.now()}.jpg`,
  //   type: "image/png",
  //   size: blob.size,
  //   uri: imageUrl,
  // };

    const fileObj = {
    name: imageUrl.split("/").pop() || `file-${Date.now()}.jpg`,
    type: "image/png", 
    size: blob.size,
    uri: imageUrl,
  };

  const file = await storage.createFile({
    bucketId: appwriteConfig.bucketId,
    fileId: ID.unique(),
    file: fileObj,
  });
  
  // (
  //   appwriteConfig.bucketId,
  //   ID.unique(),
  //   fileObj,
  // );

  return storage.getFileViewURL(appwriteConfig.bucketId, file.$id);
} catch (error: any) {
  console.error("Error uploading image:", error.message);
  // Handle the error appropriately (e.g., display an error message)
  throw error; // Re-throw the error to prevent seeding from continuing
}
}

async function seed(): Promise<void> {
  console.log("seeding data...");
  // 1. Clear all
  await clearAll(appwriteConfig.categoriesCollectionId);
  await clearAll(appwriteConfig.customizationsCollectionId);
  await clearAll(appwriteConfig.menuCollectionId);
  await clearAll(appwriteConfig.menuCustomizationsCollectionId);
  await clearStorage();

  // 2. Create Categories
  const categoryMap: Record<string, string> = {};
  for (const cat of data.categories) {
    const doc = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.categoriesCollectionId,
      ID.unique(),
      cat,
    );
    categoryMap[cat.name] = doc.$id;
  }

  // 3. Create Customizations
  const customizationMap: Record<string, string> = {};
  for (const cus of data.customizations) {
    const doc = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.customizationsCollectionId,
      ID.unique(),
      {
        name: cus.name,
        price: cus.price,
        type: cus.type,
      },
    );
    customizationMap[cus.name] = doc.$id;
  }

  // 4. Create Menu Items
  const menuMap: Record<string, string> = {};
  for (const item of data.menu) {
    const uploadedImage = await uploadImageToStorage(item.image_url);

    const doc = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.menuCollectionId,
      ID.unique(),
      {
        name: item.name,
        description: item.description,
        image_url: uploadedImage,
        price: item.price,
        rating: item.rating,
        calories: item.calories,
        protein: item.protein,
        categories: categoryMap[item.category_name],
      },
    );

    menuMap[item.name] = doc.$id;

    // 5. Create menu_customizations
    for (const cusName of item.customizations) {
      await database.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.menuCustomizationsCollectionId,
        ID.unique(),
        {
          menu: doc.$id,
          customizations: customizationMap[cusName],
        },
      );
    }
  }

  console.log("✅ Seeding complete.");
}

export default seed;
