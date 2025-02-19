
import { RouteObject } from "react-router-dom";
import WordScramble from "@/pages/tools/WordScramble";
import ColorMatch from "@/pages/tools/ColorMatch";
import BrainMatch3 from "@/pages/tools/BrainMatch3";
import MemoryCards from "@/pages/tools/MemoryCards";
import MentalRotation from "@/pages/tools/MentalRotation";
import SequenceMemory from "@/pages/tools/SequenceMemory";
import NBackGame from "@/pages/tools/NBackGame";
import DualNBack from "@/pages/tools/DualNBack";
import PatternRecognition from "@/pages/tools/PatternRecognition";
import ReactionTime from "@/pages/tools/ReactionTime";
import StroopTest from "@/pages/tools/StroopTest";
import LogicPuzzles from "@/pages/tools/LogicPuzzles";
import ReadingComprehension from "@/pages/tools/ReadingComprehension";
import MathSpeed from "@/pages/tools/MathSpeed";
import VisualMemory from "@/pages/tools/VisualMemory";
import WordAssociation from "@/pages/tools/WordAssociation";

export const toolRoutes: RouteObject = {
  path: "tools",
  children: [
    {
      path: "word-scramble",
      element: <WordScramble />,
    },
    {
      path: "color-match",
      element: <ColorMatch />,
    },
    {
      path: "brain-match",
      element: <BrainMatch3 />,
    },
    {
      path: "memory-cards",
      element: <MemoryCards />,
    },
    {
      path: "mental-rotation",
      element: <MentalRotation />,
    },
    {
      path: "sequence-memory",
      element: <SequenceMemory />,
    },
    {
      path: "n-back",
      element: <NBackGame />,
    },
    {
      path: "dual-n-back",
      element: <DualNBack />,
    },
    {
      path: "pattern-recognition",
      element: <PatternRecognition />,
    },
    {
      path: "reaction-time",
      element: <ReactionTime />,
    },
    {
      path: "stroop-test",
      element: <StroopTest />,
    },
    {
      path: "logic-puzzles",
      element: <LogicPuzzles />,
    },
    {
      path: "reading-comprehension",
      element: <ReadingComprehension />,
    },
    {
      path: "math-speed",
      element: <MathSpeed />,
    },
    {
      path: "visual-memory",
      element: <VisualMemory />,
    },
    {
      path: "word-association",
      element: <WordAssociation />,
    },
  ],
};
