import { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Feather } from '@expo/vector-icons'
import { pixApi, type PixCharge } from '@/lib/api'
import { fmtCurrency } from '@/lib/format'
import { theme } from '@/lib/theme'

function parseAmount(raw: string): number {
  const cleaned = raw.replace(/[^\d]/g, '')
  return cleaned ? Number(cleaned) / 100 : 0
}

function formatAmountInput(raw: string): string {
  const value = parseAmount(raw)
  if (!value) return ''
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function PixScreen() {
  const [amountInput, setAmountInput] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [charge, setCharge] = useState<PixCharge | null>(null)
  const [copied, setCopied] = useState(false)

  const amount = parseAmount(amountInput)

  async function generate() {
    if (amount <= 0) {
      Alert.alert('Valor inválido', 'Informe um valor maior que zero.')
      return
    }
    setLoading(true)
    try {
      const { data } = await pixApi.create(amount, description || undefined)
      setCharge(data)
    } catch (e: any) {
      Alert.alert('Erro', e?.response?.data?.message || 'Não foi possível gerar a cobrança.')
    } finally {
      setLoading(false)
    }
  }

  async function copyQr() {
    if (!charge) return
    try {
      const Clipboard = await import('expo-clipboard').catch(() => null)
      if (Clipboard?.setStringAsync) {
        await Clipboard.setStringAsync(charge.qrCode)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      Alert.alert('Copiado', charge.qrCode)
    }
  }

  function reset() {
    setCharge(null)
    setAmountInput('')
    setDescription('')
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <View style={s.header}>
            <Text style={s.title}>PIX</Text>
            <Text style={s.subtitle}>Gerar cobrança para receber</Text>
          </View>

          {!charge ? (
            <View style={s.card}>
              <Text style={s.label}>Valor</Text>
              <View style={s.amountRow}>
                <Text style={s.amountPrefix}>R$</Text>
                <TextInput
                  value={amountInput}
                  onChangeText={(v) => setAmountInput(formatAmountInput(v))}
                  placeholder="0,00"
                  placeholderTextColor={theme.color.textSubtle}
                  keyboardType="numeric"
                  style={s.amountInput}
                />
              </View>

              <Text style={[s.label, { marginTop: 20 }]}>Descrição (opcional)</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Ex.: Pedido #123"
                placeholderTextColor={theme.color.textSubtle}
                style={s.textInput}
                maxLength={80}
              />

              <Pressable
                onPress={generate}
                disabled={loading || amount <= 0}
                style={({ pressed }) => [
                  s.btnPrimary,
                  (loading || amount <= 0) && s.btnDisabled,
                  pressed && { opacity: 0.85 },
                ]}
              >
                {loading ? (
                  <ActivityIndicator color={theme.color.dark} />
                ) : (
                  <>
                    <Feather name="zap" size={18} color={theme.color.dark} />
                    <Text style={s.btnPrimaryText}>Gerar cobrança</Text>
                  </>
                )}
              </Pressable>
            </View>
          ) : (
            <View style={s.card}>
              <View style={s.successBadge}>
                <Feather name="check-circle" size={14} color={theme.color.success} />
                <Text style={s.successBadgeText}>Cobrança criada</Text>
              </View>

              <Text style={s.chargeAmount}>{fmtCurrency(charge.amount)}</Text>
              {charge.description ? (
                <Text style={s.chargeDesc}>{charge.description}</Text>
              ) : null}

              <View style={s.qrBox}>
                <Text style={s.qrLabel}>PIX Copia e Cola</Text>
                <Text style={s.qrCode} numberOfLines={4}>
                  {charge.qrCode}
                </Text>
              </View>

              <Pressable
                onPress={copyQr}
                style={({ pressed }) => [
                  s.btnPrimary,
                  pressed && { opacity: 0.85 },
                ]}
              >
                <Feather name={copied ? 'check' : 'copy'} size={18} color={theme.color.dark} />
                <Text style={s.btnPrimaryText}>{copied ? 'Copiado!' : 'Copiar código'}</Text>
              </Pressable>

              <Pressable onPress={reset} style={s.btnGhost}>
                <Text style={s.btnGhostText}>Nova cobrança</Text>
              </Pressable>

              {charge.provider === 'fake' ? (
                <Text style={s.hint}>
                  Modo simulação: use POST /pix/{charge.id}/simulate no admin para creditar.
                </Text>
              ) : null}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.color.bg },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 20 },
  title: { fontSize: 22, fontWeight: theme.font.weightBlack, color: theme.color.text },
  subtitle: { fontSize: 12, color: theme.color.textMuted, marginTop: 2 },
  card: {
    backgroundColor: '#fff',
    borderRadius: theme.radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.color.border,
  },
  label: { fontSize: 11, fontWeight: theme.font.weightBold, color: theme.color.textMuted, letterSpacing: 0.5, textTransform: 'uppercase' },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: theme.color.dark,
  },
  amountPrefix: { fontSize: 18, fontWeight: theme.font.weightSemi, color: theme.color.textMuted },
  amountInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: theme.font.weightBlack,
    color: theme.color.text,
    padding: 0,
    fontVariant: ['tabular-nums'],
  },
  textInput: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: theme.color.border,
    borderRadius: theme.radius.md,
    padding: 12,
    fontSize: 14,
    color: theme.color.text,
  },
  btnPrimary: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.color.yellow,
    padding: 16,
    borderRadius: theme.radius.md,
  },
  btnDisabled: { opacity: 0.5 },
  btnPrimaryText: { fontSize: 15, fontWeight: theme.font.weightBold, color: theme.color.dark },
  btnGhost: { marginTop: 12, alignItems: 'center', padding: 12 },
  btnGhostText: { fontSize: 13, fontWeight: theme.font.weightSemi, color: theme.color.textMuted },
  successBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.color.successBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.pill,
    marginBottom: 12,
  },
  successBadgeText: { fontSize: 11, fontWeight: theme.font.weightBold, color: theme.color.success },
  chargeAmount: { fontSize: 30, fontWeight: theme.font.weightBlack, color: theme.color.text, fontVariant: ['tabular-nums'] },
  chargeDesc: { fontSize: 13, color: theme.color.textMuted, marginTop: 4 },
  qrBox: {
    marginTop: 20,
    padding: 14,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.color.border,
    backgroundColor: theme.color.bg,
  },
  qrLabel: { fontSize: 11, fontWeight: theme.font.weightBold, color: theme.color.textMuted, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 },
  qrCode: { fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }), fontSize: 11, color: theme.color.text, lineHeight: 16 },
  hint: { marginTop: 12, fontSize: 11, color: theme.color.textSubtle, textAlign: 'center' },
})
