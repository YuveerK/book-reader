import React, { useCallback, useEffect, useState, useRef } from "react";
import Pdf from "react-native-pdf";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SQLite from "expo-sqlite";
import { Button, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useFocusEffect } from "@react-navigation/native";

const PdfViewer = ({ route, navigation }) => {
  const { fileUri, book } = route.params;
  const [db, setDb] = useState(null);
  const readingSessionIdRef = useRef(null);
  const pagesReadForSessionRef = useRef(book.pagesRead || 1);

  useEffect(() => {
    (async () => {
      const database = await SQLite.openDatabaseAsync("books.db");
      setDb(database);

      // Ensure the notes table exists
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS notes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          bookId INTEGER,
          content TEXT,
          updatedAt TEXT
        );
      `);

      // Ensure the reading_session table exists
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
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const initializeSession = async () => {
        if (db && isActive) {
          await startReadingSession();
        }
      };

      initializeSession();

      const onBlur = () => {
        endReadingSession();
        navigation.pop(); // Remove the screen from the stack when unfocused
      };

      const unsubscribeBlur = navigation.addListener("blur", onBlur);

      return () => {
        isActive = false;
        endReadingSession();
        unsubscribeBlur(); // Clean up listener
      };
    }, [db])
  );

  const startReadingSession = async () => {
    try {
      if (db) {
        const result = await db.runAsync(
          "INSERT INTO reading_session (bookId, lastReadPage, totalPagesRead, duration, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
          [
            book.id,
            pagesReadForSessionRef.current,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString(),
          ]
        );
        if (result) {
          readingSessionIdRef.current = result.lastInsertRowId;
        }
      }
    } catch (error) {
      console.log("Error in startReadingSession:", error);
    }
  };

  const endReadingSession = async () => {
    try {
      const sessionId = readingSessionIdRef.current;
      if (!sessionId) {
        return;
      }

      const pagesRead = pagesReadForSessionRef.current - book.pagesRead;

      // Update the total pages read for the book
      await db.runAsync("UPDATE books SET pagesRead = ? WHERE id = ?", [
        pagesReadForSessionRef.current,
        book.id,
      ]);

      // Fetch the session's creation time and calculate duration
      const { createdAt } = await db.getFirstAsync(
        "SELECT createdAt FROM reading_session WHERE id = ?",
        [sessionId]
      );
      const duration = new Date() - new Date(createdAt);

      // Update the reading session
      await db.runAsync(
        "UPDATE reading_session SET lastReadPage = ?, totalPagesRead = ?, duration = ?, updatedAt = ? WHERE id = ?",
        [
          pagesReadForSessionRef.current,
          pagesRead,
          duration,
          new Date().toISOString(),
          sessionId,
        ]
      );

      console.log(pagesRead);
    } catch (error) {
      console.log("Error in endReadingSession:", error);
    }
  };

  const updateBook = async (totalPages) => {
    try {
      await db?.runAsync(
        "UPDATE books SET totalPages = ?, updatedAt = ? WHERE id = ?",
        [totalPages, new Date().toISOString(), book.id]
      );
    } catch (error) {
      console.log("Error in updateBook:", error);
    }
  };

  const updateReadPages = (page) => {
    try {
      pagesReadForSessionRef.current = page;
    } catch (error) {
      console.log("Error in updateReadPages:", error);
    }
  };

  const deleteTables = async () => {
    try {
      await db.runAsync("DELETE FROM reading_session"); // Deletes all rows
      await db.runAsync(
        "DELETE FROM sqlite_sequence WHERE name='reading_session';"
      );
      console.log("All reading sessions deleted.");
    } catch (error) {
      console.log("Error in deleteTables:", error);
    }
  };

  const getTables = async () => {
    try {
      const result = await db.getFirstAsync(
        "SELECT * FROM books WHERE id = ?",
        [book.id]
      ); // Fetches book details
      console.log(result);
    } catch (error) {
      console.log("Error in getTables:", error);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#1a1a1a", position: "relative" }}
    >
      <Button title="Delete Sessions" onPress={deleteTables} />
      <Button title="Get book details" onPress={getTables} />
      <Button title="End Reading Session" onPress={endReadingSession} />
      <Pdf
        source={{ uri: fileUri }}
        style={{ flex: 1, backgroundColor: "#000000" }}
        page={book.pagesRead || 1}
        onLoadComplete={(numberOfPages) => updateBook(numberOfPages)}
        onPageChanged={(page) => updateReadPages(page)}
      />

      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          padding: 16,
          borderRadius: 50,
          backgroundColor: "#3B82F6", // Equivalent to bg-blue-500
        }}
        onPress={() => navigation.navigate("Notes Home Screen")}
      >
        <MaterialCommunityIcons name="feather" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PdfViewer;
