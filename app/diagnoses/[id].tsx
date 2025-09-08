
import RadarChart from "@/components/RadarChart";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from '@/constants/Colors';
import { INDICATORS } from "@/constants/questions";
import { SHORT_INDICATORS } from "@/constants/shortquestions";
import { useColorScheme } from "@/hooks/useColorScheme";
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

const screenWidth = Dimensions.get('window').width;

const getStyles = (colorScheme: 'light' | 'dark') => {
  const theme = Colors[colorScheme];
  return StyleSheet.create({
    scrollContainer: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      padding: 20,
      paddingTop: 80, // Add padding to avoid overlap with the button
      backgroundColor: theme.background,
    },
    centeredContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
    },
    headerContainer: {
      marginBottom: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      textAlign: 'center',
      marginBottom: 20,
      color: theme.primary,
    },
    chartContainer: {
      alignItems: 'center',
      marginBottom: 30,
      backgroundColor: theme.background, // Set background for the chart view
    },
    summaryContainer: {
      padding: 15,
      backgroundColor: theme.summaryBoxBg,
      borderRadius: 8,
      marginBottom: 30,
    },
    summaryText: {
      fontSize: 16,
      textAlign: 'center',
      lineHeight: 24,
      color: theme.text,
    },
    strongestDimensionText: {
      fontWeight: 'bold',
      color: theme.tint,
    },
    tableTitle: {
      color: theme.primary,
      marginBottom: 15,
      textAlign: 'center',
      fontSize: 20,
    },
    table: {
      borderWidth: 1,
      borderColor: theme.tableBorder,
      borderRadius: 8,
      backgroundColor: theme.tableBg,
      overflow: 'hidden',
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: theme.tableHeaderBg,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.tableBorder,
    },
    headerText: {
      flex: 1,
      fontWeight: 'bold',
      fontSize: 15,
      color: theme.tableHeaderText,
      textAlign: 'center',
    },
    tableRow: {
      flexDirection: 'row',
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.tableBorder, 
    },
    cellText: {
      flex: 1,
      fontSize: 14,
      color: theme.tableRowText,
      textAlign: 'center',
    },
    downloadButtonContainer: {
      padding: 20,
      backgroundColor: theme.background,
    },
    locationContainer: {
      marginBottom: 20,
      alignItems: 'center',
    },
    locationTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.primary,
      marginBottom: 10,
    },
    locationText: {
      fontSize: 16,
      color: theme.text,
    },
    
  });
};

export default function DiagnosisResultScreen() {
  const { id } = useLocalSearchParams();
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [loading, setLoading] = useState(true);
  const chartViewShotRef = useRef<ViewShot>(null);
  const colorScheme = useColorScheme() || 'light';
  const styles = getStyles(colorScheme);
  const themeColors = Colors[colorScheme];

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

  const createPDFHTML = (chartImage: string, averages: any, strongestDimension: string, diagnosisName: string, latitude: number | undefined, longitude: number | undefined, currentDate: string, currentTime: string) => {
    const tableRows = diagnosis?.answers.map(ans => {
        const indicator = INDICATORS.find(i => i.id === ans.indicatorId);
        return `<tr><td>${indicator?.question || 'N/A'}</td><td>${ans.value}</td></tr>`;
    }).join('');

    const locationHtml = latitude && longitude ? `<p><b>Ubicación:</b> Latitud ${latitude.toFixed(4)}, Longitud ${longitude.toFixed(4)}</p>` : '';

    return `
      <html>
        <head>
          <style>
            body { font-family: Helvetica, Arial, sans-serif; margin: 40px; color: #333; }
            h1 { text-align: center; color: #4CAF50; }
            h2 { text-align: center; color: #4CAF50; }
            p { text-align: center; margin-bottom: 5px; }
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
          <h2>${diagnosisName}</h2>
          <p><b>Fecha:</b> ${currentDate}</p>
          <p><b>Hora:</b> ${currentTime}</p>
          ${locationHtml}
          <div class="chart"><img src="data:image/png;base64,${chartImage}" /></div>
          <div class="summary">
            La dimensión con mayor fortaleza es la <b>${strongestDimension}</b> 
            con un promedio de <b>${averages[strongestDimension].toFixed(1)}</b>.
          </div>
          <h2>Tabla de Respuestas</h2>
          <table>
            <thead><tr><th>Indicador</th><th>Respuesta</th></tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
        </body>
      </html>
    `;
  };
  

  const handleDownload = async () => {
    if (chartViewShotRef.current?.capture && diagnosis) {
        try {
            const base64 = await chartViewShotRef.current.capture();
            const now = new Date();
            const currentDate = now.toLocaleDateString('es-ES');
            const currentTime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            const html = createPDFHTML(
                base64,
                averages,
                strongestDimension,
                diagnosis.name,
                diagnosis.location?.latitude,
                diagnosis.location?.longitude,
                currentDate,
                currentTime
            );
            const { uri } = await Print.printToFileAsync({ html });
            await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Descargar Diagnóstico' });
        } catch (error) {
            console.error("Failed to generate PDF:", error);
            Alert.alert('Error', 'No se pudo generar el PDF.');
        }
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={themeColors.primary} />
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

  const scaleIndicators = INDICATORS.filter(i => i.type === 'scale');
  const shortScaleIndicators = SHORT_INDICATORS.filter(i => i.type === 'scale');
  const chartLabels = shortScaleIndicators.map(i => ({ question: i.question, dimension: i.dimension }));
  const chartData = scaleIndicators.map(indicator => {
    const answer = diagnosis.answers.find(a => a.indicatorId === indicator.id);
    const value = answer?.value ?? 0;
    return typeof value === 'number' ? Math.max(0, Math.min(4, value)) : 0;
  });

  const getDimensionAverages = () => {
    const dimensions: { [key in 'Técnica' | 'Ecológica' | 'Social']: number[] } = { Técnica: [], Ecológica: [], Social: [] };
    diagnosis.answers.forEach((answer) => {
      const indicator = INDICATORS.find((i) => i.id === answer.indicatorId);
      if (indicator && indicator.type === "scale") {
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
  const strongestDimension = dimensionKeys.reduce((a, b) => averages[a] > averages[b] ? a : b);

  return (
    <View style={{flex: 1}}>
      <ScrollView style={styles.scrollContainer}>
        <ThemedView style={styles.container}>
          <View style={styles.headerContainer}>
            <ThemedText type="title" style={styles.title}>Resultados del Diagnóstico: {diagnosis.name}</ThemedText>
          </View>
          <ViewShot ref={chartViewShotRef} options={{ format: 'png', quality: 1, result: 'base64' }}>
            <View style={styles.chartContainer}>
              <RadarChart
                datasets={[{ data: chartData, color: themeColors.chartLineColor, name: 'Diagnóstico' }]}
                theme={colorScheme}
                labels={chartLabels}
                size={screenWidth - 20}
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

          {diagnosis.location && (
            <View style={styles.locationContainer}>
              <ThemedText style={styles.locationTitle}>Ubicación Geográfica</ThemedText>
              <ThemedText style={styles.locationText}>
                Latitud: {diagnosis.location.latitude.toFixed(4)}
              </ThemedText>
              <ThemedText style={styles.locationText}>
                Longitud: {diagnosis.location.longitude.toFixed(4)}
              </ThemedText>
            </View>
          )}

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
        <Button title="Descargar PDF" onPress={handleDownload} color={themeColors.primary} />
      </View>
    </View>
  );
}
