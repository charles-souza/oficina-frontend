import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import ErrorBoundary from './components/common/ErrorBoundary';
import { NotificationProvider } from './contexts/NotificationContext';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <div className="App">
          <Router>
            <AppRoutes />
          </Router>
        </div>
      </NotificationProvider>
    </ErrorBoundary>
  );
}

export default App;
