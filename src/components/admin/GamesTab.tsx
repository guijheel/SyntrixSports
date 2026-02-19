import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
}

export const GamesTab = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  
  const [formData, setFormData] = useState({
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correctAnswer: '0',
    category: 'football',
  });

  useEffect(() => {
    // Load saved questions from localStorage (or could be a DB table)
    const saved = localStorage.getItem('admin_quiz_questions');
    if (saved) {
      try {
        setQuizQuestions(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const saveQuestions = (questions: QuizQuestion[]) => {
    setQuizQuestions(questions);
    localStorage.setItem('admin_quiz_questions', JSON.stringify(questions));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newQuestion: QuizQuestion = {
      question: formData.question,
      options: [formData.option1, formData.option2, formData.option3, formData.option4],
      correctAnswer: parseInt(formData.correctAnswer),
      category: formData.category,
    };

    const updated = [...quizQuestions, newQuestion];
    saveQuestions(updated);
    toast({ title: 'Question ajoutée avec succès' });
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (index: number) => {
    const updated = quizQuestions.filter((_, i) => i !== index);
    saveQuestions(updated);
    toast({ title: 'Question supprimée' });
  };

  const resetForm = () => {
    setFormData({
      question: '', option1: '', option2: '', option3: '', option4: '',
      correctAnswer: '0', category: 'football',
    });
  };

  return (
    <div className="space-y-6">
      <div className="card-elevated p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-primary" />
            Gestion des questions de quiz
          </h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-gradient">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Nouvelle question de quiz</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Question</label>
                  <Textarea
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    placeholder="Quel joueur a marqué le plus de buts en Ligue des Champions ?"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Catégorie</label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="football">Football</SelectItem>
                      <SelectItem value="basketball">Basketball</SelectItem>
                      <SelectItem value="tennis">Tennis</SelectItem>
                      <SelectItem value="general">Culture sport</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {[1, 2, 3, 4].map((n) => (
                  <div key={n}>
                    <label className="text-sm font-medium">Option {n}</label>
                    <Input
                      value={formData[`option${n}` as keyof typeof formData]}
                      onChange={(e) => setFormData({ ...formData, [`option${n}`]: e.target.value })}
                      placeholder={`Réponse ${n}`}
                      required
                    />
                  </div>
                ))}
                <div>
                  <label className="text-sm font-medium">Bonne réponse</label>
                  <Select value={formData.correctAnswer} onValueChange={(v) => setFormData({ ...formData, correctAnswer: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Option 1</SelectItem>
                      <SelectItem value="1">Option 2</SelectItem>
                      <SelectItem value="2">Option 3</SelectItem>
                      <SelectItem value="3">Option 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                  <Button type="submit" className="btn-gradient">Ajouter</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          {quizQuestions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune question de quiz personnalisée. Ajoutez-en pour enrichir l'expérience de jeu !
            </div>
          ) : (
            quizQuestions.map((q, index) => (
              <div key={index} className="bg-muted/50 rounded-lg p-4 flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium mb-1">{q.question}</div>
                  <div className="text-xs text-muted-foreground space-x-2">
                    {q.options.map((opt, i) => (
                      <span key={i} className={i === q.correctAnswer ? 'text-success font-semibold' : ''}>
                        {i === q.correctAnswer ? '✅' : '○'} {opt}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full mt-1 inline-block">
                    {q.category}
                  </span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(index)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
