
import React from 'react';
import { ScoreCategory } from '@/types/game';

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
  { key: 'debt', name: 'Debt', bgColor: 'bg-gray-600', icon: '⬛' },
  { key: 'city', name: 'City', bgColor: 'bg-gray-900', icon: '🏰' },
];

interface CategoryExpansionProps {
  category: ScoreCategory;
}

export const CategoryExpansion: React.FC<CategoryExpansionProps> = ({ category }) => {
  // This component will be expanded with specific content for each category
  const getCategoryContent = () => {
    switch (category) {
      case 'wonder':
        return (
          <div className="p-3 bg-white border-t">
            <p className="text-sm text-gray-600">
              Points from your Wonder Board stages and effects
            </p>
          </div>
        );
      case 'wealth':
        return (
          <div className="p-3 bg-white border-t">
            <p className="text-sm text-gray-600">
              Each set of 3 coins = 1 victory point
            </p>
          </div>
        );
      case 'military':
        return (
          <div className="p-3 bg-white border-t">
            <p className="text-sm text-gray-600">
              Victory and defeat tokens from military conflicts
            </p>
          </div>
        );
      case 'culture':
        return (
          <div className="p-3 bg-white border-t">
            <p className="text-sm text-gray-600">
              Points from blue civilian structures
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

  return getCategoryContent();
};
