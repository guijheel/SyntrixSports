import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Tip {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  read_time: string;
  featured: boolean;
}

export const TipsTab = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTip, setEditingTip] = useState<Tip | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    read_time: '5 min',
    featured: false,
  });

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    try {
      const { data, error } = await supabase
        .from('tips')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTips(data || []);
    } catch (error) {
      console.error('Error fetching tips:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const tipData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        read_time: formData.read_time,
        featured: formData.featured,
        created_by: user?.id,
      };

      if (editingTip) {
        const { error } = await supabase
          .from('tips')
          .update(tipData)
          .eq('id', editingTip.id);
        if (error) throw error;
        toast({ title: t('admin.tipUpdated') });
      } else {
        const { error } = await supabase
          .from('tips')
          .insert(tipData);
        if (error) throw error;
        toast({ title: t('admin.tipCreated') });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchTips();
    } catch (error) {
      console.error('Error saving tip:', error);
      toast({ title: t('admin.error'), variant: 'destructive' });
    }
  };

  const handleEdit = (tip: Tip) => {
    setEditingTip(tip);
    setFormData({
      title: tip.title,
      slug: tip.slug,
      excerpt: tip.excerpt,
      content: tip.content,
      category: tip.category,
      read_time: tip.read_time,
      featured: tip.featured,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.confirmDelete'))) return;
    
    try {
      const { error } = await supabase
        .from('tips')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast({ title: t('admin.tipDeleted') });
      fetchTips();
    } catch (error) {
      console.error('Error deleting tip:', error);
      toast({ title: t('admin.error'), variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setEditingTip(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: '',
      read_time: '5 min',
      featured: false,
    });
  };

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-semibold">{t('admin.manageTips')}</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="btn-gradient">
              <Plus className="w-4 h-4 mr-2" />
              {t('admin.addTip')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTip ? t('admin.editTip') : t('admin.addTip')}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">{t('admin.tipTitle')}</label>
                <Input
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ 
                      ...formData, 
                      title: e.target.value,
                      slug: generateSlug(e.target.value)
                    });
                  }}
                  placeholder="Titre de l'article"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">{t('admin.category')}</label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Stratégie, Gestion, Analyse..."
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">{t('admin.readTime')}</label>
                  <Input
                    value={formData.read_time}
                    onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                    placeholder="5 min"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">{t('admin.excerpt')}</label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Résumé court de l'article..."
                  rows={2}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">{t('admin.content')}</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Contenu complet de l'article (supporte le Markdown)..."
                  rows={10}
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="featured" className="text-sm font-medium flex items-center gap-1">
                  <Star className="w-4 h-4 text-gold" />
                  {t('admin.featuredArticle')}
                </label>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t('admin.cancel')}
                </Button>
                <Button type="submit" className="btn-gradient">
                  {editingTip ? t('admin.update') : t('admin.create')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {tips.map((tip) => (
          <div key={tip.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {tip.featured && <Star className="w-4 h-4 text-gold fill-gold" />}
                <h3 className="font-medium">{tip.title}</h3>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded">{tip.category}</span>
                <span>{tip.read_time}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(tip)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(tip.id)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
        {tips.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {t('admin.noTips')}
          </div>
        )}
      </div>
    </div>
  );
};
