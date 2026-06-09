import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { STORAGE_KEY, uid, defaultState, migrate } from './lib';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Board from './components/Board';
import Notes from './components/Notes';
import TaskModal from './components/TaskModal';

export default function App() {
  const [raw, setRaw] = useLocalStorage(STORAGE_KEY, defaultState);
  const state = migrate(raw);
  const setState = useCallback((updater) => {
    setRaw((prev) => (typeof updater === 'function' ? updater(migrate(prev)) : updater));
  }, [setRaw]);

  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // { id } | { status } | null

  const board = state.boards.find((b) => b.id === state.activeBoard) || state.boards[0];
  const inNotes = state.activeView === 'notes';

  // ---- board tasks helpers (operate on active board) ----
  const updateBoardTasks = useCallback((fn) => {
    setState((s) => ({
      ...s,
      boards: s.boards.map((b) => (b.id === s.activeBoard ? { ...b, tasks: fn(b.tasks) } : b)),
    }));
  }, [setState]);

  const upsertTask = useCallback((data, id) => {
    updateBoardTasks((tasks) =>
      id
        ? tasks.map((t) => (t.id === id ? { ...t, ...data } : t))
        : [{ id: uid(), createdAt: Date.now(), ...data }, ...tasks]
    );
  }, [updateBoardTasks]);

  const deleteTask = useCallback((id) => {
    updateBoardTasks((tasks) => tasks.filter((t) => t.id !== id));
  }, [updateBoardTasks]);

  const moveTask = useCallback((id, status) => {
    updateBoardTasks((tasks) => tasks.map((t) => (t.id === id ? { ...t, status } : t)));
  }, [updateBoardTasks]);

  const toggleDone = useCallback((id) => {
    updateBoardTasks((tasks) => tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }, [updateBoardTasks]);

  const clearCompleted = useCallback(() => {
    const n = board.tasks.filter((t) => t.done).length;
    if (!n || !confirm(`清除 ${n} 个已完成任务?`)) return;
    updateBoardTasks((tasks) => tasks.filter((t) => !t.done));
  }, [board, updateBoardTasks]);

  const setBoardTitle = useCallback((title) => {
    setState((s) => ({
      ...s,
      boards: s.boards.map((b) => (b.id === s.activeBoard ? { ...b, title: title.trim() || '未命名' } : b)),
    }));
  }, [setState]);

  // ---- workspace helpers ----
  const selectBoard = useCallback((id) => {
    setState((s) => ({ ...s, activeView: null, activeBoard: id }));
  }, [setState]);

  const selectNotes = useCallback(() => {
    setState((s) => ({ ...s, activeView: 'notes' }));
  }, [setState]);

  const addBoard = useCallback(() => {
    const name = prompt('新分类名称', '');
    if (name == null) return;
    const id = 'b_' + uid();
    setState((s) => ({
      ...s,
      activeView: null,
      activeBoard: id,
      boards: [...s.boards, { id, title: name.trim() || '未命名', tasks: [] }],
    }));
  }, [setState]);

  const deleteBoard = useCallback((id) => {
    setState((s) => {
      if (s.boards.length <= 1) return s;
      const target = s.boards.find((b) => b.id === id);
      if (!confirm(`删除分类「${target?.title}」及其所有任务?`)) return s;
      const boards = s.boards.filter((b) => b.id !== id);
      const activeBoard = s.activeBoard === id ? boards[0].id : s.activeBoard;
      return { ...s, boards, activeBoard };
    });
  }, [setState]);

  const setNotes = useCallback((notes) => {
    setState((s) => ({ ...s, notes }));
  }, [setState]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setModal(null);
      if ((e.metaKey || e.ctrlKey) && e.key === 'n' && !modal && !inNotes) {
        e.preventDefault();
        setModal({ status: 'todo' });
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [modal, inNotes]);

  const total = board.tasks.length;
  const completed = board.tasks.filter((t) => t.done).length;

  return (
    <div className="app-shell">
      <Sidebar
        boards={state.boards}
        activeBoard={state.activeBoard}
        activeView={state.activeView}
        onSelectBoard={selectBoard}
        onSelectNotes={selectNotes}
        onAddBoard={addBoard}
        onDeleteBoard={deleteBoard}
      />
      <div className="workspace">
        {inNotes ? (
          <>
            <header className="topbar">
              <div className="title-wrap">
                <h1 style={{ cursor: 'default' }}>记事簿</h1>
                <div className="meta">随手记 · 自动保存</div>
              </div>
            </header>
            <Notes value={state.notes} onChange={setNotes} />
          </>
        ) : (
          <>
            <TopBar
              key={board.id}
              title={board.title}
              onTitle={setBoardTitle}
              total={total}
              completed={completed}
              search={search}
              onSearch={setSearch}
              onAdd={() => setModal({ status: 'todo' })}
              onClearCompleted={clearCompleted}
            />
            <Board
              tasks={board.tasks}
              search={search}
              onMove={moveTask}
              onToggle={toggleDone}
              onOpen={(id) => setModal({ id })}
              onAddTo={(status) => setModal({ status })}
            />
          </>
        )}
      </div>
      {modal && (
        <TaskModal
          task={modal.id ? board.tasks.find((t) => t.id === modal.id) : null}
          defaultStatus={modal.status || 'todo'}
          onSave={upsertTask}
          onDelete={deleteTask}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
