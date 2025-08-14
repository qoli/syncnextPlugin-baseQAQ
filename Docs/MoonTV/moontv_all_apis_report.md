# MoonTV 完整 API 分析報告

## 🎯 概覽
通過 mitmproxy 監控成功捕獲了 MoonTV 應用的完整 API 架構。

## 📡 核心 API 端點

### 1. 搜索 API
```
GET /api/search?q={query}
```
- **功能**: 搜索影視內容
- **參數**: `q` (搜索關鍵詞)
- **響應**: 返回匹配的影視作品列表
- **數據結構**:
```json
{
  "results": [
    {
      "id": "96014",
      "title": "侏罗纪世界：重生",
      "poster": "https://img.picbf.com/upload/vod/...",
      "episodes": ["https://8.bf8bf.com/video/.../index.m3u8"],
      "source": "bfzy",
      "source_name": "暴风资源", 
      "class": "动作片",
      "year": "2025",
      "type_name": "电影",
      "douban_id": 36743767
    }
  ]
}
```

### 2. 豆瓣分類 API
```
GET /api/douban/categories?kind={movie/tv/show}&category={類別}&type={類型}&limit={數量}&start={偏移}
```
- **功能**: 獲取豆瓣分類內容
- **參數**:
  - `kind`: movie (電影) / tv (電視劇) / show (綜藝)
  - `category`: 熱門, 最新 等
  - `type`: 全部, 喜劇, 動作 等
  - `limit`: 每頁數量
  - `start`: 分頁偏移
- **響應**: 返回分類內容列表

## 📄 頁面路由

### 1. 首頁
```
GET /
GET /?_rsc={token}
```
- **功能**: 應用主頁
- **返回**: HTML 頁面 或 Next.js RSC 數據

### 2. 搜索頁面
```
GET /search?_rsc={token}
```
- **功能**: 搜索界面組件
- **返回**: Next.js RSC 組件數據

### 3. 播放頁面
```
GET /play?title={標題}&year={年份}&stype={類型}
GET /play?title={標題}&year={年份}&stype={類型}&source={源}&id={ID}
```
- **功能**: 視頻播放頁面
- **參數**:
  - `title`: 影視標題 (URL編碼)
  - `year`: 年份
  - `stype`: movie/tv (類型)
  - `source`: 視頻源標識
  - `id`: 內容ID

### 4. 豆瓣數據頁面
```
GET /douban?type={movie/tv/show}&_rsc={token}
```
- **功能**: 豆瓣內容頁面組件
- **參數**: `type` 指定內容類型

## 🎬 視頻源架構

### 檢測到的視頻源：
1. **8.bf8bf.com** - 暴風資源
2. **vv.jisuzyv.com** - 極速資源  
3. **vip.ffzy-play6.com** - 非凡資源
4. **tyyszywvod5.com** - 天翼資源
5. **mzm3u8.vip** - 麻子資源
6. **hdm3u8.com** - 高清資源
7. **bfikuncdn.com** - 北斗資源
8. **v2.gggread.com** - 光速資源

### 視頻流程：
1. **檢測可用性**: `HEAD` 請求檢查 m3u8 是否可訪問
2. **獲取播放列表**: `GET` 請求下載 index.m3u8
3. **獲取詳細播放列表**: 下載具體品質的 m3u8 文件
4. **獲取解密密鑰**: `GET` 請求獲取 HLS 加密密鑰
5. **流式播放**: 逐個下載 .ts 視頻片段

## 🔧 技術架構

### 前端框架
- **Next.js** - React Server Components (RSC)
- **靜態資源**: `/_next/static/` 路徑下的 CSS/JS 文件

### 數據來源
- **豆瓣 API**: 用於獲取影視評分和海報
- **多源聚合**: 整合多個視頻源提供商
- **圖片 CDN**: 使用多個圖片存儲服務

### 安全機制
- **HLS 加密**: 視頻使用 AES-128 加密
- **防盜鏈**: 部分資源有 Referer 檢查
- **多源備份**: 單一源失效時自動切換

## 📊 API 使用統計

| API 類型 | 端點數量 | 請求頻率 | 用途 |
|---------|---------|---------|------|
| 搜索 API | 1 | 高 | 內容搜索 |
| 分類 API | 1 | 中 | 內容分類瀏覽 |
| 頁面路由 | 7 | 高 | 頁面渲染 |
| 視頻源檢測 | 8+ | 高 | 播放源選擇 |

## 🎯 核心功能總結

1. **內容搜索**: 通過關鍵詞搜索影視作品
2. **分類瀏覽**: 按類型、年份等分類瀏覽
3. **多源播放**: 整合多個視頻源確保可用性
4. **智能切換**: 自動檢測源可用性並切換
5. **加密播放**: 支持 HLS 加密視頻流

## 📈 監控數據
- **總請求數**: 24+ 次
- **成功率**: ~95%
- **響應時間**: <2s
- **視頻源**: 8個主要提供商

---
*此報告基於 mitmproxy 實時監控數據生成，時間：2025-01-15*