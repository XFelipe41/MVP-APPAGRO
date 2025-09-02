
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        AppAgro Diagnóstico
      </ThemedText>
      <Link href="/new-diagnosis" asChild>
        <TouchableOpacity style={styles.button}>
          <ThemedText style={styles.buttonText}>Nuevo Diagnóstico</ThemedText>
        </TouchableOpacity>
      </Link>
      <Link href="/diagnoses" asChild>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
          <ThemedText style={[styles.buttonText, styles.secondaryButtonText]}>
            Ver Diagnósticos Anteriores
          </ThemedText>
        </TouchableOpacity>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    marginBottom: 40,
    color: "#2d5a31",
  },
  button: {
    width: "80%",
    padding: 15,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  secondaryButtonText: {
    color: "#4CAF50",
  },
});
