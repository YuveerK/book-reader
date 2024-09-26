import React, { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
} from "react-native-reanimated";

const FilterMenu = ({ isVisible, toggleMenu }) => {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  // Start with scale 0 so it's hidden initially
  const scale = useSharedValue(isVisible ? 1 : 0);

  // Animated styles for scaling and bouncing
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Open the menu with a bounce effect
  const openMenu = () => {
    scale.value = withSequence(
      withTiming(1, { duration: 400 }), // Scale up to full size
      withSpring(1.1), // Bounce a bit
      withSpring(1) // Settle at full size
    );
  };

  // Close the menu with a bounce effect
  const closeMenu = () => {
    scale.value = withSequence(
      withSpring(1.1), // Slight bounce before closing
      withTiming(0, { duration: 400 }) // Scale down to 0
    );
  };

  // Trigger animation based on visibility
  useEffect(() => {
    if (isVisible) {
      openMenu();
    } else {
      closeMenu();
    }
  }, [isVisible]);

  return (
    isVisible && (
      <Animated.View
        style={[
          {
            position: "absolute",
            // Center the menu horizontally and vertically
            top: screenHeight / 2 - 100, // Centered vertically (100 is half of menu's height)
            left: screenWidth / 2 - 100, // Centered horizontally (100 is half of menu's width)
            width: 200,
            height: 200,
            backgroundColor: "#fff",
            borderRadius: 10,
            padding: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
            zIndex: 1000,
          },
          animatedStyle,
        ]}
      >
        <Text style={{ marginBottom: 10 }}>Filter Menu</Text>
        <TextInput
          placeholder="Search..."
          style={{ borderBottomWidth: 1, marginBottom: 10 }}
        />
        {/* Add more filter options here */}
        <TouchableOpacity onPress={toggleMenu}>
          <Text>Close Menu</Text>
        </TouchableOpacity>
      </Animated.View>
    )
  );
};

export default FilterMenu;
