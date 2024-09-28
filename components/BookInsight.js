import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";

const BookInsight = ({ book }) => {
  const cardWidth = Dimensions.get("window").width / 2 - 24;
  const imageHeight = (cardWidth * 3) / 2;
  return (
    <View key={book.id} className="mb-6" style={{ width: cardWidth }}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Pdf Screen", {
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
        <Text className="text-white text-base font-semibold" numberOfLines={1}>
          {book.bookName}
        </Text>
        <Text className="text-gray-400 text-sm">
          Added on: {new Date(book.createdAt).toLocaleDateString()}
        </Text>
        {book.totalPages && (
          <Text className="text-gray-400 text-sm">
            Page {book.pagesRead}/{book.totalPages}
          </Text>
        )}
      </View>
    </View>
  );
};

export default BookInsight;

const styles = StyleSheet.create({});
