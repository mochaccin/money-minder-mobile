import React, { useState } from 'react'
import { View, Text, TextInput, Pressable, ScrollView, Alert } from 'react-native'
import { CreditCard, DollarSign, ChevronDown } from 'lucide-react-native'
import { useRouter } from 'expo-router'
import { Picker } from '@react-native-picker/picker'
import { mockCards, Card, Spend } from '../../mocks/data'

const categories = [
  'Home Bills',
  'Food',
  'Games',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Healthcare',
  'Education'
]

export default function AddSpendScreen() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [category, setCategory] = useState(categories[0])

  const formatAmount = (value: string) => {
    const numeric = value.replace(/[^0-9]/g, '')
    const formatted = new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(Number(numeric))
    return formatted
  }

  const handleAmountChange = (value: string) => {
    setAmount(value.replace(/[^0-9]/g, ''))
  }

  const handleAddSpend = () => {
    if (!name || !amount || !selectedCard) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    const newSpend: Spend = {
      name,
      date: new Date().toLocaleDateString('es-CL'),
      category,
      amount: Number(amount),
      owner: { $oid: "66b6f687ba562c138887ac1c" }, // Hardcoded for this example
      payment_card: selectedCard._id
    }

    console.log('New spend:', newSpend)
    Alert.alert('Success', 'Spend added successfully')
    router.back() // Navigate back after adding the spend
  }

  return (
    <View className="flex-1 bg-[#111111]">
      <View className="flex-row justify-between items-center p-4 mb-6">
        <Text className="text-white text-xl font-semibold">Add a new spend</Text>
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
              style={{ color: 'white' }}
              dropdownIconColor="white"
            >
              {categories.map((cat) => (
                <Picker.Item key={cat} label={cat} value={cat} />
              ))}
            </Picker>
          </View>
        </View>

        <View className="space-y-4 flex flex-col gap-4">
          {mockCards.map((card) => (
            <Pressable
              key={card._id.$oid}
              className={`flex-row items-center justify-between p-4 rounded-lg ${
                selectedCard?._id.$oid === card._id.$oid ? 'bg-violet-500/20' : 'bg-zinc-800'
              }`}
              onPress={() => setSelectedCard(card)}
            >
              <View className="flex-row items-center">
                <Text className="text-violet-400 mr-2">{card.card_name}</Text>
                <CreditCard 
                  size={20} 
                  color={card.card_type ? '#fff' : '#fff'} 
                />
              </View>
              <View className="flex-row items-center">
                <Text className="text-white mr-4">
                  **** **** **** {card.card_number.slice(-4)}
                </Text>
                <View className={`w-5 h-5 rounded-full border-2 border-violet-400 ${
                  selectedCard?._id.$oid === card._id.$oid ? 'bg-violet-400' : 'bg-transparent'
                }`} />
              </View>
            </Pressable>
          ))}
        </View>

        <Pressable
          className="bg-violet-500 p-4 rounded-lg mt-8 mb-8"
          onPress={handleAddSpend}
        >
          <Text className="text-white text-center font-semibold">Add Spend</Text>
        </Pressable>
      </ScrollView>
    </View>
  )
}

