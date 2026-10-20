import path from 'node:path';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import jsxA11y from 'eslint-plugin-jsx-a11y';

const MODULES = path.resolve('src/modules');
const APP = path.resolve('src/app');

// MOD-01 : un module n'importe ni un autre module ni app/ (seulement core/, ui/, modules/types.ts).
const modulesIsoles = {
  create(context) {
    const fichier = context.filename;
    const [moduleCourant, ...reste] = path
      .relative(MODULES, fichier)
      .split(path.sep);
    // Hors d'un dossier de module (ex. modules/index.ts, qui les liste tous) : pas de restriction.
    if (moduleCourant === '..' || reste.length === 0) return {};
    return {
      ImportDeclaration(node) {
        const source = node.source.value;
        if (!source.startsWith('.')) return;
        const cible = path.resolve(path.dirname(fichier), source);
        const dansModules = cible.startsWith(MODULES + path.sep);
        const moduleCible =
          dansModules && path.relative(MODULES, cible).split(path.sep)[0];
        const interdit =
          cible === APP ||
          cible.startsWith(APP + path.sep) ||
          (dansModules &&
            moduleCible !== moduleCourant &&
            moduleCible !== 'types');
        if (interdit)
          context.report({
            node,
            message: `Un module ne peut pas importer « ${source} » (MOD-01).`
          });
      }
    };
  }
};

export default tseslint.config(
  { ignores: ['dist', 'dev-dist', 'test-results', 'playwright-report'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    plugins: { scorebud: { rules: { 'modules-isoles': modulesIsoles } } },
    rules: { 'scorebud/modules-isoles': 'error' }
  }
);
