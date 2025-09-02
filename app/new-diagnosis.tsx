
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
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
            placeholderTextColor="#999"
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
              <ThemedText style={styles.buttonText}>
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
    backgroundColor: "#f5f5f5",
  },
  container: {
    padding: 20,
  },
  dimensionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2d5a31",
    marginBottom: 20,
    textAlign: "center",
  },
  questionContainer: {
    marginBottom: 25,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  scaleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  selectedButton: {
    backgroundColor: "#4CAF50",
  },
  scaleButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  selectedButtonText: {
    color: "#fff",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
  },
  navButton: {
    backgroundColor: "#6c757d",
  },
  saveButton: {
    backgroundColor: "#28a745",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
