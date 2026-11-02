// Run from the site folder after changing a legal page: node scripts/make-legal-pdfs.js
// (needs Playwright). Update the file names and dates below to the new effective date,
// and keep the old PDFs so earlier versions stay on file.
// Builds legal/<doc>-<effective date>.pdf from the site's own print layout.
const { chromium } = require("playwright");
const SITE = require("path").resolve(__dirname, "..");
const docs = [["terms.html", "terms-2026-10-23.pdf", "Terms of Service", "October 23, 2026"],
              ["privacy.html", "privacy-2026-10-24.pdf", "Privacy Policy", "October 24, 2026"],
              ["sms-terms.html", "sms-terms-2026-09-29.pdf", "SMS Terms", "September 29, 2026"]];
(async () => {
  const b = await chromium.launch();
  for (const [page, out, title, date] of docs) {
    const p = await b.newPage();
    await p.route("**/track.js", (r) => r.abort());
    await p.goto(`file://${SITE}/${page}`);
    await p.emulateMedia({ media: "print" });
    await p.pdf({
      path: `${SITE}/legal/${out}`, format: "Letter", preferCSSPageSize: true, printBackground: false,
      displayHeaderFooter: true, headerTemplate: "<span></span>",
      footerTemplate: `<div style="width:100%;font-size:8px;color:#444;font-family:Georgia,serif;text-align:center">The Overseer's Touch&trade; &middot; ${title} &middot; Effective ${date} &middot; Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>`,
    });
    console.log(out);
  }
  await b.close();
})();
