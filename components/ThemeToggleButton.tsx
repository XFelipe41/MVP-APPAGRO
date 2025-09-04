import React from 'react';
import { Pressable, useColorScheme as useSystemColorScheme } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/Colors';

export function ThemeToggleButton() {
  const { colorScheme, toggleColorScheme } = useTheme();
  const rotation = useSharedValue(colorScheme === 'dark' ? 0 : 180);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const handlePress = () => {
    const newRotation = colorScheme === 'dark' ? 180 : 0;
    rotation.value = withTiming(newRotation, { duration: 300, easing: Easing.linear });
    toggleColorScheme();
  };

  const iconName = colorScheme === 'dark' ? 'moon' : 'sunny';
  const iconColor = '#FFFFFF';

  return (
    <Pressable onPress={handlePress}>
      <Animated.View style={animatedStyle}>
        <Ionicons name={iconName} size={24} color={iconColor} />
      </Animated.View>
    </Pressable>
  );
}
