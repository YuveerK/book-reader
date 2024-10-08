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

const EditBook = ({ route }) => {
  const { book } = route.params; // Extract the book object from route.params

  // State variables
  const [bookName, setBookName] = useState("");
  const [author, setAuthor] = useState(""); // State for author
  const [genre, setGenre] = useState(""); // State for genre
  const [bookCover, setBookCover] = useState("");
  const [db, setDb] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [bookSize, setBookSize] = useState("");

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
    // Initialize the state when the book data is available
    if (book) {
      setBookName(book.bookName || "");
      setAuthor(book.author || ""); // Set author from book object
      setGenre(book.genre || ""); // Set genre from book object
      setBookCover(book.bookCover || "");
      setFiles([{ uri: book.bookUri, name: book.bookName }]);
      setBookSize(book.bookSize || "");
    }

    // Initialize the database
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
  }, [book]);

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

  // Image Picker Function with matching aspect ratio to AddBook
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [2, 3], // Matching aspect ratio to AddBook
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

  // Update Book in Library Function
  const updateBookInLibrary = async () => {
    if (!db || !bookName || files.length === 0 || !author || !genre) {
      alert("Please fill in all the details and select a book file.");
      return;
    }
    try {
      const bookUri = files[0].uri;
      const updatedAt = new Date().toISOString();

      await db.runAsync(
        `UPDATE books SET bookCover = ?, bookUri = ?, bookSize = ?, bookName = ?, author = ?, genre = ?, updatedAt = ? WHERE id = ?;`,
        [
          bookCover,
          bookUri,
          bookSize,
          bookName,
          author,
          genre,
          updatedAt,
          book.id,
        ]
      );

      alert("Book updated successfully!");
    } catch (error) {
      console.error("Error updating book in library:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black p-6">
      <ScrollView>
        <Text className="text-2xl font-bold text-white text-center mb-6">
          ✏️ Edit Your Book
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
            <Text className="text-gray-400">Size: {bookSize} MB</Text>
            <Text className="text-gray-400">URI: {files[0].uri}</Text>
          </View>
        )}

        {/* Update Book Button */}
        <TouchableOpacity
          onPress={updateBookInLibrary}
          className="bg-green-600 p-4 rounded-md items-center justify-center"
        >
          <Text className="text-white font-bold">Update Book</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditBook;
