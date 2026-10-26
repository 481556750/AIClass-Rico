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
  });
})();
