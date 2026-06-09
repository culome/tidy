import { fmtDate, PRIORITY_LABEL } from '../lib';

export default function Card({ task, dragging, onDragStart, onDragEnd, onToggle, onOpen }) {
  const prio = task.priority || 'med';

  return (
    <div
      className={'card' + (task.done ? ' done' : '') + (dragging ? ' dragging' : '')}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onOpen}
    >
      <div className="card-title">
        <span
          className="check"
          title="标记完成"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        />
        <span className="t">{task.title || '(无标题)'}</span>
      </div>
      {task.desc && <div className="card-desc">{task.desc}</div>}
      <div className="card-meta">
        <span className={'priority ' + prio}>{PRIORITY_LABEL[prio]}</span>
        {(task.tags || []).map((tg, i) => (
          <span className="tag" key={i}>{tg}</span>
        ))}
        <span className="card-date">{fmtDate(task.createdAt)}</span>
      </div>
    </div>
  );
}
