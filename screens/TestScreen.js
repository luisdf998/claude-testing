import { useEffect, useRef, useState } from 'react';
import { Animated, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { colors, typography, spacing } from '../theme';
import { getPreguntasAleatorias } from '../data/helpers';
import ProgressBar from '../components/ProgressBar';
import OptionButton from '../components/OptionButton';
import PrimaryButton from '../components/PrimaryButton';

export default function TestScreen({ route, navigation }) {
  const { temario, cantidad } = route.params;
  const [preguntas] = useState(() => getPreguntasAleatorias(temario, cantidad));
  const [indice, setIndice] = useState(0);
  const [seleccionada, setSeleccionada] = useState(null);
  const [respondida, setRespondida] = useState(false);
  const [aciertos, setAciertos] = useState(0);
  const [falladas, setFalladas] = useState([]);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const preguntaActual = preguntas[indice];
  const esUltima = indice === preguntas.length - 1;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [indice]);

  const seleccionarOpcion = (opcionIndex) => {
    if (respondida) return;
    setSeleccionada(opcionIndex);
    setRespondida(true);

    if (opcionIndex === preguntaActual.correcta) {
      setAciertos((prev) => prev + 1);
    } else {
      setFalladas((prev) => [...prev, preguntaActual]);
    }
  };

  const siguiente = () => {
    if (esUltima) {
      navigation.replace('Resultado', {
        temario,
        total: preguntas.length,
        aciertos,
        falladas,
      });
      return;
    }

    fadeAnim.setValue(0);
    setIndice((prev) => prev + 1);
    setSeleccionada(null);
    setRespondida(false);
  };

  const getEstadoOpcion = (opcionIndex) => {
    if (!respondida) return 'default';
    if (opcionIndex === preguntaActual.correcta) return 'correct';
    if (opcionIndex === seleccionada) return 'incorrect';
    return 'muted';
  };

  if (!preguntaActual) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={typography.body}>No hay preguntas disponibles para este temario.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ProgressBar progress={indice / preguntas.length} />
        <Text style={styles.contador}>
          Pregunta {indice + 1} de {preguntas.length}
        </Text>

        <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
          <Text style={styles.pregunta}>{preguntaActual.pregunta}</Text>

          <View style={styles.opciones}>
            {preguntaActual.opciones.map((opcion, i) => (
              <OptionButton
                key={i}
                label={opcion}
                state={getEstadoOpcion(i)}
                onPress={() => seleccionarOpcion(i)}
              />
            ))}
          </View>
        </Animated.View>

        {respondida && (
          <PrimaryButton
            title={esUltima ? 'Ver resultado' : 'Siguiente'}
            onPress={siguiente}
          />
        )}
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
  contador: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  pregunta: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  opciones: {
    marginBottom: spacing.lg,
  },
});
