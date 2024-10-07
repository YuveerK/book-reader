// In App.js in a new project
import * as React from "react";
import { View, Text, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import Navigation from "./navigation/Navigation";

const Tab = createBottomTabNavigator();

function App() {
  const [fontsLoaded] = useFonts({
    "DancingScript-Bold": require("./assets/fonts/DancingScript-Bold.ttf"),
    "DancingScript-Medium": require("./assets/fonts/DancingScript-Medium.ttf"),
    "DancingScript-Regular": require("./assets/fonts/DancingScript-Regular.ttf"),
    "DancingScript-SemiBold": require("./assets/fonts/DancingScript-SemiBold.ttf"),
    "CormorantGaramond-Bold": require("./assets/fonts/Cormorant_Garamond/CormorantGaramond-Bold.ttf"),
    "CormorantGaramond-BoldItalic": require("./assets/fonts/Cormorant_Garamond/CormorantGaramond-BoldItalic.ttf"),
    "CormorantGaramond-Italic": require("./assets/fonts/Cormorant_Garamond/CormorantGaramond-Italic.ttf"),
    "CormorantGaramond-Light": require("./assets/fonts/Cormorant_Garamond/CormorantGaramond-Light.ttf"),
    "CormorantGaramond-LightItalic": require("./assets/fonts/Cormorant_Garamond/CormorantGaramond-LightItalic.ttf"),
    "CormorantGaramond-Medium": require("./assets/fonts/Cormorant_Garamond/CormorantGaramond-Medium.ttf"),
    "CormorantGaramond-MediumItalic": require("./assets/fonts/Cormorant_Garamond/CormorantGaramond-MediumItalic.ttf"),
    "CormorantGaramond-Regular": require("./assets/fonts/Cormorant_Garamond/CormorantGaramond-Regular.ttf"),
    "CormorantGaramond-SemiBold": require("./assets/fonts/Cormorant_Garamond/CormorantGaramond-SemiBold.ttf"),
    "CormorantGaramond-SemiBoldItalic": require("./assets/fonts/Cormorant_Garamond/CormorantGaramond-SemiBoldItalic.ttf"),
  });

  // Prevent the splash screen from hiding until fonts are loaded
  useEffect(() => {
    async function prepare() {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, [fontsLoaded]);

  // If fonts are not loaded, don't render anything yet
  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle={"light-content"} />
      <Navigation />
    </NavigationContainer>
  );
}

export default App;
