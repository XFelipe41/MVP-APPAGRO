import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { INDICATORS } from "@/constants/questions";
import { Answer, Diagnosis } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text
} from "react-native";

const DIMENSIONS = ["Técnica", "Ecológica", "Social"];

// We create a function that will generate the styles based on the color scheme.
const getStyles = (colorScheme: 'light' | 'dark') => {
  const theme = Colors[colorScheme];

  return StyleSheet.create({
    scrollContainer: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      padding: 20,
      backgroundColor: theme.background,
    },
    dimensionTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 20,
      textAlign: "center",
    },
    questionContainer: {
      marginBottom: 25,
    },
    questionText: {
      fontSize: 16,
      marginBottom: 15,
      color: theme.text,
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
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.buttonDefaultBg,
      borderWidth: 1,
      borderColor: theme.buttonBorder,
    },
    selectedButton: {
      backgroundColor: theme.buttonSelectedBg,
    },
    scaleButtonText: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.buttonDefaultText,
    },
    selectedButtonText: {
      color: theme.buttonSelectedText,
    },
    textInput: {
      borderWidth: 1,
      borderColor: theme.secondary,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      backgroundColor: theme.background,
      color: theme.text,
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
      backgroundColor: theme.navButtonBg,
    },
    saveButton: {
      backgroundColor: theme.primary,
    },
    buttonText: {
      color: theme.navButtonText,
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
    },
    saveButtonText: {
        color: theme.buttonSelectedText,
    }
  });
};

export default function NewDiagnosisScreen() {
  const [currentDimensionIndex, setCurrentDimensionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, number | string>>(
    new Map()
  );
  const router = useRouter();
  const colorScheme = useColorScheme() || 'light'; // Fallback to light
  const styles = getStyles(colorScheme);

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

    const scaleQuestions = INDICATORS.filter(i => i.type === 'scale');
    const answeredScaleQuestions = finalAnswers.filter(a => {
        const indicator = INDICATORS.find(i => i.id === a.indicatorId);
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
            <Text
              style={[
                styles.scaleButtonText,
                selectedValue === value && styles.selectedButtonText,
              ]}
            >
              {value}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
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
            placeholderTextColor={Colors[colorScheme].secondary}
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