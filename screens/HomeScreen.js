import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";

const HomeScreen = ({ navigation }) => {
  const [files, setFiles] = useState([]);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: true, // Allow selecting multiple files
        type: "application/pdf", // Restrict to PDF files only
      });

      if (!result.canceled && result.assets) {
        // Add all the selected files to the state
        setFiles((prevFiles) => [...prevFiles, ...result.assets]);
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  // Convert size from bytes to megabytes
  const formatSizeInMB = (size) => {
    const sizeInMB = size / 1048576; // 1 MB = 1024 * 1024 bytes
    return sizeInMB.toFixed(2); // Limit to 2 decimal places
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Document Picker</Text>
      <Button title="Pick Documents" onPress={pickDocument} />
      <FlatList
        data={files}
        keyExtractor={(item) => item.uri}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              navigation.navigate("Pdf Screen", { fileUri: item.uri })
            }
          >
            <Text style={styles.fileName}>Name: {item.name}</Text>
            <Text style={styles.fileInfo}>MIME Type: {item.mimeType}</Text>
            <Text style={styles.fileInfo}>
              Size: {formatSizeInMB(item.size)} MB
            </Text>
            <Text style={styles.fileInfo}>URI: {item.uri}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 16,
  },
  title: {
    color: "white",
    fontSize: 24,
    marginBottom: 16,
  },
  item: {
    backgroundColor: "#1c1c1c",
    padding: 12,
    marginVertical: 8,
    borderRadius: 6,
  },
  fileName: {
    color: "white",
    fontSize: 16,
  },
  fileInfo: {
    color: "gray",
    fontSize: 14,
  },
});

export default HomeScreen;
