'use client';

import { toast } from 'sonner';

export async function createTask(dto: {
  title: string;
  description?: string;
  category: 'TODAY' | 'EVENING' | 'TOMORROW' | 'SOMEDAY';
  status: 'PLANNED' | 'IN_PROGRESS' | 'DONE';
}) {
  const r = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, // optionnel (ton proxy remet aussi)
    body: JSON.stringify(dto),
  });

  const data = await r.json().catch(() => null);

  if (!r.ok) {
    toast.error((data?.message as string) || 'Erreur lors de la création');
    throw new Error(data?.message || 'CreateTask failed');
  }

  toast.success('Tâche créée');
  return data; // la tâche créée renvoyée par ton backend
}

export async function loadTasks() {
  const r = await fetch('/api/tasks', { method: 'GET', cache: 'no-store' });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
