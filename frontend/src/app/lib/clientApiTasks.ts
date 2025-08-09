import { toast } from "sonner";

export async function moveTask(id: string, category: string) {
    const r = await fetch(`/api/tasks/${id}/move`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category }),
    });
    if (!r.ok) {
      toast.error((await r.text()) || 'Erreur changement catégorie');
      return false;
    }
    toast.success('Catégorie mise à jour');
    return true;
  }
  
  export async function addCompletedTask(dto: any) {
    const r = await fetch(`/api/tasks/completed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (!r.ok) {
      toast.error((await r.text()) || 'Erreur ajout tâche terminée');
      return false;
    }
    toast.success('Tâche terminée ajoutée');
    return true;
  }
  