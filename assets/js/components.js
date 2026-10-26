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

  /* ================= 训练实验室（第 2 课） ================= */
  const TRAIN_BOOKS = [
    { id: "cat",    emoji: "📕", name: "《只有猫》",     desc: "只教猫一种",   know: ["猫"] },
    { id: "catdog", emoji: "📗", name: "《猫和狗》",     desc: "教猫和狗",     know: ["猫", "狗"] },
    { id: "all",    emoji: "📘", name: "《猫狗兔大全》", desc: "教猫、狗、兔", know: ["猫", "狗", "兔"] }
  ];
  const TRAIN_EXAM = [
    { emoji: "🐱", label: "猫" },
    { emoji: "🐶", label: "狗" },
    { emoji: "🐰", label: "兔" },
    { emoji: "🐟", label: "鱼" },
    { emoji: "🐦", label: "鸟" }
  ];
  const TRAIN_BAD_SAMPLES = [
    { emoji: "🐱", tag: "猫" },
    { emoji: "🐶", tag: "猫", wrong: true },
    { emoji: "🐱", tag: "猫" },
    { emoji: "🐶", tag: "猫", wrong: true }
  ];

  function initTrainer(el) {
    function choose() {
      el.innerHTML =
        '<div class="guess-round-tag">第 1 步 · 给小艾选一本教材</div>' +
        '<p class="train-lead">你教它什么，它才会什么。选一本，看看它学完能考几分。</p>' +
        '<div class="book-list">' +
        TRAIN_BOOKS.map((b, i) =>
          '<button class="book-opt" data-i="' + i + '">' +
            '<span class="b-emoji">' + b.emoji + '</span>' +
            '<span class="b-name">' + b.name + '</span>' +
            '<span class="b-desc">' + b.desc + '</span>' +
          '</button>'
        ).join("") +
        '</div>' +
        '<p class="game-tip" style="margin-top:12px">选中的教材，就是它的全部世界观。</p>';
      Array.from(el.querySelectorAll(".book-opt")).forEach(btn => {
        btn.addEventListener("click", () => {
          Array.from(el.querySelectorAll(".book-opt")).forEach(b => b.classList.remove("sel"));
          btn.classList.add("sel");
          train(TRAIN_BOOKS[parseInt(btn.dataset.i, 10)]);
        });
      });
    }

    function train(book) {
      el.innerHTML =
        '<div class="guess-round-tag">第 2 步 · 训练中</div>' +
        '<p class="train-lead">' + book.emoji + ' 小艾正在读' + book.name + '……</p>' +
        '<div class="train-bar"><i></i></div>' +
        '<p class="train-hint">它不是在背答案，而是在学「什么样的图配什么名字」。</p>';
      const bar = el.querySelector(".train-bar i");
      setTimeout(() => { bar.style.width = "100%"; }, 60);
      setTimeout(() => exam(book), 2000);
    }

    function exam(book) {
      const rows = TRAIN_EXAM.map(x => {
        const ok = book.know.indexOf(x.label) !== -1;
        return { emoji: x.emoji, label: x.label, ok: ok, ans: ok ? x.label : "猜成猫" };
      });
      const score = rows.filter(r => r.ok).length;
      const miss = rows.length - score;
      el.innerHTML =
        '<div class="guess-round-tag">第 3 步 · 考试</div>' +
        '<p class="train-lead">教材：' + book.emoji + ' ' + book.name + '。考官拿出 5 张新图，看它认不认得。</p>' +
        '<div class="exam-grid">' +
        rows.map((r, i) =>
          '<div class="exam-item ' + (r.ok ? "ok" : "bad") + '" style="animation-delay:' + (i * 0.12) + 's">' +
            '<span class="e-emoji">' + r.emoji + '</span>' +
            '<span class="e-ans">' + r.ans + '</span>' +
            '<span class="e-mark">' + (r.ok ? "✓" : "✗") + '</span>' +
          '</div>'
        ).join("") +
        '</div>' +
        '<div class="train-verdict">' +
          '<b>答对 ' + score + ' / 5</b> —— 教材里教过的 ' + score + ' 种全认对了；没教过的 ' + miss + ' 种，它只能硬猜。' +
        '</div>' +
        '<div class="guess-foot">' +
          '<span class="guess-score">想让它认识更多？得喂更多教材。</span>' +
          '<button class="btn btn-primary js-bad">那教材错了呢？→</button>' +
        '</div>';
      el.querySelector(".js-bad").addEventListener("click", badIntro);
    }

    function badIntro() {
      el.innerHTML =
        '<div class="guess-round-tag">彩蛋关 · 如果教材本身是错的</div>' +
        '<p class="train-lead">这次教材里混进了 2 张标错的图：明明是狗，却被标成了「猫」。小艾会学成什么样？</p>' +
        '<div class="sample-list">' +
        TRAIN_BAD_SAMPLES.map(s =>
          '<div class="sample-item' + (s.wrong ? " wrong" : "") + '">' +
            '<span class="s-emoji">' + s.emoji + '</span>' +
            '<span class="s-tag">标签：' + s.tag + '</span>' +
            (s.wrong ? '<span class="s-flag">标错了</span>' : '') +
          '</div>'
        ).join("") +
        '</div>' +
        '<div class="guess-foot">' +
          '<span class="guess-score">小艾不会怀疑教材，它只会照单全收。</span>' +
          '<button class="btn btn-primary js-train2">开始训练 →</button>' +
        '</div>';
      el.querySelector(".js-train2").addEventListener("click", function () {
        el.innerHTML =
          '<div class="guess-round-tag">训练中</div>' +
          '<div class="train-bar"><i></i></div>' +
          '<p class="train-hint">它正在把「猫」和这些图对上号……</p>';
        const bar = el.querySelector(".train-bar i");
        setTimeout(() => { bar.style.width = "100%"; }, 60);
        setTimeout(badExam, 1800);
      });
    }

    function badExam() {
      el.innerHTML =
        '<div class="guess-round-tag">考试结果</div>' +
        '<div class="bad-exam">' +
          '<span class="be-img">🐶</span>' +
          '<span class="be-arrow">→</span>' +
          '<span class="be-ans">小艾：这是「猫」</span>' +
          '<span class="be-mark">✗</span>' +
        '</div>' +
        '<div class="train-verdict">它把狗认成了猫——因为教材里就是这么教的。<b>AI 不会质疑教材，你教错，它就学错。</b></div>' +
        '<div class="guess-foot">' +
          '<span class="guess-score">所以：数据有偏见，AI 就有偏见。</span>' +
          '<button class="btn btn-primary js-done">我彻底懂了 →</button>' +
        '</div>';
      el.querySelector(".js-done").addEventListener("click", done);
    }

    function done() {
      el.innerHTML =
        '<div class="guess-round-tag">实验完成 🎉</div>' +
        '<div class="train-verdict">' +
          '<p><b>记住三件事：</b></p>' +
          '<p>1. AI 的知识来自「教材」，教材里没有的，它不会。</p>' +
          '<p>2. 教材有截止日期，所以它不知道最新的事（除非联网搜索）。</p>' +
          '<p>3. 教材错了、偏了，它就跟着错、跟着偏。</p>' +
        '</div>' +
        '<div class="guess-foot">' +
          '<span class="guess-score">这就是「AI 是学出来的」，不是查出来的。</span>' +
          '<button class="btn btn-ghost js-again">再玩一次 ↻</button>' +
        '</div>';
      el.querySelector(".js-again").addEventListener("click", choose);
    }

    choose();
  }

  /* ================= 分门别类（第 3 课） ================= */
  const SORT_BINS = [
    { id: "search", name: "🔍 搜索", hint: "找到已有的信息" },
    { id: "calc",   name: "🧮 计算", hint: "按规则算出数字" },
    { id: "gen",    name: "✨ 生成", hint: "现场造出新内容" }
  ];
  const SORT_CARDS = [
    { text: "查「附近哪里能修手机」",       bin: "search", why: "这是找一条已经存在的信息，搜索最快。" },
    { text: "算「三个人 AA 制每人多少」",   bin: "calc",   why: "纯算数，计算器最靠谱，也不会算错。" },
    { text: "写一条给朋友的生日祝福",       bin: "gen",    why: "要一段新的、带点心意的话——生成式 AI 的强项。" },
    { text: "查「某位明星的生日」",         bin: "search", why: "这是查一个既有事实，搜索还能给出处。" },
    { text: "把照片里乱入的路人去掉",       bin: "gen",    why: "要造出原本不存在的画面，属于生成。" },
    { text: "算「房贷每月要还多少」",       bin: "calc",   why: "套公式算数，计算器或表格更准。" },
    { text: "编一个哄孩子睡觉的故事",       bin: "gen",    why: "要现场编一个新故事——生成式 AI 的拿手好戏。" },
    { text: "查「明天会不会下雨」",         bin: "search", why: "查实时预报，搜索（或天气 App）才有最新数据。" }
  ];

  function initSorter(el) {
    let i = 0, mistakes = 0, locked = false;

    function show() {
      if (i >= SORT_CARDS.length) return finish();
      const c = SORT_CARDS[i];
      locked = false;
      el.innerHTML =
        '<div class="guess-round-tag">第 ' + (i + 1) + ' / ' + SORT_CARDS.length + ' 张 · 这张卡该交给谁？</div>' +
        '<div class="sort-card">' + c.text + '</div>' +
        '<div class="sort-bins">' +
        SORT_BINS.map(b =>
          '<button class="sort-bin" data-bin="' + b.id + '">' +
            '<span class="sb-name">' + b.name + '</span>' +
            '<span class="sb-hint">' + b.hint + '</span>' +
          '</button>'
        ).join("") +
        '</div>' +
        '<div class="sort-feedback"></div>';
      Array.from(el.querySelectorAll(".sort-bin")).forEach(btn => {
        btn.addEventListener("click", () => pick(btn.dataset.bin, btn));
      });
    }

    function pick(bin, btn) {
      if (locked) return;
      const c = SORT_CARDS[i];
      const fb = el.querySelector(".sort-feedback");
      if (bin === c.bin) {
        locked = true;
        btn.classList.add("right");
        fb.className = "sort-feedback show ok";
        fb.innerHTML = "✅ 对了！" + c.why +
          '<div class="sort-next"><button class="btn btn-primary">' +
          (i + 1 === SORT_CARDS.length ? "看总结 →" : "下一张 →") + '</button></div>';
        fb.querySelector(".btn").addEventListener("click", () => { i++; show(); });
      } else {
        mistakes++;
        btn.classList.remove("shake");
        void btn.offsetWidth;
        btn.classList.add("shake");
        fb.className = "sort-feedback show bad";
        fb.innerHTML = "再想想：这件事是要「找到现成的」，还是「算出个数」，还是「造一个新的」？";
      }
    }

    function finish() {
      const msg = mistakes === 0
        ? "全对！你已经是选工具的小行家了 🏆"
        : mistakes <= 2
          ? "很不错！错的那几张，记住一句话就行：要现成的找搜索，要新的找 AI。"
          : "没关系，记住这句口诀：查用搜索、算用计算器、造用 AI。";
      el.innerHTML =
        '<div class="guess-round-tag">分类完成 🎉</div>' +
        '<div class="train-verdict"><b>8 张卡片全部归位</b>，一共试错 ' + mistakes + ' 次。' + msg + '</div>' +
        '<div class="guess-foot">' +
          '<span class="guess-score">查、算、造，各找各的行家。</span>' +
          '<button class="btn btn-ghost js-again">再玩一次 ↻</button>' +
        '</div>';
      el.querySelector(".js-again").addEventListener("click", () => { i = 0; mistakes = 0; show(); });
    }

    show();
  }

  /* ================= 找茬质检（第 4、16 课） ================= */
  const CHECK_SETS = {
    plants: {
      title: "小艾写的《怎么养绿萝》",
      tip: "点你认为「有问题」的句子，标记完再提交质检报告。",
      lines: [
        { text: "绿萝喜欢散射光，怕太阳直晒。", bad: false, why: "这条没问题。绿萝确实怕强光直射。" },
        { text: "夏天每天浇三次水，越多越好。", bad: true, why: "错。浇水过多会烂根，见干见湿才是对的。" },
        { text: "叶子发黄，可能是浇水过多或光照不足。", bad: false, why: "这条没问题，两个都是常见原因。" },
        { text: "绿萝能吸收 90% 的甲醛，新房放一盆就够了。", bad: true, why: "夸大。植物能吸一点，但远达不到 90%，更不能代替开窗通风。" },
        { text: "剪一段带气根的枝条插进水里，就能长出新根。", bad: false, why: "这条没问题，扦插就是这么操作的。" },
        { text: "绿萝原产南美洲亚马逊雨林，1902 年由英国植物学家引入中国。", bad: true, why: "编造。年份、人物这些细节越具体，越可能是 AI 编出来的。" }
      ]
    }
  };

  function initChecker(el) {
    const set = CHECK_SETS[el.dataset.set] || CHECK_SETS.plants;
    const marked = new Set();
    let done = false;

    function render() {
      el.innerHTML =
        '<div class="guess-round-tag">找茬质检 · 这份回答里有 3 处问题</div>' +
        '<p class="check-title">' + set.title + '</p>' +
        '<p class="train-lead">' + set.tip + '</p>' +
        '<div class="check-lines">' +
        set.lines.map((l, i) =>
          '<button class="check-line" data-i="' + i + '">' +
            '<span class="cl-text">' + l.text + '</span>' +
            '<span class="cl-why" hidden></span>' +
          '</button>'
        ).join("") +
        '</div>' +
        '<div class="guess-foot">' +
          '<span class="guess-score js-score">已标记 0 处</span>' +
          '<button class="btn btn-primary js-submit">提交质检报告</button>' +
        '</div>';
      Array.from(el.querySelectorAll(".check-line")).forEach(btn => {
        btn.addEventListener("click", () => {
          if (done) return;
          const i = btn.dataset.i;
          if (marked.has(i)) { marked.delete(i); btn.classList.remove("marked"); }
          else { marked.add(i); btn.classList.add("marked"); }
          el.querySelector(".js-score").textContent = "已标记 " + marked.size + " 处";
        });
      });
      el.querySelector(".js-submit").addEventListener("click", submit);
    }

    function submit() {
      if (marked.size === 0) {
        window.dispatchEvent(new CustomEvent("aic-toast", { detail: "先点一句你认为有问题的话，再提交 😉" }));
        return;
      }
      done = true;
      let caught = 0, falseAlarm = 0, missed = 0;
      Array.from(el.querySelectorAll(".check-line")).forEach(btn => {
        const i = parseInt(btn.dataset.i, 10);
        const l = set.lines[i];
        const isMarked = marked.has(String(i));
        btn.classList.remove("marked");
        btn.classList.add(l.bad ? "bad" : "ok");
        if (l.bad && isMarked) caught++;
        if (!l.bad && isMarked) falseAlarm++;
        if (l.bad && !isMarked) missed++;
        const why = btn.querySelector(".cl-why");
        why.hidden = false;
        why.textContent = (l.bad ? "❌ " : "✅ ") + l.why + (isMarked && !l.bad ? "（你误标了这一条）" : "");
        btn.disabled = true;
      });
      const total = set.lines.filter(l => l.bad).length;
      const verdict = caught === total && falseAlarm === 0
        ? "完美质检！" + total + " 处问题全抓到，还没冤枉好人 🏆"
        : caught === total
          ? total + " 处都抓到了，不过误标了 " + falseAlarm + " 条没问题的句子 👀"
          : missed > 0
            ? "漏掉了 " + missed + " 处。越像模像样的细节，越要留个心眼。"
            : "再看看标记，有几处其实没问题。";
      el.querySelector(".guess-foot").innerHTML =
        '<span class="guess-score">抓对 ' + caught + ' / ' + total + ' · 误报 ' + falseAlarm + ' · 漏掉 ' + missed + '</span>' +
        '<button class="btn btn-ghost js-again">再检查一次 ↻</button>';
      el.querySelector(".js-again").addEventListener("click", () => {
        marked.clear(); done = false; render();
      });
      const note = document.createElement("div");
      note.className = "train-verdict";
      note.innerHTML = verdict + '<br><span class="tiny">记住：AI 追求的是「像真的」，不是「是真的」。</span>';
      el.appendChild(note);
    }

    render();
  }

  /* ================= 自动挂载 ================= */
  document.addEventListener("DOMContentLoaded", function () {
    Array.from(document.querySelectorAll(".quiz")).forEach(initQuiz);
    const g = document.getElementById("guess-game");
    if (g) initGuessGame(g);
    const lv = document.getElementById("level-test");
    if (lv) initLevelTest(lv);
    const tr = document.getElementById("trainer");
    if (tr) initTrainer(tr);
    const so = document.getElementById("sorter");
    if (so) initSorter(so);
    const ck = document.getElementById("checker");
    if (ck) initChecker(ck);
  });
})();
