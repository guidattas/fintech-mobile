import { Tabs, router } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { useEffect } from 'react'
import { auth } from '@/lib/auth'
import { theme } from '@/lib/theme'

export default function TabsLayout() {
  useEffect(() => {
    auth.getToken().then((t) => {
      if (!t) router.replace('/login')
    })
  }, [])

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.color.yellow,
        tabBarInactiveTintColor: theme.color.textSubtle,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: theme.color.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="extrato"
        options={{
          title: 'Extrato',
          tabBarIcon: ({ color, size }) => (
            <Feather name="credit-card" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pix"
        options={{
          title: 'PIX',
          tabBarIcon: ({ color, size }) => (
            <Feather name="zap" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
