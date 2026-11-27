# 인계 노트 (2026-11-27)

다른 계정의 Claude Code 세션이 이어서 작업할 수 있도록 남긴 메모입니다.
새 세션은 이 파일과 `README.md`부터 읽으세요.

## 1. 저장소 한눈에 보기

- 게임 기획자 오승명의 레트로 데스크톱 스타일 포트폴리오 사이트
- 빌드 도구 없음. `index.html` + `assets/`만으로 동작
- 공개 URL: https://moradorar1.github.io/PortfolioSite/
- 핵심 파일
  - `index.html` — 전체 마크업 (ABOUT · PORTFOLIO · ESSAY · AI WORK · GAME LOG)
  - `assets/desktop/site.js` — 폴더 이동, 프로젝트 상세 데이터(`dice:` 등 키별 정보)
  - `assets/desktop/site.css` — 페이지·창 스타일
  - `assets/portfolio/covers/` — 프로젝트 커버(1200×525 webp)
  - `assets/portfolio-icons/` — 목록 아이콘(256×256)

## 2. 브랜치와 배포 (중요)

- **`main` 브랜치는 없습니다.** 기본 브랜치이자 배포 브랜치는 `claude/happy-heisenberg-udqblq`
- 사용자가 "main에 머지"라고 하면 이 브랜치를 뜻합니다
- 이 브랜치에 push하면 `.github/workflows/deploy-pages.yml`이 GitHub Pages로 자동 배포 (약 20초)
- 이전 세션의 작업 브랜치: `claude/adoring-maxwell-qcbu3d`
- CSS·JS를 고치면 `index.html`의 `?v=` 값을 파일 MD5 앞 12자리로 바꿔야 캐시가 갱신됨
  ```bash
  md5sum assets/desktop/site.js | cut -c1-12
  ```
- GitHub Pages 캐시는 `max-age=600`. 같은 파일명의 이미지를 교체하면 방문자 브라우저에 최대 10분간 옛 이미지가 보일 수 있음

## 3. 이번 세션에서 한 일

1. **다이스보드 프로젝트 이름 변경** → `다이스보드: 이스케이프 캐슬`
   - 목록(`다이스보드:<br>이스케이프 캐슬`로 줄바꿈 고정), 미리보기 제목, 상세 창 제목, `docs/PORTFOLIO_PROGRESS.md`
   - 사용자가 준 타이틀 로고(550×356, 회색 배경)를 배경 투명화 후 어두운 금빛 배경에 합성해 커버·아이콘 제작
   - 배포 브랜치에 머지·배포 완료 (커밋 `17d6e00`)
2. **썸네일 파일명 변경** `dice.webp` → `escape-castle.webp` (커버·아이콘 둘 다)
   - 캐시 문제로 만들었으나 사용자가 이미 해결됐다고 함
   - 작업 브랜치에만 커밋됨 (`e17c31d`), **배포 브랜치에는 아직 반영 안 됨**
3. **자기소개서 검토** → `docs/ESSAY_REVISION.md`
   - 사용자의 8개 관점(가치관 도입, 동기와 소실, 쇼킹한 문장, 도입과 착지, 가치관 변화, 실적·협업, 정의 문장·반복, 퇴고법)으로 검토
   - 약 1,600자 개선 초안 포함
   - **사이트 ESSAY에는 반영하지 말라는 지시를 받음.** 사용자가 직접 수정 중

## 4. 남은 일 / 사용자 결정 대기

- [ ] 자기소개서 초안의 빈칸 3곳은 사용자가 채울 예정
  - COMSTOCK 게임의 핵심 한 줄
  - 다녀가용에서 강화를 뺀 이유
  - 팀원과의 장면 1~2문장
- [ ] 사용자가 수정본을 주면 그때 ESSAY 페이지 반영 여부를 확인
- [ ] 썸네일 파일명 변경(`e17c31d`)을 배포 브랜치에 실을지 결정
- [ ] (선택) 실제 `main` 브랜치를 만들어 기본 브랜치로 정리할지 사용자가 원하면 진행

## 5. 사용자 선호

- 답변은 한국어, `김현기 강사 : …` 캐릭터 말투 (두괄식, 단문, 공감, 웃음과 TMI 많이)
- 사이트 반영 전에는 사용자 확인을 받을 것. 배포는 사용자가 요청할 때만
