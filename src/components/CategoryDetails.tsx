
import React from 'react';
import { ScoreCategory, WonderBoard, WonderSide } from '@/types/game';
import { WealthDetails } from './category-details/WealthDetails';
import { MilitaryDetails } from './category-details/MilitaryDetails';
import { DebtDetails } from './category-details/DebtDetails';
import { ScienceDetails } from './category-details/ScienceDetails';
import { CultureDetails } from './category-details/CultureDetails';
import { CommerceDetails } from './category-details/CommerceDetails';
import { WonderBoardDetails } from './category-details/WonderBoardDetails';
import { GuildsDetails } from './category-details/GuildsDetails';
import { CityDetails } from './category-details/CityDetails';

interface CategoryDetailsProps {
  category: ScoreCategory;
  onScoreChange: (score: number) => void;
  // State props for different categories
  coins?: number;
  onCoinsChange?: (coins: number) => void;
  militaryTokens?: MilitaryTokens;
  onMilitaryTokensChange?: (tokens: MilitaryTokens) => void;
  debtTokens?: DebtTokens;
  onDebtTokensChange?: (tokens: DebtTokens) => void;
  scienceSymbols?: ScienceSymbols;
  onScienceSymbolsChange?: (symbols: ScienceSymbols) => void;
  cultureCards?: CultureCard[];
  onCultureCardsChange?: (cards: CultureCard[]) => void;
  wonderBoard?: WonderBoard;
  wonderSide?: WonderSide;
  boardStages?: boolean[];
  onBoardStagesChange?: (stages: boolean[]) => void;
  commerceCards?: CommerceCard[];
  onCommerceCardsChange?: (cards: CommerceCard[]) => void;
  guildsCards?: GuildsCard[];
  onGuildsCardsChange?: (cards: GuildsCard[]) => void;
  cityCards?: CityCard[];
  onCityCardsChange?: (cards: CityCard[]) => void;
}

interface MilitaryTokens {
  minusOne: number;
  one: number;
  three: number;
  five: number;
}

interface DebtTokens {
  one: number;
  five: number;
}

interface ScienceSymbols {
  gear: number;
  tablet: number;
  compass: number;
}

interface CultureCard {
  id: string;
  score: number;
}

interface CommerceCard {
  id: string;
  name: string;
  score: number;
  description: string;
  step: number;
}

interface GuildsCard {
  id: string;
  name: string;
  score: number;
  description: string;
  step: number;
  maxScore?: number;
}

interface CityCard {
  id: string;
  name: string;
  score: number;
  description?: string;
  isVariable: boolean;
  step?: number;
}

export const CategoryDetails: React.FC<CategoryDetailsProps> = ({ 
  category, 
  onScoreChange,
  coins = 0,
  onCoinsChange,
  militaryTokens = { minusOne: 0, one: 0, three: 0, five: 0 },
  onMilitaryTokensChange,
  debtTokens = { one: 0, five: 0 },
  onDebtTokensChange,
  scienceSymbols = { gear: 0, tablet: 0, compass: 0 },
  onScienceSymbolsChange,
  cultureCards = [],
  onCultureCardsChange,
  wonderBoard = 'alexandria',
  wonderSide = 'day',
  boardStages = [],
  onBoardStagesChange,
  commerceCards = [],
  onCommerceCardsChange,
  guildsCards = [],
  onGuildsCardsChange,
  cityCards = [],
  onCityCardsChange
}) => {
  switch (category) {
    case 'wealth':
      return (
        <WealthDetails
          coins={coins}
          onCoinsChange={onCoinsChange!}
          onScoreChange={onScoreChange}
        />
      );
    case 'military':
      return (
        <MilitaryDetails
          militaryTokens={militaryTokens}
          onMilitaryTokensChange={onMilitaryTokensChange!}
          onScoreChange={onScoreChange}
        />
      );
    case 'science':
      return (
        <ScienceDetails
          scienceSymbols={scienceSymbols}
          onScienceSymbolsChange={onScienceSymbolsChange!}
          onScoreChange={onScoreChange}
        />
      );
    case 'culture':
      return (
        <CultureDetails
          cultureCards={cultureCards}
          onCultureCardsChange={onCultureCardsChange!}
          onScoreChange={onScoreChange}
        />
      );
    case 'wonder':
      return (
        <WonderBoardDetails
          wonderBoard={wonderBoard}
          wonderSide={wonderSide}
          boardStages={boardStages}
          onBoardStagesChange={onBoardStagesChange!}
          onScoreChange={onScoreChange}
        />
      );
    case 'commerce':
      return (
        <CommerceDetails
          commerceCards={commerceCards}
          onCommerceCardsChange={onCommerceCardsChange!}
          onScoreChange={onScoreChange}
        />
      );
    case 'guilds':
      return (
        <GuildsDetails
          guildsCards={guildsCards}
          onGuildsCardsChange={onGuildsCardsChange!}
          onScoreChange={onScoreChange}
        />
      );
      case 'debt':
        return (
          <DebtDetails
            debtTokens={debtTokens}
            onDebtTokensChange={onDebtTokensChange!}
            onScoreChange={onScoreChange}
          />
        );
      case 'city':
        return (
          <CityDetails
            cityCards={cityCards}
            onCityCardsChange={onCityCardsChange!}
            onScoreChange={onScoreChange}
          />
        );
      default:
      return (
        <div className="p-3 bg-white border-t flex justify-center">
          <p className="text-sm text-gray-600">
            Enter individual victory point components
          </p>
        </div>
      );
  }
};
