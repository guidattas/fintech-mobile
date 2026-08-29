import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { theme } from '@/lib/theme'
import { fmtMoney } from '@/lib/format'

interface Props {
  balance: number
  toRelease?: number
  blocked?: number
  loading?: boolean
  onAddBalance?: () => void
  onTransfer?: () => void
}

export function HeroBalance({
  balance,
  toRelease = 0,
  blocked = 0,
  loading = false,
  onAddBalance,
  onTransfer,
}: Props) {
  const [hidden, setHidden] = useState(false)

  return (
    <LinearGradient
      colors={[theme.color.dark, theme.color.darkAlt]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={s.card}
    >
      <View style={s.glow} pointerEvents="none" />

      <View style={s.headerRow}>
        <Feather name="credit-card" size={14} color={theme.color.yellowLight} />
        <Text style={s.label}>Saldo disponível</Text>
      </View>

      <View style={s.valueRow}>
        <Text style={s.currency}>R$</Text>
        <Text style={s.value}>
          {loading ? '––' : hidden ? '••••' : fmtMoney(balance)}
        </Text>
        <Pressable onPress={() => setHidden((h) => !h)} hitSlop={12} style={s.eye}>
          <Feather
            name={hidden ? 'eye-off' : 'eye'}
            size={18}
            color={theme.color.textSubtle}
          />
        </Pressable>
      </View>

      <View style={s.subRow}>
        <View>
          <Text style={s.subLabel}>A liberar</Text>
          <Text style={s.subValue}>
            {hidden ? 'R$ ••••' : `R$ ${fmtMoney(toRelease)}`}
          </Text>
        </View>
        <View>
          <Text style={s.subLabel}>Bloqueado</Text>
          <Text style={s.subValue}>
            {hidden ? 'R$ ••••' : `R$ ${fmtMoney(blocked)}`}
          </Text>
        </View>
      </View>

      <View style={s.ctaRow}>
        <Pressable style={[s.cta, s.ctaPrimary]} onPress={onAddBalance}>
          <Feather name="plus" size={18} color={theme.color.dark} />
          <Text style={s.ctaPrimaryText}>Adicionar</Text>
        </Pressable>
        <Pressable style={[s.cta, s.ctaSecondary]} onPress={onTransfer}>
          <Feather name="arrow-up" size={18} color="#fff" />
          <Text style={s.ctaSecondaryText}>Transferir</Text>
        </Pressable>
      </View>
    </LinearGradient>
  )
}

const s = StyleSheet.create({
  card: {
    borderRadius: theme.radius.xl,
    padding: theme.space.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(244,180,0,0.25)',
    opacity: 0.6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  label: {
    color: theme.color.yellowLight,
    fontSize: 11,
    fontWeight: theme.font.weightBold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  currency: {
    color: theme.color.textSubtle,
    fontSize: 14,
    fontWeight: theme.font.weightMedium,
  },
  value: {
    color: '#fff',
    fontSize: 34,
    fontWeight: theme.font.weightBold,
    letterSpacing: -1,
  },
  eye: { marginLeft: 'auto', padding: 4 },
  subRow: {
    flexDirection: 'row',
    gap: theme.space.xl,
    marginTop: theme.space.md,
  },
  subLabel: { color: theme.color.textMuted, fontSize: 11 },
  subValue: {
    color: theme.color.textFaint,
    fontSize: 12,
    fontWeight: theme.font.weightSemi,
    marginTop: 2,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: theme.space.sm,
    marginTop: theme.space.lg,
  },
  cta: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: theme.radius.md,
  },
  ctaPrimary: { backgroundColor: theme.color.yellow },
  ctaPrimaryText: {
    color: theme.color.dark,
    fontWeight: theme.font.weightBold,
    fontSize: 13,
  },
  ctaSecondary: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  ctaSecondaryText: {
    color: '#fff',
    fontWeight: theme.font.weightSemi,
    fontSize: 13,
  },
})
