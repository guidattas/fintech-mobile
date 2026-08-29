import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Feather } from '@expo/vector-icons'
import { transactionsApi, type Transaction } from '@/lib/api'
import { fmtCurrency } from '@/lib/format'
import { theme } from '@/lib/theme'

type Filter = 'all' | 'in' | 'out'

const OUT_TYPES = new Set(['PIX_OUT', 'REFUND', 'WITHDRAW', 'PAYMENT'])

export default function ExtratoScreen() {
  const [items, setItems] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>('all')

  const load = useCallback(async () => {
    try {
      setError(null)
      const { data } = await transactionsApi.list()
      setItems(data)
    } catch (e: any) {
      setError('Não foi possível carregar o extrato.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(() => {
    if (filter === 'all') return items
    return items.filter((t) => {
      const isOut = OUT_TYPES.has(t.type)
      return filter === 'out' ? isOut : !isOut
    })
  }, [items, filter])

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Text style={s.title}>Extrato</Text>
        <Text style={s.subtitle}>{items.length} movimentações</Text>
      </View>

      <View style={s.tabs}>
        <TabButton label="Tudo" active={filter === 'all'} onPress={() => setFilter('all')} />
        <TabButton label="Entradas" active={filter === 'in'} onPress={() => setFilter('in')} />
        <TabButton label="Saídas" active={filter === 'out'} onPress={() => setFilter('out')} />
      </View>

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator color={theme.color.yellow} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(t) => t.id}
          contentContainerStyle={s.list}
          ItemSeparatorComponent={() => <View style={s.sep} />}
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
          ListEmptyComponent={
            <View style={s.center}>
              <Feather name={error ? 'alert-circle' : 'inbox'} size={28} color={theme.color.textSubtle} />
              <Text style={s.emptyText}>{error ?? 'Nenhuma movimentação por enquanto.'}</Text>
            </View>
          }
          renderItem={({ item }) => <Row tx={item} />}
        />
      )}
    </SafeAreaView>
  )
}

function TabButton({
  label,
  active,
  onPress,
}: {
  label: string
  active: boolean
  onPress: () => void
}) {
  return (
    <Pressable onPress={onPress} style={[s.tab, active && s.tabActive]}>
      <Text style={[s.tabText, active && s.tabTextActive]}>{label}</Text>
    </Pressable>
  )
}

function Row({ tx }: { tx: Transaction }) {
  const isOut = OUT_TYPES.has(tx.type)
  const icon: React.ComponentProps<typeof Feather>['name'] = isOut
    ? 'arrow-up-right'
    : 'arrow-down-left'
  const color = isOut ? '#DC2626' : theme.color.success
  const bg = isOut ? '#FEE2E2' : theme.color.successBg
  const sign = isOut ? '-' : '+'
  const date = new Date(tx.createdAt)
  const dateStr = `${date.toLocaleDateString('pt-BR')} · ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`

  return (
    <View style={s.row}>
      <View style={[s.rowIcon, { backgroundColor: bg }]}>
        <Feather name={icon} size={18} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.rowTitle} numberOfLines={1}>
          {tx.description || labelForType(tx.type)}
        </Text>
        <Text style={s.rowMeta}>{dateStr}</Text>
      </View>
      <Text style={[s.rowAmount, { color }]}>
        {sign} {fmtCurrency(tx.amount)}
      </Text>
    </View>
  )
}

function labelForType(t: string) {
  switch (t) {
    case 'PIX_IN':
      return 'PIX recebido'
    case 'PIX_OUT':
      return 'PIX enviado'
    case 'REFUND':
      return 'Estorno'
    case 'WITHDRAW':
      return 'Saque'
    case 'PAYMENT':
      return 'Pagamento'
    default:
      return t
  }
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.color.bg },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: theme.font.weightBlack, color: theme.color.text },
  subtitle: { fontSize: 12, color: theme.color.textMuted, marginTop: 2 },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: theme.color.border,
  },
  tabActive: { backgroundColor: theme.color.dark, borderColor: theme.color.dark },
  tabText: { fontSize: 12, fontWeight: theme.font.weightSemi, color: theme.color.textMuted },
  tabTextActive: { color: '#fff' },
  list: { paddingHorizontal: 20, paddingBottom: 24, flexGrow: 1 },
  sep: { height: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.color.border,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: { fontSize: 14, fontWeight: theme.font.weightSemi, color: theme.color.text },
  rowMeta: { fontSize: 11, color: theme.color.textMuted, marginTop: 2 },
  rowAmount: { fontSize: 14, fontWeight: theme.font.weightBold, fontVariant: ['tabular-nums'] },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 12 },
  emptyText: { fontSize: 13, color: theme.color.textMuted, textAlign: 'center' },
})
