import { Card } from '@/components/ui/card';

interface CapturedPiecesProps {
  pieces: { type: string; color: string }[];
  title: string;
}

export const CapturedPieces = ({ pieces, title }: CapturedPiecesProps) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {pieces.map((piece, index) => (
          <span
            key={index}
            className={`text-xl ${
              piece.color === 'black' ? 'text-gray-900' : 'text-red-600'
            }`}
          >
            {piece.type}
          </span>
        ))}
      </div>
    </Card>
  );
};