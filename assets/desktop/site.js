const projects={
comstock:{name:'COMSTOCK',facts:'뱀서라이크 / 5인 팀 / 팀장 · 기획 리드',text:'부팀장과 함께 게임의 핵심과 틀을 먼저 설계해 공유하고, 의견이 갈릴 때에는 게임의 핵심에서 벗어나지 않는가를 기준으로 정리했습니다. 일정 안에 초기 아이템과 무기 구성을 모두 담기 어렵다고 판단했을 때 팀과 최종 목표를 다시 확인하고 범위를 조정했습니다.',extra:'<video controls playsinline preload="metadata" poster="assets/desktop/comstock.jpg" src="assets/portfolio/comstock/gameplay.mp4"></video><p>itch.io 출시 · 플레이 가능 / 다운로드 수 집계 예정</p><a class="retro-button" href="https://noah-kim.itch.io/comstock-zombie-survival" target="_blank" rel="noopener noreferrer">itch.io에서 플레이 ↗</a>'},
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
const labels = ['INTRO','PORTFOLIO','PROFILE','RESUME','ESSAY','GAME LOG'];
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
  navLinks.forEach((link,i) => {
    link.classList.toggle('active',i === index);
    if(i === index) link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  });
  [...tasks.children].forEach((button,i) => {
    button.classList.toggle('active',i === index);
    button.setAttribute('aria-pressed',String(i === index));
  });
  document.querySelector('#page-counter').textContent = `${String(index+1).padStart(2,'0')} / 06`;
  document.querySelector('#folder-path').textContent = 'C:\\OH\\' + labels[index].replace(' ', '_');
  const folderPosition = document.querySelector('#folder-position');
  folderPosition.value = index;
  folderPosition.setAttribute('aria-valuetext', `${labels[index]}, 6개 중 ${index+1}번째 폴더`);
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
document.querySelector('#folder-position').addEventListener('input', event => go(Number(event.target.value)));
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
  if(event.touches.length!==1 || event.target.closest('video,button,a')) {touch=null;return;}
  touch={x:event.touches[0].clientX,y:event.touches[0].clientY};
},{passive:true});
workspace.addEventListener('touchend',event => {
  if(!touch || modal.open) return;
  const dx=event.changedTouches[0].clientX-touch.x,dy=event.changedTouches[0].clientY-touch.y;
  if(Math.abs(dx)>65 && Math.abs(dx)>Math.abs(dy)*1.5) go(current+(dx<0?1:-1),true);
  touch=null;
},{passive:true});
workspace.addEventListener('touchcancel',()=>touch=null,{passive:true});
function openDialog(name,html) {
  document.querySelectorAll('video').forEach(video=>video.pause());
  document.querySelector('#detail-title').textContent='▤ '+name;
  document.querySelector('#detail-path').textContent='C:\\OH\\Documents\\'+name;
  content.innerHTML=html;
  modal.showModal();content.scrollTop=0;
}
function openProject(key) {
  if(key==='contact') {openDialog('Contact.txt','<h2>연락하기</h2><p>게임 기획자 오승명</p>'+contactHTML);return;}
  const project=projects[key];if(!project)return;
  const number=Object.keys(projects).indexOf(key)+1;
  openDialog(project.name,`<div class="project-heading"><span class="folder" aria-hidden="true"><i>0${number}</i></span><div><p>PROJECT FILE / 0${number}</p><h2>${project.name}</h2></div></div><div class="facts">${project.facts.split(' / ').map(fact=>`<span>${fact}</span>`).join('')}</div><div class="project-section-label">MY ROLE & CONTRIBUTION</div><p class="project-body">${project.text}</p>${project.extra}`);
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
