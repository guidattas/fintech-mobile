import { SafeAreaView } from 'react-native-safe-area-context'
import { PlaceholderScreen } from '@/components/PlaceholderScreen'

export default function ExtratoScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <PlaceholderScreen
        icon="credit-card"
        title="Extrato"
        description="Movimentações da conta digital vão aparecer aqui em breve."
      />
    </SafeAreaView>
  )
}
