export default function Notes({ value, onChange }) {
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  const chars = value.length;

  return (
    <div className="notes">
      <textarea
        className="notes-area"
        value={value}
        spellCheck={false}
        placeholder="在这里随手记点东西…&#10;想法、清单、链接,自动保存。"
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="notes-footer">
        <span>{chars} 字符 · {words} 词</span>
        <span className="notes-saved">已自动保存</span>
      </div>
    </div>
  );
}
