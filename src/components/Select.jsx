import { useState, useRef, useEffect } from 'react';

export default function Select({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef(null);
  const listRef = useRef(null);

  const selected = options.find((o) => o.value === value) || options[0];

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  // Sync highlight to current value when opening
  useEffect(() => {
    if (open) {
      const i = options.findIndex((o) => o.value === value);
      setActive(i < 0 ? 0 : i);
    }
  }, [open, value, options]);

  const pick = (opt) => {
    onChange(opt.value);
    setOpen(false);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (open) pick(options[active]);
      else setOpen(true);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) setOpen(true);
      else setActive((a) => Math.min(options.length - 1, a + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (open) setActive((a) => Math.max(0, a - 1));
    } else if (e.key === 'Escape') {
      if (open) {
        e.stopPropagation();
        setOpen(false);
      }
    }
  };

  return (
    <div className={'select' + (open ? ' open' : '')} ref={rootRef}>
      <button
        type="button"
        className="select-trigger"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="select-value">{selected?.label}</span>
        <span className="select-arrow" aria-hidden>▾</span>
      </button>
      {open && (
        <ul className="select-menu" role="listbox" ref={listRef}>
          {options.map((opt, i) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              className={
                'select-option' +
                (opt.value === value ? ' selected' : '') +
                (i === active ? ' active' : '')
              }
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                pick(opt);
              }}
            >
              <span className="select-check">{opt.value === value ? '✓' : ''}</span>
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
