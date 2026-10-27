/* ============================================================
   人人 AI 通识课 · 主逻辑 app.js
   主题 / 字号 / 进度 / 导航 / 小艾 / 术语气泡 / 打卡
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));

  const LS_THEME = "aic-theme", LS_FONT = "aic-font", LS_PROG = "aic-progress", LS_ACT = "aic-actions-";

  /* ---------------- 小艾机器人 ---------------- */
  const ROBOT_SVG =
    '<svg viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<line x1="36" y1="8" x2="36" y2="15.5" stroke="#8B7CF6" stroke-width="3.2" stroke-linecap="round"/>' +
      '<circle cx="36" cy="6.5" r="4.2" fill="#FFB020"/>' +
      '<rect x="9" y="15.5" width="54" height="43" rx="16" fill="#8B7CF6"/>' +
      '<rect x="3.5" y="29" width="5.5" height="16" rx="2.6" fill="#6D5AE6"/>' +
      '<rect x="63" y="29" width="5.5" height="16" rx="2.6" fill="#6D5AE6"/>' +
      '<rect x="16.5" y="24" width="39" height="26.5" rx="11" fill="#181830"/>' +
      '<circle class="eye" cx="27.5" cy="36.5" r="4" fill="#FFFFFF"/>' +
      '<circle class="eye" cx="44.5" cy="36.5" r="4" fill="#FFFFFF"/>' +
      '<path d="M29.5 45 Q36 48.8 42.5 45" stroke="#7DE8D5" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
    '</svg>';

  function injectRobots() {
    $$(".aibot").forEach(el => {
      if (!el.dataset.robot) { el.innerHTML = ROBOT_SVG; el.dataset.robot = "1"; }
    });
  }

  /* ---------------- Toast ---------------- */
  let toastTimer = null;
  function toast(msg) {
    let el = $(".toast");
    if (!el) { el = document.createElement("div"); el.className = "toast"; document.body.appendChild(el); }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  }
  window.addEventListener("aic-toast", e => toast(e.detail));

  /* ---------------- 主题 ---------------- */
  function currentTheme() { return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light"; }
  function applyTheme(t) {
    if (t === "dark") document.documentElement.setAttribute("data-theme", "dark");
    else document.documentElement.removeAttribute("data-theme");
    const b = $("#theme-toggle");
    if (b) b.textContent = t === "dark" ? "☀️" : "🌙";
  }
  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem(LS_THEME); } catch (e) {}
    if (!saved && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) saved = "dark";
    applyTheme(saved === "dark" ? "dark" : "light");
    const b = $("#theme-toggle");
    if (b) b.addEventListener("click", () => {
      const next = currentTheme() === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem(LS_THEME, next); } catch (e) {}
    });
  }

  /* ---------------- 字号（三档） ---------------- */
  const FONT_NAMES = ["标准", "大", "特大"];
  function applyFont(lv, notify) {
    if (lv === 1) document.documentElement.removeAttribute("data-font");
    else document.documentElement.setAttribute("data-font", String(lv));
    const b = $("#font-toggle");
    if (b) { b.textContent = ["A", "A+", "A++"][lv - 1]; b.title = "调整字号（当前：" + FONT_NAMES[lv - 1] + "）"; }
    if (notify) toast("字号已切换为「" + FONT_NAMES[lv - 1] + "」");
  }
  function initFont() {
    let lv = 1;
    try { lv = parseInt(localStorage.getItem(LS_FONT), 10) || 1; } catch (e) {}
    if (lv < 1 || lv > 3) lv = 1;
    applyFont(lv, false);
    const b = $("#font-toggle");
    if (b) b.addEventListener("click", () => {
      lv = lv % 3 + 1;
      applyFont(lv, true);
      try { localStorage.setItem(LS_FONT, lv); } catch (e) {}
    });
  }

  /* ---------------- 进度 ---------------- */
  function getProgress() {
    try { return JSON.parse(localStorage.getItem(LS_PROG)) || {}; } catch (e) { return {}; }
  }
  function isDone(id) { return !!getProgress()[id]; }
  function setDone(id) {
    const p = getProgress(); p[id] = 1;
    try { localStorage.setItem(LS_PROG, JSON.stringify(p)); } catch (e) {}
  }
  function readyLessons() { return allLessons().filter(l => l.ready); }
  function doneCount() { return readyLessons().filter(l => isDone(l.id)).length; }

  /* ---------------- 徽章 ---------------- */
  const BADGES = [
    { id: "m1",   emoji: "🔍", name: "AI 观察员", desc: "通关模块一", module: "m1" },
    { id: "m2",   emoji: "🛠️", name: "AI 使用者", desc: "通关模块二", module: "m2" },
    { id: "m3",   emoji: "🎨", name: "AI 创作者", desc: "通关模块三", module: "m3" },
    { id: "m4",   emoji: "🛡️", name: "反诈卫士", desc: "通关模块四", module: "m4" },
    { id: "m5",   emoji: "🚴", name: "AI 合伙人", desc: "通关模块五", module: "m5" },
    { id: "grad", emoji: "🎓", name: "AI 毕业生", desc: "通关全部课程", module: null }
  ];

  function unlockedBadges() {
    const out = {};
    COURSE.modules.forEach(m => {
      const badge = BADGES.find(b => b.module === m.id);
      if (badge && m.lessons.length && m.lessons.every(l => l.ready && isDone(l.id))) out[badge.id] = true;
    });
    if (allLessons().length && allLessons().every(l => l.ready && isDone(l.id))) out.grad = true;
    return out;
  }

  function renderBadges() {
    const wrap = $("#badge-strip");
    if (!wrap) return;
    const un = unlockedBadges();
    wrap.innerHTML = BADGES.map(b => {
      const on = !!un[b.id];
      return '<div class="badge-item' + (on ? " on" : "") + '">' +
        '<span class="b-ico">' + b.emoji + '</span>' +
        '<span class="b-name">' + b.name + '</span>' +
        '<span class="b-sub">' + b.desc + '</span>' +
        (on ? '' : '<span class="b-lock">🔒</span>') +
      '</div>';
    }).join("");
    const cnt = $("#badge-count");
    if (cnt) cnt.textContent = BADGES.filter(b => un[b.id]).length;
  }

  function updateProgressUI() {
    const total = allLessons().length;
    const done = doneCount();
    const pct = Math.round(done / total * 100);
    $$(".js-course-progress").forEach(el => { el.style.width = pct + "%"; });
    const cnt = $(".js-course-count");
    if (cnt) cnt.textContent = "全课进度 " + done + " / " + total;
    const hp = $("#home-progress");
    if (hp) hp.style.width = pct + "%";
    const hpt = $("#home-progress-text");
    if (hpt) {
      hpt.textContent = done === 0
        ? "还没有开始——从第 0 课出发，10 分钟就能有第一个收获 🚀"
        : "已通关 " + done + " / " + total + " 节 · 继续保持！";
    }
    const s = $("#stat-progress");
    if (s) s.textContent = pct + "%";
  }

  /* ---------------- 课程地图（首页） ---------------- */
  function renderMap() {
    const wrap = $("#course-map");
    if (!wrap) return;
    wrap.innerHTML = COURSE.modules.map(m => {
      const allDone = m.lessons.every(l => l.ready && isDone(l.id));
      const cells = m.lessons.map(l => {
        const done = l.ready && isDone(l.id);
        const st = l.ready ? (done ? "已完成 ✓" : "开始") : "即将上线";
        const href = l.ready ? l.file : "#";
        return '<a class="lesson-card" href="' + href + '" data-ready="' + l.ready + '" data-done="' + done + '">' +
          '<span class="l-emoji">' + l.emoji + '</span>' +
          '<span class="l-body">' +
            '<span class="l-title">第 ' + Number(l.id) + ' 课 · ' + l.title + '</span>' +
            '<span class="l-meta">⏱ ' + l.minutes + ' 分钟 · ' + l.desc + '</span>' +
          '</span>' +
          '<span class="l-status' + (l.ready && !done ? " ready" : "") + '">' + st + '</span>' +
        '</a>';
      }).join("");
      const badge = BADGES.find(b => b.module === m.id);
      const doneMark = allDone
        ? '<span class="m-done">' + (badge ? "🏅 " + badge.name : "模块已通关 ✓") + '</span>'
        : "";
      return '<section class="module">' +
        '<h3 class="module-head"><span class="m-emoji">' + m.emoji + '</span>' + m.name +
          doneMark +
        '</h3>' + cells +
      '</section>';
    }).join("");
    updateProgressUI();
  }

  function initHome() {
    renderMap();
    renderBadges();
    const btn = $("#btn-continue");
    if (!btn) return;
    const next = allLessons().find(l => l.ready && !isDone(l.id));
    if (next) {
      btn.href = next.file;
      btn.textContent = "▶ 继续学习 · 第 " + Number(next.id) + " 课";
    } else if (readyLessons().every(l => isDone(l.id))) {
      btn.href = "certificate.html";
      btn.textContent = "🎓 全部通关！去领结业证书";
    } else {
      btn.href = "lessons/lesson-00.html";
    }
  }

  /* ---------------- 课程页：上下课导航 ---------------- */
  function renderLessonNav() {
    const nav = $("#lesson-nav");
    if (!nav) return;
    const cur = document.body.dataset.lesson;
    if (!cur) return;
    const list = allLessons();
    const i = list.findIndex(l => l.id === cur);
    const prev = list[i - 1];
    const next = list[i + 1];
    const prefix = location.pathname.indexOf("/lessons/") !== -1 ? "../" : "";

    let html = "";
    if (prev && prev.ready) {
      html += '<a class="prev" href="' + prefix + prev.file + '"><small>← 上一课</small><b>' + prev.emoji + ' ' + prev.title + '</b></a>';
    } else if (prev) {
      html += '<a class="prev" data-disabled="true"><small>← 上一课</small><b>' + prev.emoji + ' ' + prev.title + '（制作中）</b></a>';
    } else {
      html += '<a class="prev" href="' + prefix + 'index.html"><small>← 回到</small><b>🏠 课程地图</b></a>';
    }
    if (next && next.ready) {
      html += '<a class="next" href="' + prefix + next.file + '"><small>下一课 →</small><b>' + next.emoji + ' ' + next.title + '</b></a>';
    } else if (next) {
      html += '<a class="next" data-disabled="true"><small>下一课 →</small><b>' + next.emoji + ' ' + next.title + '（制作中）</b></a>';
    } else {
      html += '<a class="next" href="' + prefix + 'index.html"><small>完结 🎉</small><b>🏠 回到课程地图</b></a>';
    }
    nav.innerHTML = html;
  }

  /* ---------------- 课程页：完成打卡 ---------------- */
  function initComplete() {
    const btn = $("#btn-complete");
    if (!btn) return;
    const id = document.body.dataset.lesson;
    if (isDone(id)) {
      btn.classList.add("is-done"); btn.disabled = true;
      btn.textContent = "✅ 本课已完成打卡";
    }
    btn.addEventListener("click", () => {
      const before = unlockedBadges();
      setDone(id);
      const after = unlockedBadges();
      const total = allLessons().length;
      const done = doneCount();
      btn.classList.add("is-done"); btn.disabled = true;
      btn.textContent = "✅ 本课已完成打卡";
      updateProgressUI();
      renderBadges();
      window.dispatchEvent(new CustomEvent("aic-progress-change"));
      const got = BADGES.filter(b => after[b.id] && !before[b.id]);
      if (got.length) {
        toast("🏅 解锁徽章：" + got[0].emoji + " " + got[0].name + "！");
      } else {
        toast("🎉 打卡成功！全课进度 " + done + " / " + total);
      }
    });
  }

  /* ---------------- 课程页：行动清单勾选 ---------------- */
  function initActions() {
    const ul = $(".actions");
    if (!ul) return;
    const id = document.body.dataset.lesson;
    const key = LS_ACT + id;
    let saved = [];
    try { saved = JSON.parse(localStorage.getItem(key)) || []; } catch (e) {}
    $$("li", ul).forEach((li, i) => {
      if (saved.indexOf(i) !== -1) li.classList.add("done");
      li.addEventListener("click", () => {
        li.classList.toggle("done");
        const now = $$("li", ul).map((el, j) => el.classList.contains("done") ? j : null).filter(v => v !== null);
        try { localStorage.setItem(key, JSON.stringify(now)); } catch (e) {}
      });
    });
  }

  /* ---------------- 术语气泡 ---------------- */
  function initTerms() {
    let pop = null, src = null;
    document.addEventListener("click", e => {
      const t = e.target.closest(".term");
      if (pop && (t === src || !t)) { pop.remove(); pop = null; src = null; if (!t) return; }
      if (!t) return;
      pop = document.createElement("div");
      pop.className = "term-pop";
      pop.innerHTML = t.dataset.tip || "";
      document.body.appendChild(pop);
      const r = t.getBoundingClientRect();
      const pw = pop.offsetWidth, ph = pop.offsetHeight;
      let left = r.left + window.scrollX + r.width / 2 - pw / 2;
      const maxLeft = window.scrollX + document.documentElement.clientWidth - pw - 12;
      left = Math.max(12, Math.min(left, maxLeft));
      let top = r.bottom + window.scrollY + 10;
      pop.style.left = left + "px";
      pop.style.top = top + "px";
      src = t;
    });
  }

  /* ---------------- 出现动画 ---------------- */
  function initReveal() {
    const els = $$(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach(el => el.classList.add("in")); return; }
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.08 });
    els.forEach(el => io.observe(el));
  }

  /* ---------------- 启动 ---------------- */
  document.addEventListener("DOMContentLoaded", function () {
    injectRobots();
    initTheme();
    initFont();
    initReveal();
    initTerms();
    if (document.body.dataset.page === "home") initHome();
    updateProgressUI();
    if (document.body.dataset.lesson) {
      renderLessonNav();
      initComplete();
      initActions();
    }
  });
})();
