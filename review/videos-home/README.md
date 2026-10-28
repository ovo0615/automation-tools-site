# 影片頁與首頁改版截圖（2026-10-28）

本機 `astro preview` 以 Playwright（Chromium）截整頁圖；桌機 1280px、手機 375px，淺色與深色各一張。

| 頁面 | 桌機淺色 | 桌機深色 | 手機淺色 | 手機深色 |
|---|---|---|---|---|
| 首頁 | home-desktop-light.png | home-desktop-dark.png | home-mobile-light.png | home-mobile-dark.png |
| 影片頁 | videos-desktop-light.png | videos-desktop-dark.png | videos-mobile-light.png | videos-mobile-dark.png |

所有截圖頁面在載入時都沒有 iframe；點縮圖後才建立 youtube-nocookie 播放器，該卡佔整列寬並顯示對應說明連結（以 Playwright 驗證，未截圖，因為此環境連不到 YouTube）。
