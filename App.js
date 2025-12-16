import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  ScrollView,
  Animated,
  ActivityIndicator,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function HomeScreen() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Choose difficulty');
  const [goalText, setGoalText] = useState('');
  const [showGoalCard, setShowGoalCard] = useState(false);

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
      const res = await fetch('http://127.0.0.1:8000/generate-objectives', {
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
      const extracted = data.objectives.map((obj) => obj.text);

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
                {objectives.map((obj, idx) => (
                    <GoalCard
                        key={idx}
                        goal={obj}
                        goalCount={idx + 1}
                        onOpen={() => openObjective(obj, idx)}
                    />
                ))}
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
                </View>

                <Pressable style={overlayStyles.modalButton}>
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

        <StatusBar style="auto" />
      </SafeAreaView>
  );
}

function QuestScreen() {
  return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Quest</Text>
      </SafeAreaView>
  );
}

function ProfileScreen() {
  return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Profile</Text>
      </SafeAreaView>
  );
}

export default function App() {
  return (
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name={'Home'} component={HomeScreen} />
          <Tab.Screen name={'Quest'} component={QuestScreen} />
          <Tab.Screen name={'Profile'} component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
  );
}

function GoalCard({ goal, goalCount, onOpen }) {
  return (
      <View style={goalCardStyles.card}>
        <Text style={goalCardStyles.title}>objective #{goalCount}</Text>
        <Text style={goalCardStyles.body} numberOfLines={2}>
          {goal}
        </Text>

        <Pressable style={goalCardStyles.button} onPress={onOpen}>
          <Text style={goalCardStyles.buttonText}>OPEN</Text>
        </Pressable>
      </View>
  );
}

// MAIN LAYOUT
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  topSection: {
    flex: 1, // when no goals, takes full screen
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  topSectionWithGoals: {
    flex: 0.4, // shrink to ~top 40% when goals visible
    justifyContent: 'flex-start',
  },
  bottomSection: {
    flex: 0.6, // bottom ~60% of screen
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // spreads cards across row
    rowGap: 12,
  },
});

const textStyles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
});

const inputArea = StyleSheet.create({
  container: {
    height: 40,
    width: 250,
    borderWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 10,
    marginTop: 20,
    borderRadius: 8,
  },
});

const buttonStyles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
});

const dropdownStyles = StyleSheet.create({
  selector: {
    marginTop: 20,
    width: 250,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 8,
  },
  menu: {
    marginTop: 5,
    width: 250,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 5,
  },
});

// GOAL CARD
const goalCardStyles = StyleSheet.create({
  card: {
    width: '30%', // roughly 3 per row
    minWidth: 100,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  body: {
    fontSize: 12,
    marginBottom: 8,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: 'black',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
  },
});

const overlayStyles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalCard: {
    width: '85%',
    maxHeight: '90%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalBodyWrapper: {
    flexGrow: 1,
    marginVertical: 8,
  },
  modalBodyScroll: {
    maxHeight: 220,
  },
  modalBodyContent: {
    paddingBottom: 8,
  },
  modalBodyText: {
    fontSize: 14,
    lineHeight: 20,
  },
  modalButton: {
    marginTop: 12,
    alignSelf: 'center',
    backgroundColor: 'black',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

const loaderStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  text: { marginTop: 12, fontSize: 16 },
});