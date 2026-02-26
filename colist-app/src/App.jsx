import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/login/LoginPage';
import MainPage from './components/mainPage/MainPage';
import './App.css';
import Members from './components/members/Members';
import Settings from './components/settings/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<MainPage />}
        />
        <Route
          path="/login"
          element={<LoginPage />}
        />
        <Route
          path="/members"
          element={<Members />}
        />
        <Route
          path="/settings"
          element={<Settings />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
