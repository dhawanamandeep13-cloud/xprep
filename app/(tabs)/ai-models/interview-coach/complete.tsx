import { useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";

export default function InterviewComplete() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "900", marginBottom: 16 }}>
        Interview Complete
      </Text>

      <Pressable onPress={() => router.push("/ai-models/interview-coach/evaluation")}>
        <Text style={{ fontWeight: "800" }}>View Evaluation</Text>
      </Pressable>
    </View>
  );
}
