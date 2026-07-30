import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { colors, typography, spacing, radius } from '../theme';
import { obtenerHistorial, obtenerPreguntasMasFalladas } from '../db/database';
import SimpleBarChart from '../components/SimpleBarChart';

function formatearFecha(iso) {
  const fecha = new Date(iso);
  return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

export default function HistoryScreen() {
  const [historial, setHistorial] = useState([]);
  const [masFalladas, setMasFalladas] = useState([]);

  useFocusEffect(
    useCallback(() => {
      setHistorial(obtenerHistorial());
      setMasFalladas(obtenerPreguntasMasFalladas(5));
    }, [])
  );

  const datosGrafico = [...historial]
    .slice(0, 6)
    .reverse()
    .map((t) => ({
      label: formatearFecha(t.fecha),
      value: Math.round((t.puntuacion / t.total) * 100),
    }));

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Historial</Text>

            {historial.length === 0 ? (
              <Text style={styles.vacio}>Todavía no has hecho ningún test.</Text>
            ) : (
              <>
                <Text style={styles.sectionLabel}>Evolución</Text>
                <SimpleBarChart data={datosGrafico} />

                {masFalladas.length > 0 && (
                  <>
                    <Text style={[styles.sectionLabel, { marginTop: spacing.xl }]}>
                      Preguntas para repasar
                    </Text>
                    {masFalladas.map((f) => (
                      <View key={f.pregunta_id} style={styles.repasoItem}>
                        <Text style={styles.repasoTexto} numberOfLines={2}>
                          {f.pregunta_texto}
                        </Text>
                        <Text style={styles.repasoCount}>{f.veces_fallada}×</Text>
                      </View>
                    ))}
                  </>
                )}

                <Text style={[styles.sectionLabel, { marginTop: spacing.xl }]}>Tests realizados</Text>
              </>
            )}
          </>
        }
        data={historial}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.testItem}>
            <View>
              <Text style={styles.testTemario}>{item.temario}</Text>
              <Text style={styles.testFecha}>{formatearFecha(item.fecha)}</Text>
            </View>
            <Text style={styles.testScore}>
              {item.puntuacion}/{item.total}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  vacio: {
    ...typography.body,
    color: colors.textMuted,
  },
  sectionLabel: {
    ...typography.bodyMedium,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  repasoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    marginBottom: spacing.xs,
  },
  repasoTexto: {
    ...typography.caption,
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  repasoCount: {
    ...typography.bodyMedium,
    color: colors.incorrect,
  },
  testItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  testTemario: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  testFecha: {
    ...typography.caption,
    color: colors.textMuted,
  },
  testScore: {
    ...typography.bodyMedium,
    color: colors.primary,
  },
});
