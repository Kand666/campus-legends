/* ==========================================================
   校园传说 · 音效引擎（v0.4）
   Web Audio 全合成：零外部音频资源，无网络请求。
   - SFX：出牌 / 法术 / 攻击 / 伤害 / 治疗 / 组合技 / 胜负 …
   - BGM：慢和弦铺底 + 稀疏铃音的低音量氛围循环
   - 音量由 app.js 的设置面板驱动（setVolumes），首次用户手势解锁
   ========================================================== */
window.Snd = (function () {
  let ctx = null, musicGain = null, sfxGain = null;
  let vol = { music: 60, sfx: 80 };       // 0-100，来自设置面板
  let unlocked = false, musicTimer = 0, nextChordAt = 0, chordIdx = 0;

  // ---------- 基础 ----------
  function ensureCtx() {
    if (ctx) return true;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();
      musicGain = ctx.createGain();
      sfxGain = ctx.createGain();
      musicGain.connect(ctx.destination);
      sfxGain.connect(ctx.destination);
      applyVolumes();
    } catch (e) { ctx = null; return false; }
    return true;
  }
  function applyVolumes() {
    if (!ctx) return;
    try {
      musicGain.gain.value = Math.pow(vol.music / 100, 1.6) * 0.30; // BGM 基准偏轻
      sfxGain.gain.value = Math.pow(vol.sfx / 100, 1.4) * 0.85;
    } catch (e) { /* 增益节点异常时静默 */ }
  }

  // 首次用户手势解锁（浏览器自动播放策略）：一次性捕获
  function unlock() {
    if (unlocked) return;
    if (!ensureCtx()) return;
    unlocked = true;
    if (ctx.state === "suspended") ctx.resume().catch(function () {});
    startMusic();
  }
  window.addEventListener("pointerdown", unlock, { capture: true });
  window.addEventListener("keydown", unlock, { capture: true });
  // 页面不可见时挂起、回来时恢复（省电且避免积压）
  document.addEventListener("visibilitychange", function () {
    if (!ctx) return;
    try {
      if (document.hidden) ctx.suspend().catch(function () {});
      else if (unlocked) ctx.resume().catch(function () {});
    } catch (e) { /* 忽略 */ }
  });

  // ---------- 迷你合成器 ----------
  // beep：单振荡器（可滑频、可延迟、带起音/指数衰减包络）
  function beep(o) {
    const t = ctx.currentTime + (o.t0 || 0);
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = o.type || "sine";
    osc.frequency.setValueAtTime(Math.max(1, o.f), t);
    if (o.f2) osc.frequency.exponentialRampToValueAtTime(Math.max(1, o.f2), t + o.dur);
    const v = Math.max(0.0002, (o.vol || 0.4));
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v, t + (o.atk || 0.008));
    g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
    osc.connect(g); g.connect(sfxGain);
    osc.start(t); osc.stop(t + o.dur + 0.05);
  }
  // noise：带通/低通噪声爆发（打击感、风声）
  function noise(o) {
    const t = ctx.currentTime + (o.t0 || 0);
    const len = Math.max(1, Math.ceil(ctx.sampleRate * o.dur));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const flt = ctx.createBiquadFilter();
    flt.type = o.ftype || "bandpass";
    flt.frequency.setValueAtTime(o.f || 800, t);
    if (o.f2) flt.frequency.exponentialRampToValueAtTime(Math.max(20, o.f2), t + o.dur);
    flt.Q.value = o.q || 1;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, o.vol || 0.25), t + (o.atk || 0.012));
    g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
    src.connect(flt); flt.connect(g); g.connect(sfxGain);
    src.start(t); src.stop(t + o.dur + 0.02);
  }

  // ---------- SFX 配方 ----------
  const RECIPES = {
    ui:      function () { beep({ f: 660, f2: 880, type: "triangle", dur: 0.09, vol: 0.22 }); },
    draw:    function () { noise({ f: 900, f2: 2600, dur: 0.14, vol: 0.16, q: 0.8 }); beep({ f: 1320, dur: 0.06, vol: 0.10, t0: 0.05, type: "sine" }); },
    playMinion: function () { noise({ f: 300, f2: 120, ftype: "lowpass", dur: 0.16, vol: 0.4 }); beep({ f: 170, f2: 80, type: "sine", dur: 0.18, vol: 0.5 }); },
    playSpell:  function () { beep({ f: 420, f2: 1500, type: "triangle", dur: 0.22, vol: 0.3 }); beep({ f: 2100, dur: 0.10, vol: 0.12, t0: 0.10 }); noise({ f: 2400, f2: 5200, dur: 0.18, vol: 0.10, t0: 0.04, q: 2 }); },
    coin:    function () { beep({ f: 1318, dur: 0.30, vol: 0.3, type: "sine" }); beep({ f: 1976, dur: 0.38, vol: 0.18, t0: 0.02 }); beep({ f: 2637, dur: 0.2, vol: 0.08, t0: 0.05 }); },
    attack:  function () { noise({ f: 260, f2: 1900, dur: 0.2, vol: 0.3, q: 1.4 }); },
    hit:     function () { beep({ f: 150, f2: 62, type: "square", dur: 0.13, vol: 0.32 }); noise({ f: 700, f2: 200, dur: 0.1, vol: 0.28, ftype: "lowpass" }); },
    heroHit: function () { beep({ f: 96, f2: 44, type: "sawtooth", dur: 0.26, vol: 0.4 }); beep({ f: 103, f2: 47, type: "sawtooth", dur: 0.26, vol: 0.3 }); noise({ f: 400, f2: 90, dur: 0.2, vol: 0.34, ftype: "lowpass" }); },
    death:   function () { beep({ f: 320, f2: 70, type: "sawtooth", dur: 0.3, vol: 0.24 }); noise({ f: 500, f2: 100, dur: 0.26, vol: 0.14, t0: 0.04, ftype: "lowpass" }); },
    heal:    function () { [523, 659, 784].forEach(function (f, i) { beep({ f: f, dur: 0.22, vol: 0.2, t0: i * 0.07, type: "triangle" }); }); },
    buff:    function () { beep({ f: 880, f2: 1245, type: "triangle", dur: 0.14, vol: 0.26 }); beep({ f: 1661, dur: 0.12, vol: 0.12, t0: 0.06 }); },
    debuff:  function () { beep({ f: 440, f2: 300, type: "triangle", dur: 0.18, vol: 0.24 }); beep({ f: 220, f2: 165, dur: 0.16, vol: 0.14, t0: 0.05 }); },
    summon:  function () { beep({ f: 262, dur: 0.16, vol: 0.24, type: "triangle" }); beep({ f: 392, dur: 0.16, vol: 0.2, t0: 0.06, type: "triangle" }); beep({ f: 523, dur: 0.24, vol: 0.2, t0: 0.12, type: "triangle" }); },
    bounce:  function () { beep({ f: 700, f2: 1800, type: "sine", dur: 0.2, vol: 0.22 }); beep({ f: 2400, f2: 900, dur: 0.16, vol: 0.1, t0: 0.08 }); },
    combo:   function () { [523, 659, 784, 1047].forEach(function (f, i) { beep({ f: f, dur: 0.3, vol: 0.26, t0: i * 0.085, type: "triangle" }); }); beep({ f: 2093, dur: 0.5, vol: 0.1, t0: 0.34 }); noise({ f: 3000, f2: 6000, dur: 0.4, vol: 0.08, t0: 0.2, q: 2 }); },
    turn:    function () { beep({ f: 784, dur: 0.16, vol: 0.22, type: "sine" }); beep({ f: 1047, dur: 0.24, vol: 0.2, t0: 0.1 }); },
    enemyTurn: function () { beep({ f: 392, f2: 247, type: "triangle", dur: 0.34, vol: 0.26 }); beep({ f: 196, dur: 0.3, vol: 0.16, t0: 0.05, type: "sine" }); },
    fatigue: function () { beep({ f: 220, f2: 110, type: "square", dur: 0.35, vol: 0.3 }); beep({ f: 233, f2: 117, type: "square", dur: 0.35, vol: 0.22 }); },
    win:     function () { // 【v0.11】胜利号角:上行五声 + 长尾高音 + 三连鼓
      [523, 659, 784, 1047, 1319].forEach(function (f, i) { beep({ f: f, dur: 0.4, vol: 0.3, t0: i * 0.13, type: "triangle" }); });
      beep({ f: 1568, dur: 1.0, vol: 0.18, t0: 0.65 });
      beep({ f: 2093, dur: 0.8, vol: 0.10, t0: 0.75 });
      kick(ctx.currentTime + 0.65, sfxGain); kick(ctx.currentTime + 0.85, sfxGain); kick(ctx.currentTime + 1.05, sfxGain); // 【v0.23·深检3】SFX 配方里的鼓走音效总线:原先接 musicGain,音乐关掉时胜利号角缺鼓
      noise({ f: 5000, f2: 8000, dur: 0.5, vol: 0.06, t0: 0.65, q: 1.5 });
    },
    lose:    function () { // 【v0.11】失败下行 + 低音叹息
      [392, 330, 262, 196].forEach(function (f, i) { beep({ f: f, dur: 0.5, vol: 0.26, t0: i * 0.2, type: "triangle" }); });
      beep({ f: 98, f2: 82, type: "sine", dur: 1.2, vol: 0.22, t0: 0.85 });
      noise({ f: 400, f2: 120, dur: 0.9, vol: 0.08, t0: 0.85, ftype: "lowpass" });
    },
    gameStart: function () { // 【v0.11】开局:短号角+低鼓,提示对局正式开始
      beep({ f: 523, dur: 0.14, vol: 0.24, type: "triangle" });
      beep({ f: 784, dur: 0.22, vol: 0.22, t0: 0.10, type: "triangle" });
      kick(ctx.currentTime + 0.02, sfxGain); // 【v0.23·深检3】同上:开局号角的鼓走音效总线
    }
  };

  function play(name) {
    if (!unlocked && !ensureCtx()) return;
    const fn = RECIPES[name];
    if (!fn) return;
    try { fn(); } catch (e) { /* 单个音效失败不影响游戏 */ }
  }

  // ---------- BGM：和弦铺底(Am-F-C-G) + 主旋律 + 铃音 + 轻鼓点 ----------
  // 紧张和声（v0.5）：Am-Em-F-E 小调进行 + 更快的换和弦节奏，我方残血时启用
  const CHORDS = [
    { pad: [220.00, 261.63, 329.63], bass: 110.00, bells: [880.00, 1046.5, 1318.5] }, // Am
    { pad: [174.61, 220.00, 261.63], bass: 87.31,  bells: [880.00, 1046.5] },          // F
    { pad: [196.00, 261.63, 329.63], bass: 130.81, bells: [1046.5, 1318.5, 1568.0] },  // C
    { pad: [196.00, 246.94, 293.66], bass: 98.00,  bells: [880.00, 1174.7] }           // G
  ];
  const CHORDS_TENSE = [
    { pad: [220.00, 261.63, 329.63], bass: 110.00, bells: [880.00] },                  // Am
    { pad: [164.81, 196.00, 246.94], bass: 82.41,  bells: [830.61] },                  // Em
    { pad: [174.61, 220.00, 261.63], bass: 87.31,  bells: [880.00] },                  // F
    { pad: [164.81, 207.65, 246.94], bass: 82.41,  bells: [987.77] }                   // E（大三和弦制造不安定感）
  ];
  const CHORD_DUR = 5.2, CHORD_DUR_TENSE = 3.4;
  let tension = false;
  // 【v0.11】场景分段：menu = 舒缓(仅铺底+铃音)，battle = 明快(加主旋律+鼓点)，tension = 紧张
  let scene = "menu";
  function setScene(s) { if (s === "menu" || s === "battle") scene = s; }
  // 主旋律：A 小调五声音阶(A C D E G)随机游走——每次落音在邻音级进/偶尔跳进，永不刺耳
  const SCALE = [440.00, 523.25, 587.33, 659.26, 783.99, 880.00, 1046.5];
  let melIdx = 2;
  function melodyNote(f, t, dur) {
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.075, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g); g.connect(musicGain);
    osc.start(t); osc.stop(t + dur + 0.05);
  }
  // 轻鼓点：低鼓(sine 下扫) + 沙锤(高频噪声)，紧张档更密
  function kick(t, bus) {
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(48, t + 0.11);
    g.gain.setValueAtTime(0.22, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    osc.connect(g); g.connect(bus || musicGain);
    osc.start(t); osc.stop(t + 0.14);
  }
  function shaker(t, vol) {
    const len = Math.ceil(ctx.sampleRate * 0.05);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const flt = ctx.createBiquadFilter();
    flt.type = "highpass"; flt.frequency.value = 6000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol || 0.05, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    src.connect(flt); flt.connect(g); g.connect(musicGain);
    src.start(t); src.stop(t + 0.06);
  }
  function padNote(f, t, dur, level, type) {
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = type || "triangle";
    osc.frequency.value = f;
    osc.detune.value = (Math.random() * 6 - 3);       // 轻微失谐，更像弦垫
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(level, t + dur * 0.34);   // 慢起音
    g.gain.setValueAtTime(level, t + dur * 0.66);
    g.gain.linearRampToValueAtTime(0.0001, t + dur);         // 慢释放
    osc.connect(g); g.connect(musicGain);
    osc.start(t); osc.stop(t + dur + 0.1);
  }
  function bellNote(f, t) {
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = "sine"; osc.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.05, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);
    osc.connect(g); g.connect(musicGain);
    osc.start(t); osc.stop(t + 2.3);
  }
  function scheduleChord(t) {
    const set = tension ? CHORDS_TENSE : CHORDS;
    const dur = tension ? CHORD_DUR_TENSE : CHORD_DUR;
    const inBattle = scene === "battle" || tension;
    const c = set[chordIdx % set.length];
    chordIdx++;
    const padLv = tension ? 0.13 : (inBattle ? 0.12 : 0.11), bassLv = tension ? 0.19 : (inBattle ? 0.17 : 0.16);
    c.pad.forEach(function (f) { padNote(f, t, dur + 1.4, padLv); });
    padNote(c.bass, t, dur + 1.0, bassLv, "sine");
    // 每个和弦里随机落 1~2 声很轻的铃音（紧张时更稀疏，只留一声）
    const n = (!tension && Math.random() < 0.5) ? 2 : 1;
    for (let i = 0; i < n; i++) {
      const f = c.bells[Math.floor(Math.random() * c.bells.length)];
      bellNote(f, t + 1.0 + Math.random() * (dur - 2));
    }
    // 【v0.11】对战场景:主旋律小句(每个和弦 3~5 音) + 轻鼓点
    if (inBattle) {
      const notes = 3 + Math.floor(Math.random() * 3);
      const step = dur / (notes + 1);
      for (let i = 0; i < notes; i++) {
        // 60% 级进、40% 跳进，保持旋律起伏自然
        melIdx += Math.random() < 0.6 ? (Math.random() < 0.5 ? 1 : -1) : (Math.random() < 0.5 ? 2 : -2);
        melIdx = Math.max(0, Math.min(SCALE.length - 1, melIdx));
        melodyNote(SCALE[melIdx], t + step * (i + 0.5), Math.min(step * 1.6, 0.9));
      }
      // 鼓点:每和弦第 1 拍低鼓,后半拍沙锤;紧张档再补一记弱鼓
      kick(t + 0.05);
      shaker(t + step * 0.9);
      if (dur > 4) { shaker(t + step * 2.4, 0.04); shaker(t + step * 3.6, 0.04); }
      else kick(t + dur * 0.55);
    }
  }
  function startMusic() {
    if (!ctx || musicTimer) return;
    nextChordAt = ctx.currentTime + 0.15;
    musicTimer = setInterval(function () {
      try {
        // 【v0.23·深检2】过去时间钳制:页面隐藏时 interval 被浏览器深节流(可低至 1 次/分钟),
        // 切回瞬间 nextChordAt 已远落后——不钳制会把十几组和弦排进过去时间,百余振荡器同帧齐鸣爆响
        if (nextChordAt < ctx.currentTime) nextChordAt = ctx.currentTime + 0.15;
        while (nextChordAt < ctx.currentTime + 1.2) {   // 1 秒 lookahead 调度
          scheduleChord(nextChordAt);
          nextChordAt += tension ? CHORD_DUR_TENSE : CHORD_DUR;
        }
      } catch (e) { /* 调度失败静默 */ }
    }, 1000);
  }

  // ---------- 对外接口 ----------
  return {
    play: play,
    setVolumes: function (m, s) {
      vol.music = Math.max(0, Math.min(100, m));
      vol.sfx = Math.max(0, Math.min(100, s));
      applyVolumes();
    },
    // v0.5：残血紧张感切换（换和弦组 + 加快节奏，下个调度周期生效）
    setTension: function (on) { tension = !!on; },
    // 【v0.11】场景切换：menu 舒缓 / battle 明快(旋律+鼓点)
    setScene: setScene,
    // 调试用：当前音频状态
    state: function () {
      return { unlocked: unlocked, ctx: ctx ? ctx.state : "none", tension: tension, scene: scene };
    }
  };
})();
