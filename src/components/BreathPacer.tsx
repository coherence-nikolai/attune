import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { BREATH_PHASES } from '../constants/attune';
import { theme } from '../theme';

type BreathPacerProps = {
  running: boolean;
};

export function BreathPacer({ running }: BreathPacerProps) {
  const haloScale = useRef(new Animated.Value(0.96)).current;
  const ringScale = useRef(new Animated.Value(0.98)).current;
  const coreScale = useRef(new Animated.Value(0.96)).current;
  const haloOpacity = useRef(new Animated.Value(0.18)).current;
  const ringOpacity = useRef(new Animated.Value(0.56)).current;
  const captionOpacity = useRef(new Animated.Value(0.72)).current;

  useEffect(() => {
    const animatedValues = [haloScale, ringScale, coreScale, haloOpacity, ringOpacity, captionOpacity];

    if (!running) {
      animatedValues.forEach((value) => value.stopAnimation());
      return;
    }

    const inhaleDuration = BREATH_PHASES.inhaleSeconds * 1000;
    const exhaleDuration = BREATH_PHASES.exhaleSeconds * 1000;
    const settleDuration = BREATH_PHASES.settleSeconds * 1000;

    const inhaleEase = Easing.bezier(0.25, 0.02, 0.24, 1);
    const exhaleEase = Easing.bezier(0.28, 0.0, 0.18, 1);

    const cycle = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(haloScale, {
            toValue: 1.1,
            duration: inhaleDuration,
            easing: inhaleEase,
            useNativeDriver: true,
          }),
          Animated.timing(ringScale, {
            toValue: 1.045,
            duration: inhaleDuration,
            easing: inhaleEase,
            useNativeDriver: true,
          }),
          Animated.timing(coreScale, {
            toValue: 1.12,
            duration: inhaleDuration,
            easing: inhaleEase,
            useNativeDriver: true,
          }),
          Animated.timing(haloOpacity, {
            toValue: 0.28,
            duration: inhaleDuration,
            easing: inhaleEase,
            useNativeDriver: false,
          }),
          Animated.timing(ringOpacity, {
            toValue: 0.78,
            duration: inhaleDuration,
            easing: inhaleEase,
            useNativeDriver: false,
          }),
          Animated.timing(captionOpacity, {
            toValue: 0.9,
            duration: inhaleDuration,
            easing: inhaleEase,
            useNativeDriver: false,
          }),
        ]),
        Animated.parallel([
          Animated.timing(haloScale, {
            toValue: 1.12,
            duration: settleDuration,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(ringScale, {
            toValue: 1.06,
            duration: settleDuration,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(coreScale, {
            toValue: 1.1,
            duration: settleDuration,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(haloOpacity, {
            toValue: 0.2,
            duration: settleDuration,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false,
          }),
          Animated.timing(ringOpacity, {
            toValue: 0.66,
            duration: settleDuration,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false,
          }),
          Animated.timing(captionOpacity, {
            toValue: 0.82,
            duration: settleDuration,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false,
          }),
        ]),
        Animated.parallel([
          Animated.timing(haloScale, {
            toValue: 0.94,
            duration: exhaleDuration,
            easing: exhaleEase,
            useNativeDriver: true,
          }),
          Animated.timing(ringScale, {
            toValue: 0.965,
            duration: exhaleDuration,
            easing: exhaleEase,
            useNativeDriver: true,
          }),
          Animated.timing(coreScale, {
            toValue: 0.94,
            duration: exhaleDuration,
            easing: exhaleEase,
            useNativeDriver: true,
          }),
          Animated.timing(haloOpacity, {
            toValue: 0.14,
            duration: exhaleDuration,
            easing: exhaleEase,
            useNativeDriver: false,
          }),
          Animated.timing(ringOpacity, {
            toValue: 0.46,
            duration: exhaleDuration,
            easing: exhaleEase,
            useNativeDriver: false,
          }),
          Animated.timing(captionOpacity, {
            toValue: 0.62,
            duration: exhaleDuration,
            easing: exhaleEase,
            useNativeDriver: false,
          }),
        ]),
      ]),
    );

    cycle.start();

    return () => {
      cycle.stop();
    };
  }, [captionOpacity, coreScale, haloOpacity, haloScale, ringOpacity, ringScale, running]);

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.fieldGlow, { opacity: haloOpacity, transform: [{ scale: haloScale }] }]} />
      <Animated.View style={[styles.halo, { opacity: ringOpacity, transform: [{ scale: ringScale }] }]} />
      <Animated.View style={[styles.orbShell, { transform: [{ scale: ringScale }] }]}>
        <Animated.View style={[styles.core, { transform: [{ scale: coreScale }] }]} />
      </Animated.View>
      <Animated.Text style={[styles.caption, { opacity: captionOpacity }]}>In · Settle · Out</Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 340,
    width: '100%',
  },
  fieldGlow: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 999,
    backgroundColor: theme.colors.accentGlow,
  },
  halo: {
    position: 'absolute',
    width: 232,
    height: 232,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#32466e',
    backgroundColor: 'rgba(10, 18, 34, 0.34)',
  },
  orbShell: {
    width: 168,
    height: 168,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(14, 22, 40, 0.28)',
  },
  core: {
    width: 112,
    height: 112,
    borderRadius: 999,
    backgroundColor: '#a4b5ff',
    shadowColor: '#a4b5ff',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
  },
  caption: {
    marginTop: 26,
    color: theme.colors.textMuted,
    fontSize: 13,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
});
