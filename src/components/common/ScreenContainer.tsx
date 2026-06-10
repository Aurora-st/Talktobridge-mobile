import React, { type ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientBackground } from './GradientBackground';
import { useResponsive } from '../../hooks/useResponsive';

interface ScreenContainerProps {
  children: ReactNode;
  scrollable?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  centered?: boolean;
}

export function ScreenContainer({
  children,
  scrollable = true,
  contentStyle,
  centered = false,
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();
  const { contentMaxWidth, horizontalPadding } = useResponsive();

  const content = (
    <View
      style={[
        styles.content,
        {
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 16,
          paddingHorizontal: horizontalPadding,
          maxWidth: contentMaxWidth,
          alignSelf: centered ? 'center' : 'stretch',
          width: centered ? '100%' : undefined,
        },
        contentStyle,
      ]}
    >
      {children}
    </View>
  );

  return (
    <GradientBackground>
      {scrollable ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {content}
        </ScrollView>
      ) : (
        <View style={styles.flex}>{content}</View>
      )}
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    width: '100%',
  },
});
