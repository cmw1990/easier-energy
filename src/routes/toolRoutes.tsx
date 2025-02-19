
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
import SpeedMath from "@/pages/tools/SpeedMath";
import VerbalFluency from "@/pages/tools/VerbalFluency";
import SpatialMemory from "@/pages/tools/SpatialMemory";
import SymbolMatching from "@/pages/tools/SymbolMatching";
import DecisionMaking from "@/pages/tools/DecisionMaking";
import RhythmMemory from "@/pages/tools/RhythmMemory";
import PictureMemory from "@/pages/tools/PictureMemory";
import VisualSearch from "@/pages/tools/VisualSearch";

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
      path: "speed-math",
      element: <SpeedMath />,
    },
    {
      path: "verbal-fluency",
      element: <VerbalFluency />,
    },
    {
      path: "spatial-memory",
      element: <SpatialMemory />,
    },
    {
      path: "symbol-matching",
      element: <SymbolMatching />,
    },
    {
      path: "decision-making",
      element: <DecisionMaking />,
    },
    {
      path: "rhythm-memory",
      element: <RhythmMemory />,
    },
    {
      path: "picture-memory",
      element: <PictureMemory />,
    },
    {
      path: "visual-search",
      element: <VisualSearch />,
    },
  ],
};
