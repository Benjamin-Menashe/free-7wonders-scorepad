
import React from 'react';
import { Button } from '@/components/ui/button';
import { WonderBoard, WonderSide } from '@/types/game';

interface WonderBoardDetailsProps {
  wonderBoard: WonderBoard;
  wonderSide: WonderSide;
  boardStages: boolean[];
  onBoardStagesChange: (stages: boolean[]) => void;
  onScoreChange: (score: number) => void;
}

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

export const WonderBoardDetails: React.FC<WonderBoardDetailsProps> = ({
  wonderBoard,
  wonderSide,
  boardStages,
  onBoardStagesChange,
  onScoreChange
}) => {
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
