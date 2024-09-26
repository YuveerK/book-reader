import React, { useEffect, useState, useCallback } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  Dimensions,
  Button,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import * as SQLite from "expo-sqlite";
import { useFocusEffect } from "@react-navigation/native";
import { genres } from "../constants/genres.const";
import GenreCard from "../components/GenreCard";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
const Library = ({ navigation }) => {
  const [db, setDb] = useState(null);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isFilterOpened, setIsFilterOpened] = useState(false);

  const cardWidth = Dimensions.get("window").width / 2 - 24;
  const imageHeight = (cardWidth * 3) / 2;

  useEffect(() => {
    const initializeDb = async () => {
      try {
        const database = await SQLite.openDatabaseAsync("books.db");

        // Create the 'books' table if it doesn't exist
        await database.execAsync(`
          CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            bookCover TEXT,
            bookUri TEXT,
            bookSize INTEGER,
            bookName TEXT,
            author,
            genre,
            pagesRead INTEGER,
            totalPages INTEGER,
            createdAt TEXT,
            updatedAt TEXT
          );
        `);

        setDb(database);
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing database:", error);
      }
    };

    initializeDb();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchBooks();

      return () => {
        isActive = false;
      };
    }, [db])
  );

  const fetchBooks = async () => {
    try {
      let isActive = true;
      if (db && isActive) {
        const books = await db.getAllAsync("SELECT * FROM books;");
        setBooks(books);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center">
        <Text className="text-white">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <Text className="text-white text-3xl font-bold text-center mt-6 mb-4">
        Your Library 📚
      </Text>
      <View className="px-2 mb-4 flex-row items-center justify-between">
        <View className="flex flex-row rounded-md items-center flex-1 px-4 py-2 border border-gray-500">
          <AntDesign name="search1" size={24} color="white" />
          <TextInput
            onChangeText={setSearch}
            value={search}
            placeholderTextColor={"white"}
            placeholder="Search Your Library"
            className="ml-2 flex-1" // Make the TextInput expand to fill the remaining space
          />
        </View>
        <TouchableOpacity
          onPress={() => setIsFilterOpened(true)}
          className="ml-2 border border-gray-500 px-4 py-2 rounded-md"
        >
          <Ionicons name="filter" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
      >
        <ScrollView
          horizontal={true}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        >
          {genres.map((genre, index) => (
            <GenreCard genre={genre.genre} imageUrl={genre.image} key={index} />
          ))}
        </ScrollView>
        {books.length === 0 ? (
          <View className="flex-1 items-center justify-center mt-20">
            <Image
              source={require("../assets/no.png")}
              className="w-40 h-40 mb-6"
            />
            <Text className="text-gray-400 text-lg">
              Your library is empty. Start adding books!
            </Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap justify-between">
            {books.map((book) => (
              <View key={book.id} className="mb-6" style={{ width: cardWidth }}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Pdf Screen", {
                      fileUri: book.bookUri,
                      book: book,
                    })
                  }
                  className="shadow-lg"
                >
                  <Image
                    source={
                      book.bookCover
                        ? { uri: book.bookCover }
                        : require("../assets/no.png")
                    }
                    className="rounded-lg"
                    style={{
                      width: "100%",
                      height: imageHeight,
                      resizeMode: "cover",
                    }}
                  />
                </TouchableOpacity>

                <View className="mt-2 px-1">
                  <Text
                    className="text-white text-base font-semibold"
                    numberOfLines={1}
                  >
                    {book.bookName}
                  </Text>
                  <Text className="text-gray-400 text-sm">
                    Added on: {new Date(book.createdAt).toLocaleDateString()}
                  </Text>
                  {book.totalPages && (
                    <Text className="text-gray-400 text-sm">
                      Page {book.pagesRead}/{book.totalPages}
                    </Text>
                  )}
                </View>

                {/* Edit Button */}
                <TouchableOpacity
                  onPress={() => navigation.navigate("Edit Book", { book })}
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    backgroundColor: "rgba(0,0,0,0.6)",
                    borderRadius: 20,
                    padding: 6,
                  }}
                >
                  <FontAwesome6 name="edit" size={18} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add Book Floating Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Add Book")}
        className="absolute bottom-6 right-6 bg-blue-600 p-4 rounded-full items-center justify-center shadow-lg"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <FontAwesome6 name="plus" size={24} color="white" />
      </TouchableOpacity>
      {isFilterOpened && (
        <View
          className="absolute top-0 left-0 w-full flex items-center justify-center bg-black/70"
          style={{ height: Dimensions.get("screen").height }}
        >
          <View
            className="bg-gray-900"
            style={{
              width: Dimensions.get("screen").width,
              height: Dimensions.get("screen").height / 2,
              padding: 15,
              position: "relative",
            }}
          >
            <Text className="text-center text-white text-2xl">
              Filter Your Books 🛜
            </Text>

            <TouchableOpacity
              className="absolute top-[13px] right-[13px]"
              onPress={() => setIsFilterOpened(false)}
            >
              <AntDesign name="closecircleo" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Library;
