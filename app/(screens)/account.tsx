import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft, List, BarChart2 } from "lucide-react-native";
import { LineChart } from "react-native-chart-kit";
import { fetchUserSpends, fetchCards, userId } from "../../services/api";
import { Spend, Card } from "../../models/data";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function AccountScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [spends, setSpends] = useState<Spend[]>([]);
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    loadSpendsAndCards();
  }, []);

  const loadSpendsAndCards = async () => {
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
      console.error("Failed to load data:", err);
      setError("Failed to load spending data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const processMonthlySpending = () => {
    if (!spends || spends.length === 0) {
      return MONTHS.map((month) => ({ month, amount: 0 }));
    }

    const monthlyTotals: { [key: string]: number } = {};
    MONTHS.forEach((month) => {
      monthlyTotals[month] = 0;
    });

    spends.forEach((spend) => {
      const [day, month, year] = spend.date.split("-");
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const monthName = MONTHS[date.getMonth()];
      monthlyTotals[monthName] += Math.round(spend.amount);
    });

    return MONTHS.map((month) => ({ month, amount: monthlyTotals[month] }));
  };

  const monthlySpending = processMonthlySpending();
  const maxSpending = Math.max(...monthlySpending.map((item) => item.amount));
  const yAxisMax = Math.ceil(maxSpending / 200) * 200;

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
          onPress={loadSpendsAndCards}
        >
          <Text className="text-white font-semibold text-lg">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#111111] px-4">
      <View className="flex-row items-center py-4 gap-4">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="#A78BFA" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-semibold">Account</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="bg-zinc-800 rounded-xl p-6 my-6">
          <Text className="text-white text-xl mb-2">Monthly Spending</Text>
          {spends && spends.length > 0 ? (
            <LineChart
              data={{
                labels: MONTHS,
                datasets: [
                  {
                    data: monthlySpending.map((item) => item.amount),
                  },
                ],
              }}
              width={340}
              height={220}
              yAxisLabel="$"
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: "#2D3748",
                backgroundGradientFrom: "#2D3748",
                backgroundGradientTo: "#2D3748",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(167, 139, 250, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "4",
                  strokeWidth: "2",
                  stroke: "#A78BFA",
                },
                propsForBackgroundLines: {
                  strokeDasharray: "",
                },
                propsForLabels: {
                  fontSize: 8,
                  rotation: 45,
                },
              }}
              bezier
              fromZero
              yAxisMax={yAxisMax}
            />
          ) : (
            <View className="items-center justify-center py-8">
              <BarChart2 size={64} color="#CCCCCC" />
              <Text className="text-gray-400 mt-4 text-center">
                No spending data available yet.
              </Text>
            </View>
          )}
        </View>

        <View className="bg-zinc-800 rounded-xl p-4 mb-6">
          <Text className="text-white text-xl mb-4">Recent Transactions</Text>
          {spends && spends.length > 0 ? (
            spends.map((spend, index) => {
              const card = cards.find((c) => c.id === spend.payment_card);

              return (
                <View
                  key={index}
                  className="flex-row justify-between items-center py-2 border-b border-zinc-700"
                >
                  <View>
                    <Text className="text-white">{spend.name}</Text>
                    <Text className="text-gray-400">
                      {card?.card_name || "Unknown Card"} - {spend.date}
                    </Text>
                  </View>
                  <Text className="text-white">${spend.amount.toFixed(2)}</Text>
                </View>
              );
            })
          ) : (
            <View className="items-center justify-center py-8">
              <List size={64} color="#CCCCCC" />
              <Text className="text-gray-400 mt-4 text-center">
                No transactions available yet.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
