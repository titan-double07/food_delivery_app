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

## Auth Screen

- in layout instead of <SafeAreaView> will make use of a <KeyboardAvoidingView> to avoid the keyboard from covering the input fields.

- to be able to add a device specific behaviour to a component you can set the behaviour prop making use of Platform.OS.

```jsx
// create auth layout
<KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === "ios" ? "padding" : "height"} // this was added due to a different behaviour in android vs ios , where we have to add a padding on ios devices to push the conent up, while we need to add height on android
  keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
>
  <ScrollView
  keyboardShouldPersistTaps="handled" // this is used dismiss the keyboard when the user taps outside the input fields
  >
  <View className="w-full relative"
  style={
   height: Dimensions.get("screen").height // this is used to set the height of the view to the height of the screen
  }
  >
  <ImageBackground source={images.loginGrapic} resizeMode="cover">
  <Image source={images.logo} resizeMode="contain" className="absolute top-20 left-1/2 -translate-x-1/2" />
 
  </View>
<Slot />

  </ScrollView>
</KeyboardAvoidingView>
```

-create the reuseable CustomInput component, That takes the props for placeholder, value, onChangeText, label, secureTextEntry and keyboardType (create type prop; this can be gotten from the type.d.ts file from Tutorial assets)
? can we automatically import the TextInput types from react-native to make the code more readable?

```jsx
export default function CustomInput({ placeholder, value, onChangeText, label, secureTextEntry, keyboardType }: CustomInputProps) {

  const [isFocused, setIsFocused] = useState(false); // this is used to check if the input field is focused

  return(
    <View className="w-full">
      <Text className="text-gray-400 mb-2">{label}</Text>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        placeholderTextColor="#888"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}  // this is used to check if the input field is focused
        className={cn(`input`,
          isFocused ? "border-blue-500" : "border-gray-300"
        )}

      />
    </View>
  )
}

```

- create the reuseable CustomButton component, That takes the props for text, onPress, title, style, leftIcon, textStyle, isLoading (create type prop; this can be gotten from the type.d.ts file from Tutorial assets)
```jsx
export default function CustomButton({ onPress, title, style, leftIcon, textStyle, isLoading }: CustomButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={cn("custom-btn", style)}
      disabled={isLoading}
    >
      {leftIcon}

      <View className="flex-1">
      {
        isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ):
      <Text className={cn("text-white-100 paragraph-semibold", textStyle)}>
      {title}
      </Text>
      }
      </View>
    </TouchableOpacity>
  );
}
```

- create sign in page
  - create state for isSubmitting and form (email, password)
  - create a function that handles the form submission, it would show an Alert if the form is invalid
  - create a function that handles the form validation

```jsx


```