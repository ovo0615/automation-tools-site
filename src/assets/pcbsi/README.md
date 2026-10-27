# PCB SI 3D Simulation Toolkit 品牌素材

來源：工具本身（入口畫面 TaskPicker 的功能圖示、app icon）。供網站使用，Jeff 2026-10-27 同意公開。

| 檔案 | 用途 |
|---|---|
| `app-icon.svg`、`app-icon-*.png` | 工具 app icon（網站 favicon 用這個） |
| `icons/*.svg` | 16 個功能圖示，viewBox 0 0 64 64，本身帶深色底，色票見下 |

## 功能圖示、中文名稱與分組

分組與順序和工具入口畫面相同（taskConfig.ts）。

| 分組 | 圖示檔 | 功能 |
|---|---|---|
| 準備 | `board.svg` | 載入電路板 |
| 準備 | `cutout.svg` | 局部裁切 |
| 準備 | `stackup.svg` | 疊構 |
| 前處理（選用） | `backdrill.svg` | 背鑽 |
| 前處理（選用） | `cleanup.svg` | Layout 清理 |
| 分析 | `ports.svg` | Port 設定 |
| 分析 | `segment.svg` | N 段分割 |
| 分析 | `schedule.svg` | 排程求解 |
| 分析 | `remotepack.svg` | 遠端求解包 |
| 結果 | `cascade.svg` | 電路串接 |
| 結果 | `sparam.svg` | S 參數 |
| 結果 | `models.svg` | IBIS 模型與眼圖分析 |
| 結果 | `eye.svg` | 眼圖 |
| 結果 | `tdr.svg` | TDR |
| 結果 | `crosssection.svg` | 截面阻抗 |
| 結果 | `report.svg` | HTML 報告 |

## 圖示用色

| 色 | 用途 |
|---|---|
| `#73d6ff`／`#63c5f2` | 主要描邊（亮藍） |
| `#ffbd5a`／`#ffb347` | 重點（橘） |
| `#8fe3aa` | 輔助（綠） |
| `#c3b2ff`／`#b6a4ff` | 輔助（紫） |
| `#132b3b`～`#19394c` | 圖示底色（深藍） |

工具介面字型：`"Calibri", "Microsoft JhengHei", sans-serif`。
