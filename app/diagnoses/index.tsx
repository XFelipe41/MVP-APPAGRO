
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Diagnosis } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";

export default function DiagnosesListScreen() {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchDiagnoses = async () => {
        try {
          const keys = await AsyncStorage.getAllKeys();
          const diagnosisKeys = keys.filter((key) =>
            key.startsWith("diagnosis_")
          );
          const items = await AsyncStorage.multiGet(diagnosisKeys);
          const loadedDiagnoses = items
            .map((item) => (item[1] ? JSON.parse(item[1]) : null))
            .filter((d) => d !== null);
          setDiagnoses(
            loadedDiagnoses.sort(
              (a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            )
          );
        } catch (error) {
          console.error("Failed to fetch diagnoses:", error);
        }
      };

      fetchDiagnoses();
    }, [])
  );

  const handleDelete = (id: string) => {
    Alert.alert(
      "Eliminar Diagnóstico",
      "¿Estás seguro de que quieres eliminar este diagnóstico? Esta acción no se puede deshacer.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(id);
              setDiagnoses((prevDiagnoses) =>
                prevDiagnoses.filter((d) => d.id !== id)
              );
            } catch (error) {
              console.error("Failed to delete diagnosis:", error);
              Alert.alert("Error", "No se pudo eliminar el diagnóstico.");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  if (diagnoses.length === 0) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ThemedText>No hay diagnósticos guardados.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={diagnoses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Link href={`/diagnoses/${item.id}`} asChild>
              <TouchableOpacity style={styles.itemLink}>
                <ThemedText style={styles.itemText}>
                  Diagnóstico del{" "}
                  {new Date(item.date).toLocaleString("es-ES")}
                </ThemedText>
              </TouchableOpacity>
            </Link>
            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
              style={styles.deleteButton}
            >
              <ThemedText style={styles.deleteButtonText}>Eliminar</ThemedText>
            </TouchableOpacity>
          </View>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemLink: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
  deleteButton: {
    marginLeft: 15,
    backgroundColor: "#ef5350", // Un rojo suave
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
});
