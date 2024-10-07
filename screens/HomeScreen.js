import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { genres } from "../constants/genres.const";
import * as SQLite from "expo-sqlite";
import { useFocusEffect } from "@react-navigation/native";
import Book from "../components/Book";
import Stats from "../components/Stats";
import Ionicons from "@expo/vector-icons/Ionicons";
const HomeScreen = ({ navigation }) => {
  const [db, setDb] = useState(null);
  const [books, setBooks] = useState([]);
  const [genre, setGenre] = useState("All");
  const [loading, setLoading] = useState(false);

  // Initialize the database and create the 'books' table
  useEffect(() => {
    const initializeDb = async () => {
      try {
        setLoading(true);
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
            isComplete INTEGER,
            pagesRead INTEGER,
            totalPages INTEGER,
            createdAt TEXT,
            updatedAt TEXT
          );
        `);

        console.log("creating reading session table");
        await database.execAsync(`
          CREATE TABLE IF NOT EXISTS reading_session (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            bookId INTEGER,
            lastReadPage INTEGER,
            totalPagesRead INTEGER,
            duration INTEGER,  
            createdAt TEXT,
            updatedAt TEXT
          );
        `);
        console.log("created reading session table");
        setDb(database);
        setLoading(false);
      } catch (error) {
        console.error("Error initializing database:", error);
        setLoading(false);
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

  const deleteTables = async () => {
    try {
      if (db) {
        // await db.execAsync("delete from books");
        // await db.execAsync("delete from reading_sessions");
        await db.execAsync("drop table reading_session");
        await db.execAsync("drop table books");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SafeAreaView className="flex-1 p-4 bg-black">
      {loading && (
        <View className=" flex-1 items-center justify-center">
          <ActivityIndicator size={60} color={"darkorange"} />
        </View>
      )}

      {books && books.length > 0 && (
        <ScrollView>
          <Button title="delete" onPress={deleteTables} />
          <View className="w-full flex-row items-center justify-center">
            <Text className="text-2xl text-white">Welcome Back 👋</Text>
          </View>
          <Text className="text-white mt-[30px] text-xl px-4">
            Jump Right Back In! 😁
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
                onPress={() => setGenre(genre.genre)}
              >
                <Text className="text-white">{genre.genre}</Text>
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
            {books
              .filter((book) => {
                // If the genre is "All", return all books
                if (genre === "All") return true;
                // Otherwise, filter books by the selected genre
                return book.genre.includes(genre);
              })
              .map((book) => (
                <View key={book.id} style={{ marginRight: 15 }}>
                  <Book book={book} navigation={navigation} />
                </View>
              ))}
          </ScrollView>
        </ScrollView>
      )}

      {books.length === 0 && !loading && (
        <View className="flex-1 items-center justify-center">
          <Ionicons name="library-outline" size={180} color="darkorange" />
          <Text className="text-2xl mt-8  text-center text-white">
            Get started by adding some books to your library! 📖📚
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;
