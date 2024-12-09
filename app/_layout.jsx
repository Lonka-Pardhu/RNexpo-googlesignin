import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const _layout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="home" />
        <Stack.Screen name="index" />
      </Stack>
    </>
  );
};

export default _layout;
