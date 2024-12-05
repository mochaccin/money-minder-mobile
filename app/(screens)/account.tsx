import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft, List } from "lucide-react-native";
import { LineChart } from "react-native-chart-kit";

const monthlySpending = [
  { month: "Jan", amount: 500 },
  { month: "Feb", amount: 700 },
  { month: "Mar", amount: 600 },
  { month: "Apr", amount: 800 },
  { month: "May", amount: 750 },
  { month: "Jun", amount: 900 },
];

const transactions = [
  { name: "Grocery Store", date: "15/06/2023", amount: 85.5 },
  { name: "Gas Station", date: "14/06/2023", amount: 45.0 },
  { name: "Restaurant", date: "12/06/2023", amount: 65.75 },
  { name: "Online Shopping", date: "10/06/2023", amount: 120.99 },
  { name: "Utility Bill", date: "08/06/2023", amount: 95.0 },
];

export default function AccountScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#111111] px-4">
      {/* Header */}
      <View className="flex-row items-center py-4 gap-4">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="#A78BFA" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-semibold">Account</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="bg-zinc-800 rounded-xl p-6 my-6">
          <Text className="text-white text-xl mb-2">Monthly Spending</Text>
          <LineChart
            data={{
              labels: monthlySpending.map((item) => item.month),
              datasets: [
                {
                  data: monthlySpending.map((item) => item.amount),
                },
              ],
            }}
            width={320}
            height={220}
            yAxisLabel="$"
            withInnerLines={false}
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
                r: "6",
                strokeWidth: "2",
                stroke: "#A78BFA",
              },
              propsForBackgroundLines: {
                strokeDasharray: "",
              },
              propsForLabels: {
                fontSize: 12,
              },
            }}
            bezier
            style={{
              marginVertical: 16,
              marginHorizontal: 8,
              borderRadius: 16,
            }}
          />
        </View>

        <View className="bg-zinc-800 rounded-xl p-4 mb-6">
          <Text className="text-white text-xl mb-4">Recent Transactions</Text>
          {transactions.length > 0 ? (
            transactions.map((transaction, index) => (
              <View
                key={index}
                className="flex-row justify-between items-center py-2 border-b border-zinc-700"
              >
                <View>
                  <Text className="text-white">{transaction.name}</Text>
                  <Text className="text-gray-400">{transaction.date}</Text>
                </View>
                <Text className="text-white">
                  ${transaction.amount.toFixed(2)}
                </Text>
              </View>
            ))
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
