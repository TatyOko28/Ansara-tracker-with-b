"use client"

import React from 'react';
interface AccordionProps {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export default function Accordion({ title, open, onToggle, children }: AccordionProps) {
  return (
    <div className="mb-2">
      <button className="w-full flex justify-between bg-gray-800 px-4 py-2" onClick={onToggle}>
        <span>{title}</span>
        <span>{open ? '▾' : '▸'}</span>
      </button>
      {open && <div className="ml-4 mt-2 space-y-1">{children}</div>}
    </div>
  );
}
