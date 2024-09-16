import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { genres } from "../constants/genres.const";
import * as SQLite from "expo-sqlite";
import { useFocusEffect } from "@react-navigation/native";
import Book from "../components/Book";
import Stats from "../components/Stats";

const HomeScreen = ({ navigation }) => {
  const [db, setDb] = useState(null);
  const [books, setBooks] = useState([]);

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
            author TEXT,
            genre TEXT,
            pagesRead INTEGER,
            totalPages INTEGER,
            createdAt TEXT,
            updatedAt TEXT
          );
        `);

        setDb(database);
      } catch (error) {
        console.error("Error initializing database:", error);
      }
    };

    initializeDb();
  }, []);

  // Fetch books whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchBooks();
    }, [db])
  );

  const fetchBooks = async () => {
    try {
      if (db) {
        const books = await db.getAllAsync(
          "SELECT * FROM books order by updatedAt desc;"
        );
        setBooks(books);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 p-4 bg-black">
      <ScrollView>
        <View className="w-full flex-row items-center justify-between">
          <Text className="text-2xl text-white">Welcome Back 👋</Text>
          <View>
            <AntDesign name="search1" size={24} color="white" />
          </View>
        </View>
        <Text className="text-white mt-[30px] text-xl px-4">
          Your Progress (Top 3 Most Recent Books)
        </Text>

        {/* Statistics */}
        <Stats books={books} navigation={navigation} />

        <View className="w-full flex flex-row items-center mt-8 justify-between px-4">
          <Text className="text-white font-bold text-3xl">For You 👀</Text>
          <View>
            <AntDesign name="arrowright" size={24} color="white" />
          </View>
        </View>

        <ScrollView
          horizontal={true}
          contentContainerStyle={{ height: 30, marginTop: 20 }}
          showsHorizontalScrollIndicator={false}
        >
          {genres.map((genre, index) => (
            <TouchableOpacity
              key={index}
              className="w-fit h-fit px-4 flex items-center justify-center rounded-full bg-blue-500 mx-4"
            >
              <Text className="text-white">{genre}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Horizontal scroll for books */}
        <ScrollView
          horizontal={true}
          contentContainerStyle={{
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 20,
          }}
          showsHorizontalScrollIndicator={false}
        >
          {books.map((book) => (
            <View key={book.id} style={{ marginRight: 15 }}>
              <Book book={book} navigation={navigation} />
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
