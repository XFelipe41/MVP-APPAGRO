
import RadarChart from "@/components/RadarChart";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { INDICATORS } from "@/constants/questions";
import { Diagnosis } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Print from 'expo-print';
import { useLocalSearchParams } from "expo-router";
import * as Sharing from 'expo-sharing';
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ViewShot from "react-native-view-shot";

// Get screen width for responsive chart size
const screenWidth = Dimensions.get('window').width;

export default function DiagnosisResultScreen() {
  const { id } = useLocalSearchParams();
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [loading, setLoading] = useState(true);
  const chartViewShotRef = useRef<ViewShot>(null);

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

  const createPDFHTML = (chartImage: string, averages: any, strongestDimension: string) => {
    const tableRows = diagnosis?.answers.map(ans => {
        const indicator = INDICATORS.find(i => i.id === ans.indicatorId);
        return `<tr><td>${indicator?.question || 'N/A'}</td><td>${ans.value}</td></tr>`;
    }).join('');

    return `
      <html>
        <head>
          <style>
            body { font-family: Helvetica, Arial, sans-serif; margin: 40px; color: #333; }
            h1 { text-align: center; color: #4CAF50; }
            .chart { display: flex; justify-content: center; margin: 40px 0; }
            img { width: 80%; height: auto; }
            .summary { background-color: #f2f2f2; padding: 20px; border-radius: 8px; text-align: center; font-size: 16px; margin-bottom: 30px; }
            .summary b { color: #4CAF50; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #4CAF50; color: white; }
            tr:nth-child(even) { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Resultados del Diagnóstico Agroecológico</h1>
          
          <div class="chart">
            <img src="data:image/png;base64,${chartImage}" />
          </div>

          <div class="summary">
            La dimensión con mayor fortaleza es la <b>${strongestDimension}</b> 
            con un promedio de <b>${averages[strongestDimension].toFixed(1)}</b>.
          </div>

          <h2>Tabla de Respuestas</h2>
          <table>
            <thead>
              <tr>
                <th>Indicador</th>
                <th>Respuesta</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </body>
      </html>
    `;
  };

  const handleDownload = async () => {
    if (chartViewShotRef.current?.capture) {
        chartViewShotRef.current.capture().then(async (base64) => {
            try {
                const html = createPDFHTML(base64, averages, strongestDimension);
                const { uri } = await Print.printToFileAsync({ html });

                await Sharing.shareAsync(uri, {
                    mimeType: 'application/pdf',
                    dialogTitle: 'Descargar Diagnóstico',
                });

            } catch (error) {
              console.error("Failed to generate PDF:", error);
              Alert.alert('Error', 'Failed to generate PDF.');
            }
        });
    }
  };

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
  
  const chartLabels = scaleIndicators.map(i => ({ question: i.question, dimension: i.dimension }));
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
    <View style={{flex: 1}}>
        <ScrollView style={styles.scrollContainer}>
            <ThemedView style={styles.container}>
                <ThemedText type="title" style={styles.title}>Resultados del Diagnóstico</ThemedText>
                
                <ViewShot ref={chartViewShotRef} options={{ format: 'png', quality: 1, result: 'base64' }}>
                    <View style={[styles.chartContainer, { backgroundColor: Colors.dark.background }]}>
                        <RadarChart
                            datasets={[{ data: chartData, color: '#9347c3ff', name: 'Diagnóstico' }]}
                            labels={chartLabels}
                            size={screenWidth - 20} // Responsive size
                        />
                    </View>
                </ViewShot>

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
        <View style={styles.downloadButtonContainer}>
            <Button title="Descargar PDF" onPress={handleDownload} color="#4CAF50" />
        </View>
    </View>
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
    backgroundColor: Colors.dark.background, // Ensure background color is set for capture
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
  downloadButtonContainer: {
    padding: 20,
    backgroundColor: Colors.dark.background,
  }
});
