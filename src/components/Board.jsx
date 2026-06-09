import { useState } from 'react';
import { COLUMNS, matches } from '../lib';
import Card from './Card';

export default function Board({ tasks, search, onMove, onToggle, onOpen, onAddTo }) {
  const [dragId, setDragId] = useState(null);
  const [overCol, setOverCol] = useState(null);

  const handleDrop = (colId) => {
    if (dragId) onMove(dragId, colId);
    setDragId(null);
    setOverCol(null);
  };

  return (
    <main className="board">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter(
          (t) => t.status === col.id && !t.done && matches(t, search)
        );
        return (
          <section className="column" key={col.id}>
            <div className="column-head">
              <div>
                <span className="name">{col.name}</span>{' '}
                <span className="count">{colTasks.length}</span>
              </div>
              <button className="add-here" title="在此列新建" onClick={() => onAddTo(col.id)}>
                +
              </button>
            </div>
            <div
              className={'cards' + (overCol === col.id ? ' drag-over' : '')}
              onDragOver={(e) => {
                e.preventDefault();
                setOverCol(col.id);
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) setOverCol(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                handleDrop(col.id);
              }}
            >
              {colTasks.map((t) => (
                <Card
                  key={t.id}
                  task={t}
                  dragging={dragId === t.id}
                  onDragStart={() => setDragId(t.id)}
                  onDragEnd={() => setDragId(null)}
                  onToggle={() => onToggle(t.id)}
                  onOpen={() => onOpen(t.id)}
                />
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
