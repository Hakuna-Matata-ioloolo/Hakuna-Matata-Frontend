// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
// hooks
import useAuth from './hooks/useAuth';

// components
import LoadingScreen from './components/LoadingScreen';
import NotistackProvider from './components/NotistackProvider';

// ----------------------------------------------------------------------

export default function App() {
  const { isInitialized } = useAuth();

  return (
    <ThemeConfig>
      <NotistackProvider>{isInitialized ? <Router /> : <LoadingScreen />}</NotistackProvider>
    </ThemeConfig>
  );
}
