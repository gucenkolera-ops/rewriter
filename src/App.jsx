import { useState, useRef } from "react";

const STYLES = {
  formal: {
    label: "Деловой",
    icon: "💼",
    desc: "Чётко и грамотно, без канцелярщины",
    passes: [
      (text) => `Перепиши следующий текст в деловом, но живом стиле. Никакой канцелярщины, штампов и заумных терминов — пиши так, как говорит грамотный специалист на планёрке: чётко, по делу, понятно. Структуру и смысл сохрани полностью. ВАЖНО: объём результата должен быть примерно равен исходному (${text.length} симв.) — не короче. Только текст, без пояснений.\n\nТекст:\n${text}`,
      (text) => `Этот деловой текст звучит немного сухо — добавь живости. Пусть за словами чувствуется человек: чуть неравномерный ритм, иногда короткое предложение после длинного, убери все шаблонные связки. Стиль остаётся профессиональным, но не казённым. ВАЖНО: объём результата должен быть примерно равен исходному (${text.length} симв.) — не короче. Только текст.\n\nТекст:\n${text}`,
      (text) => `Финальная правка делового текста: убери повторы, выровняй ритм, сделай переходы между мыслями плавными. Результат должен читаться легко и звучать как живая речь умного человека — не как отчёт. ВАЖНО: объём результата должен быть примерно равен исходному (${text.length} симв.) — не короче. Только текст.\n\nТекст:\n${text}`
    ]
  },
  neutral: {
    label: "Нейтральный",
    icon: "📝",
    desc: "Подойдёт для учёбы и работы",
    passes: [
      (text) => `Перепиши следующий текст своими словами. Стиль — нейтральный, грамотный, подойдёт для учебной или рабочей работы. Не слишком официально, не слишком разговорно. Меняй структуру предложений, убирай шаблоны, но сохраняй смысл и факты. ВАЖНО: объём результата должен быть примерно равен исходному (${text.length} симв.) — не короче. Никаких пояснений — только текст.\n\nТекст:\n${text}`,
      (text) => `Этот текст написан нейросетью — сделай его более естественным. Добавь неравномерный ритм (короткие и длинные предложения вперемешку), убери клише. Пиши как человек, который хорошо учился, но не говорит как робот. ВАЖНО: объём результата должен быть примерно равен исходному (${text.length} симв.) — не короче. Только текст, без пояснений.\n\nТекст:\n${text}`,
      (text) => `Доработай текст: убери повторы слов, сделай переходы плавными, добавь чуть больше авторского голоса. Текст должен звучать как написанный живым человеком, при этом оставаться подходящим для учёбы или работы. ВАЖНО: объём результата должен быть примерно равен исходному (${text.length} симв.) — не короче. Только текст.\n\nТекст:\n${text}`
    ]
  },
  lively: {
    label: "Живой",
    icon: "✨",
    desc: "Максимально человечно, без сленга",
    passes: [
      (text) => `Перепиши следующий текст максимально живым языком. Пиши так, как умный человек рассказывает что-то интересное другу — просто, образно, с характером. Без сленга и грубостей, но очень по-человечески: можно чуть иронии, можно разговорные обороты. Смысл и факты сохрани. ВАЖНО: объём результата должен быть примерно равен исходному (${text.length} симв.) — не короче. Только текст.\n\nТекст:\n${text}`,
      (text) => `Этот текст всё ещё звучит немного искусственно — сделай его по-настоящему живым. Неравномерный ритм, личные интонации, местами короткий удар после длинной фразы. Пиши как человек, у которого есть своё мнение и манера говорить — но без жаргона. ВАЖНО: объём результата должен быть примерно равен исходному (${text.length} симв.) — не короче. Только текст.\n\nТекст:\n${text}`,
      (text) => `Финальная шлифовка: убери повторы, добавь плавности между мыслями, усиль индивидуальность стиля. Текст должен читаться на одном дыхании — живо, по-человечески, с характером, но без панибратства. ВАЖНО: объём результата должен быть примерно равен исходному (${text.length} симв.) — не короче. Только текст.\n\nТекст:\n${text}`
    ]
  }
};

const PASS_LABELS = ["Проход 1 — Перефразировка", "Проход 2 — Очеловечивание", "Проход 3 — Финал"];

const FACT_CHECK_PROMPT = (text) =>
  `Проверь фактическую достоверность следующего текста. Укажи конкретно:\n1. Какие утверждения точны\n2. Какие вызывают сомнения или могут быть неточными\n3. Что стоит уточнить или проверить\n\nБудь конкретен. Верни структурированный ответ.\n\nТекст:\n${text}`;

async function callClaude(prompt) {
  const response = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await response.json();
  return data.content.map(b => b.text || "").join("");
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

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={handle} style={{
      background: copied ? "#5cfc8a22" : "#2a2a35",
      border: `1px solid ${copied ? "#5cfc8a44" : "transparent"}`,
      borderRadius: 6,
      padding: "5px 12px",
      color: copied ? "#5cfc8a" : "#aaa",
      fontSize: 12,
      cursor: "pointer",
      transition: "all 0.2s"
    }}>{copied ? "Скопировано ✓" : "Копировать"}</button>
  );
}

function PassBlock({ label, text }) {
  const ref = useRef(null);
  const [selected, setSelected] = useState(false);

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

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8
      }}>
        <label style={{ fontSize: 12, color: "#888", letterSpacing: 0.5 }}>{label.toUpperCase()}</label>
        <button onClick={selectAll} style={{
          background: selected ? "#5cfc8a22" : "#2a2a35",
          border: `1px solid ${selected ? "#5cfc8a44" : "transparent"}`,
          borderRadius: 6,
          padding: "5px 12px",
          color: selected ? "#5cfc8a" : "#aaa",
          fontSize: 12,
          cursor: "pointer",
          transition: "all 0.2s"
        }}>{selected ? "Выделено ✓" : "Выделить всё"}</button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        style={{
          background: "#18181f",
          border: "1px solid #2a2a35",
          borderRadius: 10,
          padding: 16,
          fontSize: 14,
          lineHeight: 1.7,
          whiteSpace: "pre-wrap",
          color: "#e8e6e0",
          outline: "none",
          userSelect: "text",
          WebkitUserSelect: "text"
        }}
      >{text}</div>
    </div>
  );
}

export default function App() {
  const [input, setInput] = useState("");
  const [passes, setPasses] = useState(3);
  const [styleKey, setStyleKey] = useState("neutral");
  const [factCheck, setFactCheck] = useState(false);
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState([]);
  const [passResults, setPassResults] = useState([]);
  const [factResult, setFactResult] = useState("");
  const logRef = useRef(null);

  const addLog = (msg, type = "info") => {
    setLog(prev => [...prev, { msg, type }]);
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
        current = await callClaude(actualPasses[i](current));
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

  const finalText = passResults.length > 0 ? passResults[passResults.length - 1].text : "";

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f0f13",
      color: "#e8e6e0",
      fontFamily: "'Inter', system-ui, sans-serif",
      padding: "24px 16px"
    }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            display: "inline-block",
            background: "#7c5cfc22",
            border: "1px solid #7c5cfc44",
            borderRadius: 6,
            padding: "3px 10px",
            fontSize: 11,
            color: "#9b7ffe",
            letterSpacing: 1,
            textTransform: "uppercase",
            marginBottom: 10
          }}>Рерайтер</div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#fff" }}>
            Перефразировка текста
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: 14, color: "#888" }}>
            Несколько проходов через ИИ — текст становится живым и человечным
          </p>
        </div>

        {/* Input */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <label style={{ fontSize: 12, color: "#888", letterSpacing: 0.5 }}>ИСХОДНЫЙ ТЕКСТ</label>
            {input && (
              <button
                onClick={() => setInput("")}
                style={{
                  background: "none", border: "none", color: "#555",
                  fontSize: 18, cursor: "pointer", lineHeight: 1, padding: "0 4px"
                }}
                title="Очистить"
              >✕</button>
            )}
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Вставь текст сюда..."
            style={{
              width: "100%", minHeight: 180,
              background: "#18181f", border: "1px solid #2a2a35",
              borderRadius: 10, color: "#e8e6e0", fontSize: 14,
              padding: 14, resize: "vertical", outline: "none",
              boxSizing: "border-box", lineHeight: 1.6
            }}
          />
        </div>

        {/* Style selector */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: "#888", letterSpacing: 0.5, display: "block", marginBottom: 8 }}>СТИЛЬ</label>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {Object.entries(STYLES).map(([key, s]) => {
              const active = styleKey === key;
              return (
                <button
                  key={key}
                  onClick={() => setStyleKey(key)}
                  style={{
                    flex: 1,
                    minWidth: 140,
                    background: active ? "#7c5cfc22" : "#18181f",
                    border: `1px solid ${active ? "#7c5cfc" : "#2a2a35"}`,
                    borderRadius: 10,
                    padding: "10px 14px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s"
                  }}
                >
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

        {/* Controls */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{
            background: "#18181f", border: "1px solid #2a2a35",
            borderRadius: 10, padding: "10px 14px",
            display: "flex", alignItems: "center", gap: 12,
            flex: 1, minWidth: 200
          }}>
            <span style={{ fontSize: 13, color: "#aaa", whiteSpace: "nowrap" }}>Проходов:</span>
            {[1, 2, 3].map(n => (
              <button
                key={n}
                onClick={() => setPasses(n)}
                style={{
                  width: 34, height: 34, borderRadius: 7, border: "none",
                  cursor: "pointer", fontSize: 14, fontWeight: 600,
                  background: passes === n ? "#7c5cfc" : "#2a2a35",
                  color: passes === n ? "#fff" : "#888",
                  transition: "all 0.15s"
                }}
              >{n}</button>
            ))}
          </div>

          <button
            onClick={() => setFactCheck(f => !f)}
            style={{
              background: factCheck ? "#7c5cfc22" : "#18181f",
              border: `1px solid ${factCheck ? "#7c5cfc" : "#2a2a35"}`,
              borderRadius: 10, padding: "10px 16px",
              color: factCheck ? "#9b7ffe" : "#888",
              fontSize: 13, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 8,
              transition: "all 0.15s"
            }}
          >
            <span style={{ fontSize: 16 }}>{factCheck ? "✓" : "○"}</span>
            Проверка фактов
          </button>
        </div>

        {/* Run */}
        <button
          onClick={run}
          disabled={running || !input.trim()}
          style={{
            width: "100%", padding: "14px",
            background: running || !input.trim() ? "#2a2a35" : "#7c5cfc",
            border: "none", borderRadius: 10,
            color: running || !input.trim() ? "#555" : "#fff",
            fontSize: 15, fontWeight: 600,
            cursor: running || !input.trim() ? "not-allowed" : "pointer",
            marginBottom: 20, transition: "all 0.15s"
          }}
        >
          {running ? "Обрабатываю..." : "Запустить"}
        </button>

        {/* Log */}
        {log.length > 0 && (
          <div ref={logRef} style={{
            background: "#18181f", border: "1px solid #2a2a35",
            borderRadius: 10, padding: 14, marginBottom: 16,
            maxHeight: 120, overflowY: "auto"
          }}>
            {log.map((l, i) => (
              <div key={i} style={{
                fontSize: 13,
                color: l.type === "success" ? "#5cfc8a" : l.type === "error" ? "#fc5c5c" : "#888",
                padding: "2px 0"
              }}>{l.msg}</div>
            ))}
          </div>
        )}

        {/* Pass results */}
        {passResults.map((r, i) => (
          <PassBlock key={i} label={r.label} text={r.text} />
        ))}

        {finalText && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20, marginTop: 4 }}>
            <CopyBtn text={finalText} />
          </div>
        )}

        {factResult && (
          <PassBlock label="Проверка фактов" text={factResult} />
        )}

      </div>
    </div>
  );
}
