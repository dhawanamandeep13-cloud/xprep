import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { modules } from "../data";

export default function HomeScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  /* 🚀 ROCKET ANIMATION — WEB ONLY */
  const rocketY = useRef(new Animated.Value(0)).current;
  const rocketOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (Platform.OS !== "web") return;

    const launch = () => {
      rocketY.setValue(0);
      rocketOpacity.setValue(1);

      Animated.sequence([
        Animated.parallel([
          Animated.timing(rocketY, {
            toValue: -1200,
            duration: 14000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(rocketOpacity, {
            toValue: 0,
            duration: 14000,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(1200),
      ]).start(() => launch());
    };

    launch();
  }, []);

  const filteredModules = modules.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={{ flex: 1 }}>
      {/* 🚀 ROCKET */}
      {Platform.OS === "web" && (
        <Animated.Image
          source={require("../../assets/images/rocket.png")}
          resizeMode="contain"
          style={[
            styles.rocket,
            {
              opacity: rocketOpacity,
              transform: [{ translateY: rocketY }],
            },
          ]}
        />
      )}

      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.content}>
          {/* BRAND */}
          <Text style={styles.brandCenter}>Xprep.in</Text>

          {/* HERO */}
          <Text style={styles.heading}>
            Master Interviews Before They Begin
          </Text>

          <Text style={styles.tagline}>
            Ethical, structured interview preparation — recruiter-safe by design
          </Text>

          <Text style={styles.mission}>
            Learn how interviews actually work, practice high-impact questions,
            and build real confidence using AI — before the interview, not during it.
          </Text>

          <Text style={styles.ethics}>
            No live interview assistance • No shortcuts • Just real preparation
          </Text>

          {/* ✅ PRIMARY CTA */}
          <Pressable
            style={styles.ctaButton}
            onPress={() =>
              router.push({
                pathname: "/modules/[slug]",
                params: { slug: "interview-fundamentals" },
              })
            }
          >
            <Text style={styles.ctaText}>
              ▶ Start with Interview Fundamentals
            </Text>
          </Pressable>

          {/* ✅ VALUE CARDS */}
          <View style={styles.valueGrid}>
            <View style={styles.valueCard}>
              <Text style={styles.valueTitle}>Learn the Fundamentals</Text>
              <Text style={styles.valueText}>
                Understand interview formats, expectations, and evaluation logic.
              </Text>
            </View>

            <View style={styles.valueCard}>
              <Text style={styles.valueTitle}>Practice Ethically with AI</Text>
              <Text style={styles.valueText}>
                Practice real interview questions — no live assistance.
              </Text>
            </View>

            <View style={styles.valueCard}>
              <Text style={styles.valueTitle}>Prepare for Final Rounds</Text>
              <Text style={styles.valueText}>
                Company research, negotiation, and long-term growth.
              </Text>
            </View>
          </View>

          {/* SEARCH */}
          <TextInput
            placeholder="Search topics, roles, companies, skills..."
            value={search}
            onChangeText={setSearch}
            style={styles.search}
          />

          {/* MODULE GRID */}
          <View style={styles.grid}>
            {filteredModules.map((module) => {
              const isAIModels = module.slug === "ai-models";
              const isOneOnOne = module.slug === "one-on-one-experts";
              const isInterviewCoach = module.slug === "interview-coach";
              const hasValidSlug =
                typeof module.slug === "string" && module.slug.length > 0;

              return (
                <Pressable
                  key={module.slug ?? module.title}
                  disabled={!hasValidSlug}
                  onPress={() => {
                    if (!hasValidSlug) return;

                    if (module.external && module.url) {
                      Linking.openURL(module.url);
                      return;
                    }

                    if (isAIModels) {
                      router.push("/(tabs)/ai-models");
                      return;
                    }

                    if (isInterviewCoach) {
                      router.push("/(tabs)/ai-models/interview-coach");
                      return;
                    }

                    router.push({
                      pathname: "/modules/[slug]",
                      params: { slug: module.slug },
                    });
                  }}
                  style={({ hovered, pressed }) => [
                    styles.card,
                    (isAIModels || isOneOnOne) && styles.premiumCard,
                    hovered && Platform.OS === "web" && styles.cardHover,
                    pressed && styles.cardPressed,
                    !isAIModels &&
                      !isOneOnOne &&
                      module.locked &&
                      styles.lockedCard,
                  ]}
                >
                  <Text style={styles.icon}>{module.icon}</Text>
                  <Text style={styles.cardTitle}>{module.title}</Text>
                  <Text style={styles.cardSub}>
                    {module.topics.length} Topics
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  page: {
    paddingTop: 80,
    paddingHorizontal: 36,
    paddingBottom: 120,
    backgroundColor: "#f6f7f9",
  },

  rocket: {
    position: "absolute",
    left: 4,
    bottom: -150,
    width: 180,
    height: 460,
    zIndex: 5,
    pointerEvents: "none",
  },

  content: { paddingLeft: 110 },

  brandCenter: {
    fontSize: 32,
    fontWeight: "900",
    color: "#0B3C5D",
    textAlign: "center",
    marginBottom: 18,
  },

  heading: {
    fontSize: 40,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: 48,
    marginBottom: 10,
  },

  tagline: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },

  mission: {
    textAlign: "center",
    fontSize: 16,
    color: "#555",
    maxWidth: 880,
    alignSelf: "center",
    marginBottom: 14,
  },

  ethics: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    color: "#0B3C5D",
    marginBottom: 24,
  },

  ctaButton: {
    alignSelf: "center",
    backgroundColor: "#000",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 999,
    marginBottom: 40,
  },

  ctaText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },

  valueGrid: {
    flexDirection: "row",
    gap: 24,
    justifyContent: "center",
    marginBottom: 48,
  },

  valueCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 22,
    width: 280,
  },

  valueTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
  },

  valueText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },

  search: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    marginBottom: 36,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 24,
    justifyContent: "center",
  },

  card: {
    backgroundColor: "#fff",
    width: 350,
    height: 220,
    borderRadius: 24,
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
  },

  premiumCard: {
    borderWidth: 2,
    borderColor: "#C9A24D",
  },

  cardHover: { transform: [{ scale: 1.05 }] },
  cardPressed: { transform: [{ scale: 0.97 }] },
  lockedCard: { opacity: 0.55 },

  icon: { fontSize: 42, marginBottom: 12 },

  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },

  cardSub: { fontSize: 14, color: "#666" },
});
