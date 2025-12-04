import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from './shared/theme/ThemeContext';
import ToastContainer from './shared/ToastContainer';
import { Provider } from 'react-redux';
import { store } from './store/slices';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <Provider store={store}>
  <ThemeProvider>
    <App />
    <ToastContainer/>
  </ThemeProvider>

  </Provider>


);
reportWebVitals();
