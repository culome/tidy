export default function Sidebar({
  boards,
  activeBoard,
  activeView,
  onSelectBoard,
  onSelectNotes,
  onAddBoard,
  onDeleteBoard,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">Tidy</div>

      <div className="sidebar-section">
        <div className="sidebar-label">
          <span>分类</span>
          <button className="sidebar-add" title="新增分类" onClick={onAddBoard}>+</button>
        </div>
        <ul className="sidebar-list">
          {boards.map((b) => {
            const isActive = activeView === null && b.id === activeBoard;
            const count = b.tasks.filter((t) => !t.done).length;
            return (
              <li
                key={b.id}
                className={'sidebar-item' + (isActive ? ' active' : '')}
                onClick={() => onSelectBoard(b.id)}
              >
                <span className="dot" />
                <span className="sidebar-name">{b.title}</span>
                <span className="sidebar-count">{count}</span>
                {boards.length > 1 && (
                  <button
                    className="sidebar-del"
                    title="删除分类"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteBoard(b.id);
                    }}
                  >
                    ×
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label"><span>工具</span></div>
        <ul className="sidebar-list">
          <li
            className={'sidebar-item' + (activeView === 'notes' ? ' active' : '')}
            onClick={onSelectNotes}
          >
            <span className="dot dot-notes" />
            <span className="sidebar-name">记事簿</span>
          </li>
        </ul>
      </div>
    </aside>
  );
}
