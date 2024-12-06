import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { CreditCard, DollarSign } from "lucide-react-native";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { Card, Spend } from "../../models/data";
import { format } from "date-fns";
import {
  fetchCards,
  createSpend,
  addSpendToUser,
  addSpendToCard,
  userId,
  updateUserBalance,
  fetchUserData,
} from "../../services/api";

const categories = ["Food", "Transport", "Entertainment", "Shopping", "Others"];

export default function AddSpendScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [category, setCategory] = useState(categories[0]);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      setLoading(true);
      const fetchedCards = await fetchCards();
      setCards(fetchedCards);
    } catch (err) {
      setError("Failed to load cards. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (value: string) => {
    const numeric = value.replace(/[^0-9]/g, "");
    const formatted = new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(Number(numeric));
    return formatted;
  };

  const handleAmountChange = (value: string) => {
    setAmount(value.replace(/[^0-9]/g, ""));
  };

  const handleAddSpend = async () => {
    if (!name || !amount || !selectedCard) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newSpend: Omit<Spend, "id"> = {
        name,
        date: format(new Date(), "dd-MM-yy"),
        category,
        amount: Number(amount),
        owner: userId,
        payment_card: selectedCard.id!,
      };

      const spendId = await createSpend(newSpend);

      await Promise.all([
        addSpendToUser(userId, spendId),
        addSpendToCard(selectedCard.id!, spendId),
      ]);

      const userData = await fetchUserData(userId);
      const currentBalance = userData.balance;

      const newBalance = currentBalance - Number(amount);

      await updateUserBalance(userId, newBalance);

      Alert.alert("Success", "Spend added and balance updated successfully");
      router.back();
    } catch (err) {
      setError("Failed to add spend. Please try again.");
      Alert.alert("Error", "Failed to add spend. Please try again.");
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

  if (!cards || cards.length === 0) {
    return (
      <View className="flex-1 bg-[#111111] px-4">
        <View className="flex-row justify-between items-center py-4">
          <Text className="text-white text-2xl font-semibold">
            No cards available
          </Text>
          <View className="w-8 h-8 rounded-full bg-violet-500 items-center justify-center">
            <Text className="text-white text-sm font-medium">N</Text>
          </View>
        </View>

        <View className="flex-1 items-center justify-center -mt-20">
          <Image
            source={{
              uri: "https://static-cdn.jtvnw.net/jtv_user_pictures/44daa95b-1b87-468c-acb9-9807af63393b-profile_image-300x300.png",
            }}
            className="w-60 h-60"
            resizeMode="contain"
          />
          <Text className="text-white text-2xl font-bold mt-4 mb-2">
            You don't have any cards
          </Text>
          <Text className="text-gray-400 text-center mb-8 px-6">
            You need to create a card before being able to register spends.
          </Text>
          <TouchableOpacity
            className="bg-violet-500 rounded-xl py-4 px-8"
            onPress={() => router.push("/add-card")}
          >
            <Text className="text-white font-semibold text-lg flex-row items-center">
              + Add a card
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#111111]">
      <View className="flex-row justify-between items-center p-4 mb-6">
        <Text className="text-white text-xl font-semibold">
          Add a new spend
        </Text>
        <View className="w-8 h-8 rounded-full bg-violet-500 items-center justify-center">
          <Text className="text-white text-sm font-medium">N</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4">
        <View className="mb-8">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 rounded-full bg-violet-500 items-center justify-center mb-2">
              <DollarSign size={24} color="white" />
            </View>
            <Text className="text-white/70 text-lg ml-2">Add spend title</Text>
          </View>
          <TextInput
            className="w-full bg-zinc-800 text-white p-4 rounded-lg"
            placeholder="Coca cola"
            placeholderTextColor="#666"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View className="mb-8">
          <Text className="text-white/70 text-lg mb-2">Add price</Text>
          <TextInput
            className="w-full bg-zinc-800 text-white p-4 rounded-lg"
            placeholder="$0 CLP"
            placeholderTextColor="#666"
            value={formatAmount(amount)}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
          />
        </View>

        <View className="mb-8">
          <Text className="text-white/70 text-lg mb-2">Select category</Text>
          <View className="bg-zinc-800 rounded-lg">
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              style={{ color: "white" }}
              dropdownIconColor="white"
            >
              {categories.map((cat) => (
                <Picker.Item key={cat} label={cat} value={cat} />
              ))}
            </Picker>
          </View>
        </View>

        <View className="space-y-4 flex flex-col gap-4">
          {cards.map((card) => (
            <TouchableOpacity
              key={card.id}
              className={`flex-row items-center justify-between p-6 rounded-lg ${
                selectedCard?.id === card.id
                  ? "bg-violet-500/20"
                  : "bg-zinc-800"
              }`}
              onPress={() => setSelectedCard(card)}
            >
              <View className="flex-row items-center">
                <Text className="text-violet-400 mr-2 text-xl">
                  {card.card_name}
                </Text>
                <CreditCard
                  size={24}
                  color={card.card_type ? "#fff" : "#fff"}
                />
              </View>
              <View className="flex-row items-center">
                <Text className="text-white mr-4 text-lg">
                  **** **** **** {card.card_number.slice(-4)}
                </Text>
                <View
                  className={`w-5 h-5 rounded-full border-2 border-violet-400 ${
                    selectedCard?.id === card.id
                      ? "bg-violet-400"
                      : "bg-transparent"
                  }`}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          className="bg-violet-500 p-4 rounded-lg mt-10 mb-8"
          onPress={handleAddSpend}
          disabled={loading}
        >
          <Text className="text-white text-center font-semibold">
            {loading ? "Adding Spend..." : "Add Spend"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
