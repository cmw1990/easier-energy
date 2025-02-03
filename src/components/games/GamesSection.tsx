import { Card } from "@/components/ui/card";
import { Brain, Gamepad, Puzzle, Zap, Flower2, Music, Cloud, Waves } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const GamesSection = () => {
  const navigate = useNavigate();

  const games = [
    {
      title: "Memory Cards",
      description: "Test and improve your memory with this classic card matching game",
      icon: Brain,
      route: "/games/memory-cards"
    },
    {
      title: "Color Match",
      description: "Challenge your focus with quick color matching decisions",
      icon: Zap,
      route: "/games/color-match"
    },
    {
      title: "Pattern Match",
      description: "Enhance pattern recognition with sequence memorization",
      icon: Puzzle,
      route: "/games/pattern-match"
    },
    {
      title: "Math Speed",
      description: "Boost mental arithmetic in a relaxing environment",
      icon: Brain,
      route: "/games/math-speed"
    },
    {
      title: "Simon Says",
      description: "Follow the pattern in this classic memory game",
      icon: Gamepad,
      route: "/games/simon-says"
    },
    {
      title: "Word Scramble",
      description: "Unscramble words to improve cognitive flexibility",
      icon: Puzzle,
      route: "/games/word-scramble"
    },
    {
      title: "Sequence Memory",
      description: "Remember and repeat growing sequences",
      icon: Brain,
      route: "/games/sequence-memory"
    },
    {
      title: "Visual Memory",
      description: "Train your visual memory with grid patterns",
      icon: Puzzle,
      route: "/games/visual-memory"
    },
    {
      title: "Speed Typing",
      description: "Practice typing while staying calm and focused",
      icon: Zap,
      route: "/games/speed-typing"
    }
  ];

  return (
    <Card className="p-6 bg-primary/5 border-2 border-primary/20 shadow-lg">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="p-4 bg-primary/10 rounded-full">
          <Gamepad className="h-12 w-12 text-primary animate-pulse" />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-2">Focus Games</h2>
          <p className="text-muted-foreground mb-6">
            Improve your focus and reduce stress with these engaging games
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {games.map((game) => (
            <Card
              key={game.route}
              className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => navigate(game.route)}
            >
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-3 bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
                  <game.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{game.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {game.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
};