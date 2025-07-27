const CHECK_INTERVAL_MS = 1000;
let lastAdState = false;

function isAdPlaying() {
  const videoPlayer = document.querySelector('video');
//  const isMuted = videoPlayer.muted;// 広告が出る前の配信のミュートを検知できる可能性あるか？ ・広告中の配信音声を出せないか？
  const isAdBannerVisible = !!document.querySelector('[data-test-selector="ad-banner-default-text"]');
  const isAdPlaying = isAdBannerVisible || videoPlayer.src.includes('ads');
//  if (isAdBannerVisible) console.log("[TAM7] isAdBannerVisible")// ;なくね？Ad中表示されたのを確認
  return isAdPlaying;
}

function unmuteVideoPlayer() {
  const videos = document.querySelectorAll('video');
  videos.forEach((video, idx) => {
    if (!video) return;

    // 各 video 要素の広告検出条件
    const isAd = video.src.includes('ads') ||
      video.dataset.adMetadata !== undefined ||
      document.querySelector('.ad-banner') !== null;

    if (isAd) return;
    video.muted = false;
    console.log(`[Twitch Ad Muter] video[${idx}] 広告でないビデオ検出 → ミュート解除`);//[0-1]どちらも解除ログあり　しかし広告のみミュートになってた
  });
}

setInterval(() => {
  console.log("[TAM7] 1000ms 動作中");
  const btn = document.querySelector('.claimable-bonus__icon');// Bonus btn
  if (btn) btn.click();
  if (btn) console.log("[TAM7] ボタン検出 → クリック");
  const video = document.querySelector('video');
  if (!video) return false;
  const adDetected = isAdPlaying();
  if (adDetected && !lastAdState) {
    unmuteVideoPlayer();
    video.muted = true;
    video.playbackRate = 1.1;//3倍は体感相当早いんだけど+10とかしたときと同じで読み込み時間で実質変わらないかむしろ遅い
//    video.currentTime += 199;//データの送受信が指定時間分不要になってそうだけど、広告の時間ぴったりの指定ができないし、画面が動かなくて退屈
    console.log("[Twitch Ad Muter] 広告検出 → ミュート");
  } else if (!adDetected && lastAdState) {
//    muteVideoPlayer(false);
    video.muted = false;
    video.playbackRate = 1.0;
    console.log("[Twitch Ad Muter] 広告終了 → ミュート解除");
  }

  lastAdState = adDetected;
}, CHECK_INTERVAL_MS);
