import { useRef } from 'react';

export default function TopBar({ title, onTitle, total, completed, search, onSearch, onAdd, onClearCompleted }) {
  const titleRef = useRef(null);

  const commitTitle = () => {
    onTitle(titleRef.current.textContent);
  };

  return (
    <header className="topbar">
      <div className="title-wrap">
        <h1
          ref={titleRef}
          contentEditable
          suppressContentEditableWarning
          spellCheck={false}
          onBlur={commitTitle}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              e.currentTarget.blur();
            }
          }}
        >
          {title}
        </h1>
        <div className="meta">
          <span>{completed}</span> Completed ·{' '}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onClearCompleted();
            }}
          >
            Clear
          </a>
        </div>
      </div>
      <div className="actions">
        <button onClick={onAdd} title="新建任务 (⌘N)">+ 新建</button>
        <input
          type="search"
          placeholder="搜索…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
        <span className="big-count">{total}</span>
      </div>
    </header>
  );
}
