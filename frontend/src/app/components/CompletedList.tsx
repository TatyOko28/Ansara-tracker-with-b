"use client"

import React from 'react';
import { CompletedTask } from '../lib/types';

interface CompletedListProps {
  completed: CompletedTask[];
  onAdd: () => void;
}

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

const formatDuration = (totalSec: number) => {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = Math.floor(totalSec % 60);
  return `${h > 0 ? h + ' ч ' : ''}${m > 0 ? m + ' м ' : ''}${s} с`;
};

export default function CompletedList({ completed, onAdd }: CompletedListProps) {
  if (completed.length === 0) {
    return (
      <div className="bg-gray-800 p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-2 text-blue-400 text-xl">
          <h2>Выполнено</h2>
          <button onClick={onAdd}>＋</button>
        </div>
        <p className="text-gray-400">Нет выполненных задач за сегодня</p>
      </div>
    );
  }

  // Group by date label, newest date first, tasks inside newest first
  const groupsMap = completed.reduce((map, item) => {
    const arr = map.get(item.date) || [];
    arr.push(item);
    map.set(item.date, arr);
    return map;
  }, new Map<string, CompletedTask[]>());
  const groups = Array.from(groupsMap.entries()).sort((a, b) => {
    const ad = a[1][0]?.start || a[1][0]?.end || '';
    const bd = b[1][0]?.start || b[1][0]?.end || '';
    return +new Date(bd) - +new Date(ad);
  });

  return (
    <div className="bg-gray-800 p-4 flex-1 flex flex-col">
      <div className="flex justify-between items-center mb-2 text-blue-400 text-xl">
        <h2>Выполнено</h2>
        <button onClick={onAdd}>＋</button>
      </div>

      <div className="flex-1 overflow-auto">
        {groups.map(([date, tasks]) => {
          const totalSec = tasks.reduce((sum, t) => {
            const dur = (new Date(t.end).getTime() - new Date(t.start).getTime()) / 1000;
            return sum + dur;
          }, 0);
          return (
            <div key={date} className="mb-6">
              <h3 className="font-semibold text-lg mb-2">{date}</h3>
              <div className="mt-2 space-y-1">
                {tasks.map(c => {
                  const durSec = (new Date(c.end).getTime() - new Date(c.start).getTime()) / 1000;
                  return (
                    <div
                      key={c.id}
                      className="grid grid-cols-[1fr_auto_auto] items-center py-1 border-b border-gray-700"
                    >
                      <div className="whitespace-pre-wrap">{c.text}</div>
                      <div className="whitespace-nowrap ml-4">
                        {formatTime(c.start)} – {formatTime(c.end)}
                      </div>
                      <div className="ml-4">{formatDuration(durSec)}</div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-end mt-2 text-gray-400">Всего: {formatDuration(totalSec)}</div>
            </div>
          );
        })}
      </div>

      <button className="mt-2 self-center text-blue-400" onClick={onAdd}>
        Загрузить ещё＋
      </button>
    </div>
  );
}
