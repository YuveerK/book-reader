import React, { useEffect, useState } from "react";
import Pdf from "react-native-pdf";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SQLite from "expo-sqlite";
import { Text, TouchableOpacity, View, TextInput, Alert } from "react-native";

const PdfViewer = ({ route }) => {
  const { fileUri, book } = route.params;
  const [db, setDb] = useState(null);

  useEffect(() => {
    initializeDb();
  }, []);

  const initializeDb = async () => {
    const database = await SQLite.openDatabaseAsync("books.db");
    setDb(database);

    // Create notes table if it doesn't exist
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bookId INTEGER,
        content TEXT,
        updatedAt TEXT
      );
    `);

    // Load existing notes for this book if they exist
    try {
      const results = await database.getAllAsync(
        "SELECT * FROM notes WHERE bookId = ?;",
        [book.id]
      );
      if (results.length > 0) {
        setNotes(results[0].content);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const updateBook = async (totalPages) => {
    if (!db) return;
    await db.runAsync(
      "UPDATE books SET totalPages = ?, updatedAt = ? WHERE id = ?",
      [totalPages, new Date().toISOString(), book.id]
    );
  };

  const updateReadPages = async (currentPage) => {
    if (!db) return;
    try {
      await db.runAsync(
        "UPDATE books SET pagesRead = ?, updatedAt = ? WHERE id = ?",
        [currentPage, new Date().toISOString(), book.id]
      );
    } catch (error) {
      console.log(error);
    }
  };

  const saveNotes = async () => {
    if (!db) return;
    try {
      await db.runAsync(
        "INSERT OR REPLACE INTO notes (bookId, content, updatedAt) VALUES (?, ?, ?);",
        [book.id, notes, new Date().toISOString()]
      );
      Alert.alert("Success", "Notes saved successfully!");
    } catch (error) {
      console.error("Error saving notes:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1a1a1a]">
      <Pdf
        source={{ uri: fileUri }}
        className="flex-1"
        page={book.pagesRead || 1} // Set the initial page here
        onLoadComplete={(numberOfPages, filePath) => {
          updateBook(numberOfPages);
        }}
        onPageChanged={(page) => {
          updateReadPages(page);
        }}
      />
    </SafeAreaView>
  );
};

export default PdfViewer;
