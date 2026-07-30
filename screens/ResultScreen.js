import { useEffect, useRef, useState } from 'react';
import { Animated, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { colors, typography, spacing } from '../theme';
import { guardarResultadoTest } from '../db/database';
import PrimaryButton from '../components/PrimaryButton';

export default function ResultScreen({ route, navigation }) {
  const { temario, total, aciertos, falladas } = route.params;
  const [guardado, setGuardado] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const porcentaje = Math.round((aciertos / total) * 100);

  useEffect(() => {
    if (!guardado) {
      guardarResultadoTest({
        temario,
        puntuacion: aciertos,
        total,
        preguntasFalladas: falladas,
      });
      setGuardado(true);
    }

    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 6,
      useNativeDriver: true,
    }).start();
  }, []);

  const colorPuntuacion = porcentaje >= 60 ? colors.correct : colors.incorrect;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.temario}>{temario}</Text>

        <Animated.View style={[styles.scoreCircle, { borderColor: colorPuntuacion, transform: [{ scale: scaleAnim }] }]}>
          <Text style={[styles.scoreNumber, { color: colorPuntuacion }]}>{porcentaje}%</Text>
        </Animated.View>

        <Text style={styles.detalle}>
          {aciertos} de {total} preguntas correctas
        </Text>

        {falladas.length > 0 && (
          <View style={styles.falladasBox}>
            <Text style={styles.falladasTitulo}>Preguntas falladas</Text>
            {falladas.map((f) => (
              <Text key={f.id} style={styles.falladaItem}>
                • {f.pregunta}
              </Text>
            ))}
          </View>
        )}

        <View style={styles.actions}>
          <PrimaryButton
            title="Volver al inicio"
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Inicio' }] })}
          />
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
    alignItems: 'center',
  },
  temario: {
    ...typography.bodyMedium,
    color: colors.textMuted,
    marginTop: spacing.lg,
  },
  scoreCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xl,
  },
  scoreNumber: {
    ...typography.h1,
    fontSize: 36,
  },
  detalle: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  falladasBox: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  falladasTitulo: {
    ...typography.bodyMedium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  falladaItem: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: 4,
  },
  actions: {
    width: '100%',
    marginTop: 'auto',
  },
});
