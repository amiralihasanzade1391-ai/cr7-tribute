const https = require("https");

const queries = [
  "UEFA Champions League trophy",
  "Coupe des clubs champions européens",
  "FIFA World Cup Trophy",
  "Coppa Campioni",
  "Cristiano Ronaldo 2003",
  "Cristiano Ronaldo 2004",
  "Cristiano Ronaldo 2008",
  "Cristiano Ronaldo Real Madrid 2017",
  "Cristiano Ronaldo Real Madrid 2014",
  "Cristiano Ronaldo Euro 2016 trophy",
  "Cristiano Ronaldo 2018 Juventus",
  "Golden Foot Cristiano Ronaldo",
  "European Golden Shoe"
];

async function search(q) {
  return new Promise((resolve) => {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrnamespace=6&gsrlimit=3&prop=imageinfo&iiprop=url&format=json`;
    https.get(url, { headers: { "User-Agent": "CR7Tribute/1.0 (info@cr7office.ir)" } }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          const urls = [];
          if (json.query && json.query.pages) {
            for (const key of Object.keys(json.query.pages)) {
              const p = json.query.pages[key];
              if (p.imageinfo && p.imageinfo[0]) {
                urls.push({ title: p.title, url: p.imageinfo[0].url });
              }
            }
          }
          resolve({ query: q, results: urls });
        } catch (e) {
          resolve({ query: q, error: e.message });
        }
      });
    }).on("error", (e) => resolve({ query: q, error: e.message }));
  });
}

(async () => {
  for (const q of queries) {
    const res = await search(q);
    console.log(`\n=== QUERY: ${res.query} ===`);
    if (res.results) {
      res.results.forEach((r) => console.log(`${r.title}: ${r.url}`));
    } else {
      console.log(`Error: ${res.error}`);
    }
  }
})();
