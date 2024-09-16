import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import PdfViewer from "../screens/PdfViewer";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Library from "../screens/Library";
import AddBook from "../screens/AddBook";
import EditBook from "../screens/EditBook";

const Navigation = () => {
  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();
  const LibraryStack = createNativeStackNavigator();
  function HomeStackScreen() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home Screen" component={HomeScreen} />
        <Stack.Screen name="Pdf Home Screen" component={PdfViewer} />
      </Stack.Navigator>
    );
  }

  function LibraryStackScreen() {
    return (
      <LibraryStack.Navigator screenOptions={{ headerShown: false }}>
        <LibraryStack.Screen name="Library Page" component={Library} />
        <LibraryStack.Screen name="Pdf Screen" component={PdfViewer} />
        <LibraryStack.Screen name="Add Book" component={AddBook} />
        <LibraryStack.Screen name="Edit Book" component={EditBook} />
      </LibraryStack.Navigator>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: "black",
          padding: 10,
          paddingBottom: 5,
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Library") {
            iconName = focused ? "bookshelf" : "bookshelf";
          }

          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen name="Library" component={LibraryStackScreen} />
    </Tab.Navigator>
  );
};

export default Navigation;
