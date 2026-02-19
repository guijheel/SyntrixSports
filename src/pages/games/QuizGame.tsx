import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const questions = [
  {
    question: "Quel pays a remporté la Coupe du Monde 2022 ?",
    options: ["France", "Argentine", "Brésil", "Croatie"],
    correct: 1
  },
  {
    question: "Combien de joueurs composent une équipe de football sur le terrain ?",
    options: ["9", "10", "11", "12"],
    correct: 2
  },
  {
    question: "Quel joueur détient le record de Ballons d'Or ?",
    options: ["Cristiano Ronaldo", "Lionel Messi", "Michel Platini", "Johan Cruyff"],
    correct: 1
  },
  {
    question: "Dans quel stade se joue la finale de la Ligue des Champions 2024 ?",
    options: ["Wembley", "Allianz Arena", "Santiago Bernabéu", "San Siro"],
    correct: 0
  },
  {
    question: "Quel club a remporté le plus de Ligues des Champions ?",
    options: ["AC Milan", "Bayern Munich", "Real Madrid", "Liverpool"],
    correct: 2
  }
];

const QuizGame = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    setShowResult(true);
    
    if (index === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const saveGameResults = async (finalScore: number) => {
    if (!user || saved) return;
    
    try {
      // Get current stats
      const { data: currentStats } = await supabase
        .from('user_game_stats')
        .select('quiz_games_played, quiz_correct_answers, total_points')
        .eq('user_id', user.id)
        .single();

      const newGamesPlayed = (currentStats?.quiz_games_played || 0) + 1;
      const newCorrectAnswers = (currentStats?.quiz_correct_answers || 0) + finalScore;
      const pointsEarned = finalScore * 10; // 10 points per correct answer
      const newTotalPoints = (currentStats?.total_points || 0) + pointsEarned;

      const { error } = await supabase
        .from('user_game_stats')
        .update({
          quiz_games_played: newGamesPlayed,
          quiz_correct_answers: newCorrectAnswers,
          total_points: newTotalPoints,
        })
        .eq('user_id', user.id);

      if (error) throw error;
      setSaved(true);
      
      toast({
        title: 'Résultats sauvegardés !',
        description: `+${pointsEarned} points ajoutés à votre profil.`,
      });
    } catch (error) {
      console.error('Error saving game results:', error);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      const finalScore = selectedAnswer === questions[currentQuestion].correct ? score : score;
      setGameOver(true);
      saveGameResults(score + (selectedAnswer === questions[currentQuestion].correct ? 1 : 0) - (selectedAnswer === questions[currentQuestion].correct ? 1 : 0));
    }
  };

  // Fix: calculate final score properly when game ends
  const handleGameOver = () => {
    setGameOver(true);
    saveGameResults(score);
  };

  const actualNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setGameOver(true);
      saveGameResults(score);
    }
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setGameOver(false);
    setSaved(false);
  };

  if (gameOver) {
    return (
      <Layout>
        <div className="min-h-screen pt-32 pb-20">
          <div className="container mx-auto px-4 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-elevated p-8 text-center"
            >
              <Trophy className="w-20 h-20 text-gold mx-auto mb-6" />
              <h1 className="font-display text-3xl font-bold mb-4">{t('games.quiz.gameOver')}</h1>
              <p className="text-xl text-muted-foreground mb-2">
                {t('games.quiz.yourScore')}
              </p>
              <p className="text-5xl font-display font-bold text-primary mb-4">
                {score} / {questions.length}
              </p>
              {user && (
                <p className="text-sm text-muted-foreground mb-8">
                  +{score * 10} points ajoutés à votre profil
                </p>
              )}
              <div className="flex gap-4 justify-center">
                <Button onClick={restartGame} className="btn-gradient text-primary-foreground">
                  {t('games.quiz.playAgain')}
                </Button>
                <Link to="/games">
                  <Button variant="outline">{t('games.quiz.backToGames')}</Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <Link to="/games" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            {t('games.quiz.backToGames')}
          </Link>

          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Progress */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-muted-foreground">
                Question {currentQuestion + 1}/{questions.length}
              </span>
              <span className="text-sm font-medium text-primary">
                Score: {score}
              </span>
            </div>

            <div className="w-full bg-muted rounded-full h-2 mb-8">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question */}
            <div className="card-elevated p-8 mb-6">
              <h2 className="font-display text-xl md:text-2xl font-bold text-center">
                {questions[currentQuestion].question}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={!showResult ? { scale: 1.02 } : {}}
                  whileTap={!showResult ? { scale: 0.98 } : {}}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
                    showResult
                      ? index === questions[currentQuestion].correct
                        ? 'bg-success/20 border-2 border-success'
                        : selectedAnswer === index
                        ? 'bg-destructive/20 border-2 border-destructive'
                        : 'bg-muted/50 border-2 border-transparent'
                      : 'bg-muted/50 hover:bg-muted border-2 border-transparent hover:border-primary'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && index === questions[currentQuestion].correct && (
                      <CheckCircle className="w-5 h-5 text-success" />
                    )}
                    {showResult && selectedAnswer === index && index !== questions[currentQuestion].correct && (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Next Button */}
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <Button onClick={actualNextQuestion} className="w-full btn-gradient text-primary-foreground">
                  {currentQuestion < questions.length - 1 ? t('games.quiz.next') : t('games.quiz.seeResults')}
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default QuizGame;
