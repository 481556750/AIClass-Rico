/* ============================================================
   人人 AI 通识课 · 电子证书 certificate.js
   纯原生 JS，无依赖；本地生成，不上传姓名
   ============================================================ */
(function () {
  "use strict";

  const root = document.querySelector("[data-cert]");
  if (!root) return;

  const mode = root.dataset.mode || "lesson";
  const LS_NAME = "aic-cert-name";
  let certName = "AI 学习者";

  try {
    const saved = localStorage.getItem(LS_NAME);
    if (saved) certName = saved;
  } catch (e) {}

  function readProgress() {
    let data = {};
    try { data = JSON.parse(localStorage.getItem("aic-progress")) || {}; } catch (e) {}
    let total = 21, done = 0;
    if (typeof allLessons === "function") {
      const list = allLessons().filter(l => l.ready);
      total = list.length;
      done = list.filter(l => data[l.id]).length;
    }
    return { total: total, done: done, data: data };
  }

  function todayText() {
    const d = new Date();
    return d.getFullYear() + " 年 " + (d.getMonth() + 1) + " 月 " + d.getDate() + " 日";
  }

  function certNo() {
    const d = new Date();
    const pad = n => (n < 10 ? "0" : "") + n;
    return "NO. AIC-" + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());
  }

  function displayName() {
    const n = certName.trim();
    return n || "AI 学习者";
  }

  function bodyText() {
    const p = readProgress();
    if (p.done >= p.total) {
      return "已完成《人人 AI 通识课》全部 " + p.total + " 节互动课程，并制定了自己的 30 天 AI 行动计划。";
    }
    if (p.data["20"]) {
      return "已完成《人人 AI 通识课》结业课的学习，并制定了自己的 30 天 AI 行动计划。";
    }
    return "正在学习《人人 AI 通识课》，并制定了自己的 30 天 AI 行动计划。";
  }

  function statusText() {
    const p = readProgress();
    if (p.done >= p.total) {
      return "🎉 已通关全部 " + p.total + " 节 · 这张证书完整生效";
    }
    return "已通关 " + p.done + " / " + p.total + " 节 · 学完全部课程，证书会显示完整结业字样";
  }

  function cardHtml() {
    return '<div class="certificate cert-card" aria-label="结业证书预览">' +
      '<div class="cert-deco cert-deco-a"></div>' +
      '<div class="cert-deco cert-deco-b"></div>' +
      '<div class="cert-inner">' +
        '<span class="cert-eyebrow">CERTIFICATE OF COMPLETION</span>' +
        '<p class="cert-brand">人人 AI 通识课 · 21 节互动课</p>' +
        '<h2>结业证书</h2>' +
        '<p class="cert-sub">This certifies that</p>' +
        '<p class="cert-name js-cert-name">AI 学习者</p>' +
        '<p class="cert-text js-cert-text"></p>' +
        '<div class="cert-meta">' +
          '<span>课程发起人：小艾</span>' +
          '<span class="js-cert-date">' + todayText() + '</span>' +
        '</div>' +
        '<div class="cert-seal"><span>AI</span><small>毕业生</small></div>' +
        '<span class="cert-no js-cert-no">' + certNo() + '</span>' +
      '</div>' +
    '</div>';
  }

  function nameFieldHtml() {
    return '<label class="cert-field">' +
      '<span>证书上的名字</span>' +
      '<input class="js-cert-name-input" type="text" maxlength="20" value="" placeholder="例如：王阿姨 / 乐乐" autocomplete="off">' +
      '<small>只保存在你自己的浏览器里</small>' +
    '</label>';
  }

  function toolsHtml() {
    if (mode === "page") {
      return '<div class="cert-tools">' +
        '<button type="button" class="btn btn-primary js-cert-save">⬇️ 保存图片</button>' +
        '<button type="button" class="btn btn-ghost js-cert-print">🖨️ 打印 / 存 PDF</button>' +
        '<button type="button" class="btn btn-ghost js-cert-copy">📋 复制分享文案</button>' +
      '</div>';
    }
    return '<div class="cert-tools">' +
      '<button type="button" class="btn btn-primary js-cert-save">⬇️ 保存图片</button>' +
      '<button type="button" class="btn btn-ghost js-cert-copy">📋 复制分享文案</button>' +
      '<a class="btn btn-ghost" href="../certificate.html">独立证书页 ↗</a>' +
    '</div>';
  }

  function build() {
    if (mode === "page") {
      root.innerHTML =
        '<div class="cert-page-grid">' +
          '<div class="cert-preview">' + cardHtml() + '</div>' +
          '<aside class="cert-side">' +
            '<div class="cert-form-card">' +
              '<span class="guess-round-tag">🎓 结业证书 · 本地生成</span>' +
              '<h2>把名字写上去</h2>' +
              '<p class="cert-form-lead">输入你的名字，证书会实时更新。保存的图片不上传，也不会离开这台设备。</p>' +
              nameFieldHtml() +
              toolsHtml() +
              '<p class="cert-status js-cert-status"></p>' +
              '<p class="cert-local-note">🔒 姓名只写入本地 localStorage；换设备不会同步。</p>' +
            '</div>' +
            '<div class="cert-help">' +
              '<b>怎么用？</b>' +
              '<ol>' +
                '<li>输入名字，点「保存图片」。</li>' +
                '<li>想打印就点「打印 / 存 PDF」。</li>' +
                '<li>发朋友圈时，配一句你的 30 天计划。</li>' +
              '</ol>' +
              '<p>还没学完？先去 <a href="lessons/lesson-20.html">第 20 课</a> 做一张 30 天计划。</p>' +
            '</div>' +
          '</aside>' +
        '</div>';
    } else {
      root.innerHTML =
        '<div class="cert-widget-head">' +
          '<div><span class="guess-round-tag">🎓 电子证书 · 可截图分享</span><h3>给你的学习留个纪念</h3></div>' +
          '<span class="cert-widget-badge">21 节 · AI 毕业生</span>' +
        '</div>' +
        '<div class="cert-form-row">' + nameFieldHtml() + toolsHtml() + '</div>' +
        cardHtml() +
        '<p class="cert-status js-cert-status"></p>' +
        '<p class="cert-local-note">🔒 证书在本地生成，姓名只保存在这台设备。</p>';
    }

    const input = root.querySelector(".js-cert-name-input");
    input.value = certName === "AI 学习者" ? "" : certName;
    input.addEventListener("input", () => {
      certName = input.value;
      try { localStorage.setItem(LS_NAME, certName); } catch (e) {}
      paint();
    });

    root.querySelector(".js-cert-save").addEventListener("click", savePng);
    root.querySelector(".js-cert-copy").addEventListener("click", copyShare);
    const print = root.querySelector(".js-cert-print");
    if (print) print.addEventListener("click", () => window.print());

    paint();
  }

  function paint() {
    const nameEl = root.querySelector(".js-cert-name");
    const textEl = root.querySelector(".js-cert-text");
    const dateEl = root.querySelector(".js-cert-date");
    const noEl = root.querySelector(".js-cert-no");
    const statusEl = root.querySelector(".js-cert-status");
    if (nameEl) nameEl.textContent = displayName();
    if (textEl) textEl.textContent = bodyText();
    if (dateEl) dateEl.textContent = todayText();
    if (noEl) noEl.textContent = certNo();
    if (statusEl) statusEl.textContent = statusText();
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function wrapText(ctx, text, maxWidth) {
    // 优先在标点处换行，避免把「行动计划」这类词拆开
    const parts = text.match(/[^，。；、！？]+[，。；、！？]?/g) || [text];
    const out = [];
    let line = "";
    parts.forEach(part => {
      if (line && ctx.measureText(line + part).width > maxWidth) {
        out.push(line);
        line = part;
      } else {
        line += part;
      }
    });
    if (line) out.push(line);

    // 极端长句兜底：按字符再拆一遍
    const safe = [];
    out.forEach(row => {
      if (ctx.measureText(row).width <= maxWidth) {
        safe.push(row);
        return;
      }
      let cur = "";
      for (let i = 0; i < row.length; i++) {
        if (cur && ctx.measureText(cur + row[i]).width > maxWidth) {
          safe.push(cur);
          cur = row[i];
        } else {
          cur += row[i];
        }
      }
      if (cur) safe.push(cur);
    });
    return safe;
  }

  function drawCanvas() {
    const W = 1400, H = 990;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const ctx = c.getContext("2d");
    const font = '"Microsoft YaHei", "PingFang SC", "Segoe UI", sans-serif';

    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#FBF7EE");
    bg.addColorStop(0.55, "#F7F1FB");
    bg.addColorStop(1, "#F2EDFF");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "#6D5AE6";
    ctx.lineWidth = 12;
    ctx.strokeRect(44, 44, W - 88, H - 88);
    ctx.strokeStyle = "#C9BFF5";
    ctx.lineWidth = 2;
    ctx.strokeRect(66, 66, W - 132, H - 132);

    ctx.fillStyle = "rgba(109,90,230,.08)";
    ctx.beginPath();
    ctx.arc(120, 160, 120, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(W - 120, H - 150, 150, 0, Math.PI * 2);
    ctx.fill();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "#6D5AE6";
    ctx.font = "700 22px " + font;
    ctx.fillText("人人 AI 通识课 · 21 节互动课", W / 2, 132);

    ctx.fillStyle = "#2C2430";
    ctx.font = "900 82px " + font;
    ctx.fillText("结业证书", W / 2, 230);

    ctx.fillStyle = "#8A8198";
    ctx.font = "italic 24px Georgia, serif";
    ctx.fillText("CERTIFICATE OF COMPLETION", W / 2, 290);

    ctx.strokeStyle = "#D8CCF0";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(470, 330);
    ctx.lineTo(930, 330);
    ctx.stroke();

    ctx.fillStyle = "#6B6478";
    ctx.font = "400 25px " + font;
    ctx.fillText("This certifies that", W / 2, 382);

    const name = displayName();
    ctx.fillStyle = "#5B43C7";
    let nameSize = 64;
    ctx.font = "900 " + nameSize + "px " + font;
    while (ctx.measureText(name).width > 820 && nameSize > 34) {
      nameSize -= 2;
      ctx.font = "900 " + nameSize + "px " + font;
    }
    ctx.fillText(name, W / 2, 462);

    ctx.strokeStyle = "#C9BFF5";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(520, 512);
    ctx.lineTo(880, 512);
    ctx.stroke();

    ctx.fillStyle = "#514A5E";
    ctx.font = "400 27px " + font;
    const lines = wrapText(ctx, bodyText(), 920);
    const startY = 562;
    lines.forEach((line, i) => ctx.fillText(line, W / 2, startY + i * 44));

    ctx.font = "400 23px " + font;
    ctx.fillStyle = "#7C748A";
    ctx.textAlign = "left";
    ctx.fillText("课程发起人：小艾", 140, 830);
    ctx.textAlign = "right";
    ctx.fillText(todayText(), W - 140, 830);
    ctx.textAlign = "center";

    ctx.fillStyle = "#B08A3E";
    ctx.beginPath();
    ctx.arc(1150, 700, 72, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#F3E4BC";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(1150, 700, 58, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#FFF9EA";
    ctx.font = "900 26px " + font;
    ctx.fillText("AI", 1150, 678);
    ctx.font = "700 18px " + font;
    ctx.fillText("毕业生", 1150, 714);

    ctx.textAlign = "left";
    ctx.fillStyle = "#A49BB3";
    ctx.font = "400 19px " + font;
    ctx.fillText(certNo(), 140, 900);

    ctx.textAlign = "center";
    ctx.fillStyle = "#B8AEC9";
    ctx.font = "400 17px " + font;
    ctx.fillText("新时代的工具，动手去用 · 人人 AI 通识课", W / 2, 906);

    return c;
  }

  function safeFileName() {
    return displayName().replace(/[\\/:*?"<>|]/g, "").slice(0, 20) || "学习者";
  }

  function savePng() {
    const c = drawCanvas();
    const filename = "人人AI通识课-结业证书-" + safeFileName() + ".png";
    function done(url) {
      const a = document.createElement("a");
      a.download = filename;
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.dispatchEvent(new CustomEvent("aic-toast", { detail: "证书图片已开始下载" }));
    }
    if (c.toBlob) {
      c.toBlob(blob => {
        if (!blob) { done(c.toDataURL("image/png")); return; }
        const url = URL.createObjectURL(blob);
        done(url);
        setTimeout(() => URL.revokeObjectURL(url), 3000);
      }, "image/png");
    } else {
      done(c.toDataURL("image/png"));
    }
  }

  function copyShare() {
    const p = readProgress();
    const txt = "我在《人人 AI 通识课》完成了一次学习打卡 🎓\n" +
      "已通关 " + p.done + " / " + p.total + " 节，接下来按自己的 30 天 AI 行动计划继续动手。\n" +
      "工具都一样，就看谁更擅长用。\n#人人AI通识课 #AI学习";
    function ok() {
      window.dispatchEvent(new CustomEvent("aic-toast", { detail: "分享文案已复制" }));
    }
    function fallback() {
      const ta = document.createElement("textarea");
      ta.value = txt;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      let success = false;
      try { success = document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta);
      if (success) ok();
      else window.dispatchEvent(new CustomEvent("aic-toast", { detail: "复制失败，请手动选中文字" }));
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(ok).catch(fallback);
    } else {
      fallback();
    }
  }

  window.addEventListener("aic-progress-change", paint);

  build();
})();
