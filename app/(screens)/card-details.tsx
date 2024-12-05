import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PieChart } from "react-native-chart-kit";
import {
  ChevronLeft,
  CreditCard,
  PieChart as PieChartIcon,
  List,
  Trash,
} from "lucide-react-native";
import { mockCards, MockSpend } from "../../models/data";

const spendCategories = [
  { name: "Food", color: "#FF6384" },
  { name: "Transport", color: "#36A2EB" },
  { name: "Entertainment", color: "#FFCE56" },
  { name: "Shopping", color: "#4BC0C0" },
  { name: "Others", color: "#9966FF" },
];

export default function CardDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const card = mockCards.find((c) => c._id.$oid === id);

  let imageSource = "";

  if (!card) {
    return <Text className="text-white">Card not found</Text>;
  }

  if (card) {
    imageSource = card.card_type
      ? require("../../assets/images/mastercard.png")
      : require("../../assets/images/visa.png");
  }

  const hasSpends = card.spends.length > 0;
  const totalSpend = card.spends.reduce((sum, spend) => sum + spend.amount, 0);

  const handleDelete = () => {
    console.log("Delete button pressed");
  };

  const pieData = hasSpends
    ? spendCategories.map((category) => {
        const categorySpends = card.spends.filter(
          (spend) => spend.category === category.name
        );
        const amount = categorySpends.reduce(
          (sum, spend) => sum + spend.amount,
          0
        );
        return {
          name: category.name,
          amount,
          color: category.color,
          legendFontColor: "#fff",
          legendFontSize: 12,
        };
      })
    : [
        {
          name: "No Data",
          amount: 1,
          color: "#CCCCCC",
          legendFontColor: "#fff",
          legendFontSize: 12,
        },
      ];

  return (
    <ScrollView className="flex-1 bg-zinc-900 px-4">
      <View className="flex-row items-center py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-semibold ml-4">
          Card Details
        </Text>
      </View>

      <View className="bg-zinc-800 rounded-xl p-4 mb-6">
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row gap-2">
            <Text className="text-white text-xl">{card.card_name}</Text>
            <CreditCard size={24} color="#fff" />
          </View>

          <TouchableOpacity onPress={handleDelete}>
            <Trash size={24} color="white" />
          </TouchableOpacity>
        </View>

        <Text className="text-gray-400 text-lg">{card.card_number}</Text>
        <Text className="text-gray-400 text-lg">
          Expires: {card.card_expiration_date}
        </Text>
      </View>

      <Text className="text-white text-xl mb-4">Spend Categories</Text>
      <View className="bg-zinc-800 rounded-xl p-4 mb-4 items-center">
        {hasSpends ? (
          <>
            <PieChart
              data={pieData}
              width={300}
              height={200}
              chartConfig={{
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="70"
              absolute
              hasLegend={false}
            />
            <View className="mt-4 space-y-2 gap-2">
              {pieData.map((item, index) => (
                <View
                  key={index}
                  className="flex-row items-center space-x-2 mb-2 gap-2 w-[200px]"
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
          </>
        ) : (
          <View className="items-center justify-center py-8">
            <PieChartIcon size={64} color="#CCCCCC" />
            <Text className="text-gray-400 mt-4 text-center">
              No spend data available for this card yet.
            </Text>
          </View>
        )}
      </View>

      <Text className="text-white text-xl mb-4">Recent Transactions</Text>
      <View className="bg-zinc-800 rounded-xl p-4 mb-6">
        {hasSpends ? (
          card.spends.slice(0, 5).map((spend: MockSpend, index: number) => (
            <View
              key={index}
              className="flex-row justify-between items-center py-2 border-b border-zinc-700"
            >
              <View>
                <Text className="text-white">{spend.name}</Text>
                <Text className="text-gray-400">{spend.date}</Text>
              </View>
              <Text className="text-white">${spend.amount.toFixed(2)}</Text>
            </View>
          ))
        ) : (
          <View className="items-center justify-center py-8">
            <List size={64} color="#CCCCCC" />
            <Text className="text-gray-400 mt-4 text-center">
              No transactions available for this card yet.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
