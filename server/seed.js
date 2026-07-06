const bcrypt = require("bcryptjs");
const { sequelize, User, Category, Product, Coupon } = require("./models");

const seed = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log("Database synced (fresh).");

    // Admin user
    const admin = await User.create({
      name: "Admin",
      email: "admin@amazon.com",
      password: await bcrypt.hash("admin123", 10),
      role: "admin",
    });

    // Test user
    const user = await User.create({
      name: "John Doe",
      email: "john@example.com",
      password: await bcrypt.hash("user123", 10),
      role: "user",
      phone: "+1234567890",
    });

    // Categories
    const categories = await Category.bulkCreate([
      { name: "Electronics", slug: "electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop" },
      { name: "Fashion", slug: "fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop" },
      { name: "Home & Kitchen", slug: "home-kitchen", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop" },
      { name: "Beauty", slug: "beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop" },
      { name: "Books", slug: "books", image: "https://images.unsplash.com/photo-1512820790803-83ca734a7e40?w=400&h=300&fit=crop" },
      { name: "Sports", slug: "sports", image: "https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=400&h=300&fit=crop" },
      { name: "Toys", slug: "toys", image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=300&fit=crop" },
      { name: "Automotive", slug: "automotive", image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop" },
    ]);

    // Products
    const products = await Product.bulkCreate([
      { name: "iPhone 15 Pro Max 256GB", slug: "iphone-15-pro-max", description: "The most powerful iPhone ever with A17 Pro chip, titanium design, and advanced camera system.", price: 1199.99, originalPrice: 1399.99, images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop"], categoryId: 1, brand: "Apple", stock: 50, rating: 4.7, reviewCount: 2847, featured: true },
      { name: "Sony WH-1000XM5 Headphones", slug: "sony-wh1000xm5", description: "Industry-leading noise canceling wireless headphones with exceptional sound quality.", price: 298.00, originalPrice: 399.99, images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"], categoryId: 1, brand: "Sony", stock: 120, rating: 4.6, reviewCount: 1523, featured: true },
      { name: "Apple Watch Series 9 GPS", slug: "apple-watch-s9", description: "The ultimate wearable with advanced health features and seamless connectivity.", price: 399.00, originalPrice: 429.00, images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop"], categoryId: 1, brand: "Apple", stock: 80, rating: 4.8, reviewCount: 982 },
      { name: "Samsung Galaxy S24 Ultra", slug: "galaxy-s24-ultra", description: "Galaxy AI is here. The most powerful Galaxy smartphone yet.", price: 1299.99, originalPrice: 1419.99, images: ["https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=500&h=500&fit=crop"], categoryId: 1, brand: "Samsung", stock: 65, rating: 4.5, reviewCount: 1876 },
      { name: "MacBook Air M3 15-inch", slug: "macbook-air-m3", description: "Impressively thin, light, and powerful with the M3 chip.", price: 1249.00, originalPrice: 1299.00, images: ["https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=500&h=500&fit=crop"], categoryId: 1, brand: "Apple", stock: 40, rating: 4.9, reviewCount: 654, featured: true },
      { name: "JBL Charge 5 Speaker", slug: "jbl-charge-5", description: "Portable Bluetooth speaker with powerful JBL Original Pro Sound.", price: 139.95, originalPrice: 179.95, images: ["https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&h=500&fit=crop"], categoryId: 1, brand: "JBL", stock: 200, rating: 4.7, reviewCount: 3214 },
      { name: "Men's Classic Oxford Shirt", slug: "mens-oxford-shirt", description: "Premium cotton oxford shirt with a classic fit for any occasion.", price: 29.99, originalPrice: 49.99, images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop"], categoryId: 2, brand: "Amazon Essentials", stock: 300, rating: 4.3, reviewCount: 876 },
      { name: "Women's Floral Maxi Dress", slug: "floral-maxi-dress", description: "Beautiful summer floral print maxi dress, perfect for any occasion.", price: 35.99, originalPrice: 59.99, images: ["https://images.unsplash.com/photo-1434389677669-e08b4cda3a36?w=500&h=500&fit=crop"], categoryId: 2, brand: "Zara", stock: 150, rating: 4.4, reviewCount: 1243 },
      { name: "Men's Slim Fit Jeans", slug: "slim-fit-jeans", description: "Classic dark wash slim fit stretch jeans for everyday comfort.", price: 39.99, originalPrice: 69.99, images: ["https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&h=500&fit=crop"], categoryId: 2, brand: "Levi's", stock: 250, rating: 4.2, reviewCount: 2156 },
      { name: "Women's Puffer Jacket", slug: "puffer-jacket", description: "Lightweight yet warm puffer jacket for cold weather.", price: 59.99, originalPrice: 89.99, images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&h=500&fit=crop"], categoryId: 2, brand: "North Face", stock: 100, rating: 4.5, reviewCount: 567 },
      { name: "Instant Pot Duo 7-in-1", slug: "instant-pot-duo", description: "Electric pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker and warmer.", price: 79.95, originalPrice: 99.99, images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop"], categoryId: 3, brand: "Instant", stock: 180, rating: 4.7, reviewCount: 15432, featured: true },
      { name: "Modern Floor Lamp", slug: "modern-floor-lamp", description: "Minimalist floor lamp with adjustable brightness and remote control.", price: 45.99, originalPrice: 69.99, images: ["https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=500&h=500&fit=crop"], categoryId: 3, brand: "BrightLamp", stock: 90, rating: 4.4, reviewCount: 876 },
      { name: "Ergonomic Office Chair", slug: "ergonomic-office-chair", description: "Premium ergonomic chair with lumbar support and adjustable armrests.", price: 199.99, originalPrice: 299.99, images: ["https://images.unsplash.com/photo-1524758631624-e2822e4f4f55?w=500&h=500&fit=crop"], categoryId: 3, brand: "Herman", stock: 60, rating: 4.3, reviewCount: 2341 },
      { name: "Robot Vacuum Cleaner", slug: "robot-vacuum", description: "Smart robot vacuum with mapping technology and app control.", price: 249.99, originalPrice: 349.99, images: ["https://images.unsplash.com/photo-1550226891-ef816aed4a98?w=500&h=500&fit=crop"], categoryId: 3, brand: "iRobot", stock: 75, rating: 4.5, reviewCount: 1876 },
      { name: "Vitamin C Serum 30ml", slug: "vitamin-c-serum", description: "Advanced vitamin C serum with hyaluronic acid for radiant skin.", price: 18.99, originalPrice: 29.99, images: ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=500&fit=crop"], categoryId: 4, brand: "SkinGlow", stock: 400, rating: 4.4, reviewCount: 8765 },
      { name: "Ionic Hair Dryer", slug: "ionic-hair-dryer", description: "Professional hair dryer with ionic technology for frizz-free styling.", price: 49.99, originalPrice: 79.99, images: ["https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&h=500&fit=crop"], categoryId: 4, brand: "Dyson", stock: 120, rating: 4.6, reviewCount: 3421 },
      { name: "Makeup Brush Set 12pcs", slug: "makeup-brush-set", description: "Professional makeup brush set with premium carry case.", price: 24.99, originalPrice: 39.99, images: ["https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&h=500&fit=crop"], categoryId: 4, brand: "MAC", stock: 200, rating: 4.3, reviewCount: 2134 },
      { name: "Atomic Habits by James Clear", slug: "atomic-habits", description: "Tiny changes, remarkable results. The definitive guide to building good habits.", price: 16.99, originalPrice: 27.00, images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop"], categoryId: 5, brand: "James Clear", stock: 500, rating: 4.8, reviewCount: 45678, featured: true },
      { name: "The Psychology of Money", slug: "psychology-of-money", description: "Timeless lessons on wealth, greed, and happiness.", price: 14.99, originalPrice: 24.99, images: ["https://images.unsplash.com/photo-1512820790803-83ca734a7e40?w=500&h=500&fit=crop"], categoryId: 5, brand: "Morgan Housel", stock: 350, rating: 4.7, reviewCount: 23456 },
      { name: "Project Hail Mary", slug: "project-hail-mary", description: "A thrilling sci-fi novel from the author of The Martian.", price: 13.99, originalPrice: 22.99, images: ["https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&h=500&fit=crop"], categoryId: 5, brand: "Andy Weir", stock: 280, rating: 4.9, reviewCount: 34567 },
    ]);

    // Coupon
    await Coupon.bulkCreate([
      { code: "SAVE10", discountType: "percentage", discountValue: 10, minOrder: 50, maxUses: 1000, expiresAt: new Date("2026-12-31") },
      { code: "FLAT20", discountType: "fixed", discountValue: 20, minOrder: 100, maxUses: 500, expiresAt: new Date("2026-09-30") },
      { code: "WELCOME50", discountType: "percentage", discountValue: 50, minOrder: 200, maxUses: 100, expiresAt: new Date("2026-08-31") },
    ]);

    console.log("Seed complete!");
    console.log("Admin: admin@amazon.com / admin123");
    console.log("User: john@example.com / user123");
    console.log(`Created ${categories.length} categories, ${products.length} products, 3 coupons`);
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seed();
