import { Dimensions, Text, View } from "react-native";
import React from "react";
import { LineChart } from "react-native-chart-kit";

const InsightChart = ({ insights }) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Filter out negative pages read before mapping
  const pagesReadData = insights
    .filter((insight) => insight.totalPagesRead >= 0) // Only include non-negative insights
    .map((insight) => ({
      pagesRead: insight.totalPagesRead,
      day: `${new Date(insight.createdAt).getDate()} ${
        months[new Date(insight.createdAt).getMonth()]
      }`,
    }));

  const data = {
    labels:
      pagesReadData.length > 0
        ? pagesReadData.map((insight) => insight.day)
        : ["No Data"],
    datasets: [
      {
        data:
          pagesReadData.length > 0
            ? pagesReadData.map((insight) => insight.pagesRead)
            : [0],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // Optional
        strokeWidth: 2, // Optional
      },
    ],
    legend: ["Pages Read Per Day"], // Optional
  };

  return (
    <View>
      <Text>Bezier Line Chart</Text>
      <LineChart
        data={data}
        width={Dimensions.get("window").width - 35}
        height={220}
        yAxisSuffix=""
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: "#1e1e1e", // Dark background color
          backgroundGradientFrom: "#1e1e1e", // Gradient matching the app's theme
          backgroundGradientTo: "#1e1e1e", // Solid dark background
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(0, 181, 204, ${opacity})`, // Vibrant blue for the line
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // White for labels
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#00d2ff", // Lighter blue or cyan for the dots
          },
          propsForBackgroundLines: {
            strokeDasharray: "", // This removes dashed lines
            strokeWidth: 0, // This removes background grid lines
          },
          hideHorizontalLines: true, // Hide horizontal grid lines
          hideVerticalLines: true, // Hide vertical grid lines
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
};

export default InsightChart;
