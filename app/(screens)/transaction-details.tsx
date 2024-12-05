import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { mockCards } from "../../mocks/data";

interface Transaction {
  id: string;
  name: string;
  amount: number;
  cardId: string;
  date: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    name: "Grocery Shopping",
    amount: 85.5,
    cardId: "673a6dc7b51c964eefdbe538",
    date: "2024-08-15",
  },
  {
    id: "2",
    name: "Gas Station",
    amount: 45.0,
    cardId: "673a6dc7b51c964eefdbe539",
    date: "2024-08-14",
  },
  {
    id: "3",
    name: "Restaurant",
    amount: 62.75,
    cardId: "673a6dc7b51c964eefdbe540",
    date: "2024-08-13",
  },
  {
    id: "4",
    name: "Online Shopping",
    amount: 129.99,
    cardId: "673a6dc7b51c964eefdbe538",
    date: "2024-08-12",
  },
  {
    id: "5",
    name: "Movie Tickets",
    amount: 30.0,
    cardId: "673a6dc7b51c964eefdbe539",
    date: "2024-08-11",
  },
];

export default function TransactionDetailsScreen() {
  const router = useRouter();
  const { category, color } = useLocalSearchParams<{
    category: string;
    color: string;
  }>();

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
        {mockTransactions.map((transaction) => {
          const card = mockCards.find((c) => c._id.$oid === transaction.cardId);
          return (
            <View
              key={transaction.id}
              className="flex-row justify-between items-center py-3 border-b border-zinc-700"
            >
              <View>
                <Text className="text-white font-medium">
                  {transaction.name}
                </Text>
                <Text className="text-gray-400">
                  {card?.card_name} - {transaction.date}
                </Text>
              </View>
              <Text className="text-white">
                ${transaction.amount.toFixed(2)}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
