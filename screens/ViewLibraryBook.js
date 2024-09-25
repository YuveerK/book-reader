import React, { useEffect, useState } from "react";
import Pdf from "react-native-pdf";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SQLite from "expo-sqlite";
import { TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const PdfViewer = ({ route, navigation }) => {
  const { fileUri, book } = route.params;
  const [db, setDb] = useState(null);
  const [startingPage, setStartingPage] = useState(book.pagesRead || 1); // Track the starting page
  const [currentPage, setCurrentPage] = useState(book.pagesRead || 1); // Track current page during reading
  const [sessionStartTime, setSessionStartTime] = useState(null); // Track the time reading started

  useEffect(() => {
    (async () => {
      const database = await SQLite.openDatabaseAsync("books.db");
      setDb(database);

      // Create the reading_sessions table if it doesn't exist
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS reading_sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          bookId INTEGER,
          pagesRead INTEGER,
          sessionPages INTEGER,
          dateRead TEXT,
          FOREIGN KEY(bookId) REFERENCES books(id)
        );
      `);

      // Set the session start time and starting page when the PDF is loaded
      setSessionStartTime(new Date());
      setStartingPage(book.pagesRead || 1);
    })();

    // Cleanup function to update the session when the user navigates away or the component unmounts
    return () => {
      if (sessionStartTime && currentPage !== startingPage) {
        logReadingSession();
      }
    };
  }, []);

  // Function to update the total pages of the book
  const updateBook = async (totalPages) => {
    db?.runAsync(
      "UPDATE books SET totalPages = ?, updatedAt = ? WHERE id = ?",
      [totalPages, new Date().toISOString(), book.id]
    );
  };

  // Function to update the current page read in the book
  const updateReadPages = async (page) => {
    setCurrentPage(page); // Update current page for tracking
    db?.runAsync("UPDATE books SET pagesRead = ?, updatedAt = ? WHERE id = ?", [
      page,
      new Date().toISOString(),
      book.id,
    ]);
  };

  // Function to log the reading session
  const logReadingSession = async () => {
    const pagesReadInSession = currentPage - startingPage; // Calculate pages read during the session
    const dateRead = new Date().toISOString().split("T")[0]; // Date format 'YYYY-MM-DD'

    if (pagesReadInSession > 0) {
      // Log the reading session in the reading_sessions table
      db?.runAsync(
        "INSERT INTO reading_sessions (bookId, pagesRead, sessionPages, dateRead) VALUES (?, ?, ?, ?)",
        [book.id, currentPage, pagesReadInSession, dateRead]
      );
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#1a1a1a", position: "relative" }}
    >
      <Pdf
        source={{ uri: fileUri }}
        style={{ flex: 1, backgroundColor: "#000000" }}
        page={startingPage}
        onLoadComplete={(numberOfPages) => updateBook(numberOfPages)}
        onPageChanged={(page) => updateReadPages(page)}
      />

      <TouchableOpacity
        className="absolute bottom-6 right-6 p-4 rounded-full bg-blue-500"
        onPress={() => navigation.navigate("Notes")}
      >
        <MaterialCommunityIcons name="feather" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PdfViewer;
