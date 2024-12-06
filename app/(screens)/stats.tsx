import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  ChevronDown,
  ChevronRight,
  CreditCard,
  PieChart as PieChartIcon,
  List,
} from "lucide-react-native";
import { PieChart } from "react-native-chart-kit";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import { useRouter } from "expo-router";
import { fetchUserSpends, fetchUserData, userId } from "../../services/api";
import { Spend, User } from "../../models/data";

const categoryColors = {
  "Car Payment": "#A78BFA",
  Games: "#FFD700",
  Food: "#87CEEB",
  "Home spends": "#FF69B4",
  Others: "#9966FF",
};

export default function StatsScreen() {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [spends, setSpends] = useState<Spend[]>([]);
  const [userData, setUserData] = useState<User | null>(null);
  const [filteredSpends, setFilteredSpends] = useState<Spend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [fetchedSpends, fetchedUserData] = await Promise.all([
          fetchUserSpends(userId),
          fetchUserData(userId),
        ]);
        setSpends(fetchedSpends || []);
        setUserData(fetchedUserData);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again.");
        setSpends([]);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filterSpendsByMonth = () => {
      if (spends && spends.length > 0) {
        const filteredSpends = spends.filter((spend) => {
          const [day, month, year] = spend.date.split("-");
          const spendDate = new Date(
            2000 + parseInt(year),
            parseInt(month) - 1,
            parseInt(day)
          );
          return (
            spendDate.getMonth() === date.getMonth() &&
            spendDate.getFullYear() === date.getFullYear()
          );
        });
        setFilteredSpends(filteredSpends);
      } else {
        setFilteredSpends([]);
      }
    };
    filterSpendsByMonth();
  }, [date, spends]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const calculateTotalSpent = () => {
    return filteredSpends.reduce((total, spend) => total + spend.amount, 0);
  };

  const calculatePieData = () => {
    const categoryTotals = filteredSpends.reduce((acc, spend) => {
      acc[spend.category] = (acc[spend.category] || 0) + spend.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryTotals).map(([name, amount]) => ({
      name,
      amount,
      color: categoryColors[name as keyof typeof categoryColors] || "#9966FF",
    }));
  };

  const calculateTransactionGroups = () => {
    const groups = filteredSpends.reduce((acc, spend) => {
      if (!acc[spend.category]) {
        acc[spend.category] = { transactions: 0, amount: 0 };
      }
      acc[spend.category].transactions += 1;
      acc[spend.category].amount += spend.amount;
      return acc;
    }, {} as Record<string, { transactions: number; amount: number }>);

    return Object.entries(groups).map(([name, data], index) => ({
      id: index + 1,
      name,
      color: categoryColors[name as keyof typeof categoryColors] || "#9966FF",
      transactions: data.transactions,
      amount: data.amount,
    }));
  };

  const hasSpends = filteredSpends.length > 0;

  if (loading) {
    return (
      <View className="flex-1 bg-zinc-900 justify-center items-center">
        <ActivityIndicator size="large" color="#A78BFA" />
      </View>
    );
  }

  if (error || !userData) {
    return (
      <View className="flex-1 bg-zinc-900 justify-center items-center px-4">
        <Text className="text-white text-lg text-center mb-4">
          {error || "User data not found"}
        </Text>
        <TouchableOpacity
          className="bg-violet-500 rounded-xl py-4 px-8"
          onPress={() => {
            setLoading(true);
            setError(null);
            fetchUserData(userId);
          }}
        >
          <Text className="text-white font-semibold text-lg">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-zinc-900 px-4">
      <View className="flex-row justify-between items-center py-4">
        <Text className="text-white text-2xl font-semibold">Stats</Text>
        <View className="w-8 h-8 rounded-full bg-violet-500 items-center justify-center">
          <Text className="text-white text-sm font-medium">
            {userData?.name.charAt(0).toUpperCase()}
          </Text>
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
          <Text className="text-zinc-900 text-xl font-bold">
            ${hasSpends ? calculateTotalSpent().toFixed(2) : "0.00"}
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
            ${userData?.balance?.toFixed(2) || "0.00"}
          </Text>
        </View>
      </View>

      <View className="bg-zinc-800 rounded-xl p-4 mb-6">
        {hasSpends ? (
          <>
            <PieChart
              data={calculatePieData()}
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
              {calculatePieData().map((item, index) => (
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
                  <Text className="text-white">$ {item.amount.toFixed(2)}</Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <View className="items-center justify-center py-8">
            <PieChartIcon size={64} color="#CCCCCC" />
            <Text className="text-gray-400 mt-4 text-center">
              No spend data available for this month.
            </Text>
          </View>
        )}
      </View>

      <Text className="text-white text-xl mb-4">Transaction Categories</Text>
      {hasSpends ? (
        calculateTransactionGroups().map((group) => (
          <TouchableOpacity
            key={group.id}
            className="bg-zinc-800 rounded-xl p-4 mb-3 flex-row items-center"
            onPress={() =>
              router.push({
                pathname: "/transaction-details",
                params: {
                  category: group.name,
                  color: group.color,
                  month: (date.getMonth() + 1).toString().padStart(2, "0"),
                  year: date.getFullYear().toString().slice(-2),
                },
              })
            }
          >
            <View
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: group.color }}
            >
              <Text className="text-white font-medium">
                {group.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-white font-medium">{group.name}</Text>
              <Text className="text-gray-400">
                {group.transactions} Transactions
              </Text>
            </View>
            <View className="flex-row items-center space-x-2">
              <Text className="text-white font-medium">
                ${group.amount.toFixed(2)}
              </Text>
              <ChevronRight size={20} color="white" />
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <View className="bg-zinc-800 rounded-xl p-8 items-center justify-center">
          <List size={64} color="#CCCCCC" />
          <Text className="text-gray-400 mt-4 text-center">
            No transactions available for this month.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
