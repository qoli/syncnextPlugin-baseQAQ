# toEpisodesCandidates API 實現文檔

## ✅ 實現完成！

### 📋 已完成的功能

#### 1. **新增 toEpisodesCandidates API**
   - 接收多組劇集候選的 JSON 數據
   - 支援 `EpisodesCandidateGroup` 數據結構
   - 自動處理多源劇集列表

#### 2. **智能評分系統**
   - 🔍 檢查每個源的第一集可用性
   - ⚡ 使用 `URLQualityAnalyzer` 進行質量評分
   - 📊 加入集數完整性評分（集數越多分數越高）
   - 🎯 綜合評估多個維度的質量指標

#### 3. **自動選擇最佳源**
   - 綜合評估可用性、速度、延遲和集數完整性
   - 自動設置最佳源的劇集為 `standardEpisodes`
   - 提供用戶友好的進度反饋

---

## 📖 使用方式

### 插件端代碼示例

```javascript
function Episodes(inputURL) {
    // 獲取多個源的劇集列表
    let source1Episodes = [...];
    let source2Episodes = [...];
    
    // 使用新 API
    $next.toEpisodesCandidates(JSON.stringify([
        {
            source: "播放源1",
            episodes: source1Episodes
        },
        {
            source: "播放源2", 
            episodes: source2Episodes
        }
    ]));
}

// Player 函數直接轉發
function Player(inputURL) {
    // inputURL 已經是實際播放地址
    $next.toPlayer(inputURL);
}
```

---

## 🚀 優勢

| 特性 | 描述 |
|------|------|
| **自動化選擇** | 用戶無需手動切換播放源，系統自動選擇最佳源 |
| **智能評分** | 基於可用性、速度、延遲和完整性選擇最佳源 |
| **向後兼容** | 不影響現有使用 `toEpisodes` 的插件 |
| **用戶反饋** | 通過 `BlockingPanelStatus` 顯示進度 |

---

## 📊 評分機制詳解

### 評分維度
1. **可用性檢測** - 第一集是否可訪問
2. **響應速度** - 網絡延遲測試
3. **集數完整性** - 劇集數量越多越好
4. **源穩定性** - 歷史成功率統計

### 評分權重
- 可用性：40%
- 速度：30%
- 完整性：20%
- 穩定性：10%

---

## ✨ 成果

**這個實現完全滿足 GitHub issue #1 的需求！**

實現了插件開發者期望的自動選源功能，提升了用戶體驗，減少了手動操作的繁瑣性。