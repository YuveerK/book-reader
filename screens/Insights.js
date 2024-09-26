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

      // Calculate total pages read and total duration
      let totalPagesRead = 0;
      let totalDuration = 0;

      result.forEach((session) => {
        totalPagesRead += session.totalPagesRead;
        totalDuration += session.duration;
      });

      const averagePagesPerSession = totalPagesRead / result.length;
      const averageTimePerSession = totalDuration / result.length;

      setInsights({
        totalSessions: result.length,
        totalPagesRead,
        totalDuration,
        averagePagesPerSession,
        averageTimePerSession,
        sessions: result, // Add all session details for detailed display
      });
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

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Reading Insights</Text>

      {insights ? (
        <View>
          <View style={styles.insightBox}>
            <Text style={styles.text}>
              Total Sessions: {insights.totalSessions}
            </Text>
            <Text style={styles.text}>
              Total Pages Read: {insights.totalPagesRead}
            </Text>
            <Text style={styles.text}>
              Total Duration: {formatTime(insights.totalDuration)}
            </Text>
            <Text style={styles.text}>
              Average Pages per Session:{" "}
              {insights.averagePagesPerSession.toFixed(2)}
            </Text>
            <Text style={styles.text}>
              Average Time per Session:{" "}
              {formatTime(insights.averageTimePerSession)}
            </Text>
          </View>

          <Text style={styles.subTitle}>Session Details</Text>

          {insights.sessions.map((session, index) => (
            <View key={session.id} style={styles.sessionBox}>
              <Text style={styles.text}>Book: {session.bookTitle}</Text>
              <Text style={styles.text}>
                Last Page Read: {session.lastReadPage}
              </Text>
              <Text style={styles.text}>
                Total Pages Read: {session.totalPagesRead}
              </Text>
              <Text style={styles.text}>
                Duration: {formatTime(session.duration)}
              </Text>
              <Text style={styles.text}>
                Session Date: {new Date(session.createdAt).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.text}>Fetching insights...</Text>
      )}
    </ScrollView>
  );
};

export default Insights;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",

    paddingBottom: 200,
    paddingHorizontal: 10,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  insightBox: {
    backgroundColor: "#333",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  sessionBox: {
    backgroundColor: "#444",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  text: {
    color: "white",
    fontSize: 16,
    marginBottom: 8,
  },
});
