export const STORAGE_KEY = 'tidy.board.v1';

export const COLUMNS = [
  { id: 'todo', name: '待办 Todo' },
  { id: 'doing', name: '进行中 Doing' },
  { id: 'backlog', name: '储备 Backlog' },
];

export const PRIORITY_LABEL = { low: 'LOW', med: 'MED', high: 'HIGH' };

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function fmtDate(ts) {
  const d = new Date(ts);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function matches(t, q) {
  const query = q.trim().toLowerCase();
  if (!query) return true;
  return (
    (t.title || '').toLowerCase().includes(query) ||
    (t.desc || '').toLowerCase().includes(query) ||
    (t.tags || []).some((tag) => tag.toLowerCase().includes(query))
  );
}

export function defaultState() {
  const now = Date.now();
  return {
    activeView: null, // null => active board; 'notes' => notes view
    activeBoard: 'b_work',
    boards: [
      {
        id: 'b_work',
        title: 'Work',
        tasks: [
          { id: uid(), title: '欢迎使用 Tidy', desc: '点击右上角「+ 新建」创建任务,或拖拽卡片切换状态。', status: 'todo', priority: 'med', tags: ['示例'], createdAt: now, done: false },
          { id: uid(), title: '规划本周目标', desc: '', status: 'doing', priority: 'high', tags: ['计划'], createdAt: now, done: false },
          { id: uid(), title: '整理桌面与收件箱', desc: '', status: 'backlog', priority: 'low', tags: [], createdAt: now, done: false },
        ],
      },
      {
        id: 'b_life',
        title: 'Life',
        tasks: [
          { id: uid(), title: '锻炼 30 分钟', desc: '', status: 'todo', priority: 'med', tags: ['健康'], createdAt: now, done: false },
        ],
      },
    ],
    notes: '# 速记\n\n在这里随手记点东西…\n',
  };
}

// 兼容旧版本数据结构 { title, tasks } → 新工作区结构
export function migrate(state) {
  if (!state || typeof state !== 'object') return defaultState();
  if (Array.isArray(state.boards)) {
    return {
      activeView: state.activeView ?? null,
      activeBoard: state.activeBoard || state.boards[0]?.id || 'b_work',
      boards: state.boards,
      notes: typeof state.notes === 'string' ? state.notes : '',
    };
  }
  // old shape
  const id = 'b_work';
  return {
    activeView: null,
    activeBoard: id,
    boards: [{ id, title: state.title || 'Work', tasks: state.tasks || [] }],
    notes: '',
  };
}
