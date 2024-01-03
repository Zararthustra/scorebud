export type { ISetupContree };

interface ISetupContree {
  bid: string;
  trump: 'diamond' | 'spade' | 'heart' | 'club' | '';
  contract: string;
  contre: boolean;
  rebelote: boolean;
  rebeloteTeam: string;
  lastPli: string;
}
