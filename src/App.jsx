import { useState, useRef } from "react";

const VOLUME_OPTIONS = {
  shrink: {
    label: "Сократить",
    icon: "◀",
    hint: "~60–75% от оригинала",
    instruction: (len) => `ВАЖНО: объём результата должен быть КОРОЧЕ исходного — примерно ${Math.round(len * 0.65)} симв. (65% от ${len}). Убери воду, повторы и второстепенные детали, но сохрани суть.`,
  },
  same: {
    label: "Сохранить",
    icon: "■",
    hint: "Тот же объём",
    instruction: (len) => `ВАЖНО: объём результата должен быть примерно равен исходному (${len} симв.) — не короче и не длиннее.`,
  },
  expand: {
    label: "Расширить",
    icon: "▶",
    hint: "~140–160% от оригинала",
    instruction: (len) => `ВАЖНО: объём результата должен быть ДЛИННЕЕ исходного — примерно ${Math.round(len * 1.5)} симв. (150% от ${len}). Раскрой мысли подробнее, добавь примеры или контекст, сохраняя стиль.`,
  },
};

const LIST_NOTE = (keep) =>
  keep
    ? " Если в тексте есть списки, нумерация или перечисления — сохрани их структуру и форматирование в точности."
    : " Если в тексте есть списки или нумерация — можешь перефразировать их в связный текст или оставить как есть.";

const STYLES = {
  formal: {
    label: "Деловой",
    icon: "💼",
    desc: "Чётко и грамотно, без канцелярщины",
    passes: [
      (text, keep, vol) =>
        `КРИТИЧНО: відповідай тією ж мовою, якою написаний вхідний текст — якщо текст українською, пиши українською; якщо російською — російською. Перепиши следующий текст в деловом, но живом стиле. Никакой канцелярщины, штампов и заумных терминов — пиши так, как говорит грамотный специалист на планёрке: чётко, по делу, понятно. Структуру и смысл сохрани полностью.${LIST_NOTE(keep)} ${VOLUME_OPTIONS[vol].instruction(text.length)} Только текст, без пояснений.\n\nТекст:\n${text}`,
      (text, keep, vol) =>
        `КРИТИЧНО: відповідай тією ж мовою, якою написаний вхідний текст — якщо текст українською, пиши українською; якщо російською — російською. Этот деловой текст звучит немного сухо — добавь живости. Пусть за словами чувствуется человек: чуть неравномерный ритм, иногда короткое предложение после длинного, убери все шаблонные связки. Стиль остаётся профессиональным, но не казённым.${LIST_NOTE(keep)} ${VOLUME_OPTIONS[vol].instruction(text.length)} Только текст.\n\nТекст:\n${text}`,
      (text, keep, vol) =>
        `КРИТИЧНО: відповідай тією ж мовою, якою написаний вхідний текст — якщо текст українською, пиши українською; якщо російською — російською. Финальная правка делового текста: убери повторы, выровняй ритм, сделай переходы между мыслями плавными. Результат должен читаться легко и звучать как живая речь умного человека — не как отчёт.${LIST_NOTE(keep)} ${VOLUME_OPTIONS[vol].instruction(text.length)} Только текст.\n\nТекст:\n${text}`,
    ],
  },
  neutral: {
    label: "Нейтральный",
    icon: "📝",
    desc: "Подойдёт для учёбы и работы",
    passes: [
      (text, keep, vol) =>
        `КРИТИЧНО: відповідай тією ж мовою, якою написаний вхідний текст — якщо текст українською, пиши українською; якщо російською — російською. Перепиши текст так, щоб він звучав природно і по-людськи, але зберігав нейтральний академічний стиль. Міняй структуру речень, порядок слів, використовуй синоніми, розбивай довгі речення на коротші й навпаки — щоб прибрати паттерни машинного тексту. Зберігай точку зору оригіналу — якщо текст від третьої особи, не переходь на "ми", "наш", "ваш". Не додавай розмовних зворотів, емоцій, оцінок і слів яких не було в оригіналі. Зберігай смисл і всі факти.${LIST_NOTE(keep)} ${VOLUME_OPTIONS[vol].instruction(text.length)} Тільки текст, без пояснень.\n\nТекст:\n${text}`,
      (text, keep, vol) =>
        `КРИТИЧНО: відповідай тією ж мовою, якою написаний вхідний текст — якщо текст українською, пиши українською; якщо російською — російською. Перепиши текст так, щоб він звучав природно і по-людськи, але зберігав нейтральний академічний стиль. Міняй структуру речень, порядок слів, використовуй синоніми, розбивай довгі речення на коротші й навпаки — щоб прибрати паттерни машинного тексту. Зберігай точку зору оригіналу — якщо текст від третьої особи, не переходь на "ми", "наш", "ваш". Не додавай розмовних зворотів, емоцій, оцінок і слів яких не було в оригіналі. Зберігай смисл і всі факти.${LIST_NOTE(keep)} ${VOLUME_OPTIONS[vol].instruction(text.length)} Тільки текст, без пояснень.\n\nТекст:\n${text}`,
      (text, keep, vol) =>
        `КРИТИЧНО: відповідай тією ж мовою, якою написаний вхідний текст — якщо текст українською, пиши українською; якщо російською — російською. Перепиши текст так, щоб він звучав природно і по-людськи, але зберігав нейтральний академічний стиль. Міняй структуру речень, порядок слів, використовуй синоніми, розбивай довгі речення на коротші й навпаки — щоб прибрати паттерни машинного тексту. Зберігай точку зору оригіналу — якщо текст від третьої особи, не переходь на "ми", "наш", "ваш". Не додавай розмовних зворотів, емоцій, оцінок і слів яких не було в оригіналі. Зберігай смисл і всі факти.${LIST_NOTE(keep)} ${VOLUME_OPTIONS[vol].instruction(text.length)} Тільки текст, без пояснень.\n\nТекст:\n${text}`,
    ],
  },
  lively: {
    label: "Живой",
    icon: "✨",
    desc: "Максимально человечно, без сленга",
    passes: [
      (text, keep, vol) =>
        `КРИТИЧНО: відповідай тією ж мовою, якою написаний вхідний текст — якщо текст українською, пиши українською; якщо російською — російською. Перепиши следующий текст максимально живым языком. Пиши так, как умный человек рассказывает что-то интересное другу — просто, образно, с характером. Без сленга и грубостей, но очень по-человечески: можно чуть иронии, можно разговорные обороты. Смысл и факты сохрани.${LIST_NOTE(keep)} ${VOLUME_OPTIONS[vol].instruction(text.length)} Только текст.\n\nТекст:\n${text}`,
      (text, keep, vol) =>
        `КРИТИЧНО: відповідай тією ж мовою, якою написаний вхідний текст — якщо текст українською, пиши українською; якщо російською — російською. Этот текст всё ещё звучит немного искусственно — сделай его по-настоящему живым. Неравномерный ритм, личные интонации, местами короткий удар после длинной фразы. Пиши как человек, у которого есть своё мнение и манера говорить — но без жаргона.${LIST_NOTE(keep)} ${VOLUME_OPTIONS[vol].instruction(text.length)} Только текст.\n\nТекст:\n${text}`,
      (text, keep, vol) =>
        `КРИТИЧНО: відповідай тією ж мовою, якою написаний вхідний текст — якщо текст українською, пиши українською; якщо російською — російською. Финальная шлифовка: убери повторы, добавь плавности между мыслями, усиль индивидуальность стиля. Текст должен читаться на одном дыхании — живо, по-человечески, с характером, но без панибратства.${LIST_NOTE(keep)} ${VOLUME_OPTIONS[vol].instruction(text.length)} Только текст.\n\nТекст:\n${text}`,
    ],
  },
};

const PASS_LABELS = ["Проход 1 — Перефразировка", "Проход 2 — Очеловечивание", "Проход 3 — Финал"];

const FACT_CHECK_PROMPT = (text) =>
  `Проверь фактическую достоверность следующего текста. Укажи конкретно:\n1. Какие утверждения точны\n2. Какие вызывают сомнения или могут быть неточными\n3. Что стоит уточнить или проверить\n\nБудь конкретен. Верни структурированный ответ.\n\nТекст:\n${text}`;

async function callClaude(prompt) {
  const response = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  const data = await response.json();
  return data.text || "";
}

function copyToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
      return;
    }
  } catch (_) {}
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
}

function PassBlock({ label, text }) {
  const ref = useRef(null);
  const [selected, setSelected] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectAll = () => {
    const el = ref.current;
    if (!el) return;
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    setSelected(true);
    setTimeout(() => setSelected(false), 2000);
  };

  const handleCopy = () => {
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <label style={{ fontSize: 12, color: "#888", letterSpacing: 0.5 }}>{label.toUpperCase()}</label>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={selectAll}
            style={{
              background: selected ? "#5cfc8a22" : "#2a2a35",
              border: `1px solid ${selected ? "#5cfc8a44" : "transparent"}`,
              borderRadius: 6, padding: "5px 12px",
              color: selected ? "#5cfc8a" : "#aaa",
              fontSize: 12, cursor: "pointer", transition: "all 0.2s",
            }}
          >
            {selected ? "Выделено ✓" : "Выделить всё"}
          </button>
          <button
            onClick={handleCopy}
            style={{
              background: copied ? "#5cfc8a22" : "#2a2a35",
              border: `1px solid ${copied ? "#5cfc8a44" : "transparent"}`,
              borderRadius: 6, padding: "5px 12px",
              color: copied ? "#5cfc8a" : "#aaa",
              fontSize: 12, cursor: "pointer", transition: "all 0.2s",
            }}
          >
            {copied ? "Скопировано ✓" : "Копировать"}
          </button>
        </div>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        style={{
          background: "#18181f", border: "1px solid #2a2a35", borderRadius: 10,
          padding: 16, fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap",
          color: "#e8e6e0", outline: "none", userSelect: "text", WebkitUserSelect: "text",
        }}
      >
        {text}
      </div>
    </div>
  );
}

function Toggle({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? "#7c5cfc22" : "#18181f",
        border: `1px solid ${active ? "#7c5cfc" : "#2a2a35"}`,
        borderRadius: 10, padding: "10px 16px",
        color: active ? "#9b7ffe" : "#888",
        fontSize: 13, cursor: "pointer",
        display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s",
      }}
    >
      <span style={{ fontSize: 16 }}>{active ? "✓" : "○"}</span>
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </button>
  );
}

export default function App() {
  const [input, setInput] = useState("");
  const [passes, setPasses] = useState(3);
  const [styleKey, setStyleKey] = useState("neutral");
  const [volume, setVolume] = useState("same");
  const [keepLists, setKeepLists] = useState(true);
  const [factCheck, setFactCheck] = useState(false);
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState([]);
  const [passResults, setPassResults] = useState([]);
  const [factResult, setFactResult] = useState("");
  const logRef = useRef(null);

  const addLog = (msg, type = "info") => {
    setLog((prev) => [...prev, { msg, type }]);
    setTimeout(() => logRef.current?.scrollTo(0, logRef.current.scrollHeight), 50);
  };

  const run = async () => {
    if (!input.trim()) return;
    setRunning(true);
    setLog([]);
    setPassResults([]);
    setFactResult("");

    let current = input;
    const stylePrompts = STYLES[styleKey].passes;
    const actualPasses = stylePrompts.slice(0, passes);
    const results = [];

    for (let i = 0; i < actualPasses.length; i++) {
      addLog(`${PASS_LABELS[i]}...`);
      try {
        current = await callClaude(actualPasses[i](current, keepLists, volume));
        results.push({ label: PASS_LABELS[i], text: current });
        setPassResults([...results]);
        addLog(`✓ Завершён`, "success");
      } catch (e) {
        addLog(`✗ Ошибка на проходе ${i + 1}`, "error");
        setRunning(false);
        return;
      }
    }

    addLog("✓ Перефразировка завершена", "success");

    if (factCheck) {
      addLog("Проверяю факты...");
      try {
        const fc = await callClaude(FACT_CHECK_PROMPT(current));
        setFactResult(fc);
        addLog("✓ Проверка фактов завершена", "success");
      } catch (e) {
        addLog("✗ Ошибка при проверке фактов", "error");
      }
    }

    setRunning(false);
  };

  const charCount = input.length;

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f13", color: "#e8e6e0", fontFamily: "'Inter', system-ui, sans-serif", padding: "24px 16px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "inline-block", background: "#7c5cfc22", border: "1px solid #7c5cfc44", borderRadius: 6, padding: "3px 10px", fontSize: 11, color: "#9b7ffe", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
            Рерайтер
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#fff" }}>Перефразировка текста</h1>
          <p style={{ margin: "6px 0 0", fontSize: 14, color: "#888" }}>Несколько проходов через ИИ — текст становится живым и человечным</p>
        </div>

        {/* Input */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <label style={{ fontSize: 12, color: "#888", letterSpacing: 0.5 }}>ИСХОДНЫЙ ТЕКСТ</label>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {charCount > 0 && <span style={{ fontSize: 12, color: "#555" }}>{charCount} симв.</span>}
              {input && (
                <button onClick={() => setInput("")} style={{ background: "none", border: "none", color: "#555", fontSize: 18, cursor: "pointer", lineHeight: 1, padding: "0 4px" }} title="Очистить">✕</button>
              )}
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Вставь текст сюда..."
            style={{ width: "100%", minHeight: 180, background: "#18181f", border: "1px solid #2a2a35", borderRadius: 10, color: "#e8e6e0", fontSize: 14, padding: 14, resize: "vertical", outline: "none", boxSizing: "border-box", lineHeight: 1.6 }}
          />
        </div>

        {/* Style selector */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: "#888", letterSpacing: 0.5, display: "block", marginBottom: 8 }}>СТИЛЬ</label>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {Object.entries(STYLES).map(([key, s]) => {
              const active = styleKey === key;
              return (
                <button key={key} onClick={() => setStyleKey(key)} style={{ flex: 1, minWidth: 140, background: active ? "#7c5cfc22" : "#18181f", border: `1px solid ${active ? "#7c5cfc" : "#2a2a35"}`, borderRadius: 10, padding: "10px 14px", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                  <div style={{ fontSize: 15, marginBottom: 3 }}>
                    <span style={{ marginRight: 6 }}>{s.icon}</span>
                    <span style={{ fontWeight: 600, color: active ? "#c4b5fd" : "#ccc" }}>{s.label}</span>
                  </div>
                  <div style={{ fontSize: 12, color: active ? "#9b7ffe99" : "#666", lineHeight: 1.4 }}>{s.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Volume selector */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: "#888", letterSpacing: 0.5, display: "block", marginBottom: 8 }}>ОБЪЁМ</label>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {Object.entries(VOLUME_OPTIONS).map(([key, v]) => {
              const active = volume === key;
              const accentColor = key === "shrink" ? "#fc8c5c" : key === "expand" ? "#5cfc8a" : "#7c5cfc";
              return (
                <button key={key} onClick={() => setVolume(key)} style={{ flex: 1, minWidth: 120, background: active ? `${accentColor}18` : "#18181f", border: `1px solid ${active ? accentColor : "#2a2a35"}`, borderRadius: 10, padding: "10px 14px", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                  <div style={{ fontSize: 15, marginBottom: 3, display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: active ? accentColor : "#555", letterSpacing: 0, border: `1px solid ${active ? accentColor : "#333"}`, borderRadius: 4, padding: "1px 6px", transition: "all 0.15s" }}>{v.icon}</span>
                    <span style={{ fontWeight: 600, color: active ? accentColor : "#ccc", fontSize: 14 }}>{v.label}</span>
                  </div>
                  <div style={{ fontSize: 12, color: active ? `${accentColor}99` : "#555", lineHeight: 1.4, paddingLeft: 2 }}>{v.hint}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Controls row */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ background: "#18181f", border: "1px solid #2a2a35", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 180 }}>
            <span style={{ fontSize: 13, color: "#aaa", whiteSpace: "nowrap" }}>Проходов:</span>
            {[1, 2, 3].map((n) => (
              <button key={n} onClick={() => setPasses(n)} style={{ width: 34, height: 34, borderRadius: 7, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, background: passes === n ? "#7c5cfc" : "#2a2a35", color: passes === n ? "#fff" : "#888", transition: "all 0.15s" }}>{n}</button>
            ))}
          </div>

          <Toggle active={keepLists} onClick={() => setKeepLists((f) => !f)} icon="📋" label="Сохранять списки" />
          <Toggle active={factCheck} onClick={() => setFactCheck((f) => !f)} icon="🔍" label="Проверить факты" />
        </div>

        {/* Run button */}
        <button
          onClick={run}
          disabled={running || !input.trim()}
          style={{
            width: "100%", padding: "14px 0", borderRadius: 10, border: "none",
            background: running || !input.trim() ? "#2a2a35" : "linear-gradient(135deg, #7c5cfc, #5c8afc)",
            color: running || !input.trim() ? "#555" : "#fff",
            fontSize: 15, fontWeight: 600, cursor: running || !input.trim() ? "not-allowed" : "pointer",
            transition: "all 0.2s", marginBottom: 20,
          }}
        >
          {running ? "Обрабатываю..." : "Перефразировать"}
        </button>

        {/* Log */}
        {log.length > 0 && (
          <div
            ref={logRef}
            style={{ background: "#18181f", border: "1px solid #2a2a35", borderRadius: 10, padding: "12px 16px", marginBottom: 20, maxHeight: 120, overflowY: "auto" }}
          >
            {log.map((entry, i) => (
              <div key={i} style={{ fontSize: 12, lineHeight: 1.8, color: entry.type === "success" ? "#5cfc8a" : entry.type === "error" ? "#fc5c5c" : "#888" }}>
                {entry.msg}
              </div>
            ))}
          </div>
        )}

        {/* Pass results */}
        {passResults.map((r, i) => (
          <PassBlock key={i} label={r.label} text={r.text} />
        ))}

        {/* Fact check result */}
        {factResult && (
          <div style={{ marginTop: 20 }}>
            <label style={{ fontSize: 12, color: "#888", letterSpacing: 0.5, display: "block", marginBottom: 8 }}>🔍 ПРОВЕРКА ФАКТОВ</label>
            <div style={{ background: "#18181f", border: "1px solid #2a2a35", borderRadius: 10, padding: 16, fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap", color: "#e8e6e0" }}>
              {factResult}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
