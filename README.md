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

### Home page

## Body

To implement any screen we need to wrap our screen with SafeAreaView from react-native-safe-area-context. this will help us to avoid the notches and status bar in our screen.

```js
import { SafeAreaView } from "react-native-safe-area-context";
<SafeAreaView></SafeAreaView>;
```

To efficiently render large lists of data, we use FlatList from react-native. It only renders the items that are currently visible on the screen, improving performance and reducing memory usage. simiar to the map function in javascript

```js
// reder the list of  food offers
import { FlatList } from "react-native";
import offers from "constants/offers";
<FlatList
  data={offers}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    // Render each item here
    <Text>{item.title}</Text>
  )}
  contentContainerClassName="" 
  ListHeaderComponent=""
  
  />
```

To make any component pressable or clickable we use Pressable from react-native. it provides a way to handle touch interactions and can be styled to provide visual feedback when pressed.

```js
import { Pressable, View } from "react-native";
<View>
  <Pressable 
  className="offer-card" 
  style={{ backgroundColor: item.color }}
  android_ripple={{ color: item.color }} // this is for android, to add ripple effect on press 
  >
   {
      ({ pressed }) => ( //dynamic styling based on press state???
         <>
         <View>

         </View>
         </>
      )
   }
  </Pressable>
</View>;
'offer-card__info' // for card text
```
questions:
- can we use the cn utility class in react native?, so that we can merge multiple class names into a single string.

## Header
 ```js
 'small-bold' // for small text (dropdown text)
 <TouchableOpacity>
 <Image 
 source={image.arrowDown}
 resizeMode='contain'// it resizes the image to fit the container, Q: can the tailwind class be used here?
   />
 </TouchableOpacity> // this is a button (dropdown button)
 <Cart/> // create a cart component 
 ```
 ### cart component
 ```js

 <TouchableOpacity 
 className="cart-btn" 
 onPress={() => navigation.navigate('Cart')} // Q: why not use Pressable here?, 
 >
 <Image 
 source={image.cart}
 resizeMode='contain'// it resizes the image to fit the container, Q: can the tailwind class be used here?
   />
   <View className="cart-badge"/>
 </TouchableOpacity>
 ```

 Note: 
 -  if you wish to add horizontal or vertical scrolls you MUST explicitly wrap the content inside a ScrollView or FlatList component.

 - you cannot/should not wrap a FlatList inside a ScrollView component, as the FlatList handles its own scrolling and the ScrollView would override it. instead you can add a ListHeader property to the FlatList to add a header to the list.

 ## Bootom Nav

 ### Routing
 - set up the routes for the bottom navigation bar and authentication (login, signup, forgot password)

 - make use of expo's Shared Route feature to group / share routes with similar layouts 
 (auth)
 - _layout
 - login
 - signup

 (tabs)
 - _layout: <Slot/> //  this is the layout for the tabs
 - cart
 - profile
 - search 






  