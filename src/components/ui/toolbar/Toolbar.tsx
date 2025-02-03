import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from "@/components/ui/button";
import { Shield, Activity, Brain, Heart, Moon, Coffee, Zap, Target, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Define all available tools
const allTools = [
  { id: 'blocking', icon: Shield, label: 'Block Distractions', route: '/distraction-blocker' },
  { id: 'energy', icon: Activity, label: 'Energy Tracking', route: '/energy' },
  { id: 'focus', icon: Brain, label: 'Focus Mode', route: '/focus' },
  { id: 'mood', icon: Heart, label: 'Mood Tracking', route: '/mood' },
  { id: 'sleep', icon: Moon, label: 'Sleep Tracking', route: '/sleep' },
  { id: 'caffeine', icon: Coffee, label: 'Caffeine Tracking', route: '/caffeine' },
  { id: 'games', icon: Target, label: 'Focus Games', route: '/games' },
  { id: 'breathing', icon: Zap, label: 'Breathing', route: '/breathing' },
  { id: 'schedule', icon: Clock, label: 'Schedule', route: '/schedule' },
];

export const Toolbar = () => {
  const navigate = useNavigate();
  const [tools, setTools] = useState(allTools);
  
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(tools);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setTools(items);
  };

  return (
    <div className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b">
      <div className="container h-14">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="toolbar" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex items-center gap-2 overflow-x-auto h-full px-2 scrollbar-thin scrollbar-thumb-secondary/20 scrollbar-track-transparent hover:scrollbar-thumb-secondary/30 transition-colors"
              >
                {tools.map((tool, index) => (
                  <Draggable key={tool.id} draggableId={tool.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex items-center"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`gap-2 transition-all ${snapshot.isDragging ? 'scale-105 bg-accent/50' : ''}`}
                          onClick={() => navigate(tool.route)}
                        >
                          <tool.icon className="h-4 w-4" />
                          {tool.label}
                        </Button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};