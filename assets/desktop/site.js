const projects={
comstock:{name:'Comstock: Zombie Survivors',facts:'뱀서라이크 / 5인 팀 / 팀장 · 기획 리드',text:'부팀장과 함께 게임의 핵심과 틀을 먼저 설계해 공유하고, 의견이 갈릴 때에는 게임의 핵심에서 벗어나지 않는가를 기준으로 정리했습니다. 일정 안에 초기 아이템과 무기 구성을 모두 담기 어렵다고 판단했을 때 팀과 최종 목표를 다시 확인하고 범위를 조정했습니다.',extra:'<video controls playsinline preload="metadata" poster="assets/desktop/comstock.jpg" src="assets/portfolio/comstock/gameplay.mp4"></video><p class="release-summary">itch.io 출시 완료</p><p>공개 기간: <time datetime="2026-08-21">2026.08.21</time> ~ 현재</p><section class="release-metrics" aria-label="컴스톡 출시 지표"><h3>출시 지표 <small>itch.io Analytics</small></h3><dl class="release-metrics-grid"><div><dt>조회<small>Views</small></dt><dd>168</dd></div><div><dt>브라우저 플레이<small>Browser Plays</small></dt><dd>104</dd></div><div><dt>평가<small>Ratings</small></dt><dd>4</dd></div><div><dt>컬렉션<small>Collections</small></dt><dd>2</dd></div><div><dt>댓글<small>Comments</small></dt><dd>3</dd></div><div><dt>7일 노출<small>7d Impressions</small></dt><dd>128</dd></div></dl><p class="metrics-source">제공된 Analytics 캡처 기준 · 조회 설정 기간<br><time datetime="2026-08-20">2026.08.20</time>–<time datetime="2026-10-26">2026.10.26</time></p></section><p class="release-source"><span>출시 페이지</span><a class="release-url" href="https://mullet9711.itch.io/comstock-zombie-survivors" target="_blank" rel="noopener noreferrer">https://mullet9711.itch.io/comstock-zombie-survivors</a></p><a class="retro-button" href="https://mullet9711.itch.io/comstock-zombie-survivors" target="_blank" rel="noopener noreferrer">itch.io에서 플레이 ↗</a>'},
tomorrow:{name:'내일할래',facts:'방치형 클리커 / 2인 팀 / 팀장 / 2026.07 · 3주',text:'업무를 분배하고 콘셉트 및 시스템 기획서를 작성했습니다. 기획 문서를 실제 기능 구현까지 연결한 프로젝트입니다.',extra:'<p>공개 가능한 원본 자료가 남아 있지 않아 역할과 기여를 중심으로 소개합니다.</p>'},
dice:{name:'DICE BOARD GAME',facts:'보드 게임 / 6인 팀 / 부팀장 / 2026.06 · 2주',text:'팀의 일정 관리를 담당하고, 게임의 콘셉트 방향성을 제시했습니다.',extra:'<p>공개 가능한 원본 자료가 남아 있지 않아 역할과 기여를 중심으로 소개합니다.</p>'},
space:{name:'SPACE DESIGN',facts:'공간디자인 / 2인 팀 / 2023.12 / 전국 공모전 특선',text:'접근성과 이동 동선을 고려해 건축 구조와 공간 배치를 기획했습니다. 제18회 한국공간디자인 전국 공모전에서 특선을 수상했습니다.',extra:'<p>원본 패널·발표 자료가 남아 있지 않아 프로젝트 개요를 소개합니다.</p>'}
};

const contactHTML = "<strong class=\"contact-lines\">\n                  <a href=\"tel:+821062515547\">010 - 6251 - 5547</a>\n                  <a href=\"mailto:dhtmdaud0421@naver.com\">dhtmdaud0421@naver.com</a>\n                  <a href=\"mailto:pcc0421@gmail.com\">pcc0421@gmail.com</a>\n                </strong>";
const pages = [...document.querySelectorAll('.desktop-page')];
const track = document.querySelector('#page-track');
const workspace = document.querySelector('#workspace');
const modal = document.querySelector('#detail');
const content = document.querySelector('#detail-content');
const navLinks = [...document.querySelectorAll('.desktop-folders a')];
const labels = ['ABOUT','PORTFOLIO','ESSAY','GAME LOG'];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let current = 0, wheelAmount = 0, lastWheel = 0, lockedUntil = 0;
const tasks = document.querySelector('#task-buttons');
pages.forEach((page,index) => {
  const button = document.createElement('button');
  button.textContent = '▤ ' + labels[index];
  button.addEventListener('click', () => {
    page.querySelectorAll('.window').forEach(win => win.classList.remove('is-minimized'));
    go(index, true);
  });
  tasks.append(button);
});
function go(index, focus = false, historyMode = 'push') {
  index = Math.max(0, Math.min(pages.length - 1, index));
  const changed = index !== current;
  pages[current].querySelectorAll('video').forEach(video => video.pause());
  current = index;
  pages.forEach((page,i) => {
    page.inert = i !== index;
    page.setAttribute('aria-hidden', String(i !== index));
    page.classList.toggle('is-current', i === index);
  });
  track.style.transform = `translateX(-${index * 100}%)`;
  // A typed #hash makes the browser scroll the workspace to that page on top of the transform.
  workspace.scrollLeft = 0;
  navLinks.forEach((link,i) => {
    link.classList.toggle('active',i === index);
    if(i === index) link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  });
  [...tasks.children].forEach((button,i) => {
    button.classList.toggle('active',i === index);
    button.setAttribute('aria-pressed',String(i === index));
  });
  document.querySelector('#page-counter').textContent = `${String(index+1).padStart(2,'0')} / ${String(pages.length).padStart(2,'0')}`;
  document.querySelector('#current-folder-name').textContent = labels[index].replace(' ', '_');
  document.querySelector('.taskbar-location').setAttribute('aria-label', '현재 폴더: ' + labels[index]);
  document.querySelector('#previous-page').title = index > 0 ? labels[index-1] + ' 폴더 열기' : '첫 번째 폴더입니다';
  document.querySelector('#next-page').title = index < pages.length-1 ? labels[index+1] + ' 폴더 열기' : '마지막 폴더입니다';
  document.querySelector('#previous-page').disabled = index === 0;
  document.querySelector('#next-page').disabled = index === pages.length - 1;
  if(historyMode !== 'none' && location.hash !== '#' + pages[index].id)
    history[historyMode === 'replace' ? 'replaceState' : 'pushState'](null,'','#'+pages[index].id);
  if(changed) lockedUntil = performance.now() + (reducedMotion.matches ? 220 : 650);
  wheelAmount = 0;
  if(focus) pages[index].focus({preventScroll:true});
  // Keep the selected desktop folder in view on short screens.
  const folderNav = document.querySelector('.desktop-folders');
  const selected = navLinks[index];
  if (selected.offsetTop < folderNav.scrollTop)
    folderNav.scrollTop = selected.offsetTop;
  else if (selected.offsetTop + selected.offsetHeight > folderNav.scrollTop + folderNav.clientHeight)
    folderNav.scrollTop = selected.offsetTop + selected.offsetHeight - folderNav.clientHeight;
}
function fromHash(mode='none') {
  const index = pages.findIndex(page => '#'+page.id === location.hash);
  go(index >= 0 ? index : 0, false, mode);
}
window.addEventListener('popstate',()=>fromHash());
window.addEventListener('hashchange',()=>fromHash());
document.addEventListener('click',event => {
  const anchor = event.target.closest('a[href^="#"]');
  if(anchor) {
    const index = pages.findIndex(page => '#'+page.id === anchor.getAttribute('href'));
    if(index >= 0) {event.preventDefault();go(index,true);}
  }
  const control = event.target.closest('[data-window]');
  if(control) {
    const win = control.closest('.window');
    if(control.dataset.window === 'min') {
      win.classList.toggle('is-minimized');
      control.setAttribute('aria-label',win.classList.contains('is-minimized')?'창 복원':'창 최소화');
    } else {
      win.classList.remove('is-minimized');
      const max = win.classList.toggle('maximized');
      control.setAttribute('aria-pressed',String(max));
      control.setAttribute('aria-label',max?'창 크기 복원':'창 확대');
    }
  }
  const project = event.target.closest('[data-open]');
  if(project) openProject(project.dataset.open);
  const scans = event.target.closest('[data-media-items]');
  if(scans) openScans(scans);
});
document.querySelector('#previous-page').addEventListener('click',()=>go(current-1,true));
document.querySelector('#next-page').addEventListener('click',()=>go(current+1,true));
// Nested documents retain vertical scrolling; only their boundaries advance the desktop.
function canScroll(target,delta) {
  let element = target instanceof Element ? target : null;
  while(element && element !== workspace) {
    const overflow = getComputedStyle(element).overflowY;
    if(/auto|scroll/.test(overflow) && element.scrollHeight > element.clientHeight + 2) {
      if(delta > 0 && element.scrollTop + element.clientHeight < element.scrollHeight - 3) return true;
      if(delta < 0 && element.scrollTop > 3) return true;
    }
    element = element.parentElement;
  }
  return false;
}
workspace.addEventListener('wheel',event => {
  if(event.ctrlKey || modal.open) return;
  const delta = (Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY) * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? workspace.clientHeight : 1);
  if(!delta) return;
  if(canScroll(event.target,delta)) {wheelAmount=0;return;}
  event.preventDefault();
  const now = performance.now();
  if(now < lockedUntil) {lastWheel=now;return;}
  if(now-lastWheel > 220 || Math.sign(delta)!==Math.sign(wheelAmount)) wheelAmount=0;
  lastWheel=now;wheelAmount+=delta;
  if(Math.abs(wheelAmount)>=70) go(current+Math.sign(wheelAmount));
},{passive:false});
document.addEventListener('keydown',event => {
  if(modal.open || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.target.closest('input,textarea,select,video,[contenteditable="true"]')) return;
  if(event.key==='ArrowRight' || event.key==='ArrowLeft') {
    event.preventDefault();go(current+(event.key==='ArrowRight'?1:-1),true);
  }
});
let touch;
workspace.addEventListener('touchstart',event => {
  if(event.touches.length!==1 || event.target.closest('video,button,a,.about-stage .titlebar')) {touch=null;return;}
  touch={x:event.touches[0].clientX,y:event.touches[0].clientY};
},{passive:true});
workspace.addEventListener('touchend',event => {
  if(!touch || modal.open) return;
  const dx=event.changedTouches[0].clientX-touch.x,dy=event.changedTouches[0].clientY-touch.y;
  if(Math.abs(dx)>65 && Math.abs(dx)>Math.abs(dy)*1.5) go(current+(dx<0?1:-1),true);
  touch=null;
},{passive:true});
workspace.addEventListener('touchcancel',()=>touch=null,{passive:true});
function openDialog(name,html,projectMode=false) {
  modal.classList.toggle('project-dialog',projectMode);
  document.querySelectorAll('video').forEach(video=>video.pause());
  document.querySelector('#detail-title').textContent='▤ '+name;
  document.querySelector('#detail-path').textContent='C:\\OH\\Documents\\'+name;
  content.innerHTML=html;
  modal.showModal();content.scrollTop=0;
}
const projectDetails = {
  comstock: {icon:'crosshair', summary:'5인 팀으로 완성하고 itch.io에 출시한 뱀서라이크 게임입니다.', contributions:[['핵심 구조 설계','부팀장과 게임의 핵심과 틀을 먼저 정리해 팀에 공유했습니다.'],['팀 의견 조율','개인의 선호보다 게임의 핵심에 부합하는지를 기준으로 의견을 정리했습니다.'],['개발 범위 조정','일정과 최종 목표를 확인하고 초기 아이템·무기 구성을 조정했습니다.']], steps:['핵심 정의','팀 기준 공유','범위 조정']},
  tomorrow: {icon:'clock', summary:'2인 팀으로 진행한 방치형 클리커 프로젝트입니다.', contributions:[['업무 분배','팀장으로서 작업을 나누고 프로젝트를 진행했습니다.'],['콘셉트·시스템 기획','콘셉트와 시스템 기획서를 작성했습니다.'],['기능 구현','작성한 기획을 실제 기능 구현으로 연결했습니다.']], steps:['업무 분배','기획서 작성','기능 구현']},
  dice: {icon:'dice', summary:'6인 팀의 부팀장으로 참여한 주사위 보드게임 프로젝트입니다.', contributions:[['일정 관리','팀의 작업 일정을 관리했습니다.'],['콘셉트 방향','프로젝트의 콘셉트 방향성을 제시했습니다.']], steps:['일정 관리','콘셉트 방향']},
  space: {icon:'space', summary:'2인 팀으로 참여해 제18회 한국공간디자인 전국 공모전 특선을 수상한 프로젝트입니다.', contributions:[['건축 구조 기획','접근성을 고려해 공간의 구조를 기획했습니다.'],['공간 배치','이동 동선을 고려해 공간 배치를 계획했습니다.']], steps:['접근성','이동 동선','공간 배치']}
};
function openProject(key) {
  if(key==='contact') {openDialog('Contact.txt','<h2>연락하기</h2><p>게임 기획자 오승명</p>'+contactHTML);return;}
  const project=projects[key], detail=projectDetails[key];if(!project || !detail)return;
  const number=Object.keys(projects).indexOf(key)+1;
  const preview=key==='comstock'
    ? '<div class="project-preview actual-preview"><video id="project-loop" controls muted loop playsinline preload="metadata" poster="assets/desktop/comstock.jpg" src="assets/portfolio/comstock/gameplay.mp4"></video><div class="preview-caption"><span>실제 플레이 영상 · 반복 재생</span><span>COMSTOCK / GAMEPLAY</span></div></div>'
    : `<div class="project-preview concept-preview preview-${key}" role="img" aria-label="${project.name} 기여 내용 개념 애니메이션"><span class="concept-label">CONTRIBUTION MAP / 0${number}</span><svg class="concept-icon" viewBox="0 0 48 48" aria-hidden="true"><use href="#icon-${detail.icon}"/></svg><div class="concept-steps">${detail.steps.map((step,i)=>`<span style="--step:${i}"><b>0${i+1}</b>${step}</span>`).join('')}</div><p>기여 내용을 표현한 개념 애니메이션 · 실제 게임 화면이 아닙니다.</p></div>`;
  const extras=project.extra.replace(/<video[\s\S]*?<\/video>/,'');
  openDialog(project.name,`<div class="project-heading"><span class="folder" aria-hidden="true"><i>0${number}</i></span><div><p>PROJECT FILE / 0${number}</p><h2>${project.name}</h2></div></div><div class="facts">${project.facts.split(' / ').map(fact=>`<span>${fact}</span>`).join('')}</div><div class="project-overview">${preview}<div class="project-contribution"><div class="project-section-label">PROJECT OVERVIEW</div><p class="project-summary">${detail.summary}</p><h3>제가 맡은 일</h3><ol>${detail.contributions.map(([heading,text])=>`<li><h4>${heading}</h4><p>${text}</p></li>`).join('')}</ol></div></div><div class="project-evidence">${extras}</div>`,true);
  document.querySelector('#detail-path').textContent='C:\\OH\\Selected Works\\'+project.name;
  const video=content.querySelector('#project-loop');
  if(video && !reducedMotion.matches) {video.muted=true;video.play().catch(()=>{/* Native controls remain available when autoplay is blocked. */});}
  if(key!=='comstock') {
    const button=document.createElement('button');button.className='retro-button preview-motion-toggle';button.textContent=reducedMotion.matches?'애니메이션 재생':'애니메이션 일시정지';
    const preview=content.querySelector('.concept-preview');preview.classList.toggle('motion-paused',reducedMotion.matches);
    button.addEventListener('click',()=>{const paused=preview.classList.toggle('motion-paused');button.textContent=paused?'애니메이션 재생':'애니메이션 일시정지';});
    preview.append(button);
  }
}
function openScans(button) {
  const items=JSON.parse(button.dataset.mediaItems);
  openDialog(button.dataset.mediaTitle,'<div class="scan-pagination"><button id="scan-prev" class="retro-button" aria-label="이전 자료">← 이전</button><span id="scan-position" aria-live="polite"></span><button id="scan-next" class="retro-button" aria-label="다음 자료">다음 →</button></div><figure id="scan-sheet"></figure>');
  let index=0;
  function render() {
    const image=document.createElement('img');image.src=items[index].src;image.alt=items[index].alt;image.className='scan';
    document.querySelector('#scan-sheet').replaceChildren(image);
    document.querySelector('#scan-position').textContent=`${index+1} / ${items.length}`;
    document.querySelector('#scan-prev').disabled=index===0;
    document.querySelector('#scan-next').disabled=index===items.length-1;
    content.scrollTop=0;
  }
  document.querySelector('#scan-prev').onclick=()=>{index--;render()};
  document.querySelector('#scan-next').onclick=()=>{index++;render()};render();
}
document.querySelector('#close-detail').addEventListener('click',()=>modal.close());
modal.addEventListener('close',()=>{content.querySelectorAll('video').forEach(v=>v.pause());content.replaceChildren();wheelAmount=0;lockedUntil=performance.now()+400;});
function updateClock(){document.querySelector('#clock').textContent=new Intl.DateTimeFormat('ko-KR',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Asia/Seoul'}).format(new Date())}
updateClock();setInterval(updateClock,30000);fromHash('replace');

// A first-visit tray tip, available again on hover, focus or tap.
const wheelHelpButton = document.querySelector('#wheel-help-toggle');
const wheelHelp = document.querySelector('#wheel-help');
const wheelAssistant = document.querySelector('.wheel-assistant');
let helpPinned = false, helpHovered = false, helpFocused = false, helpIntro = false;
let helpTimer;
function renderWheelHelp() {
  const open = helpPinned || helpHovered || helpFocused || helpIntro;
  wheelHelp.hidden = !open;
  wheelHelpButton.setAttribute('aria-expanded', String(open));
}
function dismissWheelHelp() {
  helpPinned = helpHovered = helpFocused = helpIntro = false;
  clearTimeout(helpTimer);
  renderWheelHelp();
}
wheelAssistant.addEventListener('pointerenter', event => {
  if(event.pointerType === 'mouse') {helpHovered = true;renderWheelHelp();}
});
wheelAssistant.addEventListener('pointerleave', event => {
  if(event.pointerType === 'mouse') {helpHovered = false;renderWheelHelp();}
});
wheelAssistant.addEventListener('focusin', () => {helpFocused = true;renderWheelHelp();});
wheelAssistant.addEventListener('focusout', event => {
  if(!wheelAssistant.contains(event.relatedTarget)) {helpFocused = false;renderWheelHelp();}
});
wheelHelpButton.addEventListener('click', () => {
  if(helpPinned) dismissWheelHelp();
  else {helpPinned = true;helpIntro = false;clearTimeout(helpTimer);renderWheelHelp();}
});
document.querySelector('#wheel-help-close').addEventListener('click', () => {
  wheelHelpButton.focus({preventScroll:true});dismissWheelHelp();
});
document.addEventListener('pointerdown', event => {
  if(!wheelAssistant.contains(event.target)) dismissWheelHelp();
});
document.addEventListener('keydown', event => {
  if(event.key === 'Escape' && !wheelHelp.hidden) {
    if(wheelHelp.contains(document.activeElement)) wheelHelpButton.focus({preventScroll:true});
    dismissWheelHelp();
  }
});
try {
  if(!sessionStorage.getItem('portfolio-wheel-tip-seen')) {
    sessionStorage.setItem('portfolio-wheel-tip-seen','1');
    helpIntro = true;renderWheelHelp();
    helpTimer = setTimeout(() => {helpIntro = false;renderWheelHelp();},6500);
  }
} catch { /* Hover, keyboard focus and tap still work without storage. */ }
