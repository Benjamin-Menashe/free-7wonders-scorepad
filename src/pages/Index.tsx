
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, Trophy, Calculator } from 'lucide-react';
import PlayerSetup from '@/components/PlayerSetup';
import ScoringSection from '@/components/ScoringSection';
import ResultsTable from '@/components/ResultsTable';
import { Player, ScoreCategory } from '@/types/game';
import { calculateTotalScore } from '@/utils/scoreCalculator';

const Index = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentStep, setCurrentStep] = useState<'setup' | 'scoring' | 'results'>('setup');
  const [scores, setScores] = useState<Record<string, Record<ScoreCategory, number>>>({});

  const scoreCategories: { key: ScoreCategory; name: string; color: string; icon: string }[] = [
    { key: 'wonder', name: 'Wonder Board', color: 'bg-amber-500', icon: '🔺' },
    { key: 'wealth', name: 'Wealth', color: 'bg-yellow-500', icon: '🪙' },
    { key: 'military', name: 'Military', color: 'bg-red-500', icon: '⚔️' },
    { key: 'culture', name: 'Culture', color: 'bg-blue-500', icon: '🏛️' },
    { key: 'commerce', name: 'Commerce', color: 'bg-yellow-600', icon: '🏪' },
    { key: 'science', name: 'Science', color: 'bg-green-500', icon: '⚗️' },
    { key: 'guilds', name: 'Guilds', color: 'bg-purple-500', icon: '👥' },
  ];

  const updateScore = (playerId: string, category: ScoreCategory, value: number) => {
    setScores(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [category]: value
      }
    }));
  };

  const initializeScores = () => {
    const initialScores: Record<string, Record<ScoreCategory, number>> = {};
    players.forEach(player => {
      initialScores[player.id] = {
        wonder: 0,
        wealth: 0,
        military: 0,
        culture: 0,
        commerce: 0,
        science: 0,
        guilds: 0
      };
    });
    setScores(initialScores);
  };

  useEffect(() => {
    if (players.length > 0 && currentStep === 'scoring') {
      initializeScores();
    }
  }, [players, currentStep]);

  const handleStartScoring = () => {
    if (players.length >= 3) {
      setCurrentStep('scoring');
    }
  };

  const handleViewResults = () => {
    setCurrentStep('results');
  };

  const handleBackToSetup = () => {
    setCurrentStep('setup');
    setPlayers([]);
    setScores({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-amber-900 mb-4">
            7 Wonders Digital Scorepad
          </h1>
          <p className="text-lg text-amber-700 max-w-2xl mx-auto">
            Track scores for the legendary board game of ancient civilizations
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-lg p-1 shadow-lg">
            <Button
              variant={currentStep === 'setup' ? 'default' : 'ghost'}
              className="flex items-center gap-2"
              onClick={() => setCurrentStep('setup')}
            >
              <Users className="w-4 h-4" />
              Setup
            </Button>
            <Button
              variant={currentStep === 'scoring' ? 'default' : 'ghost'}
              className="flex items-center gap-2"
              onClick={() => handleStartScoring()}
              disabled={players.length < 3}
            >
              <Calculator className="w-4 h-4" />
              Scoring
            </Button>
            <Button
              variant={currentStep === 'results' ? 'default' : 'ghost'}
              className="flex items-center gap-2"
              onClick={() => handleViewResults()}
              disabled={players.length === 0}
            >
              <Trophy className="w-4 h-4" />
              Results
            </Button>
          </div>
        </div>

        {/* Content */}
        {currentStep === 'setup' && (
          <PlayerSetup 
            players={players} 
            setPlayers={setPlayers}
            onStartScoring={handleStartScoring}
          />
        )}

        {currentStep === 'scoring' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-amber-900 mb-2">Score Calculation</h2>
              <p className="text-amber-700">Expand each category to enter scores for all players</p>
            </div>
            
            {scoreCategories.map(category => (
              <ScoringSection
                key={category.key}
                category={category}
                players={players}
                scores={scores}
                updateScore={updateScore}
              />
            ))}

            <div className="flex justify-center gap-4 mt-8">
              <Button onClick={() => setCurrentStep('setup')} variant="outline">
                Back to Setup
              </Button>
              <Button onClick={handleViewResults} className="bg-green-600 hover:bg-green-700">
                View Results
              </Button>
            </div>
          </div>
        )}

        {currentStep === 'results' && (
          <ResultsTable 
            players={players}
            scores={scores}
            onBackToSetup={handleBackToSetup}
            onBackToScoring={() => setCurrentStep('scoring')}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
