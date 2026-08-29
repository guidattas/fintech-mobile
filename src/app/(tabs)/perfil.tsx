import { useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Feather } from '@expo/vector-icons'
import { router } from 'expo-router'
import { auth } from '@/lib/auth'
import { theme } from '@/lib/theme'

interface User {
  name?: string
  email?: string
  establishment?: { brandName?: string; document?: string }
}

export default function PerfilScreen() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    auth.getUser<User>().then(setUser)
  }, [])

  async function handleLogout() {
    await auth.clear()
    router.replace('/login')
  }

  const name = user?.name || user?.email || '—'
  const brand = user?.establishment?.brandName || '—'

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>{(name.charAt(0) || 'M').toUpperCase()}</Text>
        </View>
        <Text style={s.name}>{name}</Text>
        <Text style={s.brand}>{brand}</Text>
      </View>

      <View style={s.list}>
        <Row icon="user" label="Meus dados" />
        <Row icon="shield" label="Segurança" />
        <Row icon="bell" label="Notificações" />
        <Row icon="help-circle" label="Ajuda" />
      </View>

      <Pressable style={s.logout} onPress={handleLogout}>
        <Feather name="log-out" size={16} color="#DC2626" />
        <Text style={s.logoutText}>Sair</Text>
      </Pressable>
    </SafeAreaView>
  )
}

function Row({
  icon,
  label,
}: {
  icon: React.ComponentProps<typeof Feather>['name']
  label: string
}) {
  return (
    <Pressable style={s.row}>
      <Feather name={icon} size={18} color={theme.color.textMuted} />
      <Text style={s.rowLabel}>{label}</Text>
      <Feather name="chevron-right" size={18} color={theme.color.textSubtle} />
    </Pressable>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.color.bg, padding: 20 },
  header: { alignItems: 'center', marginTop: 16, marginBottom: 24 },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: theme.color.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: theme.color.dark,
    fontSize: 26,
    fontWeight: theme.font.weightBlack,
  },
  name: {
    fontSize: 17,
    fontWeight: theme.font.weightBold,
    color: theme.color.text,
  },
  brand: { fontSize: 12, color: theme.color.textMuted, marginTop: 2 },
  list: {
    backgroundColor: '#fff',
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.color.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.color.border,
  },
  rowLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: theme.font.weightSemi,
    color: theme.color.text,
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    padding: 14,
    backgroundColor: '#FEE2E2',
    borderRadius: theme.radius.md,
  },
  logoutText: {
    color: '#DC2626',
    fontWeight: theme.font.weightBold,
    fontSize: 14,
  },
})
