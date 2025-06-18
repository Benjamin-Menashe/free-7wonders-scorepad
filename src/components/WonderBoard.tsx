
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, X, Sun, Moon, Minus, Plus, Edit } from 'lucide-react';
import { WonderBoard as WonderBoardType, WonderSide, ScoreCategory } from '@/types/game';
import { calculateTotalScore } from '@/utils/scoreCalculator';
import { scoreCategories } from './ScoreCategories';
import { CategoryDetails } from './CategoryDetails';

interface WonderBoardProps {
  board: WonderBoardType;
  playerName: string;
  wonderSide: WonderSide;
  scores: Record<ScoreCategory, number>;
  onNameChange: (name: string) => void;
  onSideChange: (side: WonderSide) => void;
  onScoreChange: (category: ScoreCategory, value: number) => void;
  onRemove: () => void;
  isEmpty: boolean;
  forceExpanded?: boolean;
}

const wonderInfo: Record<WonderBoardType, { name: string; description: string }> = {
  alexandria: { name: 'Alexandria', description: 'The Great Library' },
  babylon: { name: 'Babylon', description: 'The Hanging Gardens' },
  ephesus: { name: 'Ephesos', description: 'The Temple of Artemis' },
  giza: { name: 'Gizah', description: 'The Great Pyramid' },
  halicarnassus: { name: 'Halikarnassos', description: 'The Mausoleum' },
  olympia: { name: 'Olympia', description: 'The Statue of Zeus' },
  rhodes: { name: 'Rhodos', description: 'The Colossus' },
};

const WonderBoard: React.FC<WonderBoardProps> = ({
  board,
  playerName,
  wonderSide,
  scores,
  onNameChange,
  onSideChange,
  onScoreChange,
  onRemove,
  isEmpty,
  forceExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<ScoreCategory, boolean>>({
    wonder: false,
    wealth: false,
    military: false,
    culture: false,
    commerce: false,
    science: false,
    guilds: false
  });
  const [isEditingName, setIsEditingName] = useState(false);
  
  const totalScore = calculateTotalScore(scores);
  const wonder = wonderInfo[board];

  useEffect(() => {
    if (forceExpanded !== undefined) {
      setIsExpanded(forceExpanded);
      // When expand all is triggered, collapse all category expansions
      if (forceExpanded) {
        setExpandedCategories({
          wonder: false,
          wealth: false,
          military: false,
          culture: false,
          commerce: false,
          science: false,
          guilds: false
        });
      }
    }
  }, [forceExpanded]);

  const handleScoreChange = (category: ScoreCategory, value: string) => {
    const numValue = value === '' ? 0 : parseInt(value) || 0;
    onScoreChange(category, numValue);
  };

  const adjustScore = (category: ScoreCategory, delta: number) => {
    const currentScore = scores[category] || 0;
    const newScore = currentScore + delta;
    if (category !== 'military' && newScore < 0) return;
    onScoreChange(category, newScore);
  };

  const toggleCategoryExpansion = (category: ScoreCategory) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingName(false);
  };

  const handleToggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const effectiveExpanded = forceExpanded !== undefined ? forceExpanded : isExpanded;
  const headerColors = wonderSide === 'day' 
    ? 'bg-gradient-to-r from-white via-blue-50 to-blue-100' 
    : 'bg-gradient-to-r from-slate-800 via-slate-900 to-black';
  const textColors = wonderSide === 'day' ? 'text-slate-800' : 'text-white';

  return (
    <Card className="shadow-lg rounded-lg overflow-hidden">
      <div className={`p-3 ${headerColors} ${textColors}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSideChange(wonderSide === 'day' ? 'night' : 'day')}
              className={`${textColors} hover:bg-black/10 p-1 h-auto flex-shrink-0`}
            >
              {wonderSide === 'day' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            
            <div className="font-bold text-xs min-w-0 text-left mr-2">
              {wonder.name}
            </div>

            {/* Player Name */}
            <div className="flex-1 min-w-0">
              {isEditingName ? (
                <form onSubmit={handleNameSubmit} className="flex items-center">
                  <Input
                    value={playerName}
                    onChange={(e) => onNameChange(e.target.value)}
                    placeholder="Player name"
                    className="bg-white/90 text-gray-800 placeholder:text-gray-500 border-0 h-7 text-sm font-bold text-center"
                    autoFocus
                    onBlur={() => setIsEditingName(false)}
                  />
                </form>
              ) : (
                <div
                  onClick={() => setIsEditingName(true)}
                  className={`${textColors} text-sm font-bold cursor-pointer hover:bg-black/10 px-2 py-1 rounded flex items-center gap-1 min-h-[28px] justify-center truncate`}
                >
                  <span className="truncate">{playerName || 'Add name'}</span>
                  <Edit className="w-3 h-3 opacity-50 flex-shrink-0" />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleExpansion}
              className={`${textColors} hover:bg-black/10 p-1 h-auto`}
            >
              {effectiveExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
            
            <div className="font-bold text-lg min-w-[2rem] text-center">
              {totalScore}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className={`${textColors} hover:bg-red-500/50 p-0.5 h-auto`}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      {effectiveExpanded && (
        <CardContent className="p-4 bg-white">
          <div className="space-y-2">
            {scoreCategories.map(category => (
              <div key={category.key} className="rounded-lg overflow-hidden">
                <div 
                  className={`flex items-center justify-between p-3 ${category.bgColor} cursor-pointer hover:opacity-90`}
                  onClick={() => toggleCategoryExpansion(category.key)}
                >
                  <div className="flex items-center gap-2 font-medium text-black">
                    <span>{category.icon}</span>
                    {category.name}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        adjustScore(category.key, -1);
                      }}
                      className="p-1 h-6 w-6 hover:bg-black/10"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    
                    <Input
                      type="number"
                      value={scores[category.key] || ''}
                      onChange={(e) => handleScoreChange(category.key, e.target.value)}
                      placeholder="0"
                      className="w-12 text-center h-6 text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      min={category.key === 'military' ? undefined : "0"}
                      onClick={(e) => e.stopPropagation()}
                    />
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        adjustScore(category.key, 1);
                      }}
                      className="p-1 h-6 w-6 hover:bg-black/10"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto ml-1"
                    >
                      {expandedCategories[category.key] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {expandedCategories[category.key] && (
                  <CategoryDetails 
                    category={category.key} 
                    onScoreChange={(score) => onScoreChange(category.key, score)}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default WonderBoard;
