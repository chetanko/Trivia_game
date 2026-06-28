import { FaMoon, FaShuffle, FaSun, FaVolumeHigh } from 'react-icons/fa6';
import { useGame } from '../context/GameContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function Settings({ navigate }) {
  const { settings, updateSettings } = useGame();
  useDocumentTitle('Settings');

  return (
    <main className="page-shell">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Preferences</p>
          <h1 className="page-title">Settings</h1>
        </div>
        <button type="button" className="btn-primary" onClick={() => navigate('setup')}>
          Start Game
        </button>
      </section>

      <section className="surface-panel">
        <h2 className="section-title">Theme</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            className={settings.theme === 'light' ? 'choice-active' : 'choice-card'}
            onClick={() => updateSettings({ theme: 'light' })}
          >
            <FaSun aria-hidden="true" />
            Light Mode
          </button>
          <button
            type="button"
            className={settings.theme === 'dark' ? 'choice-active' : 'choice-card'}
            onClick={() => updateSettings({ theme: 'dark' })}
          >
            <FaMoon aria-hidden="true" />
            Dark Mode
          </button>
        </div>
      </section>

      <section className="surface-panel mt-6">
        <h2 className="section-title">Game Defaults</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="toggle-card">
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(event) => updateSettings({ soundEnabled: event.target.checked })}
            />
            <FaVolumeHigh aria-hidden="true" />
            <span>Sound</span>
          </label>
          <label className="toggle-card">
            <input
              type="checkbox"
              checked={settings.stealEnabled}
              onChange={(event) => updateSettings({ stealEnabled: event.target.checked })}
            />
            <span className="font-black">S</span>
            <span>Steal</span>
          </label>
          <label className="toggle-card">
            <input
              type="checkbox"
              checked={settings.shuffleQuestions}
              onChange={(event) => updateSettings({ shuffleQuestions: event.target.checked })}
            />
            <FaShuffle aria-hidden="true" />
            <span>Shuffle</span>
          </label>
          <label className="toggle-card">
            <input
              type="checkbox"
              checked={settings.timerEnabled}
              onChange={(event) => updateSettings({ timerEnabled: event.target.checked })}
            />
            <span className="font-black">T</span>
            <span>Timer</span>
          </label>
        </div>

        <label className="form-label mt-6 max-w-sm">
          Timer duration
          <select
            className="input-field"
            value={settings.timerDuration}
            onChange={(event) => updateSettings({ timerDuration: Number(event.target.value) })}
          >
            {[10, 20, 30, 60].map((duration) => (
              <option key={duration} value={duration}>
                {duration} seconds
              </option>
            ))}
          </select>
        </label>
      </section>
    </main>
  );
}
