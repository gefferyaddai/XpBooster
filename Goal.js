import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  ScrollView,

  ActivityIndicator,
} from 'react-native';


import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {CameraView,useCameraPermissions} from "expo-camera";
import * as Progress from "react-native-progress";
import Svg, { Circle, Path } from "react-native-svg";
import { Animated } from "react-native";
import Reanimated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
  runOnJS,
} from "react-native-reanimated";


const AnimatedCircle = Reanimated.createAnimatedComponent(Circle);
const AnimatedPath = Reanimated.createAnimatedComponent(Path);


const API_BASE = "http://10.12.135.203:8000";// change API base to match
function Camera({ proofRequirement, onResult, setVerifying }){
  const CameraRef = useRef(null);
  const [permisson, requestPermisson] = useCameraPermissions();
  const [sloading, ssetLoading] = useState(false);




  if (!permisson) {
    return (
        <View>

        </View>
    )
  }

  if (!permisson.granted){
    return (
        <View style={styles.center}>
          <Text>Camera access is required </Text>
          <Pressable  style={buttonStyles.container} onPress={requestPermisson}>
            <Text style={buttonStyles.text}>Grant permission</Text>
          </Pressable>
        </View>
    );
  }

  const takePhoto = async ()=> {
    ssetLoading(true);
    setVerifying?.(true);
    if (!CameraRef.current) {
      setVerifying(false);
      ssetLoading(false);
      return;
    }
    const photo = await CameraRef.current.takePictureAsync();
    // send photo to backend
    const formData = new FormData();


    formData.append("file", {
      uri: photo.uri,
      name: "proof.jpg",
      type: "image/jpeg",
    });
    formData.append("proof_requirement", proofRequirement);

    const res = await fetch(`${API_BASE}/verify-proof`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log(data); // { status: true/false, reason: "..." }

    onResult?.(data);
    setVerifying?.(false);
    ssetLoading(false);
  };
  return (
      <View style={{flex: 1}}>
        <CameraView ref={CameraRef} style={{flex: 1}} />
        <Pressable style={{ position: "absolute", bottom: 60, alignSelf: "center" }} onPress={takePhoto}>
          <Text style={{ color: "white" }}>Take picture</Text>
        </Pressable>

        {sloading && (
            <View style={loaderStyles.overlay}>
              <ActivityIndicator size="large" />
              <Text style={loaderStyles.text}>Verifying proof..</Text>
            </View>
        )}
      </View>
  )


}
function CheckMark({
                     size = 120,
                     strokeWidth = 10,
                     duration = 900,
                     onDone,
                   }){
  const r = (size - strokeWidth) /2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  const circleProgress = useSharedValue(0);
  const checkProgress = useSharedValue(0);

  const circleAnimatedProps = useAnimatedProps( () =>
      ({strokeDashoffset: circumference *
            (1 - circleProgress.value),
  }));

  useEffect(() => {
    // draw circle first
    circleProgress.value = withTiming(1, { duration }, (finished) => {
      if (finished) {
        // then draw check
        checkProgress.value = withTiming(1, { duration: 450 }, (done) => {
          if (done && onDone) runOnJS(onDone)();
        });
      }
    });
  }, []);

  return (
      <View style={styles2.container}>
        <Svg width={size} height={size}>
          {/* background ring (optional) */}
          <Circle
              cx={cx}
              cy={cy}
              r={r}
              stroke="rgba(0,0,0,0.1)"
              strokeWidth={strokeWidth}
              fill="none"
          />

          {/* animated ring */}
          <AnimatedCircle
              cx={cx}
              cy={cy}
              r={r}
              stroke="#22c55e"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${circumference} ${circumference}`}
              animatedProps={circleAnimatedProps}
          />

          {/* animated check */}
          <AnimatedPath
              d={checkPath}
              stroke="#22c55e"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              strokeDasharray={`${checkLength} ${checkLength}`}
              animatedProps={checkAnimatedProps}
          />
        </Svg>
      </View>
  );




}
function X({
                                        size = 120,
                                        strokeWidth = 10,
                                        circleDuration = 900,
                                        xDuration = 350,
                                        onDone,
                                      }) {
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  const circleProgress = useSharedValue(0);
  const x1Progress = useSharedValue(0);
  const x2Progress = useSharedValue(0);

  const circleAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - circleProgress.value),
  }));

  // X coordinates (nice proportions inside the circle)
  const p1 = { x: size * 0.32, y: size * 0.32 };
  const p2 = { x: size * 0.68, y: size * 0.68 };
  const p3 = { x: size * 0.68, y: size * 0.32 };
  const p4 = { x: size * 0.32, y: size * 0.68 };

  const xPath1 = `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`; // \
  const xPath2 = `M ${p3.x} ${p3.y} L ${p4.x} ${p4.y}`; // /

  // Approx path length for dash animation (good enough)
  const xLen = Math.hypot(p2.x - p1.x, p2.y - p1.y);

  const x1AnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: xLen * (1 - x1Progress.value),
  }));

  const x2AnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: xLen * (1 - x2Progress.value),
  }));

  useEffect(() => {
    circleProgress.value = withTiming(1, { duration: circleDuration }, (fin) => {
      if (fin) {
        x1Progress.value = withTiming(1, { duration: xDuration }, (fin2) => {
          if (fin2) {
            x2Progress.value = withTiming(1, { duration: xDuration }, (fin3) => {
              if (fin3 && onDone) runOnJS(onDone)();
            });
          }
        });
      }
    });
  }, []);

  return (
      <View style={styles2.container}>
        <Svg width={size} height={size}>
          {/* optional faint ring */}
          <Circle
              cx={cx}
              cy={cy}
              r={r}
              stroke="rgba(0,0,0,0.1)"
              strokeWidth={strokeWidth}
              fill="none"
          />

          {/* animated ring */}
          <AnimatedCircle
              cx={cx}
              cy={cy}
              r={r}
              stroke="#ef4444"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${circumference} ${circumference}`}
              animatedProps={circleAnimatedProps}
          />

          {/* animated X line 1 */}
          <AnimatedPath
              d={xPath1}
              stroke="#ef4444"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${xLen} ${xLen}`}
              animatedProps={x1AnimatedProps}
          />

          {/* animated X line 2 */}
          <AnimatedPath
              d={xPath2}
              stroke="#ef4444"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${xLen} ${xLen}`}
              animatedProps={x2AnimatedProps}
          />
        </Svg>
      </View>
  );
}
function Verification({ result }) {
  if (!result) return null;
  if (result.status === true){
    return(
        <View>
          <Text>Verification complete</Text>
          <CheckMark
              size={140}
              strokeWidth={12}
              onDone={() => console.log("Animation finished!")}
          />

        </View>
    )

  }else {
    return(
        <View>
          <Text>Verification complete</Text>
          <X
              size={140}
              strokeWidth={12}
              onDone={() => console.log("Animation finished!")}
          />
        </View>
    )
  }

}


export function GoalScreen() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Choose difficulty');
  const [goalText, setGoalText] = useState('');
  const [showGoalCard, setShowGoalCard] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null); // null | { status: boolean, reason: string }
  const [verifying, setVerifying] = useState(false);
  const [xp, setXp] = useState(0);
  const XP_PER_OBJECTIVE = 1.5;



  const difficultyMap = {
    Easy: 15,
    Medium: 30,
    Hard: 50,
  };

  const [objectives, setObjectives] = useState([]);

  // ⭐ which objective is open
  const [activeObjective, setActiveObjective] = useState(null); // { goal, index }
  const [modalVisible, setModalVisible] = useState(false);

  // ⭐ animation value
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (!goalText.trim() || selectedOption === 'Choose difficulty') {
      alert('Please enter a goal and choose a difficulty.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/generate-objectives`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goal: goalText,
          difficulty: selectedOption, // "Easy" | "Medium" | "Hard"
        }),
      });

      if (!res.ok) {
        console.log('Backend error:', res.status);
        alert('Error generating objectives.');
        return;
      }

      const data = await res.json();

      // data.objectives is a list of { id, index, text }
      const extracted = data.objectives.map((obj, idx) => ({// can use this to save objectives
        id: obj.id ?? String(idx),
        text: obj.text,
        completed: false,
      }));

      setObjectives(extracted);
      setShowGoalCard(true);
    } catch (err) {
      console.error('Network error:', err);
      alert('Could not contact server.');
    } finally {
      setLoading(false);
    }
  };

  const openObjective = (goal, index) => {
    setActiveObjective({ goal, index });
    setModalVisible(true);

    scaleAnim.setValue(0);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 7,
      tension: 40,
    }).start();
  };

  const closeObjective = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setActiveObjective(null);
    });
  };

  return (
      <SafeAreaView style={styles.container}>
        {/* TOP SECTION: goal input + difficulty */}
        <LevelProgression input={xp} />

        <View
            style={[
              styles.topSection,
              showGoalCard && styles.topSectionWithGoals, // shrink + move up
            ]}
        >
          <Text style={textStyles.title}>Enter your Goal</Text>

          <TextInput
              style={inputArea.container}
              placeholder="start typing..."
              value={goalText}
              onChangeText={setGoalText}
          />

          <Pressable
              style={dropdownStyles.selector}
              onPress={() => setIsOpen(!isOpen)}
          >
            <Text>{selectedOption}</Text>
          </Pressable>

          {isOpen && (
              <View style={dropdownStyles.menu}>
                <Pressable
                    onPress={() => {
                      setSelectedOption('Easy');
                      setIsOpen(false);
                    }}
                >
                  <Text>Easy</Text>
                </Pressable>
                <Pressable
                    onPress={() => {
                      setSelectedOption('Medium');
                      setIsOpen(false);
                    }}
                >
                  <Text>Medium</Text>
                </Pressable>
                <Pressable
                    onPress={() => {
                      setSelectedOption('Hard');
                      setIsOpen(false);
                    }}
                >
                  <Text>Hard</Text>
                </Pressable>
              </View>
          )}

          <Pressable
              style={[buttonStyles.container, loading && { opacity: 0.6 }]}
              onPress={handleStart}
              disabled={loading}
          >
            <Text style={buttonStyles.text}>{loading ? 'LOADING...' : 'START'}</Text>
          </Pressable>
        </View>

        {/* BOTTOM SECTION: grid of cards */}
        {showGoalCard && (
            <View style={styles.bottomSection}>
              <ScrollView contentContainerStyle={styles.cardsContainer}>
                {objectives.map((obj, idx) => {
                  const locked = idx !== 0 && !objectives[idx - 1]?.completed;

                  return (
                      <GoalCard
                          key={obj.id}
                          goal={obj.text}
                          goalCount={idx + 1}
                          completed={obj.completed}
                          locked={locked}
                          onOpen={() => {
                            if (!locked) openObjective(obj.text, idx);
                          }}
                      />
                  );
                })}

              </ScrollView>
            </View>
        )}

        {/* OVERLAY: enlarged animated objective */}
        {modalVisible && activeObjective && (
            <View style={overlayStyles.overlay}>
              {/* backdrop to close on tap */}
              <Pressable style={overlayStyles.backdrop} onPress={closeObjective} />

              <Animated.View
                  style={[
                    overlayStyles.modalCard,
                    { transform: [{ scale: scaleAnim }] },
                  ]}
              >
                <Text style={overlayStyles.modalTitle}>
                  Objective #{activeObjective.index + 1}
                </Text>

                <View style={overlayStyles.modalBodyWrapper}>
                  <ScrollView
                      style={overlayStyles.modalBodyScroll}
                      contentContainerStyle={overlayStyles.modalBodyContent}
                  >
                    <Text style={overlayStyles.modalBodyText}>
                      {activeObjective.goal}
                    </Text>
                  </ScrollView>

                  {verifying && <Text style={{ marginTop: 10 }}>Verifying proof...</Text>}
                  <Verification result={verificationResult} />


                </View>

                <Pressable
                    style={overlayStyles.modalButton}
                    onPress={() => {
                      setVerificationResult(null);
                      setShowCamera(true);
                    }}
                >
                  <Text style={overlayStyles.modalButtonText}>Submit proof</Text>
                </Pressable>

              </Animated.View>
            </View>
        )}

        {/* FULLSCREEN LOADER */}
        {loading && (
            <View style={loaderStyles.overlay}>
              <ActivityIndicator size="large" />
              <Text style={loaderStyles.text}>Generating objectives..</Text>
            </View>
        )}

        {showCamera && (
            <View style={cameraOverlayStyles.overlay}>
              <Camera
                  proofRequirement={activeObjective?.goal ?? ""}
                  setVerifying={setVerifying}
                  onResult={(result) => {
                    setVerificationResult(result);
                    setShowCamera(false);

                    if (result?.status === true && activeObjective) {
                      const idx = activeObjective.index;

                      setObjectives((prev) => {
                        // already completed? don't award again
                        if (prev[idx]?.completed) return prev;

                        const copy = [...prev];
                        copy[idx] = { ...copy[idx], completed: true };
                        return copy;
                      });

                      setXp((prevXp) => prevXp + XP_PER_OBJECTIVE);
                    }
                  }}

              />

              <Pressable style={cameraOverlayStyles.close} onPress={() => setShowCamera(false)}>
                <Text style={cameraOverlayStyles.closeText}>Close</Text>
              </Pressable>
            </View>
        )}

        <StatusBar style="auto" />
      </SafeAreaView>
  );

}

const isObjectiveLocked = (objectives, index) => {
  if (index === 0) return false;
  return !objectives[index-1]?.completed;
  };


export function LevelProgression({ input }) {
  const XP_PER_LEVEL = 50;

  const startLevel = Math.floor(input / XP_PER_LEVEL);
  const nextLevel = startLevel + 1;

  const progress = (input % XP_PER_LEVEL) / XP_PER_LEVEL; // always 0..1


  return (
      <View style={styles1.row}>
        <Text style={styles1.level}> lvl {startLevel}</Text>

        <Progress.Bar
            progress={progress}
            width={350}
            height={20}
            color="#4CAF50"
            unfilledColor="#e0e0e0"
            borderWidth={0}
            borderRadius={6}
        />

        <Text style={styles4.level}>lvl {nextLevel}</Text>
      </View>
  );
}

const styles1 = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  level: { fontWeight: "600" },
});

function GoalCard({ goal, goalCount, onOpen, locked, completed }) {
  return (
      <View
          style={[
            goalCardStyles.card,
            locked && { opacity: 0.4 },
            completed && { borderColor: "#22c55e" },
          ]}
      >
        <Text style={goalCardStyles.title}>
          objective #{goalCount}
        </Text>

        <Text style={goalCardStyles.body} numberOfLines={2}>
          {goal}
        </Text>

        {completed ? (
            <Text style={{ color: "#22c55e", fontWeight: "600" }}>✅</Text>
        ) : locked ? (
            <Text style={{ color: "#666" }}>🔒</Text>
        ) : (
            <Pressable
                style={goalCardStyles.button}
                onPress={onOpen}
            >
              <Text style={goalCardStyles.buttonText}>OPEN</Text>
            </Pressable>
        )}
      </View>
  );
}


//  Add near your styles (optional helper constants)
const COLORS = {
  blueBell: "#3E92CC",
  balticBlue: "#2A628F",
  deepSpace: "#13293D",
  deepSpaceAlt: "#16324F",
  yaleBlue: "#18435A",
  text: "rgba(255,255,255,0.92)",
  muted: "rgba(255,255,255,0.65)",
  border: "rgba(255,255,255,0.10)",
};

//  MAIN LAYOUT
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.deepSpace,
  },
  topSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  topSectionWithGoals: {
    flex: 0.4,
    justifyContent: "flex-start",
    paddingTop: 12,
  },
  bottomSection: {
    flex: 0.6,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
    columnGap: 12,
    paddingTop: 8,
    paddingBottom: 24,
  },
});

//  LEVEL PROGRESSION ROW
const styles4 = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },
  level: {
    fontWeight: "800",
    color: COLORS.text,
  },
});

//  TEXT
const textStyles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.blueBell,
    marginBottom: 10,
    letterSpacing: 0.2,
  },
});

//  INPUT
const inputArea = StyleSheet.create({
  container: {
    height: 44,
    width: 280,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.deepSpaceAlt,
    color: COLORS.text,
    paddingHorizontal: 12,
    marginTop: 10,
    borderRadius: 14,
  },
});

//  PRIMARY BUTTON (START / Grant permission)
const buttonStyles = StyleSheet.create({
  container: {
    marginTop: 16,
    backgroundColor: COLORS.balticBlue,
    paddingVertical: 12,
    paddingHorizontal: 34,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(62,146,204,0.25)", // accent tint
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});

//  DROPDOWN
const dropdownStyles = StyleSheet.create({
  selector: {
    marginTop: 12,
    width: 280,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.yaleBlue,
    padding: 12,
    borderRadius: 14,
  },
  menu: {
    marginTop: 8,
    width: 280,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 10,
    backgroundColor: COLORS.deepSpaceAlt,
  },
});

//  GOAL CARD (grid)
const goalCardStyles = StyleSheet.create({
  card: {
    width: "30%",
    minWidth: 105,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    backgroundColor: COLORS.deepSpaceAlt,

    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  title: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.blueBell,
    marginBottom: 6,
  },
  body: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.9,
    marginBottom: 10,
  },
  button: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.balticBlue,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  buttonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "800",
  },
});

//  OVERLAY MODAL (objective popup)
const overlayStyles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(19,41,61,0.75)", // deepSpace with opacity
  },
  modalCard: {
    width: "88%",
    maxHeight: "90%",
    backgroundColor: COLORS.yaleBlue,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(62,146,204,0.18)",

    shadowColor: "#000",
    shadowOpacity: 0.28,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.blueBell,
    marginBottom: 10,
  },
  modalBodyWrapper: {
    flexGrow: 1,
    marginVertical: 8,
  },
  modalBodyScroll: {
    maxHeight: 240,
    backgroundColor: "rgba(22,50,79,0.55)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalBodyContent: {
    paddingBottom: 8,
  },
  modalBodyText: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.text,
  },
  modalButton: {
    marginTop: 14,
    alignSelf: "center",
    backgroundColor: COLORS.balticBlue,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.2,
  },
});

//  LOADER
const loaderStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(19,41,61,0.85)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
});

//  CAMERA OVERLAY
const cameraOverlayStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.deepSpace,
    zIndex: 9999,
  },
  close: {
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: "rgba(22,50,79,0.85)",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  closeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
  },
});

//Used for CheckMark / X container
const styles2 = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center" },
});
