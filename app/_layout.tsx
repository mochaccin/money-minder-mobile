import { Stack } from "expo-router";
import React from "react";
import { View, SafeAreaView, StatusBar } from "react-native";
import BottomNav from "../components/bottom-nav";
import "../global.css";

export default function RootLayout() {
  return (
    <SafeAreaView className="flex-1 bg-[#111111]">
      <StatusBar barStyle="light-content" backgroundColor="#18181B" />
      <View className="flex-1">
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="(screens)/account"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(screens)/cards"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(screens)/stats"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(screens)/add-spend"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(screens)/card-details"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(screens)/transaction-details"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(screens)/add-card"
            options={{ headerShown: false }}
          />
        </Stack>
      </View>
      <BottomNav />
    </SafeAreaView>
  );
}
