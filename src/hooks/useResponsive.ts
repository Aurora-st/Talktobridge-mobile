import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { SPACING } from '../constants/layout';

export type ScreenSize = 'compact' | 'regular' | 'expanded';

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const screenSize: ScreenSize = useMemo(() => {
    if (width < 360) {
      return 'compact';
    }
    if (width < 768) {
      return 'regular';
    }
    return 'expanded';
  }, [width]);

  const contentMaxWidth = useMemo(() => {
    if (screenSize === 'expanded') {
      return 720;
    }
    if (screenSize === 'regular') {
      return 560;
    }
    return width - SPACING.md * 2;
  }, [screenSize, width]);

  const horizontalPadding = screenSize === 'compact' ? SPACING.md : SPACING.lg;

  return {
    width,
    height,
    screenSize,
    contentMaxWidth,
    horizontalPadding,
    isLandscape: width > height,
  };
}
