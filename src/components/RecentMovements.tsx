import { StyleSheet, Text, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { theme } from '@/lib/theme'
import { fmtMoney } from '@/lib/format'

export type MovementKind = 'in' | 'out' | 'card' | 'boleto'

export interface Movement {
  id: string
  kind: MovementKind
  title: string
  subtitle: string
  amount: number
  sign: '+' | '-'
}

const kindStyle: Record<
  MovementKind,
  { bg: string; color: string; icon: React.ComponentProps<typeof Feather>['name'] }
> = {
  in: { bg: theme.color.successBg, color: theme.color.successText, icon: 'arrow-down' },
  out: { bg: '#FEE2E2', color: '#DC2626', icon: 'arrow-up' },
  card: { bg: theme.color.yellowSoft, color: theme.color.yellowText, icon: 'credit-card' },
  boleto: { bg: theme.color.successBg, color: theme.color.successText, icon: 'arrow-down' },
}

interface Props {
  items: Movement[]
  emptyLabel?: string
}

export function RecentMovements({ items, emptyLabel = 'Sem movimentações' }: Props) {
  return (
    <View style={s.card}>
      <View style={s.header}>
        <Text style={s.title}>Últimas movimentações</Text>
        <Text style={s.link}>Ver todas</Text>
      </View>
      {items.length === 0 ? (
        <Text style={s.empty}>{emptyLabel}</Text>
      ) : (
        items.map((m, i) => {
          const st = kindStyle[m.kind]
          const amountColor =
            m.sign === '+'
              ? theme.color.successText
              : m.kind === 'out'
                ? theme.color.textMuted
                : theme.color.text
          return (
            <View
              key={m.id}
              style={[s.row, i < items.length - 1 && s.rowBorder]}
            >
              <View style={[s.iconWrap, { backgroundColor: st.bg }]}>
                <Feather name={st.icon} size={14} color={st.color} />
              </View>
              <View style={s.rowText}>
                <Text style={s.rowTitle} numberOfLines={1}>
                  {m.title}
                </Text>
                <Text style={s.rowSub} numberOfLines={1}>
                  {m.subtitle}
                </Text>
              </View>
              <Text style={[s.amount, { color: amountColor }]}>
                {m.sign} R$ {fmtMoney(m.amount)}
              </Text>
            </View>
          )
        })
      )}
    </View>
  )
}

const s = StyleSheet.create({
  card: {
    backgroundColor: theme.color.surface,
    borderWidth: 1,
    borderColor: theme.color.border,
    borderRadius: theme.radius.lg,
    padding: theme.space.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: { fontSize: 14, fontWeight: theme.font.weightBold, color: theme.color.text },
  link: { fontSize: 12, fontWeight: theme.font.weightSemi, color: theme.color.yellowText },
  empty: { color: theme.color.textMuted, textAlign: 'center', paddingVertical: 16, fontSize: 13 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: '#F5F5F3' },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1, minWidth: 0 },
  rowTitle: { fontSize: 13, fontWeight: theme.font.weightSemi, color: theme.color.text },
  rowSub: { fontSize: 11, color: theme.color.textSubtle, marginTop: 1 },
  amount: { fontSize: 13, fontWeight: theme.font.weightBold },
})
