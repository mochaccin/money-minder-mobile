import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { useRouter } from "expo-router";
import { mockCards } from "../../mocks/data";

export default function CardsScreen() {
  const router = useRouter();
  const hasCards = mockCards.length > 0;

  if (!hasCards) {
    return (
      <View className="flex-1 bg-[#111111] px-4">
        <View className="flex-row justify-between items-center py-4">
          <Text className="text-white text-2xl font-semibold">Add Card</Text>
          <View className="w-8 h-8 rounded-full bg-violet-500 items-center justify-center">
            <Text className="text-white text-sm font-medium">N</Text>
          </View>
        </View>

        <View className="flex-1 items-center justify-center -mt-20">
          <Image
            source={{
              uri: "https://preview.redd.it/i-made-steamhappy-vector-image-v0-jmmqmwzwk14c1.png?width=800&format=png&auto=webp&s=7cc8498450fbd323b22899722ac24cbd23a91a83",
            }}
            className="w-60 h-60"
            resizeMode="contain"
          />
          <Text className="text-white text-2xl font-bold mt-4 mb-2">
            Let's add your card
          </Text>
          <Text className="text-gray-400 text-center mb-8 px-6">
            Experience the power of financial organization with our application.
          </Text>
          <TouchableOpacity
            className="bg-violet-500 rounded-xl py-4 px-8"
            onPress={() => router.push("/add-card")}
          >
            <Text className="text-white font-semibold text-lg flex-row items-center">
              + Add another card
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-zinc-900 px-4">
      <View className="flex-row justify-between items-center py-4">
        <Text className="text-white text-2xl font-semibold">Cards</Text>
        <View className="w-8 h-8 rounded-full bg-violet-500 items-center justify-center">
          <Text className="text-white text-sm font-medium">N</Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="space-y-3 gap-4">
          {mockCards.map((card) => (
            <TouchableOpacity
              key={card._id.$oid}
              className="flex-row items-center justify-between bg-zinc-800 p-4 rounded-xl"
              onPress={() => router.push(`/card-details?id=${card._id.$oid}`)}
            >
              <View className="flex-row items-center space-x-3 gap-4">
                <Text className="text-violet-400 text-lg">Tarjeta ******</Text>
                <Image
                  source={
                    card.card_type
                      ? require("../../assets/images/mastercard.png")
                      : require("../../assets/images/visa.png")
                  }
                  className="w-10 h-10"
                  resizeMode="contain"
                />
              </View>
              <View className="flex-row h-[50px] items-center space-x-3 gap-2">
                <Text className="text-white text-lg">
                  **** **** **** {card.card_number.slice(-4)}
                </Text>
                <ChevronRight size={22} color="#A78BFA" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          className="bg-violet-500 rounded-xl py-4 px-8 my-6"
          onPress={() => router.push("/add-card")}
        >
          <Text className="text-white font-semibold text-center text-lg">
            Add new card
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
