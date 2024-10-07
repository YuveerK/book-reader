import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";

// Helper function to get motivational messages based on progress
const getMotivationalMessage = (progress) => {
  if (progress < 20) {
    return "You're just getting started, keep going! 📖";
  } else if (progress < 50) {
    return "Great job! You're making solid progress! 💪";
  } else if (progress < 80) {
    return "You're more than halfway there! Keep it up! 🚀";
  } else if (progress < 100) {
    return "Almost there, you're so close to finishing! 🎉";
  } else {
    return "Congratulations on finishing the book! 🎉📚";
  }
};

// Helper function to get progress bar color based on progress
const getProgressBarColor = (progress) => {
  if (progress < 20) {
    return "#FF6347"; // Red for early progress
  } else if (progress < 50) {
    return "#FFA500"; // Orange for moderate progress
  } else if (progress < 80) {
    return "#FFD700"; // Yellow for more than halfway
  } else if (progress < 100) {
    return "#32CD32"; // Lime green for almost finished
  } else {
    return "#1E90FF"; // Blue for completion
  }
};

const Stats = ({ books, navigation }) => {
  return (
    <View style={styles.container}>
      {books.slice(0, 3).map((book, index) => {
        const progress = (book.pagesRead / book.totalPages) * 100;

        return (
          <React.Fragment key={index}>
            {book.totalPages > 0 && book.pagesRead >= 0 && (
              <TouchableOpacity
                style={styles.bookProgressContainer}
                onPress={() =>
                  navigation.navigate("Pdf Home Screen", {
                    fileUri: book.bookUri,
                    book: book,
                  })
                }
              >
                {/* Semi-transparent background to mimic blur */}
                <View style={styles.transparentBackground}>
                  {/* Display book name, author, and percentage read */}
                  <View style={styles.titleRow}>
                    <Text style={styles.bookTitle}>{book.bookName}</Text>
                    <AntDesign name="arrowright" size={20} color="darkorange" />
                  </View>
                  <Text style={styles.bookAuthor}>by {book.author}</Text>
                  <Text style={styles.percentageText}>
                    {progress.toFixed(1)}% read - {book.pagesRead}/
                    {book.totalPages} pages
                  </Text>

                  {/* Motivational message */}
                  <Text style={styles.motivationalMessage}>
                    {getMotivationalMessage(progress)}
                  </Text>

                  {/* Progress Bar */}
                  <View style={styles.progressBarBackground}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${progress}%`,
                          backgroundColor: getProgressBarColor(progress),
                        },
                      ]}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

export default Stats;

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  bookProgressContainer: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden", // Prevent content overflow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  transparentBackground: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Semi-transparent background
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bookTitle: {
    color: "#F3F4F6",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  bookAuthor: {
    color: "#9CA3AF",
    fontSize: 12,
    fontWeight: "400",
  },
  percentageText: {
    color: "#9CA3AF",
    fontSize: 12,
    marginBottom: 4,
  },
  motivationalMessage: {
    color: "#D1FAE5", // Light green for motivational text
    fontSize: 12,
    fontStyle: "italic",
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 10,
    borderRadius: 10, // Rounded corners for progress bar
    backgroundColor: "#374151", // Dark gray for background
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 10, // Rounded corners for the progress bar fill
  },
});
