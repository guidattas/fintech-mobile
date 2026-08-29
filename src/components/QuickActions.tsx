import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { theme } from '@/lib/theme'

type IconName = React.ComponentProps<typeof Feather>['name']

export interface QuickAction {
  key: string
  label: string
  icon: IconName
  highlighted?: boolean
  onPress?: () => void
}

interface Props {
  actions: QuickAction[]
  title?: string
}

export function QuickActions({ actions, title = 'Ações rápidas' }: Props) {
  return (
    <View>
      <Text style={s.title}>{title}</Text>
      <View style={s.grid}>
        {actions.map((a) => {
          const iconColor = a.highlighted ? theme.color.dark : theme.color.yellowText
          const bg = a.highlighted ? theme.color.yellow : theme.color.yellowSoft
          return (
            <Pressable
              key={a.key}
              onPress={a.onPress}
              style={({ pressed }) => [
                s.item,
                a.highlighted && s.itemHighlighted,
                pressed && { opacity: 0.7 },
              ]}
            >
              <View style={[s.iconWrap, { backgroundColor: bg }]}>
                <Feather name={a.icon} size={18} color={iconColor} />
              </View>
              <Text style={[s.label, a.highlighted && s.labelHighlighted]}>
                {a.label}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  title: {
    fontSize: 11,
    fontWeight: theme.font.weightBold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: theme.color.text,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  item: {
    width: '23.5%',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 4,
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.color.border,
  },
  itemHighlighted: {
    borderColor: theme.color.yellow,
    backgroundColor: '#FFFBEA',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: theme.font.weightSemi,
    color: theme.color.text,
  },
  labelHighlighted: { fontWeight: theme.font.weightBold },
})
