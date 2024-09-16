import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as SQLite from "expo-sqlite";
import { Picker } from "@react-native-picker/picker"; // Import Picker for genre dropdown

const AddBook = ({ navigation }) => {
  // State variables
  const [files, setFiles] = useState([]);
  const [bookName, setBookName] = useState("");
  const [bookCover, setBookCover] = useState("");
  const [author, setAuthor] = useState(""); // State for author
  const [genre, setGenre] = useState(""); // State for genre
  const [db, setDb] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookSize, setBookSize] = useState(0);

  // List of book genres for dropdown
  const genres = [
    "Fiction",
    "Non-fiction",
    "Mystery",
    "Thriller",
    "Romance",
    "Science Fiction",
    "Fantasy",
    "Biography",
    "Self-help",
    "Historical",
    "Children's",
    "Adventure",
    "Horror",
    "Poetry",
    "Graphic Novel",
    "Young Adult",
    "Classics",
    "Philosophy",
    "Crime",
  ];

  useEffect(() => {
    async function initializeDb() {
      try {
        const database = await SQLite.openDatabaseAsync("books.db");
        setDb(database);
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing database:", error);
      }
    }
    initializeDb();
  }, []);

  // Document Picker Function
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: false,
        type: "application/pdf",
      });
      if (!result.canceled && result.assets) {
        setFiles([result.assets[0]]);
        setBookSize(formatSizeInMB(result.assets[0].size));
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  // Image Picker Function
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [2, 3], // Recommended aspect ratio for book covers
      quality: 1,
    });
    if (!result.canceled) {
      setBookCover(result.assets[0].uri);
    }
  };

  // Format File Size
  const formatSizeInMB = (size) => {
    const sizeInMB = size / 1048576;
    return sizeInMB.toFixed(2);
  };

  // Add Book to Library Function
  const addBookToLibrary = async () => {
    if (!db || !bookName || files.length === 0 || !author || !genre) {
      alert("Please fill in all the details and select a book file.");
      return;
    }
    try {
      const bookUri = files[0].uri;
      const pagesRead = 0;
      const createdAt = new Date().toISOString();
      const updatedAt = createdAt;

      await db.runAsync(
        `INSERT INTO books (bookCover, bookUri, bookSize, bookName, author, genre, pagesRead, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          bookCover,
          bookUri,
          bookSize,
          bookName,
          author,
          genre,
          pagesRead,
          createdAt,
          updatedAt,
        ]
      );

      setBookName("");
      setBookCover("");
      setAuthor("");
      setGenre("");
      setFiles([]);
      alert("Book added to library successfully!");
    } catch (error) {
      console.error("Error adding book to library:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black p-6">
      <ScrollView>
        <Text className="text-2xl font-bold text-white text-center mb-6">
          📖 Add a Book to Your Library
        </Text>

        {/* Book Cover Picker */}
        <View className="items-center justify-center mb-8">
          <TouchableOpacity
            onPress={pickImage}
            className="w-48 h-72 rounded-md border border-gray-500 items-center justify-center bg-gray-900"
          >
            {bookCover ? (
              <Image
                source={{ uri: bookCover }}
                className="w-full h-full rounded-md"
              />
            ) : (
              <Text className="text-white">Add Book Cover</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Book Name Input */}
        <TextInput
          onChangeText={setBookName}
          value={bookName}
          placeholder="Book Name"
          className="w-full text-white border border-gray-500 py-2 px-4 rounded-md bg-gray-800 mb-8"
          placeholderTextColor="gray"
        />

        {/* Author Input */}
        <TextInput
          onChangeText={setAuthor}
          value={author}
          placeholder="Author"
          className="w-full text-white border border-gray-500 py-2 px-4 rounded-md bg-gray-800 mb-8"
          placeholderTextColor="gray"
        />

        {/* Genre Picker */}
        <View className="w-full border border-gray-500 py-2 px-4 rounded-md bg-gray-800 mb-8">
          <Picker
            selectedValue={genre}
            onValueChange={(itemValue) => setGenre(itemValue)}
            style={{ color: "white" }}
          >
            <Picker.Item label="Select Genre" value="" />
            {genres.map((genreItem, index) => (
              <Picker.Item key={index} label={genreItem} value={genreItem} />
            ))}
          </Picker>
        </View>

        {/* Document Picker */}
        <TouchableOpacity
          onPress={pickDocument}
          className="bg-blue-500 p-4 rounded-md items-center justify-center mb-8"
        >
          <Text className="text-white font-semibold">
            Select Book File (PDF)
          </Text>
        </TouchableOpacity>

        {/* Display Selected File */}
        {files.length > 0 && (
          <View className="bg-gray-800 p-4 rounded-md mb-8">
            <Text className="text-white">Name: {files[0].name}</Text>
            <Text className="text-gray-400">
              Size: {formatSizeInMB(files[0].size)} MB
            </Text>
            <Text className="text-gray-400">URI: {files[0].uri}</Text>
          </View>
        )}

        {/* Add Book to Library Button */}
        <TouchableOpacity
          onPress={addBookToLibrary}
          className="bg-green-600 p-4 rounded-md items-center justify-center"
        >
          <Text className="text-white font-bold">Add Book to Library</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddBook;
