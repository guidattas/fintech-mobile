import { useEffect, useState } from 'react'
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MovibankLogo } from '@/components/MovibankLogo'
import { HeroBalance } from '@/components/HeroBalance'
import { QuickActions, type QuickAction } from '@/components/QuickActions'
import { RecentMovements, type Movement } from '@/components/RecentMovements'
import { walletApi } from '@/lib/api'
import { auth } from '@/lib/auth'
import { theme } from '@/lib/theme'

const RECENT_MOCK: Movement[] = [
  { id: '1', kind: 'in', title: 'PIX recebido', subtitle: 'Maria S. · há 12 min', amount: 250, sign: '+' },
  { id: '2', kind: 'card', title: 'Venda cartão', subtitle: 'POS #4127 · há 1h', amount: 89.9, sign: '+' },
  { id: '3', kind: 'out', title: 'TED enviado', subtitle: 'Fornecedor X · 2h', amount: 1200, sign: '-' },
  { id: '4', kind: 'boleto', title: 'Boleto liquidado', subtitle: 'Ordem #8801 · ontem', amount: 435, sign: '+' },
]

export default function DashboardScreen() {
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [name, setName] = useState('')

  const load = async () => {
    try {
      const res = await walletApi.balance()
      setBalance(res.data.saldo ?? res.data.balance ?? 0)
    } catch (err) {
      console.warn('Wallet load error:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    auth.getUser<{ name?: string; email?: string }>().then((u) => {
      setName((u?.name ?? u?.email ?? '').split(' ')[0].split('@')[0])
    })
    load()
  }, [])

  const actions: QuickAction[] = [
    { key: 'historico', label: 'Histórico', icon: 'list' },
    { key: 'extrato', label: 'Extrato', icon: 'dollar-sign' },
    { key: 'pagar', label: 'Pagar', icon: 'home' },
    { key: 'link', label: 'Link', icon: 'link-2' },
    { key: 'pix', label: 'PIX', icon: 'zap', highlighted: true },
    { key: 'boleto', label: 'Boletos', icon: 'file-text' },
    { key: 'ted', label: 'TED', icon: 'arrow-up' },
    { key: 'ver', label: 'Ver mais', icon: 'more-horizontal' },
  ]

  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  })
  const dateStr = today.charAt(0).toUpperCase() + today.slice(1)

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={s.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true)
              load()
            }}
            tintColor={theme.color.yellow}
          />
        }
      >
        <View style={s.topRow}>
          <MovibankLogo width={110} variant="default" />
          <View style={s.avatar}>
            <Text style={s.avatarText}>{name.charAt(0).toUpperCase() || 'M'}</Text>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={s.date}>{dateStr}</Text>
          <Text style={s.hello}>Olá, {name || 'representante'}</Text>
        </View>

        <View style={s.section}>
          <HeroBalance balance={balance} loading={loading} />
        </View>

        <View style={s.section}>
          <QuickActions actions={actions} />
        </View>

        <View style={s.section}>
          <RecentMovements items={RECENT_MOCK} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.color.bg },
  scroll: { padding: 16, paddingBottom: 32 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.color.yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: theme.color.dark,
    fontWeight: theme.font.weightBlack,
    fontSize: 14,
  },
  date: { fontSize: 12, color: theme.color.textSubtle },
  hello: {
    fontSize: 22,
    fontWeight: theme.font.weightBold,
    color: theme.color.text,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  section: { marginTop: 20 },
})
