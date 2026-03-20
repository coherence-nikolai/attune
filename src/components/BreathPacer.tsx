import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';

type BreathPacerProps = {
  inhaleMs: number;
  exhaleMs: number;
  settleMs: number;
  paused: boolean;
  completed: boolean;
  label: string;
};

export function BreathPacer({ inhaleMs, exhaleMs, settleMs, paused, completed, label }: BreathPacerProps) {
  const scale = useRef(new Animated.Value(0.9)).current;
  const glow = useRef(new Animated.Value(0.32)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (paused || completed) {
      loopRef.current?.stop();
      Animated.parallel([
        Animated.timing(scale, {
          toValue: completed ? 1 : 0.92,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: completed ? 0.5 : 0.28,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1.08,
            duration: inhaleMs,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(glow, {
            toValue: 0.58,
            duration: inhaleMs,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 0.92,
            duration: exhaleMs,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(glow, {
            toValue: 0.24,
            duration: exhaleMs,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(settleMs),
      ]),
    );

    loopRef.current = animation;
    animation.start();

    return () => {
      animation.stop();
    };
  }, [completed, exhaleMs, glow, inhaleMs, paused, scale, settleMs]);

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.halo, { opacity: glow, transform: [{ scale: scale.interpolate({ inputRange: [0.9, 1.08], outputRange: [1.1, 1.32] }) }] }]} />
      <Animated.View style={[styles.orb, { transform: [{ scale }] }]}>
        <View style={styles.core} />
      </Animated.View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.lg,
    paddingVertical: theme.spacing.xxl,
  },
  halo: {
    position: 'absolute',
    width: 236,
    height: 236,
    borderRadius: 118,
    backgroundColor: theme.colors.accentGlow,
  },
  orb: {
    width: 176,
    height: 176,
    borderRadius: 88,
    backgroundColor: 'rgba(162, 187, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(190, 209, 255, 0.28)',
  },
  core: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: theme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: 'rgba(209, 221, 255, 0.24)',
  },
  label: {
    color: theme.colors.text,
    fontSize: theme.typography.section,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
});
