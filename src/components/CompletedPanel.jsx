import { fmtDate } from '../lib';

export default function CompletedPanel({ tasks, onToggle, onDelete }) {
  if (!tasks.length) {
    return <div className="completed-empty">还没有已完成的任务</div>;
  }
  return (
    <ul className="completed-list">
      {tasks.map((t) => (
        <li className="completed-item" key={t.id}>
          <span
            className="check done"
            title="取消完成"
            onClick={() => onToggle(t.id)}
          />
          <span className="completed-title">{t.title || '(无标题)'}</span>
          <span className="completed-date">{fmtDate(t.createdAt)}</span>
          <button
            className="completed-del"
            title="删除"
            onClick={() => onDelete(t.id)}
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  );
}
