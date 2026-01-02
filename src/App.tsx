import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import Navbar from './components/Navbar/Navbar.tsx';
import Home from './pages/Home/Home.tsx';
import ErrorTest from './pages/ErrorTest/ErrorTest.tsx';
import NotFound from './pages/NotFound/NotFound.tsx';
import { ApiDemo } from './components/ApiDemo/ApiDemo.tsx';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/error-test" element={<ErrorTest />} />
            <Route path="/api-demo" element={<ApiDemo />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;