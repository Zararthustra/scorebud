import { ESLint } from 'eslint';
import { expect, test } from 'vitest';

const eslint = new ESLint();
const erreurs = async (fichier: string, code: string) =>
  (await eslint.lintText(code, { filePath: fichier }))[0].messages.filter(
    (m) => m.ruleId === 'scorebud/modules-isoles'
  );

test.each([
  [
    'src/modules/contree/calcul.ts',
    "import x from '../living-forest/calcul';",
    1
  ],
  [
    'src/modules/contree/vues/Etape.tsx',
    "import x from '../../generique/module';",
    1
  ],
  ['src/modules/contree/module.ts', "import x from '../../app/EcranJeu';", 1],
  ['src/modules/contree/module.ts', "import x from './calcul';", 0],
  ['src/modules/contree/module.ts', "import x from '../types';", 0],
  ['src/modules/contree/module.ts', "import x from '../../core/partie';", 0],
  ['src/modules/index.ts', "import x from './contree/module';", 0]
])('%s : %s → %i erreur', async (fichier, code, attendu) => {
  expect(await erreurs(fichier, code)).toHaveLength(attendu);
});
