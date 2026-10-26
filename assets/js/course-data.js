/* ============================================================
   人人 AI 通识课 · 课程地图数据（纯数据，无依赖）
   注意：用 .js 而不是 .json —— 双击 file:// 打开时也能加载
   ============================================================ */

const COURSE = {
  title: "人人 AI 通识课",
  slogan: "新时代的工具，动手去用",
  modules: [
    {
      id: "intro", emoji: "🚀", name: "导学课 · 先定个调",
      lessons: [
        { id: "00", file: "lessons/lesson-00.html", emoji: "🧭", title: "AI 是新时代的工具，关键看谁在用", minutes: 10, desc: "工具观 · 段位测试", ready: true }
      ]
    },
    {
      id: "m1", emoji: "🤔", name: "模块一 · AI 到底是什么",
      lessons: [
        { id: "01", file: "lessons/lesson-01.html", emoji: "🎯", title: "AI 其实就是个超级「猜词王」", minutes: 12, desc: "猜词挑战 · 概率思维", ready: true },
        { id: "02", file: "lessons/lesson-02.html", emoji: "🍎", title: "AI 是「学」会的，不是「查」出来的", minutes: 12, desc: "训练数据 · 给 AI 当老师", ready: true },
        { id: "03", file: "lessons/lesson-03.html", emoji: "👨‍👩‍👧‍👦", title: "AI 家族全家福", minutes: 12, desc: "生成式 AI vs 老程序 vs 搜索引擎", ready: true },
        { id: "04", file: "lessons/lesson-04.html", emoji: "🎭", title: "AI 会骗人吗？——幻觉与「没有记忆」", minutes: 12, desc: "幻觉本质 · 找茬练习", ready: true }
      ]
    },
    {
      id: "m2", emoji: "🛠️", name: "模块二 · 开始用 AI（DeepSeek 从入门到顺手）",
      lessons: [
        { id: "05", file: "lessons/lesson-05.html", emoji: "💬", title: "第一次跟 AI 聊天", minutes: 12, desc: "界面按钮 · 模拟演练", ready: true },
        { id: "06", file: "lessons/lesson-06.html", emoji: "🔑", title: "提问的艺术：提示词万能公式 ★", minutes: 15, desc: "提示词积木 · 对比实验", ready: true },
        { id: "07", file: "lessons/lesson-07.html", emoji: "✍️", title: "让 AI 当你的笔杆子", minutes: 12, desc: "邮件 · 总结 · 文案", ready: true },
        { id: "08", emoji: "👩‍🏫", title: "让 AI 当你的家庭教师", minutes: 12, desc: "出题机 · 翻译陪练", ready: false },
        { id: "09", emoji: "📷", title: "拍照、上传、做表", minutes: 12, desc: "读文件 · 整理表格", ready: false },
        { id: "10", emoji: "🍜", title: "生活里的 AI 搭子", minutes: 12, desc: "菜谱 · 攻略 · 带娃", ready: false },
        { id: "11", emoji: "🧰", title: "五个越用越顺手的技巧", minutes: 12, desc: "追问 · 验证 · 换说法", ready: false }
      ]
    },
    {
      id: "m3", emoji: "🎨", name: "模块三 · 玩创作（把想象力放大）",
      lessons: [
        { id: "12", emoji: "🖼️", title: "让 AI 帮你画画", minutes: 12, desc: "头像 · 壁纸 · 绘本", ready: false },
        { id: "13", emoji: "🎬", title: "写故事 · 做音乐 · 剪视频", minutes: 12, desc: "故事接龙机", ready: false },
        { id: "14", emoji: "🤖", title: "AI Agent：让 AI 替你干活 ★★", minutes: 15, desc: "OpenCode 实战演示", ready: false },
        { id: "15", emoji: "🏆", title: "创作实战：做出你的第一个作品", minutes: 15, desc: "作品清单生成器", ready: false }
      ]
    },
    {
      id: "m4", emoji: "🛡️", name: "模块四 · 怎么防坑（安全与防骗）",
      lessons: [
        { id: "16", emoji: "🔍", title: "AI 说的不一定对", minutes: 12, desc: "幻觉质检员", ready: false },
        { id: "17", emoji: "🚦", title: "这些信息别发给 AI", minutes: 12, desc: "隐私红绿灯", ready: false },
        { id: "18", emoji: "🎭", title: "AI 骗局升级", minutes: 12, desc: "识破骗局小剧场", ready: false }
      ]
    },
    {
      id: "m5", emoji: "🚴", name: "模块五 · 人和 AI",
      lessons: [
        { id: "19", emoji: "🌡️", title: "把 AI 当实习生，而不是对手", minutes: 12, desc: "职业温度计 · 回扣工具观", ready: false },
        { id: "20", emoji: "🎓", title: "结业课：你的 30 天 AI 行动计划", minutes: 12, desc: "打卡表 · 电子证书", ready: false }
      ]
    }
  ]
};

/* 展开成一维列表，带上模块名，供导航/进度使用 */
function allLessons() {
  const out = [];
  COURSE.modules.forEach(m => m.lessons.forEach(l => out.push(Object.assign({}, l, { moduleName: m.name }))));
  return out;
}
