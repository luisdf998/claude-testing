import { HashRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import TestScreen from './screens/TestScreen';
import ResultScreen from './screens/ResultScreen';
import HistoryScreen from './screens/HistoryScreen';
import './components/components.css';
import './screens/screens.css';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/test" element={<TestScreen />} />
        <Route path="/resultado" element={<ResultScreen />} />
        <Route path="/historial" element={<HistoryScreen />} />
      </Routes>
    </HashRouter>
  );
}
