import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { FaGear, FaHouse, FaTableCellsLarge, FaUpload } from 'react-icons/fa6';
import ErrorFallback from './components/ErrorFallback';
import { useGame } from './context/GameContext';
import Game from './pages/Game';
import Home from './pages/Home';
import Library from './pages/Library';
import Settings from './pages/Settings';
import Setup from './pages/Setup';

function TopNav({ route, navigate }) {
  const items = [
    { page: 'home', label: 'Home', icon: FaHouse },
    { page: 'library', label: 'Library', icon: FaTableCellsLarge },
    { page: 'upload', label: 'Upload', icon: FaUpload },
    { page: 'settings', label: 'Settings', icon: FaGear },
  ];

  return (
    <nav className="top-nav" aria-label="Primary navigation">
      <button type="button" className="brand-button" onClick={() => navigate('home')}>
        <span className="brand-mark">TTT</span>
        <span>Classroom Trivia</span>
      </button>
      <div className="nav-actions">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = route.name === item.page;
          return (
            <button
              key={item.page}
              type="button"
              className={isActive ? 'nav-button-active' : 'nav-button'}
              onClick={() => navigate(item.page)}
            >
              <Icon aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function RoutedApp() {
  const { settings } = useGame();
  const [route, setRoute] = useState({ name: 'home', params: {} });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
  }, [settings.theme]);

  function navigate(name, params = {}) {
    setRoute({ name, params });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const pageProps = { navigate };
  const pages = {
    home: <Home {...pageProps} />,
    library: <Library {...pageProps} />,
    upload: <Library {...pageProps} showUploadFirst />,
    setup: <Setup {...pageProps} initialQuizId={route.params.quizId} />,
    game: <Game {...pageProps} />,
    settings: <Settings {...pageProps} />,
  };

  return (
    <div className="app-root">
      {route.name !== 'game' ? <TopNav route={route} navigate={navigate} /> : null}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${route.name}-${route.params.quizId || ''}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22 }}
        >
          {pages[route.name] || pages.home}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <RoutedApp />
    </ErrorBoundary>
  );
}
