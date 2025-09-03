
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { INDICATORS } from "@/constants/questions";
import { Answer, Diagnosis } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  View,
  Alert,
} from "react-native";

const DIMENSIONS = ["Técnica", "Ecológica", "Social"];

export default function NewDiagnosisScreen() {
  const [currentDimensionIndex, setCurrentDimensionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, number | string>>(
    new Map()
  );
  const router = useRouter();

  const handleAnswer = (indicatorId: string, value: number | string) => {
    const newAnswers = new Map(answers);
    newAnswers.set(indicatorId, value);
    setAnswers(newAnswers);
  };

  const saveDiagnosis = async () => {
    const diagnosisId = `diagnosis_${new Date().getTime()}`;
    const finalAnswers: Answer[] = Array.from(answers.entries()).map(
      ([indicatorId, value]) => ({
        indicatorId,
        value,
      })
    );

    // Ensure all scale questions are answered before saving
    const scaleQuestions = INDICATORS.filter(i => i.type === 'scale');
    const answeredScaleQuestions = finalAnswers.filter(a => {
        const indicator = INDICATORS.find(i => i.id === a.indicatorId);
        // Check that a value was actually entered (not just an empty string from a text input that was cleared)
        return indicator && indicator.type === 'scale' && a.value !== undefined;
    });

    if (answeredScaleQuestions.length < scaleQuestions.length) {
        Alert.alert("Formulario Incompleto", "Por favor, responde todas las preguntas de escala (0-4) antes de guardar.");
        return;
    }

    const diagnosis: Diagnosis = {
      id: diagnosisId,
      date: new Date().toISOString(),
      answers: finalAnswers,
    };

    try {
      await AsyncStorage.setItem(diagnosisId, JSON.stringify(diagnosis));
      Alert.alert("Éxito", "Diagnóstico guardado correctamente.");
      router.replace(`/diagnoses/${diagnosisId}`);
    } catch (error) {
      console.error("Failed to save diagnosis:", error);
      Alert.alert("Error", "No se pudo guardar el diagnóstico.");
    }
  };

  const renderQuestionsForCurrentDimension = () => {
    const currentDimension = DIMENSIONS[currentDimensionIndex];
    return INDICATORS.filter(
      (indicator) => indicator.dimension === currentDimension
    ).map((indicator) => (
      <View key={indicator.id} style={styles.questionContainer}>
        <ThemedText style={styles.questionText}>
          {indicator.question}
        </ThemedText>
        {indicator.type === "scale" ? (
          <ButtonGroup
            onSelect={(value) => handleAnswer(indicator.id, value)}
            selectedValue={answers.get(indicator.id) as number}
          />
        ) : (
          <TextInput
            style={styles.textInput}
            placeholder="Escribe tu respuesta aquí..."
            placeholderTextColor={Colors.dark.secondary}
            onChangeText={(text) => handleAnswer(indicator.id, text)}
            value={answers.get(indicator.id) as string}
          />
        )}
      </View>
    ));
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle" style={styles.dimensionTitle}>
          Dimensión: {DIMENSIONS[currentDimensionIndex]}
        </ThemedText>
        {renderQuestionsForCurrentDimension()}
        <View style={styles.navigationButtons}>
          {currentDimensionIndex > 0 && (
            <TouchableOpacity
              style={[styles.button, styles.navButton]}
              onPress={() =>
                setCurrentDimensionIndex(currentDimensionIndex - 1)
              }
            >
              <ThemedText style={styles.buttonText}>Anterior</ThemedText>
            </TouchableOpacity>
          )}
          {currentDimensionIndex < DIMENSIONS.length - 1 ? (
            <TouchableOpacity
              style={[styles.button, styles.navButton]}
              onPress={() =>
                setCurrentDimensionIndex(currentDimensionIndex + 1)
              }
            >
              <ThemedText style={styles.buttonText}>Siguiente</ThemedText>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={saveDiagnosis}
            >
              <ThemedText style={[styles.buttonText, styles.saveButtonText]}>
                Guardar Diagnóstico
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const ButtonGroup = ({
  onSelect,
  selectedValue,
}: {
  onSelect: (value: number) => void;
  selectedValue?: number;
}) => {
  return (
    <View style={styles.buttonGroup}>
      {[0, 1, 2, 3, 4].map((value) => (
        <TouchableOpacity
          key={value}
          style={[
            styles.scaleButton,
            selectedValue === value && styles.selectedButton,
          ]}
          onPress={() => onSelect(value)}
        >
          <ThemedText
            style={[
              styles.scaleButtonText,
              selectedValue === value && styles.selectedButtonText,
            ]}
          >
            {value}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  container: {
    padding: 20,
    backgroundColor: Colors.dark.background,
  },
  dimensionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.dark.text,
    marginBottom: 20,
    textAlign: "center",
  },
  questionContainer: {
    marginBottom: 25,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 15,
    color: Colors.dark.text,
    lineHeight: 22,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  scaleButton: {
    flex: 1,
    marginHorizontal: 4,
    height: 50,
    borderRadius: 8, // Bordes redondeados
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.dark.buttonDefaultBg,
    borderWidth: 1,
    borderColor: Colors.dark.buttonBorder, // Borde verde
  },
  selectedButton: {
    backgroundColor: Colors.dark.buttonSelectedBg, // Fondo verde al seleccionar
  },
  scaleButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.dark.buttonDefaultText, // Texto claro
  },
  selectedButtonText: {
    color: Colors.dark.buttonSelectedText, // Texto blanco al seleccionar
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.dark.secondary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: Colors.dark.background,
    color: Colors.dark.text,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  navButton: {
    backgroundColor: Colors.dark.secondary,
  },
  saveButton: {
    backgroundColor: Colors.dark.primary,
  },
  buttonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  saveButtonText: {
      color: '#FFFFFF',
  }
});
