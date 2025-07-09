import { chromium } from 'playwright';

(async () => {
  const USER_DATA_DIR = './chrome-profile';
  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--disable-features=OverlayScrollbar']
  });

  const page = await context.newPage();
  await page.goto('https://www.google.com');

  const pages = context.pages();
  if (pages.length > 1) {
    await pages[0].close();
  }

  await context.addInitScript(() => {
    const hideIG = () => {
      const IG_SELECTORS = [
        'a[href="/reels/"]',
        'a[href*="/reel/"]',
        'a[href="/explore/"]'
      ];
      IG_SELECTORS.forEach(sel =>
        document.querySelectorAll(sel).forEach(el => (el.style.display = 'none'))
      );
    };

    const hideYT = () => {
      const YT_SELECTORS = [
        '#chips-wrapper',
        '#contents ytd-rich-item-renderer',
        '#secondary',
        'ytd-merch-shelf-renderer',
        'ytd-item-section-renderer',
        'ytd-reel-shelf-renderer'
      ];
      YT_SELECTORS.forEach(sel =>
        document.querySelectorAll(sel).forEach(el => el.remove())
      );
    };

    const run = () => {
      if (location.hostname.includes('instagram.com')) hideIG();
      if (location.hostname.includes('youtube.com')) hideYT();
    };
    run();
    new MutationObserver(run).observe(document, { subtree: true, childList: true });
  });
})();
