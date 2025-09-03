
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";
import { ImageBackground, StyleSheet, TouchableOpacity, View } from "react-native";

const backgroundImage = {
  uri: "https://plus.unsplash.com/premium_photo-1680322478065-f949f1a7b06f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

export default function HomeScreen() {
  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <ThemedView style={styles.overlay}>
        <View style={styles.topContainer}>
          <ThemedText type="title" style={styles.title}>
            AppAgro Diagnóstico
          </ThemedText>
        </View>
        <View style={styles.bottomContainer}>
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
        </View>
      </ThemedView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // Dark overlay for better text readability
    alignItems: "center",
    justifyContent: "space-between", // Pushes title to top and buttons to bottom
    padding: 20,
  },
  topContainer: {
    alignItems: "center",
    marginTop: 60, // Adjust as needed for status bar height
  },
  bottomContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 40, // Adjust as needed
  },
  title: {
    color: "#4CAF50",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
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
