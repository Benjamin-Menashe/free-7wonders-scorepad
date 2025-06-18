
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Minus, X } from 'lucide-react';
import { ScoreCategory, WonderBoard, WonderSide } from '@/types/game';

interface CategoryDetailsProps {
  category: ScoreCategory;
  onScoreChange: (score: number) => void;
  // State props for different categories
  coins?: number;
  onCoinsChange?: (coins: number) => void;
  militaryTokens?: MilitaryTokens;
  onMilitaryTokensChange?: (tokens: MilitaryTokens) => void;
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
}

interface MilitaryTokens {
  minusOne: number;
  one: number;
  three: number;
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

const commerceCardsList = [
  {
    name: 'Lighthouse',
    description: '1 point for each yellow card you own',
    step: 1
  },
  {
    name: 'Haven',
    description: '1 point for each brown card you own',
    step: 1
  },
  {
    name: 'Chamber of Commerce',
    description: '2 points for each gray card you own',
    step: 2
  },
  {
    name: 'Ludus',
    description: '1 point for each red card you own',
    step: 1
  },
  {
    name: 'Arena',
    description: '1 point for each stage you constructed',
    step: 1
  }
];

const boardStagePoints: Record<WonderBoard, Record<WonderSide, number[]>> = {
  alexandria: {
    day: [3, 0, 7],
    night: [0, 0, 7]
  },
  babylon: {
    day: [3, 0, 7],
    night: [0, 0]
  },
  ephesus: {
    day: [3, 0, 7],
    night: [2, 3, 5]
  },
  giza: {
    day: [3, 5, 7],
    night: [3, 5, 5, 7]
  },
  halicarnassus: {
    day: [3, 0, 7],
    night: [2, 1, 0]
  },
  olympia: {
    day: [3, 0, 7],
    night: [2, 3, 5]
  },
  rhodes: {
    day: [3, 0, 7],
    night: [3, 4]
  }
};

export const CategoryDetails: React.FC<CategoryDetailsProps> = ({ 
  category, 
  onScoreChange,
  coins = 0,
  onCoinsChange,
  militaryTokens = { minusOne: 0, one: 0, three: 0, five: 0 },
  onMilitaryTokensChange,
  scienceSymbols = { gear: 0, tablet: 0, compass: 0 },
  onScienceSymbolsChange,
  cultureCards = [],
  onCultureCardsChange,
  wonderBoard = 'alexandria',
  wonderSide = 'day',
  boardStages = [],
  onBoardStagesChange,
  commerceCards = [],
  onCommerceCardsChange
}) => {
  const calculateWealthScore = (coinCount: number) => {
    const score = Math.floor(coinCount / 3);
    onScoreChange(score);
    return score;
  };

  const calculateMilitaryScore = (tokens: MilitaryTokens) => {
    const score = (tokens.minusOne * -1) + (tokens.one * 1) + (tokens.three * 3) + (tokens.five * 5);
    onScoreChange(score);
    return score;
  };

  const calculateScienceScore = (symbols: ScienceSymbols) => {
    const gearScore = symbols.gear * symbols.gear;
    const tabletScore = symbols.tablet * symbols.tablet;
    const compassScore = symbols.compass * symbols.compass;
    const minSymbols = Math.min(symbols.gear, symbols.tablet, symbols.compass);
    const setScore = minSymbols * 7;
    const totalScore = gearScore + tabletScore + compassScore + setScore;
    onScoreChange(totalScore);
    return totalScore;
  };

  const calculateCultureScore = (cards: CultureCard[]) => {
    const score = cards.reduce((sum, card) => sum + card.score, 0);
    onScoreChange(score);
    return score;
  };

  const calculateCommerceScore = (cards: CommerceCard[]) => {
    const score = cards.reduce((sum, card) => sum + card.score, 0);
    onScoreChange(score);
    return score;
  };

  const updateMilitaryToken = (type: keyof MilitaryTokens, delta: number) => {
    const newTokens = { ...militaryTokens, [type]: Math.max(0, militaryTokens[type] + delta) };
    onMilitaryTokensChange?.(newTokens);
    calculateMilitaryScore(newTokens);
  };

  const updateScienceSymbol = (type: keyof ScienceSymbols, delta: number) => {
    const newSymbols = { ...scienceSymbols, [type]: Math.max(0, scienceSymbols[type] + delta) };
    onScienceSymbolsChange?.(newSymbols);
    calculateScienceScore(newSymbols);
  };

  const addCultureCard = () => {
    const newCard = { id: `card-${Date.now()}`, score: 0 };
    const newCards = [newCard, ...cultureCards];
    onCultureCardsChange?.(newCards);
    calculateCultureScore(newCards);
  };

  const removeCultureCard = (cardId: string) => {
    const newCards = cultureCards.filter(card => card.id !== cardId);
    onCultureCardsChange?.(newCards);
    calculateCultureScore(newCards);
  };

  const updateCultureCard = (cardId: string, score: number) => {
    const newCards = cultureCards.map(card => 
      card.id === cardId ? { ...card, score } : card
    );
    onCultureCardsChange?.(newCards);
    calculateCultureScore(newCards);
  };

  const adjustCultureCard = (cardId: string, delta: number) => {
    const card = cultureCards.find(c => c.id === cardId);
    if (card) {
      const newScore = Math.max(0, card.score + delta);
      updateCultureCard(cardId, newScore);
    }
  };

  const addCommerceCard = (cardTemplate: typeof commerceCardsList[0]) => {
    const newCard: CommerceCard = { 
      id: `${cardTemplate.name}-${Date.now()}`, 
      name: cardTemplate.name,
      score: 0,
      description: cardTemplate.description,
      step: cardTemplate.step
    };
    const newCards = [...commerceCards, newCard];
    onCommerceCardsChange?.(newCards);
    calculateCommerceScore(newCards);
  };

  const removeCommerceCard = (cardId: string) => {
    const newCards = commerceCards.filter(card => card.id !== cardId);
    onCommerceCardsChange?.(newCards);
    calculateCommerceScore(newCards);
  };

  const updateCommerceCard = (cardId: string, score: number) => {
    const newCards = commerceCards.map(card => 
      card.id === cardId ? { ...card, score } : card
    );
    onCommerceCardsChange?.(newCards);
    calculateCommerceScore(newCards);
  };

  const adjustCommerceCard = (cardId: string, delta: number) => {
    const card = commerceCards.find(c => c.id === cardId);
    if (card) {
      const newScore = Math.max(0, card.score + delta);
      updateCommerceCard(cardId, newScore);
    }
  };

  const calculateBoardScore = (stages: boolean[], board: WonderBoard, side: WonderSide) => {
    const stagePoints = boardStagePoints[board][side];
    const score = stages.reduce((total, completed, index) => {
      return completed && stagePoints[index] !== undefined ? total + stagePoints[index] : total;
    }, 0);
    onScoreChange(score);
    return score;
  };

  const toggleBoardStage = (stageIndex: number) => {
    if (!wonderBoard || !wonderSide || !onBoardStagesChange) return;
    
    const stagePoints = boardStagePoints[wonderBoard][wonderSide];
    const currentStages = [...boardStages];
    
    // Initialize stages array if needed
    while (currentStages.length < stagePoints.length) {
      currentStages.push(false);
    }
    
    // If trying to complete a stage, check if all previous stages are completed
    if (!currentStages[stageIndex]) {
      for (let i = 0; i < stageIndex; i++) {
        if (!currentStages[i]) {
          return; // Can't complete this stage until previous ones are done
        }
      }
      currentStages[stageIndex] = true;
    } else {
      // If unchecking a stage, uncheck all subsequent stages too
      for (let i = stageIndex; i < currentStages.length; i++) {
        currentStages[i] = false;
      }
    }
    
    onBoardStagesChange(currentStages);
    calculateBoardScore(currentStages, wonderBoard, wonderSide);
  };

  const renderWealthDetails = () => (
    <div className="p-3 bg-white border-t">
      <div className="flex items-center justify-center gap-3">
        <span className="text-sm font-medium">Total coins:</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const newCoins = Math.max(0, coins - 1);
              onCoinsChange?.(newCoins);
              calculateWealthScore(newCoins);
            }}
            className="p-1 h-6 w-6 hover:bg-gray-200"
          >
            <Minus className="w-3 h-3" />
          </Button>
          <Input
            type="number"
            value={coins || ''}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0;
              onCoinsChange?.(value);
              calculateWealthScore(value);
            }}
            className="w-24 h-6 text-center text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            min="0"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const newCoins = coins + 1;
              onCoinsChange?.(newCoins);
              calculateWealthScore(newCoins);
            }}
            className="p-1 h-6 w-6 hover:bg-gray-200"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderMilitaryDetails = () => (
    <div className="p-3 bg-white border-t">
      <div className="space-y-2 flex flex-col items-center">
        {[
          { type: 'minusOne' as keyof MilitaryTokens, value: -1, bgColor: 'bg-white', textColor: 'text-black' },
          { type: 'one' as keyof MilitaryTokens, value: 1, bgColor: 'bg-black', textColor: 'text-white' },
          { type: 'three' as keyof MilitaryTokens, value: 3, bgColor: 'bg-black', textColor: 'text-white' },
          { type: 'five' as keyof MilitaryTokens, value: 5, bgColor: 'bg-black', textColor: 'text-white' },
        ].map(({ type, value, bgColor, textColor }) => (
          <div key={type} className="flex items-center gap-3">
            <div className={`${bgColor} ${textColor} border-2 border-red-500 w-12 h-8 flex items-center justify-center rounded font-bold text-sm`}>
              {value > 0 ? `+${value}` : value}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateMilitaryToken(type, -1)}
                className="p-1 h-6 w-6 hover:bg-gray-200"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <Input
                type="number"
                value={militaryTokens[type] || ''}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  const newTokens = { ...militaryTokens, [type]: Math.max(0, value) };
                  onMilitaryTokensChange?.(newTokens);
                  calculateMilitaryScore(newTokens);
                }}
                className="w-16 h-6 text-center text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min="0"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateMilitaryToken(type, 1)}
                className="p-1 h-6 w-6 hover:bg-gray-200"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderScienceDetails = () => (
    <div className="p-3 bg-white border-t">
      <div className="space-y-2 flex flex-col items-center">
        {[
          { type: 'gear' as keyof ScienceSymbols, name: 'Gear', image: '/lovable-uploads/57cf6465-fad3-46e7-aab6-0078037e7d97.png' },
          { type: 'tablet' as keyof ScienceSymbols, name: 'Tablet', image: '/lovable-uploads/e4de2ac1-7db7-4bb7-97ab-585914f3a40c.png' },
          { type: 'compass' as keyof ScienceSymbols, name: 'Compass', image: '/lovable-uploads/25de66f2-6275-40db-b4ef-244ea6bc058b.png' },
        ].map(({ type, name, image }) => (
          <div key={type} className="flex items-center gap-3">
            <div className="w-12 h-8 flex items-center justify-center rounded border-2 border-green-500" style={{ backgroundColor: '#ede9e6' }}>
              <img src={image} alt={name} className="w-6 h-6 object-contain" />
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateScienceSymbol(type, -1)}
                className="p-1 h-6 w-6 hover:bg-gray-200"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <Input
                type="number"
                value={scienceSymbols[type] || ''}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  const newSymbols = { ...scienceSymbols, [type]: Math.max(0, value) };
                  onScienceSymbolsChange?.(newSymbols);
                  calculateScienceScore(newSymbols);
                }}
                className="w-16 h-6 text-center text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min="0"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateScienceSymbol(type, 1)}
                className="p-1 h-6 w-6 hover:bg-gray-200"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCultureDetails = () => (
    <div className="p-3 bg-white border-t">
      <div className="flex flex-col items-center space-y-3">
        <Button
          onClick={addCultureCard}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="w-3 h-3" />
          Add Card
        </Button>
        
        {cultureCards.length > 0 && (
          <div className="space-y-2 w-full max-w-xs">
            {cultureCards.map(card => (
              <div key={card.id} className="flex items-center justify-center gap-2">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => adjustCultureCard(card.id, -1)}
                    className="p-1 h-6 w-6 hover:bg-gray-200"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <Input
                    type="number"
                    value={card.score || ''}
                    onChange={(e) => updateCultureCard(card.id, parseInt(e.target.value) || 0)}
                    placeholder="Points"
                    className="w-20 h-6 text-center text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    min="0"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => adjustCultureCard(card.id, 1)}
                    className="p-1 h-6 w-6 hover:bg-gray-200"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCultureCard(card.id)}
                  className="p-1 h-6 w-6 hover:bg-red-200"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderCommerceDetails = () => (
    <div className="p-3 bg-white border-t">
      <div className="space-y-4">
        {/* Available cards dropdown */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Add Card:</h4>
          <Select onValueChange={(cardName) => {
            const cardTemplate = commerceCardsList.find(card => card.name === cardName);
            if (cardTemplate) {
              addCommerceCard(cardTemplate);
            }
          }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a commerce card..." />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg z-50">
              {commerceCardsList.map(cardTemplate => {
                const isAdded = commerceCards.some(card => card.name === cardTemplate.name);
                return (
                  <SelectItem 
                    key={cardTemplate.name} 
                    value={cardTemplate.name}
                    disabled={isAdded}
                    className={`${isAdded ? 'opacity-50' : ''}`}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{cardTemplate.name}</span>
                      <span className="text-xs text-gray-500">{cardTemplate.description}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Added cards */}
        {commerceCards.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Your Cards:</h4>
            {commerceCards.map(card => (
              <div key={card.id} className="border rounded-lg p-3 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{card.name}</div>
                    <div className="text-xs text-gray-600">{card.description}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCommerceCard(card.id)}
                    className="p-1 h-6 w-6 hover:bg-red-200 ml-2"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => adjustCommerceCard(card.id, -card.step)}
                    className="p-1 h-6 w-6 hover:bg-gray-200"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <Input
                    type="number"
                    value={card.score || ''}
                    onChange={(e) => updateCommerceCard(card.id, parseInt(e.target.value) || 0)}
                    placeholder="Points"
                    className="w-20 h-6 text-center text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    min="0"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => adjustCommerceCard(card.id, card.step)}
                    className="p-1 h-6 w-6 hover:bg-gray-200"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderBoardDetails = () => {
    if (!wonderBoard || !wonderSide) return null;
    
    const stagePoints = boardStagePoints[wonderBoard][wonderSide];
    const currentStages = [...boardStages];
    
    // Initialize stages array if needed
    while (currentStages.length < stagePoints.length) {
      currentStages.push(false);
    }
    
    return (
      <div className="p-3 bg-white border-t">
        <div className="flex justify-center">
          <div className="flex gap-2">
            {stagePoints.map((points, index) => {
              const isCompleted = currentStages[index];
              const canComplete = index === 0 || currentStages[index - 1];
              
              // Create horizontal lines based on stage index (1, 2, 3, 4 lines)
              const lines = Array.from({ length: index + 1 }, (_, i) => (
                <div key={i} className="w-6 h-1 bg-yellow-400 rounded-full" />
              ));
              
              return (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleBoardStage(index)}
                  disabled={!canComplete && !isCompleted}
                  className={`w-12 h-12 flex flex-col items-center justify-center text-xs font-bold border-2 ${
                    isCompleted 
                      ? 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100' 
                      : 'bg-gray-100 border-gray-200 text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex flex-col gap-0.5 items-center mb-1">
                    {lines}
                  </div>
                  <div className="text-[10px]">{points}</div>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  switch (category) {
    case 'wealth':
      return renderWealthDetails();
    case 'military':
      return renderMilitaryDetails();
    case 'science':
      return renderScienceDetails();
    case 'culture':
      return renderCultureDetails();
    case 'wonder':
      return renderBoardDetails();
    case 'commerce':
      return renderCommerceDetails();
    case 'guilds':
      return (
        <div className="p-3 bg-white border-t flex justify-center">
          <p className="text-sm text-gray-600">
            Points from purple guild cards (Age III)
          </p>
        </div>
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
