function get_url(pid) {
  const time = Date.now();
  const ciphertext = pid + "-" + time;
  const ciphertextBytes = CryptoJS.enc.Utf8.parse(ciphertext);
  const key = CryptoJS.MD5(ciphertext).toString();
  const keyBytes = CryptoJS.enc.Utf8.parse(key.substring(0, 16));
  const encryptedData = CryptoJS.AES.encrypt(ciphertextBytes, keyBytes, {
    mode: CryptoJS.mode.ECB, // 设置成与后端一致的加解密模式
    padding: CryptoJS.pad.Pkcs7, // 设置成与后端一致的填充方式
  });
  const sign = encryptedData.ciphertext.toString().toUpperCase();
  return (
    "https://www.yjys05.com/lines" +
    "?t=" +
    time +
    "&sg=" +
    sign +
    "&pid=" +
    pid
  );
}

function get_body(pid) {
  const time = Date.now();
  const ciphertext = pid + "-" + time;
  const ciphertextBytes = CryptoJS.enc.Utf8.parse(ciphertext);
  const key = CryptoJS.MD5(ciphertext).toString();
  const keyBytes = CryptoJS.enc.Utf8.parse(key.substring(0, 16));
  const encryptedData = CryptoJS.AES.encrypt(ciphertextBytes, keyBytes, {
    mode: CryptoJS.mode.ECB, // 设置成与后端一致的加解密模式
    padding: CryptoJS.pad.Pkcs7, // 设置成与后端一致的填充方式
  });
  const sign = encryptedData.ciphertext.toString().toUpperCase();
  //console.log(sign);
  return "t=" + time + "&sg=" + sign + "&verifyCode=888";
}

function Player(inputURL) {
  let req = {
    url: inputURL,
    method: "GET",
  };

  $http.fetch(req).then((res) => {
    const pid = res.body.match(/pid = (\d+);/)[1];
    //print(get_url(pid));
    req = {
      url: get_url(pid),
      method: "GET",
    };

    $http.fetch(req).then((res) => {
      let _url = JSON.parse(res.body).data.url3;
      if (_url.indexOf("www.yjys05.com") != -1) {
        req = {
          url: "https://www.yjys05.com/god/" + pid + "?type=1",
          method: "POST",
          body: get_body(pid),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        };
        $http.fetch(req).then((res) => {
          const _url = JSON.parse(res.body).url;
          $next.toPlayer(_url);
        });
      } else {
        $next.toPlayer(_url);
      }
    });
  });
}
