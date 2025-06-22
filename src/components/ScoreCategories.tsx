
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ScoreCategory, WonderBoard, WonderSide } from '@/types/game';
import { WealthDetails } from './category-details/WealthDetails';
import { MilitaryDetails } from './category-details/MilitaryDetails';
import { ScienceDetails } from './category-details/ScienceDetails';
import { WonderBoardDetails } from './category-details/WonderBoardDetails';
import { CommerceDetails } from './category-details/CommerceDetails';
import { GuildsDetails } from './category-details/GuildsDetails';
import { CultureDetails } from './category-details/CultureDetails';

export interface ScoreCategoryConfig {
  key: ScoreCategory;
  name: string;
  bgColor: string;
  icon: string;
}

export const scoreCategories: ScoreCategoryConfig[] = [
  { key: 'wonder', name: 'Board', bgColor: 'bg-amber-800 bg-opacity-30', icon: '🔶' },
  { key: 'wealth', name: 'Wealth', bgColor: 'bg-gray-300', icon: '🪙' },
  { key: 'military', name: 'Military', bgColor: 'bg-red-200', icon: '⚔️' },
  { key: 'culture', name: 'Culture', bgColor: 'bg-blue-200', icon: '🏛️' },
  { key: 'commerce', name: 'Commerce', bgColor: 'bg-yellow-200', icon: '🏺' },
  { key: 'science', name: 'Science', bgColor: 'bg-green-200', icon: '📖' },
  { key: 'guilds', name: 'Guilds', bgColor: 'bg-purple-200', icon: '👥' },
];

interface ScoreCategoriesProps {
  scores: Record<ScoreCategory, number>;
  onScoreChange: (category: ScoreCategory, value: number) => void;
  wonderBoard: WonderBoard;
  wonderSide: WonderSide;
}

// Extended state interfaces for detailed scoring
interface ExtendedPlayerState {
  coins: number;
  militaryTokens: {
    minusOne: number;
    one: number;
    three: number;
    five: number;
  };
  scienceSymbols: {
    gear: number;
    tablet: number;
    compass: number;
  };
  boardStages: boolean[];
  commerceCards: Array<{
    id: string;
    name: string;
    score: number;
    description: string;
    step: number;
  }>;
  guildsCards: Array<{
    id: string;
    name: string;
    score: number;
    description: string;
    step: number;
    maxScore?: number;
  }>;
  cultureCards: Array<{
    id: string;
    score: number;
    name?: string;
    isPredefined?: boolean;
  }>;
}

const ScoreCategories: React.FC<ScoreCategoriesProps> = ({
  scores,
  onScoreChange,
  wonderBoard,
  wonderSide,
}) => {
  const [expandedCategory, setExpandedCategory] = useState<ScoreCategory | null>(null);
  const [extendedState, setExtendedState] = useState<ExtendedPlayerState>({
    coins: 0,
    militaryTokens: { minusOne: 0, one: 0, three: 0, five: 0 },
    scienceSymbols: { gear: 0, tablet: 0, compass: 0 },
    boardStages: [],
    commerceCards: [],
    guildsCards: [],
    cultureCards: [],
  });

  const updateExtendedState = (updates: Partial<ExtendedPlayerState>) => {
    setExtendedState(prev => ({ ...prev, ...updates }));
  };

  const renderCategoryDetails = (category: ScoreCategory) => {
    switch (category) {
      case 'wealth':
        return (
          <WealthDetails
            coins={extendedState.coins}
            onCoinsChange={(coins) => updateExtendedState({ coins })}
            onScoreChange={(score) => onScoreChange(category, score)}
          />
        );
      case 'military':
        return (
          <MilitaryDetails
            militaryTokens={extendedState.militaryTokens}
            onMilitaryTokensChange={(tokens) => updateExtendedState({ militaryTokens: tokens })}
            onScoreChange={(score) => onScoreChange(category, score)}
          />
        );
      case 'science':
        return (
          <ScienceDetails
            scienceSymbols={extendedState.scienceSymbols}
            onScienceSymbolsChange={(symbols) => updateExtendedState({ scienceSymbols: symbols })}
            onScoreChange={(score) => onScoreChange(category, score)}
          />
        );
      case 'wonder':
        return (
          <WonderBoardDetails
            wonderBoard={wonderBoard}
            wonderSide={wonderSide}
            boardStages={extendedState.boardStages}
            onBoardStagesChange={(stages) => updateExtendedState({ boardStages: stages })}
            onScoreChange={(score) => onScoreChange(category, score)}
          />
        );
      case 'commerce':
        return (
          <CommerceDetails
            commerceCards={extendedState.commerceCards}
            onCommerceCardsChange={(cards) => updateExtendedState({ commerceCards: cards })}
            onScoreChange={(score) => onScoreChange(category, score)}
          />
        );
      case 'guilds':
        return (
          <GuildsDetails
            guildsCards={extendedState.guildsCards}
            onGuildsCardsChange={(cards) => updateExtendedState({ guildsCards: cards })}
            onScoreChange={(score) => onScoreChange(category, score)}
          />
        );
      case 'culture':
        return (
          <CultureDetails
            cultureCards={extendedState.cultureCards}
            onCultureCardsChange={(cards) => updateExtendedState({ cultureCards: cards })}
            onScoreChange={(score) => onScoreChange(category, score)}
          />
        );
      default:
        return (
          <div className="p-3 bg-white border-t">
            <p className="text-sm text-gray-600">
              Enter individual victory point components
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-2">
      {scoreCategories.map((category) => (
        <div key={category.key} className={`${category.bgColor} rounded-lg overflow-hidden`}>
          <div 
            className="flex items-center justify-between p-3 cursor-pointer hover:bg-black/5"
            onClick={() => setExpandedCategory(expandedCategory === category.key ? null : category.key)}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{category.icon}</span>
              <span className="font-medium text-gray-800">{category.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={scores[category.key] || ''}
                onChange={(e) => onScoreChange(category.key, parseInt(e.target.value) || 0)}
                className="w-20 h-8 text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.currentTarget.blur();
                  }
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-6 w-6 hover:bg-black/10"
              >
                {expandedCategory === category.key ? 
                  <ChevronUp className="w-4 h-4" /> : 
                  <ChevronDown className="w-4 h-4" />
                }
              </Button>
            </div>
          </div>
          
          {expandedCategory === category.key && renderCategoryDetails(category.key)}
        </div>
      ))}
    </div>
  );
};

export default ScoreCategories;
