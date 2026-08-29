import { SafeAreaView } from 'react-native-safe-area-context'
import { PlaceholderScreen } from '@/components/PlaceholderScreen'

export default function PixScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <PlaceholderScreen
        icon="zap"
        title="PIX"
        description="Enviar, receber e gerar cobranças PIX em breve."
      />
    </SafeAreaView>
  )
}
