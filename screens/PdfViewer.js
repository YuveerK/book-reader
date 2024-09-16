import React, { useEffect, useState } from "react";
import Pdf from "react-native-pdf";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SQLite from "expo-sqlite";

const PdfViewer = ({ route }) => {
  const { fileUri, book } = route.params;
  const [db, setDb] = useState(null);

  useEffect(() => {
    (async () => {
      const database = await SQLite.openDatabaseAsync("books.db");
      setDb(database);
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS notes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          bookId INTEGER,
          content TEXT,
          updatedAt TEXT
        );
      `);
    })();
  }, []);

  const updateBook = async (totalPages) => {
    db?.runAsync(
      "UPDATE books SET totalPages = ?, updatedAt = ? WHERE id = ?",
      [totalPages, new Date().toISOString(), book.id]
    );
  };

  const updateReadPages = async (page) => {
    db?.runAsync("UPDATE books SET pagesRead = ?, updatedAt = ? WHERE id = ?", [
      page,
      new Date().toISOString(),
      book.id,
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1a1a1a" }}>
      <Pdf
        source={{ uri: fileUri }}
        style={{ flex: 1 }}
        page={book.pagesRead || 1}
        onLoadComplete={(numberOfPages) => updateBook(numberOfPages)}
        onPageChanged={(page) => updateReadPages(page)}
      />
    </SafeAreaView>
  );
};

export default PdfViewer;
