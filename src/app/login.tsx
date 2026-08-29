import { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MovibankLogo } from '@/components/MovibankLogo'
import { authApi } from '@/lib/api'
import { auth } from '@/lib/auth'
import { registerForPushNotifications } from '@/lib/push'
import { theme } from '@/lib/theme'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setError('')
    setLoading(true)
    try {
      const res = await authApi.login(email, password)
      const token = res.data.accessToken
      if (!token) {
        setError('Token não recebido')
        return
      }
      await auth.setToken(token)
      if (res.data.user) await auth.setUser(res.data.user)
      registerForPushNotifications().catch(() => {})
      router.replace('/(tabs)')
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Erro ao autenticar'
      setError(Array.isArray(msg) ? msg.join(', ') : String(msg))
    } finally {
      setLoading(false)
    }
  }

  return (
    <LinearGradient
      colors={[theme.color.dark, theme.color.darkAlt]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={s.scroll}
            keyboardShouldPersistTaps="handled"
          >
            <View style={s.logoWrap}>
              <MovibankLogo width={180} variant="onDark" />
            </View>

            <View style={s.card}>
              <Text style={s.title}>Bem-vindo</Text>
              <Text style={s.subtitle}>
                Entre com seu e-mail e senha do estabelecimento
              </Text>

              <View style={s.field}>
                <Text style={s.label}>E-mail</Text>
                <View style={s.inputWrap}>
                  <Feather name="mail" size={16} color={theme.color.textSubtle} />
                  <TextInput
                    style={s.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="seu@empresa.com.br"
                    placeholderTextColor={theme.color.textSubtle}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    editable={!loading}
                  />
                </View>
              </View>

              <View style={s.field}>
                <Text style={s.label}>Senha</Text>
                <View style={s.inputWrap}>
                  <Feather name="lock" size={16} color={theme.color.textSubtle} />
                  <TextInput
                    style={s.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    placeholderTextColor={theme.color.textSubtle}
                    secureTextEntry={!showPass}
                    autoComplete="password"
                    editable={!loading}
                  />
                  <Pressable onPress={() => setShowPass((v) => !v)} hitSlop={12}>
                    <Feather
                      name={showPass ? 'eye-off' : 'eye'}
                      size={16}
                      color={theme.color.textSubtle}
                    />
                  </Pressable>
                </View>
              </View>

              {error ? (
                <View style={s.error}>
                  <Feather name="alert-circle" size={14} color="#DC2626" />
                  <Text style={s.errorText}>{error}</Text>
                </View>
              ) : null}

              <Pressable
                style={[s.submit, loading && { opacity: 0.6 }]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={s.submitText}>
                  {loading ? 'Autenticando...' : 'Entrar'}
                </Text>
                {!loading && (
                  <Feather name="arrow-right" size={16} color={theme.color.dark} />
                )}
              </Pressable>
            </View>

            <View style={s.footer}>
              <Feather name="shield" size={11} color={theme.color.yellow} />
              <Text style={s.footerText}>Conexão segura</Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  )
}

const s = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logoWrap: { alignItems: 'center', marginBottom: 32 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: theme.radius.xl,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  title: { fontSize: 22, fontWeight: theme.font.weightBold, color: '#fff' },
  subtitle: { fontSize: 13, color: theme.color.textSubtle, marginTop: 4, marginBottom: 20 },
  field: { marginBottom: 12 },
  label: {
    fontSize: 10,
    fontWeight: theme.font.weightBold,
    color: theme.color.textSubtle,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: theme.radius.md,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 14,
  },
  error: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderColor: 'rgba(239,68,68,0.3)',
    borderWidth: 1,
    padding: 10,
    borderRadius: theme.radius.md,
    marginTop: 4,
  },
  errorText: { color: '#FCA5A5', fontSize: 12, flex: 1 },
  submit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: theme.color.yellow,
    borderRadius: theme.radius.md,
    paddingVertical: 14,
    marginTop: 14,
  },
  submitText: {
    color: theme.color.dark,
    fontWeight: theme.font.weightBold,
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginTop: 20,
  },
  footerText: { fontSize: 11, color: theme.color.textSubtle },
})
