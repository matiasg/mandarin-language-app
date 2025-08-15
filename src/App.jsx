import { useState } from 'react';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import FlexibleQuiz from './components/FlexibleQuiz';
import DrawingCanvas from './components/DrawingCanvas';
import ProgressPage from './components/ProgressPage';
import CopyCharacter from './components/CopyCharacter'; // New import
import DrawFromDefinition from './components/DrawFromDefinition'; // New import
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage setCurrentView={setCurrentView} />;
      case 'quiz':
        return <FlexibleQuiz />;
      case 'draw':
        return <DrawingCanvas />;
      case 'copy-character': // New case
        return <CopyCharacter />;
      case 'draw-from-definition': // New case
        return <DrawFromDefinition />;
      case 'progress':
        return <ProgressPage />;
      default:
        return <HomePage setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6">
        <Navigation currentView={currentView} setCurrentView={setCurrentView} />
        {renderCurrentView()}
      </div>
    </div>
  );
}

export default App;

