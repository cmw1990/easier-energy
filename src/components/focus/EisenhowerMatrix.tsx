import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { AlertTriangle, ArrowRight, Brain, Clock } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description?: string;
  urgency_level: number;
  importance_level: number;
  quadrant: number;
  energy_required?: number;
}

export const EisenhowerMatrix = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [tasks, setTasks] = useState<Task[]>([]);

  const { data: taskData } = useQuery({
    queryKey: ['tasks-with-priority'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          task_prioritization (
            urgency_level,
            importance_level,
            quadrant,
            energy_required
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const updateTaskQuadrant = useMutation({
    mutationFn: async ({ taskId, quadrant }: { taskId: string; quadrant: number }) => {
      const { error } = await supabase
        .from('task_prioritization')
        .update({ quadrant })
        .eq('task_id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks-with-priority'] });
      toast({
        title: "Task updated",
        description: "Task priority has been updated successfully.",
      });
    },
  });

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceQuadrant = parseInt(result.source.droppableId);
    const destinationQuadrant = parseInt(result.destination.droppableId);
    const taskId = result.draggableId;

    if (sourceQuadrant !== destinationQuadrant) {
      updateTaskQuadrant.mutate({ taskId, quadrant: destinationQuadrant });
    }
  };

  const getQuadrantTasks = (quadrant: number) => {
    return tasks.filter(task => task.quadrant === quadrant);
  };

  useEffect(() => {
    if (taskData) {
      const formattedTasks = taskData.map((task: any) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        urgency_level: task.task_prioritization?.[0]?.urgency_level || 3,
        importance_level: task.task_prioritization?.[0]?.importance_level || 3,
        quadrant: task.task_prioritization?.[0]?.quadrant || 4,
        energy_required: task.task_prioritization?.[0]?.energy_required
      }));
      setTasks(formattedTasks);
    }
  }, [taskData]);

  const quadrantStyles = {
    1: "bg-red-50 dark:bg-red-900/20",
    2: "bg-orange-50 dark:bg-orange-900/20",
    3: "bg-yellow-50 dark:bg-yellow-900/20",
    4: "bg-green-50 dark:bg-green-900/20",
  };

  const quadrantTitles = {
    1: "Urgent & Important",
    2: "Important, Not Urgent",
    3: "Urgent, Not Important",
    4: "Neither Urgent Nor Important",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Eisenhower Matrix
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((quadrant) => (
              <Droppable key={quadrant} droppableId={quadrant.toString()}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-4 rounded-lg ${quadrantStyles[quadrant as keyof typeof quadrantStyles]}`}
                  >
                    <h3 className="font-semibold mb-3">{quadrantTitles[quadrant as keyof typeof quadrantTitles]}</h3>
                    <div className="space-y-2">
                      {getQuadrantTasks(quadrant).map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white dark:bg-gray-800 p-3 rounded shadow-sm"
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium">{task.title}</p>
                                  {task.description && (
                                    <p className="text-sm text-muted-foreground">{task.description}</p>
                                  )}
                                </div>
                                {task.energy_required && (
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Brain className="h-4 w-4" />
                                    <span>{task.energy_required}/5</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </CardContent>
    </Card>
  );
};