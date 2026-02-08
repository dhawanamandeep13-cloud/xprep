import * as DocumentPicker from "expo-document-picker";

const uploadCV = async () => {
  const result = await DocumentPicker.getDocumentAsync({
    type: ["application/pdf"],
  });

  if (!result.canceled) {
    console.log("CV:", result.assets[0]);
  }
};
<Pressable onPress={uploadCV}>
  <Text>Upload Resume (PDF)</Text>
</Pressable>
