import Router from './routes';
import ThemeConfig from './theme';
import useAuth from './hooks/useAuth';
import LoadingScreen from './components/LoadingScreen';
import NotistackProvider from './components/NotistackProvider';

export default function App() {
  const { isInitialized } = useAuth();

  return (
    <ThemeConfig>
      <NotistackProvider>{isInitialized ? <Router /> : <LoadingScreen />}</NotistackProvider>
    </ThemeConfig>
  );
}
