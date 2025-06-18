
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Minus, X } from 'lucide-react';
import { ScoreCategory } from '@/types/game';

interface CategoryDetailsProps {
  category: ScoreCategory;
  onScoreChange: (score: number) => void;
}

interface MilitaryTokens {
  minusOne: number;
  one: number;
  three: number;
  five: number;
}

interface CultureCard {
  id: string;
  score: number;
}

export const CategoryDetails: React.FC<CategoryDetailsProps> = ({ category, onScoreChange }) => {
  const [coins, setCoins] = useState(0);
  const [militaryTokens, setMilitaryTokens] = useState<MilitaryTokens>({
    minusOne: 0,
    one: 0,
    three: 0,
    five: 0
  });
  const [cultureCards, setCultureCards] = useState<CultureCard[]>([]);

  const adjustValue = (currentValue: number, delta: number, setter: (value: number) => void, callback?: () => void) => {
    const newValue = Math.max(0, currentValue + delta);
    setter(newValue);
    if (callback) callback();
  };

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

  const calculateCultureScore = (cards: CultureCard[]) => {
    const score = cards.reduce((sum, card) => sum + card.score, 0);
    onScoreChange(score);
    return score;
  };

  const updateMilitaryToken = (type: keyof MilitaryTokens, delta: number) => {
    const newTokens = { ...militaryTokens, [type]: Math.max(0, militaryTokens[type] + delta) };
    setMilitaryTokens(newTokens);
    calculateMilitaryScore(newTokens);
  };

  const addCultureCard = () => {
    const newCard = { id: `card-${Date.now()}`, score: 0 };
    const newCards = [...cultureCards, newCard];
    setCultureCards(newCards);
    calculateCultureScore(newCards);
  };

  const removeCultureCard = (cardId: string) => {
    const newCards = cultureCards.filter(card => card.id !== cardId);
    setCultureCards(newCards);
    calculateCultureScore(newCards);
  };

  const updateCultureCard = (cardId: string, score: number) => {
    const newCards = cultureCards.map(card => 
      card.id === cardId ? { ...card, score } : card
    );
    setCultureCards(newCards);
    calculateCultureScore(newCards);
  };

  const adjustCultureCard = (cardId: string, delta: number) => {
    const card = cultureCards.find(c => c.id === cardId);
    if (card) {
      const newScore = Math.max(0, card.score + delta);
      updateCultureCard(cardId, newScore);
    }
  };

  const renderWealthDetails = () => (
    <div className="p-3 bg-white border-t space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium min-w-[80px]">Total coins:</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => adjustValue(coins, -1, setCoins, () => calculateWealthScore(coins - 1))}
            className="p-1 h-6 w-6 hover:bg-gray-200"
          >
            <Minus className="w-3 h-3" />
          </Button>
          <Input
            type="number"
            value={coins || ''}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0;
              setCoins(value);
              calculateWealthScore(value);
            }}
            className="w-16 h-6 text-center text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            min="0"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => adjustValue(coins, 1, setCoins, () => calculateWealthScore(coins + 1))}
            className="p-1 h-6 w-6 hover:bg-gray-200"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderMilitaryDetails = () => (
    <div className="p-3 bg-white border-t space-y-3">
      <div className="space-y-2">
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
                  setMilitaryTokens(newTokens);
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

  const renderCultureDetails = () => (
    <div className="p-3 bg-white border-t space-y-3">
      <Button
        onClick={addCultureCard}
        variant="outline"
        size="sm"
        className="w-full flex items-center gap-2"
      >
        <Plus className="w-3 h-3" />
        Add Card
      </Button>
      
      {cultureCards.length > 0 && (
        <div className="space-y-2">
          {cultureCards.map(card => (
            <div key={card.id} className="flex items-center gap-2">
              <div className="flex items-center gap-1 flex-1">
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
                  className="w-16 h-6 text-center text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
  );

  const renderDefaultDetails = () => (
    <div className="p-3 bg-white border-t">
      <p className="text-sm text-gray-600">
        Enter individual victory point components
      </p>
    </div>
  );

  switch (category) {
    case 'wealth':
      return renderWealthDetails();
    case 'military':
      return renderMilitaryDetails();
    case 'culture':
      return renderCultureDetails();
    case 'wonder':
      return (
        <div className="p-3 bg-white border-t">
          <p className="text-sm text-gray-600">
            Points from your Board stages and effects
          </p>
        </div>
      );
    case 'commerce':
      return (
        <div className="p-3 bg-white border-t">
          <p className="text-sm text-gray-600">
            Points from yellow commercial structures
          </p>
        </div>
      );
    case 'science':
      return (
        <div className="p-3 bg-white border-t">
          <p className="text-sm text-gray-600">
            Points from green science structures and symbols
          </p>
        </div>
      );
    case 'guilds':
      return (
        <div className="p-3 bg-white border-t">
          <p className="text-sm text-gray-600">
            Points from purple guild cards (Age III)
          </p>
        </div>
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
