import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Minus, Plus, X, ChevronDown } from 'lucide-react';

interface CityCard {
  id: string;
  name: string;
  score: number;
  description?: string;
  isVariable: boolean;
  step?: number;
}

interface CityDetailsProps {
  cityCards: CityCard[];
  onCityCardsChange: (cards: CityCard[]) => void;
  onScoreChange: (score: number) => void;
}

const cityCardsList = [
  { name: 'Architect Firm', points: 2, isVariable: false },
  { name: 'Brotherhood', points: 4, isVariable: false },
  { name: 'Capitol', points: 8, isVariable: false },
  { name: 'Cells', points: 0, isVariable: true, description: '2 points for each 1 military victory token you own', step: 2 },
  { name: 'Cenotaph', points: 5, isVariable: false },
  { name: 'Chamber of Builders', points: 4, isVariable: false },
  { name: 'City Gates', points: 4, isVariable: false },
  { name: 'Consulate', points: 2, isVariable: false },
  { name: 'Customs', points: 4, isVariable: false },
  { name: 'Embassy', points: 3, isVariable: false },
  { name: 'Guardhouse', points: 0, isVariable: true, description: '3 points for each 3 military victory token you own', step: 3 },
  { name: 'Hideout', points: 2, isVariable: false },
  { name: 'Lair', points: 3, isVariable: false },
  { name: 'Mint', points: 8, isVariable: false },
  { name: 'Prison', points: 0, isVariable: true, description: '4 points for each 5 military victory token you own', step: 4 },
  { name: 'Residence', points: 1, isVariable: false },
  { name: 'Secret Network', points: 0, isVariable: true, description: '1 point for each black card you own', step: 1 },
  { name: 'Sepulcher', points: 4, isVariable: false },
  { name: 'Slave Market', points: 0, isVariable: true, description: '1 point for each military victory token you own', step: 1 },
  { name: 'Tabularium', points: 6, isVariable: false },
  { name: 'Trade Center', points: 6, isVariable: false },
];

export const CityDetails: React.FC<CityDetailsProps> = ({
  cityCards,
  onCityCardsChange,
  onScoreChange
}) => {
  const calculateCityScore = (cards: CityCard[]) => {
    const total = cards.reduce((sum, card) => sum + card.score, 0);
    onScoreChange(total);
    return total;
  };

  const addCityCard = (cardTemplate: typeof cityCardsList[0]) => {
    const newCard: CityCard = {
      id: Math.random().toString(36).substr(2, 9),
      name: cardTemplate.name,
      score: cardTemplate.points,
      description: cardTemplate.description,
      isVariable: cardTemplate.isVariable,
      step: cardTemplate.step
    };
    
    const updatedCards = [...cityCards, newCard];
    onCityCardsChange(updatedCards);
    calculateCityScore(updatedCards);
  };

  const removeCityCard = (cardId: string) => {
    const updatedCards = cityCards.filter(card => card.id !== cardId);
    onCityCardsChange(updatedCards);
    calculateCityScore(updatedCards);
  };

  const updateCityCard = (cardId: string, score: number) => {
    const updatedCards = cityCards.map(card =>
      card.id === cardId ? { ...card, score } : card
    );
    onCityCardsChange(updatedCards);
    calculateCityScore(updatedCards);
  };

  const adjustCityCard = (cardId: string, delta: number) => {
    const card = cityCards.find(c => c.id === cardId);
    if (card && card.isVariable) {
      const newScore = Math.max(0, card.score + delta);
      updateCityCard(cardId, newScore);
    }
  };

  const availableCards = cityCardsList.filter(
    template => !cityCards.some(card => card.name === template.name)
  );

  return (
    <div className="p-3 bg-white border-t">
      <div className="flex flex-col items-center space-y-3">
        {availableCards.length > 0 && (
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="justify-between">
                  Select a city card...
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border shadow-lg z-50">
                {availableCards.map((card) => (
                  <DropdownMenuItem
                    key={card.name}
                    onClick={() => addCityCard(card)}
                    className="cursor-pointer flex justify-between"
                  >
                    <span>{card.name}</span>
                    {!card.isVariable && (
                      <span className="text-sm text-gray-500">{card.points} pts</span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {cityCards.length > 0 && (
          <div className="space-y-3 w-full">
            {cityCards.map((card) => (
              <div key={card.id}>
                {card.isVariable ? (
                  // Variable cards: Commerce style - light grey background with description
                  <div className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="font-medium text-sm">{card.name}</div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => adjustCityCard(card.id, -(card.step || 1))}
                          className="p-1 h-6 w-6 hover:bg-gray-200"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Input
                          type="number"
                          value={card.score || ''}
                          onChange={(e) => updateCityCard(card.id, parseInt(e.target.value) || 0)}
                          placeholder="Points"
                          className="w-16 h-6 text-center text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          min="0"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => adjustCityCard(card.id, card.step || 1)}
                          className="p-1 h-6 w-6 hover:bg-gray-200"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCityCard(card.id)}
                          className="p-1 h-6 w-6 hover:bg-red-200 ml-1"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">{card.description}</div>
                  </div>
                ) : (
                  // Fixed cards: Culture style - name with grey shaded points, no border
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-medium">{card.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded">{card.score} pts</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCityCard(card.id)}
                        className="p-1 h-6 w-6 hover:bg-red-200"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {cityCards.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-4">
            No city cards selected
          </div>
        )}
      </div>
    </div>
  );
};