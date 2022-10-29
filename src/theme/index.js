import PropTypes from 'prop-types';

import { useMemo } from 'react';
// material
import { CssBaseline } from '@material-ui/core';
import { createTheme, ThemeProvider, StyledEngineProvider } from '@material-ui/core/styles';
//
import shape from './shape';
import palette from './palette';
import typography from './typography';
import breakpoints from './breakpoints';
import GlobalStyles from './globalStyles';
import componentsOverride from './overrides';
import shadows, { customShadows } from './shadows';

// ----------------------------------------------------------------------

ThemeConfig.propTypes = {
  children: PropTypes.node
};

export default function ThemeConfig({ children }) {
  const themeOptions = useMemo(
    () => ({
      palette: { ...palette.light, mode: 'light' },
      shape,
      typography,
      breakpoints,
      shadows: shadows.light,
      customShadows: customShadows.light
    }),
    []
  );

  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
