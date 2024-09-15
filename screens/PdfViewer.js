import React, { useEffect, useState } from "react";
import Pdf from "react-native-pdf";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SQLite from "expo-sqlite";
import { Text, TouchableOpacity, View, TextInput, Alert } from "react-native";

const PdfViewer = ({ route }) => {
  const { fileUri, book } = route.params;
  const [db, setDb] = useState(null);
  const [activeTab, setActiveTab] = useState("book"); // 'book' or 'notes'
  const [notes, setNotes] = useState("");

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

  const renderContent = () => {
    if (activeTab === "book") {
      return (
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
      );
    } else if (activeTab === "notes") {
      return (
        <View className="flex-1 bg-[#f5f5f5] p-4">
          <TextInput
            className="flex-1 text-base text-black bg-white rounded-lg p-3"
            multiline
            placeholder="Type your notes here..."
            placeholderTextColor="gray"
            value={notes}
            onChangeText={setNotes}
            textAlignVertical="top"
          />
          <TouchableOpacity
            onPress={saveNotes}
            className="mt-2.5 bg-[#4287f5] py-3 rounded-lg items-center"
          >
            <Text className="text-base font-bold text-white">Save Notes</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1a1a1a]">
      {/* Tab Bar */}
      <View className="flex-row h-12 bg-[#2c2c2c] items-center justify-around">
        <TouchableOpacity
          onPress={() => setActiveTab("book")}
          className={`flex-1 items-center justify-center py-2.5 ${
            activeTab === "book" ? "border-b-[3px] border-b-[#4287f5]" : ""
          }`}
        >
          <Text
            className={`text-base font-bold ${
              activeTab === "book" ? "text-white" : "text-[#ccc]"
            }`}
          >
            View Book
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("notes")}
          className={`flex-1 items-center justify-center py-2.5 ${
            activeTab === "notes" ? "border-b-[3px] border-b-[#4287f5]" : ""
          }`}
        >
          <Text
            className={`text-base font-bold ${
              activeTab === "notes" ? "text-white" : "text-[#ccc]"
            }`}
          >
            Notes
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {renderContent()}
    </SafeAreaView>
  );
};

export default PdfViewer;
