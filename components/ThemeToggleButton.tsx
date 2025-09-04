import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

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
  const iconColor = colorScheme === 'dark' ? '#000000ff' : '#000000ff'; // Gold color for sunny

  return (
    <Pressable onPress={handlePress}>
      <Animated.View style={animatedStyle}>
        <Ionicons name={iconName} size={24} color={iconColor} />
      </Animated.View>
    </Pressable>
  );
}
