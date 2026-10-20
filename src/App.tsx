import { Navigate, Route, Routes } from 'react-router';
import { Catalogue } from './app/Catalogue';
import { EcranJeu } from './app/EcranJeu';
import { PageIntrouvable } from './app/PageIntrouvable';
import { Toasts } from './app/Toasts';
import { modules } from './modules';

/** Routes générées depuis la liste des modules ; anciennes adresses redirigées vers l'accueil (R26). */
export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Catalogue />} />
        {modules.map((m) => (
          <Route
            key={m.id}
            path={m.route}
            element={<EcranJeu key={m.id} module={m} />}
          />
        ))}
        <Route path="/dice" element={<Navigate to="/" replace />} />
        <Route path="/regles" element={<Navigate to="/" replace />} />
        <Route path="*" element={<PageIntrouvable />} />
      </Routes>
      <Toasts />
    </>
  );
}
