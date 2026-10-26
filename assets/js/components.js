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

  /* ================= 模拟聊天（第 5 课） ================= */
  const CHAT_SCENARIOS = [
    {
      id: "plan",
      chip: "帮乐乐做个暑假计划",
      user: "你好，我儿子开学六年级，帮我做一份暑假计划，每天学习 2 小时，还要留出玩的时间。",
      ai: "好呀！先给你一个「每天 2 小时」的轻量版框架：\n\n上午 9:00–10:00 学习（数学、语文交替）\n下午 4:00–5:00 阅读或兴趣\n晚上 自由玩，睡前 20 分钟复盘\n\n每周留一天完全不学习。要不要我按周排成一张表？",
      follow: [
        { chip: "再短一点", ai: "精简版：每天 2 小时，上午学习、下午阅读，每周留一天放空。先跑一周，不合适再调。" },
        { chip: "排成表格", ai: "周一至周五：\n9:00–10:00 数学 / 语文\n16:00–17:00 阅读 / 兴趣\n20:30–20:50 复盘\n\n周六：自由活动\n周日：完全不学习" }
      ]
    },
    {
      id: "shop",
      chip: "帮王阿姨写新品介绍",
      user: "我开水果店，新到了一批阳光玫瑰葡萄，帮我写一段发朋友圈的介绍，要接地气。",
      ai: "【新到阳光玫瑰】\n皮薄、脆甜、带一点玫瑰香，咬下去「咔嚓」一声。\n今早刚到店，颗颗现挑，不甜不要钱。\n小区门口「王阿姨水果店」，下午 5 点前到店还能试吃～",
      follow: [
        { chip: "再短一点", ai: "【阳光玫瑰到货】脆甜带玫瑰香，今早刚到，不甜不要钱。小区门口王阿姨水果店，5 点前可试吃。" },
        { chip: "加一句促销", ai: "【阳光玫瑰到货】脆甜带玫瑰香，今早刚到，不甜不要钱。\n前 20 位买两斤送半斤，小区门口王阿姨水果店，5 点前可试吃～" }
      ]
    },
    {
      id: "study",
      chip: "帮小雨解释一个概念",
      user: "我是大学生，用最简单的话给我讲讲什么是「机会成本」，最好举一个我身边的例子。",
      ai: "机会成本 = 你选了 A，就放弃了 B，B 就是你选 A 的代价。\n\n比如今晚你有 3 小时：去兼职能赚 60 块，去图书馆能复习完一章。你选了复习，那 60 块就是你的机会成本。\n\n一句话：真正的成本，是你没选的那个选项。",
      follow: [
        { chip: "举个更生活的例子", ai: "比如周末只有一下午：去看电影 = 放弃复习一章；复习 = 放弃那场电影。被放弃的那个，就是机会成本。" },
        { chip: "一句话总结", ai: "你选了什么，另一个选项就是代价。" }
      ]
    }
  ];

  function initChatSim(el) {
    const tasks = { first: false, follow: false, fresh: false };
    let scenario = null;
    let busy = false;
    let log = [];
    let used = new Set();

    function taskChip(on, text) {
      return '<span class="task-chip' + (on ? " on" : "") + '">' + (on ? "✓ " : "") + text + '</span>';
    }

    function esc(t) {
      return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
    }

    function logHtml() {
      if (!log.length && !busy) {
        return '<div class="chat-empty"><span class="ce-emoji">💬</span>' +
          '<p>这是小艾的模拟聊天窗口。<br>从下面挑一句，发出去试试。</p></div>';
      }
      const msgs = log.map(m => {
        if (m.role === "sys") return '<div class="chat-sys">' + esc(m.text) + '</div>';
        if (m.role === "user") return '<div class="msg user"><div class="msg-bubble">' + esc(m.text) + '</div></div>';
        return '<div class="msg ai"><span class="msg-avatar">艾</span><div class="msg-bubble">' + esc(m.text) + '</div></div>';
      }).join("");
      const typing = busy
        ? '<div class="msg ai"><span class="msg-avatar">艾</span><div class="msg-bubble typing"><i></i><i></i><i></i></div></div>'
        : "";
      return msgs + typing;
    }

    function chipsHtml() {
      if (busy) return '<span class="chat-wait">小艾正在输入…</span>';
      if (!scenario) {
        return CHAT_SCENARIOS.map((s, i) =>
          '<button class="chat-chip" data-s="' + i + '">' + s.chip + '</button>'
        ).join("");
      }
      const rest = scenario.follow.map((f, i) => ({ f: f, i: i })).filter(x => !used.has(x.i));
      if (!rest.length) {
        return '<span class="chat-wait">示例追问用完了，点上面的「＋ 新对话」试试 →</span>';
      }
      return rest.map(x =>
        '<button class="chat-chip" data-f="' + x.i + '">' + x.f.chip + '</button>'
      ).join("") +
        '<button class="chat-chip ghost" data-new="1">换个话题</button>';
    }

    function summaryHtml() {
      return '<div class="train-verdict chat-summary">' +
        '<b>演练完成 🎉</b> 你刚刚做了三件事：开口、追问、开新局。' +
        '<br>现实里的日常用法，90% 也就是这三步。' +
        '<div class="chat-again"><button class="btn btn-ghost js-again">再练一次 ↻</button></div>' +
      '</div>';
    }

    function render() {
      const done = ["first", "follow", "fresh"].filter(k => tasks[k]).length;
      el.innerHTML =
        '<div class="guess-round-tag">模拟聊天 · 任务 ' + done + ' / 3</div>' +
        '<div class="chat-tasks">' +
          taskChip(tasks.first, "① 发出第一句") +
          taskChip(tasks.follow, "② 追问一句") +
          taskChip(tasks.fresh, "③ 开一次新对话") +
        '</div>' +
        '<div class="chat-window">' +
          '<div class="chat-head">' +
            '<span class="chat-logo">艾</span><b>小艾 · 模拟对话</b>' +
            '<button class="chat-new' + (scenario && tasks.follow && !tasks.fresh ? " pulse" : "") + '" data-new="1">＋ 新对话</button>' +
          '</div>' +
          '<div class="chat-log" aria-live="polite">' + logHtml() + '</div>' +
        '</div>' +
        '<div class="chat-chips">' + chipsHtml() + '</div>' +
        (done === 3 ? summaryHtml() : "");
      const lg = el.querySelector(".chat-log");
      if (lg) lg.scrollTop = lg.scrollHeight;
      bind();
    }

    function bind() {
      Array.from(el.querySelectorAll("[data-s]")).forEach(btn => {
        btn.addEventListener("click", () => sendScenario(parseInt(btn.dataset.s, 10)));
      });
      Array.from(el.querySelectorAll("[data-f]")).forEach(btn => {
        btn.addEventListener("click", () => sendFollow(parseInt(btn.dataset.f, 10)));
      });
      Array.from(el.querySelectorAll("[data-new]")).forEach(btn => {
        btn.addEventListener("click", newChat);
      });
      const again = el.querySelector(".js-again");
      if (again) again.addEventListener("click", reset);
    }

    function sendScenario(i) {
      if (busy) return;
      scenario = CHAT_SCENARIOS[i];
      used = new Set();
      tasks.first = true;
      log = [{ role: "user", text: scenario.user }];
      busy = true;
      render();
      setTimeout(() => {
        log.push({ role: "ai", text: scenario.ai });
        busy = false;
        render();
      }, 700);
    }

    function sendFollow(i) {
      if (busy || !scenario) return;
      const f = scenario.follow[i];
      if (!f || used.has(i)) return;
      used.add(i);
      tasks.follow = true;
      log.push({ role: "user", text: f.chip });
      busy = true;
      render();
      setTimeout(() => {
        log.push({ role: "ai", text: f.ai });
        busy = false;
        render();
      }, 600);
    }

    function newChat() {
      if (busy) return;
      scenario = null;
      used = new Set();
      tasks.fresh = true;
      log = [{ role: "sys", text: "新对话已开始 · 它不记得刚才聊过什么了" }];
      render();
    }

    function reset() {
      tasks.first = false; tasks.follow = false; tasks.fresh = false;
      scenario = null; busy = false; log = []; used = new Set();
      render();
    }

    render();
  }

  /* ================= 提示词积木（第 6 课） ================= */
  const PROMPT_BASE = "帮我写一段自我介绍。";
  const PROMPT_BLOCKS = [
    { key: "role", emoji: "🎭", name: "角色", text: "你是一位有 10 年经验的 HR，看过上万份简历。", hint: "告诉它「以谁的身份」来写" },
    { key: "bg", emoji: "📋", name: "背景", text: "我是应届生，应聘新媒体运营；做过校园公众号，从 0 做到 3000 粉。", hint: "把你的具体情况交代清楚" },
    { key: "req", emoji: "📏", name: "要求", text: "写成 3 段，每段不超过 2 行；语气自信但不吹牛；不要用「精通」这种词。", hint: "长度、语气、禁忌都能提" },
    { key: "demo", emoji: "💡", name: "示例", text: "开头可以像这样：「我把一个 300 人的校园号做到 3000 粉，靠的不是运气。」", hint: "给它一个「照着写」的样本" }
  ];
  const PROMPT_LEVELS = [
    { stars: 1, label: "空话连篇" },
    { stars: 2, label: "有点像样" },
    { stars: 3, label: "开始具体" },
    { stars: 4, label: "接近可用" },
    { stars: 5, label: "直接能用" }
  ];

  function initPromptLab(el) {
    const active = new Set();

    function stars(n) {
      return "★".repeat(n) + "☆".repeat(5 - n);
    }

    function compose() {
      const has = k => active.has(k);
      let head = has("bg")
        ? "你好，我是应届生，应聘新媒体运营。"
        : "你好，我想应聘贵公司的岗位。";
      if (has("demo")) {
        head = (has("bg") ? "你好，我是应届生，应聘新媒体运营。" : "") +
          "我把一个 300 人的校园号做到 3000 粉，靠的不是运气。";
      }
      if (has("role")) head += "我知道 HR 看一份简历只有十几秒，所以先说重点。";

      let body = "";
      if (has("bg")) {
        body = has("demo")
          ? "选题、排版、数据复盘都由我独立完成，最高一篇阅读 8000+。"
          : "我运营过一个 300 人的校园公众号，一年做到 3000 粉，最高一篇阅读 8000+；选题、排版、数据复盘都由我独立完成。";
      }

      let attitude = "";
      if (has("req") && has("role")) attitude = "我不算天才，但交得出作品和数据；也不喜欢用「精通」这种词。";
      else if (has("req")) attitude = "我不算天才，但交得出作品和数据。";
      else if (has("role")) attitude = "我相信作品和数据，比形容词更有说服力。";

      const close = has("req")
        ? "期待和您聊聊。"
        : "我性格开朗，善于沟通，希望能得到这个宝贵的机会。";

      if (has("req")) {
        const paras = [head];
        const mid = [body, attitude].filter(Boolean).join("");
        if (mid) paras.push(mid);
        paras.push(close);
        return paras;
      }
      return [[head, body, attitude, close].filter(Boolean).join("")];
    }

    function buildPrompt() {
      const parts = [PROMPT_BASE];
      PROMPT_BLOCKS.forEach(b => { if (active.has(b.key)) parts.push(b.text); });
      return parts.join("\n");
    }

    function copyPrompt() {
      const text = buildPrompt();
      function done() {
        window.dispatchEvent(new CustomEvent("aic-toast", { detail: "✅ 提示词已复制，去真实工具里试试" }));
      }
      function fallback() {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); done(); }
        catch (e) { window.dispatchEvent(new CustomEvent("aic-toast", { detail: "复制失败，请手动选中提示词" })); }
        document.body.removeChild(ta);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(fallback);
      } else {
        fallback();
      }
    }

    function render() {
      const t = PROMPT_LEVELS[active.size];
      const pct = Math.round(active.size / PROMPT_BLOCKS.length * 100);
      const paras = compose();
      el.innerHTML =
        '<div class="guess-round-tag">提示词实验室 · 点积木，看输出变化</div>' +
        '<p class="train-lead">同一个任务，只差「说清楚」。点下面的积木，把它加进提示词。</p>' +
        '<div class="pl-grid">' +
          '<div class="pl-left">' +
            '<div class="pl-label">你的提示词</div>' +
            '<div class="pl-prompt">' +
              '<span class="pl-line base">' + PROMPT_BASE + '</span>' +
              PROMPT_BLOCKS.filter(b => active.has(b.key)).map(b =>
                '<span class="pl-line">＋ ' + b.text + '</span>'
              ).join("") +
            '</div>' +
            '<div class="pl-blocks">' +
              PROMPT_BLOCKS.map(b =>
                '<button class="pl-block' + (active.has(b.key) ? " on" : "") + '" data-k="' + b.key + '">' +
                  '<span class="pb-emoji">' + b.emoji + '</span>' +
                  '<span class="pb-body"><b>' + b.name + '</b><small>' + b.hint + '</small></span>' +
                  '<span class="pb-state">' + (active.has(b.key) ? "✓" : "＋") + '</span>' +
                '</button>'
              ).join("") +
            '</div>' +
            '<div class="pl-meter"><span>具体度</span><div class="pl-bar"><i style="width:' + pct + '%"></i></div><b>' + pct + '%</b></div>' +
          '</div>' +
          '<div class="pl-right">' +
            '<div class="pl-label">小艾的输出 <span class="pl-stars">' + stars(t.stars) + '</span></div>' +
            '<div class="pl-output' + (active.size === PROMPT_BLOCKS.length ? " best" : "") + '" aria-live="polite">' +
              '<span class="pl-out-tag">' + t.label + '</span>' +
              paras.map(p => '<p>' + p + '</p>').join("") +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="guess-foot">' +
          '<span class="guess-score">' + (active.size === PROMPT_BLOCKS.length
            ? "集齐了：角色 + 背景 + 要求 + 示例，你已经会写提示词了。"
            : "至少加 3 块，看看差别有多大。") + '</span>' +
          '<button class="btn btn-ghost js-copy">复制提示词</button>' +
        '</div>';
      Array.from(el.querySelectorAll(".pl-block")).forEach(btn => {
        btn.addEventListener("click", () => {
          const k = btn.dataset.k;
          if (active.has(k)) active.delete(k); else active.add(k);
          render();
        });
      });
      el.querySelector(".js-copy").addEventListener("click", copyPrompt);
    }

    render();
  }

  /* ================= 改稿台（第 7 课） ================= */
  const EDIT_LINES = [
    {
      before: "尊敬的领导：您好！",
      after: "王哥，晚上好：",
      why: "称呼改成平时怎么叫就怎么叫。太客气反而生分，也像群发的模板。"
    },
    {
      before: "因个人原因，特此请假一天，望批准。",
      after: "明天上午我得带孩子去趟医院，下午 2 点前回来。",
      why: "「个人原因」等于没说。具体事由 + 回来的时间，领导才好安排。"
    },
    {
      before: "手上的工作已妥善安排，请放心。",
      after: "上午的会我请小李代我参加，材料已经发他了；急事可以打我电话。",
      why: "「妥善安排」是空话。说清楚谁接手、材料在哪，才叫真的安排好了。"
    },
    {
      before: "此致敬礼！",
      after: "谢谢王哥！",
      why: "结尾不用公文腔，一句谢谢更像你本人。"
    }
  ];

  function initEditor(el) {
    const fixed = new Set();

    function render() {
      const allDone = fixed.size === EDIT_LINES.length;
      el.innerHTML =
        '<div class="guess-round-tag">改稿台 · 已改 ' + fixed.size + ' / ' + EDIT_LINES.length + ' 句</div>' +
        '<p class="train-lead">这是 AI 给阿杰写的请假邮件初稿。点每一句，把它改成「像阿杰本人」的话。</p>' +
        '<div class="edit-mail">' +
          EDIT_LINES.map((l, i) => fixed.has(i)
            ? '<div class="edit-line done">' +
                '<span class="el-after">' + l.after + '</span>' +
                '<span class="edit-why">✓ ' + l.why + '</span>' +
              '</div>'
            : '<button class="edit-line" data-i="' + i + '">' +
                '<span class="el-before">' + l.before + '</span>' +
                '<span class="el-hint">点一下，改成人话 →</span>' +
              '</button>'
          ).join("") +
        '</div>' +
        (allDone
          ? '<div class="train-verdict edit-final">' +
              '<b>这就是定稿：</b>' +
              '<div class="edit-mail-final">' +
                EDIT_LINES.map(l => '<p>' + l.after + '</p>').join("") +
              '</div>' +
              '<span class="tiny">同一件事，换个说法，就从「模板」变成了「本人」。AI 写初稿，你当主编。</span>' +
            '</div>' +
            '<div class="guess-foot">' +
              '<span class="guess-score">4 句全改完，这封邮件像阿杰自己写的了。</span>' +
              '<button class="btn btn-ghost js-again">再改一次 ↻</button>' +
            '</div>'
          : '<div class="guess-foot">' +
              '<span class="guess-score">还剩 ' + (EDIT_LINES.length - fixed.size) + ' 句等你动笔。</span>' +
            '</div>')
        ;
      Array.from(el.querySelectorAll(".edit-line[data-i]")).forEach(btn => {
        btn.addEventListener("click", () => {
          fixed.add(parseInt(btn.dataset.i, 10));
          render();
        });
      });
      const again = el.querySelector(".js-again");
      if (again) again.addEventListener("click", () => { fixed.clear(); render(); });
    }

    render();
  }

  /* ================= 出题机（第 8 课） ================= */
  const TUTOR_TOPICS = [
    {
      id: "fraction", name: "分数加减", emoji: "➗",
      questions: [
        { q: "1/2 + 1/3 = ?", opts: ["2/5", "5/6", "1/6"], ok: 1, why: "先通分：1/2 = 3/6，1/3 = 2/6，加起来是 5/6。分母不能直接相加。" },
        { q: "3/4 − 1/2 = ?", opts: ["2/2", "1/4", "1/2"], ok: 1, why: "通分：3/4 − 2/4 = 1/4。" },
        { q: "2/3 × 3/4 = ?", opts: ["1/2", "6/7", "8/9"], ok: 0, why: "分数相乘，分子乘分子、分母乘分母：6/12 = 1/2。" }
      ]
    },
    {
      id: "photo", name: "光合作用", emoji: "🌿",
      questions: [
        { q: "光合作用主要发生在植物的哪个部位？", opts: ["根", "叶绿体", "花"], ok: 1, why: "叶绿体是光合作用的「工厂」，主要分布在叶子里。" },
        { q: "光合作用需要下面哪两样东西？", opts: ["二氧化碳和水", "氧气和糖", "泥土和阳光"], ok: 0, why: "植物用二氧化碳和水，在光下造出氧气和糖。" },
        { q: "光合作用释放的气体是？", opts: ["二氧化碳", "氧气", "氮气"], ok: 1, why: "它吸收二氧化碳，释放氧气——所以我们说植物能「净化空气」。" }
      ]
    },
    {
      id: "english", name: "英语过去时", emoji: "🔤",
      questions: [
        { q: "I ___ to the park yesterday.", opts: ["go", "went", "going"], ok: 1, why: "yesterday 是过去时间，go 的过去式是 went。" },
        { q: "She ___ her homework last night.", opts: ["do", "did", "does"], ok: 1, why: "last night 是过去时间，do 的过去式是 did。" },
        { q: "下面哪句是对的？", opts: ["He goed home.", "He went home.", "He goes home yesterday."], ok: 1, why: "go 是不规则动词，过去式是 went，不是 goed。" }
      ]
    }
  ];

  function initTutor(el) {
    let topic = null, idx = 0, score = 0, answered = false, results = [];

    function choose() {
      el.innerHTML =
        '<div class="guess-round-tag">小艾出题机 · 选一门课</div>' +
        '<p class="train-lead">你选一门，小艾出 3 道题考你。答错的地方，它会讲给你听。</p>' +
        '<div class="tutor-topics">' +
          TUTOR_TOPICS.map((t, i) =>
            '<button class="tutor-topic" data-i="' + i + '">' +
              '<span class="tt-emoji">' + t.emoji + '</span>' +
              '<b>' + t.name + '</b>' +
              '<small>3 道题 · 约 2 分钟</small>' +
            '</button>'
          ).join("") +
        '</div>';
      Array.from(el.querySelectorAll(".tutor-topic")).forEach(btn => {
        btn.addEventListener("click", () => start(parseInt(btn.dataset.i, 10)));
      });
    }

    function start(i) {
      topic = TUTOR_TOPICS[i];
      idx = 0; score = 0; answered = false; results = [];
      question();
    }

    function question() {
      const q = topic.questions[idx];
      answered = false;
      el.innerHTML =
        '<div class="guess-round-tag">' + topic.emoji + ' ' + topic.name + ' · 第 ' + (idx + 1) + ' / ' + topic.questions.length + ' 题</div>' +
        '<div class="tutor-q">' + q.q + '</div>' +
        '<div class="tutor-opts">' +
          q.opts.map((o, i) => '<button class="tutor-opt" data-o="' + i + '">' + o + '</button>').join("") +
        '</div>' +
        '<div class="tutor-fb" aria-live="polite"></div>';
      Array.from(el.querySelectorAll(".tutor-opt")).forEach(btn => {
        btn.addEventListener("click", () => answer(parseInt(btn.dataset.o, 10)));
      });
    }

    function answer(i) {
      if (answered) return;
      answered = true;
      const q = topic.questions[idx];
      const right = i === q.ok;
      if (right) score++;
      results.push(right);
      Array.from(el.querySelectorAll(".tutor-opt")).forEach((btn, k) => {
        btn.disabled = true;
        if (k === q.ok) btn.classList.add("ok");
        else if (k === i) btn.classList.add("bad");
      });
      const fb = el.querySelector(".tutor-fb");
      fb.className = "tutor-fb show " + (right ? "ok" : "bad");
      fb.innerHTML = (right ? "✅ 答对了！" : "❌ 不对哦。") + q.why +
        '<div class="tutor-next"><button class="btn btn-primary">' +
          (idx + 1 === topic.questions.length ? "看成绩 →" : "下一题 →") +
        '</button></div>';
      fb.querySelector(".btn").addEventListener("click", () => {
        if (idx + 1 === topic.questions.length) result();
        else { idx++; question(); }
      });
    }

    function result() {
      const total = topic.questions.length;
      const msg = score === total
        ? "全对！别急着骄傲——让它再出 3 道更难的。"
        : score >= total - 1
          ? "不错。错的那道，让它换一种讲法再讲一遍。"
          : "没关系，这正是「出题」的意义：把没懂的地方找出来。";
      el.innerHTML =
        '<div class="guess-round-tag">考试结束 · ' + topic.name + '</div>' +
        '<div class="tutor-score">' + score + ' <small>/ ' + total + '</small></div>' +
        '<p class="tutor-msg">' + msg + '</p>' +
        '<div class="tutor-review">' +
          topic.questions.map((q, i) =>
            '<div class="tutor-review-row ' + (results[i] ? "ok" : "bad") + '">' +
              '<b>' + (results[i] ? "✓" : "✗") + ' 第 ' + (i + 1) + ' 题</b>' +
              '<span>' + q.why + '</span>' +
            '</div>'
          ).join("") +
        '</div>' +
        '<div class="guess-foot">' +
          '<span class="guess-score">错题解析都在上面，别只看分数。</span>' +
          '<button class="btn btn-primary js-again">再考一次 ↻</button>' +
          '<button class="btn btn-ghost js-topic">换一门课</button>' +
        '</div>';
      el.querySelector(".js-again").addEventListener("click", () => start(TUTOR_TOPICS.indexOf(topic)));
      el.querySelector(".js-topic").addEventListener("click", choose);
    }

    choose();
  }

  /* ================= 文件助手（第 9 课） ================= */
  const FILE_ITEMS = [
    {
      id: "medicine",
      emoji: "💊",
      name: "药盒照片.jpg",
      kind: "图片 · 药盒",
      raw: "阿莫西林胶囊 0.25g × 24 粒\n适应症：敏感菌引起的感染\n用法用量：成人一次 2 粒，一日 3 次\n禁忌：青霉素过敏者禁用",
      summary: "这是阿莫西林胶囊（0.25g × 24 粒）。\n成人常用量：一次 2 粒，一日 3 次。\n青霉素过敏者禁用。",
      warn: "药名和剂量请再对照说明书；具体用药听医生的。"
    },
    {
      id: "pdf",
      emoji: "📄",
      name: "项目会议纪要.pdf",
      kind: "PDF · 12 页",
      raw: "……本次会议讨论了 Q3 上线节奏、预算调整与人员分工……\n上线时间：9 月 15 日\n追加预算：8 万元\n物料：小李\n渠道：小王",
      summary: "3 条要点：\n① Q3 上线推迟到 9 月 15 日；\n② 预算增加 8 万，用于投放；\n③ 小李负责物料，小王负责渠道。",
      warn: "日期和金额，建议回到原文核对。"
    },
    {
      id: "bill",
      emoji: "🧾",
      name: "手写账单照片.jpg",
      kind: "图片 · 手写",
      raw: "苹果 12.5 元\n香蕉 8 元\n牛奶 25 元\n鸡蛋 18.5 元",
      summary: "共 4 项，识别合计 176.5 元。",
      summaryFixed: "已修正：苹果 12.5 元，合计 64 元。",
      warn: "手写数字容易认错，尤其是小数点。",
      rows: [
        { name: "苹果", value: "125 元", fixed: "12.5 元", wrong: true },
        { name: "香蕉", value: "8 元" },
        { name: "牛奶", value: "25 元" },
        { name: "鸡蛋", value: "18.5 元" }
      ]
    }
  ];

  function initFiles(el) {
    let busy = false;
    let foundBill = false;

    function choose() {
      foundBill = false;
      el.innerHTML =
        '<div class="guess-round-tag">文件助手 · 选一个文件试试</div>' +
        '<p class="train-lead">真实工具里，这里可以上传图片、PDF、Word、Excel。这是模拟演示。</p>' +
        '<div class="file-grid">' +
          FILE_ITEMS.map((f, i) =>
            '<button class="file-card" data-i="' + i + '">' +
              '<span class="fc-emoji">' + f.emoji + '</span>' +
              '<span class="fc-name">' + f.name + '</span>' +
              '<span class="fc-kind">' + f.kind + '</span>' +
            '</button>'
          ).join("") +
        '</div>';
      Array.from(el.querySelectorAll(".file-card")).forEach(btn => {
        btn.addEventListener("click", () => process(FILE_ITEMS[parseInt(btn.dataset.i, 10)]));
      });
    }

    function process(item) {
      if (busy) return;
      busy = true;
      foundBill = false;
      el.innerHTML =
        '<div class="guess-round-tag">正在识别 · ' + item.name + '</div>' +
        '<div class="file-scan">' +
          '<span class="fs-emoji">' + item.emoji + '</span>' +
          '<div class="train-bar"><i></i></div>' +
          '<p>正在读取文字、表格和数字……</p>' +
        '</div>';
      const bar = el.querySelector(".train-bar i");
      setTimeout(() => { bar.style.width = "100%"; }, 50);
      setTimeout(() => { busy = false; show(item); }, 1300);
    }

    function billRows(item) {
      return '<div class="bill-table">' +
        item.rows.map((r, i) =>
          '<button class="bill-row' + (foundBill && r.wrong ? " found" : "") + '" data-row="' + i + '"' +
            (foundBill ? " disabled" : "") + '>' +
            '<span>' + r.name + '</span>' +
            '<b>' + (foundBill && r.wrong ? r.fixed : r.value) + '</b>' +
          '</button>'
        ).join("") +
      '</div>';
    }

    function show(item) {
      const isBill = item.id === "bill";
      el.innerHTML =
        '<div class="guess-round-tag">识别完成 · ' + item.name + '</div>' +
        '<div class="file-result" aria-live="polite">' +
          '<div class="file-col">' +
            '<div class="pl-label">文件里写的</div>' +
            '<div class="file-raw">' + item.raw.replace(/\n/g, "<br>") + '</div>' +
          '</div>' +
          '<div class="file-col">' +
            '<div class="pl-label">小艾的摘要</div>' +
            '<div class="file-summary">' +
              (isBill
                ? billRows(item) + '<p class="bill-total">' + (foundBill ? item.summaryFixed : item.summary) + '</p>'
                : item.summary.replace(/\n/g, "<br>")) +
            '</div>' +
          '</div>' +
        '</div>' +
        '<p class="file-warn">⚠️ ' + item.warn + '</p>' +
        (isBill
          ? (foundBill
              ? '<div class="train-verdict"><b>你抓到了 1 处识别错误。</b><br>手写、反光、小数点，都是「看图识字」的高发区——AI 读得快，但数字要自己核。</div>'
              : '<p class="train-lead">账单里有一行可能被认错了。点一下你觉得可疑的那一行。</p>')
          : '') +
        '<div class="guess-foot">' +
          '<span class="guess-score">' + (isBill && !foundBill ? "提示：注意小数点。" : "能读、能总结，但不代表 100% 正确。") + '</span>' +
          '<button class="btn btn-ghost js-back">换一个文件 ↻</button>' +
        '</div>';
      el.querySelector(".js-back").addEventListener("click", choose);
      if (isBill && !foundBill) {
        Array.from(el.querySelectorAll(".bill-row[data-row]")).forEach(btn => {
          btn.addEventListener("click", () => checkRow(parseInt(btn.dataset.row, 10)));
        });
      }
    }

    function checkRow(i) {
      const item = FILE_ITEMS[2];
      const row = item.rows[i];
      if (row.wrong) {
        foundBill = true;
        show(item);
        window.dispatchEvent(new CustomEvent("aic-toast", { detail: "✅ 抓到了！小数点被漏掉了" }));
      } else {
        const btn = el.querySelector('.bill-row[data-row="' + i + '"]');
        btn.classList.remove("shake");
        void btn.offsetWidth;
        btn.classList.add("shake");
        window.dispatchEvent(new CustomEvent("aic-toast", { detail: "这行和原图一致，再看看别的" }));
      }
    }

    choose();
  }

  /* ================= 生活情景（第 10 课） ================= */
  const LIFE_SCENES = [
    {
      id: "dinner",
      emoji: "🍳",
      title: "冰箱只剩鸡蛋、番茄、半根胡萝卜",
      desc: "今晚两个人吃，只有 20 分钟。",
      options: [
        {
          text: "推荐个家常菜",
          good: false,
          reply: "推荐红烧肉：五花肉 500g、冰糖、生抽、老抽，小火慢炖 40 分钟。",
          why: "还得下楼买肉，冰箱里的菜没用上。"
        },
        {
          text: "只有鸡蛋、番茄、半根胡萝卜，20 分钟，两个人吃，能做什么？",
          good: true,
          reply: "番茄炒蛋 + 胡萝卜丝蛋饼，20 分钟够。先打蛋，番茄切块，胡萝卜擦丝拌进蛋液里煎。",
          why: "把食材、时间、人数说全，它才能用你的资源解决你的问题。"
        }
      ]
    },
    {
      id: "homework",
      emoji: "🧒",
      title: "10 岁儿子一写作业就拖",
      desc: "你想今晚就跟他聊一次。",
      options: [
        {
          text: "我儿子 10 岁，一写作业就拖，我想今晚跟他好好聊一次，怎么开口？",
          good: true,
          reply: "可以这样说：「我不是来催你的，是想跟你商量一个我们都能接受的办法。」然后问他 3 个问题：哪科最难？卡在哪一步？希望我怎么帮你？",
          why: "把「管」换成「聊」，它给的才是能直接说出口的话。"
        },
        {
          text: "怎么管孩子写作业？",
          good: false,
          reply: "建立规则、固定学习时间、奖惩分明，必要时和老师沟通。",
          why: "道理都对，但今晚还是不知道怎么开口。"
        }
      ]
    },
    {
      id: "repair",
      emoji: "🔧",
      title: "楼道灯坏了 3 天，物业还没修",
      desc: "你想让他们今天就来人。",
      options: [
        {
          text: "物业不管事怎么办？",
          good: false,
          reply: "可以向业委会反映，或依据物业服务合同投诉，必要时走法律途径。",
          why: "一下跳到「对抗」，事情反而更难办。"
        },
        {
          text: "楼道灯坏了 3 天，帮我写一条客气但坚定的报修信息",
          good: true,
          reply: "【报修】3 号楼 2 单元 5 楼楼道灯已坏 3 天，晚上老人小孩上下楼不安全。请今天安排师傅上门，谢谢。",
          why: "给它对象、事实、语气，它就能替你把话说清楚。"
        }
      ]
    }
  ];

  function initLife(el) {
    let i = 0, score = 0, answered = false;

    function scene() {
      if (i >= LIFE_SCENES.length) return summary();
      const s = LIFE_SCENES[i];
      answered = false;
      el.innerHTML =
        '<div class="guess-round-tag">情景 ' + (i + 1) + ' / ' + LIFE_SCENES.length + ' · 你选哪种问法？</div>' +
        '<div class="life-scene">' +
          '<span class="ls-emoji">' + s.emoji + '</span>' +
          '<div><b>' + s.title + '</b><p>' + s.desc + '</p></div>' +
        '</div>' +
        '<div class="life-opts">' +
          s.options.map((o, k) =>
            '<button class="life-opt" data-o="' + k + '">' +
              '<span class="lo-tag">' + String.fromCharCode(65 + k) + '</span>' +
              '<span>' + o.text + '</span>' +
            '</button>'
          ).join("") +
        '</div>' +
        '<div class="life-result" aria-live="polite"></div>';
      Array.from(el.querySelectorAll(".life-opt")).forEach(btn => {
        btn.addEventListener("click", () => pick(parseInt(btn.dataset.o, 10)));
      });
    }

    function pick(k) {
      if (answered) return;
      answered = true;
      const s = LIFE_SCENES[i];
      const good = s.options.findIndex(o => o.good);
      if (k === good) score++;
      const chosen = s.options[k];
      const best = s.options[good];
      Array.from(el.querySelectorAll(".life-opt")).forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === good) btn.classList.add("right");
        else if (idx === k) btn.classList.add("wrong");
      });
      const res = el.querySelector(".life-result");
      res.className = "life-result show";
      res.innerHTML =
        (k === good
          ? '<p class="life-verdict ok">✅ 选对了，这句更落地。</p>'
          : '<p class="life-verdict bad">⚠️ 也能聊，但不够落地。看看差别：</p>') +
        '<div class="life-reply ' + (k === good ? "good" : "bad") + '">' +
          '<span class="lr-label">你选的</span>' +
          '<p>' + chosen.reply + '</p>' +
          '<span class="lr-why">' + chosen.why + '</span>' +
        '</div>' +
        (k === good ? '' :
          '<div class="life-reply good">' +
            '<span class="lr-label">更好的问法</span>' +
            '<p class="lr-q">' + best.text + '</p>' +
            '<p>' + best.reply + '</p>' +
            '<span class="lr-why">' + best.why + '</span>' +
          '</div>') +
        '<div class="life-next"><button class="btn btn-primary">' +
          (i + 1 === LIFE_SCENES.length ? "看总结 →" : "下一个情景 →") +
        '</button></div>';
      res.querySelector(".btn").addEventListener("click", () => { i++; scene(); });
    }

    function summary() {
      const msg = score === LIFE_SCENES.length
        ? "3 / 3，你已经会把条件说全了 🏆"
        : score >= 2
          ? "2 / 3，不错。记住：先说「有什么、要什么、给谁」。"
          : "别急，记住一句：先交代条件，再提要求。";
      el.innerHTML =
        '<div class="guess-round-tag">三个情景走完 🎉</div>' +
        '<div class="train-verdict"><b>' + msg + '</b><br>同一个 AI，问法不同，结果差很远。</div>' +
        '<div class="guess-foot">' +
          '<span class="guess-score">琐事交给它，判断留自己。</span>' +
          '<button class="btn btn-ghost js-again">再玩一次 ↻</button>' +
        '</div>';
      el.querySelector(".js-again").addEventListener("click", () => { i = 0; score = 0; scene(); });
    }

    scene();
  }

  /* ================= 五招卡片（第 11 课） ================= */
  const TIPS = [
    {
      emoji: "🗣️", name: "追问",
      normal: "帮我写个活动方案。",
      normalReply: "好的，以下是一个活动方案：一、活动主题……（通用模板）",
      pro: "帮我写个活动方案。先给 3 个主题方向，我选一个你再展开。",
      proReply: "3 个方向：① 亲子运动会 ② 旧物交换市集 ③ 夜间露天电影。你选哪个？",
      why: "第一版只是草稿。追问一句，它才会往你要的方向走。"
    },
    {
      emoji: "💡", name: "举例",
      normal: "帮我写几句朋友圈文案。",
      normalReply: "时光荏苒，岁月如歌，愿美好与你环环相扣……（空泛）",
      pro: "帮我写 3 句水果店朋友圈文案，像这样：「今早刚到，脆甜，不甜不要钱。」",
      proReply: "① 阳光玫瑰到货，脆甜带香，不甜不要钱。② 今早现摘的草莓，颗颗带露水。③ 最后 10 箱，卖完收摊。",
      why: "给一个样本，比说「写得好一点」管用十倍。"
    },
    {
      emoji: "🔍", name: "自查",
      normal: "这个历史事件是哪一年？",
      normalReply: "1898 年。（可能记错或编造）",
      pro: "你确定吗？再检查一遍，有没有记错或编造的地方。",
      proReply: "我重新核对：应是 1898 年，但建议以教材为准；我不能保证绝对准确。",
      why: "自查能减少错误，但不能保证全对；重要事实仍要自己核。"
    },
    {
      emoji: "🪜", name: "分步",
      normal: "帮我写一份 3000 字的年度总结。",
      normalReply: "（一次性生成，结构松散，重点不清）",
      pro: "先别写正文，先列 5 个部分的提纲，我确认后再写。",
      proReply: "提纲：① 年度回顾 ② 关键数据 ③ 存在问题 ④ 改进措施 ⑤ 明年计划。确认后我再展开。",
      why: "长任务拆开做，质量更稳，也更容易改。"
    },
    {
      emoji: "🔄", name: "换说法",
      normal: "这个方案有什么风险？",
      normalReply: "整体可行，注意执行细节。",
      pro: "这个方案最可能失败的 3 个原因是什么？如果只能改一处，改哪里？",
      proReply: "① 预算不足 ② 人手不够 ③ 时间太紧。优先改时间——把上线推迟两周，风险能降一半。",
      why: "换个角度问，能逼出不一样的答案。"
    }
  ];

  function initTips(el) {
    let viewed = new Set();

    function render() {
      el.innerHTML =
        '<div class="guess-round-tag">五招卡片 · 已看 ' + viewed.size + ' / ' + TIPS.length + '</div>' +
        '<p class="train-lead">每张卡都是一组对比：普通问法 vs 高手问法。点开看看差别。</p>' +
        '<div class="tips-list">' +
          TIPS.map((t, i) => {
            const on = viewed.has(i);
            return '<div class="tip-card' + (on ? " on" : "") + '">' +
              '<div class="tip-head">' +
                '<span class="tip-emoji">' + t.emoji + '</span>' +
                '<b>' + t.name + '</b>' +
                '<span class="tip-no">0' + (i + 1) + '</span>' +
              '</div>' +
              '<div class="tip-before">' +
                '<span class="tp-label">普通问法</span>' +
                '<p class="tp-q">' + t.normal + '</p>' +
                '<p class="tp-reply">' + t.normalReply + '</p>' +
              '</div>' +
              (on
                ? '<div class="tip-after">' +
                    '<span class="tp-label">高手问法</span>' +
                    '<p class="tp-q">' + t.pro + '</p>' +
                    '<p class="tp-reply">' + t.proReply + '</p>' +
                    '<p class="tp-why">💡 ' + t.why + '</p>' +
                  '</div>'
                : '<button class="tip-toggle" data-i="' + i + '">看高手版 ↓</button>') +
            '</div>';
          }).join("") +
        '</div>' +
        (viewed.size === TIPS.length
          ? '<div class="train-verdict"><b>五招集齐 ✓</b> 高手不是会咒语，是会追问；好答案，都是聊出来的。</div>' +
            '<div class="guess-foot">' +
              '<span class="guess-score">现在去真实工具里，挑一招试试。</span>' +
              '<button class="btn btn-ghost js-again">重新看一遍 ↻</button>' +
            '</div>'
          : '');
      Array.from(el.querySelectorAll(".tip-toggle")).forEach(btn => {
        btn.addEventListener("click", () => {
          viewed.add(parseInt(btn.dataset.i, 10));
          render();
        });
      });
      const again = el.querySelector(".js-again");
      if (again) again.addEventListener("click", () => { viewed = new Set(); render(); });
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
    const cs = document.getElementById("chat-sim");
    if (cs) initChatSim(cs);
    const pl = document.getElementById("prompt-lab");
    if (pl) initPromptLab(pl);
    const ed = document.getElementById("editor");
    if (ed) initEditor(ed);
    const tu = document.getElementById("tutor");
    if (tu) initTutor(tu);
    const fl = document.getElementById("files");
    if (fl) initFiles(fl);
    const lf = document.getElementById("life");
    if (lf) initLife(lf);
    const tp = document.getElementById("tips");
    if (tp) initTips(tp);
  });
})();
