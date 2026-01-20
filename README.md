# Syncnext Plugin Collection

個人維護的 SyncNext 插件集合，包含多個影片來源插件與訂閱清單。以同步更新、簡潔配置為目標，插件可用性依來源站點狀態而定。

## 專案內容
- `alpha_v2/`：插件實作與對應配置（`.js` + `.json` 同名配對）。
- `sourcesv3_qoli.json`：訂閱清單（多插件聚合）。
- `Docs/`：相關筆記與說明文件。

## 插件列表
以下為目前收錄的插件（對應 `alpha_v2/*.json`）：  

| 插件 | 檔名 | 站點 |
| --- | --- | --- |
| anfuns | `anfuns.json` | https://anfuns.cc |
| 修罗影视 | `bdys.json` | https://xl01.com.de/ |
| grigrilove | `grigri.json` | https://anime.girigirilove.com |
| 咕咕番 | `gugufan.json` | https://www.gugufan.com |
| 星视界 | `histar.json` | https://www.histar.tv |
| 在线之家 | `jojo.json` | https://jiohub.top |
| libvio | `libvio.json` | https://libvio.site/ |
| MoonTV | `moontv.json` | https://moon-tv-seven-beta-58.vercel.app |
| 泥视频 | `nivod.json` | https://www.nivod4.tv |
| 在线之家 | `zxzj.json` | https://www.zxzja.com |
| 模板（非插件） | `base.json` | https://base.abc |

## 插件使用
單一插件格式：
```
syncnextPlugin://https://raw.githubusercontent.com/icy37785/syncnextPlugin/main/alpha_v2/nivod.json
```

完整訂閱（示例）：
- 原版：`https://raw.githubusercontent.com/qoli/syncnext-api/main/sourcesv3.json`
- icy37785：`https://raw.githubusercontent.com/icy37785/syncnextPlugin/main/sourcesv3.json`
- Quinndark：`https://raw.githubusercontent.com/Quinndark/syncnextPlugin/main/sourcesv3.json`

## 插件結構
每個插件包含兩個檔案：
- `.json`：插件 metadata、入口、分類/搜尋頁設定
- `.js`：資料抓取與解析邏輯

常見函式：
- `buildMedias(inputURL)`：首頁或分類列表
- `Episodes(inputURL)`：集數/播放列表
- `Search(inputURL, key)`：搜尋結果（若有）
- `buildURL(href)`：相對路徑轉完整網址

## 開發與測試
安裝依賴：
```
npm install
```

測試（目前腳本指向 `node_Test.js`，尚未提供）：
```
npm test
```

## 注意事項
- 插件 `.json` 與 `.js` 必須同名並保持一致。
- 若來源站點改版/換域名，請同步更新 `.json` 與 `.js`。
- 若新增插件，記得更新 `sourcesv3_qoli.json` 以便訂閱使用。

## 授權
此專案採用 ISC 授權條款。
