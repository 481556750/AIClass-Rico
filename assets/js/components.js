/* ============================================================
   人人 AI 通识课 · 互动组件 components.js
   纯原生 JS，无依赖；按页面里出现的容器自动挂载
   ============================================================ */
(function () {
  "use strict";

  /* ================= 小测验 ================= */
  function initQuiz(quiz) {
    const qs = Array.from(quiz.querySelectorAll(".q"));
    const scoreEl = quiz.querySelector(".quiz-score");
    let answered = 0, correct = 0;

    qs.forEach(q => {
      const opts = Array.from(q.querySelectorAll(".opt"));
      const explain = q.querySelector(".explain");
      opts.forEach(opt => {
        opt.addEventListener("click", () => {
          if (q.dataset.answered) return;
          q.dataset.answered = "1";
          const isRight = opt.dataset.correct === "true";
          if (isRight) { opt.classList.add("correct"); correct++; }
          else {
            opt.classList.add("wrong");
            const right = q.querySelector('.opt[data-correct="true"]');
            if (right) right.classList.add("correct");
          }
          opts.forEach(o => { o.disabled = true; });
          if (explain) explain.hidden = false;
          answered++;
          if (answered === qs.length && scoreEl) {
            scoreEl.hidden = false;
            const msg = correct === qs.length ? "全对！你就是本课的「课代表」🏆"
              : correct >= qs.length - 1 ? "很稳！基本都拿下了 👏"
              : "没关系——回到上面再看一眼，你一定行 💪";
            scoreEl.textContent = "答对 " + correct + " / " + qs.length + " 题 · " + msg;
          }
        });
      });
    });
  }

  /* ================= 猜词挑战（第 1 课） ================= */
  const GUESS_ROUNDS = [
    {
      sentence: '今天早餐我吃了一个 <span class="blank">___</span>',
      options: [
        { word: "包子", p: 58, ai: true },
        { word: "鸡蛋", p: 31 },
        { word: "星期六", p: 9 },
        { word: "电梯", p: 2 }
      ],
      note: "AI 的脑子里没有「标准答案」，只有「可能性大小」——这就是概率。它通常选可能性最大的那个。"
    },
    {
      sentence: '春天来了，公园里的花都 <span class="blank">___</span>',
      options: [
        { word: "开了", p: 71, ai: true },
        { word: "谢了", p: 22 },
        { word: "飞了", p: 4 },
        { word: "睡觉", p: 3 }
      ],
      note: "同一句话，合理的接法不止一种，所以每次问 AI，答案都可能不一样。"
    },
    {
      sentence: '妈妈喊我：快点起床，要 <span class="blank">___</span>',
      options: [
        { word: "迟到了", p: 64, ai: true },
        { word: "迟到啦", p: 21 },
        { word: "起床啦", p: 10 },
        { word: "起飞了", p: 5 }
      ],
      note: "它见过无数条「妈妈喊起床」的句子，所以接得又快又顺。"
    },
    {
      sentence: '我给我的小狗起名叫 <span class="blank">___</span>',
      options: [
        { word: "豆豆", p: 34, ai: true },
        { word: "旺财", p: 27 },
        { word: "大炮", p: 22 },
        { word: "阿黄", p: 17 }
      ],
      note: "可选答案太多时，AI 也只能凭经验瞎猜——所以让它起名、编故事，每次都不同，这很正常。"
    },
    {
      sentence: '圆周率 3.14 之后是 <span class="blank">___</span>',
      options: [
        { word: "15926……", p: 89, ai: true },
        { word: "99999……", p: 6 },
        { word: "8848……", p: 3 },
        { word: "00000……", p: 2 }
      ],
      note: "有确定答案的内容它几乎不会错——因为相关内容它「见过」太多次了。"
    }
  ];

  function initGuessGame(el) {
    let round = 0, hits = 0;
    const total = GUESS_ROUNDS.length;

    function render() {
      const r = GUESS_ROUNDS[round];
      el.innerHTML =
        '<div class="guess-round-tag">第 ' + (round + 1) + ' / ' + total + ' 轮 · 你先猜，再看 AI 怎么猜</div>' +
        '<p class="guess-sentence">' + r.sentence + '</p>' +
        '<div class="guess-opts">' +
        r.options.map((o, i) =>
          '<button class="guess-opt" data-i="' + i + '">' +
            '<span class="bar"></span>' +
            '<span class="pct" hidden>' + o.p + '%</span>' +
            '<span class="word">' + o.word + '</span>' +
          '</button>'
        ).join("") +
        '</div>' +
        '<p class="guess-note"></p>' +
        '<div class="guess-foot">' +
          '<span class="guess-score">你和 AI 心有灵犀：' + hits + ' / ' + total + '</span>' +
          '<button class="btn btn-primary guess-next" style="display:none">' + (round + 1 === total ? "看总结" : "下一轮 →") + '</button>' +
        '</div>';
      Array.from(el.querySelectorAll(".guess-opt")).forEach(btn => {
        btn.addEventListener("click", () => reveal(parseInt(btn.dataset.i, 10)));
      });
    }

    function reveal(i) {
      const r = GUESS_ROUNDS[round];
      const btns = Array.from(el.querySelectorAll(".guess-opt"));
      btns.forEach((b, j) => {
        b.disabled = true;
        const o = r.options[j];
        b.querySelector(".pct").hidden = false;
        const bar = b.querySelector(".bar");
        requestAnimationFrame(() => { bar.style.width = o.p + "%"; });
        if (o.ai) b.classList.add("ai-pick");
        if (j === i) b.classList.add("picked");
      });
      const aiIdx = r.options.findIndex(o => o.ai);
      const hit = i === aiIdx;
      if (hit) hits++;
      const note = el.querySelector(".guess-note");
      note.innerHTML = (hit ? "🎯 你猜中了 AI 的选择！" : "😄 你选了「" + r.options[i].word + "」，AI 选了「" + r.options[aiIdx].word + "」。") + r.note;
      note.classList.add("show");
      el.querySelector(".guess-score").textContent = "你和 AI 心有灵犀：" + hits + " / " + total;
      const next = el.querySelector(".guess-next");
      next.style.display = "";
      next.addEventListener("click", () => {
        if (round + 1 === total) finish();
        else { round++; render(); }
      }, { once: true });
    }

    function finish() {
      const msg = hits >= 4 ? "太神了，你和 AI 想到一块去了！"
        : hits >= 2 ? "不错，你已经开始像 AI 一样思考了。"
        : "正常！人类和 AI 的「脑回路」本来就是两套。";
      el.innerHTML =
        '<div class="guess-round-tag">挑战完成 🎉</div>' +
        '<p class="guess-sentence">你和 AI 心有灵犀：' + hits + ' / ' + total + '</p>' +
        '<div class="guess-note show">' +
          '你已经亲手体验了 AI 的核心思维：<b>根据见多识广，猜出最可能的下一句</b>。' + msg +
          '<br>顺便记一笔——它偶尔会猜得「一本正经地离谱」，那就是后面要讲的「幻觉」。' +
        '</div>' +
        '<div class="guess-foot">' +
          '<span class="guess-score">换个思路：手机输入法也是这么猜你打字的</span>' +
          '<button class="btn btn-ghost guess-again">再玩一次 ↻</button>' +
        '</div>';
      el.querySelector(".guess-again").addEventListener("click", () => { round = 0; hits = 0; render(); });
    }

    render();
  }

  /* ================= 段位测试（第 0 课） ================= */
  const LEVEL_ITEMS = [
    "我经常刷到 AI 的新闻，但还没真正用过它",
    "我用 AI 聊过天，问过它几个问题",
    "我让 AI 帮我写过东西、查过资料，或做过具体的事",
    "我让 AI 帮我搞过创作：文案、图片、故事、代码都算",
    "我心里攒着一些想法，正琢磨怎么用 AI 把它做出来"
  ];
  const LEVEL_RESULTS = [
    { icon: "🌱", name: "门口的观望者", desc: "AI 新闻看了不少，手还没动过。别慌——这门课就是为你准备的：下一课开始，10 分钟你就能上手。" },
    { icon: "🔥", name: "上道的尝鲜者", desc: "你已经和 AI 交过手，知道它几斤几两。把第 6 课的「提示词公式」学明白，你会突飞猛进。" },
    { icon: "🚀", name: "初代创作者", desc: "你不只是用 AI，已经在指挥 AI 干活了。直奔模块三的创作课，把你的想象力再放大一圈。" }
  ];

  function initLevelTest(el) {
    el.innerHTML =
      '<div class="guess-round-tag">选出所有符合你现状的（可多选，实话实说 😄）</div>' +
      '<div class="level-list">' +
      LEVEL_ITEMS.map((t, i) =>
        '<button class="level-item" data-i="' + i + '"><span class="box"></span><span>' + t + '</span></button>'
      ).join("") +
      '</div>' +
      '<button class="btn btn-primary" id="level-check">看看我的段位 →</button>' +
      '<div class="level-result"></div>';

    const chosen = new Set();
    Array.from(el.querySelectorAll(".level-item")).forEach(item => {
      item.addEventListener("click", () => {
        const i = item.dataset.i;
        if (chosen.has(i)) { chosen.delete(i); item.classList.remove("checked"); }
        else { chosen.add(i); item.classList.add("checked"); }
      });
    });

    el.querySelector("#level-check").addEventListener("click", () => {
      if (chosen.size === 0) {
        window.dispatchEvent(new CustomEvent("aic-toast", { detail: "先勾选至少一条，再揭晓段位 😉" }));
        return;
      }
      const lv = chosen.size <= 1 ? 0 : chosen.size <= 3 ? 1 : 2;
      const r = LEVEL_RESULTS[lv];
      const out = el.querySelector(".level-result");
      out.innerHTML = '<div class="lr-card"><h3>' + r.icon + ' 你是「' + r.name + '」</h3><p>' + r.desc + '</p></div>';
      out.classList.add("show");
      out.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  /* ================= 自动挂载 ================= */
  document.addEventListener("DOMContentLoaded", function () {
    Array.from(document.querySelectorAll(".quiz")).forEach(initQuiz);
    const g = document.getElementById("guess-game");
    if (g) initGuessGame(g);
    const lv = document.getElementById("level-test");
    if (lv) initLevelTest(lv);
  });
})();
