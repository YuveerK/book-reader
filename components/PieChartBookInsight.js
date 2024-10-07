import { Dimensions, View, Text } from "react-native";
import React, { useEffect, useState } from "react";

// Predefined list of distinct colors to avoid conflicts
const colors = [
  "#4CAF50", // Green
  "#FF5722", // Orange
  "#2196F3", // Blue
  "#FFEB3B", // Yellow
  "#E91E63", // Pink
  "#00BCD4", // Cyan
  "#9C27B0", // Purple
  "#FFC107", // Amber
  "#009688", // Teal
  "#CDDC39", // Lime
];

const PieChartBookInsight = ({ books }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (books.length > 0) {
      let tempArr = [];

      books.forEach((book, index) => {
        if (book.pagesRead && book.totalPages) {
          const pagesReadPercentage = (book.pagesRead / book.totalPages) * 100;

          let tempObj = {
            name: `${book.bookName} (${pagesReadPercentage.toFixed(2)}%)`, // Book name with percentage
            population: parseFloat(pagesReadPercentage.toFixed(2)), // Percentage completed, formatted to 2 decimal places
            color: colors[index % colors.length], // Assign a distinct color from the predefined list
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
          };

          tempArr.push(tempObj);
        }
      });
      setChartData(tempArr);
    }
  }, [books]); // Re-run the effect when books data changes

  return (
    <View className="flex-1 items-center justify-center my-8">
      {/* Title */}
      <Text className="text-2xl font-bold text-white mb-6">
        📖 Book Progress Insights
      </Text>

      {/* Custom Progress Bars as legend */}
      <View className="w-full px-4 mb-6">
        {chartData.length > 0 ? (
          chartData.map((item, index) => (
            <View
              key={index}
              className="mb-6 bg-[#1E1E1E] p-4 rounded-lg shadow-lg"
            >
              <Text className="text-white text-lg font-semibold mb-2">
                {item.name}
              </Text>
              <View className="h-4 w-full bg-gray-700 rounded-full">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${item.population}%`,
                    backgroundColor: item.color,
                  }}
                />
              </View>
              {/* Percentage Indicator */}
              <Text className="text-right text-[#D1FAE5] text-sm italic mt-2">
                {item.population.toFixed(2)}% completed
              </Text>
            </View>
          ))
        ) : (
          <Text className="text-gray-400 italic">
            No book insights available. Start reading to see your progress!
          </Text>
        )}
      </View>
    </View>
  );
};

export default PieChartBookInsight;
