
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Minus, X, ChevronDown } from 'lucide-react';

interface GuildsCard {
  id: string;
  name: string;
  score: number;
  description: string;
  step: number;
  maxScore?: number;
}

interface GuildsDetailsProps {
  guildsCards: GuildsCard[];
  onGuildsCardsChange: (cards: GuildsCard[]) => void;
  onScoreChange: (score: number) => void;
}

const guildsCardsList = [
  {
    name: 'Workers Guild',
    description: '1 point for each brown card your neighbors own',
    step: 1
  },
  {
    name: 'Craftsmens Guild',
    description: '2 points for each gray card your neighbors own',
    step: 2
  },
  {
    name: 'Magistrates Guild',
    description: '1 point for each blue card your neighbors own',
    step: 1
  },
  {
    name: 'Traders Guild',
    description: '1 point for each yellow card your neighbors own',
    step: 1
  },
  {
    name: 'Spies Guild',
    description: '1 point for each red card your neighbors own',
    step: 1
  },
  {
    name: 'Philosophers Guild',
    description: '1 point for each green card your neighbors own',
    step: 1
  },
  {
    name: 'Shipowners Guild',
    description: '1 point for each brown, gray, and purple card you own',
    step: 1
  },
  {
    name: 'Builders Guild',
    description: '1 point for each stage you and your neighbors constructed',
    step: 1
  },
  {
    name: 'Decorators Guild',
    description: '7 points if you constructed all your stages',
    step: 7,
    maxScore: 7
  }
];

export const GuildsDetails: React.FC<GuildsDetailsProps> = ({
  guildsCards,
  onGuildsCardsChange,
  onScoreChange
}) => {
  const calculateGuildsScore = (cards: GuildsCard[]) => {
    const score = cards.reduce((sum, card) => sum + card.score, 0);
    onScoreChange(score);
    return score;
  };

  const addGuildsCard = (cardTemplate: typeof guildsCardsList[0]) => {
    const newCard: GuildsCard = { 
      id: `${cardTemplate.name}-${Date.now()}`, 
      name: cardTemplate.name,
      score: 0,
      description: cardTemplate.description,
      step: cardTemplate.step,
      maxScore: cardTemplate.maxScore
    };
    const newCards = [...guildsCards, newCard];
    onGuildsCardsChange(newCards);
    calculateGuildsScore(newCards);
  };

  const removeGuildsCard = (cardId: string) => {
    const newCards = guildsCards.filter(card => card.id !== cardId);
    onGuildsCardsChange(newCards);
    calculateGuildsScore(newCards);
  };

  const updateGuildsCard = (cardId: string, score: number) => {
    const card = guildsCards.find(c => c.id === cardId);
    if (card) {
      const maxScore = card.maxScore || Infinity;
      const clampedScore = Math.min(Math.max(0, score), maxScore);
      const newCards = guildsCards.map(c => 
        c.id === cardId ? { ...c, score: clampedScore } : c
      );
      onGuildsCardsChange(newCards);
      calculateGuildsScore(newCards);
    }
  };

  const adjustGuildsCard = (cardId: string, delta: number) => {
    const card = guildsCards.find(c => c.id === cardId);
    if (card) {
      const maxScore = card.maxScore || Infinity;
      const newScore = Math.min(Math.max(0, card.score + delta), maxScore);
      updateGuildsCard(cardId, newScore);
    }
  };

  return (
    <div className="p-3 bg-white border-t">
      <div className="space-y-4">
        {/* Dropdown menu button */}
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="justify-between">
                Select a guild card...
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border shadow-lg z-50">
              {guildsCardsList.map(cardTemplate => {
                const isAdded = guildsCards.some(card => card.name === cardTemplate.name);
                return (
                  <DropdownMenuItem
                    key={cardTemplate.name}
                    onClick={() => !isAdded && addGuildsCard(cardTemplate)}
                    disabled={isAdded}
                    className={`${isAdded ? 'opacity-50' : ''} cursor-pointer`}
                  >
                    {cardTemplate.name}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Added cards */}
        {guildsCards.length > 0 && (
          <div className="space-y-3">
            {guildsCards.map(card => (
              <div key={card.id} className="border rounded-lg p-3 bg-gray-50">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="font-medium text-sm">{card.name}</div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => adjustGuildsCard(card.id, -card.step)}
                      className="p-1 h-6 w-6 hover:bg-gray-200"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <Input
                      type="number"
                      value={card.score || ''}
                      onChange={(e) => updateGuildsCard(card.id, parseInt(e.target.value) || 0)}
                      placeholder="Points"
                      className="w-16 h-6 text-center text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      min="0"
                      max={card.maxScore}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => adjustGuildsCard(card.id, card.step)}
                      className="p-1 h-6 w-6 hover:bg-gray-200"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeGuildsCard(card.id)}
                      className="p-1 h-6 w-6 hover:bg-red-200 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-gray-600">{card.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
