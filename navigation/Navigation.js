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
import Notes from "../screens/Notes";
import NotesHomeScreen from "../screens/NotesHomeScreen";
import Insights from "../screens/Insights";
import BookInsights from "../screens/BookInsights";

const Navigation = () => {
  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();
  const LibraryStack = createNativeStackNavigator();
  const InsightsStack = createNativeStackNavigator();

  function InsightStackScreen() {
    return (
      <InsightsStack.Navigator screenOptions={{ headerShown: false }}>
        <InsightsStack.Screen name="Insights Screen" component={Insights} />
        <InsightsStack.Screen name="Book Insights" component={BookInsights} />
      </InsightsStack.Navigator>
    );
  }

  function HomeStackScreen() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home Screen" component={HomeScreen} />
        <Stack.Screen name="Pdf Home Screen" component={PdfViewer} />
        <LibraryStack.Screen
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: "black" },
            headerTintColor: "white",
          }}
          name="Notes Home Screen"
          component={NotesHomeScreen}
        />
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
        tabBarActiveTintColor: "#FF8C00", // Dark orange color
        tabBarInactiveTintColor: "white",
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Library") {
            iconName = focused ? "bookshelf" : "bookshelf";
          } else if (route.name === "Insights") {
            iconName = focused ? "google-analytics" : "google-analytics";
          }

          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen name="Library" component={LibraryStackScreen} />
      <Tab.Screen name="Insights" component={InsightStackScreen} />
    </Tab.Navigator>
  );
};

export default Navigation;
