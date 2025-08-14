# MoonTV SyncNext 插件

基於實際 API 監控開發的 MoonTV 影視插件，提供穩定的影視資源訪問。

## 🎯 功能特色

### ✅ 已實現功能
- **智能搜索**: 支持影視作品關鍵詞搜索
- **分類瀏覽**: 電影、電視劇、綜藝分類
- **豆瓣整合**: 熱門/最新電影分類，含評分信息
- **多源支持**: 整合多個視頻源，確保播放穩定性
- **自動解析**: 自動獲取播放鏈接和劇集信息

### 🚀 技術亮點
- **API 驅動**: 基於 mitmproxy 監控實際 API 構建
- **多源聚合**: 支持暴風、非凡、極速、魔爪等多個資源
- **智能匹配**: 自動匹配最佳視頻源
- **HLS 支持**: 完整支持 m3u8 流媒體播放

## 📋 插件配置

### 頁面分類
1. **電影** - 熱門電影內容
2. **電視劇** - 熱門電視劇內容  
3. **綜藝** - 綜藝節目內容
4. **熱門電影** - 豆瓣熱門電影
5. **最新電影** - 豆瓣最新電影

### API 端點
- **搜索**: `/api/search?q={keyword}`
- **豆瓣分類**: `/api/douban/categories`
- **播放頁面**: `/play?title={title}&year={year}&stype={type}`

## 🔧 開發說明

### 監控數據來源
本插件基於以下真實監控數據開發：
- 捕獲了 24+ 個實際 API 請求
- 分析了完整的請求/響應結構
- 支持 8+ 個視頻源提供商

### 關鍵實現
```javascript
// 搜索功能
function Search(inputURL) {
  // 直接調用 MoonTV 搜索 API
  $http.fetch({url: inputURL}).then(res => {
    const data = JSON.parse(res.body);
    // 解析並返回結果
  });
}

// 豆瓣分類
function buildHotMedias(inputURL) {
  const apiURL = `https://moon-tv-seven-beta-58.vercel.app/api/douban/categories?...`;
  // 調用豆瓣分類 API
}
```

## 📊 測試結果

### ✅ 搜索測試
- 關鍵詞: "侏羅紀世界"
- 返回結果: 50+ 個相關作品
- 包含多個資源源和年份版本

### ✅ 分類測試  
- 支持電影、電視劇、綜藝分類
- 豆瓣 API 整合正常
- 評分信息顯示完整

### ✅ 播放測試
- 支持 HLS 流媒體格式
- 多源自動切換
- 劇集列表生成正常

## 📦 安裝使用

1. **添加插件源**：
```
https://raw.githubusercontent.com/qoli/syncnextPluginQAQ/main/sourcesv3_qoli.json
```

2. **插件特點**：
- 無需額外配置
- 自動更新內容
- 支持搜索功能
- 多分類瀏覽

## ⚠️ 注意事項

- 插件基於 https://moon-tv-seven-beta-58.vercel.app 服務
- 需要穩定的網絡連接
- 視頻源可能因版權原因變化
- 建議定期更新插件

## 🔄 版本歷史

### v1.0.0 (2025-01-15)
- ✨ 基於 API 監控數據重新開發
- ✅ 完整實現搜索和分類功能  
- 🎯 支持豆瓣評分整合
- 🔧 優化多源播放支持

---

*此插件通過 mitmproxy 實時監控 MoonTV 網站 API 開發，確保與實際服務完全兼容。*