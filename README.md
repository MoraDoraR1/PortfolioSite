# Game Designer Portfolio — 오승명

게임 기획자 오승명의 포트폴리오 사이트입니다. 레트로 데스크톱 화면처럼 폴더와 창으로
구성되어 있고, 빌드 도구 없이 `index.html`과 `assets/`만으로 동작합니다.

## 구조

```
index.html                     # 포트폴리오 본체 (마크업)
assets/
├─ desktop/
│  ├─ base.css, theme.css      # 레트로 데스크톱 기본 스타일 · 색 토큰
│  ├─ site.css                 # 폴더 페이지 · 작업 표시줄 · 문서 창
│  ├─ site.js                  # 폴더 이동(휠 · ← → · 스와이프) · 창 버튼 · 프로젝트 상세
│  ├─ about.css, about.js      # ABOUT 폴더: 겹치는 창 배치 · 드래그 · 데스크톱 도우미 말풍선
├─ fonts/                      # Pretendard(서브셋) · Jersey 10
├─ game-titles/                # GAME LOG 대표 이미지
├─ icons/                      # 기술 스택 아이콘
├─ documents/                  # 공개용 문서 스캔 (자기소개서 3면, 게임분석 5종)
├─ portfolio/                  # 프로젝트 자료 (컴스톡 플레이 영상 등)
└─ profile-oh-seung-myung.jpg  # 프로필 사진
docs/PORTFOLIO_PROGRESS.md     # 작업 현황 / 다음 작업 계획
.github/workflows/deploy-pages.yml  # GitHub Pages 자동 배포(옵션)
```

CSS · JS를 고치면 `index.html`의 `?v=` 값(파일 MD5 앞 12자리)도 바꿔야
브라우저 캐시가 새 파일을 받습니다.

## 폴더

`ABOUT · PORTFOLIO · ESSAY · GAME LOG` 네 폴더가 가로로 이어진 데스크톱입니다.
왼쪽(모바일은 위쪽) 폴더 아이콘, 마우스 휠, ← → 키, 스와이프, 작업 표시줄의
이전/다음 버튼으로 이동합니다.

- **ABOUT**: 데스크톱 도우미 말풍선, `Info.txt`(소개), `Profile.txt`(프로필 · 기술 스택).
  창은 클릭하면 맨 앞으로 오고 제목표시줄로 끌어 옮길 수 있습니다.
  가로 1200px 이하에서는 창이 위아래로 쌓입니다.
- **PORTFOLIO**: 프로젝트 탐색기. 폴더를 열면 상세 창이 뜹니다.
- **ESSAY**: 자기소개서와 원본 스캔.
- **GAME LOG**: 플레이 기록과 게임 분석.

## 폰트 서브셋

`PretendardVariable.subset.woff2`는 원본(`PretendardVariable.woff2`, 2MB)에서
사이트에 쓰인 글자 + 자주 쓰는 한글 2,350자(KS X 1001) + 기본 라틴 · 기호만 남긴
파일(약 470KB)입니다. 목록에 없는 드문 한글 음절은 시스템 글꼴로 표시되니,
그런 글자를 새로 쓰면 아래처럼 다시 만들어 주세요.

```bash
pip install fonttools brotli
python3 - > chars.txt <<'PY'
chars = set()
for f in ['index.html', 'assets/desktop/site.js', 'assets/desktop/about.js']:
    chars |= set(open(f, encoding='utf-8').read())
for cp in range(0xAC00, 0xD7A4):
    try:
        if len(chr(cp).encode('euc-kr')) == 2: chars.add(chr(cp))
    except UnicodeEncodeError: pass
print(''.join(sorted(c for c in chars if ord(c) >= 0x20)))
PY
pyftsubset assets/fonts/PretendardVariable.woff2 --text-file=chars.txt \
  --unicodes="U+0020-007E,U+00A0-00FF,U+2000-206F,U+2190-21FF,U+2460-24FF,U+25A0-25FF,U+3000-303F,U+3130-318F,U+FF01-FF5E" \
  --layout-features+=tnum,case,ss01,ss02,ss03,ss05,ss06,ss07,ss08,zero,cv01,cv02,cv03,cv04,cv05,cv07,cv08,cv09,cv10,cv11,cv12,cv13 \
  --flavor=woff2 --output-file=assets/fonts/PretendardVariable.subset.woff2
```

### 문서·영상 뷰어 (라이트박스)

`ESSAY`와 `GAME LOG`에는 원본 문서를 여는 **자료 보기** 버튼이 연결되어 있습니다.
버튼은 `data-media-items` 속성의 JSON 배열로 이미지/PDF/영상을 넘겨받아 모달로
띄웁니다. 새 자료를 연결하려면:

```html
<button type="button" class="doc-open" data-media-kind="document"
  data-media-title="컴스톡 기획서"
  data-media-caption="한 줄 설명(선택)"
  data-media-items='[
    {"type":"pdf","src":"assets/portfolio/comstock/planning-document.pdf","alt":"기획서"},
    {"type":"image","src":"assets/portfolio/comstock/ui-1.png","alt":"UI 목업"},
    {"type":"video","src":"assets/portfolio/comstock/gameplay.mp4"}
  ]'>
  <span>자료 보기</span>
</button>
```

- `type`: `"image"` | `"pdf"` | `"video"`
- 여러 개를 넣으면 모달 안에서 좌우 화살표로 넘길 수 있습니다.

## 로컬에서 보기

`file://`로 열면 폰트 CORS 경고가 뜰 수 있으니 간단한 로컬 서버를 권장합니다.

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## 배포 (GitHub Pages)

두 가지 방법 중 하나를 선택하세요. **A안(브랜치 배포)** 이 가장 간단합니다.

### A안 — 브랜치에서 바로 배포 (권장, 워크플로 불필요)

1. GitHub 저장소 → **Settings → Pages**
2. **Build and deployment → Source: `Deploy from a branch`**
3. **Branch: `claude/happy-heisenberg-udqblq`**, 폴더: **`/ (root)`** → **Save**
4. 잠시 뒤 아래 URL로 공개됩니다.

### B안 — GitHub Actions로 배포

1. **Settings → Pages → Source: `GitHub Actions`** 선택
2. 이 브랜치에 push하면 `.github/workflows/deploy-pages.yml`이 자동 실행됩니다.

### 공개 URL

```
https://moradorar1.github.io/PortfolioSite/
```

> 경로(`/PortfolioSite/`)는 저장소 이름의 대소문자를 그대로 지켜야 합니다.
> 소문자(`/portfoliosite/`)로는 404가 납니다. 실제 URL은
> Settings → Pages 상단의 "Your site is live at ..." 값을 그대로 사용하세요.

## 공개 전 체크리스트 (개인정보)

- [x] 집주소·연락처가 포함된 **이력서 원본 스캔은 저장소에 포함하지 않음** (`.gitignore` 처리)
- [x] PROFILE에 노출된 전화번호·이메일 공개 결정 (공개용으로 게시)
- [ ] PORTFOLIO 프로젝트별 실제 자료(기획서/영상) 연결
- [ ] 컴스톡 출시 상태·다운로드 수 최신화
- [ ] 데스크톱 · Android · iPhone 최종 검수

자세한 진행 상황은 [`docs/PORTFOLIO_PROGRESS.md`](docs/PORTFOLIO_PROGRESS.md) 참고.
