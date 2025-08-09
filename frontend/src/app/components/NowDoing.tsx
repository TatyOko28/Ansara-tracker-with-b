"use client"

import React from 'react';
import { Task } from '../lib/types';
interface NowDoingProps {
  current: { task: Task; start: number; running: boolean } | null;
  elapsed: number;
  onStop: () => void;
}

const formatDuration = (sec: number) => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${h > 0 ? h + ' ч ' : ''}${m > 0 ? m + ' м ' : ''}${s} с`;
};

export default function NowDoing({ current, elapsed, onStop }: NowDoingProps) {
  return (
    <div className="bg-gray-800 p-4">
      <h2 className="text-blue-400 text-xl mb-2">Сейчас делаю</h2>
      {current?.running ? (
        <div className="flex justify-between items-center">
          <span>{current.task.text}</span>
          <span>{formatDuration(elapsed)}</span>
          <button onClick={onStop}>■</button>
        </div>
      ) : (
        <p className="text-gray-400">Нет активных задач</p>
      )}
    </div>
  );
}