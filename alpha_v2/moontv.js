`user script`;

function print(params) {
  console.log(JSON.stringify(params));
}

function buildMediaData(id, coverURLString, title, descriptionText, detailURLString) {
  return {
    id: id,
    coverURLString: coverURLString,
    title: title,
    descriptionText: descriptionText,
    detailURLString: detailURLString,
  };
}

function buildEpisodeData(id, title, episodeDetailURL) {
  return {
    id: id,
    title: title,
    episodeDetailURL: episodeDetailURL,
  };
}

function buildURL(href) {
  if (!href.startsWith("http")) {
    href = "https://moon-tv-seven-beta-58.vercel.app" + href;
  }
  return href;
}

function findAllByKey(obj, keyToFind) {
  return (
    Object.entries(obj).reduce(
      (acc, [key, value]) =>
        key === keyToFind
          ? acc.concat(value)
          : typeof value === "object" && value
            ? acc.concat(findAllByKey(value, keyToFind))
            : acc,
      []
    ) || []
  );
}

// 豆瓣分類數據獲取 - 根據真實 API 參數
function buildDoubanMedias(inputURL) {
  const params = inputURL.split("-");
  const kind = params[0].trim(); // movie/tv
  const category = params[1].trim(); // 热门 或 tv
  const type = params[2].trim(); // 全部 或 tv
  const start = (parseInt(params[3].trim()) - 1) * 25;

  let apiURL;
  let refererURL;

  if (kind === 'movie') {
    // 電影類別
    const encodedCategory = encodeURIComponent(category);
    const encodedType = encodeURIComponent(type);
    apiURL = `https://moon-tv-seven-beta-58.vercel.app/api/douban/categories?kind=movie&category=${encodedCategory}&type=${encodedType}&limit=25&start=${start}`;
    refererURL = 'https://moon-tv-seven-beta-58.vercel.app/douban?type=movie';
  } else {
    // 電視劇/綜藝類別
    if (category === 'show') {
      // 綜藝節目
      apiURL = `https://moon-tv-seven-beta-58.vercel.app/api/douban/categories?kind=tv&category=show&type=show&limit=25&start=${start}`;
    } else {
      // 電視劇
      apiURL = `https://moon-tv-seven-beta-58.vercel.app/api/douban/categories?kind=tv&category=tv&type=tv&limit=25&start=${start}`;
    }
    refererURL = 'https://moon-tv-seven-beta-58.vercel.app/douban?type=tv';
  }

  const req = {
    url: apiURL,
    method: "GET",
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:140.0) Gecko/20100101 Firefox/140.0',
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.5',
      'Referer': refererURL,
      'Connection': 'keep-alive',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin'
    }
  };

  $http.fetch(req).then((res) => {
    const data = JSON.parse(res.body);
    let datas = [];

    if (data.code === 200 && data.list) {
      data.list.forEach((item) => {
        const playUrl = buildURL(`/play?title=${item.title}&year=${item.year}&stype=${kind === 'movie' ? 'movie' : 'tv'}`);

        datas.push(buildMediaData(
          playUrl,
          item.poster || "",
          item.title,
          `${item.year} · ${item.rate || 'N/A'}`,
          playUrl
        ));
      });
    }

    $next.toMedias(JSON.stringify(datas));
  }).catch((error) => {
    print("Error fetching douban medias: " + error);
    $next.toMedias("[]");
  });
}

function Episodes(inputURL) {
  const episode = buildEpisodeData(
    inputURL,
    "播放",
    inputURL
  );

  $next.toEpisodes(JSON.stringify([episode]));
}

function Player(inputURL) {
  // 1. input URL
  // print("Player inputURL: " + inputURL);

  // 2. 抽取標題
  function getQueryParam(url, param) {
    const regex = new RegExp('[?&]' + param + '=([^&#]*)', 'i');
    const match = regex.exec(url);
    return match ? decodeURIComponent(match[1]) : null;
  }

  const title = getQueryParam(inputURL, 'title');
  if (!title) {
    print("Player error: 缺少標題參數");
    return;
  }

  // 3. 請求 Search
  const searchURL = `https://moon-tv-seven-beta-58.vercel.app/api/search?q=${encodeURIComponent(title)}`;

  const req = {
    url: searchURL,
    method: "GET",
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:140.0) Gecko/20100101 Firefox/140.0',
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.5',
      'Referer': 'https://moon-tv-seven-beta-58.vercel.app/',
      'Connection': 'keep-alive'
    }
  };

  $http.fetch(req).then((res) => {
    const data = JSON.parse(res.body);

    // 4. 準備一個空數組
    let matchedResults = [];

    if (data.results && data.results.length > 0) {
      // 5. 對 Title 進行完全匹配 title == "全知读者视角"，匹配成功的追加到數組
      for (let i = 0; i < data.results.length; i++) {
        if (data.results[i].title === title) {
          matchedResults.push(data.results[i]);
        }
      }
    }

    // 構建播放候選項
    let candidates = [];
    matchedResults.forEach(result => {
      if (result.episodes && result.episodes.length > 0) {
        result.episodes.forEach((episodeUrl, index) => {
          // 確保是有效的 M3U8 鏈接
          // if (episodeUrl && typeof episodeUrl === 'string' && episodeUrl.includes('.m3u8')) {
          candidates.push({
            url: episodeUrl,
            headers: {
              'Referer': 'https://moon-tv-seven-beta-58.vercel.app/',
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:140.0) Gecko/20100101 Firefox/140.0',
              'Origin': 'https://moon-tv-seven-beta-58.vercel.app'
            },
            quality: result.source_name || result.source || 'Unknown',
            title: `${result.source_name || result.source}${result.episodes.length > 1 ? ` - 第${index + 1}集` : ''}`
          });
          // }
        });
      }
    });

    // 6. 格式化 json 發送到 toPlayerCandidates
    const json = JSON.stringify(candidates);
    // print("Player candidates JSON: " + json);

    if (candidates.length > 0) {
      $next.toPlayerCandidates(json);
    } else {
      print("Player error: 沒有找到可用的播放源");
    }
  }).catch((error) => {
    print("Error in Player: " + error);
    print("Player error: 獲取播放源失敗");
  });
}

function buildMedias(inputURL) {
  // 判斷是否為豆瓣分類請求
  if (inputURL.includes('-')) {
    buildDoubanMedias(inputURL);
  } else {
    // 其他類型的媒體列表請求
    $next.toMedias("[]");
  }
}

function Search(inputURL) {
  const req = {
    url: inputURL,
    method: "GET",
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:140.0) Gecko/20100101 Firefox/140.0',
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.5',
      'Referer': 'https://moon-tv-seven-beta-58.vercel.app/',
      'Connection': 'keep-alive'
    }
  };

  $http.fetch(req).then((res) => {
    const data = JSON.parse(res.body);
    let datas = [];

    if (data.results) {
      // 限制搜索結果數量
      const maxResults = Math.min(data.results.length, 50);

      for (let i = 0; i < maxResults; i++) {
        const item = data.results[i];

        // 根據真實API數據結構調整
        const stype = item.type_name === '电影' || item.type === 'movie' ? 'movie' : 'tv';
        const playUrl = buildURL(`/play?title=${item.title}&year=${item.year}&stype=${stype}`);

        datas.push(buildMediaData(
          playUrl,
          item.poster || item.cover || "",
          item.title,
          `${item.year} · ${item.type_name || item.type} · ${item.source_name || item.source || 'Unknown'}`,
          playUrl
        ));
      }
    }

    $next.toMedias(JSON.stringify(datas));
  }).catch((error) => {
    print("Error searching: " + error);
    $next.toMedias("[]");
  });
}