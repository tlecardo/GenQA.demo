import React from 'react';
import { BrowserRouter, HashRouter } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import './assets/css/style.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <BrowserRouter> */}
    <HashRouter>
      <App />
     {/* </BrowserRouter> */}
    </HashRouter>
  </React.StrictMode>
);
