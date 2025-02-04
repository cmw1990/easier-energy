import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';

const GamesSection = () => {
  const games = [
    {
      title: 'Chess',
      description: 'Classic chess game with AI opponent',
      path: '/games/chess'
    },
    {
      title: 'Go',
      description: 'Ancient board game of territory control',
      path: '/games/go'
    },
    {
      title: 'Checkers',
      description: 'Traditional checkers game',
      path: '/games/checkers'
    },
    {
      title: 'Reversi',
      description: 'Strategic board game also known as Othello',
      path: '/games/reversi'
    },
    {
      title: 'Xiangqi',
      description: 'Chinese Chess',
      path: '/games/xiangqi'
    },
    {
      title: 'Shogi',
      description: 'Japanese Chess',
      path: '/games/shogi'
    },
    {
      title: 'Gomoku',
      description: 'Five in a row game',
      path: '/games/gomoku'
    },
    {
      title: 'Connect Four',
      description: 'Classic connection game',
      path: '/games/connect-four'
    },
    {
      title: 'Tic Tac Toe',
      description: 'Simple but strategic game',
      path: '/games/tic-tac-toe'
    },
    {
      title: 'Pattern Recognition',
      description: 'Test your pattern recognition skills',
      path: '/games/pattern-recognition'
    },
    {
      title: 'Brain Match',
      description: 'Match pairs to test your memory',
      path: '/games/brain-match'
    },
    {
      title: 'N-Back',
      description: 'Test your working memory',
      path: '/games/n-back'
    },
    {
      title: 'Stroop Test',
      description: 'Test your mental flexibility',
      path: '/games/stroop-test'
    },
    {
      title: 'Digit Span',
      description: 'Test your number memory',
      path: '/games/digit-span'
    },
    {
      title: 'Mental Rotation',
      description: 'Test your spatial reasoning abilities',
      path: '/games/mental-rotation'
    },
    {
      title: 'Word Pairs',
      description: 'Memory game with word associations',
      path: '/games/word-pairs'
    }
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Brain Training Games</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game) => (
          <Link key={game.path} to={game.path}>
            <Card className="p-4 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold">{game.title}</h2>
              <p className="text-gray-600">{game.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GamesSection;