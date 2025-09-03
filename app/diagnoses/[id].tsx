
import RadarChart from "@/components/RadarChart";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { INDICATORS } from "@/constants/questions";
import { Diagnosis } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Get screen width for responsive chart size
const screenWidth = Dimensions.get('window').width;

export default function DiagnosisResultScreen() {
  const { id } = useLocalSearchParams();
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiagnosis = async () => {
      if (typeof id !== "string") return;
      try {
        const item = await AsyncStorage.getItem(id);
        if (item) {
          setDiagnosis(JSON.parse(item));
        }
      } catch (error) {
        console.error("Failed to fetch diagnosis:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnosis();
  }, [id]);

  if (loading) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </ThemedView>
    );
  }

  if (!diagnosis) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ThemedText>Diagnóstico no encontrado.</ThemedText>
      </ThemedView>
    );
  }

  // --- Data Processing for Chart and Summary ---

  // 1. Process data for the new Radar Chart (all indicators)
  const scaleIndicators = INDICATORS.filter(i => i.type === 'scale');
  
  const chartLabels = scaleIndicators.map(i => i.question);
  const chartData = scaleIndicators.map(indicator => {
    const answer = diagnosis.answers.find(a => a.indicatorId === indicator.id);
    // Ensure value is a number and within the 0-4 scale
    const value = answer?.value ?? 0;
    return typeof value === 'number' ? Math.max(0, Math.min(4, value)) : 0;
  });

  // 2. Calculate dimension averages for the summary text
  const getDimensionAverages = () => {
    const dimensions: { [key in 'Técnica' | 'Ecológica' | 'Social']: number[] } = { Técnica: [], Ecológica: [], Social: [] };

    diagnosis.answers.forEach((answer) => {
      const indicator = INDICATORS.find((i) => i.id === answer.indicatorId);
      if (indicator && indicator.type === "scale") {
        // Ensure value is a number before pushing
        const value = typeof answer.value === 'number' ? answer.value : parseFloat(answer.value as string);
        if (!isNaN(value)) {
            dimensions[indicator.dimension].push(value);
        }
      }
    });

    const averages = {
      Técnica: dimensions.Técnica.reduce((a, b) => a + b, 0) / (dimensions.Técnica.length || 1),
      Ecológica: dimensions.Ecológica.reduce((a, b) => a + b, 0) / (dimensions.Ecológica.length || 1),
      Social: dimensions.Social.reduce((a, b) => a + b, 0) / (dimensions.Social.length || 1),
    };

    return averages;
  };

  const averages = getDimensionAverages();
  const dimensionKeys: Array<keyof typeof averages> = ["Técnica", "Ecológica", "Social"];
  const strongestDimension = dimensionKeys.reduce((a, b) =>
    averages[a] > averages[b] ? a : b
  );

  return (
    <ScrollView style={styles.scrollContainer}>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>Resultados del Diagnóstico</ThemedText>
        
        <View style={styles.chartContainer}>
          <RadarChart
            datasets={[{ data: chartData, color: '#9347c3ff', name: 'Diagnóstico' }]}
            labels={chartLabels}
            size={screenWidth - 20} // Responsive size
          />
        </View>

        <View style={styles.summaryContainer}>
            <ThemedText style={styles.summaryText}>
                La dimensión con mayor fortaleza es la 
                <ThemedText style={styles.strongestDimensionText}> {strongestDimension} </ThemedText> 
                con un promedio de 
                <ThemedText style={styles.strongestDimensionText}> {averages[strongestDimension].toFixed(1)}</ThemedText>.
            </ThemedText>
        </View>

        <ThemedText type="subtitle" style={styles.tableTitle}>Tabla de Respuestas</ThemedText>
        <View style={styles.table}>
            <View style={styles.tableHeader}>
                <Text style={styles.headerText}>Indicador</Text>
                <Text style={styles.headerText}>Respuesta</Text>
            </View>
            {diagnosis.answers.map(ans => {
                const indicator = INDICATORS.find(i => i.id === ans.indicatorId);
                return (
                    <View key={ans.indicatorId} style={styles.tableRow}>
                        <Text style={styles.cellText}>{indicator?.question || 'N/A'}</Text>
                        <Text style={styles.cellText}>{ans.value}</Text>
                    </View>
                )
            })}
        </View>

      </ThemedView>
    </ScrollView>
  );
}

import { Colors } from '@/constants/Colors';

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  container: {
    padding: 20,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#4CAF50',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  summaryContainer: {
    padding: 15,
    backgroundColor: Colors.dark.secondary,
    borderRadius: 8,
    marginBottom: 30,
  },
  summaryText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    color: Colors.dark.text,
  },
  strongestDimensionText: {
    fontWeight: 'bold',
    color: Colors.dark.tint,
  },
  tableTitle: {
    color: '#4CAF50',
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    
  },
  table: {
    borderWidth: 1,
    borderColor: Colors.dark.secondary,
    borderRadius: 8,
    backgroundColor: '#1C2541', // Un poco más claro que el fondo
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.secondary,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.background,
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 15,
    color: Colors.dark.text,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.secondary,
  },
  cellText: {
    flex: 1,
    fontSize: 14,
    color: Colors.dark.text,
  },
});
