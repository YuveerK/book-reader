import React, { useEffect, useState, useCallback } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import * as SQLite from "expo-sqlite";
import { useFocusEffect } from "@react-navigation/native";

const Library = ({ navigation }) => {
  const [db, setDb] = useState(null);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize the database and create the 'books' table
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

  // Fetch books whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchBooks = async () => {
        try {
          if (db && isActive) {
            const books = await db.getAllAsync("SELECT * FROM books;");
            setBooks(books);
          }
        } catch (error) {
          console.error("Error fetching books:", error);
        }
      };

      fetchBooks();

      return () => {
        isActive = false;
      };
    }, [db])
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center">
        <Text className="text-white">Loading...</Text>
      </SafeAreaView>
    );
  }

  // Calculate card width and image height based on aspect ratio
  const cardWidth = Dimensions.get("window").width / 2 - 24;
  const imageHeight = (cardWidth * 3) / 2; // Height adjusted for 2:3 aspect ratio

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <Text className="text-white text-3xl font-bold text-center mt-6 mb-4">
        Your Library 📚
      </Text>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
      >
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
    </SafeAreaView>
  );
};

export default Library;
