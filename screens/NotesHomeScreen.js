import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Dimensions,
} from "react-native";

const NotesHomeScreen = () => {
  const [typedNotes, setTypedNotes] = useState("");

  return (
    <View style={styles.container}>
      {/* Text input for typing notes */}
      <ScrollView style={styles.textInputContainer}>
        <Text style={styles.label}>Typed Notes:</Text>
        <TextInput
          style={styles.textInput}
          value={typedNotes}
          onChangeText={setTypedNotes}
          placeholder="Type your notes here..."
          multiline
        />
      </ScrollView>
    </View>
  );
};

export default NotesHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
  textInputContainer: {
    flex: 1,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
  },
  textInput: {
    height: Dimensions.get("screen").height,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    textAlignVertical: "top",
    backgroundColor: "#f9f9f9",
  },
  canvasContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  canvas: {
    width: "100%",
    height: 300,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
