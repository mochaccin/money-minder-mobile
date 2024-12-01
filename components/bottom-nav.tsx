import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { Home, Folder, PlusCircle, CreditCard, LineChart } from 'lucide-react-native'
import { useRouter, usePathname } from 'expo-router'

interface NavItemProps {
  icon: React.ReactNode
  label: string
  isActive?: boolean
  onPress: () => void
}

const NavItem = ({ icon, label, isActive, onPress }: NavItemProps) => (
  <Pressable 
    onPress={onPress}
    className="items-center justify-center p-2"
  >
    <View className={`p-2 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
      {React.cloneElement(icon as React.ReactElement, { 
        size: 24,
        color: isActive ? '#A78BFA' : '#FFFFFF',
        strokeWidth: 2
      })}
    </View>
    <Text className={`text-xs ${isActive ? 'text-violet-400' : 'text-white/70'}`}>
      {label}
    </Text>
  </Pressable>
)

export default function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <View className="flex-row items-center justify-between bg-[#2A2A2A] px-4 py-2 rounded-tl-3xl">
      <NavItem
        icon={<Home />}
        label="Home"
        isActive={pathname === '/'}
        onPress={() => router.push('/')}
      />
      <NavItem
        icon={<Folder />}
        label="Account"
        isActive={pathname === '/(screens)/account'}
        onPress={() => router.push('/(screens)/account')}
      />
      <Pressable 
        onPress={() => router.push('/(screens)/add-spend')}
        className="bg-violet-400 rounded-2xl p-4 -mt-8"
      >
        <PlusCircle size={32} color="#000000" strokeWidth={2} />
      </Pressable>
      <NavItem
        icon={<CreditCard />}
        label="Cards"
        isActive={pathname === '/(screens)/cards'}
        onPress={() => router.push('/(screens)/cards')}
      />
      <NavItem
        icon={<LineChart />}
        label="Stats"
        isActive={pathname === '/(screens)/stats'}
        onPress={() => router.push('/(screens)/stats')}
      />
    </View>
  )
}
