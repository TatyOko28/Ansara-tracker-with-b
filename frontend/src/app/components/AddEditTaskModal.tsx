'use client';

import React, { useMemo, useState } from 'react';
import { Category, Task } from '../lib/types';
import { toast } from 'sonner';

interface Props {
  initial?: Task; // si présent => mode édition
  onSubmit?: (task: Task) => void; // callback local optionnel
  onClose: () => void;
}

export default function AddEditTaskModal({ initial, onSubmit, onClose }: Props) {
  const [text, setText] = useState(initial?.text || '');
  const [cat, setCat] = useState<Category>(initial?.category || Category.Today);
  const [pending, setPending] = useState(false);
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState<string>(() => {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  });

  const startIso = useMemo(() => `${date}T${time}:00`, [date, time]);

  async function handleSave() {
    if (!text.trim()) {
      toast.error('Le titre est obligatoire');
      return;
    }

    setPending(true);
    try {
      let res;
      if (initial) {
        // EDITION
        res = await fetch(`/api/tasks/${initial.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: text,
            category: cat,
            status: initial.status || 'PLANNED',
            startTime: startIso,
          }),
        });
      } else {
        // CREATION
        res = await fetch(`/api/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: text,
            category: cat,
            status: 'PLANNED',
            startTime: startIso,
          }),
        });
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Erreur lors de l’enregistrement');
      }

      const saved = await res.json();
      toast.success(initial ? 'Tâche mise à jour' : 'Tâche créée');

      // Mettre à jour le state local si callback fourni
      if (onSubmit) {
        onSubmit({
          id: saved.id,
          text: saved.title,
          category: saved.category,
          status: saved.status,
          startTime: saved.startTime,
          endTime: saved.endTime,
        });
      }

      onClose();
    } catch (e: any) {
      toast.error(e.message || 'Erreur');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <h3 className="text-lg mb-4">
          {initial ? 'Редактирование задачи' : 'Добавление новой задачи'}
        </h3>
        <textarea
          className="w-full p-2 bg-gray-700 rounded"
          placeholder="Введите текст задачи"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <select
          className="w-full p-2 bg-gray-700 rounded mt-2"
          value={cat}
          onChange={(e) => setCat(e.target.value as Category)}
        >
          {Object.values(Category).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <input
            type="date"
            className="w-full p-2 bg-gray-700 text-white rounded appearance-none"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            type="time"
            className="w-full p-2 bg-gray-700 text-white rounded appearance-none"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <button
            className="px-4 py-2 bg-gray-600 rounded"
            onClick={onClose}
            disabled={pending}
          >
            Отмена
          </button>
          <button
            className="px-4 py-2 bg-blue-400 rounded"
            onClick={handleSave}
            disabled={pending}
          >
            {pending ? '...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  );
}
