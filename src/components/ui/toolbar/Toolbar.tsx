import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from "@/components/ui/button";
import { Shield, Activity, Brain, Heart, ChevronDown } from "lucide-react";
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
];

// Default tools to show in the toolbar
const defaultToolIds = ['blocking', 'energy', 'focus'];

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

  return (
    <div className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b">
      <div className="container flex h-14 items-center gap-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="toolbar" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex items-center gap-2"
              >
                {visibleTools.map((tool, index) => (
                  <Draggable key={tool.id} draggableId={tool.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2"
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <ChevronDown className="h-4 w-4" />
              More Tools
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {allTools
              .filter(tool => !visibleTools.find(t => t.id === tool.id))
              .map(tool => (
                <DropdownMenuItem
                  key={tool.id}
                  onClick={() => handleToolAdd(tool)}
                  className="gap-2"
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