
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { INDICATORS } from "@/constants/questions";
import { Diagnosis } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RadarChart } from "@salmonco/react-native-radar-chart";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

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

  const getDimensionAverages = () => {
    const dimensions: { [key in 'Técnica' | 'Ecológica' | 'Social']: number[] } = { Técnica: [], Ecológica: [], Social: [] };

    diagnosis.answers.forEach((answer) => {
      const indicator = INDICATORS.find((i) => i.id === answer.indicatorId);
      if (indicator && indicator.type === "scale") {
        dimensions[indicator.dimension].push(answer.value as number);
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
  const data = [
    {
      label: "Técnica",
      value: averages.Técnica / 4,
      meta: { color: "#4CAF50" },
    },
    {
      label: "Ecológica",
      value: averages.Ecológica / 4,
      meta: { color: "#4CAF50" },
    },
    {
      label: "Social",
      value: averages.Social / 4,
      meta: { color: "#4CAF50" },
    },
  ];

  const captions = {
    tecnica: "Técnica",
    ecologica: "Ecológica",
    social: "Social",
  };

  const dimensionKeys: Array<keyof typeof averages> = ["Técnica", "Ecológica", "Social"];
  const strongestDimension = dimensionKeys.reduce((a, b) =>
    averages[a] > averages[b] ? a : b
  );

  return (
    <ScrollView style={styles.scrollContainer}>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>Resultados</ThemedText>
        
        <View style={styles.chartContainer}>
          <RadarChart data={data} size={300} />
        </View>

        <View style={styles.summaryContainer}>
            <ThemedText style={styles.summaryText}>
                La dimensión con mayor fortaleza es la 
                <ThemedText style={styles.strongestDimensionText}>{strongestDimension}</ThemedText> 
                con un promedio de 
                <ThemedText style={styles.strongestDimensionText}>{averages[strongestDimension].toFixed(1)}</ThemedText>.
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

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    container: {
        padding: 20,
    },
    centeredContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        textAlign: 'center',
        marginBottom: 20,
        color: '#2d5a31'
    },
    chartContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    summaryContainer: {
        padding: 15,
        backgroundColor: '#e8f5e9',
        borderRadius: 8,
        marginBottom: 30,
    },
    summaryText: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
    strongestDimensionText: {
        fontWeight: 'bold',
        color: '#2e7d32'
    },
    tableTitle: {
        color: '#2d5a31',
        marginBottom: 15,
    },
    table: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#fff',
        overflow: 'hidden'
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f1f8e9',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
    },
    headerText: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: 15
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    cellText: {
        flex: 1,
        fontSize: 14
    }
});
