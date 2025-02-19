
import { RouteObject } from "react-router-dom";
import WordScramble from "@/pages/tools/WordScramble";
import ColorMatch from "@/pages/tools/ColorMatch";
import BrainMatch3 from "@/pages/tools/BrainMatch3";
import MemoryCards from "@/pages/tools/MemoryCards";
import MentalRotation from "@/pages/tools/MentalRotation";
import SequenceMemory from "@/pages/tools/SequenceMemory";
import NBackGame from "@/pages/tools/NBackGame";

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
  ],
};
