import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from "@/components/ui/button";
import { Shield, Activity, Brain, Heart, Moon, Coffee, Zap, Target, Clock, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

// Default tools to show in the toolbar
const defaultToolIds = ['blocking', 'energy', 'focus', 'mood'];

export const Toolbar = () => {
  const navigate = useNavigate();
  const [visibleTools, setVisibleTools] = useState(() => 
    allTools.filter(tool => defaultToolIds.includes(tool.id))
  );
  
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(visibleTools);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setVisibleTools(items);
  };

  const handleToolAdd = (tool: typeof allTools[0]) => {
    if (!visibleTools.find(t => t.id === tool.id)) {
      setVisibleTools([...visibleTools, tool]);
    }
  };

  const handleToolRemove = (toolId: string) => {
    setVisibleTools(tools => tools.filter(t => t.id !== toolId));
  };

  return (
    <div className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b">
      <div className="container flex h-14 items-center gap-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="toolbar" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex items-center gap-2 overflow-x-auto"
              >
                {visibleTools.map((tool, index) => (
                  <Draggable key={tool.id} draggableId={tool.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex items-center"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2 group relative"
                          onClick={() => navigate(tool.route)}
                        >
                          <tool.icon className="h-4 w-4" />
                          {tool.label}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 absolute -right-1 -top-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToolRemove(tool.id);
                            }}
                          >
                            ×
                          </Button>
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <ChevronDown className="h-4 w-4 mr-2" />
              More Tools
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            {allTools
              .filter(tool => !visibleTools.find(t => t.id === tool.id))
              .map(tool => (
                <DropdownMenuItem
                  key={tool.id}
                  onClick={() => handleToolAdd(tool)}
                  className="gap-2 cursor-pointer"
                >
                  <tool.icon className="h-4 w-4" />
                  {tool.label}
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};