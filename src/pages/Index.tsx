import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronUp, ChevronDown, Plus, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import WonderBoard from '@/components/WonderBoard';
import { WonderBoard as WonderBoardType, WonderSide, ScoreCategory } from '@/types/game';
import { calculateTotalScore, getWinner } from '@/utils/scoreCalculator';

interface PlayerData {
  id: string;
  name: string;
  board: WonderBoardType;
  side: WonderSide;
  scores: Record<ScoreCategory, number>;
  isActive: boolean;
}

const wonderBoards: WonderBoardType[] = [
  'alexandria', 'babylon', 'ephesus', 'giza', 'halicarnassus', 'olympia', 'rhodes'
];

const createEmptyScores = (): Record<ScoreCategory, number> => ({
  wonder: 0,
  wealth: 0,
  military: 0,
  culture: 0,
  commerce: 0,
  science: 0,
  guilds: 0
});

const Index = () => {
  const [allPlayersData, setAllPlayersData] = useState<PlayerData[]>([]);
  const [soloPlayerData, setSoloPlayerData] = useState<PlayerData[]>([]);
  const [gameTitle, setGameTitle] = useState('7 Wonders');
  const [allExpanded, setAllExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('all-players');
  const { toast } = useToast();

  // Initialize with all 7 wonder boards for "All Players" mode
  useEffect(() => {
    const initialPlayers: PlayerData[] = wonderBoards.map((board, index) => ({
      id: `player-${index}`,
      name: '',
      board,
      side: 'day' as WonderSide,
      scores: createEmptyScores(),
      isActive: true,
    }));
    setAllPlayersData(initialPlayers);
  }, []);

  const getCurrentPlayers = () => {
    return activeTab === 'all-players' ? allPlayersData : soloPlayerData;
  };

  const setCurrentPlayers = (players: PlayerData[]) => {
    if (activeTab === 'all-players') {
      setAllPlayersData(players);
    } else {
      setSoloPlayerData(players);
    }
  };

  const updatePlayerName = (playerId: string, name: string) => {
    setCurrentPlayers(getCurrentPlayers().map(p => 
      p.id === playerId ? { ...p, name } : p
    ));
  };

  const updatePlayerSide = (playerId: string, side: WonderSide) => {
    setCurrentPlayers(getCurrentPlayers().map(p => 
      p.id === playerId ? { ...p, side } : p
    ));
  };

  const updatePlayerScore = (playerId: string, category: ScoreCategory, value: number) => {
    setCurrentPlayers(getCurrentPlayers().map(p => 
      p.id === playerId ? { 
        ...p, 
        scores: { ...p.scores, [category]: value }
      } : p
    ));
  };

  const removePlayer = (playerId: string) => {
    if (activeTab === 'solo') {
      // In solo mode, remove the player completely
      setSoloPlayerData([]);
    } else {
      // In all players mode, just deactivate
      setCurrentPlayers(getCurrentPlayers().map(p => 
        p.id === playerId ? { ...p, isActive: false } : p
      ));
    }
  };

  const addSpecificBoard = (boardType: WonderBoardType) => {
    const currentPlayers = getCurrentPlayers();
    
    if (activeTab === 'solo') {
      // In solo mode, only allow one board
      if (currentPlayers.length === 0) {
        const newPlayer: PlayerData = {
          id: `solo-player-${Date.now()}`,
          name: '',
          board: boardType,
          side: 'day' as WonderSide,
          scores: createEmptyScores(),
          isActive: true,
        };
        setSoloPlayerData([newPlayer]);
      }
    } else {
      // In all players mode, reactivate the board
      setCurrentPlayers(currentPlayers.map(p => 
        p.board === boardType ? { ...p, isActive: true } : p
      ));
    }
  };

  const toggleExpandAll = () => {
    setAllExpanded(!allExpanded);
  };

  const copyGameSummary = () => {
    const players = getCurrentPlayers();
    const activePlayers = players.filter(p => p.isActive);
    const playingPlayers = activePlayers.filter(p => p.name.trim() !== '');
    
    if (playingPlayers.length === 0) {
      toast({
        title: "No players to summarize",
        description: "Add some players with names first!",
        variant: "destructive",
        duration: 1000,
      });
      return;
    }

    // Sort players by total score
    const sortedPlayers = playingPlayers
      .sort((a, b) => calculateTotalScore(b.scores) - calculateTotalScore(a.scores));

    let summary = `🏛️ 7 Wonders Game Summary 🏛️\n\n`;
    
    if (activeTab === 'solo') {
      const player = sortedPlayers[0];
      summary += `${player.name} - ${player.board.charAt(0).toUpperCase() + player.board.slice(1)} (${player.side === 'day' ? '☀️' : '🌙'})\n`;
      summary += `Total Score: ${calculateTotalScore(player.scores)} points\n\n`;
      summary += `Score Breakdown:\n`;
      summary += `🔶 Wonder: ${player.scores.wonder}\n`;
      summary += `🪙 Wealth: ${player.scores.wealth}\n`;
      summary += `⚔️ Military: ${player.scores.military}\n`;
      summary += `🏛️ Culture: ${player.scores.culture}\n`;
      summary += `🏺 Commerce: ${player.scores.commerce}\n`;
      summary += `📖 Science: ${player.scores.science}\n`;
      summary += `👥 Guilds: ${player.scores.guilds}\n`;
    } else {
      summary += `Final Standings:\n`;
      sortedPlayers.forEach((player, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        summary += `${medal} ${player.name} - ${calculateTotalScore(player.scores)} pts (${player.board.charAt(0).toUpperCase() + player.board.slice(1)}, ${player.side === 'day' ? '☀️' : '🌙'})\n`;
      });
      
      // Only add detailed scores if expand all is active
      if (allExpanded) {
        summary += `\nDetailed Scores:\n`;
        sortedPlayers.forEach(player => {
          summary += `\n${player.name} (${player.board.charAt(0).toUpperCase() + player.board.slice(1)}):\n`;
          summary += `🔶 Wonder: ${player.scores.wonder} | 🪙 Wealth: ${player.scores.wealth} | ⚔️ Military: ${player.scores.military}\n`;
          summary += `🏛️ Culture: ${player.scores.culture} | 🏺 Commerce: ${player.scores.commerce} | 📖 Science: ${player.scores.science} | 👥 Guilds: ${player.scores.guilds}\n`;
        });
      }
    }

    summary += `\n--- Created with 7 Wonders Digital Scorepad by Benjamin Menashe ---\n`;
    summary += `https://7wonders.lovable.app`;

    navigator.clipboard.writeText(summary).then(() => {
      toast({
        title: "Game summary copied!",
        description: "The game summary has been copied to your clipboard.",
        duration: 1000,
      });
    }).catch(() => {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard. Please try again.",
        variant: "destructive",
        duration: 1000,
      });
    });
  };

  const players = getCurrentPlayers();
  const activePlayers = players.filter(p => p.isActive);
  const playingPlayers = activePlayers.filter(p => p.name.trim() !== '');
  const removedBoards = players.filter(p => !p.isActive);
  
  // Sort active players by total score (highest first)
  const sortedActivePlayers = activePlayers
    .sort((a, b) => calculateTotalScore(b.scores) - calculateTotalScore(a.scores));

  // Get available boards for dropdown
  const getAvailableBoards = () => {
    if (activeTab === 'solo') {
      // In solo mode, show all boards if no player exists, otherwise show none
      return activePlayers.length === 0 ? wonderBoards : [];
    } else {
      // In all players mode, show removed boards
      return removedBoards.map(board => board.board);
    }
  };

  const availableBoards = getAvailableBoards();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Logo */}
        <div className="text-center mb-6">
          <img 
            src="/lovable-uploads/6f30e534-6d0f-4334-a430-ee493c2a5143.png" 
            alt="7 Wonders" 
            className="mx-auto h-16 md:h-20 object-contain"
          />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-amber-900 mb-6">
            7 Wonders Digital Scorepad
          </h1>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="all-players">All Players</TabsTrigger>
            <TabsTrigger value="solo">Solo</TabsTrigger>
          </TabsList>

          <TabsContent value="all-players" className="mt-6">
            {/* Control Buttons for All Players */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <Button 
                onClick={toggleExpandAll}
                variant="outline"
                className="flex items-center gap-2"
              >
                {allExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {allExpanded ? 'Collapse All' : 'Expand All'}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Board
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {removedBoards.length === 0 ? (
                    <DropdownMenuItem disabled>
                      No boards removed
                    </DropdownMenuItem>
                  ) : (
                    removedBoards.map(board => (
                      <DropdownMenuItem 
                        key={board.id}
                        onClick={() => addSpecificBoard(board.board)}
                      >
                        {board.board.charAt(0).toUpperCase() + board.board.slice(1)}
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Wonder Boards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedActivePlayers.map(player => (
                <WonderBoard
                  key={player.id}
                  board={player.board}
                  playerName={player.name}
                  wonderSide={player.side}
                  scores={player.scores}
                  onNameChange={(name) => updatePlayerName(player.id, name)}
                  onSideChange={(side) => updatePlayerSide(player.id, side)}
                  onScoreChange={(category, value) => updatePlayerScore(player.id, category, value)}
                  onRemove={() => removePlayer(player.id)}
                  isEmpty={player.name.trim() === ''}
                  forceExpanded={allExpanded}
                />
              ))}
            </div>

            {/* Copy Game Summary Button */}
            {playingPlayers.length > 0 && (
              <div className="flex justify-center mt-8">
                <Button 
                  onClick={copyGameSummary}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy Game Summary
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="solo" className="mt-6">
            {/* Control Buttons for Solo */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {activePlayers.length > 0 && (
                <Button 
                  onClick={toggleExpandAll}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {allExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {allExpanded ? 'Collapse All' : 'Expand All'}
                </Button>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled={activePlayers.length >= 1}
                  >
                    <Plus className="w-4 h-4" />
                    {activePlayers.length === 0 ? 'Add Board' : 'Board Selected'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {availableBoards.length === 0 ? (
                    <DropdownMenuItem disabled>
                      {activePlayers.length >= 1 ? 'Only one board allowed in Solo mode' : 'No boards available'}
                    </DropdownMenuItem>
                  ) : (
                    availableBoards.map(board => (
                      <DropdownMenuItem 
                        key={board}
                        onClick={() => addSpecificBoard(board)}
                      >
                        {board.charAt(0).toUpperCase() + board.slice(1)}
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Solo Wonder Board */}
            {activePlayers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-amber-700 text-lg">Select a wonder board to start</p>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  {sortedActivePlayers.map(player => (
                    <WonderBoard
                      key={player.id}
                      board={player.board}
                      playerName={player.name}
                      wonderSide={player.side}
                      scores={player.scores}
                      onNameChange={(name) => updatePlayerName(player.id, name)}
                      onSideChange={(side) => updatePlayerSide(player.id, side)}
                      onScoreChange={(category, value) => updatePlayerScore(player.id, category, value)}
                      onRemove={() => removePlayer(player.id)}
                      isEmpty={player.name.trim() === ''}
                      forceExpanded={allExpanded}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Copy Game Summary Button for Solo */}
            {playingPlayers.length > 0 && (
              <div className="flex justify-center mt-8">
                <Button 
                  onClick={copyGameSummary}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy Game Summary
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Creator Credit */}
        <div className="text-center text-amber-700 text-sm mt-8 font-medium">
          — Created by Benjamin Menashe —
        </div>
      </div>
    </div>
  );
};

export default Index;
