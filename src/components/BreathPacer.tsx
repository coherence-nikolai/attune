import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { BREATH_PHASES } from '../constants/attune';
import { theme } from '../theme';

type BreathPacerProps = {
  running: boolean;
};

export function BreathPacer({ running }: BreathPacerProps) {
  const haloScale = useRef(new Animated.Value(0.96)).current;
  const ringScale = useRef(new Animated.Value(0.92)).current;
  const orbScale = useRef(new Animated.Value(0.97)).current;
  const coreScale = useRef(new Animated.Value(0.92)).current;
  const glowOpacity = useRef(new Animated.Value(0.18)).current;
  const captionOpacity = useRef(new Animated.Value(0.72)).current;

  useEffect(() => {
    if (!running) {
      haloScale.stopAnimation();
      ringScale.stopAnimation();
      orbScale.stopAnimation();
      coreScale.stopAnimation();
      glowOpacity.stopAnimation();
      captionOpacity.stopAnimation();
      return;
    }

    const inhaleMs = BREATH_PHASES.inhaleSeconds * 1000;
    const exhaleMs = BREATH_PHASES.exhaleSeconds * 1000;
    const settleMs = BREATH_PHASES.settleSeconds * 1000;

    const cycle = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(haloScale, {
            toValue: 1.1,
            duration: inhaleMs,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(ringScale, {
            toValue: 1.04,
            duration: inhaleMs,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(orbScale, {
            toValue: 1.08,
            duration: inhaleMs,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(coreScale, {
            toValue: 1.15,
            duration: inhaleMs,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.34,
            duration: inhaleMs,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(captionOpacity, {
            toValue: 0.94,
            duration: inhaleMs,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ]),
        Animated.delay(settleMs),
        Animated.parallel([
          Animated.timing(haloScale, {
            toValue: 0.96,
            duration: exhaleMs,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(ringScale, {
            toValue: 0.92,
            duration: exhaleMs,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(orbScale, {
            toValue: 0.97,
            duration: exhaleMs,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(coreScale, {
            toValue: 0.92,
            duration: exhaleMs,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.14,
            duration: exhaleMs,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(captionOpacity, {
            toValue: 0.68,
            duration: exhaleMs,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ]),
      ]),
    );

    cycle.start();
    return () => cycle.stop();
  }, [captionOpacity, coreScale, glowOpacity, haloScale, orbScale, ringScale, running]);

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.halo, { opacity: glowOpacity, transform: [{ scale: haloScale }] }]} />
      <Animated.View style={[styles.ring, { transform: [{ scale: ringScale }] }]} />
      <Animated.View style={[styles.orb, { transform: [{ scale: orbScale }] }]}> 
        <Animated.View style={[styles.core, { transform: [{ scale: coreScale }] }]} />
      </Animated.View>
      <Animated.Text style={[styles.caption, { opacity: captionOpacity }]}>IN · OUT · SETTLE</Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 336,
  },
  halo: {
    position: 'absolute',
    width: 268,
    height: 268,
    borderRadius: 999,
    backgroundColor: theme.colors.accentGlowStrong,
  },
  ring: {
    position: 'absolute',
    width: 212,
    height: 212,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(146, 168, 255, 0.24)',
    backgroundColor: 'rgba(10, 16, 24, 0.36)',
  },
  orb: {
    width: 162,
    height: 162,
    borderRadius: 999,
    backgroundColor: '#0e1828',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(146, 168, 255, 0.18)',
    shadowColor: theme.colors.shadow,
    shadowOpacity: 0.22,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 12 },
  },
  core: {
    width: 100,
    height: 100,
    borderRadius: 999,
    backgroundColor: theme.colors.accent,
    shadowColor: theme.colors.shadow,
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  caption: {
    marginTop: 26,
    color: theme.colors.textSoft,
    fontSize: 13,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
});
