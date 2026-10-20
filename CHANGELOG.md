# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.0](https://github.com/Zararthustra/scorebud/compare/v0.2.1...v2.0.0) (2026-10-20)


### Features

* **app:** catalogue, game screen, players, score tab, settings, storage errors (T6-T11) ([f1ff5c4](https://github.com/Zararthustra/scorebud/commit/f1ff5c442433091d09dc65e7b4311921ec1b2044))
* **contree:** deal setup, card counting, result and rules tabs (T14-T16) ([cdf19ff](https://github.com/Zararthustra/scorebud/commit/cdf19ff0b063e7362750f2338f08ce8524096d0c))
* **contree:** pure scoring rule, card values, deal validation, end at 1000 (T13) ([1d8beeb](https://github.com/Zararthustra/scorebud/commit/1d8beeb0f1c913889a13f4405ca92679748d3207))
* **core:** defensive localStorage access, legacy keys cleanup (T3) ([24787ff](https://github.com/Zararthustra/scorebud/commit/24787ffbf0359f587a02f00eb8342fe0f8f643d2))
* **core:** game model, derived score table and name validation (T2) ([81f5a12](https://github.com/Zararthustra/scorebud/commit/81f5a12f3cb05d916a62527a47cb46e02dae0c86))
* **core:** in-memory store with storage write-through and 5 s undo (T4) ([20c6c50](https://github.com/Zararthustra/scorebud/commit/20c6c50851a7068beec729d4a7ccf1bb211ac6d0))
* **core:** preferences, clear-all, storage error signals; undo survives tab and draft changes ([9298a29](https://github.com/Zararthustra/scorebud/commit/9298a29d40fb1160459cd1289a235e09d22a4192))
* **deploy:** Apache fallback to index.html; update banner keeps a single primary action ([91b0ff3](https://github.com/Zararthustra/scorebud/commit/91b0ff3ab4aeb31511c237719e6500c3e4a84e5a))
* **generique:** free score table with digit-wheel rounds and editable cells (T12) ([0e27954](https://github.com/Zararthustra/scorebud/commit/0e27954876b0ddf0c1cf13771e70536a128b92c0))
* **living-forest:** pure turn counters, totals, lotus adjustment (T17) ([8f00283](https://github.com/Zararthustra/scorebud/commit/8f0028308df733291dd9dab66ddfb4e4183de19e))
* **living-forest:** turn tab with resources, victory conditions, player points; rules (T18-T19) ([1b6696b](https://github.com/Zararthustra/scorebud/commit/1b6696bd25aa9b051a6e2faa7872c3f0e6743cef))
* **outils:** dice and countdown timer in every top bar (T20-T21) ([29d60b9](https://github.com/Zararthustra/scorebud/commit/29d60b96a800b8b2888e318720bb324adf171204))
* **pwa:** offline app with update banner, same /sw.js and scope as before (T22) ([5bb8fce](https://github.com/Zararthustra/scorebud/commit/5bb8fceb789652f126439a8d25c81e5be7c55843))
* **styles:** design system styles, self-hosted fonts, theme before render (T1) ([63540ed](https://github.com/Zararthustra/scorebud/commit/63540ed528be472af287c4a95186f4bff68194f3))
* **styles:** Figtree tabular digits for scores, player-7..12 and score-m tokens ([9030391](https://github.com/Zararthustra/scorebud/commit/9030391505c35d716ee2e5ef749566498371e2db))
* **ui:** house components on design system classes, digit wheels (T5) ([b6c3ea3](https://github.com/Zararthustra/scorebud/commit/b6c3ea30d6a3e24cdf8984c15033a4032aac775e))


### Bug Fixes

* **styles:** keep design system CSS byte-identical, exclude it from prettier ([34a2d09](https://github.com/Zararthustra/scorebud/commit/34a2d0940ae4faf560d3b1b1ff5bfb1d9b8675ba))

### [0.2.1](https://github.com/Zararthustra/scorebud/compare/v0.2.0...v0.2.1) (2024-05-22)


### Features

* **Contree:** add tabs & points img ([4570fa6](https://github.com/Zararthustra/scorebud/commit/4570fa60db8c4063ae0243127b6bb8233af983ed))
* **Timer:** add a basic countdown timer ([ef35990](https://github.com/Zararthustra/scorebud/commit/ef359907e240993db4201108bb3bccea9b0cc1d5))


### Bug Fixes

* contree css class conflict, navigator.vibrate on ipad ([18f6507](https://github.com/Zararthustra/scorebud/commit/18f6507d8dbdfc58eeb3152e14b135c898e1444e))

## [0.2.0](https://github.com/Zararthustra/scorebud/compare/v0.1.4...v0.2.0) (2024-01-04)

### [0.1.6](https://github.com/Zararthustra/scorebud/compare/v0.1.4...v0.1.6) (2024-01-04)

### [0.1.5](https://github.com/Zararthustra/scorebud/compare/v0.1.4...v0.1.5) (2024-01-04)

### [0.1.4](https://github.com/Zararthustra/scorebud/compare/v0.1.3...v0.1.4) (2024-01-04)


### Features

* **Contree:** [WIP] add Belote Contree game ([c5d74d5](https://github.com/Zararthustra/scorebud/commit/c5d74d5e270a41e6837478208ba567831d6bece3))
* **Contree:** add contre & rebelote ([38ff0a7](https://github.com/Zararthustra/scorebud/commit/38ff0a778a2d85318a40e0763bd6e21ca196170c))
* **Contree:** add surcontre + handle final score logic ([8e3bbae](https://github.com/Zararthustra/scorebud/commit/8e3bbae3c8d37dd5c172aefdde5a43d130a74f51))
* **Contree:** finalize counter form ([f008cc7](https://github.com/Zararthustra/scorebud/commit/f008cc79eeb9ce9c16bb13b9922ea9dcfb6ebfc8))
* **Contree:** refactoring + add counter view ([05ead41](https://github.com/Zararthustra/scorebud/commit/05ead41f499d5aad48233b2ac3bd5d2dec9682f5))
* **Score, Rules, Sidebar, ModalAddTurn, ModalAddNewPlayer:** add tag on the best player of the turn, refactor sidebar & rules to add new items easily, fix NaN error on new turn with no value, add autofocus on ModalAddNewPlayer ([2ad1b83](https://github.com/Zararthustra/scorebud/commit/2ad1b83b57684fb1814e7714cc8449c5cc10f7ff))

### [0.1.3](https://github.com/Zararthustra/scorebud/compare/v0.1.2...v0.1.3) (2023-11-04)


### Features

* **LivingForest:** add Kodama extension ([495a693](https://github.com/Zararthustra/scorebud/commit/495a69300f4c926a4bffbabda8bae1559fed4155))

### [0.1.2](https://github.com/Zararthustra/scorebud/compare/v0.1.1...v0.1.2) (2023-09-19)


### Features

* **LivingForest:** add total resource ([7a4ee21](https://github.com/Zararthustra/scorebud/commit/7a4ee21c8cabb3bf1f02b94c3de7c2bee4172dbd))

### [0.1.1](https://github.com/Zararthustra/scorebud/compare/v0.1.0...v0.1.1) (2023-09-09)


### Features

* **Dice:** add roll dice ([5abf048](https://github.com/Zararthustra/scorebud/commit/5abf0488cb9cfaa9115d6e6e4720cfa67bd8cf29))
* **Version:** add app version ([9290752](https://github.com/Zararthustra/scorebud/commit/92907523c6902275cfd2cd378343cea3eb6e7dd2))

## [0.1.0](https://github.com/Zararthustra/scorebud/compare/v0.0.4...v0.1.0) (2023-09-08)

### [0.0.4](https://github.com/Zararthustra/scorebud/compare/v0.0.3...v0.0.4) (2023-09-08)


### Features

* **LivingForest:** add win condition counter ([02e8e8c](https://github.com/Zararthustra/scorebud/commit/02e8e8c243e0f8e302d326beb38b5d86ffe3e04d))

### [0.0.3](https://github.com/Zararthustra/scorebud/compare/v0.0.2...v0.0.3) (2023-09-07)


### Features

* **LivingForest:** add ResourceCounter ([d0ec145](https://github.com/Zararthustra/scorebud/commit/d0ec145af7193560d0c86d7b118ad8cb4f33e9a8))
* **Logo:** add logo ([06caf26](https://github.com/Zararthustra/scorebud/commit/06caf267c4b7cbbf6e201b34f2d9d6db73cc5c0a))

### 0.0.2 (2023-09-06)


### Features

* **Score:** Add basic score table with addPlayers & addTurn modals features + several fixes ([7278a90](https://github.com/Zararthustra/scorebud/commit/7278a906e2d07e37f357011ddf0a7f2dd795d00e))
