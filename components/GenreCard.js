import { ImageBackground, Text, View } from "react-native";
import React from "react";

// Importing images upfront
const images = {
  Fiction: require("../assets/fiction.jpeg"),
  "Non-fiction": require("../assets/non-fiction.jpg"),
  Mystery: require("../assets/mystery.jpg"),
  Thriller: require("../assets/no.png"),
  Romance: require("../assets/romance.png"),
  "Science Fiction": require("../assets/science fiction.jpg"),
  Fantasy: require("../assets/fantasy.webp"),
  Biography: require("../assets/biography.jpg"),
  "Self-help": require("../assets/self-help.jpg"),
  Historical: require("../assets/historical.jpg"),
  "Children's": require("../assets/children.avif"),
  Adventure: require("../assets/adventure.webp"),
  Horror: require("../assets/horror.webp"),
  Poetry: require("../assets/poetry.jpg"),
  "Graphic Novel": require("../assets/graphic.jpeg"),
  "Young Adult": require("../assets/young-adult.jpg"),
  Classics: require("../assets/classic.jpg"),
  Philosophy: require("../assets/philosophy.jpg"),
  Crime: require("../assets/crime.jpg"),
  All: require("../assets/no.png"), // Default image for "All"
};

const GenreCard = ({ genre }) => {
  return (
    <View className="w-36 h-24 rounded-lg overflow-hidden m-2">
      <ImageBackground
        source={images[genre] || images["All"]}
        className="flex-1 justify-center items-center relative"
        imageStyle={{ borderRadius: 10 }}
      >
        <View className="absolute inset-0 bg-black/90 opacity-50 top-0 left-0 w-full h-full" />
        <Text className="text-white text-lg font-bold z-10">{genre}</Text>
      </ImageBackground>
    </View>
  );
};

export default GenreCard;
