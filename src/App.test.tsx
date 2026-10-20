import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';
import App from './App';

test("l'application démarre", () => {
  expect(renderToString(<App />)).toContain('ScoreBud');
});
