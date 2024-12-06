import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Eye, CreditCard, List, BarChart2 } from "lucide-react-native";
import { PieChart } from "react-native-chart-kit";
import { fetchUserData, fetchUserSpends, userId } from "../services/api";
import { User, Spend } from "../models/data";
import { router } from "expo-router";

const screenWidth = Dimensions.get("window").width;

const spendCategories = [
  { name: "Food", color: "#FF6384" },
  { name: "Transport", color: "#36A2EB" },
  { name: "Entertainment", color: "#FFCE56" },
  { name: "Shopping", color: "#4BC0C0" },
  { name: "Others", color: "#9966FF" },
];

export default function HomeScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [spends, setSpends] = useState<Spend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [userData, userSpends] = await Promise.all([
        fetchUserData(userId),
        fetchUserSpends(userId),
      ]);
      setUser(userData);
      setSpends(userSpends);
      setError(null);
    } catch (err) {
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleBalance = () => {
    setVisible(!visible);
  };

  const formatBalance = (balance: number) => {
    return visible ? balance.toFixed(2) : "********";
  };

  const getRecentTransactions = () => {
    return spends && spends.length > 0
      ? spends.slice(0, 3).map((spend, index) => ({
          id: index,
          name: spend.name,
          date: spend.date,
          amount: spend.amount,
        }))
      : [];
  };

  const calculateWeeklySpend = () => {
    if (!spends || spends.length === 0) return 0;

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return spends
      .filter((spend) => {
        const [day, month, year] = spend.date.split("-").map(Number);
        const spendDate = new Date(2000 + year, month - 1, day); // Adjust for YY format
        return spendDate >= oneWeekAgo && spendDate <= now;
      })
      .reduce((total, spend) => total + spend.amount, 0);
  };

  const calculateCategorySpends = () => {
    if (!spends || spends.length === 0) {
      return spendCategories.map((category) => ({
        name: category.name,
        amount: 0,
        color: category.color,
        legendFontColor: "#fff",
      }));
    }

    const categoryTotals: { [key: string]: number } = {};
    spendCategories.forEach((category) => {
      categoryTotals[category.name] = 0;
    });

    spends.forEach((spend) => {
      if (categoryTotals.hasOwnProperty(spend.category)) {
        categoryTotals[spend.category] += spend.amount;
      } else {
        categoryTotals["Others"] += spend.amount;
      }
    });

    return spendCategories.map((category) => ({
      name: category.name,
      amount: categoryTotals[category.name],
      color: category.color,
      legendFontColor: "#fff",
    }));
  };

  if (loading) {
    return (
      <View className="flex-1 bg-zinc-900 justify-center items-center">
        <ActivityIndicator size="large" color="#A78BFA" />
      </View>
    );
  }

  if (error || !user) {
    return (
      <View className="flex-1 bg-zinc-900 justify-center items-center px-4">
        <Text className="text-white text-lg text-center mb-4">
          {error || "Failed to load user data"}
        </Text>
        <TouchableOpacity
          className="bg-violet-500 rounded-xl py-4 px-8"
          onPress={loadData}
        >
          <Text className="text-white font-semibold text-lg">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const recentTransactions = getRecentTransactions();
  const weeklySpend = calculateWeeklySpend();
  const pieData = calculateCategorySpends();

  return (
    <ScrollView className="flex-1 bg-zinc-900">
      <View className="flex-row justify-between items-center p-4">
        <Text className="text-white text-2xl font-semibold">
          Welcome, {user?.name ?? "User"}
        </Text>
        <View className="w-10 h-10 rounded-full bg-violet-500 items-center justify-center">
          <Text className="text-white text-lg font-medium">
            {user?.name?.[0] ?? "U"}
          </Text>
        </View>
      </View>

      <View className="mx-4 bg-zinc-800 rounded-xl p-4 mb-4">
        <View className="flex-row items-center space-x-2 mb-4 gap-2">
          <Text className="text-white text-3xl font-bold">
            $ {formatBalance(user?.balance ?? 0)}
          </Text>
          <Eye onPress={toggleBalance} size={24} color="white" />
        </View>
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-gray-400">Nº of transactions this month</Text>
          <Text className="text-violet-400 text-lg">{spends?.length ?? 0}</Text>
        </View>

        <Text className="text-gray-400 mb-2">Last transactions</Text>
        {recentTransactions && recentTransactions.length > 0 ? (
          <View className="space-y-2 gap-1">
            {recentTransactions.map((tx) => (
              <View
                key={tx.id}
                className="flex-row justify-between items-center"
              >
                <View>
                  <Text className="text-white">{tx.name}</Text>
                  <Text className="text-gray-400 text-sm">{tx.date}</Text>
                </View>
                <Text className="text-white">$ {tx.amount.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View className="items-center justify-center py-8">
            <List size={64} color="#CCCCCC" />
            <Text className="text-gray-400 mt-4 text-center">
              No transactions available yet.
            </Text>
          </View>
        )}
        {recentTransactions && recentTransactions.length > 0 && (
          <TouchableOpacity
            onPress={() => router.push("/account")}
            className="mt-3"
          >
            <Text className="text-violet-400 text-center">See all</Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-row mx-4 space-x-4 mb-6 gap-4">
        <View className="flex-1 bg-red-400 p-4 rounded-xl">
          <View className="flex-row items-center space-x-2 mb-1 gap-2">
            <CreditCard size={22} color="#18181b" />
            <Text className="text-zinc-900 text-lg font-semibold">
              Total Spent
            </Text>
          </View>
          <Text className="text-zinc-900 text-xl font-bold">
            $
            {spends
              ? spends
                  .reduce((total, spend) => total + (spend?.amount ?? 0), 0)
                  .toFixed(2)
              : "0.00"}
          </Text>
        </View>
        <View className="flex-1 bg-violet-500 p-4 rounded-xl">
          <View className="flex-row items-center space-x-2 mb-1 gap-2">
            <CreditCard size={22} color="#18181b" />
            <Text className="text-zinc-900 text-lg font-semibold">
              Total Balance
            </Text>
          </View>
          <Text className="text-zinc-900 text-xl font-bold">
            ${formatBalance(user?.balance ?? 0)}
          </Text>
        </View>
      </View>

      <View className="mx-4 mb-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white text-xl">Weekly spend</Text>
          <Text className="text-violet-400 text-xl">
            ${weeklySpend ? weeklySpend.toFixed(2) : "0.00"}
          </Text>
        </View>

        <View className="bg-zinc-800 p-4 rounded-xl">
          {weeklySpend && weeklySpend > 0 && pieData && pieData.length > 0 ? (
            <>
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
                    <Text className="text-white">
                      $ {item.amount.toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <View className="items-center justify-center py-8">
              <BarChart2 size={64} color="#CCCCCC" />
              <Text className="text-gray-400 mt-4 text-center">
                No spending data available for this week.
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
