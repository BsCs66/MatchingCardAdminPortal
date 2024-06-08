import './App.css';
import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Router from './routers/router';
import GlobalContext from './context/context';
import { AlertType, Toast } from './components/shared/toast';

function App() {
  const [alert, setAlert] = useState<{show: boolean, message: string, type: AlertType}>({show: false, message: '', type: AlertType.Info});

  return (
    <GlobalContext.Provider
      value={{
        alert: (alert => setAlert({...alert, show: true})),
      }}
    >
      <Toast show={alert.show} message={alert.message} type={alert.type} onDismiss={() => setAlert({...alert, show: false})} />
      <BrowserRouter>
        <Router></Router>
      </BrowserRouter>
    </GlobalContext.Provider>
  );
}

export default App;
