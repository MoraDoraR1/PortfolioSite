# Game Designer Portfolio — 오승명

게임 기획자 오승명의 단일 페이지(single-page) 포트폴리오 랜딩 사이트입니다.
빌드 도구 없이 `index.html` 하나와 `assets/`만으로 동작합니다.

## 구조

```
index.html                     # 포트폴리오 본체 (HTML + CSS + JS 인라인)
assets/
├─ fonts/                      # Pretendard 본문 폰트
├─ game-titles/                # GAME LOG 대표 이미지
├─ icons/                      # 기술 스택 아이콘
├─ documents/                  # 공개용 문서 스캔 (자기소개서 3면, 게임분석 5종)
└─ profile-oh-seung-myung.jpg  # 프로필 사진
docs/PORTFOLIO_PROGRESS.md     # 작업 현황 / 다음 작업 계획
.github/workflows/deploy-pages.yml  # GitHub Pages 자동 배포(옵션)
```

## 섹션

`INTRO · PROFILE · RESUME · ESSAY · PORTFOLIO · GAME LOG` — PROFILE~GAME LOG는
하나의 가로 스와이프/토글 뷰어로 통합되어 있으며, 상단 목차·좌우 방향키·이전/다음
버튼으로 이동합니다.

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
- PORTFOLIO 4개 프로젝트 카드에는 현재 `자료 준비 중` 비활성 버튼과, 위 형식으로
  교체하는 방법을 담은 `EDITABLE` 주석이 들어 있습니다.

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
- [ ] PROFILE에 노출된 전화번호·이메일의 공개 범위 최종 결정
- [ ] PORTFOLIO 프로젝트별 실제 자료(기획서/영상) 연결
- [ ] 컴스톡 출시 상태·다운로드 수 최신화
- [ ] 데스크톱 · Android · iPhone 최종 검수

자세한 진행 상황은 [`docs/PORTFOLIO_PROGRESS.md`](docs/PORTFOLIO_PROGRESS.md) 참고.
