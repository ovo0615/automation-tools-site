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

## 建置檢查

頁面、產生的資料或建置後 HTML 出現下列任一項，建置失敗：卡號、磁碟／網路路徑、private 字樣、受限名稱、控制字元、相對連結、不在 `guard/policy.json` 清單內的圖片。
受限名稱（客戶名、內部代號）在建置時由 `SITE_GUARD_TERMS` 或 `SITE_GUARD_TERMS_FILE` 提供，不進 repo；CI 沒有提供就失敗。

## 聲明

本 repo 為洪敬傑的個人技術作品集，並非虎門科技股份有限公司（TADC）官方帳號。Ansys 為 Ansys, Inc. 的商標；本作品集與 Ansys, Inc. 無官方隸屬關係。
僅供展示，保留所有權利；不授予任何使用、複製或散布本 repo 的權利。
