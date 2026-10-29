// ABOUT folder: overlapping windows. Positions are computed from the desktop size and each
// window's measured height; click brings a window forward, dragging the titlebar moves it.
(() => {
  const stage = document.querySelector('#about .about-stage');
  if (!stage) return;
  const windows = [...stage.querySelectorAll('.window')];
  const win = cls => stage.querySelector('.' + cls);
  const desktop = matchMedia('(min-width: 821px)');
  const fit = (v, max) => Math.max(0, Math.min(v, max));

  // Info in front on the left; Tools and Profile share the right-hand column, Profile in front at the
  // bottom so Tools peeks out above it. The group is centred with at most a 32px gap between Info and
  // the column. Returns the back-to-front order and each window's top-left corner in px.
  const layout = (S, s) => {
    const col = Math.max(s['w-tools'].w, s['w-profile'].w);
    const gap = fit(S.w - s['w-info'].w - col, 32);
    const x0 = Math.max(0, (S.w - s['w-info'].w - gap - col) / 2), cx = x0 + s['w-info'].w + gap;
    return {
      order: ['w-tools', 'w-profile', 'w-info'],
      pos: {
        'w-tools': [cx, 0],
        'w-profile': [cx, S.h - s['w-profile'].h],
        'w-info': [x0, (S.h - s['w-info'].h) / 2],
      },
    };
  };

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
    return s;
  }
  function applyLayout(restack) {
    if (!desktop.matches || !stage.clientWidth) return;
    const S = { w: stage.clientWidth, h: stage.clientHeight };
    const { order, pos } = layout(S, measure());
    order.forEach(c => {
      const [x, y] = pos[c];
      win(c).style.setProperty('--x', (fit(x, S.w) / S.w * 100).toFixed(3) + '%');
      win(c).style.setProperty('--y', (fit(y, S.h) / S.h * 100).toFixed(3) + '%');
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

  let resizeTimer;
  const relayout = () => { if (!customized) applyLayout(false); };
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(relayout, 120); });
  applyLayout(true);
  // web fonts change text heights, so measure again once they are in
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
  window.addEventListener('load', relayout, { once: true });
})();
