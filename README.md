# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.



## Tab Navigation

AIM: to create a bottom tab navigation with 4 tabs (home, search, cart, profile)

- To crete the tabs navigation
  - use the Tabs.Screen component from expo-router, and include the props
    - name : string
    - options : object
      - title : string
      - tabBarIcon : ({color, size}) => React.ReactNode (Crete a custom TabBarIcon component that takes in focused, icon, title )
      used the focused state to set tint color;
      render the icon using image component and the title using text component
Caveat: the tabs would display both custom component (icon and title) but the default text would still be there
  - to remove the default text use in the <Tabs> component set the screenOptions = {{tabBarShowLabel: false, headerShown: false }}

- to style the tab bar
  - use the screenOptions prop in the <Tabs> component
  - set the tabBarStyle : {position: 'absolute', bottom: 10, left: 10, right: 10, elevation: 0, backgroundColor: 'white', borderRadius: 15, height: 60, ...styles.shadow}
  - create a shadow style in a styles object
 

```tsx
//in the (tabs) _layout.tsx folder 
<Tabs>

</Tabs>

```

## Database Architecture 

- when thinking/designing the database architecture, think in terms of a real restaurant or how similar apps work, think of the entities and their relationships, for example in a food delivery app, you would have the following entities
  - users
  - restaurants
  - menu items
  - orders
  - reviews
  - categories
  - cart
  - payments

- in Appwrite dashboard, databases (allow permissions for USers) and add each collections id to the config file in lib folder
  - create a new collection for categories, fields: 
    - name (string,size:100, required: true), description (string, size: 500, required: false)

  - create a new collection for menu, fields:
    - name (string,size:100, required: true), 
    description (string, size: 2000, required: truee), 
    imageUrl (URL, required: false), 
    price (float, min: 1, max: 10000, required: true), 
    rating (float, min: 1, max: 5 , required: true), 
    calories (integer, min: 1, max: 1000, required: true),
    protein (integer, min: 1, max: 1000, required: true),
    - we then need to create a two way relationship between menu and categories, the relation would be many to one,ie menu can belong to one category, but a category can have many menu items

  - Since most food items come with optional choices like extra cheese, fries, coke etc, we need to create a new collection for customizations, fields:
    - name (type:string,size:100, required: true),
    price (float, min: 1, max: 10000, required: true),
    type (enum, options: ['topping', 'side', 'drink', 'sauce'], required: true)

  - We now have to take note of the relationship between menu and customizations, the relationship would be many to many, ie a menu item can have many customizations, and a customization can belong to many menu items
    - to achieve this we would create a new collection called menu_customizations that will contain a pair of references , fields:
      - 2 way relationship btw menu and menu_customizations (many to one, ie a menu can have many menu_customizations, but a menu_customization belongs to one menu item)
      - 2 way relationship btw customizations and menu_customizations (one to many, ie a customization can have many menu_customizations, but a menu_customization belongs to one customization)


## Seeding A Database

 when setting up a new project, it is important to have some data in the database to test the app, this is where seeding a database comes in handy, seeding a database is the process of adding initial data to the database, this can be done manually by adding data to the database via the appwrite dashboard, or programmatically by writing a script that adds data to the database 

#### From video
- create a new file called data.ts in the lib folder, to contain the seed data (dummy data)
- create a new file called seed.ts in the lib folder, to contain the seeding logic (check tool kit )
  -  the seed file would be interating with the appwrite store to upload the images, so we need to add the definition for the storage in the appwrite file in lib folder (new Storage(client))


# Search Screen
AIM: to deevelop the search screen and display the search results

First we want to write a function to get all the menu items with a search by text and filter by category.

- to do that with Appwrite, we would need to specify the kind of search you want to do, Either it's a full text or its unique ie INDEXING

In Appwrite dashboard => menu collection => indexes => create index
- name it index_1 => type: full_text => field: name in asc

in the appwrite file in lib folder, create a new function getMenu

```tsx

export const getMenu = async ({ category, query }: GetMenuParams) => {
    try {
        const queries: string[] = [];

        if(category) queries.push(Query.equal('categories', category));
        if(query) queries.push(Query.search('name', query));

        const menus = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.menuCollectionId,
            queries,
        )

        return menus.documents;
    } catch (e) {
        throw new Error(e as string);
    }
}


export const getCategories = async () => {
    try {
        const categories = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.categoriesCollectionId,
        )

        return categories.documents;
    } catch (e) {
        throw new Error(e as string);
    }
}
```

- we can then create a reuseable function we'll use to call these functions, useAppWrite.tsx (refer to the github repo for the full code)
```tsx
const {data , isLoading, error, refetch} = useAppWrite(
  {
    fn: getMenu,
    params: {category: "", query: "", limit:6 }

  }
)

```

In the search file, 
- fetch menu and categories using the useAppWrite hook, for the categories fetch we wouldnt need any params ( it doesnt aceept any)
 - to get the query or category we make use of useLocalSearchParams from expo-router
 - also define a useEffect that would call the refetch function whenever the query or category changes

Now the UI 

- we'll make use of a flat list
  - rendeItem to render each menu item (MenuCard component)
  - ListHeaderComponent to render the header (search bar and categories)
  - numColumns to  set the number of columns 
  - columnWrapperStyle / className to style the columns
  - contentContainerStyle / className to style the content container

to get the staggered list effect, we would use the index of the item to determine the marginTop of the item
  - if the index is even, we set the marginTop to  0, if the index is odd, we set the marginTop to 20

- create a MenuCard component with the prop type MenuItem
  - to read images from appwrite, we need the image_url and the projectId i.e 
 ```tsx
const imageUrl = `${menu.imageUrl}?project=${appwriteConfig.projectId}`;

  ```

## Search and Filter Functionality

### Filter functionality
The way it works is that,
when the user clicks on a category, its "id" is added to the url as a search param,
which will be read by the search screen to filter the menu items by category

- to get access to the search params, we would use the useLocalSearchParams hook from expo-router

```tsx
const { category: selectedCategory } = useLocalSearchParams();
const [active, setActive] = useState<string | null>(selectedCategory ? String(selectedCategory) : "");

```
 - format your category filter implementation to use the flatlist component instead of a scrollview ( why? )
 - create a handlePress function that would set the active category and update the url with the selected category as a search param
```tsx
const handlePress = (categoryId: string) => {
    // const newCategory = active === categoryId ? "" : categoryId;
    // setActive(newCategory);

    // router.replace({
    //     pathname: "/search",
    //     params: { category: newCategory },
    // });
    setActive(categoryId);
    if (id==="all"){
      router.setParams({ category: undefined });
    }else{
      router.searchParams({ category: categoryId });
    }
};
```

### Search functionality

- create a handleSearch function that would set the search query and update the url with the search query as a search param, making sure to debounce the function to avoid multiple calls while the user is typing ,
  - also trim the query to remove any extra spaces
```tsx
const handleSearch = (query: string) => {
    setSearchQuery(query);
    router.searchParams({ query });
};
```
note: adding the prop returnKeytype="search" to the TextInput component would change the return key on the keyboard to a search icon
- the `onSubmitEditing` prop would be called when the user presses the search icon on the keyboard


## Cart Store

- you'll find the cart.store.ts file in the tutorial resources,add it to the stores folder in your project.
It contains:
- areCustomizationEqual funtion: to compare two customizations arrays are identical by comparing their ids
- cart store state by zustand using create()
  - addItems
  - removeItem
  - clearCart
  - increaseQty
  - decreaseQty
  - getTotalItems
  - getTotalPrice
  
## Cart Screen

 ```tsx
  import { useCartStore } from '../../stores/cart.store';

  const cartItems = useCartStore((state) => state.cartItems);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  <SafeAreaView className="bg-white flex-1">
   
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CartItemCard item={item} />}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center mt-20">
            <Text className="text-gray-500 text-lg">Your cart is empty</Text>
          </View>
        )}
        ListHeaderComponent={() => (
          
        )}
        ListFooterComponent={() => (
          <View className="p-4">
            <Text className="text-gray-500 text-lg">Payment summary</Text>
            {create reusable component for summary row (label and value)}
          </View>
        )}
      />
   
  </SafeAreaView>
 ```
- implement the add to cart functionality in the menu card component
- implement the total cart items count in the tab bar icon component

<!-- #TODO:
Left over UI from figma design
- Login Successfull drawer
- Empty State for Search Screen
- Menu Item Details Screen

Functionality and UX 
- loading states
- error handling and displaying error messages in Auth screens, orders, edit profile ( any screen that makes api calls )
- light and dark mode support

- Cart Screen:
  - Account for delivery fees and discount in the payment summary, likely in the database architecture
  - Add a "Clear Cart" button to the cart screen
  - Payment Integration (Stripe, PayPal, etc)

- Profile Screen:
  - Edit Profile functionality
  - Order History Screen
  - Wishlist/Favorites functionality


 -->
 