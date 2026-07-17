const fs = require('fs');
const path = require('path');
const https = require('https');

const products = [
  "fresh-hilsha-ilish",
  "rui-fish-rohu",
  "premium-katla-fish",
  "river-prawn",
  "premium-beef-bone-in",
  "deshi-chicken",
  "premium-miniket-rice",
  "nazirshail-rice",
  "chinigura-rice",
  "teer-soybean-oil",
  "radhuni-mustard-oil",
  "radhuni-roast-masala",
  "radhuni-turmeric-powder",
  "radhuni-chili-powder",
  "radhuni-coriander-powder",
  "pran-mango-juice",
  "mojo-cola",
  "cleo-drinking-water",
  "speed-energy-drink",
  "milk-vita-pasteurized-milk",
  "aarong-pasteurized-milk",
  "bombay-sweets-potato-crackers",
  "mr-noodles-chicken",
  "bombay-sweets-chanachur",
  "deshi-onion-piyaj",
  "local-garlic-roshun",
  "fresh-ginger-ada",
  "green-chili",
  "red-tomato",
  "fresh-potato",
  "lux-soap",
  "sunsilk-shampoo",
  "meril-petroleum-jelly",
  "close-up-toothpaste",
  "savlon-antiseptic",
  "pran-frooto",
  "ispahani-mirzapore-tea",
  "fresh-salt"
];

const IMAGES_DIR = path.join(__dirname, '../public/images/products');

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filename))
           .on('error', reject)
           .once('close', () => resolve(filename));
      } else {
        res.resume();
        reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
      }
    }).on('error', reject);
  });
}

async function main() {
  console.log("Generating dummy images for all products...");
  for (const slug of products) {
    const webpPath = path.join(IMAGES_DIR, `${slug}.webp`);
    if (fs.existsSync(webpPath)) {
      console.log(`Skipping ${slug}.webp, already exists.`);
      continue;
    }
    
    // Using a reliable placeholder generator
    // we use width and height and some text
    const text = slug.replace(/-/g, ' ').toUpperCase();
    const url = `https://placehold.co/1200x1200/e2e8f0/475569.webp?text=${encodeURIComponent(text)}`;
    
    console.log(`Downloading dummy image for ${slug}...`);
    try {
      await downloadImage(url, webpPath);
    } catch (e) {
      console.error(`Failed to download ${slug}: ${e.message}`);
    }
    
    // Add a slight delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 500));
  }
  console.log("Done generating placeholders.");
}

main();
