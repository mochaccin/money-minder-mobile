import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { ChevronDown, ChevronRight, CreditCard } from "lucide-react-native";
import { PieChart } from "react-native-chart-kit";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import { useRouter } from "expo-router";

const pieData = [
  { name: "Car Payment", amount: 9999, color: "#A78BFA" },
  { name: "Games", amount: 4444, color: "#FFD700" },
  { name: "Food", amount: 7777, color: "#87CEEB" },
  { name: "Home spends", amount: 8888, color: "#FF69B4" },
];

const transactionGroups = [
  {
    id: 1,
    name: "Car Payment",
    color: "#A78BFA",
    transactions: 5,
    amount: 17582,
  },
  { id: 2, name: "Games", color: "#FFD700", transactions: 6, amount: 17582 },
  { id: 3, name: "Food", color: "#87CEEB", transactions: 6, amount: 17582 },
];

export default function StatsScreen() {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const router = useRouter();

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <ScrollView className="flex-1 bg-zinc-900 px-4">
      <View className="flex-row justify-between items-center py-4">
        <Text className="text-white text-2xl font-semibold">Stats</Text>
        <View className="w-8 h-8 rounded-full bg-violet-500 items-center justify-center">
          <Text className="text-white text-sm font-medium">N</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        className="flex-row items-center justify-center space-x-2 mb-4"
      >
        <Text className="text-white text-lg">
          {date.toLocaleString("default", { month: "long", year: "numeric" })}
        </Text>
        <ChevronDown size={20} color="white" />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
        />
      )}

      <View className="flex-row space-x-4 mb-6 gap-4">
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

      <View className="bg-zinc-800 rounded-xl p-4 mb-6">
        <PieChart
          data={pieData}
          width={350}
          height={200}
          chartConfig={{
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="90"
          center={[0, 0]}
          hasLegend={false}
          absolute
        />

        <View className="mt-4 space-y-2 gap-2">
          {pieData.map((item, index) => (
            <View key={index} className="flex-row items-center space-x-2 gap-2">
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

      {transactionGroups.map((group) => (
        <TouchableOpacity
          key={group.id}
          className="bg-zinc-800 rounded-xl p-4 mb-3 flex-row items-center"
          onPress={() =>
            router.push(
              `/transaction-details?category=${group.name}&color=${group.color}`
            )
          }
        >
          <View
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: group.color }}
          >
            <Text className="text-white font-medium">N</Text>
          </View>
          <View className="flex-1 ml-3">
            <Text className="text-white font-medium">{group.name}</Text>
            <Text className="text-gray-400">
              {group.transactions} Transactions
            </Text>
          </View>
          <View className="flex-row items-center space-x-2">
            <Text className="text-white font-medium">${group.amount}</Text>
            <ChevronRight size={20} color="white" />
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
