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
    },
    battery: {
      title: "小艾写的《手机电池保养 6 条》",
      tip: "点你认为「有问题」的句子。注意数字、出处和绝对化说法。",
      lines: [
        { text: "现在的手机多用锂电池，没有记忆效应，不用每次用光再充。", bad: false, why: "这条没问题。锂电池确实没有老式镍镉电池的记忆效应。" },
        { text: "新手机第一次充电必须充 12 小时，才能把电池「激活」。", bad: true, why: "过时说法。锂电池出厂已激活，充 12 小时没有必要，过充反而不好。" },
        { text: "充电时玩大型游戏会让手机发热，长期高温会加速电池老化。", bad: false, why: "这条没问题。高温是锂电池老化的主要原因之一。" },
        { text: "把手机放进冰箱冷冻 10 分钟，能快速降温并延长电池寿命。", bad: true, why: "危险。温差会产生冷凝水，可能损坏手机；降温应停止高负载使用。" },
        { text: "根据 2023 年《自然》杂志的一项研究，电量保持在 20%–80% 最耐用。", bad: true, why: "出处可疑。具体期刊、年份说得越完整，越可能被编造；先去期刊官网核对。" },
        { text: "充电时如果手机明显发烫，最好先停一下，等温度降下来再用。", bad: false, why: "这条没问题。发烫时暂停高负载使用，比硬扛更安全。" }
      ]
    }
  };

  function initChecker(el) {
    const set = CHECK_SETS[el.dataset.set] || CHECK_SETS.plants;
    const badTotal = set.lines.filter(l => l.bad).length;
    const marked = new Set();
    let done = false;

    function render() {
      el.innerHTML =
        '<div class="guess-round-tag">找茬质检 · 这份回答里有 ' + badTotal + ' 处问题</div>' +
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

  /* ================= 通用：复制文本 ================= */
  function copyText(text, okMsg) {
    function ok() {
      window.dispatchEvent(new CustomEvent("aic-toast", { detail: okMsg || "已复制" }));
    }
    function fallback() {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      ta.style.top = "0";
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, ta.value.length);
      let done = false;
      try { done = document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta);
      if (done) ok();
      else window.dispatchEvent(new CustomEvent("aic-toast", { detail: "复制失败，请手动选中文字" }));
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok).catch(fallback);
    } else {
      fallback();
    }
  }

  /* ================= 绘画提示词生成器（第 12 课） ================= */
  const ART_GROUPS = [
    {
      key: "subject", label: "1. 主体", hint: "画谁 / 画什么",
      items: [
        { label: "🐱 橘猫", value: "一只胖乎乎的橘猫", emoji: "🐱" },
        { label: "🧑‍🚀 宇航员", value: "一个背着旧背包的宇航员", emoji: "🧑‍🚀" },
        { label: "👧 小女孩", value: "一个扎着双马尾的小女孩", emoji: "👧" },
        { label: "🤖 机器人", value: "一台圆头圆脑的小机器人", emoji: "🤖" }
      ]
    },
    {
      key: "scene", label: "2. 场景", hint: "在哪里 / 做什么",
      items: [
        { label: "🌕 月球钓鱼", value: "坐在月球表面钓鱼，背景是一颗蓝色地球", emoji: "🌕" },
        { label: "🌅 海边日落", value: "站在海边礁石上，身后是落日和海浪", emoji: "🌅" },
        { label: "🌲 森林萤火", value: "走在夜晚的森林里，周围是萤火虫", emoji: "🌲" },
        { label: "🌃 城市天台", value: "坐在城市天台边缘，脚下是霓虹灯海", emoji: "🌃" }
      ]
    },
    {
      key: "style", label: "3. 风格", hint: "像什么画",
      items: [
        { label: "扁平插画", value: "扁平插画风格，线条干净", name: "扁平插画" },
        { label: "水彩", value: "水彩风格，边缘柔和，有纸张质感", name: "水彩" },
        { label: "像素风", value: "像素风，16-bit 游戏画面", name: "像素风" },
        { label: "黏土 3D", value: "黏土 3D 风格，圆润可爱", name: "黏土 3D" }
      ]
    },
    {
      key: "tone", label: "4. 光线和颜色", hint: "什么气氛",
      items: [
        { label: "蓝紫夜晚", value: "蓝紫色夜空，冷色调，星星点点", tone: "tone-night", name: "蓝紫夜晚" },
        { label: "暖黄夕阳", value: "暖黄色夕阳，柔和逆光", tone: "tone-sunset", name: "暖黄夕阳" },
        { label: "清新绿", value: "清新绿色调，晨雾和露水", tone: "tone-green", name: "清新绿" },
        { label: "霓虹高对比", value: "高对比霓虹色，赛博朋克感", tone: "tone-neon", name: "霓虹高对比" }
      ]
    },
    {
      key: "ratio", label: "5. 画面比例", hint: "用在哪里",
      items: [
        { label: "9:16 手机壁纸", value: "9:16 竖版手机壁纸", name: "9:16 壁纸" },
        { label: "1:1 方形头像", value: "1:1 方形头像，主体居中", name: "1:1 头像" },
        { label: "16:9 横版封面", value: "16:9 横版封面，留出标题空间", name: "16:9 封面" }
      ]
    }
  ];

  const ART_EGGS = [
    "戴着一顶小黄帽",
    "旁边跟着一只小鸭子",
    "手里拿着一杯热可可",
    "身后有一道彩虹",
    "脚边放着一盏小灯笼"
  ];

  function initArtPrompt(el) {
    let sel = { subject: 0, scene: 0, style: 0, tone: 0, ratio: 0 };
    let egg = "";
    let eggIndex = -1;

    function group(key) {
      return ART_GROUPS.find(g => g.key === key);
    }

    function fullPrompt() {
      const p = ["subject", "scene", "style", "tone", "ratio"].map(key => group(key).items[sel[key]].value);
      return p.join("，") + "，画面干净，细节清晰" + (egg ? "，" + egg : "");
    }

    function paint() {
      const subject = group("subject").items[sel.subject];
      const scene = group("scene").items[sel.scene];
      const style = group("style").items[sel.style];
      const tone = group("tone").items[sel.tone];
      const ratio = group("ratio").items[sel.ratio];
      const frame = el.querySelector(".art-frame");
      frame.className = "art-frame " + tone.tone;
      frame.querySelector(".af-subject").textContent = subject.emoji;
      frame.querySelector(".af-scene").textContent = scene.emoji;
      frame.querySelector(".af-style").textContent = style.name + " · " + ratio.name;
      frame.setAttribute("title", "画面示意：" + fullPrompt());
      el.querySelector(".art-prompt-text").textContent = fullPrompt();
      el.querySelector(".art-egg-tag").hidden = !egg;
      el.querySelector(".art-egg-tag b").textContent = egg;
      el.querySelectorAll(".art-chip").forEach(btn => {
        const g = btn.dataset.group;
        btn.classList.toggle("on", parseInt(btn.dataset.i, 10) === sel[g]);
      });
    }

    el.innerHTML =
      '<div class="art-builder">' +
        '<div class="guess-round-tag">绘画提示词生成器 · 选一选，拼出你的画面</div>' +
        '<p class="train-lead">五个格子，每个选一个。旁边会实时拼成一句可以直接粘贴的提示词。</p>' +
        '<div class="art-layout">' +
          '<div class="art-controls">' +
            ART_GROUPS.map(g =>
              '<div class="art-group">' +
                '<span class="art-label">' + g.label + ' <small>' + g.hint + '</small></span>' +
                '<div class="art-chips">' +
                  g.items.map((it, i) =>
                    '<button type="button" class="art-chip' + (sel[g.key] === i ? " on" : "") + '" data-group="' + g.key + '" data-i="' + i + '">' + it.label + '</button>'
                  ).join("") +
                '</div>' +
              '</div>'
            ).join("") +
            '<div class="art-compare">' +
              '<span class="ac-bad">普通：画只猫</span>' +
              '<span class="ac-arrow">→</span>' +
              '<span class="ac-good">高手：旁边这句</span>' +
            '</div>' +
            '<div class="art-tipbox">' +
              '<b>三句万能追加</b>' +
              '<p>「背景换成夜晚」「把猫换成白色」「去掉文字，留白多一点」</p>' +
            '</div>' +
          '</div>' +
          '<div class="art-preview">' +
            '<div class="art-frame tone-night">' +
              '<span class="af-star s1"></span><span class="af-star s2"></span><span class="af-star s3"></span>' +
              '<span class="af-subject">🐱</span>' +
              '<span class="af-scene">🌕</span>' +
              '<span class="af-style">扁平插画 · 9:16 壁纸</span>' +
              '<span class="af-label">画面示意 · 真正效果去工具里生成</span>' +
            '</div>' +
            '<div class="art-prompt-box">' +
              '<div class="pl-label">复制这句，去即梦 / 豆包试试</div>' +
              '<p class="art-prompt-text" title="点一下全选"></p>' +
              '<p class="art-egg-tag" hidden>🎲 彩蛋：<b></b></p>' +
            '</div>' +
            '<div class="art-actions">' +
              '<button type="button" class="btn btn-primary js-copy">📋 复制提示词</button>' +
              '<button type="button" class="btn btn-ghost js-egg">🎲 加个彩蛋</button>' +
              '<button type="button" class="btn btn-ghost js-reset">↻ 重置</button>' +
            '</div>' +
            '<p class="art-note">一次生成 4 张，挑一张最接近的，再用一句话改。</p>' +
          '</div>' +
        '</div>' +
      '</div>';

    el.querySelectorAll(".art-chip").forEach(btn => {
      btn.addEventListener("click", () => {
        sel[btn.dataset.group] = parseInt(btn.dataset.i, 10);
        paint();
      });
    });

    el.querySelector(".js-copy").addEventListener("click", () => copyText(fullPrompt(), "提示词已复制，去试试吧"));
    el.querySelector(".js-egg").addEventListener("click", () => {
      eggIndex = (eggIndex + 1) % ART_EGGS.length;
      egg = ART_EGGS[eggIndex];
      paint();
      window.dispatchEvent(new CustomEvent("aic-toast", { detail: "加了一个彩蛋：" + egg }));
    });
    el.querySelector(".js-reset").addEventListener("click", () => {
      sel = { subject: 0, scene: 0, style: 0, tone: 0, ratio: 0 };
      egg = "";
      eggIndex = -1;
      paint();
      window.dispatchEvent(new CustomEvent("aic-toast", { detail: "已回到默认组合" }));
    });
    el.querySelector(".art-prompt-text").addEventListener("click", function () {
      const r = document.createRange();
      r.selectNodeContents(this);
      const s = window.getSelection();
      s.removeAllRanges();
      s.addRange(r);
      window.dispatchEvent(new CustomEvent("aic-toast", { detail: "已全选，按 Ctrl+C / ⌘C 复制" }));
    });

    paint();
  }

  /* ================= 故事接龙机（第 13 课） ================= */
  const STORY_PREMISE = "雨夜，末班公交车上只剩一个乘客和司机。";
  const STORY_ROUNDS = [
    {
      tag: "第一幕 · 异常",
      q: "接下来发生什么？",
      options: [
        { text: "乘客突然开口：「师傅，下一站能停一下吗？我还没上车。」", note: "一句话把日常拧成怪事：他明明在车上，却说自己还没上车。" },
        { text: "司机从后视镜里看见，后排多了一个不存在的人。", note: "用司机的视角制造悬念：多出来的人是谁？" },
        { text: "公交车自己报站：「下一站，二十年前。」", note: "直接改写规则：这辆车不只在空间里开，也在时间里开。" }
      ]
    },
    {
      tag: "第二幕 · 反应",
      q: "车里的人怎么反应？",
      options: [
        { text: "司机握紧方向盘，假装没听见。", note: "不解释，反而更吓人；读者会替司机紧张。" },
        { text: "乘客掏出手机，发现没有信号，时间停在 23:59。", note: "用一个具体细节把不安落地：23:59。" },
        { text: "车窗外，雨停了，路灯一盏一盏熄灭。", note: "环境跟着人物一起变，气氛更冷。" }
      ]
    },
    {
      tag: "第三幕 · 收尾",
      q: "故事停在哪里？",
      options: [
        { text: "两人同时开口：「你也看见了？」", note: "把两个人绑在同一条船上：不是只有我疯了。" },
        { text: "车门开了，外面是一片没有尽头的麦田。", note: "开放式结尾：门后是什么，交给读者。" },
        { text: "天亮了，车上只剩一张旧车票，日期是二十年前。", note: "用一个物件收束全篇，余味更长。" }
      ]
    }
  ];

  function initStoryChain(el) {
    let round = 0;
    let picks = [];
    let picked = null;
    let shots = false;

    function chosenLines() {
      return picks.map((i, r) => STORY_ROUNDS[r].options[i].text);
    }

    function shotsHtml() {
      const lines = chosenLines();
      const rows = [
        { t: "0–3 秒 · 雨夜外景", d: "末班公交车驶过空街，雨刷来回摆。字幕：23:59。" },
        { t: "3–7 秒 · 第一幕", d: "车内。" + lines[0] },
        { t: "7–12 秒 · 第二幕", d: "镜头给到司机和乘客。" + lines[1] },
        { t: "12–15 秒 · 收尾", d: lines[2] + " 定格，字幕：你看见了吗？" }
      ];
      return '<div class="story-shots">' +
        '<div class="story-shots-head"><b>🎬 15 秒分镜脚本</b><span>竖屏 9:16 · 4 个镜头</span></div>' +
        rows.map((r, i) =>
          '<div class="shot-row">' +
            '<span class="shot-no">' + (i + 1) + '</span>' +
            '<div><b>' + r.t + '</b><p>' + r.d + '</p></div>' +
          '</div>'
        ).join("") +
        '<p class="story-sound">🔊 声音：雨声 + 低频嗡鸣，结尾一声刹车。</p>' +
        '<div class="story-shots-foot">' +
          '<button type="button" class="btn btn-ghost js-copy-shots">📋 复制分镜</button>' +
          '<span>先拍/找素材，再用剪映配字幕。</span>' +
        '</div>' +
      '</div>';
    }

    function render() {
      if (round >= STORY_ROUNDS.length) return final();

      const r = STORY_ROUNDS[round];
      const lines = chosenLines();
      el.innerHTML =
        '<div class="story-wrap">' +
          '<div class="guess-round-tag">故事接龙机 · 第 ' + (round + 1) + ' / ' + STORY_ROUNDS.length + ' 幕</div>' +
          '<p class="train-lead">故事已经开头。每一幕选一个方向，看看你的选择把它带到哪里。</p>' +
          '<div class="story-paper">' +
            '<span class="story-kicker">开头</span>' +
            '<p class="story-premise">' + STORY_PREMISE + '</p>' +
            lines.map((t, i) =>
              '<p class="story-line"><span class="sl-no">' + (i + 1) + '</span>' + t + '</p>'
            ).join("") +
          '</div>' +
          '<div class="story-choices">' +
            '<p class="story-q">' + r.tag + '：' + r.q + '</p>' +
            '<div class="story-opts">' +
              r.options.map((o, i) =>
                '<button type="button" class="story-opt' + (picked === i ? " on" : "") + '" data-i="' + i + '"' + (picked !== null ? " disabled" : "") + '>' +
                  '<span class="so-tag">' + String.fromCharCode(65 + i) + '</span>' +
                  '<span>' + o.text + '</span>' +
                '</button>'
              ).join("") +
            '</div>' +
          '</div>' +
          (picked !== null
            ? '<div class="story-note show"><b>你选了 ' + String.fromCharCode(65 + picked) + '。</b>' + r.options[picked].note + '</div>' +
              '<div class="story-next"><button type="button" class="btn btn-primary js-next">' + (round === STORY_ROUNDS.length - 1 ? "看完整故事 →" : "接下一句 →") + '</button></div>'
            : '') +
        '</div>';

      el.querySelectorAll(".story-opt").forEach(btn => {
        btn.addEventListener("click", () => {
          if (picked !== null) return;
          picked = parseInt(btn.dataset.i, 10);
          picks[round] = picked;
          render();
        });
      });
      const next = el.querySelector(".js-next");
      if (next) next.addEventListener("click", () => {
        round++;
        picked = null;
        render();
      });
    }

    function final() {
      const lines = chosenLines();
      const story = [STORY_PREMISE].concat(lines);
      shots = false;
      el.innerHTML =
        '<div class="story-final">' +
          '<div class="guess-round-tag">故事接龙完成 🎉 这是你的初稿</div>' +
          '<div class="story-paper final">' +
            '<span class="story-kicker">《末班车》· 你 + AI</span>' +
            story.map((t, i) =>
              '<p class="' + (i === 0 ? "story-premise" : "story-line") + '">' +
                (i === 0 ? "" : '<span class="sl-no">' + i + '</span>') + t +
              '</p>'
            ).join("") +
            '<p class="story-end">—— 完 ——</p>' +
          '</div>' +
          '<div class="train-verdict"><b>三句话，一个悬念，一个收尾。</b><br>每一个转折都是你选的。AI 只负责把可能性写出来，不负责替你拍板。</div>' +
          '<div class="story-actions">' +
            '<button type="button" class="btn btn-primary js-shots">🎬 把它变成 15 秒分镜</button>' +
            '<button type="button" class="btn btn-ghost js-copy-story">📋 复制故事</button>' +
            '<button type="button" class="btn btn-ghost js-again">重新接一次 ↻</button>' +
          '</div>' +
          '<div class="story-shots-wrap"></div>' +
        '</div>';

      el.querySelector(".js-shots").addEventListener("click", () => {
        shots = true;
        el.querySelector(".story-shots-wrap").innerHTML = shotsHtml();
        el.querySelector(".js-shots").disabled = true;
        el.querySelector(".js-shots").textContent = "✅ 分镜已生成";
        el.querySelector(".js-copy-shots").addEventListener("click", () => {
          const txt = "《末班车》15 秒分镜\n\n" + el.querySelector(".story-shots").innerText;
          copyText(txt, "分镜脚本已复制");
        });
      });
      el.querySelector(".js-copy-story").addEventListener("click", () => {
        copyText("《末班车》\n\n" + story.join("\n\n"), "故事已复制");
      });
      el.querySelector(".js-again").addEventListener("click", () => {
        round = 0; picks = []; picked = null; shots = false; render();
      });
    }

    render();
  }

  /* ================= Agent 真实回放（第 14 课） ================= */
  const AGENT_STEPS = [
    {
      type: "user", title: "你（项目经理）",
      text: "在这个空文件夹里做一个猜数字小游戏：单文件 index.html，双击能玩，1-100，有提示和重新开始。做完自己测一遍。"
    },
    {
      type: "agent", title: "OpenCode · 先看环境",
      text: "目录基本是空的。先确认环境：Node v24 可用。计划：读目录 → 写 index.html → 用 Node 测逻辑 → 修问题 → 交付。",
      tools: ["读取目录", "node -v"]
    },
    {
      type: "agent", title: "OpenCode · 写文件",
      text: "创建 index.html：单文件、内联 CSS/JS、手机自适应，按钮和回车都能提交。",
      tools: ["写入 index.html"],
      image: "opencode-start.png",
      caption: "真实 OpenCode 会话截图：目标 + 前几步执行"
    },
    {
      type: "agent", title: "OpenCode · 自测",
      text: "用 Node 加载页面里的真实 JS，跑了 30 项断言——初始状态、非法输入、猜大/猜小、猜中、重新开始，全部通过。",
      tools: ["运行测试脚本"]
    },
    {
      type: "user", title: "你（验收）",
      text: "我没有只看它的测试，自己打开浏览器点了一遍。结果报错：",
      code: "TypeError: Cannot set properties of null\n  (setting 'textContent')\n  at resetGame (index.html:240:28)"
    },
    {
      type: "agent", title: "OpenCode · 定位并修复",
      text: "找到问题根源了：statusEl 通过 getElementById('status') 取元素，但页面上的「已猜 0 次」div 只写了 class=\"status\" 没有 id=\"status\"，所以取到 null。现在修复。",
      tools: ["编辑 index.html +1 -1"],
      image: "opencode-fix.png",
      caption: "真实 OpenCode 会话截图：定位 bug 与修复"
    },
    {
      type: "agent", title: "OpenCode · 复测",
      text: "修复完成。所有 JS 里引用的 ID 都必须在 HTML 中存在；提交后次数会变、重新开始能清零；原有 30 项断言和结构检查全部通过。",
      tools: ["运行验证脚本"]
    },
    {
      type: "agent", title: "OpenCode · 交付",
      text: "完成。文件：index.html，双击就能玩，不依赖网络。下面就是它做出来的成品，你可以直接试玩。",
      demo: true
    }
  ];

  function initAgentReplay(el) {
    let step = -1;

    function shell() {
      el.innerHTML =
        '<div class="agent-window">' +
          '<div class="agent-head">' +
            '<span class="agent-dots"><i></i><i></i><i></i></span>' +
            '<b>OpenCode · 真实运行回放</b>' +
            '<span class="agent-live">● 真实会话</span>' +
          '</div>' +
          '<div class="agent-meta">模型 Flint 40B Free · 项目 agent-demo · 2026-10-26 18:41</div>' +
          '<div class="agent-log" aria-live="polite"></div>' +
          '<div class="agent-demo-slot"></div>' +
          '<div class="agent-foot"></div>' +
        '</div>';
      startScreen();
    }

    function startScreen() {
      step = -1;
      const log = el.querySelector(".agent-log");
      const slot = el.querySelector(".agent-demo-slot");
      if (slot) slot.innerHTML = "";
      log.innerHTML =
        '<div class="agent-start">' +
          '<span class="agent-start-emoji">⌨️</span>' +
          '<b>接下来看到的，不是示意图</b>' +
          '<p>这是一次真实的 OpenCode 运行：从一句目标，到能玩的成品。点「开始回放」，一步一步看。</p>' +
          '<button type="button" class="btn btn-primary js-start">▶ 开始回放</button>' +
          '<p class="agent-disclaimer">演示在空文件夹里进行，只创建 / 修改了一个 index.html。</p>' +
        '</div>';
      log.querySelector(".js-start").addEventListener("click", () => {
        log.innerHTML = "";
        step = 0;
        append(0);
        foot();
      });
      foot();
    }

    function append(i) {
      const s = AGENT_STEPS[i];
      const log = el.querySelector(".agent-log");
      const div = document.createElement("div");
      div.className = "agent-msg " + s.type + (s.demo ? " final" : "");
      div.dataset.step = String(i);
      let html =
        '<span class="agent-avatar">' + (s.type === "user" ? "你" : "OC") + '</span>' +
        '<div class="agent-bubble">' +
          '<div class="agent-name">' + s.title + '</div>' +
          '<p>' + s.text + '</p>';
      if (s.code) html += '<pre class="agent-code">' + s.code + '</pre>';
      if (s.tools) {
        html += '<div class="agent-tools">' + s.tools.map(t => '<span class="agent-tool">' + t + '</span>').join("") + '</div>';
      }
      if (s.image) {
        html += '<figure class="agent-figure">' +
          '<img src="../assets/img/lesson-14/' + s.image + '" alt="' + s.caption + '" width="1296" height="894" loading="eager" decoding="async">' +
          '<figcaption>' + s.caption + ' · <a href="../assets/img/lesson-14/' + s.image + '" target="_blank" rel="noopener">查看大图 ↗</a></figcaption>' +
        '</figure>';
      }
      if (s.demo) {
        html += '<button type="button" class="btn btn-primary js-demo-inline">🎮 去试玩成品 ↓</button>';
      }
      html += '</div>';
      div.innerHTML = html;
      log.appendChild(div);
      if (s.demo) {
        const slot = el.querySelector(".agent-demo-slot");
        if (slot) {
          slot.innerHTML =
            '<div class="agent-demo">' +
              '<div class="agent-demo-head"><b>🎮 成品试玩</b><a href="../assets/demo/guess-number.html" target="_blank" rel="noopener">新窗口打开 ↗</a></div>' +
              '<iframe src="../assets/demo/guess-number.html" title="OpenCode 生成的猜数字小游戏" loading="eager"></iframe>' +
            '</div>' +
            '<p class="agent-disclaimer">这是 Agent 真实生成的页面，不是录屏；在 iframe 里直接玩。</p>';
        }
        const inline = div.querySelector(".js-demo-inline");
        if (inline) inline.addEventListener("click", () => {
          if (slot) slot.scrollIntoView({ behavior: "smooth", block: "center" });
        });
      }
      log.scrollTop = log.scrollHeight;
      requestAnimationFrame(() => { log.scrollTop = log.scrollHeight; });
      setTimeout(() => { log.scrollTop = log.scrollHeight; }, 120);
    }

    function foot() {
      const f = el.querySelector(".agent-foot");
      if (step < 0) {
        f.innerHTML = '<span class="agent-progress">共 8 步 · 约 2 分钟</span><span class="agent-foot-note">点「开始回放」</span>';
        return;
      }
      const pct = Math.round((step + 1) / AGENT_STEPS.length * 100);
      f.innerHTML =
        '<div class="agent-progress"><span>第 ' + (step + 1) + ' / ' + AGENT_STEPS.length + ' 步</span><i><b style="width:' + pct + '%"></b></i></div>' +
        (step < AGENT_STEPS.length - 1
          ? '<div class="agent-foot-btns">' +
              '<button type="button" class="btn btn-primary js-next">下一步 →</button>' +
              '<button type="button" class="btn btn-ghost js-all">直接看成品 ⏭</button>' +
              '<button type="button" class="btn btn-ghost js-reset">重置 ↻</button>' +
            '</div>'
          : '<div class="agent-foot-btns">' +
              '<button type="button" class="btn btn-primary js-reset">再回放一次 ↻</button>' +
            '</div>');
      const next = f.querySelector(".js-next");
      if (next) next.addEventListener("click", () => { step++; append(step); foot(); });
      const all = f.querySelector(".js-all");
      if (all) all.addEventListener("click", () => {
        while (step < AGENT_STEPS.length - 1) { step++; append(step); }
        foot();
      });
      const reset = f.querySelector(".js-reset");
      if (reset) reset.addEventListener("click", () => {
        const log = el.querySelector(".agent-log");
        log.innerHTML = "";
        startScreen();
      });
    }

    shell();
  }

  /* ================= 作品清单生成器（第 15 课） ================= */
  const PROJECT_TIMES = [
    { label: "30 分钟", scope: "只做最小版本：1 页 / 1 个玩法 / 3 张图。先让它存在。" },
    { label: "2 小时", scope: "加一点：配图、音效、第二页，或者把玩法再磨顺一点。" },
    { label: "一个周末", scope: "做成小系列：3 页 / 3 个关卡 / 10 张图，够发一次完整作品。" }
  ];

  const PROJECT_KINDS = [
    {
      emoji: "🏠", name: "个人主页 / 家庭相册",
      title: "我的第一张个人主页",
      goal: "一页讲清：我是谁、我在做什么、怎么找到我。",
      steps: [
        "选 3 张照片或作品图（没有就现拍）",
        "让 AI 写 3 版 100 字自我介绍，你挑一版",
        "让 AI 生成一页 HTML，或套一个免费模板",
        "发给家人看，按反馈改一版"
      ],
      ai: ["写 3 版自我介绍", "把长介绍改短、改口语", "生成单文件 HTML/CSS"],
      tools: "DeepSeek / 豆包 + 任意浏览器"
    },
    {
      emoji: "🎮", name: "小游戏 / 小工具",
      title: "一个 30 秒能玩一局的小游戏",
      goal: "猜数字、抽签、接住小猫，任选一个玩法。",
      steps: [
        "选一个玩法，用一句话写清规则",
        "让 AI 生成单文件 HTML",
        "自己玩 3 局，记下卡住的地方",
        "把问题丢回给 AI，改到顺手"
      ],
      ai: ["把玩法写成规则", "生成 HTML/CSS/JS", "根据你的测试报错修复"],
      tools: "DeepSeek / 豆包 + OpenCode（可选）"
    },
    {
      emoji: "📖", name: "绘本 / 菜谱 / 表情包",
      title: "一本 6 页的电子小书",
      goal: "三道家常菜、一个睡前故事、一套表情包，选一个主题。",
      steps: [
        "定主题，列出 6 页内容",
        "让 AI 写每页 50 字说明",
        "用即梦 / 豆包生成 3–6 张配图",
        "拼成一页网页或 PDF，发给家人"
      ],
      ai: ["列目录和每页文案", "生成配图提示词", "检查错别字和顺序"],
      tools: "DeepSeek / 豆包 + 即梦"
    }
  ];

  const PROJECT_AUDIENCES = [
    { label: "家人", publish: "先发到家人群，让爸妈第一个看到。他们的反馈最直接。" },
    { label: "朋友", publish: "发朋友圈 / 群，点名 3 个人给你反馈。别只发「求赞」。" },
    { label: "网友", publish: "发小红书 / 视频号；网页作品可以传到 GitHub Pages，像这门课一样。" }
  ];

  const PROJECT_CHECK = [
    "定主题，写下一句话目标",
    "让 AI 出 2–3 个方案，选一个",
    "做出最小版本（能打开 / 能玩 / 能看）",
    "发给 1 个人，收 3 条反馈",
    "改一版，再发出去"
  ];

  function initProjectGen(el) {
    let sel = { time: 0, kind: 0, audience: 0 };
    let result = null;
    let checked = [];

    function chips(key, items, current) {
      return '<div class="proj-chips">' + items.map((it, i) =>
        '<button type="button" class="proj-chip' + (current === i ? " on" : "") + '" data-group="' + key + '" data-i="' + i + '">' + (it.emoji ? it.emoji + " " : "") + (it.label || it.name) + '</button>'
      ).join("") + '</div>';
    }

    function render() {
      el.innerHTML =
        '<div class="proj-builder">' +
          '<div class="guess-round-tag">作品清单生成器 · 先选三样</div>' +
          '<p class="train-lead">时间、兴趣、给谁看。选完点「生成我的作品」，它会给你一张能直接开做的清单。</p>' +
          '<div class="proj-group"><span class="art-label">1. 你有多少时间？</span>' + chips("time", PROJECT_TIMES, sel.time) + '</div>' +
          '<div class="proj-group"><span class="art-label">2. 你想做什么？</span>' + chips("kind", PROJECT_KINDS, sel.kind) + '</div>' +
          '<div class="proj-group"><span class="art-label">3. 做给谁看？</span>' + chips("audience", PROJECT_AUDIENCES, sel.audience) + '</div>' +
          '<div class="proj-actions">' +
            '<button type="button" class="btn btn-primary js-generate">🎁 生成我的作品</button>' +
            '<button type="button" class="btn btn-ghost js-random">🎲 随机给我一个</button>' +
          '</div>' +
          '<div class="proj-result"></div>' +
        '</div>';

      el.querySelectorAll(".proj-chip").forEach(btn => {
        btn.addEventListener("click", () => {
          sel[btn.dataset.group] = parseInt(btn.dataset.i, 10);
          result = null;
          render();
        });
      });
      el.querySelector(".js-generate").addEventListener("click", () => {
        result = { time: sel.time, kind: sel.kind, audience: sel.audience };
        checked = PROJECT_CHECK.map(() => false);
        showResult();
      });
      el.querySelector(".js-random").addEventListener("click", () => {
        sel = {
          time: Math.floor(Math.random() * PROJECT_TIMES.length),
          kind: Math.floor(Math.random() * PROJECT_KINDS.length),
          audience: Math.floor(Math.random() * PROJECT_AUDIENCES.length)
        };
        result = { time: sel.time, kind: sel.kind, audience: sel.audience };
        checked = PROJECT_CHECK.map(() => false);
        render();
        window.dispatchEvent(new CustomEvent("aic-toast", { detail: "给你随机配了一个，不喜欢就再点一次" }));
      });
      if (result) showResult();
    }

    function showResult() {
      const wrap = el.querySelector(".proj-result");
      if (!wrap || !result) return;
      const time = PROJECT_TIMES[result.time];
      const kind = PROJECT_KINDS[result.kind];
      const aud = PROJECT_AUDIENCES[result.audience];
      wrap.innerHTML =
        '<div class="proj-card">' +
          '<span class="proj-badge">' + time.label + ' · 给' + aud.label + '看</span>' +
          '<h3>' + kind.emoji + ' ' + kind.title + '</h3>' +
          '<p class="proj-goal">🎯 ' + kind.goal + '</p>' +
          '<div class="proj-section"><b>✂️ 最小版本</b><p>' + time.scope + '</p></div>' +
          '<div class="proj-section"><b>🧭 4 步做完</b><ol>' + kind.steps.map(s => '<li>' + s + '</li>').join("") + '</ol></div>' +
          '<div class="proj-section"><b>🤖 让 AI 帮你</b><ul>' + kind.ai.map(s => '<li>' + s + '</li>').join("") + '</ul></div>' +
          '<div class="proj-section"><b>📣 发布</b><p>' + aud.publish + '</p></div>' +
          '<div class="proj-section"><b>🧰 顺手工具</b><p>' + kind.tools + '</p></div>' +
          '<div class="proj-check">' +
            '<b>✅ 完成清单 <span class="proj-count">0 / ' + PROJECT_CHECK.length + '</span></b>' +
            PROJECT_CHECK.map((t, i) =>
              '<label><input type="checkbox" data-i="' + i + '"><span>' + t + '</span></label>'
            ).join("") +
            '<p class="proj-check-note">' + (result.time === 0 ? "30 分钟版：先勾前 3 项，今天就能有第一版。" : "不用等完美，先把第一版发出去。") + '</p>' +
          '</div>' +
          '<div class="proj-foot">' +
            '<button type="button" class="btn btn-ghost js-copy-list">📋 复制清单</button>' +
            '<button type="button" class="btn btn-ghost js-again">重新选 ↻</button>' +
          '</div>' +
          '<p class="proj-note">作品三件套：一个标题 + 一句话介绍 + 一个能打开的链接 / 文件。</p>' +
        '</div>';

      wrap.querySelectorAll(".proj-check input").forEach(cb => {
        cb.addEventListener("change", () => {
          checked[parseInt(cb.dataset.i, 10)] = cb.checked;
          const n = checked.filter(Boolean).length;
          wrap.querySelector(".proj-count").textContent = n + " / " + PROJECT_CHECK.length;
          if (n === PROJECT_CHECK.length) {
            window.dispatchEvent(new CustomEvent("aic-toast", { detail: "清单全勾完了，发出去吧 🎉" }));
          }
        });
      });
      wrap.querySelector(".js-copy-list").addEventListener("click", () => {
        const txt = "【我的作品清单】\n" +
          kind.title + "\n" +
          "目标：" + kind.goal + "\n" +
          "时间：" + time.label + " · 给" + aud.label + "看\n\n" +
          "4 步做完：\n" + kind.steps.map((s, i) => (i + 1) + ". " + s).join("\n") + "\n\n" +
          "让 AI 帮你：\n" + kind.ai.map(s => "- " + s).join("\n") + "\n\n" +
          "发布：" + aud.publish + "\n\n" +
          "完成清单：\n" + PROJECT_CHECK.map(s => "- [ ] " + s).join("\n");
        copyText(txt, "作品清单已复制");
      });
      wrap.querySelector(".js-again").addEventListener("click", () => {
        result = null;
        render();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      wrap.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    render();
  }

  /* ================= 隐私红绿灯（第 17 课） ================= */
  const PV_LEVELS = {
    green: { emoji: "🟢", label: "绿灯", short: "可以直接发", desc: "公开信息 / 通用问题" },
    yellow: { emoji: "🟡", label: "黄灯", short: "脱敏再发", desc: "真实信息，但先改名 / 去号码" },
    red: { emoji: "🔴", label: "红灯", short: "绝不发", desc: "能定位到你或别人的敏感信息" }
  };

  const PRIVACY_ITEMS = [
    {
      text: "帮我润色这句生日祝福：祝妈妈身体健康，天天开心。",
      level: "green",
      why: "没有姓名、住址、电话，也不涉及别人的隐私。这种通用文字可以放心问。"
    },
    {
      text: "我住在幸福小区 3 栋 502，帮我规划明天早上到公司的公交路线。",
      level: "red",
      why: "住址 + 通勤时间，能拼出你什么时候不在家。路线问题说到小区或地铁站就够了。",
      safer: "从幸福小区附近到公司，早高峰怎么坐车？"
    },
    {
      text: "我 12 岁，上六年级，想做一个暑假计划，每天学习 2 小时。",
      level: "green",
      why: "只说了年龄和年级，没有姓名、学校、住址。涉及孩子时，信息越少越安全。"
    },
    {
      text: "孩子李小明在实验小学三年级二班，帮我写一张请假条。",
      level: "red",
      why: "姓名 + 学校 + 班级，是能直接找到孩子的组合。请假条写到「三年级学生」就够了。",
      safer: "孩子上小学三年级，明天发烧要请假一天，帮我写一张请假条。"
    },
    {
      text: "这是银行卡正面照片，帮我看看卡号有没有填错。",
      level: "red",
      why: "银行卡号、有效期、背面安全码都不能发给 AI；照片背景也可能带出其他信息。"
    },
    {
      text: "这份合同有甲方公司名、客户电话和报价，帮我看看付款条款有没有坑。",
      level: "yellow",
      why: "合同可以问，但先把公司名、电话、报价换成「A 公司」「某客户」「某金额」。",
      safer: "这份合同我隐去了公司名和电话，帮我看看付款条款有哪些风险。"
    },
    {
      text: "把这张旅游照片配一句文案，照片里有我和朋友的正脸。",
      level: "yellow",
      why: "发图前先征求朋友同意；不想露脸就裁掉或打码。写文案并不需要 AI 看清正脸。"
    },
    {
      text: "我们公司下月要裁 10 人，这是名单，帮我写通知。",
      level: "red",
      why: "他人姓名 + 裁员计划，既是个人隐私，也是公司机密。这类内容不要上传到外部工具。"
    },
    {
      text: "帮我列一份《夏洛的网》读书笔记提纲，给五年级学生用。",
      level: "green",
      why: "公开书名 + 通用年级，没有个人信息。问公开知识、写作方法，通常是绿灯。"
    }
  ];

  function initPrivacy(el) {
    let index = 0, score = 0, picked = null;

    function render() {
      if (index >= PRIVACY_ITEMS.length) return final();
      const item = PRIVACY_ITEMS[index];
      const isAnswered = picked !== null;
      el.innerHTML =
        '<div class="pv-wrap">' +
          '<div class="pv-top">' +
            '<span class="guess-round-tag">隐私红绿灯 · 第 ' + (index + 1) + ' / ' + PRIVACY_ITEMS.length + ' 题</span>' +
            '<span class="pv-score">答对 ' + score + ' 题</span>' +
          '</div>' +
          '<div class="pv-legend">' +
            '<span class="pv-pill green">🟢 绿灯 · 可以发</span>' +
            '<span class="pv-pill yellow">🟡 黄灯 · 脱敏再发</span>' +
            '<span class="pv-pill red">🔴 红灯 · 绝不发</span>' +
          '</div>' +
          '<p class="train-lead">假设你要把下面这句话发给 AI。先停一秒，选一盏灯。</p>' +
          '<div class="pv-card">' +
            '<span class="pv-emoji">💬</span>' +
            '<p class="pv-text">' + item.text + '</p>' +
            '<span class="pv-source">你准备发给 AI 的话</span>' +
          '</div>' +
          '<div class="pv-choices">' +
            ['green', 'yellow', 'red'].map(level =>
              '<button type="button" class="pv-btn ' + level + (picked === level ? " picked" : "") + '" data-level="' + level + '"' + (isAnswered ? " disabled" : "") + '>' +
                '<span class="pv-emoji">' + PV_LEVELS[level].emoji + '</span>' +
                '<b>' + PV_LEVELS[level].label + '</b>' +
                '<small>' + PV_LEVELS[level].short + '</small>' +
              '</button>'
            ).join("") +
          '</div>' +
          (isAnswered ? feedback(item) : '') +
        '</div>';

      if (!isAnswered) {
        el.querySelectorAll(".pv-btn").forEach(btn => {
          btn.addEventListener("click", () => {
            picked = btn.dataset.level;
            if (picked === item.level) score++;
            render();
          });
        });
      } else {
        const next = el.querySelector(".js-pv-next");
        if (next) next.addEventListener("click", () => {
          index++;
          picked = null;
          render();
        });
      }
    }

    function feedback(item) {
      const ok = picked === item.level;
      const right = PV_LEVELS[item.level];
      return '<div class="pv-fb ' + (ok ? "ok" : "bad") + '">' +
        '<div class="pv-fb-head">' + (ok ? "✅ 判断正确" : "👀 再看一眼") + ' · 这题是 ' + right.emoji + ' ' + right.label + '</div>' +
        '<p>' + item.why + '</p>' +
        (item.safer ? '<p class="pv-safer"><b>更安全的说法：</b>' + item.safer + '</p>' : '') +
        '<div class="pv-next"><button type="button" class="btn btn-primary js-pv-next">' +
          (index === PRIVACY_ITEMS.length - 1 ? "看我的隐私成绩 →" : "下一题 →") +
        '</button></div>' +
      '</div>';
    }

    function final() {
      const pct = Math.round(score / PRIVACY_ITEMS.length * 100);
      const verdict = score === PRIVACY_ITEMS.length
        ? "满灯通过！你已经有了「发之前先停一秒」的肌肉记忆。"
        : score >= 7
          ? "很稳了。剩下几题，多半是「真实信息能不能脱敏」的边界。"
          : "别急，关键不是背答案，而是记住：能定位到人、能造成损失的信息，先不发。";
      el.innerHTML =
        '<div class="pv-final">' +
          '<div class="pv-score-big">' + score + ' <small>/ ' + PRIVACY_ITEMS.length + '</small></div>' +
          '<h3>隐私红绿灯 · 本轮完成</h3>' +
          '<p>' + verdict + '</p>' +
          '<div class="pv-final-bar"><i style="width:' + pct + '%"></i></div>' +
          '<div class="pv-final-rules">' +
            '<span>🟢 公开信息、通用问题：可以发</span>' +
            '<span>🟡 真实信息：先改名、去号码、换金额</span>' +
            '<span>🔴 身份证 / 银行卡 / 验证码 / 孩子学校住址：不发</span>' +
          '</div>' +
          '<button type="button" class="btn btn-ghost js-pv-again">再玩一次 ↻</button>' +
        '</div>';
      el.querySelector(".js-pv-again").addEventListener("click", () => {
        index = 0; score = 0; picked = null; render();
      });
    }

    render();
  }

  /* ================= 识破骗局小剧场（第 18 课） ================= */
  const SCAM_SCENES = [
    {
      tag: "第一幕 · 视频里的女儿",
      kind: "video",
      head: "视频通话 · 女儿",
      meta: "来电显示：女儿 · 00:12 · 画面有点卡",
      lines: [
        { who: "女儿", tone: "them", text: "妈，我手机摔坏了，借同学的手机打给你。我骑车撞了人，对方要 5 万私了……" },
        { who: "女儿", tone: "them", text: "千万别告诉我爸，也别报警，我现在好怕。你快转到这个账户，晚了对方就要报警了。" }
      ],
      q: "视频里的脸和声音都很像女儿。你会怎么做？",
      options: [
        { text: "孩子出事要紧，先转 5 万，别耽误。", good: false, outcome: "转账后，对方立刻拉黑。视频是骗子用几秒素材合成的。", why: "越急越要慢。骗子最怕你挂断电话去核实。" },
        { text: "先挂断，用通讯录里女儿的号码回拨，再打给学校。", good: true, outcome: "女儿正在上课，根本没出事。你保住了 5 万。", why: "用你自己存的号码回拨，才不会被骗子牵着走。" },
        { text: "在视频里问她：你是不是我女儿？", good: false, outcome: "对方哭着说「妈你不认识我了吗」，你更慌了。", why: "骗子早准备好了台词。视频里问，还是在骗子的舞台上。" }
      ],
      trap: "骗子的下一步：继续哭、继续催，让你没时间挂断。"
    },
    {
      tag: "第二幕 · 新号码里的「领导」",
      kind: "chat",
      head: "新好友 · 王总",
      meta: "对方通过手机号搜索添加 · 头像和领导一样",
      lines: [
        { who: "王总", tone: "them", text: "小林，我在开会不方便接电话。合作方那边急着要 2 万保证金，你先垫一下，明天回公司报销。" },
        { who: "王总", tone: "them", text: "别在群里说，影响不好。转完把截图发我。" }
      ],
      q: "「领导」用新号加你，催你垫钱。你会怎么做？",
      options: [
        { text: "领导不能得罪，先转，明天再说。", good: false, outcome: "「王总」收钱后消失。真正的王总根本没加过你。", why: "头像、语气都能复制，只有你主动核实才可靠。" },
        { text: "用公司通讯录里的号码打给王总本人，或当面确认。", good: true, outcome: "王总说没这回事。你把新号拉黑，顺手提醒了同事。", why: "换一条你自己知道的渠道核实，不走骗子给的新号码。" },
        { text: "发微信问一句：王总，是您本人吗？", good: false, outcome: "对方秒回「当然是我」，还发来一张模糊的身份证照片。", why: "同一个聊天窗口里的「本人」，证明不了任何事。" }
      ],
      trap: "骗子的下一步：用「领导」身份压你，再用「别声张」堵住你核实的路。"
    },
    {
      tag: "第三幕 · 客服的「安全操作」",
      kind: "call",
      head: "来电 · 某平台客服",
      meta: "来电显示可伪造 · 对方称你的账户误开通会员",
      lines: [
        { who: "客服", tone: "them", text: "您的账户误开通了年度会员，今晚 12 点前不关闭，每月扣 800。现在按我说的做，我帮您取消。" },
        { who: "客服", tone: "them", text: "先下载这个屏幕共享 App，再把收到的验证码报给我。放心，这是安全账户，不会动您的钱。" }
      ],
      q: "对方要你共享屏幕、报验证码。你会怎么做？",
      options: [
        { text: "客服也不容易，按他说的做，赶紧关掉扣费。", good: false, outcome: "共享屏幕后，对方看到了你的验证码，转走了卡里的钱。", why: "验证码和屏幕共享，等于把家门钥匙交给对方。" },
        { text: "挂断，打开官方 App 或打官方客服电话核实。", good: true, outcome: "官方客服说没有这回事。你没有下载任何 App。", why: "涉及钱和账号，只走官方入口，不用对方给的链接或电话。" },
        { text: "先加对方微信，把身份证发过去证明身份。", good: false, outcome: "对方拿到你的姓名、身份证号，开始申请网贷。", why: "越是催你「证明身份」的，越可能是在收集你的信息。" }
      ],
      trap: "骗子的下一步：用「今晚就扣费」制造倒计时，再用「安全账户」让你放松警惕。"
    }
  ];

  function initScamTheater(el) {
    let stage = -1, score = 0, picked = null;

    function start() {
      stage = -1; score = 0; picked = null;
      el.innerHTML =
        '<div class="scam-start">' +
          '<span class="scam-start-emoji">🎭</span>' +
          '<h3>识破骗局小剧场</h3>' +
          '<p>三段模拟来电，台词做了简化。<b>不是真实来电</b>，但套路是真的：催你、让你保密、让你转账。</p>' +
          '<p class="scam-warn">你的任务：每一幕选一个动作，看看骗子下一步会怎么走。</p>' +
          '<button type="button" class="btn btn-primary js-scam-start">▶ 进入第一幕</button>' +
        '</div>';
      el.querySelector(".js-scam-start").addEventListener("click", () => {
        stage = 0; picked = null; render();
      });
    }

    function render() {
      if (stage >= SCAM_SCENES.length) return final();
      const s = SCAM_SCENES[stage];
      const answered = picked !== null;
      el.innerHTML =
        '<div class="scam-wrap">' +
          '<div class="scam-top">' +
            '<span class="guess-round-tag">' + s.tag + ' · 第 ' + (stage + 1) + ' / ' + SCAM_SCENES.length + ' 幕</span>' +
            '<span class="scam-score">识破 ' + score + ' 幕</span>' +
          '</div>' +
          '<div class="scam-phone">' +
            '<div class="scam-phone-head">' +
              '<span class="scam-dots"><i></i><i></i><i></i></span>' +
              '<b>' + s.head + '</b>' +
              '<span class="scam-fake">模拟</span>' +
            '</div>' +
            '<div class="scam-meta">' + s.meta + '</div>' +
            '<div class="scam-screen">' +
              '<div class="scam-caller"><span>' + (s.kind === "video" ? "📹" : s.kind === "chat" ? "💬" : "📞") + '</span><b>' + s.head + '</b><small>对方正在说话</small></div>' +
              s.lines.map(l =>
                '<div class="scam-bubble ' + l.tone + '"><span class="scam-who">' + l.who + '</span><p>' + l.text + '</p></div>'
              ).join("") +
            '</div>' +
          '</div>' +
          '<p class="scam-q">' + s.q + '</p>' +
          '<div class="scam-options">' +
            s.options.map((o, i) => {
              let cls = "scam-opt";
              if (answered) {
                if (o.good) cls += " ok";
                if (picked === i && !o.good) cls += " bad";
                if (picked === i && o.good) cls += " picked";
              }
              return '<button type="button" class="' + cls + '" data-i="' + i + '"' + (answered ? " disabled" : "") + '>' +
                '<span class="scam-letter">' + String.fromCharCode(65 + i) + '</span>' +
                '<span>' + o.text + '</span>' +
              '</button>';
            }).join("") +
          '</div>' +
          (answered ? outcome(s) : '') +
        '</div>';

      if (!answered) {
        el.querySelectorAll(".scam-opt").forEach(btn => {
          btn.addEventListener("click", () => {
            picked = parseInt(btn.dataset.i, 10);
            if (s.options[picked].good) score++;
            render();
          });
        });
      } else {
        el.querySelector(".js-scam-next").addEventListener("click", () => {
          stage++;
          picked = null;
          render();
        });
      }
    }

    function outcome(s) {
      const o = s.options[picked];
      return '<div class="scam-outcome ' + (o.good ? "ok" : "bad") + '">' +
        '<div class="scam-outcome-head">' + (o.good ? "✅ 这一步走对了" : "❌ 这一步被带走了") + '</div>' +
        '<p class="scam-result">' + o.outcome + '</p>' +
        '<p class="scam-why"><b>为什么：</b>' + o.why + '</p>' +
        '<p class="scam-trap">' + s.trap + '</p>' +
        '<div class="scam-next"><button type="button" class="btn btn-primary js-scam-next">' +
          (stage === SCAM_SCENES.length - 1 ? "看我的反诈成绩 →" : "进入下一幕 →") +
        '</button></div>' +
      '</div>';
    }

    function final() {
      const verdict = score === SCAM_SCENES.length
        ? "三幕全识破。你已经把「停、核、问、报」练成了条件反射。"
        : score === 2
          ? "差一点全对。记住：只要对方催你转账，先挂断，再换一条渠道核实。"
          : "别灰心，骗子的剧本就是为「来不及想」设计的。慢下来，你就赢了一半。";
      el.innerHTML =
        '<div class="scam-final">' +
          '<div class="scam-score-big">' + score + ' <small>/ ' + SCAM_SCENES.length + '</small></div>' +
          '<h3>反诈小剧场 · 本轮结束</h3>' +
          '<p>' + verdict + '</p>' +
          '<div class="scam-rules">' +
            '<span><b>停</b> 挂断 / 退出，不按对方节奏走</span>' +
            '<span><b>核</b> 用自己存的号码 / 官方 App / 当面</span>' +
            '<span><b>问</b> 问只有家人知道的暗号</span>' +
            '<span><b>报</b> 110 / 96110，联系银行，保存证据</span>' +
          '</div>' +
          '<div class="scam-actions">' +
            '<button type="button" class="btn btn-primary js-copy-pact">📋 复制家庭防骗约定</button>' +
            '<button type="button" class="btn btn-ghost js-scam-again">再演一次 ↻</button>' +
          '</div>' +
          '<p class="scam-foot-note">被骗不是丢人。越早说出来、越早报警，越可能减少损失。</p>' +
        '</div>';
      el.querySelector(".js-copy-pact").addEventListener("click", () => {
        copyText(
          "【家庭防骗约定】\n" +
          "1. 任何人在电话 / 视频里催转账，先挂断。\n" +
          "2. 用自己手机里存的号码回拨核实，不用对方给的号码。\n" +
          "3. 不报验证码、不共享屏幕、不装陌生 App、不转「安全账户」。\n" +
          "4. 大额转账必须当面或电话确认，家里设一个只有家人知道的暗号。\n" +
          "5. 被骗不丢人：立刻打 110 / 96110，联系银行，保存记录。",
          "家庭防骗约定已复制，发给家人吧"
        );
      });
      el.querySelector(".js-scam-again").addEventListener("click", start);
    }

    start();
  }

  /* ================= 职业温度计（第 19 课） ================= */
  const CAREERS = [
    {
      emoji: "📊", name: "数据录入 / 初级会计", heat: 82, tag: "规则重复多",
      tasks: ["发票录入、对账", "生成固定格式报表", "查找政策条文"],
      human: ["异常和假账判断", "和客户 / 税务沟通", "对报表签字负责"],
      tip: "先让 AI 做第一遍，你专盯异常和沟通。",
      learn: "学一个表格 / 财务 AI 工具，练「异常排查」和「把话说清楚」。"
    },
    {
      emoji: "🎧", name: "客服 / 呼叫中心", heat: 72, tag: "标准问答多",
      tasks: ["常见问题回复", "工单分类和摘要", "整理客户反馈"],
      human: ["安抚情绪", "处理投诉和例外", "复杂协商"],
      tip: "把重复问答交给 AI，把时间留给真正生气的人。",
      learn: "练情绪劳动、产品知识和临场判断，别只背话术。"
    },
    {
      emoji: "🎨", name: "平面设计 / 美工", heat: 58, tag: "出图快，判断难",
      tasks: ["找参考、出草图", "抠图、批量改尺寸", "生成配图初稿"],
      human: ["访谈需求", "品牌策略和审美取舍", "对成品负责"],
      tip: "让 AI 先出 10 版，你负责挑和改。",
      learn: "把 AI 当草图机，练「说清需求」和「一眼挑出好图」。"
    },
    {
      emoji: "💻", name: "程序员", heat: 52, tag: "样板代码多",
      tasks: ["样板代码", "查报错、写测试", "生成文档和注释"],
      human: ["定义问题和架构", "代码评审", "上线后果负责"],
      tip: "让 AI 写第一版和测试，你做评审和拍板。",
      learn: "练拆问题、读代码、写测试，别把「会生成」当「会负责」。"
    },
    {
      emoji: "🤝", name: "销售 / 客户经理", heat: 45, tag: "资料活可外包",
      tasks: ["整理客户资料", "写话术初稿", "做方案框架"],
      human: ["建立信任", "谈判和现场反应", "长期关系"],
      tip: "让 AI 做功课，你去见人、听需求。",
      learn: "用 AI 准备客户背景和方案，把省下的时间用来跟人聊。"
    },
    {
      emoji: "👩‍🏫", name: "小学老师", heat: 35, tag: "育人部分难替代",
      tasks: ["备课素材", "分层出题", "批改客观题"],
      human: ["课堂管理", "观察和鼓励孩子", "家校沟通"],
      tip: "把出题和资料整理交出去，把眼睛留给孩子。",
      learn: "学用 AI 出分层题、做课件，但别把育人也外包。"
    },
    {
      emoji: "🩺", name: "护士 / 照护者", heat: 28, tag: "手上和床边是核心",
      tasks: ["护理记录", "知识查询", "排班和提醒"],
      human: ["床边观察", "实际操作", "安慰和陪伴"],
      tip: "让 AI 少写一点文书，你多留一点时间在床边。",
      learn: "学用 AI 查指南、写记录，核心还是手上的功夫和判断。"
    },
    {
      emoji: "🍳", name: "厨师 / 手艺人", heat: 25, tag: "现场和手感值钱",
      tasks: ["菜单灵感", "成本表", "写菜品介绍"],
      human: ["火候和味道", "现场出品", "根据客人调整"],
      tip: "让 AI 算成本、写菜单，锅铲还是你拿。",
      learn: "用 AI 做菜单和成本，把时间花在试菜和出品上。"
    }
  ];

  function initCareer(el) {
    let sel = 2;

    function heatLabel(h) {
      return h >= 70 ? "偏高" : h >= 45 ? "中等" : "偏低";
    }

    function render() {
      const c = CAREERS[sel];
      el.innerHTML =
        '<div class="career-wrap">' +
          '<div class="guess-round-tag">职业温度计 · 点一个职业，拆开看任务</div>' +
          '<p class="train-lead">指数越高，说明这份工作里「重复、规则型」的任务越多，越适合先交给 AI。<b>它不是「你被替代的概率」。</b></p>' +
          '<div class="career-chips">' +
            CAREERS.map((it, i) =>
              '<button type="button" class="career-chip' + (i === sel ? " on" : "") + '" data-i="' + i + '">' +
                it.emoji + ' ' + it.name + '</button>'
            ).join("") +
          '</div>' +
          '<div class="career-panel">' +
            '<div class="career-title">' +
              '<div><span class="career-emoji">' + c.emoji + '</span><b>' + c.name + '</b><small>' + c.tag + '</small></div>' +
              '<span class="career-badge">' + heatLabel(c.heat) + '</span>' +
            '</div>' +
            '<div class="career-meter-head"><b>AI 可接手任务指数</b><span>' + c.heat + ' / 100 · 示意</span></div>' +
            '<div class="career-bar"><i style="width:' + c.heat + '%"></i></div>' +
            '<p class="career-meter-note">不同公司、不同地区差别很大。这张表只帮你拆任务，不是职业判决书。</p>' +
            '<div class="career-cols">' +
              '<div class="career-col"><b>🤖 可以交给 AI</b><ul>' + c.tasks.map(t => '<li>' + t + '</li>').join("") + '</ul></div>' +
              '<div class="career-col human"><b>🧑 更像人的部分</b><ul>' + c.human.map(t => '<li>' + t + '</li>').join("") + '</ul></div>' +
            '</div>' +
            '<div class="career-tip"><b>把 AI 当实习生，怎么带？</b><p>' + c.tip + '</p></div>' +
            '<div class="career-learn"><b>增强建议：</b>' + c.learn + '</div>' +
          '</div>' +
          '<p class="career-foot-note">真正的安全感，不是「AI 不会」，而是「我会用它，也会做它做不了的事」。</p>' +
        '</div>';

      el.querySelectorAll(".career-chip").forEach(btn => {
        btn.addEventListener("click", () => {
          sel = parseInt(btn.dataset.i, 10);
          render();
        });
      });
    }

    render();
  }

  /* ================= 30 天行动计划（第 20 课） ================= */
  const FINAL_TIMES = [
    { label: "10 分钟", note: "每天只做周计划里的第一步，做完就停。", short: "轻量" },
    { label: "20 分钟", note: "做一步 + 用 5 分钟检查结果。", short: "标准" },
    { label: "30 分钟", note: "做一步 + 一个进阶动作（改一版 / 发给别人看）。", short: "进阶" }
  ];

  const FINAL_GOALS = {
    work: {
      emoji: "💼", label: "工作提效", intro: "把最烦的重复活交出去，把时间留给判断和沟通。",
      weeks: [
        { title: "第 1 周 · 用起来", tasks: ["打开 DeepSeek，问一个今天真实的工作问题", "让它把 3 条会议记录整理成待办", "让它把一封邮件改短 30%", "记下最顺手的 1 个用法"] },
        { title: "第 2 周 · 解决一个真问题", tasks: ["选一个每周都烦你的任务：周报 / 表格 / 客户回复", "把背景、标准、一个样例写给它", "让它出 2 版，你挑一版改", "记录这次省下的时间"] },
        { title: "第 3 周 · 做出一个小作品", tasks: ["把重复流程整理成一页 SOP", "让 AI 生成模板和检查清单", "发给同事试用，收 3 条反馈", "改一版，存进团队文档"] },
        { title: "第 4 周 · 教一个人 + 复盘", tasks: ["教同事 / 家人一个用法", "让对方自己操作一遍", "记下 3 个最容易卡住的点", "写下下个 30 天想试的 1 件事"] }
      ]
    },
    study: {
      emoji: "📚", label: "学习成长", intro: "不只用它写作业，用它讲懂、考你、找薄弱点。",
      weeks: [
        { title: "第 1 周 · 变成学习搭子", tasks: ["让它用 3 种说法解释今天最难的 1 个概念", "让它出 5 道题，做完再要解析", "把错题发给它，问错在哪一步", "让它把本章整理成 5 张复习卡"] },
        { title: "第 2 周 · 攻一个薄弱点", tasks: ["选最没底的一章 / 一个技能", "让它按你的水平出 10 道题", "只研究错得最多的 2 道", "合上书，自己讲一遍"] },
        { title: "第 3 周 · 做一份学习作品", tasks: ["做一页复习卡 / 思维导图 / 口语录音", "让 AI 当听众，提 3 个问题", "按问题补一遍", "发给同学 / 家人看"] },
        { title: "第 4 周 · 教一个人 + 复盘", tasks: ["把今天学到的讲给一个人听", "让对方问你 3 个问题", "记下答不上来的地方", "下周只补这 3 个点"] }
      ]
    },
    life: {
      emoji: "🍜", label: "生活助手", intro: "菜谱、报修、行程、家庭计划——从一件小事开始省心。",
      weeks: [
        { title: "第 1 周 · 接手生活杂事", tasks: ["问一次菜谱：按冰箱现有食材、人数、时间", "让它写一条报修 / 投诉信息", "让它排一个半日行程：预算、同行人、交通", "记下哪一句最省事"] },
        { title: "第 2 周 · 解决一个真麻烦", tasks: ["选一件拖了很久的小事：报销 / 修东西 / 家庭计划", "把事实、时间、诉求告诉 AI", "让它出 2 个方案，你选一个", "真的去办，回来记结果"] },
        { title: "第 3 周 · 做一份家庭作品", tasks: ["做一本 3 道菜的家庭菜谱", "或做一份周末半日游计划", "让 AI 配文案 / 配图提示词", "发到家人群，收 3 条反馈"] },
        { title: "第 4 周 · 教一个人 + 复盘", tasks: ["教爸妈 / 邻居一个用法", "让对方自己问一次", "记下他们最担心的问题", "把安全提醒再说一遍"] }
      ]
    },
    create: {
      emoji: "🎨", label: "创作作品", intro: "把想象力变成一张图、一个故事、一件能发出去的小作品。",
      weeks: [
        { title: "第 1 周 · 每天一个小创作", tasks: ["写一句画面提示词，生成 1 张图", "给这张图配 3 句故事开头", "选一个开头，接 3 句", "存进一个「灵感」文件夹"] },
        { title: "第 2 周 · 定一个主题", tasks: ["选一个你真正想做的主题：猫 / 家常菜 / 家乡", "让 AI 出 3 个作品方向", "选一个，列出 5 个画面 / 5 段文字", "做第一版，不追求完美"] },
        { title: "第 3 周 · 做出完整作品", tasks: ["做 6 页绘本 / 1 套表情包 / 1 个 15 秒短片", "让 AI 帮你补文案、改分镜", "发给 3 个人看，收反馈", "改一版，发出去"] },
        { title: "第 4 周 · 教一个人 + 复盘", tasks: ["教朋友一个提示词技巧", "一起做一张图 / 一段故事", "记下对方最惊讶的地方", "写下下一个作品想做什么"] }
      ]
    }
  };

  function initFinalPlan(el) {
    const LS_KEY = "aic-30day";
    let sel = { goal: "work", time: 1 };
    let checked = Array(30).fill(false);
    let result = false;

    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEY));
      if (saved && FINAL_GOALS[saved.goal] && typeof saved.time === "number" && saved.time >= 0 && saved.time < FINAL_TIMES.length) {
        sel = { goal: saved.goal, time: saved.time };
        if (Array.isArray(saved.checked) && saved.checked.length === 30) {
          checked = saved.checked.map(Boolean);
        }
        result = true;
      }
    } catch (e) {}

    function save() {
      try { localStorage.setItem(LS_KEY, JSON.stringify({ goal: sel.goal, time: sel.time, checked: checked })); } catch (e) {}
    }

    function countDone() {
      return checked.filter(Boolean).length;
    }

    function chips(items, key, current, kind) {
      return '<div class="plan-chips">' + items.map((it, i) => {
        const label = kind === "goal" ? it.emoji + " " + it.label : it.label;
        return '<button type="button" class="plan-chip' + (current === i ? " on" : "") + '" data-key="' + key + '" data-i="' + i + '">' + label + '</button>';
      }).join("") + '</div>';
    }

    function render() {
      el.innerHTML =
        '<div class="plan-builder">' +
          '<div class="guess-round-tag">30 天 AI 行动计划 · 先选一个目标</div>' +
          '<p class="train-lead">别贪多。选一个你真正想解决的问题，每天 10 分钟也算数。</p>' +
          '<div class="plan-group"><span class="art-label">1. 你最想先用 AI 做什么？</span>' +
            chips(Object.keys(FINAL_GOALS).map(k => FINAL_GOALS[k]), "goal", Object.keys(FINAL_GOALS).indexOf(sel.goal), "goal") +
          '</div>' +
          '<div class="plan-group"><span class="art-label">2. 每天能拿出多少时间？</span>' +
            chips(FINAL_TIMES, "time", sel.time, "time") +
          '</div>' +
          '<div class="plan-actions">' +
            '<button type="button" class="btn btn-primary js-plan-gen">🎯 生成我的 30 天计划</button>' +
            '<button type="button" class="btn btn-ghost js-plan-clear">清空打卡 ↻</button>' +
          '</div>' +
          '<div class="plan-result"></div>' +
        '</div>';

      el.querySelectorAll(".plan-chip").forEach(btn => {
        btn.addEventListener("click", () => {
          if (btn.dataset.key === "goal") sel.goal = Object.keys(FINAL_GOALS)[parseInt(btn.dataset.i, 10)];
          else sel.time = parseInt(btn.dataset.i, 10);
          result = false;
          save();
          render();
        });
      });
      el.querySelector(".js-plan-gen").addEventListener("click", () => {
        result = true;
        save();
        render();
        const box = el.querySelector(".plan-summary");
        if (box) box.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      el.querySelector(".js-plan-clear").addEventListener("click", () => {
        checked = Array(30).fill(false);
        save();
        render();
        window.dispatchEvent(new CustomEvent("aic-toast", { detail: "打卡已清空，明天从第 1 天重新开始" }));
      });
      if (result) showResult();
    }

    function showResult() {
      const wrap = el.querySelector(".plan-result");
      if (!wrap) return;
      const goal = FINAL_GOALS[sel.goal];
      const time = FINAL_TIMES[sel.time];
      const done = countDone();
      wrap.innerHTML =
        '<div class="plan-summary">' +
          '<div class="plan-summary-head">' +
            '<div><span class="proj-badge">' + goal.emoji + " " + goal.label + " · 每天 " + time.label + '</span><h3>你的 30 天 AI 行动计划</h3></div>' +
            '<span class="plan-done-count">' + done + ' / 30 天</span>' +
          '</div>' +
          '<p class="plan-intro">' + goal.intro + '</p>' +
          '<div class="plan-time-note">⏱ ' + time.note + '</div>' +
          '<div class="plan-weeks">' +
            goal.weeks.map(w =>
              '<div class="plan-week">' +
                '<h4>' + w.title + '</h4>' +
                '<ol>' + w.tasks.map(t => '<li>' + t + '</li>').join("") + '</ol>' +
              '</div>'
            ).join("") +
          '</div>' +
          '<div class="plan-calendar">' +
            '<div class="plan-calendar-head"><b>✅ 30 天打卡表</b><span class="tiny">点一下就算今天做到</span></div>' +
            '<div class="plan-days">' +
              checked.map((on, i) =>
                '<button type="button" class="plan-day' + (on ? " done" : "") + '" data-day="' + i + '" aria-pressed="' + on + '">' + (on ? "✓" : (i + 1)) + '</button>'
              ).join("") +
            '</div>' +
            '<p class="plan-progress-line">已完成 <b class="js-plan-count">' + done + '</b> / 30 天 · 打卡只保存在这台设备</p>' +
          '</div>' +
          '<div class="plan-foot">' +
            '<button type="button" class="btn btn-ghost js-plan-copy">📋 复制计划</button>' +
            '<a class="btn btn-ghost" href="../certificate.html">🎓 去领结业证书</a>' +
          '</div>' +
          '<p class="plan-note">断了一天不算失败，别连着断两天。明天继续，计划就还在。</p>' +
        '</div>';

      wrap.querySelectorAll(".plan-day").forEach(btn => {
        btn.addEventListener("click", () => {
          const i = parseInt(btn.dataset.day, 10);
          checked[i] = !checked[i];
          btn.classList.toggle("done", checked[i]);
          btn.setAttribute("aria-pressed", checked[i] ? "true" : "false");
          btn.textContent = checked[i] ? "✓" : String(i + 1);
          const n = countDone();
          wrap.querySelector(".plan-done-count").textContent = n + " / 30 天";
          wrap.querySelector(".js-plan-count").textContent = n;
          save();
          if (n === 30) window.dispatchEvent(new CustomEvent("aic-toast", { detail: "30 天全部打卡，你真的做到了 🎉" }));
        });
      });
      wrap.querySelector(".js-plan-copy").addEventListener("click", () => {
        const txt = "【我的 30 天 AI 行动计划】\n" +
          goal.emoji + " " + goal.label + " · 每天 " + time.label + "\n" +
          goal.intro + "\n\n" +
          goal.weeks.map(w => w.title + "\n" + w.tasks.map((t, i) => (i + 1) + ". " + t).join("\n")).join("\n\n") +
          "\n\n打卡：" + countDone() + " / 30 天\n\n" +
          "断了一天不算失败，别连着断两天。";
        copyText(txt, "30 天计划已复制");
      });
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
    const ap = document.getElementById("art-prompt");
    if (ap) initArtPrompt(ap);
    const sc = document.getElementById("story-chain");
    if (sc) initStoryChain(sc);
    const ar = document.getElementById("agent-replay");
    if (ar) initAgentReplay(ar);
    const pg = document.getElementById("project-gen");
    if (pg) initProjectGen(pg);
    const pv = document.getElementById("privacy");
    if (pv) initPrivacy(pv);
    const st = document.getElementById("scam-theater");
    if (st) initScamTheater(st);
    const cr = document.getElementById("career");
    if (cr) initCareer(cr);
    const fp = document.getElementById("final-plan");
    if (fp) initFinalPlan(fp);
  });
})();
