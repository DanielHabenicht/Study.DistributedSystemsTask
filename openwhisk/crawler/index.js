const Crawler = require('node-html-crawler');

/**
 * Return a simple greeting message for someone.
 *
 * @param name A person's name.
 * @param place Where the person is from.
 */
function myAction(params) {
  return new Promise(function (resolve, reject) {
    try {
      const crawler = new Crawler({
        domain: params.domain,
        timeout: 500,
      });

      const siteTree = { pages: [], urls: {}, redirects: {}, bad: [] };
      const getFinalStatusCodeOfRedirects = (url) => {
        if (/30\d/.test(siteTree.urls[url])) return getFinalStatusCodeOfRedirects(siteTree.redirects[url]);

        return siteTree.urls[url];
      };

      crawler.crawl();
      crawler.on('data', (data) => {
        siteTree.urls[data.url] = data.result.statusCode;
        siteTree.pages.push({
          url: data.url,
          links: data.result.links,
        });

        process.stdout.write(`\r${crawler.countOfProcessedUrls} out of ${crawler.foundLinks.size}`);

        if (/30\d/.test(data.result.statusCode) && data.result.links[0].url)
          siteTree.redirects[data.url] = data.result.links[0].url;
      });
      crawler.on('error', (error) => console.error(error));
      crawler.on('end', () => {
        siteTree.pages.forEach((page, pageIndex) => {
          const urlOfPage = siteTree.pages[pageIndex].url;

          siteTree.pages[pageIndex].links.forEach((link, linkIndex) => {
            const urlOfLink = siteTree.pages[pageIndex].links[linkIndex].url;

            if (urlOfLink) {
              const hrefOfLink = siteTree.pages[pageIndex].links[linkIndex].href;
              const statusCodeOfLink = /30\d/.test(siteTree.urls[urlOfLink])
                ? getFinalStatusCodeOfRedirects(urlOfLink)
                : siteTree.urls[urlOfLink];

              if (statusCodeOfLink) {
                if (!/20\d/.test(statusCodeOfLink)) {
                  siteTree.bad.push({
                    onPage: urlOfPage,
                    badLink: hrefOfLink,
                    statusCode: statusCodeOfLink,
                  });
                }
              }
            }
          });
        });

        console.log(`\r\nFinish! All ${crawler.foundLinks.size} links on pages on domain ${params.domain} a checked!`);

        resolve({
          domain: params.domain,
          timestamp: new Date(),
          foundLinks: crawler.foundLinks.size,
          badLinks: siteTree.bad,
        });
      });
    } catch (err) {
      console.log(err);
      reject({ error: 'We failed!' });
    }
  });
}

exports.main = myAction;
