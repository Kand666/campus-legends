/* ==========================================================
   校园传说 · Campus Legends — UI 原型逻辑
   ========================================================== */

// ---------- 占位头像（用户提供的黑白剪影，缺失时用同款 SVG 兜底） ----------
const FALLBACK_AVATAR = "data:image/svg+xml;utf8," + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">` +
  `<rect width="128" height="128" fill="#000"/>` +
  `<circle cx="64" cy="50" r="23" fill="none" stroke="#f2f2f5" stroke-width="9"/>` +
  `<path d="M18 128 C20 94 40 80 64 80 C88 80 108 94 110 128" fill="none" stroke="#f2f2f5" stroke-width="9"/>` +
  `</svg>`
);
const avatarImg = (cls) =>
  `<img class="${cls || "avatar"}" src="assets/avatar.jpg" alt="角色占位"`
  + ` onerror="this.onerror=null;this.src='${FALLBACK_AVATAR}'" draggable="false">`;

// ---------- 角色卡数据 ----------
// art = 企划给定的「图标设定」；skill/skillDesc 与图标一一对应；
// spawn = 牌局中打出该卡时的登场效果（关键词跟图标走）；minion = 牌局随从属性
// v0.6 英雄差异化数值：血量按职业微调（重装 32 / 脆皮资源型 26~28 / 标准 30），
// 英雄技能强弱与血量此消彼长，选人阶段即有取舍
const CHARACTERS = [
  { name: "成义荣",
    story: "班里公认的「压舱石」——春游搬水、开学搬书全靠这一身分量。运动会他从跳台砸进海绵池的名场面，至今仍是校园传说的开篇章节，被压在池底的那个海绵木偶则成了第一件史料。",   gender: "男", cls: "战士",   skill: "重量级压制", cost: 2, skillDesc: "对一个敌方随从造成 2 点伤害并使其 -1 攻击（被压得喘不过气）。", hp: 32,
    art: "重绘版：腾空胖汉子双拳高举、红背心兜不住的圆滚滚肚皮直坠而下——双下巴、用力眯眼、肥肉晃动线清晰可见，落点处的木偶已被压成一张饼", combo: "开国大典",
    minion: { atk: 4, hp: 4 }, spawn: { keyword: "重量级压制", text: "对一个敌方随从造成 2 点伤害并 -1 攻击", target: "enemyMinion", dmg: 2, atkDown: 1 },
    power: { name: "泰山压顶", cost: 2, kind: "dmg2", target: "enemyAny", desc: "对一个敌方随从或敌方英雄造成 2 点伤害。" } },
  { name: "黄冠彪",
    story: "军训方阵里唯一被教官称作「同志」的男生，打靶十发一百环，报靶教官反复核对了三遍靶纸。他的第二身份是航模社王牌——毕竟在他手里，遥控器和步枪的握法是一样的。",   gender: "男", cls: "神枪手", skill: "精准点射", cost: 2, skillDesc: "对一个敌方随从造成 1 点伤害。", hp: 28,
    art: "重绘版：标准抵肩持狙姿势——木托枪身抵肩、后手扣握把、前手托护木、眯眼瞄准,弹壳从抛壳窗抛出,枪口火舌正中后仰的木偶", combo: "焚机绝冲",
    minion: { atk: 3, hp: 2 }, spawn: { keyword: "精准点射", text: "对一个敌方随从造成 1 点伤害", target: "enemyMinion", dmg: 1 },
    power: { name: "狙击", cost: 2, kind: "face2", desc: "对敌方英雄造成 2 点伤害。" } },
  { name: "王衡",
    story: "全校女生票选「最佳侧脸」，本人却只在乎篮筐垂直落下的抛物线。他书桌底下藏着一台亲手改装的机甲模型，据说通电那天，模型的双眼真的亮起了红光。",     gender: "男", cls: "扣篮王", skill: "暴力扣篮", cost: 2, skillDesc: "对一个敌方随从造成 2 点伤害，球砸头顶。", hp: 30,
    art: "重绘版：瘦而高的男神腾空单臂劈扣——头小腰窄、四肢修长带肘弯，冷静侧脸配刘海，1号红球衣白球裤，篮球贴掌砸向后仰的木偶", combo: "战械苏醒",
    minion: { atk: 3, hp: 3 }, spawn: { keyword: "暴力扣篮", text: "对一个敌方随从造成 2 点伤害", target: "enemyMinion", dmg: 2 },
    power: { name: "热身扣篮", cost: 2, kind: "dmg2", target: "enemyMinion", desc: "对一个敌方随从造成 2 点伤害。" } },
  { name: "杨威墨",
    story: "美术课代表，一支毛笔走天下。教室后墙的黑板报被他画成了传世长卷，值日生擦黑板前都先鞠一躬。他的泼墨绝技只在班会上失手过一次——糊了检查卫生的教导主任一脸。",   gender: "男", cls: "丹青手", skill: "泼墨",     cost: 2, skillDesc: "对一个敌方随从造成 1 点伤害，并使其 -1 攻击（彩墨糊脸）。", hp: 30,
    art: "重绘版：戴贝雷帽的美术课代表双手执大毛笔挥洒彩墨——白围裙沾满颜料点，笔锋甩出的红蓝绿弧线糊了站立的木偶一脸", combo: "雕龙画风",
    minion: { atk: 2, hp: 4 }, spawn: { keyword: "泼墨", text: "对一个敌方随从造成 1 点伤害并 -1 攻击", target: "enemyMinion", dmg: 1, atkDown: 1 },
    power: { name: "泼墨", cost: 2, kind: "atkDown2", target: "enemyMinion", desc: "使一个敌方随从 -2 攻击。" } },
  { name: "陈加号",
    story: "校园十佳歌手海选第一名，音域宽广到楼上班级联名投诉。暴雨天他照常绕操场跑圈练气，一圈下来只湿了刘海——用他的话说，风都是被唱开的。",   gender: "男", cls: "歌者",   skill: "高歌",     cost: 2, skillDesc: "使你的所有其他随从 +1 攻击（歌声骚动全场）。", hp: 28,
    art: "一个男生对着众木偶高歌，歌声骚动全场", combo: "豪遍全校",
    minion: { atk: 2, hp: 4 }, spawn: { keyword: "高歌", text: "使你的其他随从 +1 攻击", kind: "buffOthers" },
    power: { name: "领唱", cost: 2, kind: "buffAtk1", target: "allyMinion", desc: "使一个友方随从 +1 攻击。" } },
  { name: "唐士申",
    story: "黑色紧身高领的健美社团宠，课桌里常备三张带签名的备用照。他只要回头微微一笑，隔壁班的课堂纪律就会当场瓦解，教导主任对此立项研究过两次。",   gender: "男", cls: "万人迷", skill: "魅力四射", cost: 2, skillDesc: "使一个敌方随从本回合无法攻击（看呆了）。", hp: 30,
    art: "魅力四射、穿着黑色衣服的健壮男生", combo: "炸金行动",
    minion: { atk: 4, hp: 4 }, spawn: { keyword: "魅力四射", text: "使一个敌方随从无法攻击", target: "enemyMinion", lock: true },
    power: { name: "放电", cost: 2, kind: "lock", target: "enemyMinion", desc: "使一个敌方随从本回合无法攻击。" } },
  { name: "欧阳汉子",
    story: "传说中吵赢过年级主任的女人，一副嗓子是真正的金石之音。校门口的混混见了她主动绕路，连湖里的鸭子听了她的骂声都排着队上岸认错。", gender: "女", cls: "狂战士", skill: "怒骂",     cost: 2, skillDesc: "使一个敌方随从 -2 攻击（骂到抬不起头）。", hp: 32,
    art: "重绘版：正面怒吼脸——V 形怒眉、闭目、大张的圆嘴里上排白牙一截红舌,额头怒筋,金色声浪砸向捂耳朵的木偶", combo: "疾声叱骂",
    minion: { atk: 3, hp: 4 }, spawn: { keyword: "怒骂", text: "使一个敌方随从 -2 攻击", target: "enemyMinion", atkDown: 2 },
    power: { name: "怒骂", cost: 2, kind: "atkDown2", target: "enemyMinion", desc: "使一个敌方随从 -2 攻击。" } },
  { name: "毛一心",
    story: "团支书，手里的规矩比校规还多三分，给每位同学都建有「表现档案」。她的飞吻是必杀技——被吻中的人会心甘情愿地帮她背一整周的活动材料。",   gender: "女", cls: "萨满",     skill: "飞吻",     cost: 2, skillDesc: "对一个敌方随从造成 1 点伤害并使其 -1 攻击（被迷得心软）。", hp: 30,
    art: "重绘版：团支书嘟唇抛飞吻——手掌贴唇向外一送,桃心沿弧线飞去,被击中的木偶满眼桃心、两颊爆红、头顶冒小心心", combo: "彰规肃行",
    minion: { atk: 3, hp: 5 }, spawn: { keyword: "飞吻", text: "对一个敌方随从造成 1 点伤害并 -1 攻击", target: "enemyMinion", dmg: 1, atkDown: 1 },
    power: { name: "飞吻", cost: 2, kind: "dmg1atkDown1", target: "enemyMinion", desc: "对一个敌方随从造成 1 点伤害并使其 -1 攻击。" } },
  { name: "唐疆域",
    story: "永远坐在教室最后一排的神秘人物，油头、圆腮红、红唇、耳环，脸颊一颗大黑痣。她说自己在用「生命」复习——每翻开新的一页脸色就白一分，成绩却涨一分，全班无人敢问原理。",   gender: "女", cls: "术士",     skill: "领域压制", cost: 2, skillDesc: "抽一张牌，并对自己的英雄造成 1 点伤害。", hp: 26,
    art: "重绘版：油光锃亮的壮汉侧颜——宽肩粉衫、喉结突出、下颌一片青黑胡茬，却顶着两张圆腮红、紫眼影假睫毛、血盆红唇露出金牙；脸颊大黑痣上蹿着三根毛，一只苍蝇绕头盘旋",
    minion: { atk: 2, hp: 5 }, spawn: { keyword: "领域压制", text: "抽一张牌，并对自己的英雄造成 1 点伤害", kind: "drawAndPain" },
    power: { name: "压榨", cost: 2, kind: "drawPain", desc: "抽一张牌，并对自己的英雄造成 1 点伤害。" } },
  { name: "明芒",
    story: "校门口流浪狗大队的总指挥（本犬）。对所有人呲牙，却会把叼来的东西轻轻放上同学的书包——包括不知从哪儿捡来的一把匕首。别问一条狗为什么能当总指挥，狗界的事，人少管。",     gender: "女", cls: "狗",   skill: "狂吠",     cost: 2, skillDesc: "对一个敌方随从造成 1 点伤害（汪汪叫的狗吼）。", hp: 30,
    art: "重绘版：一条汪汪叫的狗逼向木偶——立体口鼻(上颌/口腔/挂舌/下牙/黑鼻头)大张狂吠,叫声弧线层层荡开,木偶吓得向后仰倒", combo: "挚友背刺",
    minion: { atk: 2, hp: 4 }, spawn: { keyword: "狂吠", text: "对一个敌方随从造成 1 点伤害", target: "enemyMinion", dmg: 1 },
    power: { name: "唤犬", cost: 2, kind: "summonDog", desc: "召唤一个 1/1 的小狗（流浪狗大队的部下）。" } },
  { name: "荣洪杰",
    story: "年级第一的常驻嘉宾，镜片厚度与题库储量成正比。他能隔着三排座位看出你草稿纸上的计算错误——推一下眼镜，就是你被判定「还需努力」的庄严时刻。",   gender: "男", cls: "学霸",     skill: "推镜窥牌", cost: 3, skillDesc: "窥视对方的手牌（学霸的凝视无所遁形）。", hp: 28,
    art: "重绘版：深色粗框圆眼镜的斯文学者抬手轻推镜框——镜片冰蓝反光里透出认真的双眼,镜框在金色侧脸上格外分明,立领领结一丝不苟", combo: "疯狂刷题",
    minion: { atk: 2, hp: 5 }, spawn: { keyword: "推镜窥牌", text: "窥视对方的手牌", kind: "peekEnemy" },
    power: { name: "凝视", cost: 2, kind: "peek", desc: "窥视对方的手牌。" } },
  { name: "高大力", collect: 1,
    story: "体育生队长，能单手托起两个人跑完全程。他的口头禅是「有我在，塌不了」——全班体检时他真的把体检秤踩爆了，从此校医室给他单独配了一台工业级。",   gender: "男", cls: "体育生",   skill: "集体托举", cost: 3, skillDesc: "召唤一个 2/2 的杠铃（体育部器材室的镇室之宝）。", hp: 32,
    art: "重绘版：交叉的杠铃与盾牌徽章——体育部的力量图腾", combo: "人肉坦克",
    minion: { atk: 4, hp: 5 }, spawn: { keyword: "集体托举", text: "召唤一个 2/2 的杠铃", kind: "summonToken", tokName: "杠铃", tokAtk: 2, tokHp: 2, tokIcon: "高大力" },
    power: { name: "加油", cost: 2, kind: "buffAtk1", target: "allyMinion", desc: "使一个友方随从 +1 攻击。" } },
  { name: "陆小铃", collect: 1,
    story: "广播站站长，全校的课间十分钟归她管。她能通过喇叭精准定位任何一名学生：「请高三（2）班的陆小铃同学听到广播后……等等，那不就是我自己吗。」",   gender: "女", cls: "广播站长", skill: "点歌骚扰", cost: 2, skillDesc: "对一个敌方随从造成 1 点伤害（为它点播一首《大悲咒》）。", hp: 26,
    art: "重绘版：金色广播喇叭徽章——声波三圈扩散,大喇叭就是全校的喉舌", combo: "广播寻人",
    minion: { atk: 2, hp: 3 }, spawn: { keyword: "点歌骚扰", text: "对一个敌方随从造成 1 点伤害", target: "enemyMinion", dmg: 1 },
    power: { name: "锁频偷听", cost: 2, kind: "peek", desc: "窥视对方的手牌。" } },
  { name: "钱多宝", collect: 1,
    story: "校董会少爷，零花钱按周结算、按兴趣发放。他曾试图买下整个小卖部被校长拦下，理由是「会影响其他同学创业」。",   gender: "男", cls: "贵公子",   skill: "零食补给", cost: 2, skillDesc: "为你的英雄恢复 2 点生命值（进口零食，人人有份）。", hp: 28,
    art: "重绘版：金币堆与红绸徽章——校董少爷的钞能力具象化", combo: "",
    minion: { atk: 2, hp: 4 }, spawn: { keyword: "零食补给", text: "为你的英雄恢复 2 点生命值", kind: "healSelf" },
    power: { name: "撒钱", cost: 2, kind: "face2", desc: "对敌方英雄造成 2 点伤害（钞票拍脸，很痛）。" } },
  { name: "白小卷", collect: 1,
    story: "学期中途突然出现的转学生，档案只有薄薄一页。她从不写作业却次次满分，问就说「睡一觉就会了」。没人知道她晚上到底在跟谁较量。",   gender: "女", cls: "转学生",   skill: "熬夜补作业", cost: 3, skillDesc: "抽一张牌，并对自己的英雄造成 1 点伤害（黑眼圈是勋章）。", hp: 26,
    art: "重绘版：纸飞机与转学证明徽章——来路不明的神秘转学生", combo: "",
    minion: { atk: 3, hp: 5 }, spawn: { keyword: "熬夜补作业", text: "抽一张牌，并对自己的英雄造成 1 点伤害", kind: "drawAndPain" },
    power: { name: "借读密卷", cost: 2, kind: "drawPain", desc: "抽一张牌，并对自己的英雄造成 1 点伤害。" } },
];

// ---------- 法术卡（组合技组件） ----------
// effect 与图标对应；art 为图标设定；cast = 牌局结算参数（target 指向要求）
const SPELLS = [
  { name: "扬音狂呼",
    story: "文艺委员祖传的大喇叭麦克风，握把上刻着一个「赵」字。音量旋钮只有两档：关，和「全校安静」。",   cost: 3, effect: "对所有敌方随从造成 1 点伤害（震耳欲聋的噪音冲击全场）。",
    art: "一个握把上写着「赵」的麦克风，对着木偶发出震耳欲聋的噪音", combo: "开国大典",
    cast: { aoeDmg: 1 } },
  { name: "机风横扫",
    story: "航模社失控的遥控直升机贴地掠过操场，卷起的疾风能把课桌连人一起吹回原位。黄冠彪坚称这一切仍在他的操控计划之内。",   cost: 2, effect: "将一个敌方随从吹回其拥有者的手牌（直升机疾风）。",
    art: "直升机扬起疾风", combo: "焚机绝冲",
    cast: { target: "enemyMinion", bounce: true } },
  { name: "电子遥控器",
    story: "只有三个档位和一个关机键的神秘遥控器，据说是王衡给机甲准备的「教练模式」。每按高一档，友谊的力量就 +1。", cost: 1, effect: "使一个友方随从 +1/+1（按下更高档位，准备启动）。",
    art: "一个只有 1 档、2 档、3 档和关机键的遥控器被按下", combo: "战械苏醒",
    cast: { target: "allyMinion", buffAtk: 1, buffHp: 1 } },
  { name: "黑板强袭",
    story: "值日生涯最恐怖的噩梦：黑板从墙轨上松脱，不偏不倚砸向最吵的那个位置。杨威墨说黑板是有灵性的，它只砸该砸的人。",   cost: 3, effect: "对一个敌方随从造成 3 点伤害（黑板直直砸下）。",
    art: "一个人举着黑板向着木偶砸去", combo: "雕龙画风",
    cast: { target: "enemyMinion", dmg: 3 } },
  { name: "骤雨倾身",
    story: "体育课突降的暴雨，专挑不带伞的狂妄之徒下手。淋成落汤鸡之后，再嚣张的人也蔫了半截。",   cost: 2, effect: "使所有敌方随从 -1 攻击（倾盆大雨浇得抬不起头）。",
    art: "倾盆大雨落在一众木偶头上", combo: "豪遍全校",
    cast: { aoeAtkDown: 1 } },
  { name: "扇卷狂风",
    story: "教务处珍藏的芭蕉扇，铁扇公主同款（据传）。一扇风起云涌，二扇人仰马翻，从不扇第三下——因为一般两下就够了。",   cost: 2, effect: "对一个敌方随从造成 2 点伤害（芭蕉扇狂风抽打）。",
    art: "一个人挥舞芭蕉扇，让狂风吹向人偶", combo: "炸金行动",
    cast: { target: "enemyMinion", dmg: 2 } },
  { name: "嘎嘎嘎嘎",
    story: "湖边鸭群的集体问候式围剿。被鸭子盯上的人，整个课间都别想脱身——它们扇翅膀的力道远比看上去大。",   cost: 1, effect: "对一个敌方随从造成 1 点伤害，并使该随从无法攻击（被鸭子缠上）。",
    art: "一只鸭子用翅膀扇向木偶", combo: "疾声叱骂",
    cast: { target: "enemyMinion", dmg: 1, lock: true } },
  { name: "圣书静心",
    story: "图书馆红色专柜永远的榜首，书角还带着陈年墨香。有人问毛一心为什么读得那么入神，她舔了舔手指上的油墨说：真理的味道，本来就很甜。翻开扉页，金光抚平一切躁动。",   cost: 2, effect: "为你的英雄恢复 4 点生命值（摊开《共产党宣言》，真理的金光洒下——静心凝神，信仰回血）。",
    art: "重绘版：红色精装《共产党宣言》摊开发光——红封面金边、书脊金星、烫金书名腰带压底，真理的金光洒向全场", combo: "彰规肃行",
    cast: { healHero: 4 } },
  { name: "伺隙背击",
    story: "历史社道具箱里的忍者匕首，出鞘无声。使用守则只有一条：只在对手转身的瞬间出手。",   cost: 2, effect: "对一个敌方随从造成 2 点伤害（日本风刺客从背后偷袭）。",
    art: "一个日本风刺客朝着木偶的背部用匕首刺击", combo: "挚友背刺",
    cast: { target: "enemyMinion", dmg: 2 } },
  { name: "迷雾狂潮",
    story: "期中考前夜的数学会自动翻开，公式如潮水般涌出。被淹没的人呆望天花板，眼神空洞，攻击欲望全无。",   cost: 2, effect: "使所有敌方随从 -1 攻击（数学书里飞出的公式令人晕头转向）。",
    art: "无数公式从数学书中露出，让木偶晕头转向", combo: "疯狂刷题",
    cast: { aoeAtkDown: 1 } },
  { name: "情书错投", collect: 1,
    story: "陆小铃的广播站信箱塞错了格。第二天，全校都收到了那份本该只写给一个人的心意——场面一度非常浪漫，也非常混乱。",   cost: 2, effect: "抽两张牌（塞错的情书突然雪片般飞来）。",
    art: "重绘版：漫天飞舞的信封与爱心——塞错的情书雪片般飞来", combo: "广播寻人",
    cast: { draw2: 1 } },
  { name: "集体托举", collect: 1,
    story: "运动会的传统节目：全班把最高大的同学举过头顶绕场一周。被举起来的人会突然变得无所畏惧——毕竟脚下有一整班同学。",   cost: 2, effect: "使一个友方随从 +1/+2（全班把你举过头顶，无所畏惧）。",
    art: "重绘版：多只手掌把盾牌托向天空——全班之力的徽章", combo: "人肉坦克",
    cast: { target: "allyMinion", buffAtk: 1, buffHp: 2 } },
  { name: "粉笔弹幕", collect: 1,
    story: "教具柜深处的半盒粉笔头。杨威墨说，粉笔用剩的短头才是最锋利的——他曾在三秒内把整盒粉笔头钉进了讲台的软木层。",   cost: 2, effect: "对所有敌方随从造成 1 点伤害（讲台上一排粉笔齐射）。",
    art: "重绘版：讲台上一排粉笔齐射——粉笔头弹幕横扫全场",
    cast: { aoeDmg: 1 } },
  { name: "午休补觉", collect: 1,
    story: "教室下午第一节的神奇魔法：只要趴下去睡满十三分钟，醒来时世界都会变得眉清目秀。白小卷称之为「自费回血」。",   cost: 3, effect: "为你的英雄恢复 6 点生命值（趴在课桌上睡个好觉）。",
    art: "重绘版：课桌上的枕头与 Z 字梦符号——午休回血的玄学",
    cast: { healHero: 6 } },
  { name: "课间操整队", collect: 1,
    story: "广播里第三遍「现在开始做第八套广播体操」之后还站不进队列的人，会被体育委员单独记录。被记录的人，攻击欲望会被整齐划一地消磨干净。",   cost: 3, effect: "使所有敌方随从 -2 攻击（被拉去整队，谁也别想使坏）。",
    art: "重绘版：口哨与整齐队列徽章——课间操的绝对秩序",
    cast: { aoeAtkDown: 2 } },
];

// ---------- 组合技卡（角色在场 + 本局打出过配套法术触发，每局一次） ----------
const COMBOS = [
  { name: "开国大典",
    story: "成义荣站上课桌，接过那只刻着「赵」字的话筒，向全班发表开学动员演说。士气随音量一起拉满，桌椅都在共振。", cost: 5, need: ["成义荣", "扬音狂呼"],
    effect: "使你的所有随从 +2/+2（在城楼上向全校发言，士气大振）。",
    art: "一个人在城楼上发言" },
  { name: "焚机绝冲",
    story: "黄冠彪按下最后一个按键，失控的直升机调转机头，义无反顾地冲向木偶阵地。他管这叫精确制导，社长管这叫报废申请。", cost: 5, need: ["黄冠彪", "机风横扫"],
    effect: "对所有敌方随从造成 4 点伤害（操控飞机撞向木偶阵地）。",
    art: "一个人操控飞机撞向木偶" },
  { name: "战械苏醒",
    story: "三档全开，红灯亮起。书桌下的机甲睁开双眼站了起来，比王衡还高出两个头，教室日光灯闪了三下，像在敬礼。", cost: 4, need: ["王衡", "电子遥控器"],
    effect: "召唤一个 6/6 的战械机甲（Q 版高达苏醒，双眼冒出红光）。",
    art: "Q 版高达的头被启动，眼中冒着红光" },
  { name: "雕龙画风",
    story: "黑板落地的巨响过后，板面上多出一条栩栩如生的龙。守在这面黑板报前的人，会莫名其妙地觉得自己绝不能后退。", cost: 5, need: ["杨威墨", "黑板强袭"],
    effect: "使你的所有随从 +1/+1 并获得嘲讽（亲手绘制的黑板报鼓舞全班）。",
    art: "美术生绘制黑板报" },
  { name: "豪遍全校",
    story: "暴雨中的操场只剩一个还在奔跑的身影，歌声穿透雨幕传遍全校。雨停时他冲过终点，掌声比雷声还响。", cost: 4, need: ["陈加号", "骤雨倾身"],
    effect: "使你的英雄恢复 6 点生命值，并使你的所有随从 +1 攻击（风雨无阻，豪遍全校）。",
    art: "戴着黑口罩、在雨中操场跑步的人，被一众木偶瞩目" },
  { name: "炸金行动",
    story: "一张唐士申的签名照被狂风吹上天，飘过之处万人仰头驻足。整个校园停摆三秒——包括正在赶路的教导主任。", cost: 4, need: ["唐士申", "扇卷狂风"],
    effect: "使所有敌方随从本回合无法攻击（全校都在传阅唐士申的照片）。",
    art: "少男少女们拿着唐士申的照片看到入迷" },
  { name: "疾声叱骂",
    story: "欧阳汉子的怒骂与鸭群的嘎嘎声完美合流，形成穿透耳膜的立体声打击波。被击中者两耳嗡鸣、抱头蹲防。", cost: 3, need: ["欧阳汉子", "嘎嘎嘎嘎"],
    effect: "对所有敌方随从造成 2 点伤害（骂声混着鸭群冲向敌方）。",
    art: "凶悍的女生正在骂人，嘴中飞出鸭子" },
  { name: "彰规肃行",
    story: "毛一心一手捧着《共产党宣言》、一手指向违纪者：「肃纲正纪，不得信佛！」金光所照之处，违纪的念头连同攻击力一起被没收。", cost: 4, need: ["毛一心", "圣书静心"],
    effect: "使所有敌方随从 -2 攻击，且本回合无法攻击（肃纲正纪，不得信佛）。",
    art: "一个女生训斥一个党员不能信佛" },
  { name: "挚友背刺",
    story: "明芒轻车熟路地衔来那把匕首，趁目标转身的瞬间递上助攻，再冲对方摇尾巴——用最无辜的眼神骗过所有人。最痛的一刀，果然来自挚友。", cost: 4, need: ["明芒", "伺隙背击"],
    effect: "对敌方生命最高的随从造成 5 点伤害（最痛的一刀来自挚友）。",
    art: "一条狗嘴里衔着匕首朝着木偶的背部刺击" },
  { name: "疯狂刷题",
    story: "迷雾中荣洪杰的笔尖没有停过，一夜刷完三本练习册。晨光照进教室时，他的黑眼圈更深了，全班的平均分也更高了。", cost: 5, need: ["荣洪杰", "迷雾狂潮"],
    effect: "使你的所有随从 +2/+1（疯狂刷题，学业突飞猛进）。",
    art: "荣洪杰在书桌上疯狂学习" },
  { name: "人肉坦克", collect: 1,
    story: "高大力被举过头顶冲进赛场的那一刻，对方全队默默认输了半个身位。全班的手臂就是他的装甲，托举到哪里，防线就推进到哪里。", cost: 5, need: ["高大力", "集体托举"],
    effect: "使你的所有随从 +1/+2，并获得嘲讽（全班托举，坚不可摧）。",
    art: "重绘版：被全班手掌托举的盾牌巨人——人肉坦克整装推进" },
  { name: "广播寻人", collect: 1,
    story: "陆小铃把塞错的情书当成了寻人启事全文朗读。三分钟后，写情书的、收情书的、看热闹的全都出现在了广播站门口——一个都没跑掉。", cost: 4, need: ["陆小铃", "情书错投"],
    effect: "抽两张牌，并使所有敌方随从 -1 攻击（大喇叭一响，谁都藏不住）。",
    art: "重绘版：广播喇叭播报情书——全校都在听,谁也藏不住" },
];

// ---------- 统一卡牌查询与图标 ----------
// 图鉴、详情弹窗、牌局手牌共用这一份数据，避免多处文案不同步
function findCard(name) {
  return SPELLS.find(c => c.name === name) || CHARACTERS.find(c => c.name === name);
}
// 卡牌机制关键词（v0.8 图鉴筛选）：由结算参数自动推导，新卡入池即自动打标，无需手工维护
// 角色 = 登场效果 + 英雄技能并集；法术 = cast 参数；组合技按结算类型建表
const COLL_TAGS = ["伤害", "增益", "削弱", "控制", "治疗", "召唤", "抽牌", "嘲讽", "情报"];
const COMBO_TAG_TABLE = {
  "开国大典": ["增益"], "焚机绝冲": ["伤害"], "战械苏醒": ["召唤"], "雕龙画风": ["增益", "嘲讽"],
  "豪遍全校": ["治疗", "增益"], "炸金行动": ["控制"], "疾声叱骂": ["伤害"], "彰规肃行": ["削弱", "控制"],
  "挚友背刺": ["伤害"], "疯狂刷题": ["增益"],
  "人肉坦克": ["增益", "嘲讽"], "广播寻人": ["抽牌", "削弱"],
};
function cardTags(card) {
  const t = new Set();
  if (card.effect !== undefined && card.need) {            // 组合技
    (COMBO_TAG_TABLE[card.name] || []).forEach(x => t.add(x));
    return t;
  }
  const c = card.cast, sp = card.spawn, pw = card.power;
  if (c || sp) {                                           // 法术 / 角色登场效果
    if ((c && (c.dmg || c.aoeDmg)) || (sp && sp.dmg)) t.add("伤害");
    if (c && (c.aoeDmg || c.aoeAtkDown)) t.add("伤害");
    if ((c && c.aoeAtkDown) || (sp && sp.atkDown)) t.add("削弱");
    if (c && c.bounce) t.add("控制");
    if ((c && c.lock) || (sp && sp.lock)) t.add("控制");
    if ((c && (c.buffAtk || c.buffHp)) || (sp && sp.kind === "buffOthers")) t.add("增益");
    if (c && c.healHero) t.add("治疗");
    if (c && c.draw2) t.add("抽牌");
  }
  if (sp && sp.kind === "drawAndPain") t.add("抽牌");
  if (sp && sp.kind === "peekEnemy") t.add("情报");
  if (sp && sp.kind === "summonToken") t.add("召唤");
  if (sp && sp.kind === "healSelf") t.add("治疗"); // 【v0.21·深检修】钱多宝登场回血原先漏标,「治疗」筛选查不到
  if (pw) {                                                // 英雄技能也计入（选人时筛选更有用）
    const k = pw.kind;
    if (k === "dmg2" || k === "face2" || k === "dmg1atkDown1") t.add("伤害");
    if (k === "atkDown2" || k === "dmg1atkDown1") t.add("削弱");
    if (k === "buffAtk1") t.add("增益");
    if (k === "lock") t.add("控制");
    if (k === "drawPain") t.add("抽牌");
    if (k === "summonDog") t.add("召唤");
    if (k === "peek") t.add("情报");
  }
  return t;
}
function hasIcon(name) {
  return !!(window.CARD_ICONS && window.CARD_ICONS[name]);
}
function iconArt(name) {
  if (hasIcon(name)) return `<div class="icon-art">${window.CARD_ICONS[name]}</div>`;
  return avatarImg(""); // 未提供图标灵感的卡保留剪影占位
}
// 由统一定义生成牌局手牌实例（法术带 cast；随从带登场效果与牌局属性）
// 花色点数在生成时随机指定：牌库抽牌、被吹回手牌、直接生成的卡都有装饰花色（修 undefinedundefined）
function makeHandCard(name) {
  const def = findCard(name);
  const n = 1 + Math.floor(Math.random() * 13);
  const tag = {
    suit: SUITS[Math.floor(Math.random() * SUITS.length)],
    num: n === 11 ? "J" : n === 12 ? "Q" : n === 13 ? "K" : String(n)
  };
  if (def.effect) {
    return { type: "spell", name: def.name, cost: def.cost, text: def.effect, cast: def.cast, icon: def.name, combo: def.combo, collect: def.collect || 0, ...tag };
  }
  return {
    type: "minion", name: def.name, cost: def.cost,
    atk: def.minion.atk, hp: def.minion.hp,
    text: `「${def.spawn.keyword}」${def.spawn.text}`,
    spawn: def.spawn, icon: def.name, combo: def.combo, collect: def.collect || 0, ...tag
  };
}
// 幸运币：后手补偿卡（0 费法术，本回合法力 +1，不在常规牌池中）
// v0.9 带 story 字段：手牌介绍弹窗的风味框直接读 card.story（findCard 查不到它）
function makeCoinCard() {
  return {
    type: "spell", name: "幸运币", cost: 0,
    text: "本回合法力水晶 +1（后手补偿）。",
    cast: { coin: 1 }, icon: "幸运币", story: TOKEN_FLAVOR["幸运币"],
    suit: "♦", num: "A"
  };
}

// ---------- 屏幕切换 ----------
function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  fxOnScreenEnter(id); // 动效钩子：进入对战界面时点亮法力水晶
  // 【v0.11】BGM 场景切换：对战界面 = 明快段，其余 = 舒缓段
  try { Snd.setScene(id === "screen-battle" ? "battle" : "menu"); } catch (e) { /* 音频未就绪时忽略 */ }
  if (id === "screen-pick") renderPickGrid();    // v0.5：进入选英雄界面时刷新卡池状态
  if (id === "screen-lobby") { duoPickPhase = 0; renderLobbyStats(); } // 返回大厅退出双人选人流程 + 刷新战绩条
  // 【v0.21·深检修】闯关选人中途返回(选人页返回键直回大厅)时清掉关卡残留——
  // 原先 campaignStage 留存会让下一次"创建房间"的普通单机局被劫持成闯关局(对手/难度/结算全错)
  if (id === "screen-lobby" && campaignStage) {
    campaignStage = null;
    const h2 = document.querySelector("#screen-pick h2");
    if (h2) h2.textContent = "选择你的英雄";
  }
  if (id === "screen-stages") renderStages(); // 【v0.14】进入闯关界面刷新关卡与收集进度
  if (id === "screen-cards") renderCollection(collTab); // 【v0.29·深检】进图鉴必重渲染:renderCollection 原先只在启动/页签交互时跑,通关收卡后进图鉴仍显示旧的未收集黑影(v0.14 起的陈旧视图 Bug)
  if (id === "screen-battle") {
    resetBattle();                    // 每次进入对局：随机洗牌、抽初始手牌
    setTimeout(fitBattleField, 320);  // 界面过渡结束后重算牌局缩放
    if (!show._battleTip) {
      show._battleTip = true;
      setTimeout(() => toast("点手牌看出牌介绍 · 绿框随从可攻击 · 英雄座旁「技」为英雄技能"), 500);
    }
  }
}
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-nav]");
  if (t) { Snd.play("ui"); show(t.dataset.nav); }
});

/* ==========================================================
   动效模块（配合 css/fx.css）
   原则：JS 只做 classList / 结构级配合与少量粒子定位参数，
   所有动画关键帧与过渡都写在 fx.css 中。
   ========================================================== */
const fxReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const fxFinePointer = window.matchMedia("(pointer: fine)");

// 读取设置里的「对战动画」开关（调用时机都在设置加载之后）
function fxAnimEnabled() {
  try {
    if (typeof settings !== "undefined" && settings && settings.anim === false) return false;
  } catch (e) { /* settings 尚未初始化时按开启处理 */ }
  return true;
}

// 可重放的 class 动画：移除 → 强制重排 → 重新添加
function fxReplay(el, cls) {
  if (!el || fxReduceMotion.matches) return;
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
}

// 屏幕进入钩子（由 show() 调用）：进入对战界面时法力水晶依次点亮
function fxOnScreenEnter(id) {
  if (id === "screen-battle") fxEnsureFloorGrid(); // 【v0.20】静态地面透视纹,不受动效开关影响
  if (id !== "screen-battle" || fxReduceMotion.matches || !fxAnimEnabled()) return;
  ["enemy-hero", "player-hero"].forEach((hid) => {
    const hero = document.getElementById(hid);
    if (!hero) return;
    hero.querySelectorAll(".mana-crystals").forEach((mc) => {
      mc.classList.remove("fx-wave");
      void mc.offsetWidth;
      mc.classList.add("fx-wave");
    });
  });
}

// 【v0.20】战场地面透视纵深（art-design 二十四节·透视五律）：暗纹放射透视线自视平线（敌方半场后方）
// 向屏幕下方两个画外灭点收敛（主灭点偏置 ~22%/78%）；中央战场用 mask 挖空（安全区细节压低）。
// 挂 screen-battle 直接子级（不进 battle-field → 不参与 fitBattleField 缩放测量），纯静态零动画
function fxEnsureFloorGrid() {
  const scr = document.getElementById("screen-battle");
  if (!scr || scr.querySelector(".fx-floorgrid")) return;
  let lines = "", curves = "";
  for (let k = 0; k < 14; k++) {
    const x0 = 14 + k * 5.4;          // 视平线上的出发点
    const vp = k < 7 ? 8 : 92;        // 左右两个画外灭点
    const x1 = vp + (x0 - vp) * 3.4;  // 直线延伸出画
    lines += `<line x1="${x0.toFixed(1)}" y1="26" x2="${x1.toFixed(1)}" y2="116"/>`;
    // 【v0.23】伪广角备用组:同端点二次贝塞尔,控制点向灭点反方向外弓(透视线外弯)——
    // 终局演出时整组切换 straight→curved(艺术法则:动作高潮用伪广角)
    const cxBow = x0 + (vp - x0) * 0.42;
    curves += `<path d="M${x0.toFixed(1)} 26 Q${cxBow.toFixed(1)} 76 ${x1.toFixed(1)} 116"/>`;
  }
  const grid = document.createElement("div");
  grid.className = "fx-floorgrid";
  grid.innerHTML =
    `<svg viewBox="0 0 100 100" preserveAspectRatio="none">` +
    `<defs><mask id="ffg-mask"><rect width="100" height="100" fill="#fff"/>` +
    `<ellipse cx="50" cy="66" rx="34" ry="17" fill="#000"/></mask></defs>` +
    `<g class="straight" mask="url(#ffg-mask)" stroke="rgba(122, 148, 208, .4)" stroke-width="1" vector-effect="non-scaling-stroke">${lines}</g>` +
    `<g class="curved" mask="url(#ffg-mask)" stroke="rgba(150, 170, 225, .5)" stroke-width="1.2" vector-effect="non-scaling-stroke" fill="none">${curves}</g>` +
    `</svg>`;
  scr.appendChild(grid);
}

// —— 主菜单氛围：金色微光粒子（8 颗，纯 CSS 循环）+ 光晕视差（仅指针精细设备） ——
(function fxInitAmbience() {
  const menu = document.getElementById("screen-menu");
  if (!menu || menu.querySelector(".fx-ambient")) return;
  if (fxReduceMotion.matches) return; // 系统「减少动态效果」：整层不创建

  const layer = document.createElement("div");
  layer.className = "fx-ambient";
  layer.setAttribute("aria-hidden", "true");
  layer.innerHTML = '<div class="fx-glow"></div><div class="fx-particles"></div>';
  menu.prepend(layer);

  // 随机位置 / 尺寸 / 节奏（内联样式仅用于粒子定位参数，动画本身在 fx.css）
  const box = layer.querySelector(".fx-particles");
  for (let i = 0; i < 8; i++) {
    const p = document.createElement("i");
    p.className = "fx-particle";
    const size = (3 + Math.random() * 5).toFixed(1);
    p.style.left = (4 + Math.random() * 92).toFixed(1) + "%";
    p.style.width = size + "px";
    p.style.height = size + "px";
    p.style.setProperty("--rise-dur", (12 + Math.random() * 10).toFixed(1) + "s");      // 上浮时长
    p.style.setProperty("--rise-delay", (-Math.random() * 22).toFixed(1) + "s");        // 负延迟错开相位
    p.style.setProperty("--drift", (Math.random() * 60 - 30).toFixed(0) + "px");        // 左右漂移幅度
    p.style.setProperty("--twinkle-dur", (2.2 + Math.random() * 2.4).toFixed(1) + "s"); // 闪烁节奏
    p.style.setProperty("--p-opacity", (0.35 + Math.random() * 0.4).toFixed(2));         // 峰值亮度
    box.appendChild(p);
  }

  // 光晕视差：rAF 合帧，位移限制在很小的范围（±20px 级）
  if (!fxFinePointer.matches) return;
  const glow = layer.querySelector(".fx-glow");
  let rafId = 0;
  window.addEventListener("pointermove", (e) => {
    if (!menu.classList.contains("active")) return; // 仅主菜单可见时计算
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = 0;
      const nx = e.clientX / window.innerWidth - 0.5;  // 归一化到 -0.5 ~ 0.5
      const ny = e.clientY / window.innerHeight - 0.5;
      glow.style.transform = `translate3d(${(nx * -24).toFixed(1)}px, ${(ny * -16).toFixed(1)}px, 0)`;
      box.style.transform = `translate3d(${(nx * -10).toFixed(1)}px, ${(ny * -6).toFixed(1)}px, 0)`;
    });
  }, { passive: true });
})();

// —— 牌局自适应：视口过矮时整体等比缩小，保证牌局完整显示、绝不出屏 ——
// 注意：这里不用 scrollHeight（弹性压缩时它会说谎），而是实测所有后代的真实最下缘
function applyBattleScale(s, floor) {
  // 【v0.15】缩放下限动态化：默认仍 0.62（手牌优先大尺寸），极矮窗口由 fitBattleField 分级放宽
  s = Math.max(floor === undefined ? 0.62 : floor, s);
  const field = document.querySelector(".battle-field");
  if (window.CSS && CSS.supports && CSS.supports("zoom", "0.5")) {
    field.style.zoom = String(s);            // 首选 zoom：布局级缩放，宽度始终铺满
  } else {
    field.style.transformOrigin = "top center";
    field.style.transform = `scale(${s})`;   // 兜底：transform 缩放
  }
}
function fitBattleField() {
  const field = document.querySelector(".battle-field");
  const topbar = document.querySelector(".battle-topbar");
  if (!field || !topbar || !field.offsetParent) return; // 对战界面未显示时跳过
  applyBattleScale(1); // 先复位，实测自然布局
  // 实测所有后代的最上/最下缘（能捕捉到被压扁行的内容溢出）。
  // display:none 的元素（表情面板/聊天栏等）矩形全为 0，会把 top 拉成 0
  // 导致缩放公式永远算不准 —— 跳过它们
  const measure = () => {
    let top = Infinity, bottom = 0;
    field.querySelectorAll("*").forEach(k => {
      const b = k.getBoundingClientRect();
      if (b.width === 0 && b.height === 0) return; // 不可见元素不参与测量
      if (b.bottom > bottom) bottom = b.bottom;
      if (b.top < top) top = b.top;
    });
    if (top === Infinity) top = 0;
    return { top, bottom };
  };
  let box = measure();
  // 已放下：余量充足时摘掉极矮压缩类（滞回 ≥14px，防类开关在临界窗口尺寸振荡）
  if (box.bottom <= window.innerHeight - 4) {
    if (box.bottom <= window.innerHeight - 14) field.classList.remove("vh-tiny");
    return;
  }
  let s = 1;
  // 【v0.15】缩放分级放宽：普通窗口维持 0.62 下限（手牌大尺寸优先）；
  // 极矮窗口（<390px 高）放不下时先压缩底部呼吸 padding（16→6px，不删只压），
  // 再沿 0.4 → 0.26 下压——卡再小是可玩性取舍，裁掉是硬伤
  const pass = (floor, tries, margin) => {
    for (let i = 0; i < tries; i++) {
      s = Math.max(floor, s * ((window.innerHeight - 8 - box.top) / (box.bottom - box.top)));
      applyBattleScale(s, floor);
      box = measure();
      if (box.bottom <= window.innerHeight - margin) return true;
    }
    return box.bottom <= window.innerHeight - margin;
  };
  if (pass(0.62, 8, 4)) {
    if (box.bottom <= window.innerHeight - 14) field.classList.remove("vh-tiny"); // 滞回：余量足才恢复呼吸 padding
    return;
  }
  if (!field.classList.contains("vh-tiny")) {
    field.classList.add("vh-tiny"); // 压缩呼吸空间后从头重算（zoom 收不动 flex 容器，padding 才是这 4px 的主人）
    applyBattleScale(1, 1);
    box = measure();
    s = 1;
    if (pass(0.62, 3, 2)) return;
  }
  if (!pass(0.4, 3, 2)) pass(0.26, 3, 1);
}
let fx_fitRaf = 0;
function fxQueueFit() {
  cancelAnimationFrame(fx_fitRaf);
  fx_fitRaf = requestAnimationFrame(fitBattleField);
}
window.addEventListener("resize", fxQueueFit);
// CSS / 字体晚于 DOM 就绪时重排一次，防止牌局在旧布局上定缩放
window.addEventListener("load", fxQueueFit);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(fxQueueFit).catch(() => {});

// —— 图鉴卡片入场观察器：进入视口才加 .fx-in，动画由 fx.css 播放 ——
let fxCardIO = null;
function fxObserveCards() {
  if (fxReduceMotion.matches || !("IntersectionObserver" in window)) return;
  const grid = document.getElementById("card-grid");
  if (!grid) return;
  if (!fxCardIO) {
    fxCardIO = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add("fx-in");
        fxCardIO.unobserve(en.target);
      });
    }, { root: grid, threshold: 0.12 });
  }
  grid.classList.add("fx-anim");
  grid.querySelectorAll(".ccard:not(.fx-in)").forEach((c) => fxCardIO.observe(c));
}

// 强调类动画播放完毕后自动摘掉类，保证下次可重放
document.addEventListener("animationend", (e) => {
  const t = e.target;
  if (!(t instanceof Element)) return;
  if (t.classList.contains("fx-pop")) t.classList.remove("fx-pop");
  if (t.classList.contains("fx-flash")) t.classList.remove("fx-flash");
  if (t.classList.contains("fx-land")) t.classList.remove("fx-land"); // 落地动画播完摘类，避免占用 hover 变换
  if (t.classList.contains("fx-shake")) t.classList.remove("fx-shake");
  if (t.classList.contains("fx-squash")) t.classList.remove("fx-squash"); // 【v0.16】受击形变链播完摘类，可重放
});

// ---------- Toast ----------
let toastTimer = null;
function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add("hidden"), 1800);
}

// ---------- 房间号 ----------
function randomCode() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return String(n);
}
function renderRoomCode(code) {
  // 每位数字包一层 .fx-digit（结构级配合），fx.css 做逐位翻出入场；
  // 「换一个房间号」重建节点后动画自动重放
  document.getElementById("room-code-1").innerHTML =
    code.slice(0, 3).split("").map(d => `<span class="fx-digit">${d}</span>`).join("");
  document.getElementById("room-code-2").innerHTML =
    code.slice(3).split("").map(d => `<span class="fx-digit">${d}</span>`).join("");
}
let currentRoomCode = randomCode();
renderRoomCode(currentRoomCode);

document.getElementById("btn-reroll-code").addEventListener("click", () => {
  currentRoomCode = randomCode();
  renderRoomCode(currentRoomCode);
  toast("已生成新房间号");
});
document.getElementById("btn-copy-code").addEventListener("click", () => {
  const code = currentRoomCode.slice(0, 3) + " " + currentRoomCode.slice(3);
  const done = () => toast("房间号已复制：" + code);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(done).catch(() => fallbackCopy(code, done));
  } else {
    fallbackCopy(code, done);
  }
});
function fallbackCopy(text, done) {
  const ta = document.createElement("textarea");
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand("copy"); done(); } catch (e) { toast("复制失败，请手动记录"); }
  document.body.removeChild(ta);
}

// ---------- 加入房间（6 位输入框） ----------
const codeInputs = [...document.querySelectorAll("#code-inputs input")];
codeInputs.forEach((inp, i) => {
  inp.addEventListener("input", () => {
    inp.value = inp.value.replace(/\D/g, "").slice(0, 1);
    if (inp.value && i < codeInputs.length - 1) codeInputs[i + 1].focus();
  });
  inp.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && !inp.value && i > 0) codeInputs[i - 1].focus();
  });
});
document.getElementById("btn-join").addEventListener("click", () => {
  const code = codeInputs.map(i => i.value).join("");
  if (code.length < 6) {
    document.getElementById("code-inputs").classList.add("shake");
    setTimeout(() => document.getElementById("code-inputs").classList.remove("shake"), 400);
    toast("请输满 6 位房间号");
    return;
  }
  toast("已找到房间 " + code + "，请选择英雄…");
  setTimeout(() => show("screen-pick"), 700);
});

// ==========================================================
// 选英雄（v0.5）：开战前从 11 位角色中挑一位，敌方从其余角色随机匹配
// v0.6 本地双人：两位玩家依次选英雄（duoPickPhase 1→2），可选同一英雄
// ==========================================================
let pickedHeroName = null; // 本次会话记住上次选择，返回再进不丢失
// v0.9 英雄金句：风味故事的第一句（截 36 字），选人卡面与终局面板共用
function heroQuote(c) {
  const s = (c && c.story || "").split("。")[0];
  return s.length > 36 ? s.slice(0, 36) + "…" : s;
}
function pickCardHtml(c, i) {
  const p1Badge = duoPickPhase === 2 && duoPicks[0] === c.name ? `<span class="chip seat-chip">1 号位已选</span>` : "";
  const quote = heroQuote(c);
  return `
  <article class="ccard pcard${pickedHeroName === c.name ? " picked" : ""}" data-i="${i}">
    <div class="portrait" data-gender="${c.gender}">${iconArt(c.name)}</div>
    <div class="nameplate">${c.name}</div>
    <div class="chips"><span class="chip">${c.gender}生</span><span class="chip">${c.cls}</span>${c.combo ? `<span class="chip combo-chip">◈ ${c.combo}</span>` : ""}</div>
    <div class="skill"><b>英雄技能 ·「${c.power.name}」（${c.power.cost} 费）</b><span>${c.power.desc}</span></div>
    ${quote ? `<div class="p-quote">「${quote}。」</div>` : ""}
    <div class="p-minion">英雄 ${c.hp} 血 · 随从 ${c.minion.atk}/${c.minion.hp} · ${c.cost} 费登场${p1Badge}</div>
    <span class="p-check" aria-hidden="true"></span>
  </article>`;
}
function renderPickGrid() {
  const grid = document.getElementById("pick-grid");
  if (!grid) return;
  // v0.10：AI 难度选择行只在单机选人时显示（双人两位依次选人时隐藏）
  const diffRow = document.getElementById("diff-row");
  if (diffRow) { diffRow.classList.toggle("hidden", duoPickPhase !== 0); syncDiffRow(); }
  grid.innerHTML = CHARACTERS.map(pickCardHtml).join("");
  // 【v0.19】界面五律·单光源高亮：已选中时其余候选降明度（一屏只 1 个发光点 + 1 个确认键）
  grid.classList.toggle("has-sel", !!pickedHeroName);
  const note = document.getElementById("pick-note");
  const goBtn = document.getElementById("btn-pick-go");
  if (duoPickPhase === 2) {
    document.getElementById("pick-count").textContent = `2 号位已选 ${pickedHeroName ? 1 : 0} / ${CHARACTERS.length}（1 号位：${duoPicks[0]}）`;
    if (note) note.textContent = `本地双人 · 正在为 2 号位选英雄 · 两位可选同一英雄`;
    goBtn.textContent = "双 人 开 战";
  } else if (duoPickPhase === 1) {
    document.getElementById("pick-count").textContent = `1 号位已选 ${pickedHeroName ? 1 : 0} / ${CHARACTERS.length}`;
    if (note) note.textContent = `本地双人 · 正在为 1 号位选英雄 · 选完后交给 2 号位`;
    goBtn.textContent = "确 认 1 号 位";
  } else {
    document.getElementById("pick-count").textContent = `已选 ${pickedHeroName ? 1 : 0} / ${CHARACTERS.length}`;
    if (note) note.textContent = `英雄决定你的英雄技能与专属组合技 · 对手将从其余角色中随机匹配`;
    goBtn.textContent = "开 始 对 战";
  }
  goBtn.disabled = !pickedHeroName;
}
document.getElementById("pick-grid").addEventListener("click", (e) => {
  const el = e.target.closest(".pcard");
  if (!el) return;
  const c = CHARACTERS[+el.dataset.i];
  if (!c) return;
  pickedHeroName = c.name;
  Snd.play("ui");
  renderPickGrid();
});
document.getElementById("btn-pick-random").addEventListener("click", () => {
  pickedHeroName = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)].name;
  Snd.play("coin");
  renderPickGrid();
  toast("已随机选择：" + pickedHeroName);
});
document.getElementById("btn-pick-go").addEventListener("click", () => {
  if (!pickedHeroName) return;
  if (duoPickPhase === 1) {         // 双人：1 号位确认 → 转 2 号位
    duoPicks[0] = pickedHeroName;
    duoPickPhase = 2;
    pickedHeroName = duoPicks[1];
    Snd.play("ui");
    renderPickGrid();
    toast("1 号位已选 " + duoPicks[0] + " · 请 2 号位选择");
    return;
  }
  if (duoPickPhase === 2) {         // 双人：2 号位确认 → 开战
    duoPicks[1] = pickedHeroName;
    startDuoBattle();
    return;
  }
  if (campaignStage) {              // 【v0.14】闯关：选完英雄 → 按关卡配置开战
    const st = campaignStage;
    campaignStage = null;           // 开战即消费,防止普通对战误用关卡配置
    document.querySelector("#screen-pick h2").textContent = "选择你的英雄"; // 恢复标题
    startCampaignBattle(pickedHeroName, st);
    return;
  }
  setupHeroes(pickedHeroName); // 单机：我方 = 所选，敌方 = 其余角色随机
  show("screen-battle");
});

// v0.6 本地双人入口：大厅 → 两位依次选英雄 → 同屏轮流对战
document.getElementById("btn-duo-start").addEventListener("click", () => {
  duoPickPhase = 1;
  pickedHeroName = duoPicks[0];
  Snd.play("ui");
  show("screen-pick");
});

// v0.10 AI 难度三档（简单/普通/困难）：选英雄界面选档，持久化在 cl-settings 的 aiDiff；
// 档位参数表见 planEnemyPower 上方的 AI_DIFFS（normal = 历史行为，逐档收敛/放开）
const DIFF_LABEL = { easy: "简单", normal: "普通", hard: "困难" };
const DIFF_NOTE = {
  easy: "对手常空过、攻击随心 —— 热身局",
  normal: "会打牌、会凑组合技的默认对手",
  hard: "不空过 · 曲线出牌 · 精确斩杀 —— 迎接挑战",
};
let lastGameDiff = ""; // 【v0.12】上一局对手的难度档(选英雄界面提示"上局打的是哪档")
function syncDiffRow() {
  const cur = DIFF_LABEL[settings.aiDiff] ? settings.aiDiff : "normal";
  document.querySelectorAll("#diff-row button[data-diff]").forEach(b =>
    b.classList.toggle("active", b.dataset.diff === cur));
  const note = document.getElementById("diff-note");
  if (note) note.textContent = DIFF_NOTE[cur] + (lastGameDiff ? ` · 上一局:${lastGameDiff}档` : "");
}
document.getElementById("diff-row").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-diff]");
  if (!b || b.dataset.diff === settings.aiDiff) return;
  settings.aiDiff = b.dataset.diff;
  saveSettings();
  syncDiffRow();
  Snd.play("ui");
  toast("AI 难度已切换：" + DIFF_LABEL[settings.aiDiff]);
});

// 双人对局配置：1 号位初始在下方，2 号位在上方（先手由掷硬币决定，resetBattle 处理）
function startDuoBattle() {
  battleMode = "duo";
  const p1 = CHARACTERS.find(c => c.name === duoPicks[0]) || CHARACTERS[0];
  const p2 = CHARACTERS.find(c => c.name === duoPicks[1]) || CHARACTERS[1] || CHARACTERS[0];
  Object.assign(myHero, { name: p1.name, cls: p1.cls + " · 1号位", hp: p1.hp, maxHp: p1.hp, powerDef: p1.power, turnsTaken: 0 });
  Object.assign(enemyHero, { name: p2.name, cls: p2.cls + " · 2号位", hp: p2.hp, maxHp: p2.hp, powerDef: p2.power, powerUsed: false, turnsTaken: 0 });
  show("screen-battle"); // 对局信息由开局交接遮罩与战报播报，不再另弹 toast 遮挡
}

// 按所选英雄配置对局双方（敌方避开我方角色，保证对位差异）
function setupHeroes(playerName) {
  battleMode = "ai"; // 单机模式（再来一局 / 直开对战都走这里）
  lastGameDiff = DIFF_LABEL[settings.aiDiff] || "普通"; // 【v0.12】记下本局难度,选人界面展示「上一局」
  const me = CHARACTERS.find(c => c.name === playerName) || CHARACTERS[0];
  const pool = CHARACTERS.filter(c => c.name !== me.name);
  const foe = pool[Math.floor(Math.random() * pool.length)];
  Object.assign(myHero, { name: me.name, cls: me.cls + " · 我方", hp: me.hp, maxHp: me.hp, powerDef: me.power, turnsTaken: 0 });
  // v0.10：敌方职业串带上难度档位，牌局里一眼看出对手成色
  const diffLabel = DIFF_LABEL[settings.aiDiff] || "普通";
  Object.assign(enemyHero, { name: foe.name, cls: foe.cls + " · 敌方 · " + diffLabel, hp: foe.hp, maxHp: foe.hp, powerDef: foe.power, powerUsed: false, turnsTaken: 0 });
  return foe.name;
}

// ---------- 收集系统（v0.14）：基础卡默认拥有,收集卡需通关闯关模式解锁;进度持久化,联机就绪 ----------
const BASE_CARDS = [...CHARACTERS.filter(c => !c.collect).map(c => c.name),
  ...SPELLS.filter(s => !s.collect).map(s => s.name),
  ...COMBOS.filter(c => !c.collect).map(c => c.name)]; // 基础卡 = 首发卡池,人人拥有
let campaign = { cleared: {}, ownedExtra: [] };        // 闯关进度 + 收集卡（键 = cl-campaign,账号级,联机可直接同步）
try {
  const cp = JSON.parse(localStorage.getItem("cl-campaign"));
  if (cp) campaign = { cleared: cp.cleared || {}, ownedExtra: Array.isArray(cp.ownedExtra) ? cp.ownedExtra : [] };
} catch (e) { /* 忽略损坏的存档 */ }
function saveCampaign() {
  try { localStorage.setItem("cl-campaign", JSON.stringify(campaign)); } catch (e) { /* 无痕模式等 */ }
}
function isOwned(name) { return BASE_CARDS.includes(name) || campaign.ownedExtra.includes(name); }
function grantCards(names) {
  let got = [];
  names.forEach(n => { if (n && !isOwned(n)) { campaign.ownedExtra.push(n); got.push(n); } });
  if (got.length) saveCampaign();
  return got;
}
function getOwnedSet() { return new Set([...BASE_CARDS, ...campaign.ownedExtra]); }
function ownedCount() { return BASE_CARDS.length + campaign.ownedExtra.length; }
function totalCardCount() { return CHARACTERS.length + SPELLS.length + COMBOS.length; }

// ---------- 闯关模式（v0.14）：通关关卡 → 收集卡牌;进度持久化(cl-campaign),卡池结构联机就绪 ----------
const CAMPAIGNS = [
  { id: 1, name: "新生报到",   foe: "钱多宝", diff: "easy",   rewards: ["情书错投", "钱多宝"],
    intro: "校董少爷想在新生面前刷存在感。赢下他,让他心服口服地把进口零食和情书都交出来。" },
  { id: 2, name: "广播风暴",   foe: "陆小铃", diff: "normal", rewards: ["陆小铃", "午休补觉"],
    intro: "广播站长点名要和你「对峙十分钟」。赢了她,全校的课间广播就归你点歌。" },
  { id: 3, name: "体育课争霸", foe: "高大力", diff: "normal", rewards: ["高大力", "集体托举"],
    intro: "体育生队长的挑战书写得明明白白：输的人做一周俯卧撑。赢的人,杠铃归你。" },
  { id: 4, name: "转学第一天", foe: "白小卷", diff: "hard",   rewards: ["白小卷", "粉笔弹幕"],
    intro: "转学生白小卷递来一张纸条：「放学后，天台见。」没有人知道她的底细。" },
  { id: 5, name: "课间操整顿", foe: "欧阳汉子", diff: "hard", rewards: ["课间操整队"],
    intro: "狂战士对课间操纪律很有意见。想整队？先过了她这一关。" },
  { id: 6, name: "流浪狗大队", foe: "明芒", diff: "hard",   rewards: ["广播寻人", "人肉坦克"],
    intro: "终局之战。总指挥（本犬）带着全队堵在校门口——赢了它,广播寻人特权归你。" },
];
let campaignStage = null; // 当前挑战的关卡（pick 选英雄后开战）
function stageUnlocked(st) {
  if (st.id === 1) return true;
  const prev = CAMPAIGNS.find(s => s.id === st.id - 1);
  return !!(prev && campaign.cleared[prev.id]);
}
function renderStages() {
  const box = document.getElementById("stage-list");
  if (!box) return;
  const clearedCount = CAMPAIGNS.filter(s => campaign.cleared[s.id]).length;
  document.getElementById("stage-progress").textContent = `已通关 ${clearedCount}/${CAMPAIGNS.length} 关 · 收集进度 ${ownedCount()}/${totalCardCount()}`;
  box.innerHTML = CAMPAIGNS.map(s => {
    const cleared = !!campaign.cleared[s.id];
    const unlocked = stageUnlocked(s);
    const foe = CHARACTERS.find(c => c.name === s.foe);
    // 【v0.21】透视五律·视平线定气场:1~3 关中视平线(日常叙事),4~6 关低视平线压迫递增(暗红铜+尖塔上仰)
    const tier = s.id >= 5 ? "late2" : s.id >= 4 ? "late1" : "";
    return `
    <button class="stage-card ${cleared ? "cleared" : unlocked ? "open" : "locked"} ${tier}" data-stage="${s.id}" ${unlocked ? "" : "disabled"}>
      <span class="st-no">${cleared ? "?" : unlocked ? s.id : "??"}</span>
      <span class="st-main"><b>${s.id} · ${s.name}</b><i>${s.intro}</i>
        <em>对手:${foe.name}(${DIFF_LABEL[s.diff]}) · 奖励:${s.rewards.join("、")}</em></span>
      <span class="st-state">${cleared ? "已通关" : unlocked ? "挑战" : "未解锁"}</span>
    </button>`;
  }).join("");
}
document.getElementById("stage-list").addEventListener("click", (e) => {
  const b = e.target.closest(".stage-card[data-stage]");
  if (!b || b.disabled) return;
  const st = CAMPAIGNS.find(s => s.id === +b.dataset.stage);
  if (!st) return;
  campaignStage = st;
  duoPickPhase = 0; // 闯关借用选英雄界面选我方英雄
  document.querySelector("#screen-pick h2").textContent = `选择英雄 · 挑战「${st.name}」`;
  const note = document.getElementById("pick-note");
  if (note) note.textContent = st.intro;
  show("screen-pick");
});
function startCampaignBattle(heroName, st) {
  if (!st) st = battleCampaignStage; // 重打本关时从进行中的对局取回
  setupHeroes(heroName); // 先按所选英雄配置我方(注意:它会把 battleMode 置回 "ai")
  battleMode = "campaign"; // 所以闯关模式必须在它之后设置
  battleCampaignStage = st;
  lastGameDiff = DIFF_LABEL[st.diff] || "普通"; // 【v0.21·深检修】挪到 setupHeroes 之后:原先先赋值被它内部的
                                                // 全局档覆盖,打完 hard 关卡选人页显示的是用户全局档
  const foeDef = CHARACTERS.find(c => c.name === st.foe) || CHARACTERS[1];
  // 关卡对手固定(不随机),难度按关卡配置
  Object.assign(enemyHero, { name: foeDef.name, cls: foeDef.cls + " · 关卡 " + st.id + " · " + (DIFF_LABEL[st.diff] || "普通"), hp: foeDef.hp, maxHp: foeDef.hp, powerDef: foeDef.power, powerUsed: false, turnsTaken: 0 });
  show("screen-battle");
}

// ---------- 战绩统计（v0.5 起）：localStorage 持久化，大厅展示 ----------
// v0.6 扩展：recent = 最近 12 局（胜负/双方英雄/回合数），heroes = 各英雄分别的胜负
let stats = { win: 0, lose: 0, streak: 0, best: 0, recent: [], heroes: {}, duo: { games: 0, heroes: {} } };
try {
  const s = JSON.parse(localStorage.getItem("cl-stats"));
  if (s) stats = { ...stats, ...s };
} catch (e) { /* 忽略损坏的存档 */ }
function saveStats() {
  try { localStorage.setItem("cl-stats", JSON.stringify(stats)); } catch (e) { /* 无痕模式等 */ }
}
function recordResult(win, heroName, foeName, turns) {
  if (win) { stats.win++; stats.streak = stats.streak > 0 ? stats.streak + 1 : 1; }
  else { stats.lose++; stats.streak = stats.streak < 0 ? stats.streak - 1 : -1; }
  if (stats.streak > stats.best) stats.best = stats.streak;
  stats.recent = (stats.recent || []).concat([{ w: win ? 1 : 0, hero: heroName || "", foe: foeName || "", t: turns || 0 }]).slice(-12);
  if (heroName) {
    const h = (stats.heroes = stats.heroes || {})[heroName] = stats.heroes[heroName] || { w: 0, l: 0 };
    if (win) h.w++; else h.l++;
  }
  // 【v0.12】难度分档战绩：按对局开始时的档位记账（投降/终局都经这里）
  const dk = DIFF_LABEL[settings.aiDiff] ? settings.aiDiff : "normal";
  const d = (stats.diff = stats.diff || {})[dk] = stats.diff[dk] || { w: 0, l: 0 };
  if (win) d.w++; else d.l++;
  saveStats();
}
function diffStatsHtml() {
  const d = stats.diff;
  if (!d) return "";
  const parts = Object.keys(DIFF_LABEL)
    .filter(k => d[k] && (d[k].w + d[k].l) > 0)
    .map(k => `${DIFF_LABEL[k]} ${d[k].w}胜${d[k].l}负`);
  return parts.length ? `<span class="ls-diff">分档 · ${parts.join(" · ")}</span>` : "";
}
// v0.7 双人战绩分边统计：按英雄各记胜负（不计入单机胜负数）
function recordDuoResult(winner, loser) {
  const d = (stats.duo = stats.duo || { games: 0, heroes: {} });
  d.games++;
  [winner, loser].forEach((n, i) => {
    if (!n) return;
    const h = d.heroes[n] = d.heroes[n] || { w: 0, l: 0 };
    if (i === 0) h.w++; else h.l++;
  });
  saveStats();
}
function duoStatsHtml() {
  const d = stats.duo;
  if (!d || !d.games) return "";
  const names = Object.keys(d.heroes).sort((a, b) =>
    (d.heroes[b].w + d.heroes[b].l) - (d.heroes[a].w + d.heroes[a].l));
  const parts = names.slice(0, 3).map(n => `${n} ${d.heroes[n].w}胜${d.heroes[n].l}负`);
  return `<span class="ls-duo">本地双人 · ${d.games} 局${parts.length ? " · " + parts.join(" · ") : ""}</span>`;
}
function renderLobbyStats() {
  const box = document.getElementById("lobby-stats");
  if (!box) return;
  const total = stats.win + stats.lose;
  const duoLine = duoStatsHtml();
  if (!total && !duoLine) {
    box.innerHTML = `<p class="ls-empty">还没有战绩 · 打完第一局就会记录在这里</p>`;
    return;
  }
  if (!total) { // 只打过双人：只展示双人行
    box.innerHTML = `<div class="ls-sub"><span class="ls-dots"></span>${duoLine}</div>`;
    return;
  }
  const rate = Math.round(stats.win / total * 100);
  const streak = stats.streak > 0 ? `${stats.streak} 连胜` : stats.streak < 0 ? `${-stats.streak} 连败` : "—";
  // v0.6：最近对局胜负点（悬停看对阵详情）+ 最常用英雄战绩
  const dots = (stats.recent || []).slice(-12).map(r =>
    `<i class="dot ${r.w ? "win" : "lose"}" title="${r.hero} vs ${r.foe}${r.t ? " · " + r.t + " 回合" : ""}"></i>`).join("");
  let fav = null, favGames = 0;
  Object.keys(stats.heroes || {}).forEach((n) => {
    const h = stats.heroes[n], g = h.w + h.l;
    if (g > favGames) { favGames = g; fav = { n, w: h.w, l: h.l }; }
  });
  const favHtml = fav ? `常用英雄 ${fav.n} · ${fav.w}胜${fav.l}负（${Math.round(fav.w / favGames * 100)}%）` : "尚无英雄数据";
  box.innerHTML = `
    <div class="ls-cell"><b class="win">${stats.win}</b><span>胜</span></div>
    <i class="ls-div"></i>
    <div class="ls-cell"><b class="lose">${stats.lose}</b><span>负</span></div>
    <i class="ls-div"></i>
    <div class="ls-cell"><b>${rate}%</b><span>胜率</span></div>
    <i class="ls-div"></i>
    <div class="ls-cell"><b>${streak}</b><span>当前</span></div>
    <i class="ls-div"></i>
    <div class="ls-cell"><b>${stats.best}</b><span>最佳连胜</span></div>
    <div class="ls-sub"><span class="ls-dots">${dots}</span><span class="ls-fav">${favHtml}</span></div>
    ${diffStatsHtml() ? `<div class="ls-sub"><span class="ls-dots"></span>${diffStatsHtml()}</div>` : ""}
    ${duoLine ? `<div class="ls-sub"><span class="ls-dots"></span>${duoLine}</div>` : ""}`;
}

// ---------- 卡牌图鉴（角色卡 / 法术卡 / 组合技卡） ----------
const grid = document.getElementById("card-grid");
const tabsBox = document.getElementById("collection-tabs");

function roleCardHtml(c, i) {
  const comboChip = c.combo ? `<span class="chip combo-chip">◈ ${c.combo}</span>` : "";
  return `
  <article class="ccard" data-kind="role" data-idx="${i}">
    <div class="portrait" data-gender="${c.gender}">${iconArt(c.name)}</div>
    <div class="nameplate">${c.name}</div>
    <div class="chips"><span class="chip">${c.gender}生</span><span class="chip">${c.cls}</span>${comboChip}</div>
    <div class="skill"><b>「${c.skill}」（${c.cost} 费）</b><span>${c.skillDesc}</span></div>
    <div class="stats"><span class="hp">♥ 生命 ${c.hp}</span></div>
  </article>`;
}
function spellCardHtml(s, i) {
  return `
  <article class="ccard spell-card" data-kind="spell" data-idx="${i}">
    <div class="portrait"><span class="cost-gem">${s.cost}</span>${iconArt(s.name)}</div>
    <div class="nameplate">${s.name}</div>
    <div class="chips"><span class="chip">法术卡</span><span class="chip combo-chip">◈ ${s.combo}</span></div>
    <div class="skill"><b>${s.cost} 费 · 法术</b><span>${s.effect}</span></div>
    <div class="art-note"><b>图标设定</b> ${s.art}</div>
    <div class="stats"><span class="mana-note">组合技组件卡</span></div>
  </article>`;
}
function comboCardHtml(c, i) {
  return `
  <article class="ccard combo-card" data-kind="combo" data-idx="${i}">
    <div class="portrait"><span class="cost-gem">${c.cost}</span>${iconArt(c.name)}</div>
    <div class="nameplate">${c.name}</div>
    <div class="chips"><span class="chip combo-chip">组合技卡</span></div>
    <div class="combo-formula">${c.need[0]}<i> + </i>${c.need[1]}</div>
    <div class="skill"><b>${c.cost} 费 · 组合技</b><span>${c.effect}</span></div>
    <div class="art-note"><b>图标设定</b> ${c.art}</div>
    <div class="stats"><span class="combo-note">本局打出过配套法术 · 角色在场即触发</span></div>
  </article>`;
}

// v0.7 图鉴精进：费用排序（default 默认 / asc 升序 / desc 降序）+ 图标收集进度 + 详情搭档跳转
// v0.8 机制关键词筛选：页签 × 筛选 × 排序三者正交组合
// v0.9 图鉴记忆：页签/排序/筛选持久化在 localStorage（cl-coll），下次进来保持上次的浏览状态
let collSort = "default";
let collTab = "all";
let collFilter = ""; // 空 = 不筛
try {
  const cs = JSON.parse(localStorage.getItem("cl-coll"));
  if (cs) {
    if (["default", "asc", "desc"].includes(cs.sort)) collSort = cs.sort;
    if (["all", "role", "spell", "combo"].includes(cs.tab)) collTab = cs.tab;
    if (cs.filter === "" || COLL_TAGS.includes(cs.filter)) collFilter = cs.filter || "";
  }
} catch (e) { /* 忽略损坏的存档 */ }
function saveCollState() {
  try { localStorage.setItem("cl-coll", JSON.stringify({ tab: collTab, sort: collSort, filter: collFilter })); } catch (e) { /* 无痕模式等 */ }
}
// 把恢复的状态同步到排序/筛选按钮的高亮（页签高亮由 renderCollection 自管）
function syncCollTools() {
  document.querySelectorAll("#collection-sort .stab").forEach(x => x.classList.toggle("active", x.dataset.sort === collSort));
  document.querySelectorAll("#collection-filter .fchip").forEach(x => x.classList.toggle("active", x.dataset.tag === collFilter));
}
function renderCollection(kind) {
  collTab = kind;
  const entryHtml = { role: roleCardHtml, spell: spellCardHtml, combo: comboCardHtml };
  const kinds = kind === "all" ? ["role", "spell", "combo"] : [kind];
  let entries = [];
  kinds.forEach(k => kindList[k].forEach((c, i) => entries.push({ k, i, cost: c.cost, name: c.name })));
  if (collFilter) entries = entries.filter(e => cardTags(kindList[e.k][e.i]).has(collFilter));
  if (collSort !== "default") {
    const dir = collSort === "asc" ? 1 : -1;
    entries.sort((a, b) => (a.cost - b.cost) * dir || a.name.localeCompare(b.name, "zh"));
  }
  grid.innerHTML = entries.length
    ? entries.map(e => entryHtml[e.k](kindList[e.k][e.i], e.i)).join("")
    : `<p class="coll-empty">没有同时符合当前页签与「${collFilter}」筛选的卡片<br>换个机制关键词或切回全部试试</p>`;
  // 【v0.14】收集态:未收集的卡以黑影呈现——卡名/效果/立绘全部隐藏,只留剪影与获取提示
  // 【v0.16】已收集的收集卡:金纹边框变体 + 水滴形稀有度宝石(边框管稀有度、布局永不动——art-design 十节)
  grid.querySelectorAll(".ccard").forEach((el, i) => {
    const e = entries[i];
    if (!e) return;
    const def = kindList[e.k][e.i];
    if (!isOwned(def.name)) {
      const stage = CAMPAIGNS.find(s => s.rewards.includes(def.name));
      el.classList.add("not-owned");
      el.innerHTML = `
      <div class="portrait"><div class="silhouette">${iconArt(def.name)}</div></div>
      <div class="nameplate">? ? ?</div>
      <div class="chips"><span class="chip">未收集</span></div>
      <div class="skill"><b>尚未收集</b><span>${stage
        ? `通关 ${stage.id} 号关卡「${stage.name}」即可收集这张卡`
        : "在闯关模式中收集这张卡"}</span></div>
      <div class="stats"><span class="mana-note">通关闯关模式解锁</span></div>`;
      return;
    }
    if (def.collect) {
      el.classList.add("collect-owned");
      el.insertAdjacentHTML("beforeend", '<i class="rarity-drop" title="闯关收集卡"></i>');
    }
  });
  document.getElementById("card-count").textContent =
    `已收集 ${ownedCount()}/${totalCardCount()} 张` + (ownedCount() < totalCardCount() ? " · 通关闯关模式收集更多" : "");
  renderIconProgress();
  fxObserveCards(); // 动效配合：为新卡片挂上入场观察器
  tabsBox.querySelectorAll(".ftab").forEach(b => {
    b.classList.toggle("active", b.dataset.tab === kind);
    const n = b.dataset.tab === "all" ? CHARACTERS.length + SPELLS.length + COMBOS.length : kindList[b.dataset.tab].length;
    b.querySelector("em").textContent = n;
  });
  saveCollState(); // v0.9：页签/排序/筛选任一变化都会经这里落库
}
// 图标收集进度：已绘制 / 全部（数据与图鉴共用一份，绘制完成自动亮进度条）
function renderIconProgress() {
  const box = document.getElementById("icon-progress");
  if (!box) return;
  const all = [...CHARACTERS, ...SPELLS, ...COMBOS];
  const drawn = all.filter(c => hasIcon(c.name)).length;
  const pct = Math.round(drawn / all.length * 100);
  box.innerHTML = `<span class="ip-label">图标收集</span><span class="ip-track"><i style="width:${pct}%"></i></span><span class="ip-num">${drawn} / ${all.length}</span>`;
}
const kindList = { role: CHARACTERS, spell: SPELLS, combo: COMBOS };
tabsBox.addEventListener("click", (e) => {
  const b = e.target.closest(".ftab");
  if (b) renderCollection(b.dataset.tab);
});
document.getElementById("collection-sort").addEventListener("click", (e) => {
  const b = e.target.closest(".stab");
  if (!b || b.dataset.sort === collSort) return;
  collSort = b.dataset.sort;
  document.querySelectorAll("#collection-sort .stab").forEach(x => x.classList.toggle("active", x === b));
  renderCollection(collTab);
  Snd.play("ui");
});
// v0.8 机制关键词筛选：再点一次已选中的关键词 = 取消筛选
document.getElementById("collection-filter").addEventListener("click", (e) => {
  const b = e.target.closest(".fchip");
  if (!b) return;
  const tag = b.dataset.tag;
  collFilter = (collFilter === tag) ? "" : tag;
  document.querySelectorAll("#collection-filter .fchip").forEach(x =>
    x.classList.toggle("active", x.dataset.tag === collFilter));
  renderCollection(collTab);
  Snd.play("ui");
});
syncCollTools();               // v0.9：先把恢复的排序/筛选高亮同步到按钮
renderCollection(collTab);     // 用恢复的页签渲染（首次无存档 = all）

// 卡牌详情：kind ∈ role/spell/combo，idx 为对应数组的下标；
// data-goto 链接可在详情里直接跳到组合技搭档卡（v0.7）
// 【v0.11】卡牌描述关键字句高亮：伤害红 / 增益治疗绿 / 削弱紫 / 嘲讽蓝盾 / 抽牌情报蓝 / 召唤吹回青 /
// 「卡名·关键词」金。单次正则替换（组序即优先级），只喂纯文本，含 HTML 的拼装文案不要走这里
function fmtDesc(t) {
  if (!t) return t || "";
  // 【v0.26·审计】两处正则修正:①增益 +1/+1 的第二个符号让 \d+\/\d+ 匹配失败
  // (电子遥控器/集体托举/开国大典/疯狂刷题四条文案零高亮)——分母侧也允许 [+-];
  // ②抽牌字面量只有"抽一张牌",漏"抽两张牌"(情书错投)——改数字通配
  return String(t).replace(
    /「[^」]+」|\d+ 点伤害|[+-]?\d+\/[+-]?\d+|[+-]\d+ 攻击|恢复 \d+ 点生命|无法攻击|嘲讽|抽[一二两三四五六七八九十\d]+张牌|窥视|召唤一个|吹回/g,
    (m) => {
      let cls;
      if (m.startsWith("「")) cls = "k-gold";
      else if (m.includes("伤害")) cls = "k-dmg";
      else if (m.startsWith("抽") || m === "窥视") cls = "k-draw";
      else if (m.startsWith("+") || m.startsWith("恢复")) cls = "k-heal";
      else if (m.startsWith("-")) cls = "k-debuff";
      else if (m === "无法攻击") cls = "k-lock";
      else if (m === "嘲讽") cls = "k-taunt";
      else if (/^\d+\/\d+$/.test(m) || m.startsWith("召唤") || m === "吹回") cls = "k-summon";
      else cls = "k-dmg";
      return `<span class="${cls}">${m}</span>`;
    });
}
function cardDetailHtml(kind, idx, footer) {
  // 组合技搭档跳转链接：目标卡存在才渲染
  const gotoBtn = (k, name) => {
    const i = kindList[k].findIndex(c => c.name === name);
    return i >= 0 ? `<button class="btn-link" data-goto="${k}:${i}">「${name}」</button>` : `「${name}」`;
  };
  // v0.8 公共片段：机制关键词标签 + 风味故事框（有才渲染）；描述统一走 fmtDesc 关键字高亮
  const tagChips = (card) => {
    const tags = [...cardTags(card)];
    return tags.length ? tags.map(t => `<span class="chip tag-chip">${t}</span>`).join("") : "";
  };
  const storyBox = (card) => card.story
    ? `<div class="skillbox story"><b>风味故事</b><span>${fmtDesc(card.story)}</span></div>` : "";
  if (kind === "role") {
    const c = CHARACTERS[idx];
    const cb = c.combo ? COMBOS.find(x => x.name === c.combo) : null;
    const partner = cb ? cb.need.find(n => n !== c.name) : "";
    return `
      <div class="cd-side">
        <div class="portrait">${iconArt(c.name)}</div>
        <div class="nameplate">${c.name}</div>
        <div class="chips"><span class="chip">${c.gender}生</span><span class="chip">${c.cls}</span><span class="chip">♥ ${c.hp}</span>${tagChips(c)}</div>
      </div>
      <div class="cd-main">
        <div class="skillbox"><b>技能 ·「${c.skill}」（${c.cost} 费）</b><span>${fmtDesc(c.skillDesc)}</span></div>
        ${c.power ? `<div class="skillbox"><b>英雄技能 ·「${c.power.name}」（${c.power.cost} 费）</b><span>${fmtDesc(c.power.desc)}</span></div>` : ""}
        ${cb ? `<div class="skillbox gold"><b>组合技 ·「${c.combo}」</b><span>搭档法术 ${gotoBtn("spell", partner)} · 本局打出过配套法术、该角色在场时自动触发（每局一次）</span></div>` : ""}
        ${cb && cb.story ? `<div class="skillbox story"><b>「${c.combo}」的传说</b><span>${fmtDesc(cb.story)}</span></div>` : ""}
        ${storyBox(c)}
        ${c.art ? `<div class="skillbox"><b>图标设定（${hasIcon(c.name) ? "已绘制" : "待绘制"}）</b><span>${fmtDesc(c.art)}</span></div>` : ""}
        ${footer || ""}
      </div>`;
  } else if (kind === "spell") {
    const s = SPELLS[idx];
    const cb = COMBOS.find(x => x.name === s.combo);
    const partner = cb ? cb.need.find(n => n !== s.name) : "";
    return `
      <div class="cd-side">
        <div class="portrait"><span class="cost-gem">${s.cost}</span>${iconArt(s.name)}</div>
        <div class="nameplate">${s.name}</div>
        <div class="chips"><span class="chip">法术卡</span><span class="chip">${s.cost} 费</span>${tagChips(s)}</div>
      </div>
      <div class="cd-main">
        <div class="skillbox"><b>法术效果</b><span>${fmtDesc(s.effect)}</span></div>
        ${cb ? `<div class="skillbox gold"><b>组合技 ·「${s.combo}」</b><span>搭档角色 ${gotoBtn("role", partner)} · 本局打出过本卡 + 角色卡在场时自动触发（每局一次）</span></div>` : ""}
        ${cb && cb.story ? `<div class="skillbox story"><b>「${s.combo}」的传说</b><span>${fmtDesc(cb.story)}</span></div>` : ""}
        ${storyBox(s)}
        <div class="skillbox"><b>图标设定（${hasIcon(s.name) ? "已绘制" : "待绘制"}）</b><span>${fmtDesc(s.art)}</span></div>
        ${footer || ""}
      </div>`;
  } else {
    const c = COMBOS[idx];
    return `
      <div class="cd-side">
        <div class="portrait"><span class="cost-gem">${c.cost}</span>${iconArt(c.name)}</div>
        <div class="nameplate">${c.name}</div>
        <div class="chips"><span class="chip combo-chip">组合技卡</span><span class="chip">${c.cost} 费</span>${tagChips(c)}</div>
      </div>
      <div class="cd-main">
        <div class="combo-formula" style="margin:0 0 12px">${gotoBtn("role", c.need[0])}<i> + </i>${gotoBtn("spell", c.need[1])}<i> → </i>${c.name}</div>
        <div class="skillbox gold"><b>组合技效果</b><span>${fmtDesc(c.effect)}</span></div>
        ${storyBox(c)}
        <div class="skillbox"><b>图标设定（${hasIcon(c.name) ? "已绘制" : "待绘制"}）</b><span>${fmtDesc(c.art)}</span></div>
        ${footer || ""}
      </div>`;
  }
}
function openCardDetail(kind, idx) {
  if (!kindList[kind] || !kindList[kind][idx]) return;
  // 【v0.14】未收集卡:黑影呈现,不给效果/故事细节,只提示获取途径
  const cardObj = kindList[kind][idx];
  if (!isOwned(cardObj.name)) {
    const stage = CAMPAIGNS.find(s => s.rewards.includes(cardObj.name));
    const footer = `<div class="modal-actions"><button class="btn-gold" id="btn-card-close">关 闭</button></div>`;
    document.getElementById("card-detail-body").innerHTML = `
      <div class="cd-side">
        <div class="portrait"><div class="silhouette">${iconArt(cardObj.name)}</div></div>
        <div class="nameplate">? ? ?</div>
        <div class="chips"><span class="chip">未收集</span></div>
      </div>
      <div class="cd-main">
        <div class="skillbox"><b>尚未收集</b><span>${stage
          ? `通关 ${stage.id} 号关卡「${stage.name}」即可收集这张卡——图鉴的黑影将化为真容。`
          : "在闯关模式中收集这张卡。"}</span></div>
        <div class="skillbox story"><b>情报待解</b><span>收集进度与闯关进度会实时保存,联机对战开启后同样生效。</span></div>
        ${footer}
      </div>`;
    document.getElementById("modal-card").classList.remove("hidden");
    document.getElementById("btn-card-close").addEventListener("click", () =>
      document.getElementById("modal-card").classList.add("hidden"));
    return;
  }
  const footer = `<div class="modal-actions"><button class="btn-gold" id="btn-card-close">关 闭</button></div>`;
  document.getElementById("card-detail-body").innerHTML = cardDetailHtml(kind, idx, footer);
  document.getElementById("modal-card").classList.remove("hidden");
  document.getElementById("btn-card-close").addEventListener("click", () =>
    document.getElementById("modal-card").classList.add("hidden"));
}
grid.addEventListener("click", (e) => {
  const card = e.target.closest(".ccard");
  if (!card) return;
  openCardDetail(card.dataset.kind, +card.dataset.idx);
});
// 详情内跳转：点搭档名直接切换到那张卡的详情
document.getElementById("card-detail-body").addEventListener("click", (e) => {
  const g = e.target.closest("[data-goto]");
  if (!g) return;
  const parts = g.dataset.goto.split(":");
  Snd.play("ui");
  openCardDetail(parts[0], +parts[1]);
});

// ---------- 设置 ----------
const DEFAULT_SETTINGS = { music: 60, sfx: 80, anim: true, tip: true, musicOn: true, aiDiff: "normal" };
let settings = { ...DEFAULT_SETTINGS };
try {
  const saved = JSON.parse(localStorage.getItem("cl-settings"));
  if (saved) settings = { ...settings, ...saved };
} catch (e) { /* 忽略损坏的存档 */ }

const $ = (id) => document.getElementById(id);
// 音乐音量受总开关门控（v0.6）：开关关 = 实际音量 0，滑杆值保留
function applySndVolumes() { Snd.setVolumes(settings.musicOn === false ? 0 : settings.music, settings.sfx); }
function applySettings() {
  $("set-music").value = settings.music;  $("val-music").textContent = settings.music;
  $("set-sfx").value = settings.sfx;      $("val-sfx").textContent = settings.sfx;
  $("set-music-on").classList.toggle("on", settings.musicOn !== false);
  $("set-anim").classList.toggle("on", settings.anim);
  $("set-tip").classList.toggle("on", settings.tip);
  syncDiffRow(); // v0.10：AI 难度高亮与设置同步（恢复默认也会归位普通档）
}
function saveSettings() {
  try { localStorage.setItem("cl-settings", JSON.stringify(settings)); } catch (e) { /* 无痕模式等 */ }
}
applySettings();
applySndVolumes(); // 音效引擎读取设置音量（v0.4 起单一来源）

$("btn-settings-open").addEventListener("click", () => $("modal-settings").classList.remove("hidden"));
$("btn-settings-close").addEventListener("click", () => { saveSettings(); $("modal-settings").classList.add("hidden"); toast("设置已保存"); });
$("btn-settings-reset").addEventListener("click", () => { settings = { ...DEFAULT_SETTINGS }; applySettings(); saveSettings(); applySndVolumes(); toast("已恢复默认设置"); });
$("set-music").addEventListener("input", (e) => { settings.music = +e.target.value; $("val-music").textContent = e.target.value; applySndVolumes(); saveSettings(); }); // 【v0.21·深检修】即时落库:原先只有「确定」保存,Esc/点遮罩关闭会丢本会话的调整
$("set-sfx").addEventListener("input", (e) => { settings.sfx = +e.target.value; $("val-sfx").textContent = e.target.value; applySndVolumes(); saveSettings(); });
$("set-music-on").addEventListener("click", () => { settings.musicOn = settings.musicOn === false ? true : false; applySettings(); applySndVolumes(); saveSettings(); });
$("set-anim").addEventListener("click", () => { settings.anim = !settings.anim; applySettings(); saveSettings(); });
$("set-tip").addEventListener("click", () => { settings.tip = !settings.tip; applySettings(); saveSettings(); });

// 点击遮罩关闭弹窗
document.querySelectorAll(".modal-mask").forEach(m => {
  m.addEventListener("click", (e) => { if (e.target === m && m.id === "modal-settings") m.classList.add("hidden"); });
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    $("modal-settings").classList.add("hidden");
    $("modal-card").classList.add("hidden");
  }
  // 【v0.15】回放面板手感：↑↓ 滚动事件流、Esc 关闭（面板打开时优先于其它弹窗处理）
  const rp = document.querySelector(".replay-mask");
  if (rp) {
    if (e.key === "Escape") { rp.remove(); return; }
    const rb = rp.querySelector(".replay-body");
    if (rb && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
      e.preventDefault(); // 阻止页面本身跟着滚
      // 瞬时滚动（默认 auto）：smooth 依赖动画时钟，窗口被遮挡时会冻结（历批已踩坑），64px 行距瞬移观感也够好
      rb.scrollBy(0, e.key === "ArrowUp" ? -64 : 64);
    }
  }
});

// ---------- 战报浮层（v0.4）：本局事件流水，组合技 / 敌方行动可随时回看 ----------
let logOpen = false;
let replayLog = []; // 【v0.12】结构化事件流 {t, html, cls}：终局「回看本局」时间轴的数据源
// 【v0.22】回合快照流:每个玩家回合开始时抓一份战场摘要(双方 hp/法力/场上随从/手牌数),
// 回放面板点回合徽标可展开查看——「时间轴跳转回放画面」的轻量落地,数据结构为未来完整画面重建打底
let turnSnaps = [];
function snapTurn(side) {
  turnSnaps.push({
    t: turnNum, side,
    myHp: myHero.hp, myMana: myHero.mana, myMax: myHero.maxMana,
    enHp: enemyHero.hp, enMana: enemyHero.mana, enMax: enemyHero.maxMana,
    myBoard: myBoardData.filter(m => m.hp > 0).map(m => ({ n: m.name, a: m.atk, h: m.hp })),
    enBoard: enemyBoardData.filter(m => m.hp > 0).map(m => ({ n: m.name, a: m.atk, h: m.hp })),
    myHand: myHandData.length,
    enHand: battleMode === "duo" ? duoFoeHand.length : enemyHandData.length // 【v0.24·深检】双人真实手牌在 duoFoeHand
  });
  if (turnSnaps.length > 60) turnSnaps.shift(); // 与 replayLog 同口径防膨胀
}
function logEvent(text, cls) {
  const body = $("log-body");
  if (!body) return;
  // v0.6 双人模式：结算代码统一写「我方/敌方」（= 下方/上方），战报按当前座位翻译成英雄名
  if (battleMode === "duo") {
    text = text.replace(/我方/g, `「${myHero.name}」`).replace(/敌方/g, `「${enemyHero.name}」`);
  }
  replayLog.push({ t: turnNum, html: text, cls: cls || "" });
  if (replayLog.length > 300) replayLog.shift(); // 回放存全量（上限 300 条防极端内存膨胀）
  const line = document.createElement("p");
  line.className = "log-line" + (cls ? " " + cls : "");
  line.innerHTML = `<span class="lt">T${turnNum}</span>${text}`;
  body.appendChild(line);
  while (body.children.length > 30) body.removeChild(body.firstChild); // 实时浮层只留最近 30 条
  if (logOpen) body.scrollTop = body.scrollHeight;
}
// 【v0.12】回放时间轴：按回合分组渲染结构化事件流（终局面板「回看本局」/ 投降后也可看）
function openReplay() {
  document.querySelectorAll(".replay-mask").forEach(m => m.remove());
  const mask = document.createElement("div");
  mask.className = "replay-mask";
  const groups = [];
  replayLog.forEach(ev => {
    if (!groups.length || groups[groups.length - 1].t !== ev.t) groups.push({ t: ev.t, items: [] });
    groups[groups.length - 1].items.push(ev);
  });
  const body = groups.map(g => `
    <div class="rp-turn" data-t="${g.t}"><span class="rp-badge" data-t="${g.t}" title="点开本回合开始时的战场快照">T${g.t}</span>${turnSnaps.some(s => s.t === g.t) ? '<i class="rp-cam" title="有战场快照"></i>' : ''}</div>
    <div class="rp-snapview hidden" data-t="${g.t}"></div>
    ${g.items.map(ev => `<p class="log-line ${ev.cls}">${ev.html}</p>`).join("")}`).join("");
  mask.innerHTML = `
    <div class="replay-panel">
      <h4>回放 · 本局时间轴<button class="btn-logclose" data-act="close">×</button></h4>
      <div class="replay-body">${body || '<p class="log-line">本局还没有记录任何事件</p>'}</div>
      <div class="rp-foot">共 ${replayLog.length} 条事件 · ${groups.length} 个回合 · ↑↓ 滚动 · 点单条复制 · 点 T 徽标看战场快照</div>
    </div>`;
  mask.addEventListener("click", (e) => {
    if (e.target.closest("[data-act='close']") || e.target === mask) { mask.remove(); return; }
    // 【v0.22】点回合徽标:展开/收起该回合开始时的战场快照(同一回合双人各有快照时取最后一份=最近一次行动方)
    const badge = e.target.closest(".rp-badge");
    if (badge) {
      const t = +badge.dataset.t;
      const view = mask.querySelector(`.rp-snapview[data-t="${t}"]`);
      if (view) {
        if (view.classList.contains("hidden")) {
          const snaps = turnSnaps.filter(s => s.t === t);
          const s = snaps[snaps.length - 1];
          view.innerHTML = s ? snapHtml(s) : '<p class="log-line">本回合没有快照</p>';
          view.classList.remove("hidden");
        } else view.classList.add("hidden");
      }
      return;
    }
    // 【v0.15】复制单条：点任意事件行复制其文本（与「复制战报」同一兜底链）
    const ln = e.target.closest(".log-line");
    if (ln) {
      const txt = ln.textContent.replace(/\s+/g, " ").trim();
      const done = () => toast("已复制该条战报");
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(done).catch(() => fallbackCopy(txt, done));
      } else fallbackCopy(txt, done);
    }
  });
  document.getElementById("screen-battle").appendChild(mask);
  const rb = mask.querySelector(".replay-body");
  if (rb) rb.scrollTop = rb.scrollHeight; // 打开时定位到最新回合
}

// 【v0.22】快照渲染:双方英雄血量/法力 + 场上随从小牌 + 手牌数(轻量文字版,零图标依赖)
function snapHtml(s) {
  const chips = arr => arr.length
    ? arr.map(m => `<span class="sn-minion">${m.n} <b>${m.a}</b>/<i>${m.h}</i></span>`).join("")
    : '<span class="sn-empty">场上没有随从</span>';
  return `
  <div class="rp-snap">
    <div class="sn-row sn-en"><b class="sn-hp">敌方 ${s.enHp} 血</b><span class="sn-mana">${s.enMana}/${s.enMax}</span>${chips(s.enBoard)}<span class="sn-hand">手牌 ${s.enHand}</span></div>
    <div class="sn-row sn-me"><b class="sn-hp">我方 ${s.myHp} 血</b><span class="sn-mana">${s.myMana}/${s.myMax}</span>${chips(s.myBoard)}<span class="sn-hand">手牌 ${s.myHand}</span></div>
    <div class="sn-cap">${s.side === "enemy" ? "敌方回合开始时" : "我方回合开始时"}的战场</div>
  </div>`;
}
$("btn-log").addEventListener("click", () => {
  logOpen = !logOpen;
  $("battle-log").classList.toggle("hidden", !logOpen);
  $("btn-log").classList.toggle("on", logOpen);
  if (logOpen) { const b = $("log-body"); b.scrollTop = b.scrollHeight; }
  Snd.play("ui");
});
// 【v0.11】面板上的收纳（×）按钮：默认收起，点顶栏「战报」才展开
$("btn-logclose").addEventListener("click", () => {
  logOpen = false;
  $("battle-log").classList.add("hidden");
  $("btn-log").classList.remove("on");
  Snd.play("ui");
});
// v0.10 手感：一键复制战报全文（分享对局）；clipboard API 失败时走 execCommand 兜底
$("btn-copylog").addEventListener("click", () => {
  const lines = [...$("log-body").children].map(l => l.textContent.replace(/\s+/g, " ").trim());
  const head = `校园传说 · 战报\n「${myHero.name}」 vs 「${enemyHero.name}」 · ${turnNum} 回合${battleMode === "duo" ? " · 本地双人" : ""}`;
  const text = lines.length ? head + "\n" + lines.join("\n") : head + "\n（还没有任何事件）";
  const done = () => toast("战报已复制，去分享这局吧");
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
  } else fallbackCopy(text, done);
});

// ---------- 对战界面（随机牌库：初始手牌与每回合抽牌均随机） ----------
// v0.6 本地双人：myHero/enemyHero 等都是「下方 = 当前行动方」的引用，
// 双人模式在回合交接时整体交换（swapSeats），引擎其余部分无需感知视角
let enemyHero = { name: "欧阳汉子", cls: "狂战士 · 敌方", hp: 30, maxHp: 30, mana: 3, maxMana: 3, deck: 20,
  powerDef: CHARACTERS.find(c => c.name === "欧阳汉子").power, powerUsed: false };
let myHero    = { name: "成义荣",   cls: "战士 · 我方",   hp: 30, maxHp: 30, mana: 3, maxMana: 3, deck: 18,
  powerDef: CHARACTERS.find(c => c.name === "成义荣").power };

// 回合/技能/疲劳状态（提前声明：heroHtml 首次渲染时就要读）
let myTurn = true, turnNum = 1, battleOver = false;
let battleGen = 0;   // v0.10.1 对局代际号：每次 resetBattle +1，旧局的延时回调持旧代际即失效，防止投降/换局后旧队列打到新局状态上
let heroPowerUsed = false;          // 我方英雄技能本回合是否已用
let myFatigue = 0, enemyFatigue = 0; // 疲劳计数：牌库抽空后每抽一次 +1 并掉等量血
let enemyTurnCount = 0;             // 敌方回合序号（第一回合法力不涨，与我方对称）
let enemySpellsGame = new Set();    // v0.7：敌方本局打出过的法术（AI 组合技判定）
let enemyCombosDone = new Set();    // v0.7：敌方已触发的组合技（每局一次）

let enemyBoardData = [];   // 双方战场初始为空，随从靠打出手牌上场
let myBoardData = [];
const MAX_HAND = 8;        // 手牌上限，满时抽到的牌会被弃置
const SUITS = ["♠", "♥", "♣", "♦"]; // 三国杀式花色点数（纯装饰）
let myDeck = [];           // 已洗匀的牌库
let myHandData = [];
// v0.9 AI 真实手牌：单机敌方也用真实牌库与手牌（与双人架构对齐），
// AI 出牌从手牌里选、抽牌走真实疲劳/爆牌规则、窥牌翻的是真牌
let enemyDeckData = [];    // 敌方真实牌库（buildHeroDeck 生成）
let enemyHandData = [];    // 敌方真实手牌（牌背数 = 它的长度）

// v0.9 衍生物风味：幸运币 / 小狗 / 战械机甲 / 课桌图腾 的「一句话史料」，
// 首次召唤（或后手拿到幸运币）时进一次战报；findCard 查不到的卡由这里兜底
const TOKEN_FLAVOR = {
  "幸运币": "后勤处抽屉里永远数不清的备用硬币，正面是校徽，背面刻着一句歪歪扭扭的「好运」——先手的人用不上它，后手的人靠它翻盘。",
  "小狗": "流浪狗大队里军衔最低但出勤率最高的新兵，坐、握、握手三项全优。它叼来的东西里有十分之一是战利品。",
  "战械机甲": "王衡书桌下的六足机体，机身内侧用记号笔写着「放学别走」。启动音是三短一长的下课铃。",
  "课桌图腾": "从 1998 年服役至今的老课桌，桌面上层层叠叠刻着历届学生的名字。它不说话，但它什么都记得。",
  "杠铃": "体育部器材室的镇室之宝，重量铭牌早就磨没了。高大力管它叫「热身组」，其他人管它叫「遗物」。",
};
let flavorShown = new Set(); // 本局已播报过风味的衍生物（resetBattle 清零）

// ---------- v0.6 本地双人（同屏轮流） ----------
let battleMode = "ai";     // "ai" 单机对电脑 | "duo" 本地双人 | "campaign" 闯关(v0.14)
let battleCampaignStage = null; // 闯关对局进行中的关卡配置（endBattle 结算奖励用）
let duoPickPhase = 0;      // 选英雄阶段：0 非双人 / 1 一号位 / 2 二号位
const duoPicks = [null, null];
let duoFoeHand = [];       // 上方位玩家的真实手牌（双人模式）
let duoFoeDeck = [];       // 上方位玩家的牌库
let duoFoeSpells = new Set(); // 上方位本局打出过的法术（组合技判定）
let duoFoeCombos = new Set(); // 上方位已触发的组合技
let duoPlayerTurns = 0;    // 双人模式已行动的玩家回合总数（回合号 = 轮数）
// 双人模式的横幅用语：视角永远是「屏幕下方」，用英雄名代替我方/敌方
function turnLabel() { return battleMode === "duo" ? `「${myHero.name}」回合` : "我的回合"; }
function foeLabel()  { return battleMode === "duo" ? `「${enemyHero.name}」回合` : "敌方回合"; }

// 组牌库（v0.6 英雄风味）：全卡池各 ×1，所选英雄的角色卡与专属组合技法术再 +1
// → 23 张；英雄更容易抽到自己的组合技组件，选人即选打法
// 花色点数已在 makeHandCard 里随机指定
function buildHeroDeck(heroName) {
  const me = CHARACTERS.find(c => c.name === heroName);
  const owned = getOwnedSet(); // 【v0.14】牌库只含已收集的卡（基础卡 + 闯关收集卡）
  const names = [];
  CHARACTERS.forEach(c => {
    if (!owned.has(c.name)) return;
    names.push(c.name); if (me && c.name === me.name) names.push(c.name);
  });
  SPELLS.forEach(s => {
    if (!owned.has(s.name)) return;
    names.push(s.name); if (me && s.combo === me.combo) names.push(s.name);
  });
  const cards = names.map(n => makeHandCard(n));
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}
// 抽牌：牌库空则吃疲劳（递增掉血）；手牌满则弃置，同步牌库计数
// 顺序按炉石规则：疲劳判定优先于手牌满（满手牌不豁免疲劳）
function drawCards(n) {
  let drew = 0;
  for (let i = 0; i < n; i++) {
    if (!myDeck.length) {
      myFatigue += 1;
      Snd.play("fatigue");
      toast(`牌库已空 · 疲劳！英雄受到 ${myFatigue} 点伤害`);
      logEvent(`我方疲劳 -<b>${myFatigue}</b>`, "bad");
      damageHero("player", myFatigue);
      break;
    }
    if (myHandData.length >= MAX_HAND) {
      // v0.10.1：真实烧牌（与敌方 enemyDrawOne 对称）——原实现牌留在牌库但提示"已弃置"，双端资源规则漂移
      const burned = myDeck.pop();
      if (burned) {
        toast(`手牌已满，「${burned.name}」被烧掉`);
        logEvent(`我方爆牌 ·「<b>${burned.name}</b>」`, "bad");
        Snd.play("fatigue");
      }
      break;
    }
    myHandData.push(myDeck.pop());
    drew++;
  }
  if (drew) Snd.play("draw");
  myHero.deck = myDeck.length;
  renderPlayerHero();
  renderHand();
  fxQueueFit(); // 手牌数量变化后重算牌局缩放，防止行宽变化导致出屏
}
// 开局重置：洗牌、抽初始手牌、清空战场、随机先后手（后手获「幸运币」）
// v0.6：双人模式双方各建风味牌库、各抽 4 张；掷硬币定先手，交接遮罩防偷看
function resetBattle() {
  cancelAim(); cancelAttack();
  battleGen++; // 旧对局所有延时回调（AI 队列/死亡过滤/吹回等）持旧代际，就此作废
  document.querySelectorAll(".fx-end-mask,.fx-handoff-mask").forEach(m => m.remove());
  document.querySelectorAll(".fx-fly").forEach(g => g.remove()); // 清掉上一局可能卡住的幽灵卡
  battleOver = false;
  duoPlayerTurns = 0;
  const duo = battleMode === "duo";
  let bottomFirst = true; // 双人：掷硬币后下方玩家是否执先手
  myHandData = [];
  myBoardData = []; enemyBoardData = [];
  const meDef = CHARACTERS.find(c => c.name === myHero.name);
  const foeDef = CHARACTERS.find(c => c.name === enemyHero.name);
  Object.assign(myHero, { hp: meDef ? meDef.hp : 30, maxHp: meDef ? meDef.hp : 30, mana: 3, maxMana: 3, turnsTaken: 0 });
  Object.assign(enemyHero, { hp: foeDef ? foeDef.hp : 30, maxHp: foeDef ? foeDef.hp : 30, mana: 3, maxMana: 3, powerUsed: false, turnsTaken: 0 });
  if (duo) {
    myDeck = buildHeroDeck(myHero.name);
    duoFoeDeck = buildHeroDeck(enemyHero.name);
    duoFoeHand = []; duoFoeSpells = new Set(); duoFoeCombos = new Set();
    bottomFirst = Math.random() < 0.5; // 掷硬币
    if (!bottomFirst) swapSeats();     // 对方先手：先把视角换到对方（此时双方手牌都还是空，交换无副作用）
  } else {
    myDeck = buildHeroDeck(myHero.name);
    // v0.9：敌方也用真实风味牌库与真实手牌（AI 出牌从手牌里选）
    enemyDeckData = buildHeroDeck(enemyHero.name);
    enemyHandData = [];
    for (let i = 0; i < 4 && enemyDeckData.length; i++) enemyHandData.push(enemyDeckData.pop());
  }
  myHero.deck = myDeck.length;
  enemyHero.deck = duo ? duoFoeDeck.length : enemyDeckData.length;
  spellsPlayedGame.clear(); comboTriggered.clear();
  duoFoeSpells.clear(); duoFoeCombos.clear(); // v0.10.1：双人换位(swapSeats)发生在上方，clear 落在 swap 之后 → 必须把换到对方手里的旧 Set 也清掉，否则 50% 概率污染新局
  enemySpellsGame.clear(); enemyCombosDone.clear(); // v0.7：敌方组合技状态
  battleCombos = [];                                // v0.8：终局回顾清零
  flavorShown = new Set();                          // v0.9：衍生物风味播报清零
  heroPowerUsed = false; myFatigue = 0; enemyFatigue = 0; enemyTurnCount = 0;
  turnNum = 1; myTurn = true;
  $("turn-num").textContent = "1";
  btnEnd.disabled = false;
  banner.textContent = turnLabel(); banner.classList.remove("enemy");
  // 开局双方战场为空；敌方随从在其回合逐步上场
  drawCards(4); // 双人模式下为（可能的新）下方玩家抽初始手牌
  myHero.deck = myDeck.length;
  if (duo) {
    for (let i = 0; i < 4 && duoFoeDeck.length; i++) duoFoeHand.push(duoFoeDeck.pop()); // 上方玩家也抽初始 4 张（交换后从自己的牌库抽）
    enemyHero.deck = duoFoeDeck.length;
    myHero.turnsTaken = 1; // 双人：下方先手的首回合不走 startPlayerTurn，这里补记已行动一次（第二回合法力才 +1）
  }
  renderPlayerHero(); renderEnemyHero(); renderEnemyBoard(); renderPlayerBoard();
  renderEnemyHandRow();
  // 先后手掷硬币：后手方补偿一张「幸运币」，且让对方先行动一整轮
  const lb = $("log-body"); if (lb) lb.innerHTML = ""; // 新一局清空战报
  replayLog = []; // 【v0.12】回放事件流同步清零
  turnSnaps = []; // 【v0.22】回合快照同步清零
  const fgWide = document.querySelector(".fx-floorgrid.wide"); // 【v0.23】终局伪广角态复位
  if (fgWide) fgWide.classList.remove("wide");
  logEvent("对局开始 · 我方 vs 敌方", "gold"); // 双人模式由 logEvent 的座位翻译代出英雄名(别在这里写死名字,会翻两次)
  updateTension(); // 新局重置 BGM 情绪（v0.5）
  Snd.play("gameStart"); // 【v0.11】开局号角
  if (duo) {
    duoFoeHand.push(makeCoinCard()); // 后手方（此刻在上方）获得幸运币
    renderEnemyHandRow();
    logEvent(`「${myHero.name}」先手 · 「${enemyHero.name}」得幸运币`, "gold");
    snapTurn("me"); // 【v0.24·深检】开局回合不经过 startPlayerTurn——双人 P1 的 T1 快照在这里补
    duoHandoff(true); // 双人开局固定弹交接遮罩：明确此刻该谁操作，防偷看
    return;
  }
  if (Math.random() < 0.5) { // 我方先手 → 敌方执后手：v0.9 起 AI 也拿幸运币（规则对称）
    enemyHandData.push(makeCoinCard());
    renderEnemyHandRow();
    logEvent("你先手 · 敌方得幸运币", "gold");
    logTokenFlavor("幸运币");
    snapTurn("me"); // 【v0.24·深检】同上:单机我方先手的 T1 快照原先整局缺失
    return;
  }
  myHandData.push(makeCoinCard());
  renderHand();
  logEvent("你后手 · 得幸运币", "gold");
  logTokenFlavor("幸运币");
  toast("你执后手 · 获得一张「幸运币」");
  myTurn = false; btnEnd.disabled = true;
  banner.textContent = foeLabel(); banner.classList.add("enemy");
  Snd.play("enemyTurn");
  const gen = battleGen; // v0.10.1：开局敌方先手的延时启动也持代际，投降换局后不再触发
  setTimeout(() => { if (!battleOver && gen === battleGen) runEnemyTurn(() => startPlayerTurn(false)); }, 800);
}

// 敌方手牌行：v0.9 起单机/双人都是真实手牌数（单机 = enemyHandData，双人 = duoFoeHand）
function renderEnemyHandRow() {
  const n = battleMode === "duo" ? Math.max(0, duoFoeHand.length) : enemyHandData.length;
  $("enemy-hand").innerHTML = `<div class="card-back"></div>`.repeat(n);
  // v0.10 手感：悬停牌背行显示真实手牌/牌库数（CSS tooltip 读 data-tip，每次渲染同步）
  $("enemy-hand").dataset.tip = battleMode === "duo"
    ? `「${enemyHero.name}」手牌 ${n} 张 · 牌库 ${duoFoeDeck.length} 张`
    : `敌方手牌 ${n} 张 · 牌库 ${enemyDeckData.length} 张`;
}

// 【v0.23】触屏兜底:敌方手牌 tooltip 依赖 :hover,触屏没有悬停——点牌背行用 toast 报同样的信息
// (桌面点击也生效,无害:桌上这是唯一的信息动作,不与任何出牌/瞄准冲突)
$("enemy-hand").addEventListener("click", () => {
  if (!battleOver) toast($("enemy-hand").dataset.tip || "");
});

// v0.6 双人座位交换：把「下方 = 当前行动方」的全部状态整体对调，引擎无感
function swapSeats() {
  [myHero, enemyHero] = [enemyHero, myHero];
  [myBoardData, enemyBoardData] = [enemyBoardData, myBoardData];
  [myHandData, duoFoeHand] = [duoFoeHand, myHandData];
  [myDeck, duoFoeDeck] = [duoFoeDeck, myDeck];
  [myFatigue, enemyFatigue] = [enemyFatigue, myFatigue];
  [spellsPlayedGame, duoFoeSpells] = [duoFoeSpells, spellsPlayedGame];
  [comboTriggered, duoFoeCombos] = [duoFoeCombos, comboTriggered];
  heroPowerUsed = false;
  renderPlayerHero(); renderEnemyHero(); renderPlayerBoard(); renderEnemyBoard(); renderHand();
  renderEnemyHandRow();
  fxQueueFit(); // v0.10.1：换座后手牌数可能大变，重算牌局缩放防出屏
}

// v0.6 双人回合交接遮罩：isStart = 开局首手交接（文案不同）；确认后座位互换并进入新回合
// v0.7 交接概要：双方血量 / 随从 / 手牌数（不展示手牌内容，无偷看风险）
function duoHandoffSummary() {
  return `
    <div class="handoff-summary">
      <span class="hs-side"><b>${myHero.name}</b><i>${myHero.hp} 血 · 随从 ${myBoardData.length} · 手牌 ${myHandData.length}</i></span>
      <span class="hs-vs">VS</span>
      <span class="hs-side"><b>${enemyHero.name}</b><i>${enemyHero.hp} 血 · 随从 ${enemyBoardData.length} · 手牌 ${duoFoeHand.length}</i></span>
    </div>`;
}
function duoHandoff(isStart) {
  const mask = document.createElement("div");
  mask.className = "fx-end-mask handoff";
  mask.innerHTML = `
    <div class="fx-end-panel">
      <b>${isStart ? "「" + myHero.name + "」执先手" : "回合结束"}</b>
      <span>${isStart ? "请把设备交给先手玩家，准备开始" : "请把设备交给「" + enemyHero.name + "」"}</span>
      ${duoHandoffSummary()}
      <div class="fx-end-actions">
        <button class="btn-gold" data-act="go">${isStart ? "开 始 对 局" : "我 已 就 座"}</button>
      </div>
    </div>`;
  mask.addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]");
    if (!b) return;
    mask.remove();
    if (!isStart) { swapSeats(); startPlayerTurn(true); }
  });
  document.getElementById("screen-battle").appendChild(mask);
}

// 英雄技能当前是否有合法目标（决定按钮是否亮起）
function powerHasTarget(p) {
  if (!p.target) return true;
  if (p.target === "allyMinion") return myBoardData.some(m => m.hp > 0);
  if (p.target === "enemyMinion") return enemyBoardData.some(m => m.hp > 0);
  if (p.target === "enemyAny") return true; // 敌方英雄永远是合法目标
  return true;
}
function heroHtml(h) {
  const isEnemy = h === enemyHero;
  const p = h.powerDef;
  let powerBox = "";
  if (p) {
    const used = isEnemy ? h.powerUsed : heroPowerUsed;
    const usable = !used && !isEnemy && myTurn && !battleOver
      && myHero.mana >= p.cost && powerHasTarget(p);
    powerBox = `
    <div class="power-wrap" title="英雄技能「${p.name}」（${p.cost} 费）：${p.desc}">
      <button class="power-btn${used ? " used" : ""}${usable ? " usable" : ""}${isEnemy ? " enemy" : ""}"${isEnemy ? " disabled" : ""}>
        <span class="p-cost">${p.cost}</span><span class="p-key">技</span>
      </button>
      <span class="p-name">${p.name}</span>
      <div class="p-tip"><b>英雄技能 ·「${p.name}」（${p.cost} 费）</b><span>${p.desc}</span><em>${used ? "本回合已使用" : isEnemy ? "对方英雄技能" : "每回合限一次"}</em></div>
    </div>`;
  }
  return `
    <div class="deck-pile"><div class="card-back-mini"></div><div class="deck-txt"><span class="deck-label">牌库</span><span class="deck-count">${h.deck}</span></div></div>
    <div class="hero-card">
      ${avatarImg("avatar")}
      <div class="hero-info"><b>${h.name}</b><span>${h.cls}</span></div>
      <div class="hp-badge">${h.hp}</div>
    </div>
    ${powerBox}
    <div class="mana-wrap">
      <div class="mana-crystals">${
        Array.from({ length: h.maxMana }, (_, i) => `<span class="crystal${i < h.mana ? " filled" : ""}"></span>`).join("")
      }</div>
      <span class="mana-text">法力 ${h.mana}/${h.maxMana}</span>
    </div>`;
}
function renderPlayerHero() { $("player-hero").innerHTML = heroHtml(myHero); }
function renderEnemyHero()  { $("enemy-hero").innerHTML = heroHtml(enemyHero); }

function minionHtml(m) {
  const art = m.icon && hasIcon(m.icon) ? `<div class="icon-art">${window.CARD_ICONS[m.icon]}</div>` : avatarImg("");
  return `
    <div class="minion${m.canAttack ? " can-attack" : ""}${m.locked ? " locked" : ""}${m.taunt ? " taunt" : ""}">
      ${art}
      ${m.taunt ? `<span class="taunt-shield" title="嘲讽：敌方必须先攻击它"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2 L20.5 5.2 V11 C20.5 16.6 16.9 20.6 12 22.2 C7.1 20.6 3.5 16.6 3.5 11 V5.2 Z" fill="#a8c8f0" stroke="#1c3a74" stroke-width="1.4"/><path d="M12 5.4 L17.4 7.5 V11 C17.4 15 14.8 18 12 19.3 C9.2 18 6.6 15 6.6 11 V7.5 Z" fill="#4f80d8"/><path d="M12 7.8 V16.4 M8.6 12 H15.4" stroke="#dcebff" stroke-width="1.6" stroke-linecap="round"/></svg></span>` : ""}
      <div class="m-name">${m.name}</div>
      <span class="stat-badge atk">${m.atk}</span>
      <span class="stat-badge hp">${m.hp}</span>
    </div>`;
}
function renderEnemyBoard() { $("enemy-board").innerHTML = enemyBoardData.map(minionHtml).join(""); }
function renderPlayerBoard() { $("player-board").innerHTML = myBoardData.map(minionHtml).join(""); }

function renderHand() {
  // 静置态只显示 费用/花色/图标/卡名，详细效果点开介绍再看（避免拥挤）
  $("player-hand").innerHTML = myHandData.map((c, i) => {
    const red = c.suit === "♥" || c.suit === "♦";
    return `
    <div class="card-inhand ${c.type}${c.collect ? " collect" : ""}" data-idx="${i}">
      <span class="cost-gem${c.cost > myHero.mana ? " unaffordable" : ""}">${c.cost}</span>
      <span class="suit-gem${red ? " red" : ""}">${c.suit}${c.num}</span>
      ${iconArt(c.icon)}
      <div class="c-name">${c.name}</div>
    </div>`}).join("");
}

renderEnemyHero(); renderPlayerHero();
renderEnemyBoard(); renderPlayerBoard(); renderHand();

// 敌方手牌：4 张卡背，平铺散开
$("enemy-hand").innerHTML = `<div class="card-back"></div>`.repeat(4);

// ==========================================================
// 打出手牌：无目标牌直接结算；指向牌进入「瞄准态」点选目标
// ==========================================================
let aiming = null;                        // 当前瞄准中的牌 { idx, el, card }
let spellsPlayedGame = new Set();         // 本局打出过的法术（v0.5 组合技判定：不再要求同回合）；双人模式下随座位交换
let comboTriggered = new Set();           // 已触发过的组合技（每局一次）；双人模式下随座位交换
let battleCombos = [];                    // v0.8 终局回顾：本局触发过的组合技 {hero, combo}（按英雄记名、不参与座位交换）

// 点击手牌：弹出卡牌介绍（参考三国杀卡牌：卡名 + 花色点数 + 效果说明）
// v0.8 长按预览：按住 480ms 直接弹出同一个介绍弹窗（桌面按住不动 / 触屏长按），
// 触发后随后的 click 被吞掉，不会二次弹窗
$("player-hand").addEventListener("click", (e) => {
  if (longPressed) { longPressed = false; return; }
  if (aiming) { cancelAim(); return; }    // 瞄准中点手牌 = 取消
  if (attacking) { cancelAttack(); return; } // 攻击选择中点手牌 = 取消
  const el = e.target.closest(".card-inhand");
  if (!el) return;
  if (!myTurn || battleOver) { toast("敌方回合，无法出牌"); return; }
  showHandIntro(+el.dataset.idx, el);
});
let pressTimer = 0, pressStart = null, longPressed = false;
// 【v0.12】长按大图浮层：免按钮、松手即散——快捷看卡面大图与一句效果
function showPeek(idx, el) {
  hidePeek();
  const c = myHandData[idx];
  if (!c) return;
  const red = c.suit === "♥" || c.suit === "♦";
  const desc = c.type === "spell" ? c.text : `「${c.spawn.keyword}」${c.spawn.text}`;
  const peek = document.createElement("div");
  peek.className = "fx-peek";
  peek.id = "fx-peek";
  peek.innerHTML = `
    <div class="pk-card${c.type === "spell" ? " spell" : ""}">
      <span class="cost-gem">${c.cost}</span>
      ${iconArt(c.icon)}
      <div class="pk-name">${c.name}</div>
      ${c.type === "minion"
        ? `<div class="pk-stats"><span class="a">攻 ${c.atk}</span><span class="h">血 ${c.hp}</span></div>`
        : `<div class="pk-stats"><span${red ? ' class="red"' : ""}>${c.suit}${c.num}</span></div>`}
      <div class="pk-desc">${fmtDesc(desc)}</div>
    </div>`;
  const r = el.getBoundingClientRect();
  peek.style.left = Math.max(10, Math.min(innerWidth - 250, r.left + r.width / 2 - 115)) + "px";
  peek.style.top = Math.max(10, r.top - 206) + "px"; // 手牌贴底,大图向上弹出
  document.body.appendChild(peek);
  Snd.play("ui");
}
function hidePeek() {
  const p = document.getElementById("fx-peek");
  if (p) p.remove();
}
$("player-hand").addEventListener("pointerdown", (e) => {
  const el = e.target.closest(".card-inhand");
  if (!el || aiming || attacking) return; // 瞄准/攻击态不抢手势
  pressStart = { x: e.clientX, y: e.clientY, idx: +el.dataset.idx, el };
  clearTimeout(pressTimer);
  pressTimer = setTimeout(() => {
    longPressed = true;
    if (!myTurn || battleOver) return;
    showPeek(pressStart.idx, pressStart.el);
  }, 480);
});
["pointerup", "pointercancel", "pointerleave"].forEach(ev =>
  $("player-hand").addEventListener(ev, (e) => {
    clearTimeout(pressTimer); pressStart = null;
    hidePeek(); // 松手即散——免按钮浮层的核心交互
    // 【v0.21·深检修】pointerleave/pointercancel 复位吞击标志:长按出预览后拖离手牌区再松手,
    // click 不会落到卡上,longPressed 残留 true 会吞掉下一次真点击(首次无反应)
    // (pointerup 不复位——松手在卡上时随后的 click 靠它吞掉,这是 v0.8 的设计)
    if (ev !== "pointerup") longPressed = false;
  }));
$("player-hand").addEventListener("pointermove", (e) => {
  if (!pressStart) return;
  if (Math.hypot(e.clientX - pressStart.x, e.clientY - pressStart.y) > 8) { clearTimeout(pressTimer); hidePeek(); }
});
// 触屏长按会带出系统菜单/选中，手牌上屏蔽掉
$("player-hand").addEventListener("contextmenu", (e) => {
  if (e.target.closest(".card-inhand")) e.preventDefault();
});

// 手牌介绍弹窗：确认「打出」后才真正出牌
function showHandIntro(idx, el) {
  const c = myHandData[idx];
  if (!c) return;
  const targetReq = (c.cast && c.cast.target) || (c.spawn && c.spawn.target);
  const targetRow = targetReq === "allyMinion" ? myBoardData : enemyBoardData;
  const noTarget = !!targetReq && targetRow.length === 0;
  const boardFull = c.type === "minion" && myBoardData.length >= 6;
  const playable = myTurn && c.cost <= myHero.mana && !boardFull && !(c.type === "spell" && noTarget);
  const why = !myTurn ? "敌方回合，无法出牌"
    : c.cost > myHero.mana ? "法力不足"
    : boardFull ? "战场已满（最多 6 个随从）"
    : noTarget ? "场上没有可选的目标" : "";
  const kindName = c.type === "spell" ? "法术" : "随从";
  const desc = c.type === "spell" ? c.text : `「${c.spawn.keyword}」${c.spawn.text}`;
  const red = c.suit === "♥" || c.suit === "♦";
  const def = findCard(c.name); // v0.8：风味故事；v0.9 幸运币这类不在图鉴里的卡读自身 story
  const story = (def && def.story) || c.story;
  $("card-detail-body").innerHTML = `
    <div class="cd-side">
      <div class="portrait"><span class="cost-gem">${c.cost}</span>${iconArt(c.icon)}</div>
      <div class="nameplate">「${c.name}」</div>
      <div class="chips"><span class="chip">${kindName}卡 · ${c.cost} 费</span>${c.type === "minion" ? `<span class="chip">攻击 ${c.atk}</span><span class="chip">生命 ${c.hp}</span>` : `<span class="chip${red ? " red" : ""}">${c.suit}${c.num}</span>`}</div>
    </div>
    <div class="cd-main">
      <div class="skillbox"><b>卡牌效果</b><span>${fmtDesc(desc)}</span></div>
      ${c.combo ? `<div class="skillbox gold"><b>组合技 ·「${c.combo}」</b><span>本局打出过配套法术、该角色在场时自动触发（每局一次）</span></div>` : ""}
      ${story ? `<div class="skillbox story"><b>风味故事</b><span>${fmtDesc(story)}</span></div>` : ""}
      <div class="modal-actions">
        <button class="btn-gold" id="btn-intro-play" ${playable ? "" : "disabled"}>打 出</button>
        <button class="btn-plain" id="btn-intro-cancel">取 消</button>
      </div>
      ${playable ? "" : `<p class="hint" style="text-align:center">${why}</p>`}
    </div>`;
  $("modal-card").classList.remove("hidden");
  $("btn-intro-cancel").addEventListener("click", () => $("modal-card").classList.add("hidden"));
  $("btn-intro-play").addEventListener("click", () => {
    if (!playable) return;
    $("modal-card").classList.add("hidden");
    // 延迟到本次点击事件完全冒泡结束后再进入瞄准态，
    // 避免同一事件触发的全局取消逻辑把瞄准立刻撤掉
    setTimeout(() => commitFromHand(idx, el), 0);
  });
}

// 介绍弹窗里的「打出」确认后，走正常出牌流程
function commitFromHand(idx, el) {
  const card = myHandData[idx];
  if (!card || !myTurn) return;
  if (card.cost > myHero.mana) { toast("法力不足！"); return; }
  if (card.type === "minion" && myBoardData.length >= 6) { toast("战场已满（最多 6 个随从）"); return; }
  const targetReq = (card.cast && card.cast.target) || (card.spawn && card.spawn.target);
  if (targetReq) { startAim(idx, el, card); return; } // 指向牌：进入瞄准态
  commitPlay(idx, el, card, null);                    // 无目标：直接结算
}

// ---------- 表情嘲讽与聊天 ----------
const EMOTES = ["你好呀！", "哈哈！", "打得不错！", "要输了哦～", "抱歉抱歉！", "看我的厉害！"];
function heroBubble(text, ms) {
  const b = document.getElementById("hero-bubble");
  if (!b) return;
  b.textContent = text;
  b.classList.remove("hidden");
  clearTimeout(b._t);
  b._t = setTimeout(() => b.classList.add("hidden"), ms || 2200);
}
$("emote-panel").innerHTML = EMOTES.map((t, i) => `<button class="emote-item" data-i="${i}">${t}</button>`).join("");
$("btn-emote").addEventListener("click", () => $("emote-panel").classList.toggle("hidden"));
$("emote-panel").addEventListener("click", (e) => {
  const b = e.target.closest(".emote-item");
  if (!b) return;
  heroBubble(EMOTES[+b.dataset.i], 2400);
  $("emote-panel").classList.add("hidden");
});
$("btn-chat").addEventListener("click", () => {
  $("chat-bar").classList.toggle("hidden");
  if (!$("chat-bar").classList.contains("hidden")) $("chat-input").focus();
});
function sendChat() {
  const inp = $("chat-input");
  const t = inp.value.trim();
  if (!t) return;
  heroBubble(t, 3200);
  inp.value = "";
  $("chat-bar").classList.add("hidden");
}
$("btn-chat-send").addEventListener("click", sendChat);
$("chat-input").addEventListener("keydown", (e) => { if (e.key === "Enter") sendChat(); });

// —— 瞄准态：可选目标高亮呼吸，点目标结算，点空白取消 ——
function startAim(idx, el, card) {
  const t = (card.cast && card.cast.target) || (card.spawn && card.spawn.target);
  const side = t === "allyMinion" ? "player" : "enemy";
  const row = document.getElementById(side + "-board");
  if (!row.children.length) {
    // 法术没有目标就不能结算 → 不出牌（不扣费不弃牌）；随从则照常上场，登场效果落空
    if (card.type === "spell") { toast("场上没有可选的目标"); return; }
    commitPlay(idx, el, card, null);
    return;
  }
  aiming = { mode: "card", idx, el, card };
  el.classList.add("fx-aiming");
  row.classList.add("aiming");
  [...row.children].forEach(m => m.classList.add("targetable"));
  banner.textContent = "选择一个目标（点空白处取消）";
}
// 英雄技能瞄准：按技能 target 决定高亮哪一侧（allyMinion 高亮我方场，其余高亮敌方场；
// enemyAny 类技能同时高亮敌方英雄）
function startPowerAim(p) {
  clearAimVisual(); // 先清掉可能残留的卡牌瞄准高亮
  const ally = p.target === "allyMinion";
  aiming = { mode: "power", power: p, allowHero: p.target === "enemyAny", side: ally ? "player" : "enemy" };
  const row = document.getElementById((ally ? "player" : "enemy") + "-board");
  const data = ally ? myBoardData : enemyBoardData;
  [...row.children].forEach((m, i) => {
    if (data[i] && data[i].hp > 0) m.classList.add("targetable");
  });
  if (aiming.allowHero) {
    const hc = document.querySelector("#enemy-hero .hero-card");
    if (hc) hc.classList.add("targetable");
  }
  banner.textContent = "选择英雄技能目标（点空白处取消）";
}
function aimTargetSide() {
  if (!aiming) return "enemy";
  return ((aiming.card.cast && aiming.card.cast.target) || (aiming.card.spawn && aiming.card.spawn.target)) === "allyMinion" ? "player" : "enemy";
}
function clearAimVisual() {
  document.querySelectorAll(".minion.targetable").forEach(m => m.classList.remove("targetable"));
  document.querySelectorAll(".board-row.aiming").forEach(b => b.classList.remove("aiming"));
  document.querySelectorAll(".player-hand .fx-aiming").forEach(c => c.classList.remove("fx-aiming"));
  document.querySelectorAll(".hero-card.targetable").forEach(h => h.classList.remove("targetable"));
}
function cancelAim() {
  if (!aiming) return;
  clearAimVisual();
  aiming = null;
  banner.textContent = turnLabel();
}

// 点击场上随从：英雄技能瞄准 → 法术瞄准 → 攻击选择 → 发起攻击
function onBoardClick(side, e) {
  const m = e.target.closest(".minion");
  if (aiming) {
    if (aiming.mode === "power") {
      if (side !== (aiming.side || "enemy")) { cancelAim(); return; }
      if (!m || !m.classList.contains("targetable")) { cancelAim(); return; }
      const idx = [...m.parentElement.children].indexOf(m);
      const power = aiming.power, aimSide = aiming.side || "enemy";
      clearAimVisual(); aiming = null;
      banner.textContent = turnLabel();
      commitPower(power, { side: aimSide, idx });
      return;
    }
    if (aimTargetSide() !== side) return;
    if (!m || !m.classList.contains("targetable")) { cancelAim(); return; }
    const idx = [...m.parentElement.children].indexOf(m);
    const { card, el, idx: handIdx } = aiming;
    clearAimVisual();
    aiming = null;
    banner.textContent = turnLabel();
    commitPlay(handIdx, el, card, { side, idx });
    return;
  }
  if (attacking) {
    // 攻击选择中：点敌方随从 = 攻击它（嘲讽在场时只能点嘲讽）；点自己的随从 = 换一个发起者
    if (side === "enemy" && m) {
      if (!m.classList.contains("targetable")) { toast("敌方有嘲讽随从，必须先攻击它！"); return; }
      const idx = [...m.parentElement.children].indexOf(m);
      resolveAttack(attacking.idx, { type: "minion", idx });
      return;
    }
    if (side === "player") cancelAttack(); // 落到下方逻辑重新选择
    else return;
  }
  // 平时点自己的随从：绿框（可攻击）→ 发起攻击
  if (side === "player" && m && myTurn && !battleOver) {
    const idx = [...m.parentElement.children].indexOf(m);
    const data = myBoardData[idx];
    if (data && data.canAttack && !data.locked && data.atk > 0) startAttack(idx);
  }
}
$("enemy-board").addEventListener("click", (e) => onBoardClick("enemy", e));
$("player-board").addEventListener("click", (e) => onBoardClick("player", e));
// 点敌方英雄：英雄技能瞄准中 → 技能打脸；攻击选择中 → 直接打脸
$("enemy-hero").addEventListener("click", () => {
  if (aiming && aiming.mode === "power") {
    if (!aiming.allowHero) return;
    const power = aiming.power;
    clearAimVisual(); aiming = null;
    banner.textContent = turnLabel();
    commitPower(power, { type: "hero" });
    return;
  }
  if (attacking && !battleOver) resolveAttack(attacking.idx, { type: "hero" });
});
// 点战场空白处取消瞄准 / 取消攻击
document.addEventListener("click", (e) => {
  if (aiming) {
    if (e.target.closest(".minion.targetable") || e.target.closest(".player-hand") || e.target.closest(".board-row")) return;
    cancelAim();
    toast("已取消");
  } else if (attacking) {
    if (e.target.closest(".minion.targetable") || e.target.closest("#enemy-hero") || e.target.closest(".board-row")) return;
    cancelAttack();
  }
});

// ==========================================================
// 随从攻击：点绿框随从发起 → 点敌方随从或敌方英雄结算
// ==========================================================
let attacking = null;               // { idx } 发起攻击的我方随从
function startAttack(idx) {
  cancelAttack();
  attacking = { idx };
  const el = $("player-board").children[idx];
  if (el) el.classList.add("attacking");
  // 嘲讽规则：敌方场上有嘲讽随从时，只有嘲讽随从（和它们的死忠）能被指定
  const taunts = [];
  [...$("enemy-board").children].forEach((m, i) => {
    if (enemyBoardData[i] && enemyBoardData[i].taunt && enemyBoardData[i].hp > 0) {
      m.classList.add("targetable");
      taunts.push(m);
    }
  });
  const heroCard = document.querySelector("#enemy-hero .hero-card");
  if (taunts.length) {
    banner.textContent = "敌方有嘲讽随从，必须先攻击它！";
    return;
  }
  [...$("enemy-board").children].forEach((m, i) => {
    if (enemyBoardData[i] && enemyBoardData[i].hp > 0) m.classList.add("targetable"); // v0.10.1：垂死随从不可被指定
  });
  if (heroCard) heroCard.classList.add("targetable");
  banner.textContent = "选择攻击目标（点空白处取消）";
}
function clearAttackVisual() {
  document.querySelectorAll(".minion.attacking").forEach(m => m.classList.remove("attacking"));
  document.querySelectorAll(".minion.targetable").forEach(m => m.classList.remove("targetable"));
  document.querySelectorAll(".hero-card.targetable").forEach(h => h.classList.remove("targetable"));
}
function cancelAttack() {
  if (!attacking) return;
  clearAttackVisual();
  attacking = null;
  banner.textContent = turnLabel();
}

// 攻击结算：冲锋动画只做装饰，逻辑立即落地；嘲讽在场时打脸/打非嘲讽目标直接拒绝
function resolveAttack(fromIdx, target) {
  const atk = myBoardData[fromIdx];
  if (!atk || battleOver) return;
  const hasTaunt = enemyBoardData.some(x => x.taunt && x.hp > 0);
  if (hasTaunt && (target.type === "hero" || !enemyBoardData[target.idx] || !enemyBoardData[target.idx].taunt)) {
    toast("敌方有嘲讽随从，必须先攻击它！"); // 不消耗攻击权，保持选择状态
    return;
  }
  // v0.10.1：先验目标、后扣攻击权——目标在 380ms 死亡窗口里消失/已死时直接取消，
  // 不再出现"点了个垂死随从、攻击权被白没收"
  if (target.type === "minion") {
    const pre = enemyBoardData[target.idx];
    if (!pre || pre.hp <= 0) {
      toast("目标已消失");
      clearAttackVisual();
      attacking = null;
      banner.textContent = turnLabel();
      return;
    }
  }
  clearAttackVisual();
  attacking = null;
  atk.canAttack = false;
  const atkEl = $("player-board").children[fromIdx];
  if (atkEl) atkEl.classList.remove("can-attack");
  banner.textContent = turnLabel();
  if (target.type === "hero") {
    Snd.play("attack");
    lungeAnim(atkEl, document.querySelector("#enemy-hero .hero-card"), "me");
    damageHero("enemy", atk.atk);
    return;
  }
  const def = enemyBoardData[target.idx];
  if (!def) return;
  Snd.play("attack");
  lungeAnim(atkEl, $("enemy-board").children[target.idx], "me");
  damageMinion("enemy", target.idx, atk.atk);
  const back = def.atk; // 反击伤害先记下，防守方可能当场死亡
  if (back > 0) {
    // 【v0.21·深检修】延时反击持对象引用+代际快照(照抄 bounceEnemyMinion 模式):
    // 原先持位置索引且不校验 battleGen——200ms 内换局/数组重排会打到错的目标或新对局
    const gen = battleGen;
    const attackerRef = myBoardData[fromIdx];
    setTimeout(() => {
      if (gen !== battleGen || !attackerRef) return;
      const i = myBoardData.indexOf(attackerRef);
      if (i >= 0 && attackerRef.hp > 0) damageMinion("player", i, back);
    }, 200);
  }
}

// 冲锋：向目标方向突进再弹回（WAAPI，失败静默跳过，绝不阻塞结算）
// 【v0.15】side ∈ me/enemy：拖尾与命中星按攻击方阵营分色（我方金/敌方红，武打编排色编码律）
// 【v0.16】三段式（武打编排·art-design 十七节）：蓄力讲清楚（反向后缩 12% 压半拍持帧）→
// 冲进（62% 顶点 + 双残影涂抹）→ 收势（缓落回位）；总时长 600ms = 150/150/300 拍值
function lungeAnim(el, targetEl, side) {
  if (!fxAnimEnabled() || fxReduceMotion.matches || !el || !targetEl) return;
  try {
    const a = el.getBoundingClientRect(), b = targetEl.getBoundingClientRect();
    const cx1 = a.left + a.width / 2, cy1 = a.top + a.height / 2;
    const cx2 = b.left + b.width / 2, cy2 = b.top + b.height / 2;
    attackTrail(cx1, cy1, cx2, cy2, side === "enemy" ? "enemy" : "me"); // 金/红拖尾 + 命中锯齿星
    const dx = cx2 - cx1, dy = cy2 - cy1;
    el.animate([
      { transform: "translate(0, 0) scale(1)", offset: 0 },
      { transform: `translate(${-dx * 0.12}px, ${-dy * 0.12}px) scale(.95)`, offset: 0.18 }, // 蓄力：反向后缩 + 压半拍
      { transform: `translate(${dx * 0.62}px, ${dy * 0.7}px) scale(1.08)`, offset: 0.4 },    // 冲进顶点（涂抹帧藏接触）
      { transform: `translate(${dx * 0.5}px, ${dy * 0.56}px) scale(1.03)`, offset: 0.58 },   // 顶点回坐一拍
      { transform: "translate(0, 0) scale(1)", offset: 1 }                                    // 收势定场
    ], { duration: 600, easing: "cubic-bezier(.3,.6,.3,1)" });
    spawnAfterimage(el, dx, dy, side === "enemy" ? "enemy" : "me"); // 冲进段双残影（多重残影替代清晰接触）
  } catch (e) { /* 无动画能力时跳过 */ }
}

// 【v0.16】攻击残影：冲进路径上两枚阵营色剪影（渐隐），「接触帧不画清楚」的涂抹语法
function spawnAfterimage(el, dx, dy, side) {
  try {
    const r = el.getBoundingClientRect();
    [0.24, 0.42].forEach((frac, i) => {
      const g = document.createElement("i");
      g.className = "fx-afterimage" + (side === "enemy" ? " enemy" : "");
      g.style.left = (r.left + dx * frac) + "px";
      g.style.top = (r.top + dy * frac) + "px";
      g.style.width = r.width + "px";
      g.style.height = r.height + "px";
      g.style.setProperty("--amd", (i ? 0.26 : 0.4) + "s");
      document.body.appendChild(g);
      setTimeout(() => g.remove(), 480);
    });
  } catch (e) { /* 纯装饰 */ }
}

// 攻击轨迹：攻击者 → 目标的阵营色光痕（【v0.15】长度顶出目标之外＝速度线出画）+ 命中锯齿星
function attackTrail(x1, y1, x2, y2, side) {
  try {
    const dist = Math.hypot(x2 - x1, y2 - y1);
    if (dist < 8) return;
    const s = document.createElement("i");
    s.className = "fx-streak" + (side === "enemy" ? " enemy" : "");
    s.style.left = x1 + "px";
    s.style.top = (y1 - 4.5) + "px";
    s.style.width = (dist * 1.3) + "px"; // 打击感六律·速度线出画：拖尾末端越过目标 ~30%
    s.style.setProperty("--ang", Math.atan2(y2 - y1, x2 - x1) + "rad");
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 520);
    spawnHitStar(x2, y2, side, false);
  } catch (e) { /* 纯装饰，失败即跳过 */ }
}

// 【v0.15】命中锯齿星（打击感六律）：直线锯齿星 + 白负形核 + 闪烁只给最亮层（steps 硬切）；
// heavy = 重击（英雄受击）：冲击环 + 菱形碎块队列（yutapon 语法，2 明度面）
function spawnHitStar(x, y, side, heavy) {
  try {
    const el = document.createElement("i");
    el.className = "fx-hitstar" + (heavy ? " big" : "");
    const gold = side === "enemy" ? "#e0574a" : "#f5b841";   // 阵营强调色：我方金 / 敌方红
    const edge = side === "enemy" ? "#7e2318" : "#c94f2e";
    let pts = "";
    for (let k = 0; k < 8; k++) { // 4 根十字长刺 + 4 根对角短刺，尖刺由粗变细
      const a = k * 45 * Math.PI / 180;
      const R = k % 2 === 0 ? 50 : 27;
      const w = k % 2 === 0 ? 7 : 5.5;
      pts += (50 + 13 * Math.cos(a - w * Math.PI / 180)).toFixed(1) + "," + (50 + 13 * Math.sin(a - w * Math.PI / 180)).toFixed(1) + " ";
      pts += (50 + R * Math.cos(a)).toFixed(1) + "," + (50 + R * Math.sin(a)).toFixed(1) + " ";
      pts += (50 + 13 * Math.cos(a + w * Math.PI / 180)).toFixed(1) + "," + (50 + 13 * Math.sin(a + w * Math.PI / 180)).toFixed(1) + " ";
    }
    el.innerHTML = `<svg viewBox="0 0 100 100"><polygon points="${pts.trim()}" fill="${gold}" stroke="${edge}" stroke-width="2.5" stroke-linejoin="miter"/><path d="M50 34 L66 50 L50 66 L34 50 Z" fill="#fff6df"/></svg><b></b>`;
    el.style.left = x + "px";
    el.style.top = y + "px";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 560);
    if (heavy && fxAnimEnabled() && !fxReduceMotion.matches) {
      const ring = document.createElement("i");
      ring.className = "fx-hitring";
      ring.style.left = x + "px";
      ring.style.top = y + "px";
      document.body.appendChild(ring);
      setTimeout(() => ring.remove(), 420);
      const dirs = [[92, -84], [-110, -70], [70, 44], [-84, 66], [10, -120]];
      dirs.forEach((d, i) => {
        const sh = document.createElement("i");
        sh.className = "fx-hshard" + (i % 2 ? " sm" : "");
        sh.style.left = x + "px";
        sh.style.top = y + "px";
        sh.style.setProperty("--dx", d[0] + "px");
        sh.style.setProperty("--dy", d[1] + "px");
        sh.style.setProperty("--rr", (120 + i * 95) + "deg");
        document.body.appendChild(sh);
        setTimeout(() => sh.remove(), 640);
      });
    }
  } catch (e) { /* 纯装饰，失败即跳过 */ }
}

// ==========================================================
// 英雄技能（v0.3）：每回合一次，费用 2，随英雄职业差异化
// ==========================================================
$("player-hero").addEventListener("click", (e) => {
  const b = e.target.closest(".power-btn");
  if (!b) return;
  e.stopPropagation();
  onPowerClick();
});
function onPowerClick() {
  const p = myHero.powerDef;
  if (!p || battleOver) return;
  if (!myTurn) { toast("敌方回合，无法使用技能"); return; }
  if (heroPowerUsed) { toast("英雄技能每回合只能使用一次"); return; }
  if (myHero.mana < p.cost) { toast("法力不足"); return; }
  if (p.kind === "summonDog" && myBoardData.length >= 6) { toast("战场已满"); return; }
  cancelAim();   // 清掉可能进行中的卡牌瞄准视觉（v0.10.1：原先只清攻击态）
  cancelAttack();
  if (p.target) {
    if (!powerHasTarget(p)) { toast("场上没有可选的目标"); return; }
    startPowerAim(p);
    return;
  }
  commitPower(p, null);
}
function commitPower(p, target) {
  clearAimVisual();
  myHero.mana -= p.cost;
  heroPowerUsed = true;
  renderPlayerHero();
  spellBurst(p.name, "me"); // 【v0.18】side=施法方,元素特效打对侧半场
  logEvent(`我方技能「<b>${p.name}</b>」`, "me");
  const k = p.kind;
  if (k === "dmg2") {
    if (target && target.type === "hero") damageHero("enemy", 2);
    else if (target) damageMinion("enemy", target.idx, 2);
  } else if (k === "face2") {
    damageHero("enemy", 2);
  } else if (k === "atkDown2") {
    if (target) atkDownMinion("enemy", target.idx, 2);
  } else if (k === "buffAtk1") {
    if (target) buffMinion("player", target.idx, 1, 0);
  } else if (k === "lock") {
    if (target) lockMinion("enemy", target.idx);
  } else if (k === "dmg1atkDown1") {
    if (target) { damageMinion("enemy", target.idx, 1); atkDownMinion("enemy", target.idx, 1); }
  } else if (k === "drawPain") {
    drawCards(1); damageHero("player", 1);
    toast("抽了一张牌，英雄受到 1 点伤害");
  } else if (k === "summonDog") {
    summonToken("小狗", 1, 1, "小狗");
  } else if (k === "peek") {
    peekEnemyHand();
  }
}

// BGM 紧张感（v0.5）：我方英雄残血（≤10）时切换到小调快节奏和声，终局/回满解除
// v0.6 双人：任一方进残血区即进入紧张态
function updateTension() {
  try {
    const low = battleMode === "duo"
      ? (!battleOver && (myHero.hp > 0 && myHero.hp <= 10 || enemyHero.hp > 0 && enemyHero.hp <= 10))
      : (!battleOver && myHero.hp > 0 && myHero.hp <= 10);
    Snd.setTension(low);
  } catch (e) { /* 音频不可用时忽略 */ }
}

// 英雄受击：飘字 + 裂纹血光 + 更新血量 + 胜负判定
function damageHero(side, dmg) {
  if (battleOver) return;
  const isMe = side === "player";
  const h = isMe ? myHero : enemyHero;
  h.hp = Math.max(0, h.hp - dmg);
  if (isMe) renderPlayerHero(); else renderEnemyHero();
  const heroCard = document.querySelector((isMe ? "#player-hero" : "#enemy-hero") + " .hero-card");
  if (heroCard) { // 渲染完成后再挂飘字，否则会被 innerHTML 重写冲掉
    Snd.play("heroHit");
    // 【v0.15】重击三件套（打击感六律·重击层）：命中点锯齿星 big + 冲击环 + 菱形碎块；
    // 命中星用攻击方阵营色（我方挨打=敌方红 / 敌方挨打=我方金）
    try {
      const hb = heroCard.getBoundingClientRect();
      spawnHitStar(hb.left + hb.width / 2, hb.top + hb.height / 2, isMe ? "enemy" : "me", true);
      if (fxAnimEnabled() && !fxReduceMotion.matches) {
        // 黑白极性反转闪切（只给重击，~240ms 3 闪）。走 WAAPI：heroCard 同时在播 fx-shake，
        // 再挂 CSS animation 类会互相覆盖（animation 属性不叠加）——filter 动画独立于 animation 属性
        heroCard.animate([
          { filter: "none" },
          { filter: "invert(1) hue-rotate(180deg)" },
          { filter: "none" },
          { filter: "invert(1) hue-rotate(180deg)" },
          { filter: "none" }
        ], { duration: 240, easing: "steps(1, end)" });
      }
    } catch (e) { /* 纯装饰 */ }
    const s = document.createElement("span");
    s.className = "fx-dmg";
    s.textContent = "-" + dmg;
    heroCard.appendChild(s);
    setTimeout(() => s.remove(), 1000);
    fxReplay(heroCard, "fx-shake");
    // 【v0.4】血条破损感：裂纹闪现 + 红色血光罩（纯装饰，超时自动移除）
    const veil = document.createElement("span");
    veil.className = "fx-hurt-veil";
    const crack = document.createElement("span");
    crack.className = "fx-crack";
    crack.innerHTML =
      `<svg viewBox="0 0 200 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">` +
      `<path d="M6 46 L34 32 L50 48 L72 24 L90 42 L116 28 L140 46 L164 30 L194 44" fill="none" stroke="rgba(255,232,195,.9)" stroke-width="2" stroke-linejoin="round"/>` +
      `<path d="M72 24 L78 8 M90 42 L95 60 M140 46 L148 62 M34 32 L28 16" fill="none" stroke="rgba(255,205,150,.55)" stroke-width="1.4"/>` +
      `</svg>`;
    heroCard.appendChild(veil);
    heroCard.appendChild(crack);
    setTimeout(() => { veil.remove(); crack.remove(); }, 1400);
  }
  logEvent(`${isMe ? "我方" : "敌方"}英雄 -<b>${dmg}</b>（剩 ${h.hp}）`, isMe ? "bad" : "enemy");
  updateTension();
  checkGameOver();
}

// 胜负：任一英雄血量归零 → 终局遮罩（battleOver 已在战斗状态区声明）
function checkGameOver() {
  if (battleOver) return;
  if (enemyHero.hp <= 0) endBattle(true);
  else if (myHero.hp <= 0) endBattle(false);
}
function endBattle(win) {
  if (battleOver) return;
  battleOver = true;
  myTurn = false;
  setEnemyAction(null); // v0.7：终局撤掉敌方行动条
  cancelAim(); cancelAttack();
  // 【v0.23】终局伪广角(艺术法则·透视五律收尾):地面透视线由直线切外弯曲线组+缓推近
  const fg = document.querySelector(".fx-floorgrid");
  if (fg) fg.classList.add("wide");
  Snd.play(win ? "win" : "lose");
  updateTension();            // 终局解除 BGM 紧张感
  const duo = battleMode === "duo";
  const campaignStage = battleMode === "campaign" ? battleCampaignStage : null; // 【v0.14】闯关对局收尾
  let title, sub;
  if (duo) {
    // v0.6 双人：胜者是当前下方玩家（win）或上方玩家；不计入单机战绩
    const winner = win ? myHero.name : enemyHero.name;
    const loser = win ? enemyHero.name : myHero.name;
    recordDuoResult(winner, loser); // v0.7：双人分边统计（按英雄记胜负）
    logEvent(`对局结束 · <b>「${winner}」获胜！</b>`, "gold");
    title = `「${winner}」获胜`;
    sub = `校园传说 · ${turnNum} 回合激战 · 已记入本地双人战绩`;
  } else if (campaignStage) {
    // 【v0.14】闯关模式：胜负决定关卡是否通关与发卡,不计入单机胜负统计
    if (win) {
      campaign.cleared[campaignStage.id] = true;
      const got = grantCards(campaignStage.rewards);
      saveCampaign();
      logEvent(`关卡「${campaignStage.name}」通关！`, "gold");
      title = "通 关 !";
      sub = `${campaignStage.id} 号关卡「${campaignStage.name}」攻略成功`;
      campaignStage._got = got; // 面板展示本次新收集的卡
    } else {
      logEvent(`关卡「${campaignStage.name}」挑战失败…可再次挑战`, "bad");
      title = "挑 战 失 败";
      sub = `${campaignStage.id} 号关卡「${campaignStage.name}」· 整顿一下再战`;
      campaignStage._got = [];
    }
  } else {
    recordResult(win, myHero.name, enemyHero.name, turnNum); // v0.6：战绩落库（含英雄与回合数）
    logEvent(win ? "对局结束 · <b>胜利！</b>" : "对局结束 · 失败…", win ? "gold" : "bad");
    logEvent(`战绩 · ${stats.win} 胜 ${stats.lose} 负${stats.streak > 0 ? ` · ${stats.streak} 连胜` : ""}`, "gold");
    title = win ? "胜 利" : "失 败";
    sub = win ? "校园传说 · 这局你赢了" : "差一点点，再来一局？";
  }
  btnEnd.disabled = true;
  banner.textContent = duo ? title : (win ? "胜 利 !" : "失 败…");
  banner.classList.toggle("enemy", !win);
  // v0.8 终局回顾：双方英雄 · 回合数 · 本局触发过的组合技（按英雄记名，双人模式直接可读）
  const comboRecap = battleCombos.length
    ? battleCombos.map(x => `「${x.hero}」触发「${x.combo}」`).join("、")
    : "本局没有触发组合技";
  // v0.9 胜者金句：胜出英雄风味故事的第一句，给终局一个「人物感」收尾
  const winnerName = win ? myHero.name : enemyHero.name;
  const winnerQuote = heroQuote(CHARACTERS.find(c => c.name === winnerName));
  // 【v0.14】闯关结算:新收集卡展示 + 收集进度 + 下一关按钮
  const nextStage = campaignStage ? CAMPAIGNS.find(s => s.id === campaignStage.id + 1) : null;
  const rewardHtml = campaignStage && win && campaignStage._got && campaignStage._got.length
    ? `<span class="r-reward"><b>新收集</b>${campaignStage._got.map(n =>
        `<span class="rw-card"><span class="rw-icon">${iconArt(n)}</span><i>${n}</i></span>`).join("")}</span>`
    : "";
  const progressHtml = campaignStage
    ? `<span class="r-collect">收集进度 · ${ownedCount()}/${totalCardCount()} 张${nextStage ? " · 下一关:" + nextStage.name : " · 已通完全部关卡!"}</span>`
    : "";
  const mask = document.createElement("div");
  // v0.10 修复：败方类名原先拼成 "fx-end-masklose"（少空格），失败终局遮罩自 v0.2 起从未吃到样式
  mask.className = "fx-end-mask " + (win ? "win" : "lose");
  mask.innerHTML = `
    <div class="fx-end-panel">
      <b>${title}</b>
      <span>${sub}</span>
      <div class="fx-end-recap">
        <span class="r-vs">「${myHero.name}」<i>${win ? "" : " 胜"}</i> VS「${enemyHero.name}」<i>${win ? " 胜" : ""}</i> · ${turnNum} 回合</span>
        ${winnerQuote ? `<span class="r-quote">胜者传说 ·「${winnerQuote}。」</span>` : ""}
        <span class="r-combo"><b>组合技回顾</b>${comboRecap}</span>
        ${rewardHtml}
        ${progressHtml}
        ${!duo && !campaignStage ? `<span class="r-stats">战绩 · ${stats.win} 胜 ${stats.lose} 负 · 胜率 ${Math.round(stats.win / Math.max(1, stats.win + stats.lose) * 100)}%${stats.streak > 0 ? ` · ${stats.streak} 连胜` : stats.streak < 0 ? ` · ${-stats.streak} 连败` : ""}${(() => { const d = (stats.diff || {})[settings.aiDiff]; return d ? ` · ${DIFF_LABEL[settings.aiDiff] || "普通"}档 ${d.w}胜${d.l}负` : ""; })()}</span>` : ""}
      </div>
      <div class="fx-end-actions">
        ${campaignStage ? (nextStage ? `<button class="btn-gold" data-act="next">下 一 关</button>` : "") : `<button class="btn-gold" data-act="again">再 来 一 局</button>`}
        ${campaignStage ? `<button class="btn-plain" data-act="retry">重打本关</button><button class="btn-plain" data-act="stages">闯关界面</button>` : ""}
        <button class="btn-plain" data-act="replay">回看本局</button>
        ${campaignStage ? "" : `<button class="btn-plain" data-act="lobby">返回大厅</button>`}
        ${campaignStage ? `<button class="btn-plain" data-act="lobby">返回大厅</button>` : ""}
      </div>
    </div>`;
  mask.addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]");
    if (!b) return;
    if (b.dataset.act === "replay") { Snd.play("ui"); openReplay(); return; } // 回放叠在终局面板之上，× 只关回放
    mask.remove();
    if (b.dataset.act === "again") {
      if (!duo) setupHeroes(myHero.name); // 再来一局：单机保留我方英雄、敌方重新随机；双人保留双方
      show("screen-battle");
    }
    else if (b.dataset.act === "next") {
      show("screen-stages"); // 回闯关界面选下一关(保持选英雄的仪式感)
    }
    else if (b.dataset.act === "retry") {
      startCampaignBattle(myHero.name, campaignStage); // 重打本关:沿用同一英雄与关卡
    }
    else if (b.dataset.act === "stages") show("screen-stages");
    else show("screen-lobby");
  });
  document.getElementById("screen-battle").appendChild(mask);
}

// 确认出牌：扣费 → 手牌移除 → 幽灵卡飞向目标 → 结算
function commitPlay(handIdx, el, card, target) {
  // 先在手牌还挂载在文档里时取好起点，renderHand() 会立刻把原卡从 DOM 摘掉
  const from = el.getBoundingClientRect();
  myHero.mana -= card.cost;
  myHandData.splice(handIdx, 1);
  if (card.type === "spell") spellsPlayedGame.add(card.name);
  Snd.play(card.type === "minion" ? "playMinion" : null); // 法术音效由 spellBurst 统一播
  logEvent(`我方打出「<b>${card.name}</b>」`, "me");
  renderPlayerHero();
  renderHand();
  let to;
  if (card.type === "minion") {
    // 随从永远飞向我方战场落地，登场效果随后在目标上结算
    const row = document.getElementById("player-board").getBoundingClientRect();
    to = { x: row.left + row.width / 2, y: row.top + row.height / 2 };
  } else if (target) {
    const row = document.getElementById(target.side + "-board");
    const r = row.children[target.idx].getBoundingClientRect();
    to = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  } else {
    const field = document.querySelector(".battle-field").getBoundingClientRect();
    to = { x: field.left + field.width / 2, y: field.top + field.height * 0.4 };
  }
  const go = () => resolveCard(card, target);
  if (fxAnimEnabled() && !fxReduceMotion.matches) {
    flyGhost(el, to, card, from).then(go);
  } else {
    go(); // 减少动态效果：跳过飞行动画直接结算
  }
}

// 幽灵卡：复制原手牌卡面，从原位置飞向目标点（位移由 WAAPI 驱动）
// 结算不依赖动画完成：onfinish/oncancel 之外再挂一个兜底计时器，
// 页面被遮挡/后台导致动画暂停时，牌局照常推进、幽灵卡也会被清走
function flyGhost(el, to, card, fromRect) {
  return new Promise((resolve) => {
    const from = fromRect || el.getBoundingClientRect();
    const ghost = el.cloneNode(true);
    ghost.classList.add("fx-fly");
    ghost.style.left = from.left + "px";
    ghost.style.top = from.top + "px";
    ghost.style.width = from.width + "px";
    ghost.style.height = from.height + "px";
    document.body.appendChild(ghost);
    let done = false;
    const finish = () => { if (done) return; done = true; ghost.remove(); resolve(); };
    setTimeout(finish, 700); // 兜底：比正常 500ms 飞行略长，动画卡住也不冻结牌局

    const dx = to.x - (from.left + from.width / 2);
    const dy = to.y - (from.top + from.height / 2);
    const isMinion = card.type === "minion";
    try {
      const anim = ghost.animate([
        { transform: "translate(0,0) rotate(0deg) scale(1)", opacity: 1 },
        { transform: `translate(${dx * 0.55}px, ${dy * 0.7}px) rotate(${isMinion ? 7 : -9}deg) scale(1.1)`, opacity: 1, offset: 0.55 },
        { transform: `translate(${dx}px, ${dy}px) rotate(0deg) scale(${isMinion ? 0.85 : 0.55})`, opacity: 0.8 }
      ], { duration: 500, easing: "cubic-bezier(.3,.7,.25,1)" });
      anim.onfinish = finish;
      anim.oncancel = finish;
    } catch (e) { finish(); } // 极老浏览器没有 WAAPI：立即结算
  });
}

// 结算入口：随从上场 / 法术爆发
function resolveCard(card, target) {
  if (card.type === "minion") {
    summonMinion(card);
    resolveSpawn(card, target);
    checkCombos();
    return;
  }
  spellBurst(card.name);
  resolveCast(card, target);
  checkCombos();
}

// 随从上场：落地动画 + 尘环
function summonMinion(card) {
  Snd.play("summon");
  myBoardData.push({ name: card.name, atk: card.atk, hp: card.hp, icon: card.icon, kind: "role" }); // 新上场当回合不可攻击
  renderPlayerBoard();
  const el = $("player-board").lastElementChild;
  if (el) {
    fxReplay(el, "fx-land");
    const ring = document.createElement("i");
    ring.className = "fx-land-ring";
    el.appendChild(ring);
    setTimeout(() => ring.remove(), 750);
  }
}

// 登场效果结算（关键词跟图标走）
function resolveSpawn(card, target) {
  const sp = card.spawn;
  if (!sp) return;
  if (sp.dmg && target) damageMinion(target.side, target.idx, sp.dmg);
  if (sp.atkDown && target) atkDownMinion(target.side, target.idx, sp.atkDown);
  if (sp.lock && target) lockMinion(target.side, target.idx);
  if (sp.kind === "buffOthers") buffOtherMinions(myBoardData.length - 1); // 排除刚上场的自己（位于末位）
  // 【v0.21·深检修】衍生物不再硬编码课桌图腾:spawn 自带 tok* 字段优先(高大力=杠铃 2/2,
  // 与卡面文本一致),未定义的才回落到课桌图腾 0/2(预留)
  if (sp.kind === "summonToken") summonToken(sp.tokName || "课桌图腾", sp.tokAtk || 0, sp.tokHp || 2, sp.tokIcon || null);
  // v0.7 修正：登场自伤改走真实伤害（原先走治疗通道 -1，永远打不死自己、也没有受击反馈，
  // 与英雄技能「压榨」的 damageHero 行为不一致）
  if (sp.kind === "drawAndPain") { drawCards(1); damageHero("player", 1); }
  if (sp.kind === "healSelf") healMyHero(2);
  if (sp.kind === "peekEnemy") peekEnemyHand();
}

// 荣洪杰窥视：敌方牌背翻开 2.4 秒后翻回
// v0.9：单机对电脑翻的也是真实手牌（AI 手牌已真实化），双人为对方真实手牌
function peekEnemyHand() {
  const names = (battleMode === "duo" ? duoFoeHand : enemyHandData).slice(0, 3).map(c => c.name);
  if (!names.length) { toast("对方手牌是空的，什么也没看到"); return; }
  $("enemy-hand").innerHTML = names.map(n => `<div class="card-reveal">${n}</div>`).join("");
  toast("窥视到了对方的手牌！");
  setTimeout(renderEnemyHandRow, 2400);
}

// 法术结算
function resolveCast(card, target) {
  const c = card.cast;
  if (!c) return;
  if (c.coin) { // 幸运币：本回合法力 +1
    myHero.mana = Math.min(10, myHero.mana + 1);
    renderPlayerHero();
    toast("幸运币 · 本回合法力 +1");
    logEvent("幸运币 · 本回合法力 +1", "gold");
  }
  if (c.aoeDmg) aoeEnemyDamage(c.aoeDmg);
  if (c.aoeAtkDown) enemyBoardData.forEach((m, i) => atkDownMinion("enemy", i, c.aoeAtkDown));
  if (c.healHero) healMyHero(c.healHero);
  if (c.draw2) drawCards(2); // 【v0.14】情书错投:抽两张牌
  if (c.target === "enemyMinion" && target) {
    if (c.dmg) damageMinion("enemy", target.idx, c.dmg);
    if (c.lock) lockMinion("enemy", target.idx);
    if (c.bounce) bounceEnemyMinion(target.idx);
  }
  if (c.target === "allyMinion" && target) buffMinion("player", target.idx, c.buffAtk, c.buffHp);
}

// 法术爆发：双环冲击波 + 中心闪光 + 技能名上浮
function spellBurst(name, side) {
  Snd.play(name === "幸运币" ? "coin" : "playSpell"); // 音效不依赖动画开关
  if (fxReduceMotion.matches || !fxAnimEnabled()) return;
  // 【v0.18】元素法术特效(元素动效五律·art-design 十四节 + 天气水七律·二十五节):
  // 四张环境法术各走专属元素语法,其余法术维持通用冲击环兜底;side=施法方,特效打对侧半场
  const fx = {
    "焚机绝冲": fxFireWave,
    "机风横扫": fxWindSweep,
    "骤雨倾身": fxRainPour,
    "迷雾狂潮": fxFogSurge,
  }[name];
  const castSide = side === "enemy" ? "enemy" : "me";
  if (fx) { fx(castSide); fxSpellName(name, castSide); return; }
  const field = document.querySelector(".battle-field").getBoundingClientRect();
  const cx = field.left + field.width / 2;
  const cy = field.top + field.height * 0.4;
  const b = document.createElement("div");
  b.className = "fx-burst";
  b.style.left = cx + "px";
  b.style.top = cy + "px";
  b.innerHTML = "<i></i><b></b>";
  document.body.appendChild(b);
  fxSpellName(name, castSide, cx, cy - 34);
  setTimeout(() => { b.remove(); }, 1050);
}

// 法术名浮标(元素特效复用):默认挂在目标半场中央上方
function fxSpellName(name, castSide, x, y) {
  try {
    if (x === undefined) {
      const r = (castSide === "enemy" ? document.querySelector("#player-board") : document.querySelector("#enemy-board")).getBoundingClientRect();
      x = r.left + r.width / 2;
      y = r.top - 12;
    }
    const n = document.createElement("div");
    n.className = "fx-spell-name";
    n.textContent = "✦ " + name;
    n.style.left = x + "px";
    n.style.top = y + "px";
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 1050);
  } catch (e) { /* 纯装饰 */ }
}

// 目标半场矩形(施法方的对侧):side=施法方
function fxTargetHalf(side) {
  const row = side === "enemy" ? document.querySelector("#player-board") : document.querySelector("#enemy-board");
  if (!row) return null;
  const r = row.getBoundingClientRect();
  const field = document.querySelector(".battle-field").getBoundingClientRect();
  return { left: Math.max(field.left, r.left - 40), right: Math.min(field.right, r.right + 40),
    top: r.top - 46, bottom: r.bottom + 8, cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
}

// 【v0.18】焚机绝冲·火(火三层色带+锯齿舌尖+白核竖长条 steps 闪烁+错速上飘;内快外慢 0.6/0.9/1.2s)
function fxFireWave(side) {
  try {
    const h = fxTargetHalf(side);
    if (!h) return;
    const el = document.createElement("div");
    el.className = "fx-fire";
    el.style.left = h.cx + "px";
    el.style.top = h.cy + "px";
    el.innerHTML = '<i class="f3"></i><i class="f2"></i><i class="f1"></i><i class="core"></i>' +
      '<i class="tongue t1"></i><i class="tongue t2"></i><i class="tongue t3"></i>';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1280);
  } catch (e) { /* 纯装饰 */ }
}

// 【v0.18】机风横扫·风(月牙白浪×3 沿风向串联前大后小+速度线出画+碎屑流;方向=吹向对侧)
function fxWindSweep(side) {
  try {
    const h = fxTargetHalf(side);
    if (!h) return;
    const el = document.createElement("div");
    el.className = "fx-wind" + (side === "enemy" ? " rtl" : "");
    const w = h.right - h.left;
    el.style.left = h.left + "px";
    el.style.top = (h.top + 6) + "px";
    el.style.width = w + "px";
    el.style.height = (h.bottom - h.top) + "px";
    let html = "";
    for (let k = 0; k < 3; k++) html += `<i class="crescent c${k + 1}" style="--cd:${0.16 * k}s"></i>`;
    for (let k = 0; k < 5; k++) html += `<i class="wline" style="--wy:${18 + k * 16}%;--wd:${0.06 * k}s"></i>`;
    for (let k = 0; k < 6; k++) html += `<i class="debris" style="--dy:${30 + (k * 13) % 60}%;--dd:${0.1 * k}s"></i>`;
    el.innerHTML = html;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1120);
  } catch (e) { /* 纯装饰 */ }
}

// 【v0.18】骤雨倾身·雨(三层雨:前景长楔×10 65%/中景短线×28 45%/背景蓝灰纱 13%;全层 -20° 统一倾角,
// 400/640ms 错速下落;目标半场两处溅花=前锋3亮+尾随4暗 ~260ms 生灭——天气水七律)
function fxRainPour(side) {
  try {
    const h = fxTargetHalf(side);
    if (!h) return;
    const el = document.createElement("div");
    el.className = "fx-rain";
    const w = h.right - h.left;
    el.style.left = h.left + "px";
    el.style.top = h.top + "px";
    el.style.width = w + "px";
    el.style.height = (h.bottom - h.top) + "px";
    let html = '<i class="veil"></i>';
    for (let k = 0; k < 10; k++) html += `<i class="dropA" style="--rx:${(k * 10 + 3) % 100}%;--rd:${(k % 3) * 0.09}s"></i>`;
    for (let k = 0; k < 28; k++) html += `<i class="dropB" style="--rx:${(k * 3.6 + 1) % 100}%;--rd:${(k % 5) * 0.07}s"></i>`;
    html += '<i class="splash s1"></i><i class="splash s2"></i>';
    el.innerHTML = html;
    document.body.appendChild(el);
    // 溅花粒子:前锋 3 亮 + 尾随 4 暗,锥形散布
    el.querySelectorAll(".splash").forEach((sp, si) => {
      for (let k = 0; k < 7; k++) {
        const p = document.createElement("i");
        p.className = "sp" + (k < 3 ? " front" : " tail");
        p.style.setProperty("--sx", ((k - 3) * 9 + (si ? 14 : -8)) + "px");
        p.style.setProperty("--sy", (-(12 + (k % 3) * 5) - 4) + "px");
        p.style.setProperty("--sd", (k * 0.03 + si * 0.04) + "s");
        sp.appendChild(p);
      }
    });
    setTimeout(() => el.remove(), 1440);
  } catch (e) { /* 纯装饰 */ }
}

// 【v0.18】迷雾狂潮·雾(雾=对比度坍缩:目标半场先降对比再盖 2~3 层横向软边面纱+边缘小团生灭;
// 下 1/3 浓缩带;1.6s 后雾散、对比度恢复——「雾是介质不是颜色」)
function fxFogSurge(side) {
  try {
    const h = fxTargetHalf(side);
    if (!h) return;
    const el = document.createElement("div");
    el.className = "fx-fog";
    const w = h.right - h.left;
    el.style.left = h.left + "px";
    el.style.top = h.top + "px";
    el.style.width = w + "px";
    el.style.height = (h.bottom - h.top) + "px";
    let html = '<i class="sheet sh1"></i><i class="sheet sh2"></i><i class="belt"></i>';
    for (let k = 0; k < 7; k++) html += `<i class="puff" style="--px:${(k * 14 + 5) % 96}%;--py:${20 + (k * 23) % 55}%;--pd:${(k % 4) * 0.2}s"></i>`;
    el.innerHTML = html;
    document.body.appendChild(el);
    // 对比度坍缩:目标半场的随从行整体降对比(雾罩住而不吞掉——轮廓保留 ~40%)
    const boardRow = side === "enemy" ? document.querySelector("#player-board") : document.querySelector("#enemy-board");
    if (boardRow) {
      boardRow.style.filter = "contrast(.72) saturate(.6) brightness(1.06)";
      setTimeout(() => {
        boardRow.style.transition = "filter .8s ease";
        boardRow.style.filter = "";
        setTimeout(() => { boardRow.style.transition = ""; }, 840);
      }, 1600);
    }
    setTimeout(() => el.remove(), 2400);
  } catch (e) { /* 纯装饰 */ }
}

// ---------- 结算工具 ----------
// 范围伤害：对敌方全场随从造成伤害（扬音狂呼 / 焚机绝冲 / 疾声叱骂共用）
function aoeEnemyDamage(dmg) {
  enemyBoardData.forEach((m, i) => damageMinion("enemy", i, dmg));
}
// 伤害：飘伤害数字；死亡随从淡出后从战场移除
function damageMinion(side, idx, dmg) {
  const data = side === "player" ? myBoardData : enemyBoardData;
  const row = document.getElementById(side + "-board");
  const m = data[idx];
  if (!m || m.hp <= 0) return; // v0.8：已阵亡的随从（380ms 延迟移除期内）不再重复吃伤/重复报阵亡
  const el = row.children[idx];
  m.hp -= dmg;
  if (el) {
    Snd.play("hit");
    el.classList.remove("fx-squash"); // 允许连击重放（同帧再次受击也能重新弹起）
    void el.offsetWidth;              // 强制回流，重启动画
    el.classList.add("fx-squash");    // 【v0.16】受击形变链：squash 压扁变宽 → stretch 回弹拉长（体积守恒）
    setTimeout(() => el.classList.remove("fx-squash"), 500); // 兜底摘类：遮挡窗格 animationend 冻结不触发
    const s = document.createElement("span");
    s.className = "fx-dmg";
    s.textContent = "-" + dmg;
    el.appendChild(s);
    setTimeout(() => s.remove(), 1000);
  }
  if (m.hp <= 0) {
    Snd.play("death");
    logEvent(`${side === "player" ? "我方" : "敌方"}「${m.name}」阵亡`);
    if (el) el.classList.add("fx-die");
    setTimeout(() => {
      if (side === "player") { myBoardData = myBoardData.filter(x => x.hp > 0); renderPlayerBoard(); }
      else { enemyBoardData = enemyBoardData.filter(x => x.hp > 0); renderEnemyBoard(); }
    }, 380);
  } else if (el) {
    const badge = el.querySelector(".stat-badge.hp");
    if (badge) badge.textContent = m.hp;
  }
}
// 攻击力下降
function atkDownMinion(side, idx, v) {
  const data = side === "player" ? myBoardData : enemyBoardData;
  const m = data[idx];
  if (!m) return;
  Snd.play("debuff");
  m.atk = Math.max(0, m.atk - v);
  const el = document.getElementById(side + "-board").children[idx];
  if (el) {
    const badge = el.querySelector(".stat-badge.atk");
    if (badge) badge.textContent = m.atk;
    const s = document.createElement("span");
    s.className = "fx-buff";
    s.textContent = "-" + v + "攻";
    el.appendChild(s);
    setTimeout(() => s.remove(), 900);
  }
}
// 锁攻击（无法攻击标记）
function lockMinion(side, idx) {
  const data = side === "player" ? myBoardData : enemyBoardData;
  const m = data[idx];
  if (!m || m.hp <= 0) return; // 【v0.24·深检】v0.10.1 存活守卫补漏:380ms 死亡窗口内的垂死随从不吃锁(与 buff 六通道同纪律)
  Snd.play("debuff");
  m.locked = true;
  const el = document.getElementById(side + "-board").children[idx];
  if (el) {
    el.classList.add("locked");
    const s = document.createElement("span");
    s.className = "fx-buff fx-lock-note";
    s.textContent = "无法攻击";
    el.appendChild(s);
    setTimeout(() => s.remove(), 900);
  }
}
// 吹回手牌：飞出战场后从数据移除；v0.9 单机也真实回到敌方手牌（衍生物无对应手牌则消散）
function bounceEnemyMinion(idx) {
  const row = document.getElementById("enemy-board");
  const el = row.children[idx];
  const m = enemyBoardData[idx];
  const bouncedName = (m || {}).name;
  if (el) el.classList.add("fx-bounce-out");
  Snd.play("bounce");
  logEvent(`敌方「${bouncedName || "?"}」被吹回`);
  const back = battleMode === "duo" ? duoFoeHand : enemyHandData;
  if (bouncedName && findCard(bouncedName) && back.length < MAX_HAND) {
    back.push(makeHandCard(bouncedName));
    renderEnemyHandRow();
  }
  setTimeout(() => {
    // v0.10.1：按对象引用重查下标再删——420ms 窗口里若死亡 filter 已重建数组，旧 idx 会删错人
    const i = enemyBoardData.indexOf(m);
    if (i >= 0) enemyBoardData.splice(i, 1);
    renderEnemyBoard();
    renderEnemyHero();
  }, 420);
}
// 增益：+攻/+血（绿字飘字）
function buffMinion(side, idx, a, h) {
  const data = side === "player" ? myBoardData : enemyBoardData;
  const m = data[idx];
  if (!m || m.hp <= 0) return; // v0.10.1：380ms 死亡延迟窗口内不给垂死随从加血（防"复活"），与 damageMinion 守卫对称
  Snd.play("buff");
  m.atk += a; m.hp += h;
  const el = document.getElementById(side + "-board").children[idx];
  if (el) {
    const a1 = el.querySelector(".stat-badge.atk"), h1 = el.querySelector(".stat-badge.hp");
    if (a1) a1.textContent = m.atk;
    if (h1) h1.textContent = m.hp;
    const s = document.createElement("span");
    s.className = "fx-buff";
    s.textContent = "+" + a + "/+" + h;
    el.appendChild(s);
    setTimeout(() => s.remove(), 900);
  }
}
// 高歌：我方其他随从 +1 攻击（excludeIdx = 刚上场的自己）
function buffOtherMinions(excludeIdx) {
  Snd.play("buff");
  myBoardData.forEach((m, i) => { if (i !== excludeIdx && m.hp > 0) m.atk += 1; }); // v0.10.1：垂死随从不吃增益
  renderPlayerBoard();
  [...$("player-board").children].forEach((el, i) => {
    if (i === excludeIdx) return;
    const s = document.createElement("span");
    s.className = "fx-buff";
    s.textContent = "+1攻";
    el.appendChild(s);
    setTimeout(() => s.remove(), 900);
  });
}
// 召唤衍生物（课桌图腾 / 战械机甲等）
// v0.9：每种衍生物本局第一次入场时往战报补一句「史料」（不打扰、不重复）
function logTokenFlavor(name) {
  if (flavorShown.has(name) || !TOKEN_FLAVOR[name]) return;
  flavorShown.add(name);
  logEvent(`「${name}」：${TOKEN_FLAVOR[name]}`);
}
function summonToken(name, atk, hp, iconName) {
  if (myBoardData.length >= 6) { buffAllMine(1, 1); toast("战场已满，改为全体 +1/+1"); return; }
  Snd.play("summon");
  logEvent(`我方召唤「<b>${name}</b>」（${atk}/${hp}）`, "me");
  logTokenFlavor(name);
  myBoardData.push({ name, atk, hp, icon: iconName, kind: "token" });
  renderPlayerBoard();
  const el = $("player-board").lastElementChild;
  if (el) {
    fxReplay(el, "fx-land");
    const ring = document.createElement("i");
    ring.className = "fx-land-ring";
    el.appendChild(ring);
    setTimeout(() => ring.remove(), 750);
  }
}
// 我方全体增益
function buffAllMine(a, h) {
  Snd.play("buff");
  myBoardData.forEach(m => { if (m.hp > 0) { m.atk += a; m.hp += h; } }); // v0.10.1：跳过垂死随从
  renderPlayerBoard();
  [...$("player-board").children].forEach(el => {
    const s = document.createElement("span");
    s.className = "fx-buff";
    s.textContent = "+" + a + "/+" + h;
    el.appendChild(s);
    setTimeout(() => s.remove(), 900);
  });
}
function buffAllMineAtk(a) {
  Snd.play("buff");
  myBoardData.forEach(m => { if (m.hp > 0) m.atk += a; }); // v0.10.1：跳过垂死随从
  renderPlayerBoard();
  [...$("player-board").children].forEach(el => {
    const s = document.createElement("span");
    s.className = "fx-buff";
    s.textContent = "+" + a + "攻";
    el.appendChild(s);
    setTimeout(() => s.remove(), 900);
  });
}
function healMyHero(v) {
  if (v > 0) Snd.play("heal");
  const cap = myHero.maxHp || 30; // v0.6：治疗上限跟随英雄最大生命（差异化血量）
  myHero.hp = Math.max(1, Math.min(cap, myHero.hp + v));
  if (v > 0) logEvent(`我方英雄 +<b>${v}</b>（剩 ${myHero.hp}）`);
  renderPlayerHero();
  updateTension(); // 回满脱离残血区时切回平静 BGM
}

// 挚友背刺：对敌方生命最高的随从造成大额伤害
function backstabBiggest(dmg) {
  if (!enemyBoardData.length) { toast("敌方没有随从可以背刺"); return; }
  let best = 0;
  enemyBoardData.forEach((m, i) => { if (m.hp > enemyBoardData[best].hp) best = i; });
  damageMinion("enemy", best, dmg);
}

// ---------- 组合技：角色在场 + 本局打出过配套法术 → 大特效 + 结算（每局一次） ----------
// v0.5 平衡调整：「同回合打出」太苛刻 → 改为「本局打出过配套法术」即可，
// 后打出的一方（无论角色还是法术）只要凑齐条件立即触发
function checkCombos() {
  COMBOS.forEach(c => {
    if (comboTriggered.has(c.name)) return;
    const roleOnBoard = myBoardData.some(m => m.name === c.need[0] && m.hp > 0); // v0.10.1：补 hp 判定，与 checkEnemyCombos 镜像一致
    if (roleOnBoard && spellsPlayedGame.has(c.need[1])) {
      comboTriggered.add(c.name);
      triggerCombo(c);
    }
  });
}
function triggerCombo(c, forEnemy) {
  Snd.play("combo");
  const gen = battleGen; // 【v0.21·深检修】组合技演出跨时间的回调必须持代际快照(工程约定):700ms 窗口内
                         // 终局+重开会把 applyCombo 打到新对局(凭空召唤/白抽牌);560ms 的横幅同理只该属于本局
  // v0.8 终局回顾：按触发时刻的英雄名记录（双人模式下名字即视角，天然正确）
  battleCombos.push({ hero: forEnemy ? enemyHero.name : myHero.name, combo: c.name });
  logEvent(`✦ ${forEnemy ? "敌方" : ""}组合技「<b>${c.name}</b>」触发！`, forEnemy ? "enemy" : "gold");
  if (!fxReduceMotion.matches && fxAnimEnabled()) {
    // 【v0.18】魔法阵四拍演出前置（art-design 十五节·魔法阵四律）：阵展开→符文点亮→光柱+白核→粒子循环；
    // 金光带与横幅压后到光柱拍（~560ms）再打，先蓄力后爆发
    fxMagicCircle(forEnemy);
    const flash = document.createElement("div");
    flash.className = "fx-combo-flash" + (forEnemy ? " enemy" : "");
    const bn = document.createElement("div");
    bn.className = "fx-combo-banner" + (forEnemy ? " enemy" : "");
    bn.textContent = (forEnemy ? "✦ 敌方组合技 · " : "✦ 组合技 · ") + c.name;
    setTimeout(() => {
      if (gen !== battleGen) return; // 换局作废：新局不该继承上一局的演出
      document.body.appendChild(flash);
      document.body.appendChild(bn);
    }, 560);
    setTimeout(() => { flash.remove(); bn.remove(); }, 2500);
  }
  setTimeout(() => {
    if (gen !== battleGen) return;   // 结算不跨局：旧局回调一律作废
    forEnemy ? applyEnemyCombo(c) : applyCombo(c);
  }, 700);
}

// 【v0.18】组合技魔法阵（纯 SVG 五件套，零字体依赖——第四批卢恩字符被字体回退毁掉的教训）：
// 外主环/符文环(24 几何刻痕+2 断口)/六芒星骨架(顶点触内环)/内环/中心菱核；
// 悬浮三件套=光柱+上升粒子×5+地面暗投影；四拍时序=阵 400ms→符 120ms steps→柱 300ms→粒子 1600ms
function fxMagicCircle(forEnemy) {
  try {
    const field = document.querySelector(".battle-field").getBoundingClientRect();
    const cx = field.left + field.width / 2;
    const cy = field.top + field.height * 0.46;
    let ticks = "";
    for (let k = 0; k < 24; k++) {
      if (k === 6 || k === 18) continue; // 符文环两断口 = 能量入口
      ticks += `<line x1="0" y1="-80" x2="0" y2="-90" transform="rotate(${k * 15})" class="tick"/>`;
    }
    let pts = "";
    for (let k = 0; k < 5; k++) pts += `<i class="mpt" style="--mx:${(k * 34 - 60)}px;--md:${k * 0.16}s"></i>`;
    const el = document.createElement("div");
    el.className = "fx-mcircle" + (forEnemy ? " enemy" : "");
    el.style.left = cx + "px";
    el.style.top = cy + "px";
    el.innerHTML =
      `<svg viewBox="-110 -110 220 220">` +
      `<circle r="100" class="ringo"/>` +
      `<g class="runes">${ticks}</g>` +
      `<polygon points="0,-70 60.6,35 -60.6,35" class="hexa"/>` +
      `<polygon points="0,70 60.6,-35 -60.6,-35" class="hexa"/>` +
      `<circle r="50" class="ringi"/>` +
      `<path d="M0 -28 L24 0 L0 28 L-24 0 Z" class="gem"/>` +
      `<circle r="5.5" class="mcore"/>` +
      `</svg>` +
      `<i class="pillar"></i><i class="mcshadow"></i>` + pts;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2400);
  } catch (e) { /* 纯装饰 */ }
}
function applyCombo(c) {
  switch (c.name) {
    case "开国大典": buffAllMine(2, 2); break;
    case "焚机绝冲": aoeEnemyDamage(4); break;
    case "战械苏醒": summonToken("战械机甲", 6, 6, "战械苏醒"); break;
    case "雕龙画风": buffAllMine(1, 1); myBoardData.forEach(m => { if (m.hp > 0) m.taunt = true; }); renderPlayerBoard(); break; // 【v0.25·审计】嘲讽补 hp>0 守卫,与人肉坦克/增益六通道同纪律
    case "豪遍全校": healMyHero(6); buffAllMineAtk(1); break;
    case "炸金行动": enemyBoardData.forEach(m => { m.locked = true; }); renderEnemyBoard(); break;
    case "疾声叱骂": aoeEnemyDamage(2); break;
    case "彰规肃行":
      enemyBoardData.forEach((m, i) => atkDownMinion("enemy", i, 2));
      enemyBoardData.forEach(m => { m.locked = true; });
      renderEnemyBoard();
      break;
    case "挚友背刺": backstabBiggest(5); break;
    case "疯狂刷题": buffAllMine(2, 1); break;
    case "人肉坦克": // 【v0.14】全班托举:+1/+2 并全员嘲讽
      buffAllMine(1, 2);
      myBoardData.forEach(m => { if (m.hp > 0) m.taunt = true; });
      renderPlayerBoard();
      break;
    case "广播寻人": // 【v0.14】大喇叭寻人:抽两张牌+敌方全体 -1 攻
      drawCards(2);
      enemyBoardData.forEach((m, i) => { if (m.hp > 0) atkDownMinion("enemy", i, 1); });
      break;
  }
  toast("组合技「" + c.name + "」触发！");
  if (fxAnimEnabled()) fxReplay(banner, "fx-pop");
}

// ---------- v0.7 敌方组合技：角色在场 + 本局打出过配套法术 → 镜像结算（每局一次） ----------
// 与我方共用一份 COMBOS 数据；敌方在 enemySummon / enemyCastSpell 后各检查一次，
// 且 planEnemyCards 会优先凑件（角色在场先出配套法术 / 法术打过先召唤配套角色）
function checkEnemyCombos() {
  COMBOS.forEach(c => {
    if (enemyCombosDone.has(c.name)) return;
    const roleOnBoard = enemyBoardData.some(m => m.name === c.need[0] && m.hp > 0);
    if (roleOnBoard && enemySpellsGame.has(c.need[1])) {
      enemyCombosDone.add(c.name);
      triggerCombo(c, true);
    }
  });
}
function applyEnemyCombo(c) {
  switch (c.name) {
    case "开国大典": buffAllEnemy(2, 2); break;
    case "焚机绝冲": myBoardData.forEach((m, i) => { if (m.hp > 0) damageMinion("player", i, 4); }); break;
    case "战械苏醒": enemySummonToken("战械机甲", 6, 6, "战械苏醒"); break;
    case "雕龙画风": buffAllEnemy(1, 1); enemyBoardData.forEach(m => { if (m.hp > 0) m.taunt = true; }); renderEnemyBoard(); break; // 【v0.25·审计】同我方侧:嘲讽补存活守卫
    case "豪遍全校":
      enemyHero.hp = Math.min(enemyHero.maxHp || 30, enemyHero.hp + 6);
      renderEnemyHero();
      Snd.play("heal");
      buffAllEnemyAtk(1);
      break;
    case "炸金行动": myBoardData.forEach(m => { m.locked = true; }); renderPlayerBoard(); break; // 配合 v0.7 锁定语义：约束我方下个回合
    case "疾声叱骂": myBoardData.forEach((m, i) => { if (m.hp > 0) damageMinion("player", i, 2); }); break;
    case "彰规肃行":
      myBoardData.forEach((m, i) => { if (m.hp > 0) atkDownMinion("player", i, 2); });
      myBoardData.forEach(m => { m.locked = true; });
      renderPlayerBoard();
      break;
    case "挚友背刺": {
      let best = -1;
      myBoardData.forEach((m, i) => { if (m.hp > 0 && (best < 0 || m.hp > myBoardData[best].hp)) best = i; });
      if (best >= 0) damageMinion("player", best, 5);
      break;
    }
    case "疯狂刷题": buffAllEnemy(2, 1); break;
    case "人肉坦克": // 【v0.14】镜像:敌方全体 +1/+2 并嘲讽
      buffAllEnemy(1, 2);
      enemyBoardData.forEach(m => { if (m.hp > 0) m.taunt = true; });
      renderEnemyBoard();
      break;
    case "广播寻人": // 【v0.14】镜像:敌方(己方 AI)抽两张牌+我方全体 -1 攻
      enemyDrawOne();
      enemyDrawOne();
      myBoardData.forEach((m, i) => { if (m.hp > 0) atkDownMinion("player", i, 1); });
      break;
  }
  toast("敌方组合技「" + c.name + "」生效！");
  if (fxAnimEnabled()) fxReplay(banner, "fx-pop");
}
// 敌方全体增益（开国大典 / 雕龙画风 / 疯狂刷题等的镜像工具）
function buffAllEnemy(a, h) {
  Snd.play("buff");
  enemyBoardData.forEach(m => { if (m.hp > 0) { m.atk += a; m.hp += h; } }); // v0.10.1：跳过垂死随从
  renderEnemyBoard();
  [...document.getElementById("enemy-board").children].forEach(el => {
    const s = document.createElement("span");
    s.className = "fx-buff";
    s.textContent = "+" + a + "/+" + h;
    el.appendChild(s);
    setTimeout(() => s.remove(), 900);
  });
}
function buffAllEnemyAtk(a) {
  Snd.play("buff");
  enemyBoardData.forEach(m => { if (m.hp > 0) m.atk += a; }); // v0.10.1：跳过垂死随从
  renderEnemyBoard();
  [...document.getElementById("enemy-board").children].forEach(el => {
    const s = document.createElement("span");
    s.className = "fx-buff";
    s.textContent = "+" + a + "攻";
    el.appendChild(s);
    setTimeout(() => s.remove(), 900);
  });
}

// ==========================================================
// 回合引擎（v0.3）：我方 → runEnemyTurn(AI 全流程) → startPlayerTurn 循环
// ==========================================================
const btnEnd = $("btn-endturn"), banner = $("turn-banner");
let endConfirmTimer = 0; // 结束回合二次确认：2.5 秒内再点一次才真正结束（防误触）
function clearEndConfirm() {
  clearTimeout(endConfirmTimer);
  btnEnd.classList.remove("confirm");
  btnEnd.textContent = "结束回合";
}
btnEnd.addEventListener("click", () => {
  if (!myTurn || battleOver) return;
  if (!btnEnd.classList.contains("confirm")) {
    btnEnd.classList.add("confirm");
    btnEnd.textContent = "确认结束?";
    Snd.play("ui");
    clearTimeout(endConfirmTimer);
    endConfirmTimer = setTimeout(clearEndConfirm, 2500);
    return;
  }
  clearEndConfirm();
  myTurn = false;
  cancelAim(); cancelAttack();
  btnEnd.disabled = true;
  if (fxAnimEnabled()) {
    fxReplay(btnEnd, "fx-flash"); // 按压后的光环确认反馈
    fxReplay(banner, "fx-pop");   // 横幅放大回弹 + 扫光
  }
  banner.textContent = foeLabel();
  banner.classList.add("enemy");
  Snd.play("enemyTurn"); // v0.5：敌方回合专属低音提示
  if (battleMode === "duo") { duoHandoff(false); return; } // v0.6：双人 = 交接遮罩，无 AI 回合
  runEnemyTurn(() => startPlayerTurn(true));
});

// v0.10.1 投降收尾：原先「投降退出」只是纯导航跳走——battleOver 仍是 false，
// AI 队列在隐藏的对战屏里继续跑完，可能在后台把玩家打死（幽灵败局写进战绩），
// 旧延时回调还会打到换局后的新状态上。现在：立即终局 + 作废旧队列 + 记一败。
document.querySelector("#screen-battle .battle-topbar .btn-back").addEventListener("click", () => {
  if (battleOver) return;
  battleOver = true;
  battleGen++; // 作废本局所有延时回调（AI 队列 / 死亡过滤 / 吹回等）
  cancelAim(); cancelAttack();
  clearEndConfirm();
  setEnemyAction(null);
  updateTension(); // 残血紧张 BGM 复位
  Snd.play("lose"); // 投降:低音叹息收场
  if (battleMode === "ai") recordResult(false, myHero.name, enemyHero.name, turnNum);
  if (battleMode === "duo") logEvent("对局被提前结束（未记入战绩）");
  toast("已投降，对局结束");
});

// 我方回合开始：法力 +1 回满、抽牌、重置攻击权/英雄技能/双方锁定
// v0.6 双人：法力按各人已行动回合数推进（首回合法力不涨），回合号 = 第几轮
function startPlayerTurn(advance) {
  if (battleOver) return;
  if (battleMode === "duo") {
    duoPlayerTurns++;
    myHero.turnsTaken = (myHero.turnsTaken || 0) + 1;
    if (myHero.turnsTaken > 1) myHero.maxMana = Math.min(10, myHero.maxMana + 1);
    turnNum = Math.floor(duoPlayerTurns / 2) + 1; // 轮数 = 每两个玩家回合进一
    $("turn-num").textContent = turnNum;
  } else {
    if (advance) { turnNum++; $("turn-num").textContent = turnNum; }
    myHero.maxMana = Math.min(10, myHero.maxMana + 1); // 单机：每次回到我方都 +1（含敌方先手的首回合）
  }
  myTurn = true;
  heroPowerUsed = false;
  snapTurn("me"); // 【v0.22】回合开始快照(法力已回满、行动未发生)
  setEnemyAction(null); // v0.7：回到我方回合，撤掉敌方行动条
  Snd.play("turn");
  btnEnd.disabled = false;
  clearEndConfirm(); // 确保确认态不跨回合残留
  banner.textContent = turnLabel();
  banner.classList.remove("enemy");
  myHero.mana = myHero.maxMana;
  // v0.7 锁定语义修正：我方随从的「无法攻击」来自敌方回合，必须约束完本回合；
  // 因此这里只重置攻击权、不清我方锁定（到期清理由 runEnemyTurn 开头负责）。
  // 敌方随从的锁定是我在上个回合施加的、已约束完敌方回合 → 到期清除。
  // 双人模式同理：换位后双方锁定随座位互换，各自在下一次 startPlayerTurn 到期。
  myBoardData.forEach(m => { m.canAttack = true; });
  enemyBoardData.forEach(m => { m.locked = false; });
  renderPlayerHero(); renderPlayerBoard(); renderEnemyBoard();
  drawCards(1);
  if (fxAnimEnabled()) {
    fxReplay(banner, "fx-pop"); // 回到我方回合再次强调
    const mc = document.querySelector("#player-hero .mana-crystals");
    if (mc) fxReplay(mc, "fx-wave"); // 水晶依次重新点亮
  }
}

// v0.7 敌方回合行动条：实时播报 AI 正在做什么（敌方回合的"读条"）
function setEnemyAction(text) {
  const el = document.getElementById("enemy-action");
  if (!el) return;
  if (!text) { el.classList.add("hidden"); return; }
  el.textContent = text;
  el.classList.remove("hidden");
}

// 顺序执行动作队列（每步间隔展示，单步异常不冻结回合，终局立即中止）
// v0.7：step 可带 label，执行前先亮到敌方行动条上；队列结束/终局自动熄灭
function runSteps(steps, done) {
  let i = 0;
  const gen = battleGen; // v0.10.1：对局代际快照，投降/重开局后整条队列立即作废
  (function next() {
    if (battleOver || gen !== battleGen) { setEnemyAction(null); return; }
    if (i >= steps.length) { setEnemyAction(null); done && done(); return; }
    const s = steps[i++];
    // v0.8 进度点：敌方回合的每一步都带「第 x / 共 n 步」，AI 越到后面的步骤越清楚
    if (s.label) setEnemyAction(`${s.label} · ${i}/${steps.length}`);
    setTimeout(() => {
      if (battleOver || gen !== battleGen) { setEnemyAction(null); return; }
      try { s.fn(); } catch (err) { /* AI 单步失败不影响回合推进 */ }
      next();
    }, s.w);
  })();
}

// 敌方回合：抽牌/疲劳 → 英雄技能 → 出牌（随从+法术）→ 随从攻击 → 交回我方
function runEnemyTurn(done) {
  if (battleOver) { done && done(); return; }
  enemyHero.powerUsed = false;
  if (enemyTurnCount > 0) enemyHero.maxMana = Math.min(10, enemyHero.maxMana + 1); // 与我方对称：首回合法力不涨
  enemyTurnCount++;
  enemyHero.mana = enemyHero.maxMana;
  snapTurn("enemy"); // 【v0.22】敌方回合开始快照
  enemyBoardData.forEach(m => { m.canAttack = true; }); // 上一回合上场的随从本回合解冻
  // v0.7 锁定到期：敌方上个回合施加给我方的「无法攻击」已约束完我方回合，现在清除
  myBoardData.forEach(m => { m.locked = false; });
  renderPlayerBoard();
  setEnemyAction("敌方回合 · 抽牌…");
  enemyDrawOne(); // v0.9：真实牌库抽牌（空库疲劳 / 满手爆牌都在函数内处理，与我方规则对称）
  renderEnemyHero();

  const steps = [];
  const lethal = aiLethalCheck(); // v0.10：困难档先盘点斩杀线（技能指向/攻击打脸共用）
  planEnemyPower(steps, lethal);
  planEnemyCards(steps);
  planEnemyAttacks(steps, lethal);
  runSteps(steps, () => { if (!battleOver) done && done(); });
}

// —— v0.10 AI 难度分层：三档参数表 ——
// normal = 历史行为（各概率与 v0.9 完全一致）；easy 全面收敛（少出牌/少用技能/不凑件/攻击随心）；
// hard 全面放开（几乎不空过、凑件、曲线出牌、价值交换、含英雄技能的精确斩杀）
const AI_DIFFS = {
  easy:   { powerMul: 0.5, play1: 0.55, playN: 0.30, combo: false, smart: false, random: true,  lethal: false, value: false, coin: false },
  normal: { powerMul: 1.0, play1: 0.95, playN: 0.55, combo: true,  smart: false, random: false, lethal: false, value: false, coin: true  },
  hard:   { powerMul: 1.5, play1: 1.00, playN: 0.92, combo: true,  smart: true,  random: false, lethal: true,  value: true,  coin: true  },
};
function aiCfg() {
  // 【v0.14】闯关模式:难度由关卡配置决定(不改用户的 settings.aiDiff)
  // 【v0.21·深检修】原先读的是选人流程变量 campaignStage——它在开战时已被消费置 null,
  // 对局期间真正持有配置的是 battleCampaignStage;读错导致关卡难度从未生效(1 关 easy 也按全局档打)
  if (battleMode === "campaign" && battleCampaignStage) return AI_DIFFS[battleCampaignStage.diff] || AI_DIFFS.normal;
  return AI_DIFFS[settings.aiDiff] || AI_DIFFS.normal;
}
// 难度缩放后的「愿意做」判定：基准概率乘难度系数，封顶 0.97 保留一点人性
function aiWants(baseProb) {
  return Math.random() < Math.min(0.97, Math.max(0, baseProb * aiCfg().powerMul));
}
// 困难 AI 的斩杀盘点：可攻击随从直伤 + 英雄技能直伤（face2 / dmg2 可打脸）；
// 我方有嘲讽挡脸时按「不能直接打脸」算（嘲讽由 enemyStrike 内部强制先撞）
function aiLethalCheck() {
  if (!aiCfg().lethal) return null;
  if (myBoardData.some(m => m.taunt && m.hp > 0)) return { canFace: false, total: 0 };
  let total = enemyBoardData.filter(m => m.canAttack && !m.locked && m.atk > 0)
    .reduce((s, m) => s + m.atk, 0);
  const p = enemyHero.powerDef;
  if (p && !enemyHero.powerUsed && enemyHero.mana >= p.cost && (p.kind === "face2" || p.kind === "dmg2")) total += 2;
  return { canFace: total >= myHero.hp, total: total };
}

// —— AI：英雄技能（v0.5 通用化）—— 敌方英雄不再固定为「怒骂」，
// 按所选英雄的 power.kind 做有意义的使用；窥牌无实际收益不浪费法力
// v0.9 修正：决策与扣费统一挪到计划期（与出牌一致）——原实现技能在执行期扣法力、
// 出牌在计划期扣，同回合「技能+出牌」时真实法力会偏离预算（AI 白赚法力）；技能步是
// 队列第一步，计划与执行之间没有状态变化，挪到计划期结果完全一致
function planEnemyPower(steps, lethal) {
  const p = enemyHero.powerDef;
  if (!p || enemyHero.powerUsed || enemyHero.mana < p.cost || battleOver) return;
  const k = p.kind;
  if (k === "peek") return; // 窥牌对 AI 无实际收益，不浪费法力
  let fn = null;
  const useIt = () => {
    renderEnemyHero();
    toast(`敌方使用了英雄技能「${p.name}」`);
    logEvent(`敌方技能「<b>${p.name}</b>」`, "enemy");
  };
  if (k === "summonDog") {
    if (enemyBoardData.length >= 6 || !aiWants(0.7)) return;
    fn = () => { useIt(); enemySummonToken("小狗", 1, 1, "小狗"); };
  } else if (k === "face2") {
    if (!(lethal && lethal.canFace) && !aiWants(0.7)) return; // v0.10：斩杀线内必打脸
    fn = () => { useIt(); damageHero("player", 2); };
  } else if (k === "drawPain") {
    if (enemyHero.deck <= 0 || !aiWants(0.5)) return; // 牌库空不主动吃疲劳
    fn = () => { useIt(); enemyDrawOne(); damageHero("enemy", 1); };
  } else if (k === "buffAtk1") {
    const live = enemyBoardData.filter(m => m.hp > 0);
    if (!live.length || !aiWants(0.6)) return;
    let best = live[0];
    live.forEach(m => { if (m.atk > best.atk) best = m; });
    const idx = enemyBoardData.indexOf(best);
    fn = () => { useIt(); buffMinion("enemy", idx, 1, 0); };
  } else {
    // 指向类（dmg2 / atkDown2 / lock / dmg1atkDown1）：挑我方威胁最大的随从
    const mine = myBoardData.filter(m => m.hp > 0);
    const cands = mine.filter(m => m.atk >= 2);
    const wantFace = lethal && lethal.canFace && k === "dmg2"; // v0.10：斩杀线内 dmg2 直接锁定打脸
    if (!wantFace && (!cands.length || !aiWants(0.65))) return;
    let best = cands[0];
    cands.forEach(m => { if (m.atk + m.hp > best.atk + best.hp) best = m; });
    const idx = myBoardData.indexOf(best);
    fn = () => {
      useIt();
      if (k === "dmg1atkDown1") { damageMinion("player", idx, 1); atkDownMinion("player", idx, 1); }
      else if (k === "atkDown2") atkDownMinion("player", idx, 2);
      else if (k === "lock") lockMinion("player", idx);
      else if (k === "dmg2") {
        // dmg2 的目标可为敌方英雄：斩杀线内或我方无随从时直接打脸
        if (wantFace || !mine.length || myHero.hp <= 2) damageHero("player", 2);
        else damageMinion("player", idx, 2);
      }
    };
  }
  if (fn) {
    // v0.10 修复：技能扣费挪到计划期——原先在执行期扣，planEnemyCards 计划时读到的还是满法力，
    // 同回合「技能+出牌」会超支（实测透支到 -2）。现在计划期一次扣清，执行步只做展示与结算
    enemyHero.mana -= p.cost;
    enemyHero.powerUsed = true;
    steps.push({ w: 420, label: "敌方考虑英雄技能…", fn });
  }
}

// —— AI：出牌阶段 —— v0.9 从真实手牌里选卡出牌，最多 3 张（幸运币不占名额）
// 凑件优先级不变：配套法术打过 → 优先出手里/还没上场的配套角色；配套角色在手或在场 → 优先打出配套法术
// 计划在同一循环内完成而法术集合要等执行才写入 → 用 planned 集合在本回合计划内去重，
// 避免同名卡（风味牌库有 ×2）被连打三遍白扔法力
function planEnemyCards(steps) {
  const cfg = aiCfg(); // v0.10：难度参数（出牌意愿/凑件/打币/曲线出牌）
  let played = 0;
  let coinPlanned = false;
  const planned = new Set(); // 本回合已计划打出的卡名
  const inHand = () => enemyHandData.filter(c => !planned.has(c.name));
  while (played < 3 && enemyHero.mana >= 1) {
    // 幸运币：手里有币，且 +1 法力能立刻解锁一张有用的卡 → 先打币（不占 3 张名额）
    // 【v0.15】困难档放宽（连续规划）：+1 法力还能凑出「两张有用卡恰好用尽」的曲线时也打币
    // （原条件只认单卡 cost === mana+1，法力 4 手里 3+2 这种曲线永远用不上币）
    if (cfg.coin && !coinPlanned) {
      const coin = inHand().find(c => c.cast && c.cast.coin);
      let coinWorthy = false;
      if (coin) {
        coinWorthy = inHand().some(c => c !== coin && c.cost === enemyHero.mana + 1 && enemyCardUseful(c));
        if (!coinWorthy && cfg.value) {
          const cs = inHand().filter(c => c !== coin && !(c.cast && c.cast.coin));
          outer: for (let i2 = 0; i2 < cs.length; i2++) {
            for (let j2 = i2 + 1; j2 < cs.length; j2++) {
              if (cs[i2].cost + cs[j2].cost === enemyHero.mana + 1
                && enemyCardUseful(cs[i2]) && enemyCardUseful(cs[j2])) { coinWorthy = true; break outer; }
            }
          }
        }
      }
      if (coin && coinWorthy) {
        coinPlanned = true;
        planned.add(coin.name);
        enemyHero.mana = Math.min(10, enemyHero.mana + 1); // 法力统一在计划期变动（执行步只做展示）
        steps.push({ w: 380, label: `敌方打出「${coin.name}」`, fn: () => {
          const i = enemyHandData.indexOf(coin);
          if (i >= 0) enemyHandData.splice(i, 1);
          enemyCastSpell(coin); // 走通用施法通道：toast/音效/战报齐全（法力已在计划期 +1）
          renderEnemyHandRow(); renderEnemyHero();
        }});
        continue;
      }
    }
    if (Math.random() >= (played === 0 ? cfg.play1 : cfg.playN)) break;
    const room = enemyBoardData.length < 6;
    const hand = inHand().filter(c => c.cost <= enemyHero.mana);
    let card = null, isSpell = false;
    // 凑件 ①：配套法术已打过 → 优先打出手里还没上场的配套角色
    if (cfg.combo && room) {
      card = hand.find(c => c.type === "minion"
        && COMBOS.some(cb => !enemyCombosDone.has(cb.name)
          && enemySpellsGame.has(cb.need[1]) && cb.need[0] === c.name
          && !enemyBoardData.some(m => m.name === c.name && m.hp > 0)));
    }
    // 凑件 ②：配套角色在手（本回合将上场）或已在场 → 优先打出还没打过的配套法术（尊重时机判定）
    if (cfg.combo && !card) {
      card = hand.find(c => c.type === "spell" && !(c.cast && c.cast.coin) && enemyCardUseful(c)
        && COMBOS.some(cb => !enemyCombosDone.has(cb.name)
          && !enemySpellsGame.has(cb.need[1]) && cb.need[1] === c.name
          && (enemyBoardData.some(m => m.name === cb.need[0] && m.hp > 0)
            || hand.some(x => x.type === "minion" && x.name === cb.need[0]))));
      if (card) isSpell = true;
    }
    // 常规：普通/简单档随机在铺场与法术之间选择；困难档曲线出牌（有用候选里优先费用最高的）
    // 【v0.15】困难档防 AOE：自家场上活随从 ≥4 时不再铺场（防「扬音狂呼」2 伤/「粉笔弹幕」
    // 1 伤这类全场法术把宽度清光），只考虑法术；凑件①的角色卡不受此限（组合技优先级更高）
    if (!card) {
      const avoidFlood = cfg.smart && enemyBoardData.filter(m => m.hp > 0).length >= 4;
      const minions = (room && !avoidFlood) ? hand.filter(c => c.type === "minion") : [];
      const spells = hand.filter(c => c.type === "spell" && !(c.cast && c.cast.coin) && enemyCardUseful(c));
      if (!minions.length && !spells.length) break;
      if (cfg.value) {
        card = minions.concat(spells).sort((a, b) => b.cost - a.cost || (a.type === "minion" ? -1 : 1))[0];
        isSpell = card.type === "spell";
      } else if (minions.length && (!spells.length || Math.random() < 0.6)) {
        card = minions[Math.floor(Math.random() * minions.length)];
      } else {
        card = spells[Math.floor(Math.random() * spells.length)];
        isSpell = true;
      }
    }
    planned.add(card.name);
    enemyHero.mana -= card.cost;
    played++;
    steps.push({ w: 520, label: `敌方打出「${card.name}」`, fn: () => {
      const i = enemyHandData.indexOf(card);
      if (i >= 0) enemyHandData.splice(i, 1);
      if (isSpell) enemyCastSpell(card);
      else enemySummon(card);
      renderEnemyHandRow(); // v0.9：牌背数 = 敌方真实手牌数
      renderEnemyHero();
    }});
  }
}
// 一张手牌对当下的 AI 是否值得打出（费用由调用方过滤；v0.9 合并原 enemySpellUseful，随从也纳入）
function enemyCardUseful(c) {
  if (c.type === "minion") return true; // 铺场几乎总有意义（战场已满由计划层过滤）
  const cast = c.cast || {};
  if (cast.coin) return false; // 幸运币走专门的打币逻辑
  if (cast.draw2) return enemyHandData.length < MAX_HAND - 1; // 【v0.21·深检修】抽二对 AI 有用(手快满时不挤)
  if (cast.aoeDmg || cast.aoeAtkDown) return myBoardData.some(m => m.hp > 0);
  if (cast.target === "enemyMinion") return myBoardData.some(m => m.hp > 0); // AI 的「敌方随从」是我方
  if (cast.target === "allyMinion") return enemyBoardData.some(m => m.hp > 0);
  if (cast.healHero) return enemyHero.hp <= (enemyHero.maxHp || 30) - cast.healHero; // 血量差异化后按 maxHp 判
  return false;
}
function enemySummon(card) { // v0.9：入参从角色定义改为手牌实例（atk/hp/spawn/icon 自带）
  if (enemyBoardData.length >= 6) return;
  Snd.play("summon");
  logEvent(`敌方召唤「<b>${card.name}</b>」（${card.atk}/${card.hp}）`, "enemy");
  enemyBoardData.push({ name: card.name, atk: card.atk, hp: card.hp, icon: card.icon, canAttack: false }); // 新上场当回合不可攻
  renderEnemyBoard();
  const el = $("enemy-board").lastElementChild;
  if (el) {
    fxReplay(el, "fx-land");
    const ring = document.createElement("i");
    ring.className = "fx-land-ring";
    el.appendChild(ring);
    setTimeout(() => ring.remove(), 750);
  }
  resolveEnemySpawn(card); // v0.5：敌方角色卡战吼不再落空，与我方规则镜像
  checkEnemyCombos();   // v0.7：敌方角色登场也可能凑齐组合技（法术先打过的情形）
}
// 敌方角色卡战吼：指向类效果作用于我方价值最高的随从（无目标则按规则落空）
function resolveEnemySpawn(c) {
  const sp = c.spawn;
  if (!sp) return;
  const mine = myBoardData.filter(m => m.hp > 0);
  if ((sp.dmg || sp.atkDown || sp.lock) && mine.length) {
    let best = mine[0];
    mine.forEach(m => { if (m.atk + m.hp > best.atk + best.hp) best = m; });
    const idx = myBoardData.indexOf(best);
    if (sp.dmg) damageMinion("player", idx, sp.dmg);
    if (sp.atkDown) atkDownMinion("player", idx, sp.atkDown);
    if (sp.lock) lockMinion("player", idx);
  }
  if (sp.kind === "buffOthers") { // 高歌：敌方其他随从 +1 攻（排除末位刚上场的自己）
    const self = enemyBoardData.length - 1;
    enemyBoardData.forEach((m, i) => { if (i !== self) m.atk += 1; });
    renderEnemyBoard();
    [...$("enemy-board").children].forEach((el, i) => {
      if (i === self) return;
      const s = document.createElement("span");
      s.className = "fx-buff";
      s.textContent = "+1攻";
      el.appendChild(s);
      setTimeout(() => s.remove(), 900);
    });
  }
  if (sp.kind === "drawAndPain") { enemyDrawOne(); damageHero("enemy", 1); }
  if (sp.kind === "peekEnemy") { toast("敌方窥视了你的手牌！"); logEvent("敌方窥视了我方手牌", "enemy"); }
  // 【v0.21·深检修】补齐 healSelf / summonToken 镜像分支——原先 AI 侧打出钱多宝/高大力时战吼静默落空
  if (sp.kind === "healSelf") { enemyHero.hp = Math.min(enemyHero.maxHp || 30, enemyHero.hp + 2); renderEnemyHero(); toast("敌方英雄恢复了 2 点生命"); }
  if (sp.kind === "summonToken" && enemyBoardData.length < 6) {
    enemySummonToken(sp.tokName || "课桌图腾", sp.tokAtk || 0, sp.tokHp || 2, sp.tokIcon || null);
  }
}
// 敌方抽一张牌（v0.9 真实牌库）：牌库空 → 疲劳；手牌满 → 烧牌，与我方 drawCards 规则对称
// 只在单机模式被调用（双人的对手是真人，抽牌走 drawCards + 座位交换）
function enemyDrawOne() {
  if (battleMode === "duo") return;
  if (!enemyDeckData.length) {
    enemyFatigue += 1;
    Snd.play("fatigue");
    toast(`敌方牌库已空 · 疲劳！受到 ${enemyFatigue} 点伤害`);
    logEvent(`敌方疲劳 -<b>${enemyFatigue}</b>`, "enemy");
    damageHero("enemy", enemyFatigue);
    return;
  }
  const card = enemyDeckData.pop();
  if (enemyHandData.length >= MAX_HAND) {
    logEvent(`敌方爆牌 ·「${card.name}」`, "enemy");
  } else {
    enemyHandData.push(card);
  }
  enemyHero.deck = enemyDeckData.length;
  renderEnemyHandRow();
  renderEnemyHero();
}
// 敌方召唤衍生物（小狗 / 未来的战械机甲等）
function enemySummonToken(name, atk, hp, iconName) {
  if (enemyBoardData.length >= 6) return;
  Snd.play("summon");
  logEvent(`敌方召唤「<b>${name}</b>」（${atk}/${hp}）`, "enemy");
  logTokenFlavor(name);
  enemyBoardData.push({ name, atk, hp, icon: iconName, kind: "token", canAttack: false });
  renderEnemyBoard();
  const el = $("enemy-board").lastElementChild;
  if (el) {
    fxReplay(el, "fx-land");
    const ring = document.createElement("i");
    ring.className = "fx-land-ring";
    el.appendChild(ring);
    setTimeout(() => ring.remove(), 750);
  }
}
// 敌方施法：同一套 SPELLS 数据，作用方向镜像到玩家
function enemyCastSpell(card) {
  toast(`敌方打出了「${card.name}」`);
  logEvent(`敌方打出「<b>${card.name}」</b>`, "enemy");
  enemySpellsGame.add(card.name); // v0.7：记入敌方本局法术（组合技判定）
  spellBurst(card.name, "enemy"); // 【v0.18】side=施法方,元素特效打我方半场
  const c = card.cast || {};
  if (c.aoeDmg) myBoardData.forEach((m, i) => { if (m.hp > 0) damageMinion("player", i, c.aoeDmg); });
  if (c.aoeAtkDown) myBoardData.forEach((m, i) => { if (m.hp > 0) atkDownMinion("player", i, c.aoeAtkDown); });
  if (c.healHero) { enemyHero.hp = Math.min(enemyHero.maxHp || 30, enemyHero.hp + c.healHero); renderEnemyHero(); }
  if (c.target === "enemyMinion") {
    const live = myBoardData.filter(m => m.hp > 0);
    if (live.length) {
      let best = live[0];
      live.forEach(m => { if (m.atk + m.hp > best.atk + best.hp) best = m; });
      const idx = myBoardData.indexOf(best);
      if (idx >= 0) {
        if (c.dmg) damageMinion("player", idx, c.dmg);
        if (c.lock) lockMinion("player", idx);
        if (c.bounce) bounceMyMinion(idx);
      }
    }
  }
  if (c.target === "allyMinion") {
    const live = enemyBoardData.filter(m => m.hp > 0);
    if (live.length) {
      const t = live[Math.floor(Math.random() * live.length)];
      const idx = enemyBoardData.indexOf(t);
      if (idx >= 0 && c.buffAtk) buffMinion("enemy", idx, c.buffAtk, c.buffHp || 0);
    }
  }
  // 【v0.21·深检修】补 draw2 分支(情书错投):原先 AI 收集后这张卡永久死牌、广播寻人对 AI 永闭
  if (c.draw2) { enemyDrawOne(); enemyDrawOne(); logEvent("敌方抽了两张牌", "enemy"); }
  checkEnemyCombos(); // v0.7：法术打过 + 配套角色在场 → 敌方组合技也可能就此凑齐
}
// 把我方随从吹回手牌（敌方法术「机风横扫」）；衍生物无对应手牌则直接消散
function bounceMyMinion(idx) {
  const m = myBoardData[idx];
  if (!m) return;
  const el = $("player-board").children[idx];
  if (el) el.classList.add("fx-bounce-out");
  Snd.play("bounce");
  logEvent(`我方「${m.name}」被吹回`, "me");
  if (findCard(m.name) && myHandData.length < MAX_HAND) myHandData.push(makeHandCard(m.name));
  setTimeout(() => {
    const i = myBoardData.indexOf(m);
    if (i >= 0) myBoardData.splice(i, 1);
    renderPlayerBoard(); renderHand();
  }, 420);
}

// —— AI：攻击阶段 —— 嘲讽必打 → 斩杀线内全打脸 → 优先白吃/清大威胁 → 脸/随从按概率
function planEnemyAttacks(steps, lethal) {
  const strikers = enemyBoardData.filter(m => m.canAttack && !m.locked && m.atk > 0);
  const totalAtk = strikers.reduce((s, m) => s + m.atk, 0);
  // v0.10：困难档用含英雄技能直伤的斩杀盘点（lethal.canFace），其余档维持随从总攻的基础判定
  const goFace = (lethal && lethal.canFace) || totalAtk >= myHero.hp; // 斩杀判定（嘲讽由 enemyStrike 内部强制）
  strikers.forEach(m => steps.push({ w: 460, label: `敌方「${m.name}」攻击`, fn: () => enemyStrike(m, goFace) }));
}
function enemyStrike(m, goFace) {
  if (battleOver || m.hp <= 0 || !m.canAttack || m.locked) return;
  const aIdx = enemyBoardData.indexOf(m);
  if (aIdx < 0) return;
  m.canAttack = false;
  const aEl = $("enemy-board").children[aIdx];
  const mine = myBoardData.filter(x => x.hp > 0);
  const taunts = mine.filter(x => x.taunt);
  if (taunts.length) { // 我方嘲讽：必须先打
    strikeMinion(m, aEl, taunts[Math.floor(Math.random() * taunts.length)]);
    return;
  }
  const cfg = aiCfg();
  if (cfg.smart && !goFace && mine.length) {
    // v0.10 困难：价值交换——白吃/稳赚优先，一换一要换到价值不吃亏的目标，其余一律打脸抢血
    const val = x => x.atk * 2 + x.hp + (x.taunt ? 1 : 0);
    const kills = mine.filter(x => x.hp <= m.atk);
    const good = kills.filter(x => x.atk < m.hp);                      // 换掉它且自己活着
    const even = kills.filter(x => x.atk >= m.hp && val(x) >= val(m)); // 一换一但目标价值更高
    if (good.length) {
      let best = good[0];
      good.forEach(x => { if (val(x) > val(best)) best = x; });
      strikeMinion(m, aEl, best);
      return;
    }
    if (even.length && aiWants(0.8)) {
      let best = even[0];
      even.forEach(x => { if (val(x) > val(best)) best = x; });
      strikeMinion(m, aEl, best);
      return;
    }
    Snd.play("attack");
    lungeAnim(aEl, document.querySelector("#player-hero .hero-card"), "enemy");
    damageHero("player", m.atk);
    return;
  }
  if (cfg.random && mine.length && !goFace && Math.random() < 0.6) {
    // v0.10 简单：攻击随心——多半概率乱撞随从（【v0.15】0.5→0.6 再降一档），其余打脸
    strikeMinion(m, aEl, mine[Math.floor(Math.random() * mine.length)]);
    return;
  }
  if (goFace || !mine.length) {
    Snd.play("attack");
    lungeAnim(aEl, document.querySelector("#player-hero .hero-card"), "enemy");
    damageHero("player", m.atk);
    return;
  }
  const free = mine.filter(x => x.hp <= m.atk && x.atk === 0);       // 白吃：无反击
  const good = mine.filter(x => x.hp <= m.atk && x.atk < m.hp);      // 换掉它且自己活着
  const sloppy = !!cfg.random; // 【v0.15】简单档基本战术再降：交换目标随手挑、不找最优
  if (free.length) { strikeMinion(m, aEl, sloppy ? free[Math.floor(Math.random() * free.length)] : free[0]); return; }
  if (good.length && Math.random() < (sloppy ? 0.6 : 0.85)) {
    let best = good[0];
    if (sloppy) best = good[Math.floor(Math.random() * good.length)];
    else good.forEach(x => { if (x.atk + x.hp > best.atk + best.hp) best = x; });
    strikeMinion(m, aEl, best);
    return;
  }
  const threat = sloppy ? null : mine.find(x => x.atk >= 5 && x.hp <= m.atk); // 大威胁优先清除（简单档不看威胁）
  if (threat) { strikeMinion(m, aEl, threat); return; }
  if (Math.random() < 0.6) {
    Snd.play("attack");
    lungeAnim(aEl, document.querySelector("#player-hero .hero-card"), "enemy");
    damageHero("player", m.atk);
  } else {
    let big = sloppy ? mine[Math.floor(Math.random() * mine.length)] : mine[0];
    if (!sloppy) mine.forEach(x => { if (x.atk > big.atk) big = x; });
    strikeMinion(m, aEl, big);
  }
}
function strikeMinion(attacker, aEl, target) {
  const idx = myBoardData.indexOf(target);
  if (idx < 0 || target.hp <= 0) return;
  Snd.play("attack");
  lungeAnim(aEl, $("player-board").children[idx], "enemy");
  const back = target.atk; // 互殴同时结算
  damageMinion("player", idx, attacker.atk);
  if (back > 0) {
    const ai = enemyBoardData.indexOf(attacker);
    if (ai >= 0) damageMinion("enemy", ai, back);
  }
}
