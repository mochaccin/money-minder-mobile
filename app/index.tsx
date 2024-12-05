import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Dimensions } from "react-native";
import { Eye, CreditCard } from "lucide-react-native";
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const transactions = [
  { id: 1, name: "Name", date: "05/08/2024", amount: 2740 },
  { id: 2, name: "Name", date: "05/08/2024", amount: 2740 },
  { id: 3, name: "Name", date: "05/08/2024", amount: 2740 },
];

const pieData = [
  {
    name: "Car Payment",
    amount: 9999,
    color: "#A78BFA",
    legendFontColor: "#fff",
  },
  { name: "Games", amount: 4444, color: "#FFD700", legendFontColor: "#fff" },
  { name: "Food", amount: 7777, color: "#87CEEB", legendFontColor: "#fff" },
  {
    name: "Home spends",
    amount: 8888,
    color: "#FF69B4",
    legendFontColor: "#fff",
  },
];

export default function HomeScreen() {
  const [balance, setBalance] = useState("999.000");
  const [visible, setVisible] = useState(true);

  const toggleBalance = () => {
    setVisible(!visible);

    if (visible) {
      setBalance("999.000");
    } else {
      setBalance("********");
    }
  };

  return (
    <ScrollView className="flex-1 bg-zinc-900">
      {/* Header */}
      <View className="flex-row justify-between items-center p-4">
        <Text className="text-white text-2xl font-semibold">
          Welcome, Nicolas
        </Text>
        <View className="w-10 h-10 rounded-full bg-violet-500 items-center justify-center">
          <Text className="text-white text-lg font-medium">N</Text>
        </View>
      </View>

      {/* Transaction Overview Card */}
      <View className="mx-4 bg-zinc-800 rounded-xl p-4 mb-4">
        <View className="flex-row items-center space-x-2 mb-4 gap-2">
          <Text className="text-white text-3xl font-bold">$ {balance}</Text>
          <Eye onPress={toggleBalance} size={24} color="white" />
        </View>
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-gray-400">Nº of transactions this month</Text>
          <Text className="text-violet-400 text-lg">296</Text>
        </View>

        <Text className="text-gray-400 mb-2">Last transactions</Text>
        <View className="space-y-2 gap-1">
          {transactions.map((tx) => (
            <View key={tx.id} className="flex-row justify-between items-center">
              <View>
                <Text className="text-white">{tx.name}</Text>
                <Text className="text-gray-400 text-sm">{tx.date}</Text>
              </View>
              <Text className="text-white">$ {tx.amount}</Text>
            </View>
          ))}
        </View>
        <Pressable className="mt-3">
          <Text className="text-violet-400 text-center">See all</Text>
        </Pressable>
      </View>

      {/* Balance Cards */}
      <View className="flex-row mx-4 space-x-4 mb-6 gap-4">
        <View className="flex-1 bg-red-400 p-4 rounded-xl">
          <View className="flex-row items-center space-x-2 mb-1 gap-2">
            <CreditCard size={22} color="#18181b" />
            <Text className="text-zinc-900 text-lg font-semibold">
              Total Spent
            </Text>
          </View>
          <Text className="text-zinc-900 text-xl font-bold">$999.000</Text>
        </View>
        <View className="flex-1 bg-violet-500 p-4 rounded-xl">
          <View className="flex-row items-center space-x-2 mb-1 gap-2">
            <CreditCard size={22} color="#18181b" />
            <Text className="text-zinc-900 text-lg font-semibold">
              Total Balance
            </Text>
          </View>
          <Text className="text-zinc-900 text-xl font-bold">$999.000</Text>
        </View>
      </View>

      {/* Weekly Spend Section */}
      <View className="mx-4 mb-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white text-xl">Weekly spend</Text>
          <Text className="text-violet-400 text-xl">$31.108</Text>
        </View>

        <View className="bg-zinc-800 p-4 rounded-xl">
          <PieChart
            data={pieData}
            width={screenWidth + 200}
            height={220}
            chartConfig={{
              backgroundColor: "#1e1e1e",
              backgroundGradientFrom: "#1e1e1e",
              backgroundGradientTo: "#1e1e1e",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[0, 0]}
            absolute
            hasLegend={false}
          />

          {/* Custom Legend */}
          <View className="mt-4 space-y-2 gap-2">
            {pieData.map((item, index) => (
              <View
                key={index}
                className="flex-row items-center space-x-2 gap-2"
              >
                <View
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: item.color,
                    borderRadius: 6,
                  }}
                />
                <Text className="text-white flex-1">{item.name}</Text>
                <Text className="text-white">$ {item.amount}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
