import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import '@fontsource-variable/fredoka';
import '@fontsource-variable/figtree';
import './styles/tokens.css';
import './styles/components.css';
import './styles/app.css';
import App from './App';
import { nettoyerAnciennesCles } from './core/stockage';

nettoyerAnciennesCles();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
