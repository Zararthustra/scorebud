import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { expect, test } from 'vitest';
import App from './App';

test("l'application démarre", () => {
  const html = renderToString(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  expect(html).toContain('ScoreBud');
  expect(html).toContain('Tableau de scores libre');
});
