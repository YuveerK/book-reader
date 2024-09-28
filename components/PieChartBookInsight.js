import { Dimensions, View, Text } from "react-native";
import React, { useEffect, useState } from "react";

// Predefined list of distinct colors to avoid conflicts
const colors = [
  "#4CAF50",
  "#FF5722",
  "#2196F3",
  "#FFEB3B",
  "#E91E63",
  "#00BCD4",
  "#9C27B0",
  "#FFC107",
  "#009688",
  "#CDDC39",
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
      {/* Progress bars as custom legend */}
      <View className="w-full px-4 mb-6">
        {chartData.map((item, index) => (
          <View key={index} className="mb-4">
            <Text className="text-white mb-1">{item.name}</Text>
            <View className="h-4 w-full bg-gray-700 rounded-full">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${item.population}%`,
                  backgroundColor: item.color,
                }}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default PieChartBookInsight;
