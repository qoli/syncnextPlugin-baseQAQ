# MoonTV API 監控指南

本文檔記錄了使用 mitmproxy + Firefox 監控 MoonTV 網站 API 請求的完整流程和相關腳本。

## 📋 目錄

1. [環境準備](#環境準備)
2. [腳本文件](#腳本文件)
3. [使用流程](#使用流程)
4. [API 發現](#api發現)
5. [故障排除](#故障排除)
6. [清理操作](#清理操作)

## 🛠️ 環境準備

### 安裝依賴
```bash
# 安裝 mitmproxy
brew install mitmproxy

# 驗證安裝
mitmproxy --version
```

### 環境要求
- macOS 系統
- Python 3.x
- Firefox 瀏覽器
- mitmproxy 12.x+

## 📄 腳本文件

### 1. mitmproxy 監控腳本 (`moontv_mitm.py`)

```python
"""
MoonTV mitmproxy 監控腳本
捕獲並記錄 MoonTV 網站的 API 請求
"""
import json
from datetime import datetime
from mitmproxy import http

class MoonTVMonitor:
    def __init__(self):
        self.requests = []
    
    def request(self, flow: http.HTTPFlow) -> None:
        # 記錄所有請求到 moon-tv 域名的流量
        if "moon-tv" in flow.request.pretty_host or "jisuzyv.com" in flow.request.pretty_host:
            request_data = {
                "timestamp": datetime.now().isoformat(),
                "method": flow.request.method,
                "url": flow.request.pretty_url,
                "headers": dict(flow.request.headers),
            }
            self.requests.append(request_data)
    
    def response(self, flow: http.HTTPFlow) -> None:
        # 記錄響應數據
        if "moon-tv" in flow.request.pretty_host or "jisuzyv.com" in flow.request.pretty_host:
            if self.requests:
                # 為最後一個請求添加響應數據
                last_request = self.requests[-1]
                if last_request["url"] == flow.request.pretty_url:
                    last_request.update({
                        "status_code": flow.response.status_code,
                        "response_headers": dict(flow.response.headers),
                        "response_body": flow.response.text[:500]  # 限制響應體長度
                    })
            
            # 實時保存到文件
            self.save_to_file()
    
    def save_to_file(self):
        output = {
            "capture_time": datetime.now().isoformat(),
            "total_requests": len(self.requests),
            "requests": self.requests
        }
        
        with open('moontv_api_capture.json', 'w', encoding='utf-8') as f:
            json.dump(output, f, ensure_ascii=False, indent=2)

# 創建監控實例
addons = [MoonTVMonitor()]
```

### 2. mitmproxy 啟動腳本 (`start-mitm-monitor.sh`)

```bash
#!/bin/bash

# MoonTV mitmproxy 監控啟動腳本

set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

print_success "🚀 啟動 MoonTV mitmproxy 監控器"
echo ""

print_info "📋 監控配置:"
echo "  - 代理端口: 8080"
echo "  - 監控界面: 終端界面"
echo "  - 腳本: moontv_mitm.py"
echo "  - 輸出文件: moontv_api_capture.json"
echo ""

print_info "🔧 Firefox 代理設置步驟:"
echo "  1. 打開 Firefox 設置 (about:preferences)"
echo "  2. 搜索 '網絡設置' 或 '代理'"
echo "  3. 點擊 '設置' 按鈕"
echo "  4. 選擇 '手動代理配置'"
echo "  5. 設置 HTTP 代理:"
echo "     - 主機: 127.0.0.1"
echo "     - 端口: 8080"
echo "  6. 勾選 '為所有協議使用此代理服務器'"
echo "  7. 勾選 '代理 DNS (使用 SOCKS v5 時)'"
echo ""

print_info "🔒 HTTPS 證書設置:"
echo "  1. 訪問 http://mitm.it"
echo "  2. 下載並安裝 mitmproxy 證書"
echo "  3. 在 Firefox 中信任該證書"
echo ""

print_warning "⚠️  重要提醒:"
echo "  - mitmproxy 會攔截所有 HTTP/HTTPS 流量"
echo "  - 請確保已正確安裝證書才能看到 HTTPS 請求"
echo "  - 按 Ctrl+C 停止監控"
echo ""

# 檢查 mitmproxy 是否可用
if ! command -v mitmproxy &> /dev/null; then
    print_error "mitmproxy 未找到，請先安裝:"
    echo "  brew install mitmproxy"
    exit 1
fi

print_info "🎯 啟動 mitmproxy 監控..."
echo "=================================="

# 啟動 mitmproxy (使用正確的參數格式)
exec mitmproxy \
    --listen-port 8080 \
    --set confdir=~/.mitmproxy \
    --scripts moontv_mitm.py \
    --set console_palette=dark
```

### 3. Firefox 啟動腳本 (`firefox-mitm-friendly.sh`)

```bash
#!/bin/bash

# 啟動 MITM 友好的 Firefox 實例

echo "🚀 啟動 MITM 友好的 Firefox..."

# 創建臨時配置目錄
TEMP_PROFILE=$(mktemp -d)

# 配置文件內容
cat > "$TEMP_PROFILE/prefs.js" << 'EOF'
// 禁用 HSTS
user_pref("security.tls.insecure_fallback_hosts", "moon-tv-seven-beta-58.vercel.app,jisuzyv.com");
user_pref("network.stricttransportsecurity.preloadlist", false);
user_pref("network.stricttransportsecurity.enabled", false);

// 代理設置
user_pref("network.proxy.type", 1);
user_pref("network.proxy.http", "127.0.0.1");
user_pref("network.proxy.http_port", 8080);
user_pref("network.proxy.ssl", "127.0.0.1");
user_pref("network.proxy.ssl_port", 8080);
user_pref("network.proxy.share_proxy_settings", true);

// 禁用證書錯誤
user_pref("security.tls.version.fallback-limit", 1);
user_pref("security.cert_pinning.enforcement_level", 0);
user_pref("network.security.esni.enabled", false);
EOF

echo "✅ 配置已創建，啟動 Firefox..."
echo "📋 代理設置: 127.0.0.1:8080"
echo "🔒 已禁用 HSTS 和證書釘扎"
echo ""

# 啟動 Firefox
/Applications/Firefox.app/Contents/MacOS/firefox \
    -profile "$TEMP_PROFILE" \
    -new-instance \
    "https://moon-tv-seven-beta-58.vercel.app" &

FIREFOX_PID=$!
echo "✅ Firefox 已啟動 (PID: $FIREFOX_PID)"
echo "🎯 已自動導航到 MoonTV"
echo ""
echo "⚠️  這個 Firefox 實例已配置為信任 mitmproxy"
echo "   現在可以安全訪問 HSTS 網站"
echo ""
echo "按 Ctrl+C 關閉 Firefox"

# 等待用戶中斷
trap "kill $FIREFOX_PID 2>/dev/null; rm -rf '$TEMP_PROFILE'; exit" INT TERM

wait $FIREFOX_PID
```

### 4. 監控啟動腳本 (`monitor-moontv.sh`)

```bash
#!/bin/bash

# MoonTV 監控總控腳本

echo "🎬 MoonTV API 監控系統"
echo "======================"

# 啟動 mitmproxy
echo "1. 啟動 mitmproxy..."
./start-mitm-monitor.sh &
MITM_PID=$!

# 等待 mitmproxy 啟動
sleep 3

# 啟動 Firefox
echo "2. 啟動 Firefox..."
./firefox-mitm-friendly.sh &
FIREFOX_PID=$!

echo ""
echo "✅ 監控系統已啟動"
echo "📝 API 捕獲文件: moontv_api_capture.json"
echo "🌐 訪問 MoonTV 網站開始捕獲 API"
echo ""
echo "按 Ctrl+C 停止所有服務"

# 清理函數
cleanup() {
    echo ""
    echo "🛑 正在停止監控系統..."
    kill $MITM_PID $FIREFOX_PID 2>/dev/null
    echo "✅ 已停止所有服務"
    exit 0
}

trap cleanup INT TERM

# 保持腳本運行
wait
```

## 🚀 使用流程

### 1. 啟動監控
```bash
# 方法一：使用總控腳本
./monitor-moontv.sh

# 方法二：分別啟動
./start-mitm-monitor.sh &
./firefox-mitm-friendly.sh
```

### 2. 安裝證書
1. 在 Firefox 中訪問：`http://mitm.it`
2. 下載 "Other" 或 "PEM" 證書
3. 在 Firefox 中：`about:preferences#privacy`
4. 找到 "Certificates" → "View Certificates"
5. "Authorities" → "Import" → 選擇證書
6. 勾選 "Trust this CA to identify websites"

### 3. 開始監控
1. 證書安裝完成後，重新加載 MoonTV 網站
2. 正常瀏覽、搜索、播放視頻
3. 所有 API 請求會實時保存到 `moontv_api_capture.json`

### 4. 分析數據
```bash
# 查看捕獲的請求總數
python3 -c "
import json
with open('moontv_api_capture.json', 'r') as f:
    data = json.load(f)
print(f'總共捕獲了 {data[\"total_requests\"]} 個API請求')
"

# 提取關鍵 API
grep -o 'https://[^"]*' moontv_api_capture.json | sort | uniq
```

## 🔍 API 發現

### 關鍵發現的 API 端點：

1. **搜索 API**
   ```
   GET https://moon-tv-seven-beta-58.vercel.app/api/search?q={query}
   ```

2. **分類列表 API**
   ```
   GET https://moon-tv-seven-beta-58.vercel.app/api/douban/categories?kind={movie|tv}&category={category}&type={type}&limit=20&start=0
   ```

3. **播放頁面**
   ```
   GET https://moon-tv-seven-beta-58.vercel.app/play?title={title}&year={year}&stype={movie|tv}&source={source}&id={id}
   ```

4. **M3U8 播放鏈接**
   ```
   GET https://vv.jisuzyv.com/play/{playId}/index.m3u8
   GET https://vv.jisuzyv.com/play/{playId}/enc.key
   ```

### 播放流程：
```
搜索 API → 完全匹配標題 → 提取 episodes → 直接使用 M3U8 播放
```

### 播放源類型：
- `bfzy` (百分資源)
- `wujinzy` (無極資源)  
- `ffyzy` (飛飛資源)
- `jisu` (極速資源)

## 🛠️ 故障排除

### 問題 1: mitmproxy 啟動失敗
```bash
# 檢查端口佔用
lsof -i :8080

# 殺死佔用進程
pkill -f mitmproxy
```

### 問題 2: Firefox SSL 錯誤
1. 確保已正確安裝 mitmproxy 證書
2. 重啟 Firefox
3. 清除 Firefox 的 HSTS 設置：
   ```
   about:networking#hsts
   ```

### 問題 3: 無法捕獲 HTTPS 請求
1. 檢查證書是否已安裝並信任
2. 確認代理設置正確
3. 重新生成 mitmproxy 證書：
   ```bash
   rm -rf ~/.mitmproxy
   ```

### 問題 4: 捕獲文件為空
1. 檢查 Python 腳本語法
2. 確認域名過濾正確
3. 查看 mitmproxy 終端輸出

## 🧹 清理操作

### 停止監控
```bash
# 停止所有相關進程
pkill -f firefox
pkill -f mitmproxy

# 檢查進程是否已停止
ps aux | grep -E "(firefox|mitm)" | grep -v grep
```

### 清理數據
```bash
# 清空捕獲文件
echo "[]" > moontv_api_capture.json

# 或者備份舊數據
mv moontv_api_capture.json moontv_api_capture_$(date +%Y%m%d_%H%M%S).json.bak
```

### 清理臨時文件
```bash
# 清理 Firefox 臨時配置
rm -rf /tmp/tmp.*/prefs.js

# 清理 mitmproxy 證書（如需重新生成）
rm -rf ~/.mitmproxy
```

## 📝 注意事項

1. **安全提醒**：mitmproxy 會攔截所有流量，請勿在生產環境使用
2. **性能影響**：監控會影響瀏覽速度，完成後及時關閉
3. **數據保護**：捕獲的數據可能包含敏感信息，請妥善保管
4. **證書管理**：完成監控後可選擇移除安裝的證書

## 🔗 相關資源

- [mitmproxy 官方文檔](https://docs.mitmproxy.org/)
- [Firefox 代理設置指南](https://support.mozilla.org/kb/connection-settings-firefox)
- [HTTP/HTTPS 抓包最佳實踐](https://github.com/mitmproxy/mitmproxy)