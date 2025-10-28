# Wiz Works - AI 업무 자동화 도구

Claude AI를 활용한 업무 자동화 및 시각화 보고서 생성 도구입니다.

## 주요 기능

### 1. 시각화 보고서 생성 ✅
- CSV, JSON, 텍스트 데이터를 업로드하여 자동 분석
- Claude AI가 데이터에서 인사이트 추출
- 인터랙티브 차트 생성 (막대, 선, 원형)
- 주요 인사이트 및 추천사항 제공

### 2. 향후 기능 (개발 예정)
- 문서 분석 (PDF, Excel)
- Playwright를 활용한 웹 자동화
- 스케줄링 및 반복 작업

## 기술 스택

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: TailwindCSS
- **AI**: Claude 3.5 Sonnet (Anthropic API)
- **Charts**: Recharts
- **Icons**: Lucide React

## 시작하기

### 1. 환경 설정

`.env.example` 파일을 복사하여 `.env` 파일을 생성합니다:

```bash
cp .env.example .env
```

`.env` 파일에 Claude API 키를 입력합니다:

```
ANTHROPIC_API_KEY=your_api_key_here
```

> Claude API 키는 [Anthropic Console](https://console.anthropic.com/)에서 발급받을 수 있습니다.

### 2. 패키지 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인합니다.

## 프로젝트 구조

```
wiz works/
├── app/
│   ├── api/
│   │   ├── analyze/      # 데이터 분석 API
│   │   └── report/       # 보고서 생성 API (스트리밍)
│   ├── reports/          # 시각화 보고서 페이지
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── DataInput.tsx           # 데이터 입력 컴포넌트
│   ├── VisualizationChart.tsx  # 차트 시각화 컴포넌트
│   └── InsightsPanel.tsx       # 인사이트 패널 컴포넌트
├── lib/
│   └── claude.ts         # Claude API 클라이언트
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 사용 방법

### 시각화 보고서 생성

1. 홈페이지에서 "시각화 보고서" 카드를 클릭합니다
2. 데이터를 입력하는 방법:
   - **파일 업로드**: CSV 또는 TXT 파일을 드래그 앤 드롭
   - **직접 입력**: 텍스트 영역에 데이터를 직접 입력

3. 분석 요청사항을 입력합니다 (예: "월별 매출 트렌드를 분석해주세요")
4. "분석 시작" 버튼을 클릭합니다
5. Claude가 분석 결과와 함께 차트를 생성합니다

### 데이터 형식 예시

**CSV 형식:**
```
name,value
1월,4000
2월,3000
3월,5000
```

**JSON 형식:**
```json
[
  {"name": "서울", "value": 100},
  {"name": "부산", "value": 80},
  {"name": "대구", "value": 60}
]
```

**텍스트 형식:**
```
지난달 매출은 1000만원이었고 이번달은 1200만원입니다.
고객 만족도는 85%에서 90%로 상승했습니다.
```

## API 엔드포인트

### POST /api/analyze
데이터를 분석하고 인사이트를 반환합니다.

**요청:**
```json
{
  "data": "분석할 데이터",
  "prompt": "분석 요청사항"
}
```

**응답:**
```json
{
  "insights": ["인사이트 1", "인사이트 2"],
  "summary": "전체 요약",
  "chartData": [
    {"name": "항목1", "value": 100},
    {"name": "항목2", "value": 80}
  ],
  "recommendations": ["추천사항 1", "추천사항 2"]
}
```

### POST /api/report
보고서를 생성하고 스트리밍으로 반환합니다.

**요청:**
```json
{
  "data": "보고서 기반 데이터",
  "reportType": "summary" | "detailed" | "presentation"
}
```

**응답:** 텍스트 스트림 (Server-Sent Events)

## 향후 개발 계획

### Phase 2: 문서 분석
- [ ] PDF 파일 업로드 및 텍스트 추출
- [ ] Excel 파일 파싱 및 다중 시트 지원
- [ ] 이미지 내 텍스트 인식 (OCR)

### Phase 3: 자동화 워크플로우
- [ ] Playwright 통합
- [ ] 웹 스크래핑 자동화
- [ ] 스케줄링 시스템
- [ ] 이메일 자동 발송

### Phase 4: 협업 기능
- [ ] 사용자 인증 (NextAuth.js)
- [ ] 보고서 공유 기능
- [ ] 실시간 협업 편집

## 배포

### Vercel에 배포 (권장)

1. GitHub에 프로젝트를 푸시합니다
2. [Vercel](https://vercel.com)에서 프로젝트를 임포트합니다
3. 환경 변수 `ANTHROPIC_API_KEY`를 설정합니다
4. 자동으로 배포됩니다

### 로컬 빌드

```bash
npm run build
npm start
```

## 라이선스

MIT License

## 문의

프로젝트에 대한 문의사항이나 버그 리포트는 이슈를 생성해주세요.
