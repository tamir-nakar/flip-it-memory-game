let isServiceUp;
let gameManager
(async () => {
  console.log('Checking server availability...')
  isServiceUp = await serviceCheck();
  gameManager = new GameManager(9, isServiceUp);
  gameManager.loadScoreboardInBackgroundAsync();
  gameManager.loadBestScore(); // will load best score if saved.
  document.dispatchEvent(new Event('gameManagerReady')); // necessary to solve 'events.js' dependency which is invoked as a js script right after this file in index.html
})();

async function serviceCheck() {
  const res = await fetch("/serviceCheck", {
    method: "GET",
  });
  return res.status === 200;
}
