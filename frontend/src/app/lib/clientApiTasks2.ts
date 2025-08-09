'use client';
import { toast } from 'sonner';
import { Category, Task } from '../lib/types';

export async function deleteTask(id: string) {
  const r = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
  if (!r.ok) {
    toast.error((await r.text()) || 'Erreur lors de la suppression');
    return false;
  }
  toast.success('Tâche supprimée');
  return true;
}

export async function startTask(id: string) {
  const r = await fetch(`/api/tasks/${id}/start`, { method: 'PATCH' });
  if (!r.ok) {
    toast.error((await r.text()) || 'Erreur au démarrage');
    return false;
  }
  toast.success('Tâche démarrée');
  return true;
}

export async function stopTask(id: string) {
  const r = await fetch(`/api/tasks/${id}/stop`, { method: 'PATCH' });
  if (!r.ok) {
    toast.error((await r.text()) || 'Erreur à l’arrêt');
    return false;
  }
  toast.success('Tâche arrêtée');
  return true;
}
