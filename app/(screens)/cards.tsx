import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { ChevronRight } from "lucide-react-native";
import { useRouter } from "expo-router";
import { Card } from "../../models/data";
import { fetchCards } from "../../services/api";

export default function CardsScreen(): JSX.Element {
  const router = useRouter();
  const [cards, setCards] = useState<Card[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      setLoading(true);
      const fetchedCards = await fetchCards();
      setCards(fetchedCards);
      setError(null);
    } catch (err) {
      setError("Failed to load cards. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-[#111111] justify-center items-center">
        <ActivityIndicator size="large" color="#A78BFA" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-[#111111] justify-center items-center px-4">
        <Text className="text-white text-lg text-center mb-4">{error}</Text>
        <TouchableOpacity
          className="bg-violet-500 rounded-xl py-4 px-8"
          onPress={loadCards}
        >
          <Text className="text-white font-semibold text-lg">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!cards || cards.length === 0) {
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
          {cards.map((card) => (
            <TouchableOpacity
              key={card.id}
              className="flex-row items-center justify-between bg-zinc-800 p-4 rounded-xl"
              onPress={() => router.push(`/card-details?id=${card.id}`)}
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
