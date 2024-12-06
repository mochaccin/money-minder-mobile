import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { fetchUserSpends, fetchCards, userId } from "../../services/api";
import { Spend, Card } from "../../models/data";

export default function TransactionDetailsScreen() {
  const router = useRouter();
  const { category, color, month, year } = useLocalSearchParams<{
    category: string;
    color: string;
    month: string;
    year: string;
  }>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [spends, setSpends] = useState<Spend[]>([]);
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [fetchedSpends, fetchedCards] = await Promise.all([
          fetchUserSpends(userId),
          fetchCards(),
        ]);
        setSpends(fetchedSpends);
        setCards(fetchedCards);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load transaction data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredSpends = spends.filter((spend) => {
    const [spendDay, spendMonth, spendYear] = spend.date.split("-");
    return (
      spend.category === category && spendMonth === month && spendYear === year
    );
  });

  if (loading) {
    return (
      <View className="flex-1 bg-zinc-900 justify-center items-center">
        <ActivityIndicator size="large" color="#A78BFA" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-zinc-900 justify-center items-center px-4">
        <Text className="text-white text-lg text-center mb-4">{error}</Text>
        <TouchableOpacity
          className="bg-violet-500 rounded-xl py-4 px-8"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold text-lg">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-zinc-900 px-4">
      <View className="flex-row items-center py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-semibold ml-4">
          {category} Transactions
        </Text>
      </View>

      <View className="bg-zinc-800 rounded-xl p-4 mb-6">
        {filteredSpends.length > 0 ? (
          filteredSpends.map((spend) => {
            const card = cards.find((c) => c.id === spend.payment_card);
            return (
              <View
                key={spend.id}
                className="flex-row justify-between items-center py-3 border-b border-zinc-700"
              >
                <View>
                  <Text className="text-white font-medium">{spend.name}</Text>
                  <Text className="text-gray-400">
                    {card?.card_name || "Unknown Card"} - {spend.date}
                  </Text>
                </View>
                <Text className="text-white">${spend.amount.toFixed(2)}</Text>
              </View>
            );
          })
        ) : (
          <Text className="text-white text-center py-4">
            No transactions found for this category in the selected month.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
