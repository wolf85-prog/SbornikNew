import { Stack } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

export default function NextPage() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: "Next Page" }} />
      <Text style={{ fontSize: 24 }}>Next page of Playlist Tab</Text>
    </View>
  );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
});