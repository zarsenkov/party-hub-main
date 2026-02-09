import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Находим элемент с id="root" в твоем index.html и рендерим туда приложение
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
