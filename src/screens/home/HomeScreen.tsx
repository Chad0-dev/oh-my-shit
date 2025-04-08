import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { CharacterBox } from "../../components/home/CharacterBox";
import { Timer } from "../../components/home/Timer";
import { TimerButtons } from "../../components/home/TimerButtons";
import { InfoTicker } from "../../components/home/InfoTicker";

export const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <InfoTicker />
      <CharacterBox />
      <Timer />
      <TimerButtons />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
