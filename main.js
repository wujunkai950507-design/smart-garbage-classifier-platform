// ===== 簡單垃圾分類規則 =====
// 回傳：{ label: '一般垃圾', code: 1, tags: ['說明...'] }

function classifyGarbage(text) {
  const t = text.trim();

  if (!t) {
    return null;
  }

  const lower = t.toLowerCase();

  // --- 有害垃圾 ---
  if (t.includes("電池") || t.includes("燈泡") || t.includes("水銀") || t.includes("藥品")) {
    return {
      label: "有害垃圾",
      code: 4,
      tags: ["需特別處理", "避免污染環境"]
    };
  }

  // --- 廚餘 ---
  if (t.includes("剩飯") || t.includes("菜葉") || t.includes("水果皮") || t.includes("廚餘") || t.includes("骨頭")) {
    return {
      label: "廚餘",
      code: 3,
      tags: ["適合生物分解", "可再利用"]
    };
  }

  // --- 資源回收 ---
  if (
    t.includes("寶特瓶") || t.includes("瓶") || t.includes("鋁罐") || t.includes("鐵罐") ||
    t.includes("紙箱") || t.includes("紙類") || t.includes("紙杯") ||
    t.includes("玻璃") || t.includes("回收")
  ) {
    return {
      label: "可回收垃圾",
      code: 2,
      tags: ["可再利用資源", "宜清洗後再回收"]
    };
  }

  // --- 牙膏、紙餐盒這種容易搞混的 ---
  if (t.includes("牙膏") || t.includes("牙膏皮") || t.includes("紙餐盒") || t.includes("飲料杯")) {
    return {
      label: "一般垃圾",
      code: 1,
      tags: ["常見模糊垃圾", "以本校/一般規則視為一般垃圾"]
    };
  }

  // 預設
  return {
    label: "一般垃圾",
    code: 1,
    tags: ["暫以一般垃圾處理", "可再搭配校方規定查詢"]
  };
}

// ===== DOM 操作 =====

const inputEl = document.getElementById("garbageInput");
const btnEl = document.getElementById("classifyBtn");
const resultBox = document.getElementById("resultBox");
const historyList = document.getElementById("historyList");

const history = [];

function renderResult(result, text) {
  resultBox.innerHTML = "";

  if (!result) {
    resultBox.innerHTML = '<p class="placeholder">請先輸入垃圾描述。</p>';
    return;
  }

  const label = document.createElement("div");
  label.className = "result-label";
  label.textContent = "系統分類結果：";

  const main = document.createElement("div");
  main.className = "result-main";
  main.textContent = `${result.label}`;

  const code = document.createElement("div");
  code.className = "result-code";
  code.textContent = `分類代碼：${result.code}`;

  resultBox.appendChild(label);
  resultBox.appendChild(main);
  resultBox.appendChild(code);

  // Tags
  result.tags.forEach((t) => {
    const tag = document.createElement("span");
    tag.className = "tag " + getTagClass(result.label);
    tag.textContent = t;
    resultBox.appendChild(tag);
  });
}

function getTagClass(label) {
  switch (label) {
    case "可回收垃圾":
      return "tag-recycle";
    case "廚餘":
      return "tag-food";
    case "有害垃圾":
      return "tag-danger";
    default:
      return "tag-normal";
  }
}

function renderHistory() {
  historyList.innerHTML = "";

  if (history.length === 0) {
    const li = document.createElement("li");
    li.className = "placeholder";
    li.textContent = "尚無紀錄。";
    historyList.appendChild(li);
    return;
  }

  history.slice().reverse().forEach((item) => {
    const li = document.createElement("li");

    const head = document.createElement("div");
    head.className = "history-item-head";

    const left = document.createElement("span");
    left.textContent = `分類：${item.result.label}（代碼 ${item.result.code}）`;

    const time = document.createElement("span");
    time.className = "history-time";
    time.textContent = item.time;

    head.appendChild(left);
    head.appendChild(time);

    const text = document.createElement("div");
    text.className = "history-text";
    text.textContent = "描述：" + item.text;

    li.appendChild(head);
    li.appendChild(text);
    historyList.appendChild(li);
  });
}

btnEl.addEventListener("click", () => {
  const text = inputEl.value;
  const result = classifyGarbage(text);

  renderResult(result, text);

  if (result) {
    const now = new Date();
    const timeString = now.toLocaleString("zh-TW", {
      hour12: false
    });

    history.push({
      text,
      result,
      time: timeString
    });

    renderHistory();
    inputEl.value = "";
  }
});
