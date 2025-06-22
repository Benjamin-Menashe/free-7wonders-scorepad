
export type WonderBoard = 
  | 'alexandria' | 'babylon' | 'ephesus' | 'giza' | 'halicarnassus' | 'olympia' | 'rhodes' | 'unassigned';

export type WonderSide = 'day' | 'night';

export type ScoreCategory = 
  | 'wonder' | 'wealth' | 'military' | 'culture' | 'commerce' | 'science' | 'guilds';

export interface Player {
  id: string;
  name: string;
  wonderBoard: WonderBoard;
  wonderSide: WonderSide;
}

export interface Score {
  playerId: string;
  category: ScoreCategory;
  value: number;
}
