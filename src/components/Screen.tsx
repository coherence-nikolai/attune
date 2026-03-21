import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, ViewProps } from 'react-native';

import { theme } from '../theme';

type ScreenProps = ViewProps & {
  children: React.ReactNode;
  scroll?: boolean;
};

export function Screen({ children, style, scroll = true, ...rest }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      {scroll ? (
        <ScrollView contentContainerStyle={[styles.content, style]} keyboardShouldPersistTaps="handled" {...rest}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, style]} {...rest}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
    backgroundColor: theme.colors.background,
    gap: theme.spacing.xl,
  },
});
