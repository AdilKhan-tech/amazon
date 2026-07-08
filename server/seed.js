const bcrypt = require("bcryptjs");
const { sequelize, User, Category, Product, Coupon } = require("./models");

function generateProducts() {
  const products = [];
  let slugCounter = 0;

  const makeSlug = (name) => {
    slugCounter++;
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + slugCounter;
  };

  const rand = (min, max) => +(Math.random() * (max - min) + min).toFixed(2);
  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const randRating = () => +(Math.random() * 1.5 + 3.3).toFixed(1);
  const randReviews = () => randInt(50, 50000);
  const randStock = () => randInt(10, 500);

  const electronics = [
    { base: "iPhone 15 Pro", brand: "Apple", prices: [1099, 1599], img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop", extras: ["128GB","256GB","512GB","1TB","Pro","Pro Max","Space Black","Natural Titanium"] },
    { base: "Samsung Galaxy S24", brand: "Samsung", prices: [799, 1399], img: "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=500&h=500&fit=crop", extras: ["Ultra","Plus","Standard","FE","128GB","256GB","Cream","Violet"] },
    { base: "MacBook Air M3", brand: "Apple", prices: [999, 2499], img: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=500&h=500&fit=crop", extras: ["13-inch","15-inch","8GB RAM","16GB RAM","256GB SSD","512GB SSD","Midnight","Starlight"] },
    { base: "Sony Headphones WH-1000XM5", brand: "Sony", prices: [199, 449], img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop", extras: ["Wireless","Wired","Noise Canceling","Sports","Studio","Midnight Blue"] },
    { base: "Apple Watch Series 9", brand: "Apple", prices: [299, 799], img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop", extras: ["GPS","Cellular","41mm","45mm","Ultra","SE","Pink","Silver"] },
    { base: "iPad Pro M2", brand: "Apple", prices: [599, 1899], img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop", extras: ["11-inch","12.9-inch","64GB","256GB","512GB","1TB","WiFi","Cellular"] },
    { base: "JBL Speaker", brand: "JBL", prices: [79, 249], img: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&h=500&fit=crop", extras: ["Charge 5","Flip 6","Xtreme 3","Boombox 3","Clip 4","Mini","Black","Red"] },
    { base: "Dell XPS Laptop", brand: "Dell", prices: [899, 2199], img: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&h=500&fit=crop", extras: ["13-inch","15-inch","17-inch","i5","i7","i9","16GB RAM","32GB RAM"] },
    { base: "AirPods Pro 2", brand: "Apple", prices: [99, 349], img: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500&h=500&fit=crop", extras: ["2nd Gen","USB-C","Lightning","MagSafe","Max","with Case"] },
    { base: "Canon EOS Camera", brand: "Canon", prices: [699, 2999], img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop", extras: ["R6 Mark II","R5","R3","Body Only","24-105mm Kit","50mm Lens"] },
    { base: "Nintendo Switch", brand: "Nintendo", prices: [199, 449], img: "https://images.unsplash.com/photo-1578303512597-41e802396ad0?w=500&h=500&fit=crop", extras: ["OLED","Standard","Lite","Pro Bundle","Neon","Animal Crossing Edition"] },
    { base: "LG OLED TV", brand: "LG", prices: [499, 3499], img: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop", extras: ["42-inch","55-inch","65-inch","77-inch","83-inch","C3","G3"] },
    { base: "Bose Headphones", brand: "Bose", prices: [149, 429], img: "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&h=500&fit=crop", extras: ["QC45","QC Ultra","Sport","Wired","Wireless","700 Series"] },
    { base: "Logitech Mouse", brand: "Logitech", prices: [49, 199], img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop", extras: ["MX Master 3S","MX Anywhere 3","Pebble 2","G Pro X","M720","Ergo M575"] },
    { base: "Google Pixel 8", brand: "Google", prices: [499, 1199], img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop", extras: ["128GB","256GB","Pro","Standard","Fold","Obsidian"] },
    { base: "OnePlus 12", brand: "OnePlus", prices: [399, 899], img: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=500&h=500&fit=crop", extras: ["128GB","256GB","Pro","Standard","R","Silky Black"] },
    { base: "PlayStation 5", brand: "Sony", prices: [199, 799], img: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&h=500&fit=crop", extras: ["Standard","Digital","Slim","Extra Controller","Bundle","Spider-Man Edition"] },
    { base: "Kindle Paperwhite", brand: "Amazon", prices: [59, 299], img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=500&fit=crop", extras: ["8GB","16GB","Signature","Kids","Oasis","Scribe"] },
    { base: "Anker Power Bank", brand: "Anker", prices: [19, 129], img: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop", extras: ["10000mAh","20000mAh","26800mAh","Fast Charge","Wireless","Mini"] },
    { base: "Samsung Smart TV", brand: "Samsung", prices: [299, 2499], img: "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=500&h=500&fit=crop", extras: ["43-inch","50-inch","55-inch","65-inch","75-inch","QLED","Neo QLED"] },
    { base: "Mechanical Keyboard", brand: "Corsair", prices: [49, 249], img: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop", extras: ["K70","K100","K55","RGB","Wireless","Compact"] },
    { base: "Gaming Monitor", brand: "ASUS", prices: [199, 999], img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3ce3?w=500&h=500&fit=crop", extras: ["24-inch","27-inch","32-inch","144Hz","240Hz","4K","Ultrawide"] },
    { base: "Wireless Router", brand: "Netgear", prices: [49, 399], img: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=500&h=500&fit=crop", extras: ["Nighthawk","Mesh","WiFi 6","WiFi 6E","Gaming","Tri-Band"] },
    { base: "External SSD", brand: "Samsung", prices: [39, 299], img: "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=500&h=500&fit=crop", extras: ["500GB","1TB","2TB","4TB","T7","T5","Portable"] },
    { base: "Smart Home Hub", brand: "Amazon", prices: [29, 249], img: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=500&h=500&fit=crop", extras: ["Echo Dot","Echo Show","Echo Studio","Echo Pop","4th Gen","Kids"] },
  ];

  const fashion = [
    { base: "Men's Oxford Shirt", brand: "Amazon Essentials", prices: [14, 79], img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop", extras: ["S","M","L","XL","XXL","Slim Fit"] },
    { base: "Women's Floral Dress", brand: "Zara", prices: [19, 129], img: "https://images.unsplash.com/photo-1434389677669-e08b4cda3a36?w=500&h=500&fit=crop", extras: ["XS","S","M","L","Floral","Solid"] },
    { base: "Men's Slim Jeans", brand: "Levi's", prices: [24, 119], img: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&h=500&fit=crop", extras: ["28x30","30x30","32x30","34x30","36x30","Dark Wash"] },
    { base: "Women's Puffer Jacket", brand: "North Face", prices: [39, 249], img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&h=500&fit=crop", extras: ["XS","S","M","L","Black","Navy"] },
    { base: "Men's Running Shoes", brand: "Nike", prices: [39, 199], img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop", extras: ["US 7","US 8","US 9","US 10","US 11","US 12"] },
    { base: "Women's Sneakers", brand: "Adidas", prices: [29, 179], img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop", extras: ["US 5","US 6","US 7","US 8","US 9","White"] },
    { base: "Men's Wool Blazer", brand: "Hugo Boss", prices: [79, 499], img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=500&fit=crop", extras: ["36R","38R","40R","42R","44R","Navy"] },
    { base: "Women's Silk Blouse", brand: "H&M", prices: [19, 89], img: "https://images.unsplash.com/photo-1551489186-cf8726f514f8?w=500&h=500&fit=crop", extras: ["XS","S","M","L","White","Pink"] },
    { base: "Men's Chino Pants", brand: "Gap", prices: [19, 79], img: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&h=500&fit=crop", extras: ["28","30","32","34","36","Khaki"] },
    { base: "Women's Yoga Leggings", brand: "Lululemon", prices: [29, 128], img: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500&h=500&fit=crop", extras: ["XS","S","M","L","Black","Navy"] },
    { base: "Men's Leather Belt", brand: "Tommy Hilfiger", prices: [14, 65], img: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=500&h=500&fit=crop", extras: ["30","32","34","36","38","Brown"] },
    { base: "Women's Crossbody Bag", brand: "Coach", prices: [39, 299], img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop", extras: ["Small","Medium","Large","Black","Tan","Red"] },
    { base: "Men's Polo Shirt", brand: "Ralph Lauren", prices: [19, 98], img: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500&h=500&fit=crop", extras: ["S","M","L","XL","White","Navy"] },
    { base: "Women's Denim Jacket", brand: "Forever 21", prices: [19, 89], img: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=500&h=500&fit=crop", extras: ["XS","S","M","L","Light Wash","Dark Wash"] },
    { base: "Men's Hoodie", brand: "Champion", prices: [19, 75], img: "https://images.unsplash.com/photo-1556821840-3a5e2ab60d99?w=500&h=500&fit=crop", extras: ["S","M","L","XL","Grey","Black"] },
    { base: "Women's High Heels", brand: "Jimmy Choo", prices: [49, 695], img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=500&fit=crop", extras: ["US 5","US 6","US 7","US 8","US 9","Black"] },
    { base: "Men's Swim Trunks", brand: "Hurley", prices: [14, 65], img: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&h=500&fit=crop", extras: ["S","M","L","XL","Blue","Black"] },
    { base: "Women's Sundress", brand: "Anthropologie", prices: [29, 148], img: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=500&fit=crop", extras: ["XS","S","M","L","Floral","Striped"] },
    { base: "Unisex Sunglasses", brand: "Ray-Ban", prices: [49, 249], img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop", extras: ["Aviator","Wayfarer","Clubmaster","Round","Polarized","Classic"] },
    { base: "Men's Dress Watch", brand: "Fossil", prices: [39, 295], img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=500&fit=crop", extras: ["Analog","Digital","Chronograph","Leather","Steel","Gold"] },
    { base: "Women's Ankle Boots", brand: "Dr. Martens", prices: [49, 249], img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=500&fit=crop", extras: ["US 5","US 6","US 7","US 8","US 9","Black"] },
    { base: "Men's Casual Sneakers", brand: "New Balance", prices: [39, 189], img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop", extras: ["US 7","US 8","US 9","US 10","US 11","Grey"] },
    { base: "Women's Tote Bag", brand: "Michael Kors", prices: [49, 399], img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop", extras: ["Small","Medium","Large","Black","Brown","Navy"] },
    { base: "Men's T-Shirt Pack", brand: "Hanes", prices: [9, 39], img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop", extras: ["3-Pack","5-Pack","White","Black","Assorted","V-Neck"] },
    { base: "Women's Cardigan", brand: "J.Crew", prices: [29, 149], img: "https://images.unsplash.com/photo-1434389677669-e08b4cda3a36?w=500&h=500&fit=crop", extras: ["XS","S","M","L","Beige","Grey"] },
  ];

  const homeKitchen = [
    { base: "Instant Pot", brand: "Instant", prices: [39, 149], img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop", extras: ["3 Qt","6 Qt","8 Qt","Duo","Duo Plus","Evo"] },
    { base: "Floor Lamp", brand: "BrightLamp", prices: [24, 199], img: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=500&h=500&fit=crop", extras: ["LED","Smart","Arc","Torchiere","Reading","Tripod"] },
    { base: "Office Chair", brand: "Herman Miller", prices: [99, 1395], img: "https://images.unsplash.com/photo-1524758631624-e2822e4f4f55?w=500&h=500&fit=crop", extras: ["Aeron","Embody","Sayl","Cosm","Standard","Executive"] },
    { base: "Robot Vacuum", brand: "iRobot", prices: [99, 999], img: "https://images.unsplash.com/photo-1550226891-ef816aed4a98?w=500&h=500&fit=crop", extras: ["i3","j7","s9","Braava jet","Self-Empty","Mop Combo"] },
    { base: "Knife Set", brand: "Wusthof", prices: [29, 399], img: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500&h=500&fit=crop", extras: ["7-pc","10-pc","14-pc","Paring","Chef Set","Block Set"] },
    { base: "Coffee Maker", brand: "Keurig", prices: [39, 299], img: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&h=500&fit=crop", extras: ["K-Classic","K-Mini","K-Elite","K-Supreme","Dual Brew","K-Cafe"] },
    { base: "Air Fryer", brand: "Ninja", prices: [39, 249], img: "https://images.unsplash.com/photo-1648467935424-6c863769d277?w=500&h=500&fit=crop", extras: ["2 Qt","4 Qt","6 Qt","8 Qt","Dual Zone","XL"] },
    { base: "Blender", brand: "Vitamix", prices: [39, 649], img: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500&h=500&fit=crop", extras: ["Classic","Professional","Ascent","Explorian","Personal","Container"] },
    { base: "Bed Sheet Set", brand: "Brooklinen", prices: [39, 299], img: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&h=500&fit=crop", extras: ["Twin","Full","Queen","King","Cal King","400TC"] },
    { base: "Throw Pillow Set", brand: "Crate & Barrel", prices: [9, 89], img: "https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?w=500&h=500&fit=crop", extras: ["16x16","18x18","20x20","Set of 2","Set of 4","Velvet"] },
    { base: "Dinnerware Set", brand: "Corelle", prices: [19, 129], img: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500&h=500&fit=crop", extras: ["12-pc","16-pc","20-pc","Service 4","Service 6","White"] },
    { base: "Cast Iron Skillet", brand: "Lodge", prices: [9, 79], img: "https://images.unsplash.com/photo-1585442245950-4f9ce3a0f95d?w=500&h=500&fit=crop", extras: ["6.5-inch","8-inch","10-inch","12-inch","15-inch","Griddle"] },
    { base: "Standing Desk", brand: "Flexispot", prices: [99, 699], img: "https://images.unsplash.com/photo-1518455027359-f3f8164ba251?w=500&h=500&fit=crop", extras: ["48-inch","55-inch","63-inch","Manual","Electric","L-shaped"] },
    { base: "Bookshelf", brand: "IKEA", prices: [29, 299], img: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=500&h=500&fit=crop", extras: ["3-tier","4-tier","5-tier","Corner","Floating","Ladder"] },
    { base: "Bath Towel Set", brand: "Utopia Bedding", prices: [9, 59], img: "https://images.unsplash.com/photo-1583845112203-2932990d3b21?w=500&h=500&fit=crop", extras: ["Set of 2","Set of 4","Set of 6","Bath Sheet","Hand Towel","Egyptian Cotton"] },
    { base: "Food Storage Set", brand: "Rubbermaid", prices: [9, 49], img: "https://images.unsplash.com/photo-1584572957800-c712e683f15a?w=500&h=500&fit=crop", extras: ["5-pc","10-pc","14-pc","21-pc","Glass","BPA-Free"] },
    { base: "Electric Kettle", brand: "Breville", prices: [24, 199], img: "https://images.unsplash.com/photo-1556228578-0d85b1a2d571?w=500&h=500&fit=crop", extras: ["1L","1.5L","1.7L","Gooseneck","Temp Control","Cordless"] },
    { base: "Toaster Oven", brand: "Cuisinart", prices: [29, 299], img: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500&h=500&fit=crop", extras: ["Compact","Medium","Large","XL","Convection","Digital"] },
    { base: "Area Rug", brand: "Safavieh", prices: [29, 499], img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop", extras: ["2x3","4x6","5x8","6x9","8x10","Runner"] },
    { base: "Wall Art Canvas", brand: "iCanvas", prices: [14, 199], img: "https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=500&h=500&fit=crop", extras: ["12x12","16x20","24x36","30x40","Set of 3","Panoramic"] },
    { base: "Cookware Set", brand: "Calphalon", prices: [49, 499], img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop", extras: ["8-pc","10-pc","14-pc","Nonstick","Stainless","Hard Anodized"] },
    { base: "Mattress", brand: "Casper", prices: [199, 2499], img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&h=500&fit=crop", extras: ["Twin","Full","Queen","King","Cal King","Memory Foam"] },
    { base: "Shower Curtain", brand: "Wamsutta", prices: [9, 49], img: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=500&h=500&fit=crop", extras: ["Standard","Extra Long","Fabric","Plastic","Patterned","Clear"] },
    { base: "Desk Organizer", brand: "SimpleHouseware", prices: [9, 39], img: "https://images.unsplash.com/photo-1518455027359-f3f8164ba251?w=500&h=500&fit=crop", extras: ["Bamboo","Mesh","Wood","Metal","Multi-compartment","Drawer"] },
    { base: "Scented Candle Set", brand: "Yankee Candle", prices: [9, 49], img: "https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=500&h=500&fit=crop", extras: ["3-Pack","6-Pack","Jar","Tart","Pillar","Vanilla"] },
  ];

  const beauty = [
    { base: "Vitamin C Serum", brand: "SkinGlow", prices: [9, 49], img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=500&fit=crop", extras: ["20%","30%","Hyaluronic","Retinol","Organic","Travel"] },
    { base: "Hair Dryer", brand: "Dyson", prices: [29, 599], img: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&h=500&fit=crop", extras: ["Supersonic","Corrale","Airwrap","Travel","Professional","Entry"] },
    { base: "Makeup Brush Set", brand: "MAC", prices: [9, 89], img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&h=500&fit=crop", extras: ["12-pc","16-pc","20-pc","24-pc","Travel","Professional"] },
    { base: "Face Cream", brand: "CeraVe", prices: [9, 49], img: "https://images.unsplash.com/photo-1556228578-0d85b1a2d571?w=500&h=500&fit=crop", extras: ["Daily","Night","SPF 30","Anti-Aging","Sensitive","Oily"] },
    { base: "Perfume EDP", brand: "Chanel", prices: [29, 295], img: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=500&fit=crop", extras: ["50ml","100ml","150ml","Rollerball","Travel","Gift Set"] },
    { base: "Hair Straightener", brand: "GHD", prices: [29, 249], img: "https://images.unsplash.com/photo-1522338242992-e1a54571a9f7?w=500&h=500&fit=crop", extras: ["Classic","Mini","Max","Gold","Platinum+","Flight"] },
    { base: "Foundation Liquid", brand: "Fenty Beauty", prices: [14, 59], img: "https://images.unsplash.com/photo-1599733594230-6b823276abcc?w=500&h=500&fit=crop", extras: ["Fair","Light","Medium","Tan","Deep","Full Coverage"] },
    { base: "Matte Lipstick", brand: "Charlotte Tilbury", prices: [9, 49], img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&h=500&fit=crop", extras: ["Red","Pink","Nude","Berry","Coral","Plum"] },
    { base: "Sunscreen SPF 50", brand: "La Roche-Posay", prices: [9, 39], img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop", extras: ["Face","Body","Sport","Kids","Tinted","Mineral"] },
    { base: "Eye Shadow Palette", brand: "Urban Decay", prices: [14, 69], img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&h=500&fit=crop", extras: ["Naked","Naked 2","Naked 3","Heat","Reloaded","Travel"] },
    { base: "Shampoo Set", brand: "Olaplex", prices: [9, 59], img: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&h=500&fit=crop", extras: ["No.4+5","Bond","Color Care","Hydration","Volume","Travel"] },
    { base: "Face Mask Sheet", brand: "Dr. Jart+", prices: [4, 39], img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&h=500&fit=crop", extras: ["Sheet","Clay","Sleeping","Peel-Off","Set of 5","Set of 10"] },
    { base: "Nail Polish Set", brand: "OPI", prices: [9, 49], img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&h=500&fit=crop", extras: ["6-pk","12-pk","Gel","Classic","Neon","Holiday"] },
    { base: "Beard Kit", brand: "Philips", prices: [14, 89], img: "https://images.unsplash.com/photo-1585751119414-ef2636f8a7ba?w=500&h=500&fit=crop", extras: ["Trimmer","Full Kit","Oil","Balm","Brush","Travel"] },
    { base: "Body Lotion", brand: "Nivea", prices: [4, 29], img: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&h=500&fit=crop", extras: ["200ml","400ml","600ml","Cocoa Butter","Aloe","Shea"] },
    { base: "Skincare Set", brand: "The Ordinary", prices: [14, 89], img: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=500&h=500&fit=crop", extras: ["Basic","Advanced","Anti-Aging","Acne","Hydration","Complete"] },
    { base: "Electric Shaver", brand: "Braun", prices: [29, 399], img: "https://images.unsplash.com/photo-1585751119414-ef2636f8a7ba?w=500&h=500&fit=crop", extras: ["Series 3","Series 5","Series 7","Series 9","Wet&Dry","Travel"] },
    { base: "Hair Color Kit", brand: "L'Oreal", prices: [5, 29], img: "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=500&h=500&fit=crop", extras: ["Blonde","Brown","Black","Red","Auburn","Highlights"] },
    { base: "Facial Cleanser", brand: "Cetaphil", prices: [6, 29], img: "https://images.unsplash.com/photo-1556228578-0d85b1a2d571?w=500&h=500&fit=crop", extras: ["Gentle","Deep Clean","Oil Control","Bright","Sensitive","Foaming"] },
    { base: "Aroma Diffuser", brand: "InnoGear", prices: [9, 49], img: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&h=500&fit=crop", extras: ["100ml","150ml","300ml","500ml","Wood","LED"] },
    { base: "Concealer", brand: "NARS", prices: [14, 49], img: "https://images.unsplash.com/photo-1599733594230-6b823276abcc?w=500&h=500&fit=crop", extras: ["Radiant","Creamy","Matte","Light","Medium","Dark"] },
    { base: "Setting Spray", brand: "NYX", prices: [6, 29], img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=500&fit=crop", extras: ["Matte","Dewy","Long Lasting","Travel","Original","Barrier"] },
    { base: "Hair Oil", brand: "Moroccanoil", prices: [9, 49], img: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&h=500&fit=crop", extras: ["100ml","200ml","Treatment","Light","Hydrating","Travel"] },
    { base: "Body Wash", brand: "Dove", prices: [4, 19], img: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&h=500&fit=crop", extras: ["200ml","400ml","700ml","Deep Moisture","Sensitive","Fresh"] },
    { base: "Teeth Whitening Kit", brand: "Crest", prices: [9, 69], img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=500&fit=crop", extras: ["Strips","Pen","LED Kit","3D White","Gentle","Professional"] },
  ];

  const books = [
    { base: "Atomic Habits", brand: "James Clear", prices: [9, 27], img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop", extras: ["Hardcover","Paperback","Kindle","Audiobook","Signed","Workbook"] },
    { base: "The Psychology of Money", brand: "Morgan Housel", prices: [9, 25], img: "https://images.unsplash.com/photo-1512820790803-83ca734a7e40?w=500&h=500&fit=crop", extras: ["Hardcover","Paperback","Kindle","Audiobook","Summary","Gift Ed"] },
    { base: "Project Hail Mary", brand: "Andy Weir", prices: [9, 23], img: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&h=500&fit=crop", extras: ["Hardcover","Paperback","Kindle","Audiobook","Illustrated","Signed"] },
    { base: "The Great Gatsby", brand: "F. Scott Fitzgerald", prices: [4, 19], img: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&h=500&fit=crop", extras: ["Hardcover","Paperback","Kindle","Deluxe","Annotated","Classic"] },
    { base: "Sapiens", brand: "Yuval Noah Harari", prices: [9, 35], img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop", extras: ["Hardcover","Paperback","Kindle","Audiobook","Graphic","Youth"] },
    { base: "48 Laws of Power", brand: "Robert Greene", prices: [9, 25], img: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=500&h=500&fit=crop", extras: ["Hardcover","Paperback","Kindle","Audiobook","Pocket","Deluxe"] },
    { base: "Dune", brand: "Frank Herbert", prices: [7, 29], img: "https://images.unsplash.com/photo-1531988442254-63f76e74b06c?w=500&h=500&fit=crop", extras: ["Paperback","Hardcover","Kindle","Saga","Illustrated","Movie Ed"] },
    { base: "Think and Grow Rich", brand: "Napoleon Hill", prices: [4, 19], img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&h=500&fit=crop", extras: ["Original","Revised","Hardcover","Paperback","Kindle","Annotated"] },
    { base: "The Alchemist", brand: "Paulo Coelho", prices: [6, 22], img: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=500&h=500&fit=crop", extras: ["Hardcover","Paperback","Kindle","25th Anniv","Illustrated","Audiobook"] },
    { base: "Educated", brand: "Tara Westover", prices: [7, 25], img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&h=500&fit=crop", extras: ["Hardcover","Paperback","Kindle","Audiobook","Book Club","Signed"] },
    { base: "The Lean Startup", brand: "Eric Ries", prices: [9, 29], img: "https://images.unsplash.com/photo-1497633762265-9d1f906fcc57?w=500&h=500&fit=crop", extras: ["Hardcover","Paperback","Kindle","Audiobook","Summary","Workbook"] },
    { base: "Harry Potter Box Set", brand: "J.K. Rowling", prices: [29, 99], img: "https://images.unsplash.com/photo-1600486917101-23a66ba0f58c?w=500&h=500&fit=crop", extras: ["Books 1-4","Books 1-5","Complete","Illustrated","Hardcover","Paperback"] },
    { base: "The Art of War", brand: "Sun Tzu", prices: [3, 15], img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop", extras: ["Paperback","Hardcover","Kindle","Annotated","Illustrated","Pocket"] },
    { base: "Rich Dad Poor Dad", brand: "Robert Kiyosaki", prices: [6, 22], img: "https://images.unsplash.com/photo-1554245637-8f4e53d76d2c?w=500&h=500&fit=crop", extras: ["Paperback","Hardcover","Kindle","Audiobook","20th Anniv","Summary"] },
    { base: "1984", brand: "George Orwell", prices: [4, 18], img: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500&h=500&fit=crop", extras: ["Paperback","Hardcover","Kindle","75th Anniv","Annotated","Graphic"] },
    { base: "The Power of Habit", brand: "Charles Duhigg", prices: [8, 24], img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&h=500&fit=crop", extras: ["Paperback","Hardcover","Kindle","Audiobook","Summary","Workbook"] },
    { base: "To Kill a Mockingbird", brand: "Harper Lee", prices: [5, 22], img: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=500&h=500&fit=crop", extras: ["Paperback","Hardcover","Kindle","50th Anniv","Audiobook","Classic"] },
    { base: "Deep Work", brand: "Cal Newport", prices: [8, 24], img: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&h=500&fit=crop", extras: ["Paperback","Hardcover","Kindle","Audiobook","Summary","Signed"] },
    { base: "The Subtle Art", brand: "Mark Manson", prices: [7, 24], img: "https://images.unsplash.com/photo-1529158062015-cad636e205a0?w=500&h=500&fit=crop", extras: ["Paperback","Hardcover","Kindle","Audiobook","Journal","Gift Ed"] },
    { base: "Good to Great", brand: "Jim Collins", prices: [8, 29], img: "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=500&h=500&fit=crop", extras: ["Paperback","Hardcover","Kindle","Audiobook","Summary","10th Anniv"] },
    { base: "The Hobbit", brand: "J.R.R. Tolkien", prices: [7, 25], img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop", extras: ["Paperback","Hardcover","Kindle","Illustrated","75th Anniv","Movie Ed"] },
    { base: "Becoming", brand: "Michelle Obama", prices: [9, 32], img: "https://images.unsplash.com/photo-1512820790803-83ca734a7e40?w=500&h=500&fit=crop", extras: ["Hardcover","Paperback","Kindle","Audiobook","Signed","Journal Ed"] },
    { base: "The 7 Habits", brand: "Stephen Covey", prices: [7, 24], img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop", extras: ["Paperback","Hardcover","Kindle","Audiobook","30th Anniv","Workbook"] },
    { base: "Zero to One", brand: "Peter Thiel", prices: [8, 24], img: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&h=500&fit=crop", extras: ["Paperback","Hardcover","Kindle","Audiobook","Summary","Signed"] },
    { base: "The Midnight Library", brand: "Matt Haig", prices: [8, 26], img: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&h=500&fit=crop", extras: ["Hardcover","Paperback","Kindle","Audiobook","Book Club","Signed"] },
  ];

  const sports = [
    { base: "Yoga Mat", brand: "Manduka", prices: [14, 129], img: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop", extras: ["4mm","5mm","6mm","8mm","Travel","Pro"] },
    { base: "Dumbbell Set", brand: "Bowflex", prices: [29, 599], img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=500&fit=crop", extras: ["5-25lb","10-55lb","Adjustable","Pair","Single","Set of 3"] },
    { base: "Running Belt", brand: "FlipBelt", prices: [9, 39], img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop", extras: ["S","M","L","XL","Reflective","Zipper"] },
    { base: "Tennis Racket", brand: "Wilson", prices: [19, 299], img: "https://images.unsplash.com/photo-1617883861744-13b534e3b928?w=500&h=500&fit=crop", extras: ["Pro Staff","Blade","Burn","Clash","Beginner","Junior"] },
    { base: "Basketball", brand: "Spalding", prices: [9, 69], img: "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=500&h=500&fit=crop", extras: ["Size 5","Size 6","Size 7","Indoor","Outdoor","Official"] },
    { base: "Resistance Bands", brand: "Fit Simplify", prices: [4, 29], img: "https://images.unsplash.com/photo-1598289431512-b97b09fc7aff?w=500&h=500&fit=crop", extras: ["3-band","5-band","Loop","Tube","Heavy","Light"] },
    { base: "Cycling Helmet", brand: "Giro", prices: [19, 249], img: "https://images.unsplash.com/photo-1557803175-2f6e56146b55?w=500&h=500&fit=crop", extras: ["S","M","L","XL","Road","Mountain"] },
    { base: "Jump Rope", brand: "CrossRope", prices: [9, 69], img: "https://images.unsplash.com/photo-1515775050427-96eb66a56e07?w=500&h=500&fit=crop", extras: ["Light","Medium","Heavy","Speed","Weighted","Set"] },
    { base: "Soccer Ball", brand: "Adidas", prices: [9, 49], img: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=500&h=500&fit=crop", extras: ["Size 3","Size 4","Size 5","Match","Training","Mini"] },
    { base: "Foam Roller", brand: "TriggerPoint", prices: [9, 49], img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop", extras: ["12-inch","18-inch","36-inch","Grid","Deep Tissue","Travel"] },
    { base: "Fishing Rod", brand: "Shimano", prices: [19, 299], img: "https://images.unsplash.com/photo-1532015421790-7bef41da7aff?w=500&h=500&fit=crop", extras: ["5ft","6ft","7ft","8ft","Spinning","Casting"] },
    { base: "Golf Club Set", brand: "Callaway", prices: [99, 1299], img: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=500&h=500&fit=crop", extras: ["Driver","Iron Set","Wedge","Putter","Complete","Junior"] },
    { base: "Boxing Gloves", brand: "Everlast", prices: [14, 89], img: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=500&h=500&fit=crop", extras: ["8oz","10oz","12oz","14oz","16oz","Training"] },
    { base: "Hiking Backpack", brand: "Osprey", prices: [29, 299], img: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=500&h=500&fit=crop", extras: ["20L","35L","50L","65L","Daypack","Ultralight"] },
    { base: "Swim Goggles", brand: "Speedo", prices: [4, 39], img: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500&h=500&fit=crop", extras: ["Classic","Anti-Fog","Mirrored","Racing","Kids","Prescription"] },
    { base: "Skateboard", brand: "Element", prices: [29, 199], img: "https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=500&h=500&fit=crop", extras: ["Complete","Deck","Cruiser","Longboard","Mini","Pro"] },
    { base: "Trekking Poles", brand: "Black Diamond", prices: [19, 149], img: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=500&fit=crop", extras: ["Carbon","Aluminum","Folding","Fixed","Pair","Ultralight"] },
    { base: "Fitness Tracker", brand: "Fitbit", prices: [29, 199], img: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&h=500&fit=crop", extras: ["Inspire 3","Charge 6","Luxury","Sport Band","HR Monitor","GPS"] },
    { base: "Camping Tent", brand: "Coleman", prices: [29, 399], img: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500&h=500&fit=crop", extras: ["2-Person","4-Person","6-Person","8-Person","Backpacking","Family"] },
    { base: "Pull-Up Bar", brand: "Iron Gym", prices: [14, 49], img: "https://images.unsplash.com/photo-1597470533128-127567581135?w=500&h=500&fit=crop", extras: ["Doorway","Wall","Ceiling","Free Standing","Multi-Grip","Rotating"] },
    { base: "Basketball Hoop", brand: "Spalding", prices: [49, 499], img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&h=500&fit=crop", extras: ["Portable","In-Ground","Youth","Official","Half Court","Mini"] },
    { base: "Gym Bag", brand: "Under Armour", prices: [14, 69], img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop", extras: ["Small","Medium","Large","Duffle","Backpack","Shoe Compartment"] },
    { base: "Water Bottle", brand: "Hydro Flask", prices: [14, 54], img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop", extras: ["18oz","24oz","32oz","40oz","Wide Mouth","Standard"] },
    { base: "Kettlebell", brand: "Rogue", prices: [19, 149], img: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=500&h=500&fit=crop", extras: ["10lb","20lb","30lb","40lb","50lb","Competition"] },
    { base: "Boxing Bag", brand: "Ringside", prices: [29, 299], img: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=500&h=500&fit=crop", extras: ["60lb","70lb","80lb","100lb","Heavy Bag","Speed Bag"] },
  ];

  const toys = [
    { base: "LEGO Star Wars Set", brand: "LEGO", prices: [9, 799], img: "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=500&h=500&fit=crop", extras: ["Small","Medium","Large","Ultimate","Microfighter","Diorama"] },
    { base: "Barbie Dreamhouse", brand: "Mattel", prices: [29, 299], img: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500&h=500&fit=crop", extras: ["Classic","Deluxe","Ultimate","Malia","Camper","Accessories"] },
    { base: "Hot Wheels Track", brand: "Mattel", prices: [9, 149], img: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=500&h=500&fit=crop", extras: ["Basic","Monster","5-Car","Garage","City","Race"] },
    { base: "Nerf Blaster", brand: "Nerf", prices: [9, 59], img: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500&h=500&fit=crop", extras: ["Elite","Mega","Rival","Fortnite","Zombie","Ultra"] },
    { base: "Play-Doh Set", brand: "Hasbro", prices: [4, 29], img: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500&h=500&fit=crop", extras: ["10-Pack","20-Pack","Ice Cream","Kitchen","Pets","City"] },
    { base: "RC Car", brand: "Traxxas", prices: [29, 499], img: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&h=500&fit=crop", extras: ["1:10","1:16","1:18","4WD","2WD","Monster Truck"] },
    { base: "Board Game", brand: "Hasbro Gaming", prices: [9, 49], img: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=500&h=500&fit=crop", extras: ["Monopoly","Scrabble","Clue","Risk","Catan","Ticket to Ride"] },
    { base: "Puzzle 1000pc", brand: "Ravensburger", prices: [9, 29], img: "https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=500&h=500&fit=crop", extras: ["300pc","500pc","750pc","1000pc","2000pc","3D Puzzle"] },
    { base: "Action Figure", brand: "Hasbro", prices: [4, 49], img: "https://images.unsplash.com/photo-1608278047522-586676835004?w=500&h=500&fit=crop", extras: ["Marvel","Star Wars","GI Joe","Transformers","Spider-Man","Batman"] },
    { base: "Stuffed Animal", brand: "Aurora", prices: [4, 29], img: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500&h=500&fit=crop", extras: ["Bear","Unicorn","Cat","Dog","Elephant","Penguin"] },
    { base: "Science Kit", brand: "National Geographic", prices: [9, 49], img: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500&h=500&fit=crop", extras: ["Chemistry","Geology","Biology","Astronomy","Archaeology","Robotics"] },
    { base: "Dollhouse", brand: "KidKraft", prices: [29, 299], img: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500&h=500&fit=crop", extras: ["3-story","Modern","Victorian","Wooden","Portable","Deluxe"] },
    { base: "Train Set", brand: "Brio", prices: [19, 199], img: "https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=500&h=500&fit=crop", extras: ["Basic","Deluxe","Electric","Wooden","Steam","Freight"] },
    { base: "Art Supply Kit", brand: "Crayola", prices: [9, 49], img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=500&fit=crop", extras: ["24ct","48ct","64ct","150ct","Marker Set","Paint Set"] },
    { base: "Baby Toy Set", brand: "Fisher-Price", prices: [9, 49], img: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500&h=500&fit=crop", extras: ["Rattle","Stacking","Musical","Sensory","Activity","Teether"] },
    { base: "Drone Toy", brand: "Holy Stone", prices: [19, 199], img: "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=500&h=500&fit=crop", extras: ["Mini","Camera","FPV","Beginner","Advanced","Racing"] },
    { base: "Play Tent", brand: "Playz", prices: [14, 49], img: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500&h=500&fit=crop", extras: ["Castle","Rocket","Princess","Pirate","Tunnel","Ball Pit"] },
    { base: "Magnetic Tiles", brand: "Magna-Tiles", prices: [14, 99], img: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500&h=500&fit=crop", extras: ["32-pc","64-pc","100-pc","Clear","Opaque","Glitter"] },
    { base: "Water Gun", brand: "Super Soaker", prices: [4, 29], img: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500&h=500&fit=crop", extras: ["Mini","Standard","Mega","Blast","Thunder","Freeze"] },
    { base: "Toy Kitchen", brand: "KidKraft", prices: [29, 249], img: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500&h=500&fit=crop", extras: ["Small","Medium","Large","Wooden","Modern","Deluxe"] },
    { base: "Slime Kit", brand: "National Geographic", prices: [9, 29], img: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500&h=500&fit=crop", extras: ["Basic","Deluxe","Glow","Color Change","Fluffy","Mega"] },
    { base: "Walkie Talkie Set", brand: "Motorola", prices: [14, 49], img: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500&h=500&fit=crop", extras: ["Kids","Long Range","Waterproof","Rechargeable","Compact","Heavy Duty"] },
    { base: "Toy Digger", brand: "CAT", prices: [9, 39], img: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500&h=500&fit=crop", extras: ["Small","Medium","Large","Remote Control","Friction","Sound"] },
    { base: "Kite", brand: "Cubic Fun", prices: [4, 29], img: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500&h=500&fit=crop", extras: ["Small","Large","Delta","Box","Dragon","LED"] },
    { base: "Yo-Yo Set", brand: "Duncan", prices: [4, 19], img: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500&h=500&fit=crop", extras: ["Beginner","Pro","Metal","Responsive","Unresponsive","Glow"] },
  ];

  const automotive = [
    { base: "Car Phone Mount", brand: "iOttie", prices: [9, 39], img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=500&fit=crop", extras: ["Vent","Dashboard","Windshield","MagSafe","Wireless Charging","CD Slot"] },
    { base: "Dash Cam", brand: "Garmin", prices: [29, 399], img: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=500&h=500&fit=crop", extras: ["1080p","2K","4K","Front","Front+Rear","GPS"] },
    { base: "Car Vacuum", brand: "Black+Decker", prices: [19, 69], img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=500&fit=crop", extras: ["Handheld","Cordless","Corded","Wet/Dry","Heavy Duty","Mini"] },
    { base: "Tire Pressure Gauge", brand: "AstroAI", prices: [4, 29], img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=500&fit=crop", extras: ["Digital","Analog","Pencil","Heavy Duty","Backlit","Braided Hose"] },
    { base: "Car Seat Cover", brand: "FH Group", prices: [19, 99], img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=500&fit=crop", extras: ["Front Pair","Full Set","Leather","Neoprene","Universal","Custom Fit"] },
    { base: "Jump Starter", brand: "NOCO", prices: [29, 299], img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=500&fit=crop", extras: ["500A","1000A","2000A","4000A","Portable","Smart"] },
    { base: "Car Air Freshener", brand: "Little Trees", prices: [4, 19], img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=500&fit=crop", extras: ["6-Pack","12-Pack","Vanilla","New Car","Cherry","Pine"] },
    { base: "LED Headlight Bulbs", brand: "SEALIGHT", prices: [14, 69], img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=500&fit=crop", extras: ["H11","9005","9006","H7","H4","Fog Light"] },
    { base: "Steering Wheel Cover", brand: "Valleycomfy", prices: [9, 29], img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=500&fit=crop", extras: ["Leather","Sport","Microfiber","Universal","15-inch","14.5-inch"] },
    { base: "Car Floor Mats", brand: "WeatherTech", prices: [29, 199], img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=500&fit=crop", extras: ["Front","Full Set","All-Weather","Custom Fit","Universal","Rubber"] },
    { base: "Portable Charger", brand: "Anker", prices: [14, 69], img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=500&fit=crop", extras: ["USB-C","Dual USB","Fast Charge","10000mAh","20000mAh","Solar"] },
    { base: "Car Wax Kit", brand: "Meguiar's", prices: [9, 39], img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=500&fit=crop", extras: ["Liquid","Paste","Spray","Complete Kit","Ceramic","Gold Class"] },
    { base: "Trunk Organizer", brand: "Driver's Gear", prices: [14, 39], img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=500&fit=crop", extras: ["Small","Large","Collapsible","Heavy Duty","Multi-compartment","Waterproof"] },
    { base: "Backup Camera", brand: "Yakry", prices: [19, 69], img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=500&fit=crop", extras: ["Wired","Wireless","HD","Night Vision","Wide Angle","License Plate"] },
    { base: "Car Cover", brand: "Budge", prices: [19, 79], img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=500&fit=crop", extras: ["Sedan","SUV","Truck","Indoor","Outdoor","All-Weather"] },
    { base: "Oil Filter", brand: "FRAM", prices: [4, 19], img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=500&fit=crop", extras: ["Extra Guard","Tough Guard","Ultra","Synthetic","Standard","High Mileage"] },
    { base: "Wiper Blades", brand: "Bosch", prices: [9, 39], img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=500&fit=crop", extras: ["16-inch","18-inch","20-inch","22-inch","24-inch","Beam"] },
    { base: "Car Jack", brand: "Pro-Lift", prices: [19, 69], img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=500&fit=crop", extras: ["2-Ton","3-Ton","5-Ton","Scissor","Floor","Bottle"] },
    { base: "GPS Navigator", brand: "Garmin", prices: [49, 399], img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=500&fit=crop", extras: ["5-inch","6-inch","7-inch","Truck","RV","Motorcycle"] },
    { base: "Car Battery Charger", brand: "Schumacher", prices: [19, 99], img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=500&fit=crop", extras: ["2-Amp","6-Amp","10-Amp","Smart","Automatic","Maintainer"] },
    { base: "Roof Rack", brand: "Thule", prices: [49, 499], img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=500&fit=crop", extras: ["Crossbar","Cargo Box","Bike Rack","Ski Rack","Kayak","Universal"] },
    { base: "Tire Inflator", brand: "Avid", prices: [19, 69], img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=500&fit=crop", extras: ["Portable","Digital","Cordless","12V","Dual Cylinder","Fast"] },
    { base: "Car Stereo", brand: "Pioneer", prices: [49, 399], img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=500&fit=crop", extras: ["Single DIN","Double DIN","Bluetooth","Apple CarPlay","Android Auto","Touchscreen"] },
    { base: "Cargo Net", brand: "Favoto", prices: [9, 29], img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=500&fit=crop", extras: ["Trunk","Elastic","Universal","Heavy Duty","Adjustable","Mesh"] },
    { base: "Window Tint Film", brand: "Gila", prices: [9, 39], img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=500&fit=crop", extras: ["5%","15%","20%","35%","50%","Ceramic"] },
  ];

  const allCategories = [
    { id: 1, items: electronics },
    { id: 2, items: fashion },
    { id: 3, items: homeKitchen },
    { id: 4, items: beauty },
    { id: 5, items: books },
    { id: 6, items: sports },
    { id: 7, items: toys },
    { id: 8, items: automotive },
  ];

  // Generate ~62-63 products per category = ~500 total
  for (const cat of allCategories) {
    const templates = cat.items;
    const targetPerCat = Math.ceil(500 / allCategories.length);
    let count = 0;

    for (const tmpl of templates) {
      if (count >= targetPerCat) break;
      for (const variant of tmpl.extras) {
        if (count >= targetPerCat) break;
        const price = rand(tmpl.prices[0], tmpl.prices[1]);
        const origPrice = +(price * (1 + Math.random() * 0.4 + 0.1)).toFixed(2);
        products.push({
          name: `${tmpl.base} ${variant}`,
          slug: makeSlug(`${tmpl.base} ${variant}`),
          description: `Premium ${tmpl.base} ${variant} by ${tmpl.brand}. High quality, reliable, and built to last. Perfect for everyday use.`,
          price,
          originalPrice: origPrice,
          images: [tmpl.img],
          categoryId: cat.id,
          brand: tmpl.brand,
          stock: randStock(),
          rating: randRating(),
          reviewCount: randReviews(),
          featured: Math.random() < 0.15,
        });
        count++;
      }
    }
  }

  return products;
}

const seed = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log("Database synced (fresh).");

    // Admin user
    await User.create({
      name: "Admin",
      email: "admin@amazon.com",
      password: await bcrypt.hash("admin123", 10),
      role: "admin",
    });

    // Test user
    await User.create({
      name: "John Doe",
      email: "john@example.com",
      password: await bcrypt.hash("user123", 10),
      role: "user",
      phone: "+1234567890",
    });

    // Categories
    await Category.bulkCreate([
      { name: "Electronics", slug: "electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop" },
      { name: "Fashion", slug: "fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop" },
      { name: "Home & Kitchen", slug: "home-kitchen", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop" },
      { name: "Beauty", slug: "beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop" },
      { name: "Books", slug: "books", image: "https://images.unsplash.com/photo-1512820790803-83ca734a7e40?w=400&h=300&fit=crop" },
      { name: "Sports", slug: "sports", image: "https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=400&h=300&fit=crop" },
      { name: "Toys", slug: "toys", image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=300&fit=crop" },
      { name: "Automotive", slug: "automotive", image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop" },
    ]);

    // Generate and insert ~500 products
    const products = generateProducts();
    await Product.bulkCreate(products);

    // Coupons
    await Coupon.bulkCreate([
      { code: "SAVE10", discountType: "percentage", discountValue: 10, minOrder: 50, maxUses: 1000, expiresAt: new Date("2026-12-31") },
      { code: "FLAT20", discountType: "fixed", discountValue: 20, minOrder: 100, maxUses: 500, expiresAt: new Date("2026-09-30") },
      { code: "WELCOME50", discountType: "percentage", discountValue: 50, minOrder: 200, maxUses: 100, expiresAt: new Date("2026-08-31") },
    ]);

    console.log(`Seed complete! Created 8 categories, ${products.length} products, 3 coupons`);
    console.log("Admin: admin@amazon.com / admin123");
    console.log("User: john@example.com / user123");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seed();
