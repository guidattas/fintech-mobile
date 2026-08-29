import { StyleSheet, Text, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { theme } from '@/lib/theme'

interface Props {
  icon: React.ComponentProps<typeof Feather>['name']
  title: string
  description: string
}

export function PlaceholderScreen({ icon, title, description }: Props) {
  return (
    <View style={s.container}>
      <View style={s.iconWrap}>
        <Feather name={icon} size={32} color={theme.color.yellow} />
      </View>
      <Text style={s.title}>{title}</Text>
      <Text style={s.description}>{description}</Text>
      <View style={s.badge}>
        <Text style={s.badgeText}>Em breve</Text>
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: theme.color.yellowSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: theme.font.weightBold,
    color: theme.color.text,
  },
  description: {
    fontSize: 13,
    color: theme.color.textMuted,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 280,
    lineHeight: 20,
  },
  badge: {
    marginTop: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.color.yellowSoft,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: theme.font.weightBold,
    color: theme.color.yellowText,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
})
