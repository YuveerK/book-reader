import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Image,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import InsightChart from "../components/InsightChart";
import { G } from "react-native-svg";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import BookInsight from "../components/BookInsight";
import PieChartBookInsight from "../components/PieChartBookInsight";
const Insights = () => {
  const [db, setDb] = useState(null);
  const [insights, setInsights] = useState(null);
  const [visibleSessions, setVisibleSessions] = useState(5); // Start with 5 visible sessions
  const [refreshing, setRefreshing] = useState(false); // For pull-to-refresh
  const [books, setBooks] = useState([]);

  // Initialize the database on component mount
  useEffect(() => {
    initializeDb();
  }, []);

  const initializeDb = async () => {
    try {
      const database = await SQLite.openDatabaseAsync("books.db");
      setDb(database);
      console.log("Database initialized.");
    } catch (error) {
      console.error("Error initializing database:", error);
    }
  };

  // Fetch insights from the database
  const fetchInsights = async () => {
    try {
      if (!db) {
        console.log("Database is not ready yet.");
        return;
      }

      const result = await db.getAllAsync(
        `SELECT rs.*, b.bookName AS bookTitle 
         FROM reading_session rs
         INNER JOIN books b ON rs.bookId = b.id
         order by rs.updatedAt 
         asc
         `
      );
      console.log(result);
      if (!result || result.length === 0) {
        console.log("No insights found.");
        setInsights([]); // Reset insights if none are found
        return;
      }

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
        sessions: result,
      });
      console.log("Insights fetched successfully.");
    } catch (error) {
      console.error("Error fetching insights:", error);
    } finally {
      setRefreshing(false); // Stop the refreshing indicator
    }
  };

  const fetchBooks = async () => {
    try {
      const books = await db.getAllAsync("select * from books");
      setBooks(books);
    } catch (error) {
      console.log(error);
    }
  };

  // UseFocusEffect with proper async handling
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (db) {
          console.log("Fetching insights...");
          await fetchInsights(); // Fetch insights when the screen is focused
          console.log("Fetching Books");
          await fetchBooks();
        }
      };

      fetchData();

      return () => {
        // Cleanup or any other necessary actions can go here
      };
    }, [db])
  );

  const onRefresh = () => {
    setRefreshing(true); // Start the refreshing indicator
    fetchInsights(); // Re-fetch insights when pulled down
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  const loadMoreSessions = () => {
    setVisibleSessions(visibleSessions + 5); // Load 5 more sessions
  };

  return (
    <ScrollView
      className="flex-1 bg-black pb-20 px-4"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="w-full p-4">
        <Text className="text-white text-2xl text-center font-bold mb-4">
          Reading Insights 📊
        </Text>
      </View>
      {insights && insights.sessions && (
        <InsightChart insights={insights.sessions} />
      )}

      {books.length > 0 && <PieChartBookInsight books={books} />}
      {insights && insights.totalSessions ? (
        <View>
          {/* Summary Section */}
          <View className="bg-[#1E1E1E] p-6 rounded-lg mb-4 border border-gray-700 shadow-lg space-y-6">
            {/* Heading */}
            <Text className="text-white text-xl mb-4 font-bold tracking-wide">
              📊 Your Reading Insights
            </Text>

            {/* Stats Row 1 */}
            <View className="flex flex-row justify-between mb-4">
              <View className="items-center flex-1">
                <Text className="text-[#FFA500] text-3xl">📚</Text>
                <Text className="text-white text-lg mt-2">Total Sessions</Text>
                <Text className="text-[#FF6347] text-2xl font-bold mt-1">
                  {insights.totalSessions}
                </Text>
              </View>

              <View className="items-center flex-1">
                <Text className="text-[#32CD32] text-3xl">📄</Text>
                <Text className="text-white text-lg mt-2">Pages Read</Text>
                <Text className="text-[#32CD32] text-2xl font-bold mt-1">
                  {insights.totalPagesRead}
                </Text>
              </View>
            </View>

            {/* Stats Row 2 */}
            <View className="flex flex-row justify-between mb-4">
              <View className="items-center flex-1">
                <Text className="text-[#1E90FF] text-3xl">⏳</Text>
                <Text className="text-white text-lg mt-2">Total Duration</Text>
                <Text className="text-[#1E90FF] text-2xl font-bold mt-1">
                  {formatTime(insights.totalDuration)}
                </Text>
              </View>

              <View className="items-center flex-1">
                <Text className="text-[#FFD700] text-3xl">📈</Text>
                <Text className="text-white text-lg mt-2">
                  Avg. Pages/Session
                </Text>
                <Text className="text-[#FFD700] text-2xl font-bold mt-1">
                  {insights.averagePagesPerSession?.toFixed(2)}
                </Text>
              </View>
            </View>

            {/* Stats Row 3 */}
            <View className="items-center mb-4">
              <Text className="text-[#FF69B4] text-3xl">🕒</Text>
              <Text className="text-white text-lg mt-2">Avg. Time/Session</Text>
              <Text className="text-[#FF69B4] text-2xl font-bold mt-1">
                {formatTime(insights.averageTimePerSession)}
              </Text>
            </View>

            {/* Summary */}
            <Text className="text-[#D1FAE5] text-base italic mt-4 text-center">
              "Keep up the great work! You're building an amazing reading
              habit!" ✨
            </Text>
          </View>

          {/* Session Details Section */}
          <Text className="text-white text-xl font-bold mt-5 mb-2">
            Session Details
          </Text>

          <View className="flex-row flex-wrap justify-between">
            {books.map((book, index) => (
              <BookInsight book={book} key={index} />
            ))}
          </View>
          {visibleSessions < insights.sessions?.length && (
            <TouchableOpacity
              className="bg-gray-600 p-3 rounded-lg items-center mt-4"
              onPress={loadMoreSessions}
            >
              <Text className="text-white text-lg">Load More Sessions</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View className="w-full flex flex-1 items-center  justify-center mt-8">
          <Ionicons name="library-outline" size={100} color="white" />
          <Text className="text-white text-lg text-center mt-8">
            No insights available. Start adding and reading books to see your
            reading stats!
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default Insights;
