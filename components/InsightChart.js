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
        color: (opacity = 1) => `darkorange`, // Optional
        strokeWidth: 2, // Optional
      },
    ],
    legend: ["Pages Read Per Day"], // Optional
  };

  return (
    <View>
      <Text>Interactive Bezier Line Chart</Text>
      <LineChart
        data={data}
        width={Dimensions.get("window").width - 35}
        height={220}
        yAxisSuffix=""
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: "#1e1e1e", // Dark background color
          backgroundGradientFrom: "black", // Gradient matching the app's theme
          backgroundGradientTo: "black", // Solid dark background
          decimalPlaces: 0, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 115, 0, 0)`, // Vibrant blue for the line
          labelColor: (opacity = 1) => `rgba(255, 115, 0, ${0.7})`, // Slight opacity to reduce size appearance
          style: {
            borderRadius: 16,
            fontSize: 10, // Adjust font size here (though you may not see direct impact)
          },
          propsForLabels: {
            fontSize: 10, // Optional: Custom font size for labels
          },
          propsForDots: {
            r: "3",
            strokeWidth: "2",
            stroke: "darkorange", // Lighter blue or cyan for the dots
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        onDataPointClick={(data) => {
          alert(`Day: ${data.index + 1}, Pages Read: ${data.value}`);
        }} // Interaction - Show a tooltip on point click
        withVerticalLabels={true}
        xLabelsOffset={-10} // Adjust this value for better positioning
        withInnerLines={false} // If you want to remove the grid lines
        formatXLabel={(label) => `${label}`} // Format labels
        verticalLabelRotation={45} // Rotates the x-axis labels by 45 degrees
      />
    </View>
  );
};

export default InsightChart;
