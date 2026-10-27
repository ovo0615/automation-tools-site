# 0257 工具品牌元素：改動說明

分支：`claude/0257-brand-elements`（從 `assets/pcbsi-brand` 開出）。沒有推 main、沒有開 PR。
前一輪的小維、標題層次與字級切換都保留；影片相關內容（`videos.json`、影片頁、影片縮圖）沒有動。

## 每項需求怎麼做

| 需求 | 做法 | 檔案 |
|---|---|---|
| 1. 網站 icon | `public/favicon.svg` 換成工具 app icon（去掉註解）；另補 `favicon.ico`（32×32）與 `apple-touch-icon.png`（256），由 `head` 宣告 | `public/favicon.svg`、`public/favicon.ico`、`public/apple-touch-icon.png`、`astro.config.mjs` |
| 2. 右上角 LOGO | 拿掉白底框，直接放透明 PNG。LOGO 是深藍、黑、紫字，任何深色底都看不清，所以深色模式的**標頭**改成淺灰藍 #b4c0cd（標頭內文字與控制改深色，搜尋視窗維持深色）；內文區改為深灰藍，接近工具本身的深色介面 | `src/components/ReadingHeader.astro`、`src/styles/theme.css` |
| 3-1 功能圖示 | 「操作說明」側欄每章前放對應圖示（`chapter()` 加 `data-icon`／`data-group`，CSS 顯示）；快速開始各章 H2 前放同一圖示與分組色細框；功能介紹的「主要功能」表每列加圖示與分組 | `astro.config.mjs`、`src/styles/brand.css`、`src/components/FeatureTable.astro`、`src/components/FeatureIcon.astro`、`src/lib/pcbsi.ts` |
| 3-2 工作流程圖 | 首頁「工作流程」：載入板子 → 裁切 → Port → 分段 → 排程 → 串接 → S 參數／眼圖／TDR → 報告，依準備、分析、結果分組，每步連到快速開始對應章節；下方一行虛線標出前處理（選用）。寬度不足時整組換行，40rem 以下改直排 | `src/components/Workflow.astro`、`src/content/docs/index.mdx` |
| 3-3 分組重點色 | 準備 藍、前處理（選用） 紫、分析 橘、結果 綠。深色直接用工具圖示原色；淺色加深到 4.5：1 以上。只用在分組細線、標籤文字、圖示底框 | `src/styles/brand.css` |
| 3-4 截圖主視覺 | 從既有截圖裁出兩張局部特寫：分段 Layout（首頁）、入口畫面的準備／分析分組（功能介紹）；套簡單的視窗外框（app icon、工具名、最小化／最大化／關閉）；點圖開完整原圖。裁切範圍避開日誌與本機路徑區 | `public/manual/pcb-si/crop-segment-layout.webp`、`public/manual/pcb-si/crop-task-picker.webp`、`src/components/WindowShot.astro`、`guard/policy.json`（核准兩張新圖） |
| 3-5 PCB 走線紋路 | 首頁上方 24rem 高、極淡（淺色 13％、深色 9％）的走線遮罩，下緣淡出。**拿掉方法**：刪除 `src/content/docs/index.mdx` 的 `<PcbTraces />` 與它的 import；樣式全在元件裡 | `src/components/PcbTraces.astro` |

沒有使用漸層色塊、毛玻璃、emoji、圖庫插圖或動畫。設計規範表同步更新於 `DESIGN.md`。

## 對比（WCAG）

| 項目 | 前景／背景 | 對比 |
|---|---|---|
| 淺色 內文／次文／連結 | #202024、#62616c、#6941a5 on #fafafb | 15.6、5.8、6.9 |
| 淺色 分組色 準備／前處理／分析／結果 | #1f6b94、#6447b8、#9a5a00、#2a7543 on #fafafb | 5.6、6.4、5.2、5.4 |
| 深色 內文／次文／連結 | #eef2f6、#a9b4c3、#c9adf5 on #151c25 | 15.2、8.2、8.8 |
| 深色 分組色 | #73d6ff、#c3b2ff、#ffbd5a、#8fe3aa on #151c25 | 10.4、9.1、10.4、11.2 |
| 深色 標頭 站名／控制 | #121a24、#26323f on #b4c0cd | 9.5、7.1 |
| 深色 標頭 vs LOGO 深藍／黑／紫 | #004ea2、#000、#5a2d82 on #b4c0cd | 4.4、11.4、5.3 |

## 驗證

- `npm test`：50／50 通過。
- `npm run build`：fetch-data、資源檢查、source guard、`astro build`、dist guard 都通過；內部連結檢查（`node scripts/check-links.mjs`）0 個壞連結。
- `--external` 外部連結檢查在雲端沙盒內有 9 筆失敗：cadmen.com、YouTube、Microsoft Forms、github.com/ovo0615 被沙盒的對外連線政策擋下（proxy 拒絕連線），都是本次沒有改到的既有連結；請在本機或 CI 再跑一次確認。
- 沙盒建置時用了 `SITE_GUARD_ALLOW_NO_TERMS=1`（沒有限制詞清單）；正式建置時 CI 會帶 `SITE_GUARD_TERMS`。

## 截圖（本資料夾）

| 檔名 | 內容 |
|---|---|
| `home-light.png`、`home-dark.png` | 首頁全頁，1366 寬，淺色／深色 |
| `home-mobile-light.png`、`home-mobile-dark.png` | 首頁，390 寬（淺色為全頁，含直排工作流程） |
| `features-light.png`、`features-dark.png` | 功能介紹頁（淺色為全頁，含圖示表） |
| `features-mobile-dark.png` | 功能介紹頁，390 寬深色 |
| `manual-light.png`、`manual-dark.png` | 快速開始：裁切、分段章節，側欄展開顯示章節圖示 |
| `manual-mobile-light.png` | 快速開始：串接章節，390 寬 |
