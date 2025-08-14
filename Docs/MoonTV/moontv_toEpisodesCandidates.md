調整流程：

按照 `toEpisodesCandidates.md` 文檔，
現在 Syncnext 有 $next.toEpisodesCandidates

所以我們要重寫 Episodes 的實現了。

1. 在 Search API 會返回如下的數據

### Search 數據
```json
{
  "results": [
    {
      "id": "59861",
      "title": "生万物",
      "poster": "https://vip.dytt-img.com/upload/vod/20250813-1/f722b2685a02a9b8a1b90b2c5e2a9c4c.jpg",
      "episodes": [
        "https://vip.dytt-cinema.com/20250813/30075_cd0e9d01/index.m3u8",
        "https://vip.dytt-cinema.com/20250813/30076_6b18d371/index.m3u8",
        "https://vip.dytt-cinema.com/20250813/30077_a1b2e04c/index.m3u8",
        "https://vip.dytt-cinema.com/20250813/30078_b532f0f8/index.m3u8",
        "https://vip.dytt-cinema.com/20250813/30079_68c20262/index.m3u8",
        "https://vip.dytt-cinema.com/20250814/30201_5e5c6be7/index.m3u8",
        "https://vip.dytt-cinema.com/20250814/30202_ac4e3687/index.m3u8",
        "https://vip.dytt-cinema.com/20250814/30209_0f47d8af/index.m3u8"
      ],
      "source": "dyttzy",
      "source_name": "电影天堂资源",
      "class": "剧情",
      "year": "2025",
      "desc": "《生万物》根据荣获第三届人民文学奖的长篇小说《缱绻与决绝》改编，以鲁南农村土地变迁为背景，讲述了以宁绣绣、封大脚、费左氏为代表的宁、封、费三个家族、两代人的兴衰史。天牛庙村村民为同一片土地不断努力，是跨越多年打不散的邻里情，也是老一辈农民对土地的敬畏与依恋。",
      "type_name": "国产剧",
      "douban_id": 36689591
    },
    {
      "id": "56340",
      "title": "生万物",
      "poster": "https://ps.ryzypics.com/upload/vod/20250813-1/3df6ee256aafe6d811cb2126a3a3b31a.webp",
      "episodes": [
        "https://cdn.ryplay11.com/20250813/183369_1df1622d/index.m3u8",
        "https://cdn.ryplay11.com/20250813/183368_7fd9ffab/index.m3u8",
        "https://cdn.ryplay11.com/20250813/183367_4fff7d88/index.m3u8",
        "https://cdn.ryplay11.com/20250813/183366_f9497899/index.m3u8",
        "https://cdn.ryplay11.com/20250813/183365_9f51e444/index.m3u8",
        "https://cdn.ryplay11.com/20250814/183424_6dac5ff2/index.m3u8",
        "https://cdn.ryplay11.com/20250814/183423_f4abef93/index.m3u8",
        "https://cdn.ryplay11.com/20250814/183422_6859c74e/index.m3u8"
      ],
      "source": "ruyi",
      "source_name": "如意资源",
      "class": "剧情",
      "year": "2025",
      "desc": "每天 19:30 点更 2\n《生万物》根据荣获第三届人民文学奖的长篇小说《缱绻与决绝》改编，以鲁南农村土地变迁为背景，讲述了以宁绣绣、封大脚、费左氏为代表的宁、封、费三个家族、两代人的兴衰史。天牛庙村村民为同一片土地不断努力，是跨越多年打不散的邻里情，也是老一辈农民对土地的敬畏与依恋。",
      "type_name": "国产剧",
      "douban_id": 36689591
    },
  ]
```

2. 整理數據成為 toEpisodesCandidates 的接受數據結構

### toEpisodesCandidates 數據結構
```json
  [
    {
      "source": "播放源 1",
      "episodes": [
        {
          "id": "ep1",
          "title": "第 1 集",
          "episodeDetailURL": "https://source1.com/play/ep1.m3u8"
        },
        {
          "id": "ep2",
          "title": "第 2 集",
          "episodeDetailURL": "https://source2.com/play/ep2.m3u8"
        }
      ]
    },
    {
      "source": "播放源 2",
      "episodes": [
        {
          "id": "ep1-backup",
          "title": "第 1 集",
          "episodeDetailURL": "https://backup.com/play/ep1.m3u8"
        }
      ]
    }
  ]
```

