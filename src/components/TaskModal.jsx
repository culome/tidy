import { useState, useEffect, useRef } from 'react';
import Select from './Select';

const STATUS_OPTIONS = [
  { value: 'todo', label: 'Todo' },
  { value: 'doing', label: 'Doing' },
  { value: 'backlog', label: 'Backlog' },
  { value: 'done', label: 'Done' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: '低' },
  { value: 'med', label: '中' },
  { value: 'high', label: '高' },
];

export default function TaskModal({ task, defaultStatus, onSave, onDelete, onClose }) {
  const [title, setTitle] = useState(task ? task.title : '');
  const [desc, setDesc] = useState(task ? task.desc : '');
  const [status, setStatus] = useState(task ? (task.done ? 'done' : task.status) : defaultStatus);
  const [priority, setPriority] = useState(task ? task.priority : 'med');
  const [tags, setTags] = useState(task ? (task.tags || []).join(', ') : '');
  const titleRef = useRef(null);

  useEffect(() => {
    const id = setTimeout(() => titleRef.current?.focus(), 50);
    return () => clearTimeout(id);
  }, []);

  const submit = () => {
    const t = title.trim();
    if (!t) {
      titleRef.current?.focus();
      return;
    }
    onSave(
      {
        title: t,
        desc: desc.trim(),
        status: status === 'done' ? 'todo' : status,
        done: status === 'done',
        priority,
        tags: tags.split(',').map((s) => s.trim()).filter(Boolean),
      },
      task?.id
    );
    onClose();
  };

  const remove = () => {
    if (task && confirm('删除这个任务?')) {
      onDelete(task.id);
      onClose();
    }
  };

  return (
    <div
      className="modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal-card"
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') submit();
        }}
      >
        <header>
          <h3>{task ? '编辑任务' : '新建任务'}</h3>
          <button className="icon-btn" onClick={onClose}>×</button>
        </header>
        <div className="form">
          <label>
            标题
            <input
              ref={titleRef}
              type="text"
              placeholder="例如:整理本周工作计划"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label>
            描述
            <textarea
              rows={4}
              placeholder="补充细节、目标或链接"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </label>
          <div className="row">
            <label>
              状态
              <Select value={status} options={STATUS_OPTIONS} onChange={setStatus} />
            </label>
            <label>
              优先级
              <Select value={priority} options={PRIORITY_OPTIONS} onChange={setPriority} />
            </label>
          </div>
          <label>
            标签 <span className="hint">用逗号分隔</span>
            <input
              type="text"
              placeholder="工作, 会议, 紧急"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </label>
        </div>
        <footer>
          {task && <button className="ghost" id="deleteBtn" onClick={remove}>删除</button>}
          <span className="spacer" />
          <button className="ghost" onClick={onClose}>取消</button>
          <button className="primary" onClick={submit}>保存</button>
        </footer>
      </div>
    </div>
  );
}
