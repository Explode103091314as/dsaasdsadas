import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import BioPage from './components/BioPage';
import Dashboard from './components/Dashboard';
import { useState } from 'react';

function App() {
  const [user, setUser] = useState(null); // Simulate user state

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage setUser={setUser} />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/:username" element={<BioPage />} />
      </Routes>
    </Router>
  );
}

export default App;
