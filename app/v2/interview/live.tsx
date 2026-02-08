import InterviewerAvatar from "../../v2/components/InterviewerAvatar";
import { startRecording, stopRecording } from "../../v2/components/VoiceRecorder";
<CameraView style={{ flex: 1 }} facing="front" />

<View style={{ position: "absolute", top: 80, alignSelf: "center" }}>
  <InterviewerAvatar speaking={isRecording} />
</View>
