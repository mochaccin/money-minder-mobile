import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { addCard, addCardToUser } from "../../services/api";

export default function AddCardScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState({
    card_name: "",
    owner: "6752261b020cfec6c361f005",
    card_type: true,
    card_number: "",
    card_expiration_date: "",
    card_cvv: "",
  });

  const handleAddCard = async () => {
    if (
      !cardData.card_name ||
      !cardData.card_number ||
      !cardData.card_cvv ||
      !cardData.card_expiration_date
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const newCard = await addCard(cardData);
      console.log("New card:", newCard);
      Alert.alert("Success", "Card added successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error adding card:", error);
      Alert.alert("Error", "Failed to add card. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#111111] px-4">
      <View className="flex-row items-center py-4 gap-4">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="#A78BFA" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-semibold">Add Card</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="bg-zinc-800 rounded-xl p-6 my-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-xl">
              {cardData.card_name || "Card Name"}
            </Text>
            <Image
              source={
                cardData.card_type
                  ? require("../../assets/images/mastercard.png")
                  : require("../../assets/images/visa.png")
              }
              className="w-12 h-12"
              resizeMode="contain"
            />
          </View>
          <Text className="text-gray-400 text-lg">
            {cardData.card_number || "**** **** **** ****"}
          </Text>
          <Text className="text-gray-400">
            Expires: {cardData.card_expiration_date || "MM/YY"}
          </Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-gray-400 mb-4">Card Name</Text>
            <TextInput
              className="bg-zinc-800 text-white p-4 rounded-xl mb-4"
              placeholderTextColor="#666"
              placeholder="Enter card name"
              value={cardData.card_name}
              onChangeText={(text) =>
                setCardData({ ...cardData, card_name: text })
              }
            />
          </View>

          <View>
            <Text className="text-gray-400 mb-4">Card Type</Text>
            <View className="flex-row gap-4 mb-4">
              <TouchableOpacity
                className={`flex-1 p-4 rounded-xl flex-row items-center justify-center gap-2 ${
                  cardData.card_type ? "bg-violet-500" : "bg-zinc-800"
                }`}
                onPress={() => setCardData({ ...cardData, card_type: true })}
              >
                <Image
                  source={require("../../assets/images/mastercard.png")}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
                <Text className="text-white">Mastercard</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 p-4 rounded-xl flex-row items-center justify-center gap-2 ${
                  !cardData.card_type ? "bg-violet-500" : "bg-zinc-800"
                }`}
                onPress={() => setCardData({ ...cardData, card_type: false })}
              >
                <Image
                  source={require("../../assets/images/visa.png")}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
                <Text className="text-white">Visa</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-gray-400 mb-4">Card Number</Text>
            <TextInput
              className="bg-zinc-800 text-white p-4 rounded-xl"
              placeholderTextColor="#666"
              placeholder="**** **** **** ****"
              keyboardType="numeric"
              maxLength={19}
              value={cardData.card_number}
              onChangeText={(text) => {
                const formatted = text
                  .replace(/\s/g, "")
                  .replace(/(\d{4})/g, "$1 ")
                  .trim();
                setCardData({ ...cardData, card_number: formatted });
              }}
            />
          </View>

          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="text-gray-400 mb-4">Expiration Date</Text>
              <TextInput
                className="bg-zinc-800 text-white p-4 rounded-xl"
                placeholderTextColor="#666"
                placeholder="MM/YY"
                maxLength={5}
                value={cardData.card_expiration_date}
                onChangeText={(text) => {
                  const formatted = text
                    .replace(/\D/g, "")
                    .replace(/(\d{2})(\d)/, "$1/$2");
                  setCardData({ ...cardData, card_expiration_date: formatted });
                }}
              />
            </View>
            <View className="flex-1 mb-2">
              <Text className="text-gray-400 mb-4">CVV</Text>
              <TextInput
                className="bg-zinc-800 text-white p-4 rounded-xl"
                placeholderTextColor="#666"
                placeholder="***"
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
                value={cardData.card_cvv}
                onChangeText={(text) =>
                  setCardData({ ...cardData, card_cvv: text })
                }
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          className="bg-violet-500 rounded-xl py-4 px-8 my-6"
          onPress={handleAddCard}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-semibold text-center text-lg">
              Add Card
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
