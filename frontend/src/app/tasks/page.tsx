'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import Accordion from '../components/Accordion';
import NowDoing from '../components/NowDoing';
import CompletedList from '../components/CompletedList';
import AddEditTaskModal from '../components/AddEditTaskModal';
import CompleteTaskModal from '../components/CompleteTaskModal';
import { Category, Task, CompletedTask } from '../lib/types';
import {
  moveTask as apiMoveTask,
  addCompletedTask as apiAddCompletedTask,
} from '../lib/clientApiTasks';
import {
  deleteTask as apiDeleteTask,
  startTask as apiStartTask,
  stopTask as apiStopTask,
} from '../lib/clientApiTasks2';

type ApiTask = {
  id: string;
  title: string;
  category: string; 
  status: 'PLANNED' | 'IN_PROGRESS' | 'DONE';
  startTime?: string | null; 
  endTime?: string | null;   
  description?: string | null;
};

const CATEGORY_ORDER = ['TODAY', 'EVENING', 'TOMORROW', 'SOMEDAY'] as const;

function sameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
function getDateGroupLabel(date: Date): string {
  const today = new Date();
  if (sameDay(date, today)) return 'Сегодня';
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (sameDay(date, yesterday)) return 'Вчера';
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (sameDay(date, tomorrow)) return 'Завтра';
  return date.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' });
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [openCat, setOpenCat] = useState<Record<string, boolean>>({
    TODAY: true,
    EVENING: false,
    TOMORROW: false,
    SOMEDAY: false,
  });
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState<null | Task>(null);
  const [showComplete, setShowComplete] = useState<null | string>(null);

  const current = useMemo(() => {
    const t = tasks.find(x => (x as any).status === 'IN_PROGRESS');
    if (!t) return null;
    const startISO = (t as any).startTime as string | undefined;
    const start = startISO ? new Date(startISO).getTime() : Date.now();
    return { task: t, start, running: true };
  }, [tasks]);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!current?.running) return;
    setElapsed(Math.floor((Date.now() - current.start) / 1000));
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - current.start) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [current]);

  const completed: CompletedTask[] = useMemo(() => {
    const done = (tasks as any as ApiTask[])
      .filter(t => t.endTime) 
      .map<CompletedTask>(t => {
        const start = t.startTime ? new Date(t.startTime) : new Date();
        const end = t.endTime ? new Date(t.endTime) : new Date();
        return {
          id: t.id,
          text: t.title,
          start: start.toISOString(),
          end: end.toISOString(),
          date: getDateGroupLabel(start),
        };
      });
    return done.sort((a, b) => +new Date(b.end) - +new Date(a.end));
  }, [tasks]);

  async function loadTasks() {
    try {
      const res = await fetch('/api/tasks', { cache: 'no-store' });
      if (!res.ok) throw new Error(await res.text());
      const data: ApiTask[] = await res.json();

      const mapped: Task[] = data.map(t => ({
        id: t.id,
        text: t.title,
        category: t.category,
        ...(t as any),
      })) as any;

      setTasks(mapped);
    } catch (e: any) {
      toast.error(e?.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  function handleTaskSaved(task: Task) {
    setTasks(prev => {
      const i = prev.findIndex(x => x.id === task.id);
      if (i === -1) return [...prev, task];
      const clone = [...prev];
      clone[i] = { ...clone[i], ...task };
      return clone;
    });
  }

  async function handleDelete(id: string) {
    if (await apiDeleteTask(id)) {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  }

  async function handleStart(task: Task) {
    if (await apiStartTask(task.id)) {
      setTasks(prev =>
        prev.map(t =>
          t.id === task.id
            ? ({ ...t, status: 'IN_PROGRESS', startTime: new Date().toISOString() } as any)
            : ({ ...t, status: (t as any).status === 'IN_PROGRESS' ? 'PLANNED' : (t as any).status } as any)
        )
      );
    }
  }

  async function handleStop(task: Task) {
    if (await apiStopTask(task.id)) {
      const endIso = new Date().toISOString();
      setTasks(prev =>
        prev.map(t =>
          t.id === task.id
            ? ({ ...t, status: 'DONE', endTime: endIso } as any)
            : t
        )
      );
      toast.success('Tâche arrêtée');
    }
  }

  async function handleMove(task: Task, category: string) {
    const prev = tasks;
    setTasks(p => p.map(t => (t.id === task.id ? ({ ...(t as any), category } as any) : t)));
    const ok = await apiMoveTask(task.id, category);
    if (!ok) setTasks(prev);
  }

  async function handleAddCompletedManual(text: string, dateStr: string, start: string, end: string) {
    try {
      const startIso = `${dateStr}T${start}`;
      const endIso = `${dateStr}T${end}`;

      const ok = await apiAddCompletedTask({
        title: text,
        description: '',
        category: 'TODAY',
        startTime: startIso,
        endTime: endIso,
      });

      if (ok) {
        setShowComplete(null);
        await loadTasks(); 
      }
    } catch (e: any) {
      toast.error(e?.message || 'Erreur ajout terminé');
    }
  }

  if (loading) return <div className="p-6 text-white">Chargement…</div>;

  const today = new Date();
  const labelWithDate = (cat: string) => {
    let label = cat;
    if (cat === 'TODAY') {
      const fm = today.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
      label = `${label} (${fm})`;
    }
    if (cat === 'TOMORROW') {
      const tm = new Date(today);
      tm.setDate(today.getDate() + 1);
      const fm = tm.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
      label = `${label} (${fm})`;
    }
    return label;
  };

  return (
    <div className="flex h-screen bg-black text-white p-8 gap-8">
      <div className="w-1/3">
        <div className="flex justify-between items-center mb-4 text-blue-400 text-xl">
          <h2>План</h2>
          <button onClick={() => setShowAdd(true)}>＋</button>
        </div>

        {CATEGORY_ORDER.map(cat => {
          const inCat = tasks.filter(
            t => (t as any).category === cat && ((t as any).status !== 'DONE' || !(t as any).endTime)
          );

          type Group = { key: string; label: string; date: Date; items: Task[] };
          const groupsMap = new Map<string, Group>();
          for (const t of inCat) {
            const iso: string | undefined = (t as any).startTime || (t as any).createAt || undefined;
            const d = iso ? new Date(iso) : new Date();
            const key = d.toISOString().split('T')[0];
            const label = getDateGroupLabel(d);
            const g = groupsMap.get(key) || { key, label, date: new Date(key), items: [] };
            g.items.push(t);
            groupsMap.set(key, g);
          }

          const groups = Array.from(groupsMap.values()).sort((a, b) => b.date.getTime() - a.date.getTime());
          for (const g of groups) {
            g.items.sort((a, b) => {
              const ia = (a as any).startTime || (a as any).createAt || 0;
              const ib = (b as any).startTime || (b as any).createAt || 0;
              return +new Date(ib) - +new Date(ia);
            });
          }

          return (
            <Accordion
              key={cat}
              title={labelWithDate(cat)}
              open={openCat[cat]}
              onToggle={() => setOpenCat(o => ({ ...o, [cat]: !o[cat] }))}
            >
              {groups.map(group => (
                <div key={group.key} className="mb-2">
                  <div className="text-sm text-gray-400 mb-1">{group.label}</div>
                  {group.items.map(t => {
                    const running = (t as any).status === 'IN_PROGRESS';
                    const isDone = (t as any).status === 'DONE' && (t as any).endTime;
                    return (
                      <div
                        key={t.id}
                        className={`flex justify-between items-center p-2 my-1 rounded ${isDone ? 'bg-gray-800 opacity-90' : 'bg-gray-700'}`}
                      >
                        <span>{t.text}</span>
                        <div className="flex items-center gap-2">
                          <select
                            className="bg-gray-600 rounded px-2 py-1 text-sm"
                            value={(t as any).category}
                            onChange={(e) => handleMove(t, e.target.value)}
                          >
                            {CATEGORY_ORDER.map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => (running ? handleStop(t) : handleStart(t))}
                            title={running ? 'Stop' : 'Start'}
                          >
                            {running ? '⏸' : '▶'}
                          </button>
                          <button onClick={() => setShowEdit(t)}>✎</button>
                          <button onClick={() => handleDelete(t.id)}>🗑</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </Accordion>
          );
        })}
      </div>

      <div className="w-2/3 flex flex-col gap-6 bg-black">
        <NowDoing current={current} elapsed={elapsed} onStop={() => current && handleStop(current.task)} />
        <CompletedList
          completed={completed}
          onAdd={() => setShowComplete('')}
        />
      </div>

      {showAdd && (
        <AddEditTaskModal
          onClose={() => setShowAdd(false)}
          onSubmit={(saved) => { handleTaskSaved(saved); setShowAdd(false); }}
        />
      )}

      {showEdit && (
        <AddEditTaskModal
          initial={showEdit}
          onClose={() => setShowEdit(null)}
          onSubmit={(saved) => { handleTaskSaved(saved); setShowEdit(null); }}
        />
      )}

      {showComplete !== null && (
        <CompleteTaskModal
          dateGroup={showComplete || 'Сегодня'}
          onClose={() => setShowComplete(null)}
          onSubmit={handleAddCompletedManual}
        />
      )}
    </div>
  );
}
