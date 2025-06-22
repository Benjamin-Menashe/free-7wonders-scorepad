
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ChevronUp, ChevronDown, Plus, Copy, Trash2, RotateCcw, ArrowUpDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePageProtection } from '@/hooks/usePageProtection';
import WonderBoard from '@/components/WonderBoard';
import { WonderBoard as WonderBoardType, WonderSide, ScoreCategory } from '@/types/game';
import { calculateTotalScore, getWinner } from '@/utils/scoreCalculator';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface PlayerData {
  id: string;
  name: string;
  board: WonderBoardType;
  side: WonderSide;
  scores: Record<ScoreCategory, number>;
  isActive: boolean;
  resetKey?: number;
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

  // Check if there's unsaved game data for page protection
  const hasUnsavedData = allPlayersData.some(p => p.isActive && (p.name.trim() !== '' || Object.values(p.scores).some(score => score > 0))) ||
                        soloPlayerData.some(p => p.name.trim() !== '' || Object.values(p.scores).some(score => score > 0));
  
  usePageProtection(hasUnsavedData);

  // Initialize with 7 empty boards for "All Players" mode
  useEffect(() => {
    const initialPlayers: PlayerData[] = Array.from({ length: 7 }, (_, index) => ({
      id: `player-${index}`,
      name: '',
      board: 'alexandria', // Default to first board, but will be selectable
      side: 'day' as WonderSide,
      scores: createEmptyScores(),
      isActive: true,
      resetKey: 0,
    }));
    setAllPlayersData(initialPlayers);
  }, []);

  // Add global event listener for Enter key on number inputs
  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (event.key === 'Enter' && target.tagName === 'INPUT' && target.getAttribute('type') === 'number') {
        target.blur(); // This will save the input and exit typing mode
        event.preventDefault();
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
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

  const updatePlayerBoard = (playerId: string, board: WonderBoardType) => {
    setCurrentPlayers(getCurrentPlayers().map(p => 
      p.id === playerId ? { ...p, board } : p
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
      setSoloPlayerData([]);
    } else {
      setCurrentPlayers(getCurrentPlayers().map(p => 
        p.id === playerId ? { ...p, isActive: false } : p
      ));
    }
  };

  const addAllBoards = () => {
    if (activeTab === 'all-players') {
      setAllPlayersData(allPlayersData.map(p => ({ ...p, isActive: true })));
      toast({
        title: "All boards added",
        description: "All wonder boards have been activated.",
        duration: 1000,
      });
    }
  };

  const addSpecificBoard = (boardType: WonderBoardType) => {
    const currentPlayers = getCurrentPlayers();
    
    if (activeTab === 'solo') {
      const newPlayer: PlayerData = {
        id: `solo-player-${Date.now()}`,
        name: currentPlayers.length > 0 ? currentPlayers[0].name : '',
        board: boardType,
        side: currentPlayers.length > 0 ? currentPlayers[0].side : 'day' as WonderSide,
        scores: currentPlayers.length > 0 ? currentPlayers[0].scores : createEmptyScores(),
        isActive: true,
      };
      setSoloPlayerData([newPlayer]);
    } else {
      setCurrentPlayers(currentPlayers.map(p => 
        p.board === boardType ? { ...p, isActive: true } : p
      ));
    }
  };

  const startNewGame = () => {
    const currentResetKey = Date.now();
    
    if (activeTab === 'all-players') {
      const initialPlayers: PlayerData[] = Array.from({ length: 7 }, (_, index) => ({
        id: `player-${index}`,
        name: '',
        board: 'alexandria',
        side: 'day' as WonderSide,
        scores: createEmptyScores(),
        isActive: true,
        resetKey: currentResetKey,
      }));
      setAllPlayersData(initialPlayers);
    } else {
      setSoloPlayerData([]);
    }
    
    toast({
      title: "New game started",
      description: "All scores have been reset and boards cleared.",
      duration: 1000,
    });
  };

  const toggleExpandAll = () => {
    setAllExpanded(!allExpanded);
  };

  const copyGameSummary = (includeDetails: boolean = false) => {
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
      
      if (includeDetails) {
        summary += `\nDetailed Scores:\n`;
        sortedPlayers.forEach(player => {
          summary += `\n${player.name} (${player.board.charAt(0).toUpperCase() + player.board.slice(1)}):\n`;
          summary += `🔶 Wonder: ${player.scores.wonder} | 🪙 Wealth: ${player.scores.wealth} | ⚔️ Military: ${player.scores.military}\n`;
          summary += `🏛️ Culture: ${player.scores.culture} | 🏺 Commerce: ${player.scores.commerce} | 📖 Science: ${player.scores.science} | 👥 Guilds: ${player.scores.guilds}\n`;
        });
      }
    }

    summary += `\n--- Created with 7 Wonders Digital Scorepad by Benjamin Menashe ---\n`;
    summary += `https://free-7wonders-scorepad.lovable.app/`;

    navigator.clipboard.writeText(summary).then(() => {
      const summaryType = includeDetails ? 'Detailed game summary' : 'Game summary';
      toast({
        title: `${summaryType} copied!`,
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

  const removeEmptyBoards = () => {
    if (activeTab === 'all-players') {
      const emptyBoardsCount = allPlayersData.filter(p => p.isActive && p.name.trim() === '').length;
      
      if (emptyBoardsCount === 0) {
        toast({
          title: "No empty boards",
          description: "All active boards have player names.",
          duration: 1000,
        });
        return;
      }

      setAllPlayersData(allPlayersData.map(p => 
        p.isActive && p.name.trim() === '' ? { ...p, isActive: false } : p
      ));

      toast({
        title: "Empty boards removed",
        description: `Removed ${emptyBoardsCount} empty board${emptyBoardsCount > 1 ? 's' : ''}.`,
        duration: 1000,
      });
    }
  };

  const resetScores = () => {
    const currentResetKey = Date.now();
    
    if (activeTab === 'all-players') {
      setAllPlayersData(allPlayersData.map(p => ({
        ...p,
        scores: createEmptyScores(),
        resetKey: currentResetKey,
      })));
    } else {
      setSoloPlayerData(soloPlayerData.map(p => ({
        ...p,
        scores: createEmptyScores(),
        resetKey: currentResetKey,
      })));
    }
    
    toast({
      title: "Scores reset",
      description: "All scores have been reset to zero.",
      duration: 1000,
    });
  };

  const sortPlayersByScore = () => {
    if (activeTab === 'all-players') {
      const sortedPlayers = [...allPlayersData].sort((a, b) => {
        if (!a.isActive && !b.isActive) return 0;
        if (!a.isActive) return 1;
        if (!b.isActive) return -1;
        return calculateTotalScore(b.scores) - calculateTotalScore(a.scores);
      });
      setAllPlayersData(sortedPlayers);
      toast({
        title: "Players sorted",
        description: "Players have been sorted by score (highest to lowest).",
        duration: 1000,
      });
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || activeTab !== 'all-players' || allExpanded) {
      return;
    }

    const items = Array.from(allPlayersData);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setAllPlayersData(items);
  };

  // Get available boards for dropdown (excluding already used boards)
  const getAvailableBoards = (currentBoard?: WonderBoardType) => {
    if (activeTab === 'solo') {
      return wonderBoards;
    } else {
      const usedBoards = allPlayersData
        .filter(p => p.isActive && p.board !== currentBoard)
        .map(p => p.board);
      return wonderBoards.filter(board => !usedBoards.includes(board));
    }
  };

  const players = getCurrentPlayers();
  const activePlayers = players.filter(p => p.isActive);
  const playingPlayers = activePlayers.filter(p => p.name.trim() !== '');
  const removedBoards = players.filter(p => !p.isActive);
  
  // For solo mode, sort by score. For all players mode, use manual order
  const displayPlayers = activeTab === 'solo' 
    ? activePlayers.sort((a, b) => calculateTotalScore(b.scores) - calculateTotalScore(a.scores))
    : activePlayers;

  // Get available boards for dropdown
  const availableBoards = activeTab === 'solo' ? (activePlayers.length === 0 ? wonderBoards : []) : removedBoards.map(board => board.board);

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
            {/* Top Control Buttons for All Players */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <Button 
                onClick={toggleExpandAll}
                variant="outline"
                className="flex items-center gap-2"
              >
                {allExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {allExpanded ? 'Collapse All' : 'Expand All'}
              </Button>

              <Button 
                onClick={sortPlayersByScore}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowUpDown className="w-4 h-4" />
                Sort
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2 bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
                  >
                    <RotateCcw className="w-4 h-4" />
                    New Game
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Start a New Game?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Choose how you want to reset the game. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={resetScores}
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      Reset Scores Only
                    </AlertDialogAction>
                    <AlertDialogAction onClick={startNewGame}>
                      Complete Reset
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {/* Wonder Boards Grid with Drag and Drop */}
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="wonder-boards">
                {(provided) => (
                  <div 
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  >
                    {displayPlayers.map((player, index) => (
                      <Draggable 
                        key={player.id} 
                        draggableId={player.id} 
                        index={index}
                        isDragDisabled={allExpanded}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={snapshot.isDragging ? 'z-50' : ''}
                            style={{
                              ...provided.draggableProps.style,
                            }}
                          >
                            <WonderBoard
                              key={`${player.id}-${player.resetKey}`}
                              board={player.board}
                              playerName={player.name}
                              wonderSide={player.side}
                              scores={player.scores}
                              onNameChange={(name) => updatePlayerName(player.id, name)}
                              onBoardChange={(board) => updatePlayerBoard(player.id, board)}
                              onSideChange={(side) => updatePlayerSide(player.id, side)}
                              onScoreChange={(category, value) => updatePlayerScore(player.id, category, value)}
                              onRemove={() => removePlayer(player.id)}
                              isEmpty={player.name.trim() === ''}
                              forceExpanded={allExpanded}
                              availableBoards={getAvailableBoards(player.board)}
                              showBoardSelector={true}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {/* Bottom Control Buttons for All Players */}
            <div className="flex justify-between items-center gap-3 mt-6">
              <Button 
                onClick={removeEmptyBoards}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Remove Empty Boards
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline"
                    size="sm"
                    className={`flex items-center gap-2 ${removedBoards.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={removedBoards.length === 0}
                  >
                    <Plus className="w-4 h-4" />
                    Add Boards
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={addAllBoards}>
                    Add All Boards
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled className="text-xs font-semibold">
                    Or select specific:
                  </DropdownMenuItem>
                  {removedBoards.map(board => (
                    <DropdownMenuItem 
                      key={board.id}
                      onClick={() => addSpecificBoard(board.board)}
                    >
                      {board.board.charAt(0).toUpperCase() + board.board.slice(1)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {playingPlayers.length > 0 && (
              <div className="flex justify-center gap-2 sm:gap-3 mt-8 bg-gray-100 p-3 rounded-lg">
                <Button 
                  onClick={() => copyGameSummary(false)}
                  variant="outline"
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4"
                >
                  <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                  Summary
                </Button>
                <Button 
                  onClick={() => copyGameSummary(true)}
                  variant="outline"
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4"
                >
                  <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                  Details
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="solo" className="mt-6">
            {/* Top Control Buttons for Solo */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <Button 
                onClick={toggleExpandAll}
                variant="outline"
                className="flex items-center gap-2"
              >
                {allExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {allExpanded ? 'Collapse All' : 'Expand All'}
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2 bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
                  >
                    <RotateCcw className="w-4 h-4" />
                    New Game
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Start a New Game?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Choose how you want to reset the game. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={resetScores}
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      Reset Scores Only
                    </AlertDialogAction>
                    <AlertDialogAction onClick={startNewGame}>
                      Complete Reset
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {activePlayers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-amber-700 text-lg">Select a wonder board to start</p>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  {displayPlayers.map(player => (
                    <WonderBoard
                      key={`${player.id}-${player.resetKey}`}
                      board={player.board}
                      playerName={player.name}
                      wonderSide={player.side}
                      scores={player.scores}
                      onNameChange={(name) => updatePlayerName(player.id, name)}
                      onBoardChange={(board) => updatePlayerBoard(player.id, board)}
                      onSideChange={(side) => updatePlayerSide(player.id, side)}
                      onScoreChange={(category, value) => updatePlayerScore(player.id, category, value)}
                      onRemove={() => removePlayer(player.id)}
                      isEmpty={player.name.trim() === ''}
                      forceExpanded={allExpanded}
                      availableBoards={getAvailableBoards()}
                      showBoardSelector={false}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    {activePlayers.length === 0 ? 'Add Board' : 'Change Board'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {wonderBoards.map(board => (
                    <DropdownMenuItem 
                      key={board}
                      onClick={() => addSpecificBoard(board)}
                      disabled={activePlayers.length > 0 && activePlayers[0].board === board}
                    >
                      {board.charAt(0).toUpperCase() + board.slice(1)}
                      {activePlayers.length > 0 && activePlayers[0].board === board && ' (Current)'}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {playingPlayers.length > 0 && (
              <div className="flex justify-center mt-8 bg-gray-100 p-3 rounded-lg">
                <Button 
                  onClick={() => copyGameSummary(false)}
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
