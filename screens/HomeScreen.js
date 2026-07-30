import { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { colors, typography, spacing, radius } from '../theme';
import { getTemarios } from '../data/helpers';
import PrimaryButton from '../components/PrimaryButton';

const OPCIONES_CANTIDAD = [5, 10, 15, 20];

export default function HomeScreen({ navigation }) {
  const temarios = getTemarios();
  const [temarioSeleccionado, setTemarioSeleccionado] = useState(temarios[0]?.nombre ?? null);
  const [cantidad, setCantidad] = useState(10);

  const temarioActual = temarios.find((t) => t.nombre === temarioSeleccionado);
  const maxPreguntas = temarioActual?.total ?? 0;

  const empezarTest = () => {
    if (!temarioSeleccionado) return;
    navigation.navigate('Test', {
      temario: temarioSeleccionado,
      cantidad: Math.min(cantidad, maxPreguntas),
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Tests desde Temario</Text>
        <Text style={styles.subtitle}>Elige un temario y pon a prueba lo que sabes</Text>

        <Text style={styles.sectionLabel}>Temario</Text>
        {temarios.length === 0 && (
          <Text style={styles.subtitle}>No hay preguntas cargadas todavía.</Text>
        )}
        <View style={styles.list}>
          {temarios.map((t) => (
            <Pressable
              key={t.nombre}
              onPress={() => setTemarioSeleccionado(t.nombre)}
              style={[
                styles.temarioCard,
                temarioSeleccionado === t.nombre && styles.temarioCardSelected,
              ]}
            >
              <Text style={styles.temarioNombre}>{t.nombre}</Text>
              <Text style={styles.temarioCount}>{t.total} preguntas disponibles</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Número de preguntas</Text>
        <View style={styles.cantidadRow}>
          {OPCIONES_CANTIDAD.map((n) => (
            <Pressable
              key={n}
              onPress={() => setCantidad(n)}
              disabled={n > maxPreguntas}
              style={[
                styles.cantidadChip,
                cantidad === n && styles.cantidadChipSelected,
                n > maxPreguntas && styles.cantidadChipDisabled,
              ]}
            >
              <Text
                style={[
                  styles.cantidadText,
                  cantidad === n && styles.cantidadTextSelected,
                ]}
              >
                {n}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.actions}>
          <PrimaryButton title="Comenzar test" onPress={empezarTest} disabled={!temarioSeleccionado} />
          <View style={{ height: spacing.sm }} />
          <PrimaryButton
            title="Ver historial"
            variant="outline"
            onPress={() => navigation.navigate('Historial')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    ...typography.bodyMedium,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  list: {
    marginBottom: spacing.lg,
  },
  temarioCard: {
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  temarioCardSelected: {
    borderColor: colors.primary,
  },
  temarioNombre: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  temarioCount: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  cantidadRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  cantidadChip: {
    width: 56,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  cantidadChipSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  cantidadChipDisabled: {
    opacity: 0.35,
  },
  cantidadText: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  cantidadTextSelected: {
    color: '#FFFFFF',
  },
  actions: {
    marginTop: 'auto',
  },
});
