const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const main = async () => {
  if (process.argv.length < 3) {
    console.log('node sample2.js <url>');
    return;
  }
  const url = process.argv[2];

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // urlのあとのオプション。 waitUntil は下記から選択
  // load: ページ遷移後、ページの load イベントが発生する時まで待つ
  // domcontentloaded: ページ遷移後、ページの DOMContentLoaded イベントが発生する時まで待つ
  // networkidle0: ページ遷移後、500ms の間ネットワーク接続数が 0 になる時まで待つ
  // networkidle2: ページ遷移後、500ms の間ネットワーク接続数が 2 になる時まで待つ
  await page.goto(url, {
    waitUntil: 'networkidle0',
  });

  // evalとか、evaluateで、DOM指定できるはずだけど、上手くいかなかった
  // const content1 = await page.$eval('.slds-page-contents');
  // console.log(content1);
  // const content2 = await page.evaluate(() => {
  //  return document.getElementsByClassName('slids-page-contents')
  // });
  // console.log(content2);

  const html = await page.content();
  const $ = cheerio.load(html);
  const content = $('.slds-page-contents span').text()
  console.log(content);

  // おまけでスクリーンショットを./screenShotPage.pngとして保存
  await page.screenshot({path: 'screenShotPage.png'});
  browser.close();
};

main().then(() => {
}).catch((err) => {
  console.log('**** ERROR');
  console.log(err);
  process.exit(0);
});
