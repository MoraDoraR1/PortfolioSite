// ABOUT folder: overlapping windows. Positions are computed from the desktop size and each
// window's measured height; click brings a window forward, dragging the titlebar moves it.
(() => {
  const stage = document.querySelector('#about .about-stage');
  if (!stage) return;
  const windows = [...stage.querySelectorAll('.window')];
  const win = cls => stage.querySelector('.' + cls);
  const desktop = matchMedia('(min-width: 1101px)') // matches the stacking breakpoint in about.css;
  const fit = (v, max) => Math.max(0, Math.min(v, max));

  // The speech bubble and Info share the left column, centred together; Profile fills the right.
  // A gap of at most 32px separates the columns, and the whole group is centred on wide desktops.
  // Returns the back-to-front order of the windows and each item's top-left corner in px.
  const GAP = 32, BUBBLE_GAP = 16;
  const layout = (S, s) => {
    const left = Math.max(s['w-info'].w, s.bubble.w);
    const gap = fit(S.w - left - s['w-profile'].w, GAP);
    const x0 = Math.max(0, (S.w - left - gap - s['w-profile'].w) / 2);
    const colH = s.bubble.h + BUBBLE_GAP + s['w-info'].h;
    const y0 = Math.max(0, (S.h - colH) / 2);
    return {
      order: ['w-profile', 'w-info'],
      pos: {
        bubble: [x0, y0],
        'w-info': [x0, Math.min(y0 + s.bubble.h + BUBBLE_GAP, S.h - s['w-info'].h)],
        'w-profile': [x0 + left + gap, (S.h - s['w-profile'].h) / 2],
      },
    };
  };
  const bubble = stage.querySelector('.desktop-welcome');
  const item = key => key === 'bubble' ? bubble : win(key);

  let z = 0;
  function raise(w) {
    z += 1;
    w.style.zIndex = z;
    windows.forEach(o => o.classList.toggle('is-active', o === w));
  }

  let customized = false; // once a window is dragged, resizes keep the visitor's arrangement
  function measure() {
    const s = {};
    windows.forEach(w => {
      w.style.maxHeight = 'none';
      s[[...w.classList].find(c => c.startsWith('w-'))] = { w: w.offsetWidth, h: w.offsetHeight };
      w.style.maxHeight = '';
    });
    s.bubble = bubble ? { w: bubble.offsetWidth, h: bubble.offsetHeight } : { w: 0, h: 0 };
    return s;
  }
  function applyLayout(restack) {
    if (!desktop.matches || !stage.clientWidth) return;
    const S = { w: stage.clientWidth, h: stage.clientHeight };
    const { order, pos } = layout(S, measure());
    Object.entries(pos).forEach(([key, [x, y]]) => {
      const el = item(key);
      if (!el) return;
      el.style.setProperty('--x', (fit(x, S.w) / S.w * 100).toFixed(3) + '%');
      el.style.setProperty('--y', (fit(y, S.h) / S.h * 100).toFixed(3) + '%');
    });
    if (restack) { z = 0; order.forEach(c => raise(win(c))); }
  }

  stage.addEventListener('pointerdown', event => {
    const w = event.target.closest('.window');
    if (w) raise(w);
  });
  stage.addEventListener('focusin', event => {
    const w = event.target.closest('.window');
    if (w && !w.classList.contains('is-active')) raise(w);
  });

  let drag = null;
  stage.addEventListener('pointerdown', event => {
    const bar = event.target.closest('.titlebar');
    if (!bar || event.button !== 0 || event.target.closest('button') || !desktop.matches) return;
    const w = bar.closest('.window');
    if (w.classList.contains('maximized')) return;
    drag = { w, bar, id: event.pointerId, sx: event.clientX, sy: event.clientY, left: w.offsetLeft, top: w.offsetTop, moved: false };
    bar.setPointerCapture(event.pointerId);
  });
  stage.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.sx, dy = event.clientY - drag.sy;
    if (!drag.moved) {
      if (Math.abs(dx) + Math.abs(dy) < 4) return;
      drag.moved = customized = true;
      drag.w.classList.add('is-dragging');
      document.body.classList.add('window-dragging');
    }
    // keep at least 120px of the window and its titlebar on the desktop
    const sw = stage.clientWidth, sh = stage.clientHeight, ww = drag.w.offsetWidth;
    const left = Math.min(Math.max(drag.left + dx, 120 - ww), sw - 120);
    const top = Math.min(Math.max(drag.top + dy, 0), sh - 40);
    drag.w.style.setProperty('--x', (left / sw * 100).toFixed(3) + '%');
    drag.w.style.setProperty('--y', (top / sh * 100).toFixed(3) + '%');
  });
  function endDrag(event) {
    if (!drag || event.pointerId !== drag.id) return;
    drag.w.classList.remove('is-dragging');
    document.body.classList.remove('window-dragging');
    if (drag.bar.hasPointerCapture(event.pointerId)) drag.bar.releasePointerCapture(event.pointerId);
    drag = null;
  }
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);
  stage.addEventListener('dblclick', event => {
    const bar = event.target.closest('.titlebar');
    if (bar && !event.target.closest('button')) bar.querySelector('[data-window="max"]')?.click();
  });

  // ---------- desktop assistant: a greeting, then tips on how to use the site ----------
  const tips = [
    { title: 'Welcome to my desktop', smile: true, text: '게임 기획자 오승명의 포트폴리오예요. 폴더마다 제 생각과 작업을 담아 뒀어요.' },
    { title: 'Open a folder', text: '폴더 아이콘을 누르거나 마우스 휠 · ← → 키 · 스와이프로 다음 폴더로 넘어가요.' },
    { title: 'Move the windows', wide: '창 제목표시줄을 끌어 옮기고, 클릭한 창은 맨 앞으로 와요. 더블클릭하면 크게 볼 수 있어요.',
      text: '창 오른쪽 위 □ 버튼을 누르면 창을 크게 볼 수 있어요.' },
    { title: 'Play the projects', text: 'PORTFOLIO 폴더에서 COMSTOCK을 열면 플레이 영상과 itch.io 출시 지표를 볼 수 있어요.' },
    { title: 'Read my notes', text: 'ESSAY에는 자기소개서를, GAME LOG에는 플레이하며 찾은 기획의 단서를 담았어요.' },
  ];
  const bubbleBox = bubble && bubble.querySelector('.welcome-bubble');
  if (bubbleBox) {
    const title = bubbleBox.querySelector('.welcome-title');
    const message = bubbleBox.querySelector('.welcome-message');
    const step = bubbleBox.querySelector('.welcome-step');
    const next = bubbleBox.querySelector('.welcome-next');
    const still = matchMedia('(prefers-reduced-motion: reduce)');
    let tip = 0, timer = 0, paused = false;
    const render = () => {
      const t = tips[tip];
      title.textContent = t.title;
      if (t.smile) title.insertAdjacentHTML('beforeend', '<span aria-hidden="true"> :)</span>');
      message.textContent = desktop.matches && t.wide ? t.wide : t.text;
      step.textContent = `· ${tip + 1}/${tips.length}`;
    };
    const show = index => {
      tip = (index + tips.length) % tips.length;
      if (still.matches) { render(); return; }
      bubbleBox.classList.add('is-swapping');
      setTimeout(() => { render(); bubbleBox.classList.remove('is-swapping'); }, 200);
    };
    const schedule = () => {
      clearInterval(timer);
      if (!still.matches) timer = setInterval(() => { if (!paused && !document.hidden) show(tip + 1); }, 7000);
    };
    step.hidden = next.hidden = false;
    render();
    schedule();
    next.addEventListener('click', () => { show(tip + 1); schedule(); });
    bubble.addEventListener('pointerenter', () => { paused = true; });
    bubble.addEventListener('pointerleave', () => { paused = false; });
    bubble.addEventListener('focusin', () => { paused = true; });
    bubble.addEventListener('focusout', () => { paused = false; });
    desktop.addEventListener('change', render);
  }

  let resizeTimer;
  const relayout = () => { if (!customized) applyLayout(false); };
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(relayout, 120); });
  applyLayout(true);
  // web fonts change text heights, so measure again once they are in
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
  window.addEventListener('load', relayout, { once: true });
})();
