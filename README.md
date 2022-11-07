# annot-edit

```bash
// 프로젝트 초기화
npm init
// node에 사용되는 TypeScript의 타입 정의
npm install @types/node --save-dev
// TypeScript 모듈
npm install typescript --save-dev
// 타입스크립트 사용자 정의 모듈 포함하여 빌드
npm install ttypescript --save-dev
// 개발용으로 TypeSript 파일을 단계별로 읽어서 변환하고 바로 실행해주는 모듈
npm install -g ts-node
```

```bash
npm install @pdf-lib/standard-fonts
npm install @pdf-lib/upng
npm install pako
npm install @types/pako --save-dev
npm install tslib
npm install rollup --save-dev
// 타이프스크립트에 대한 엄격한 테스트를 거쳐 가장 완전한 가져오기/요구 경로 재작성기
npm install @zerollup/ts-transform-paths --save-dev
// node_modules에서 써드파티 모듈을 사용하는 용도로 사용, js 외의 확장자 (tx,tsx)를 불러오기 위해서도 필요함
npm install @rollup/plugin-node-resolve --save-dev
// CommonJS 모듈을 es 모듈로 변환하는 플러그인
npm install @rollup/plugin-commonjs --save-dev
// Rollup이 JSON 파일에서 데이터를 가져올 수 있도록 한다.
npm install @rollup/plugin-json --save-dev
// 생성된 es번들을 최소화하기 위한 플러그인
npm install rollup-plugin-terser --save-dev
npx tsc
```

```bash
npm install annotpdf --save-dev
```

## 명령어

- tsc : 타입스크립트를 자바스크립트로 변환할 때 사용하는 명령어
- ttsc

## 파일

- package.json
- tsconfig.json
- rollup.config.js
- tslint.json
- jset.json
- .prettierrc.json
