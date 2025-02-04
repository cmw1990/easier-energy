import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Book, Clock, Brain } from "lucide-react";

const READING_PASSAGES = [
  {
    title: "The Science of Sleep",
    text: "Sleep is essential for cognitive function and overall health. During sleep, the brain processes information from the day and consolidates memories. Research shows that adults need 7-9 hours of quality sleep per night for optimal performance.",
    questions: [
      {
        question: "How many hours of sleep do adults need?",
        options: ["5-6 hours", "6-7 hours", "7-9 hours", "9-10 hours"],
        correct: 2
      },
      {
        question: "What happens during sleep?",
        options: [
          "The brain shuts down completely",
          "The brain processes information and consolidates memories",
          "The body temperature rises",
          "Blood pressure increases"
        ],
        correct: 1
      }
    ]
  },
  {
    title: "The Power of Mindfulness",
    text: "Mindfulness meditation has been practiced for thousands of years. Modern research confirms its benefits for reducing stress, improving focus, and enhancing emotional well-being. Regular practice can lead to measurable changes in brain structure.",
    questions: [
      {
        question: "What are the benefits of mindfulness meditation?",
        options: [
          "Increased stress",
          "Reduced focus",
          "Enhanced emotional well-being",
          "Decreased brain activity"
        ],
        correct: 2
      },
      {
        question: "What can regular mindfulness practice lead to?",
        options: [
          "Changes in brain structure",
          "Decreased emotional control",
          "Reduced memory capacity",
          "Lower cognitive function"
        ],
        correct: 0
      }
    ]
  }
];

const ReadingComprehension = () => {
  const [currentPassage, setCurrentPassage] = useState(0);
  const [showQuestions, setShowQuestions] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setShowQuestions(true);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startReading = () => {
    setIsActive(true);
    setScore(0);
    setTimeLeft(60);
    setShowQuestions(false);
    setAnswers([]);
  };

  const handleAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const submitAnswers = async () => {
    setIsSubmitting(true);
    let correctAnswers = 0;
    const passage = READING_PASSAGES[currentPassage];
    
    passage.questions.forEach((q, index) => {
      if (answers[index] === q.correct) correctAnswers++;
    });
    
    const finalScore = Math.round((correctAnswers / passage.questions.length) * 100);
    setScore(finalScore);

    if (session?.user) {
      try {
        const { error } = await supabase.from("energy_focus_logs").insert({
          user_id: session.user.id,
          activity_type: "reading_comprehension",
          activity_name: "Reading Comprehension",
          duration_minutes: 1,
          focus_rating: finalScore,
          energy_rating: null,
          notes: `Completed reading comprehension with score: ${finalScore}`
        });

        if (error) throw error;

        toast({
          title: "Exercise Complete!",
          description: `You scored ${finalScore}%. ${finalScore >= 70 ? "Great job!" : "Keep practicing!"}`,
        });
      } catch (error) {
        console.error("Error logging reading comprehension:", error);
        toast({
          title: "Error Saving Results",
          description: "There was a problem saving your exercise results.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const nextPassage = () => {
    setCurrentPassage((prev) => (prev + 1) % READING_PASSAGES.length);
    startReading();
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full animate-float">
            <Book className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Reading Comprehension</h2>
        </div>
        <div className="flex items-center gap-4">
          {isActive && !showQuestions && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-lg">{timeLeft}s</span>
            </div>
          )}
          {score > 0 && <div className="text-lg">Score: {score}%</div>}
        </div>
      </div>

      {!isActive ? (
        <Button 
          onClick={startReading} 
          className="w-full animate-pulse"
          disabled={isSubmitting}
        >
          Start Reading
        </Button>
      ) : (
        <div className="space-y-6">
          {!showQuestions ? (
            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-xl font-semibold mb-4">{READING_PASSAGES[currentPassage].title}</h3>
              <p className="text-lg leading-relaxed">{READING_PASSAGES[currentPassage].text}</p>
            </div>
          ) : (
            <div className="space-y-8">
              {READING_PASSAGES[currentPassage].questions.map((q, qIndex) => (
                <div key={qIndex} className="space-y-4">
                  <h4 className="text-lg font-medium">{q.question}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q.options.map((option, oIndex) => (
                      <Button
                        key={oIndex}
                        variant={answers[qIndex] === oIndex ? "default" : "outline"}
                        className="justify-start text-left"
                        onClick={() => handleAnswer(qIndex, oIndex)}
                        disabled={isSubmitting}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex justify-end gap-4">
                <Button
                  onClick={submitAnswers}
                  disabled={answers.length !== READING_PASSAGES[currentPassage].questions.length || isSubmitting}
                  className="animate-pulse"
                >
                  Submit Answers
                </Button>
                {score > 0 && (
                  <Button onClick={nextPassage} disabled={isSubmitting}>
                    Next Passage
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 text-sm text-muted-foreground">
        Read the passage carefully. You'll have 60 seconds before the questions appear.
      </div>
    </Card>
  );
};

export default ReadingComprehension;