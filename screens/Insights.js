import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";
import { useFocusEffect } from "@react-navigation/native";

const Insights = () => {
  const [db, setDb] = useState(null);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    initializeDb();
  }, []);

  const initializeDb = async () => {
    const database = await SQLite.openDatabaseAsync("books.db");
    setDb(database);
  };

  const fetchInsights = async () => {
    try {
      const result = await db.getAllAsync(
        `SELECT rs.*, b.bookName AS bookTitle 
         FROM reading_session rs
         INNER JOIN books b ON rs.bookId = b.id`
      );

      console.log(result);

      //   // Calculate total pages read and total duration
      //   let totalPagesRead = 0;
      //   let totalDuration = 0;

      //   result.forEach((session) => {
      //     totalPagesRead += session.totalPagesRead;
      //     totalDuration += session.duration;
      //   });

      //   const averagePagesPerSession = totalPagesRead / result.length;
      //   const averageTimePerSession = totalDuration / result.length;

      //   setInsights({
      //     totalSessions: result.length,
      //     totalPagesRead,
      //     totalDuration,
      //     averagePagesPerSession,
      //     averageTimePerSession,
      //     sessions: result, // Add all session details for detailed display
      //   });
    } catch (error) {
      console.log("Error fetching insights:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (db) {
        fetchInsights();
      }

      return () => {};
    }, [db])
  );
  return (
    <View style={styles.container}>
      <Text className="text-white">Test</Text>
    </View>
  );
};

export default Insights;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 16,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  insightBox: {
    backgroundColor: "#333",
    padding: 16,
    borderRadius: 8,
  },
  text: {
    color: "white",
    fontSize: 16,
    marginBottom: 8,
  },
});
