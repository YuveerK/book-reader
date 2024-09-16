import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";

const Book = ({ book, navigation }) => {
  // Calculate card width and image height based on aspect ratio
  const cardWidth = Dimensions.get("window").width / 2 - 24;
  const imageHeight = (cardWidth * 3) / 2; // Height adjusted for 2:3 aspect ratio
  return (
    <View key={book.id} className="mb-6" style={{ width: cardWidth }}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Pdf Home Screen", {
            fileUri: book.bookUri,
            book: book,
          })
        }
        className="shadow-lg"
      >
        <Image
          source={
            book.bookCover
              ? { uri: book.bookCover }
              : require("../assets/no.png")
          }
          className="rounded-lg"
          style={{
            width: "100%",
            height: imageHeight,
            resizeMode: "cover",
          }}
        />
      </TouchableOpacity>

      <View className="mt-2 px-1">
        <Text className=" text-white text-base font-semibold" numberOfLines={1}>
          {book.bookName}
        </Text>
        <Text className="text-xs text-gray-400 ">
          Added on: {new Date(book.createdAt).toLocaleDateString()}
        </Text>
        {book.totalPages && (
          <Text className="text-xs text-gray-400 ">
            Page {book.pagesRead}/{book.totalPages}
          </Text>
        )}
        {book.totalPages && (
          <Text className="text-xs text-gray-400 ">
            Last Read on {new Date(book.updatedAt).toLocaleDateString()}
          </Text>
        )}
        {book.genre && (
          <Text className="text-xs text-white mt-2">{book.genre}</Text>
        )}
      </View>
    </View>
  );
};

export default Book;

const styles = StyleSheet.create({});
