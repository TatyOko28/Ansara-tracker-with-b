"use client"

import React, { useState } from 'react';
interface Props {
  dateGroup: string;
  onSubmit: (text: string, date: string, start: string, end: string) => void;
  onClose: () => void;
}

export default function CompleteTaskModal({ dateGroup, onSubmit, onClose }: Props) {
  const [text, setText] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [start, setStart] = useState('10:00');
  const [end, setEnd] = useState('11:00');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <h3 className="text-lg mb-4">Добавление выполненной задачи</h3>
        <textarea
          className="w-full p-2 bg-gray-700 rounded"
          placeholder="Текстовое описание задачи"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <div className="grid grid-cols-3 gap-2 mt-2">
          <input type="date" className="p-2 bg-gray-700 text-white rounded appearance-none" value={date} onChange={e => setDate(e.target.value)} />
          <input type="time" className="p-2 bg-gray-700 text-white rounded appearance-none" value={start} onChange={e => setStart(e.target.value)} />
          <input type="time" className="p-2 bg-gray-700 text-white rounded appearance-none" value={end} onChange={e => setEnd(e.target.value)} />
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <button className="px-4 py-2 bg-gray-600 rounded" onClick={onClose}>Отмена</button>
          <button className="px-4 py-2 bg-blue-400 rounded" onClick={() => onSubmit(text, date, start, end)}>Добавить</button>
        </div>
      </div>
    </div>
)}