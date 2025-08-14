`user script`;

function buildURL(href) {
  if (!href.startsWith("http")) {
    href = "https://moontv.example.com" + href;
  }
  return href;
}

// Main
function buildMedias(inputURL) {
  const req = {
    url: inputURL,
    method: "GET",
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  };

  let datas = [];

  $http.fetch(req).then((res) => {
    const content = tXml.getElementsByClassName(
      res.body,
      "video-item"
    );
    
    content.forEach((dom) => {
      const titleElement = findAllByKey(dom, "title")[0];
      const hrefElement = findAllByKey(dom, "href")[0];
      const coverElement = findAllByKey(dom, "data-src")[0] || findAllByKey(dom, "src")[0];
      const descElement = findAllByKey(dom, "description")[0] || "";

      if (titleElement && hrefElement) {
        const href = buildURL(hrefElement);
        
        datas.push(
          buildMediaData(href, coverElement, titleElement, descElement, href)
        );
      }
    });

    $next.toMedias(JSON.stringify(datas));
  }).catch((error) => {
    print("Error fetching media list: " + error);
    $next.toMedias("[]");
  });
}

function Episodes(inputURL) {
  const req = {
    url: inputURL,
    method: "GET",
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  };

  let datas = [];

  $http.fetch(req).then((res) => {
    const content = tXml.getElementsByClassName(
      res.body,
      "episode-list"
    )[0];

    if (content && content.children) {
      content.children.forEach((episodeElement, index) => {
        const episodeTitle = findAllByKey(episodeElement, "title")[0] || `第${index + 1}集`;
        const episodeHref = findAllByKey(episodeElement, "href")[0];
        
        if (episodeHref) {
          const episodeURL = buildURL(episodeHref);
          datas.push(
            buildEpisodeData(episodeURL, episodeTitle, episodeURL)
          );
        }
      });
    }

    $next.toEpisodes(JSON.stringify(datas));
  }).catch((error) => {
    print("Error fetching episodes: " + error);
    $next.toEpisodes("[]");
  });
}

function Player(inputURL) {
  const req = {
    url: inputURL,
    method: "GET",
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Referer': 'https://moontv.example.com/'
    }
  };

  $http.fetch(req).then((res) => {
    // 尋找播放源
    const videoUrlPattern = /(?:src|url)["']?\s*[:=]\s*["']([^"']+\.(?:m3u8|mp4|flv|mkv)[^"']*)/gi;
    const matches = res.body.match(videoUrlPattern);
    
    if (matches && matches.length > 0) {
      let videoUrl = matches[0].replace(/.*["']([^"']+)["'].*/, '$1');
      
      if (!videoUrl.startsWith('http')) {
        videoUrl = buildURL(videoUrl);
      }
      
      const playerData = {
        url: videoUrl,
        type: 'auto',
        headers: {
          'Referer': 'https://moontv.example.com/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      };
      
      $next.toPlayer(JSON.stringify(playerData));
    } else {
      print("No video source found");
      $next.toPlayer('{"error": "No video source found"}');
    }
  }).catch((error) => {
    print("Error fetching player: " + error);
    $next.toPlayer('{"error": "Failed to fetch video source"}');
  });
}

function Search(inputURL) {
  const req = {
    url: inputURL,
    method: "GET",
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  };

  let datas = [];

  $http.fetch(req).then((res) => {
    const content = tXml.getElementsByClassName(
      res.body,
      "search-result-item"
    );
    
    content.forEach((dom) => {
      const titleElement = findAllByKey(dom, "title")[0];
      const hrefElement = findAllByKey(dom, "href")[0];
      const coverElement = findAllByKey(dom, "data-src")[0] || findAllByKey(dom, "src")[0];
      const descElement = findAllByKey(dom, "description")[0] || "";

      if (titleElement && hrefElement) {
        const href = buildURL(hrefElement);
        
        datas.push(
          buildMediaData(href, coverElement, titleElement, descElement, href)
        );
      }
    });

    $next.toMedias(JSON.stringify(datas));
  }).catch((error) => {
    print("Error searching: " + error);
    $next.toMedias("[]");
  });
}