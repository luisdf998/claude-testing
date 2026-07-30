import { StyleSheet, Text, View } from 'react-native';
import { colors, typography, spacing, radius } from '../theme';

export default function SimpleBarChart({ data }) {
  // data: array of { label, value } where value is 0-100
  if (!data || data.length === 0) return null;

  return (
    <View style={styles.container}>
      {data.map((item, index) => (
        <View key={index} style={styles.column}>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { height: `${Math.max(item.value, 4)}%` }]} />
          </View>
          <Text style={styles.value}>{item.value}%</Text>
          <Text style={styles.label} numberOfLines={1}>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 160,
    gap: spacing.sm,
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  barTrack: {
    width: '100%',
    height: 100,
    borderRadius: radius.sm,
    backgroundColor: colors.border,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: colors.accent,
  },
  value: {
    ...typography.caption,
    color: colors.text,
    marginTop: spacing.xs,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
});
