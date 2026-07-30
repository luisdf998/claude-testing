import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, typography, spacing, radius } from '../theme';

export default function OptionButton({ label, state, onPress }) {
  // state: 'default' | 'selected' | 'correct' | 'incorrect' | 'muted'
  return (
    <Pressable
      onPress={onPress}
      disabled={state !== 'default'}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.base, stateStyles[state] || stateStyles.default]}
    >
      <Text style={[styles.text, (state === 'correct' || state === 'incorrect') && styles.textOnColor]}>
        {label}
      </Text>
    </Pressable>
  );
}

const stateStyles = StyleSheet.create({
  default: {
    backgroundColor: colors.card,
    borderColor: colors.border,
  },
  selected: {
    backgroundColor: colors.card,
    borderColor: colors.primary,
  },
  correct: {
    backgroundColor: colors.correct,
    borderColor: colors.correct,
  },
  incorrect: {
    backgroundColor: colors.incorrect,
    borderColor: colors.incorrect,
  },
  muted: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    opacity: 0.5,
  },
});

const styles = StyleSheet.create({
  base: {
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  text: {
    ...typography.body,
    color: colors.text,
  },
  textOnColor: {
    color: '#FFFFFF',
  },
});
