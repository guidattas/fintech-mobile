import { Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { auth } from '@/lib/auth'
import { registerForPushNotifications } from '@/lib/push'
import { theme } from '@/lib/theme'

export default function RootLayout() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    auth
      .getToken()
      .then((token) => {
        if (token) registerForPushNotifications().catch(() => {})
      })
      .finally(() => setReady(true))
  }, [])

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.color.bg,
        }}
      >
        <ActivityIndicator size="large" color={theme.color.yellow} />
      </View>
    )
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaProvider>
  )
}
