# 模擬自動化工具網站

洪敬傑 Ansys 模擬自動化工具的產品網站：功能介紹、版本更新、試用申請與用戶回饋。Astro Starlight 建置，部署到 GitHub Pages。

## 建置

| 步驟 | 指令 |
|---|---|
| 安裝（Node.js 24） | `npm ci` |
| 測試 | `npm test` |
| 建置（抓公開資料 → 檢查 → 建置 → 檢查） | `npm run build` |
| 預覽 | `npm run preview` |

## 內容來源

| 內容 | 來源 |
|---|---|
| 工具清單 | `src/data/tools.json` |
| 頁面 | `src/content/docs/` |
| 版本更新、下載鈕 | 各工具**公開** repo 的 `CHANGELOG.md`（只取 `## v…` 節）與 GitHub Release，建置時抓取 |
| 聯絡方式與表單連結 | `src/data/site.json` |
| 八個固定工具入口 | `src/data/tool-navigation.json` |
| 公開影片 | `src/data/videos.json`；`tool`、`series`（`tool-guide` 工具操作教學／`agent-workflow` AI Agent 流程示範）、`episode`、`label`、`youtubeId`、`title`、`titleZh`、`titleEn`，選填 `duration`（如 `7:29`）、`guide`（對應操作說明章節）；縮圖放 `public/video-thumbs/<youtubeId>.webp`（960×540），並加入 `guard/policy.json` |
| 許願清單／公開路線圖 | `src/data/wishes.json`；`id`、`tool`、`title`、`titleZh`、`status` |
| 已知問題 | `src/data/known-issues.json`；`id`、`tool`、`title`、`titleZh`、`description`、`descriptionZh`、`versions`，選填 `source` |

許願狀態：`received`（已收到）、`evaluating`（評估中）、`planned`（規劃中）、`completed`（已完成）。空清單顯示尚無公開項目，不放示範許願或評價。

表單欄位：`trial`、`bug`、`wish`、`feedback`。填公司 Microsoft Forms HTTPS 網址，未就緒保留 `null`，頁面顯示 Email 與「線上表單準備中」。建置會拒絕其他表單網域、無效影片 ID、重複項目與缺漏內容。

新增影片改資料檔、加縮圖；先確認是頻道已公開影片，並以 `series` 區分流程示範與現版工具操作教學。播放器在點擊後才載入 YouTube iframe。

## 建置檢查

頁面、產生的資料或建置後 HTML 出現下列任一項，建置失敗：卡號、磁碟／網路路徑、private 字樣、受限名稱、控制字元、相對連結、不在 `guard/policy.json` 清單內的圖片。
受限名稱（客戶名、內部代號）在建置時由 `SITE_GUARD_TERMS` 或 `SITE_GUARD_TERMS_FILE` 提供，不進 repo；CI 沒有提供就失敗。

## 聲明

本 repo 為洪敬傑的個人技術作品集，並非虎門科技股份有限公司（TADC）官方帳號。Ansys 為 Ansys, Inc. 的商標；本作品集與 Ansys, Inc. 無官方隸屬關係。
僅供展示，保留所有權利；不授予任何使用、複製或散布本 repo 的權利。
