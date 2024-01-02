import { IconContree, IconForest, IconRule, IconTable } from '@assets/index';

export const sidebar: {
  name: string;
  icon: any;
  link: string;
}[] = [
  {
    name: 'Scores',
    icon: IconTable,
    link: '/'
  },
  {
    name: 'Living Forest',
    icon: IconForest,
    link: '/living-forest'
  },
  {
    name: 'Belote Contrée',
    icon: IconContree,
    link: '/belote-contree'
  },
  {
    name: 'Règles',
    icon: IconRule,
    link: '/regles'
  }
];
