export const categories = [
  { name: "Electronics", slug: "electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop" },
  { name: "Fashion", slug: "fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop" },
  { name: "Home & Kitchen", slug: "home-kitchen", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop" },
  { name: "Beauty", slug: "beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop" },
  { name: "Books", slug: "books", image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=300&fit=crop" },
  { name: "Sports", slug: "sports", image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=300&fit=crop" },
  { name: "Toys", slug: "toys", image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=300&fit=crop" },
  { name: "Automotive", slug: "automotive", image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop" },
];

const productImages = {
  electronics: [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&h=300&fit=crop",
  ],
  fashion: [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1434389677669-e08b4cda3a36?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=300&fit=crop",
  ],
  home: [
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1550226891-ef816aed4a98?w=300&h=300&fit=crop",
  ],
  beauty: [
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=300&fit=crop",
  ],
  books: [
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1512820790803-83ca734a7e40?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=300&fit=crop",
  ],
};

export const products = [
  { id: "1", name: "iPhone 15 Pro Max 256GB - Natural Titanium", slug: "iphone-15-pro-max", price: 1199.99, originalPrice: 1399.99, image: productImages.electronics[0], rating: 4.7, reviewCount: 2847, category: "Electronics", brand: "Apple", freeDelivery: true, featured: true },
  { id: "2", name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones", slug: "sony-wh1000xm5", price: 298.00, originalPrice: 399.99, image: productImages.electronics[1], rating: 4.6, reviewCount: 1523, category: "Electronics", brand: "Sony", freeDelivery: true, featured: true },
  { id: "3", name: "Apple Watch Series 9 GPS 45mm Midnight Aluminum", slug: "apple-watch-s9", price: 399.00, originalPrice: 429.00, image: productImages.electronics[2], rating: 4.8, reviewCount: 982, category: "Electronics", brand: "Apple", freeDelivery: true },
  { id: "4", name: "Samsung Galaxy S24 Ultra 512GB Titanium Gray", slug: "galaxy-s24-ultra", price: 1299.99, originalPrice: 1419.99, image: productImages.electronics[3], rating: 4.5, reviewCount: 1876, category: "Electronics", brand: "Samsung", freeDelivery: true },
  { id: "5", name: "MacBook Air M3 15-inch 8GB 256GB SSD", slug: "macbook-air-m3", price: 1249.00, originalPrice: 1299.00, image: productImages.electronics[4], rating: 4.9, reviewCount: 654, category: "Electronics", brand: "Apple", freeDelivery: true, featured: true },
  { id: "6", name: "JBL Charge 5 Portable Bluetooth Speaker", slug: "jbl-charge-5", price: 139.95, originalPrice: 179.95, image: productImages.electronics[5], rating: 4.7, reviewCount: 3214, category: "Electronics", brand: "JBL", freeDelivery: true },
  { id: "7", name: "Men's Classic Fit Cotton Oxford Shirt", slug: "mens-oxford-shirt", price: 29.99, originalPrice: 49.99, image: productImages.fashion[0], rating: 4.3, reviewCount: 876, category: "Fashion", brand: "Amazon Essentials", freeDelivery: true },
  { id: "8", name: "Women's Summer Floral Print Maxi Dress", slug: "floral-maxi-dress", price: 35.99, originalPrice: 59.99, image: productImages.fashion[1], rating: 4.4, reviewCount: 1243, category: "Fashion", brand: "Zara", freeDelivery: true },
  { id: "9", name: "Men's Slim Fit Stretch Jeans Dark Wash", slug: "slim-fit-jeans", price: 39.99, originalPrice: 69.99, image: productImages.fashion[2], rating: 4.2, reviewCount: 2156, category: "Fashion", brand: "Levi's", freeDelivery: true },
  { id: "10", name: "Women's Lightweight Puffer Jacket", slug: "puffer-jacket", price: 59.99, originalPrice: 89.99, image: productImages.fashion[3], rating: 4.5, reviewCount: 567, category: "Fashion", brand: "North Face", freeDelivery: true },
  { id: "11", name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker 6Qt", slug: "instant-pot-duo", price: 79.95, originalPrice: 99.99, image: productImages.home[0], rating: 4.7, reviewCount: 15432, category: "Home & Kitchen", brand: "Instant", freeDelivery: true, featured: true },
  { id: "12", name: "Modern Minimalist Floor Lamp with Remote Control", slug: "modern-floor-lamp", price: 45.99, originalPrice: 69.99, image: productImages.home[1], rating: 4.4, reviewCount: 876, category: "Home & Kitchen", brand: "BrightLamp", freeDelivery: true },
  { id: "13", name: "Ergonomic Office Chair with Lumbar Support", slug: "ergonomic-office-chair", price: 199.99, originalPrice: 299.99, image: productImages.home[2], rating: 4.3, reviewCount: 2341, category: "Home & Kitchen", brand: "Herman", freeDelivery: true },
  { id: "14", name: "Robot Vacuum Cleaner with Mapping Technology", slug: "robot-vacuum", price: 249.99, originalPrice: 349.99, image: productImages.home[3], rating: 4.5, reviewCount: 1876, category: "Home & Kitchen", brand: "iRobot", freeDelivery: true },
  { id: "15", name: "Vitamin C Serum with Hyaluronic Acid 30ml", slug: "vitamin-c-serum", price: 18.99, originalPrice: 29.99, image: productImages.beauty[0], rating: 4.4, reviewCount: 8765, category: "Beauty", brand: "SkinGlow", freeDelivery: true },
  { id: "16", name: "Professional Hair Dryer with Ionic Technology", slug: "ionic-hair-dryer", price: 49.99, originalPrice: 79.99, image: productImages.beauty[1], rating: 4.6, reviewCount: 3421, category: "Beauty", brand: "Dyson", freeDelivery: true },
  { id: "17", name: "Makeup Brush Set 12 Pieces with Carry Case", slug: "makeup-brush-set", price: 24.99, originalPrice: 39.99, image: productImages.beauty[2], rating: 4.3, reviewCount: 2134, category: "Beauty", brand: "MAC", freeDelivery: true },
  { id: "18", name: "Atomic Habits: Tiny Changes, Remarkable Results", slug: "atomic-habits", price: 16.99, originalPrice: 27.00, image: productImages.books[0], rating: 4.8, reviewCount: 45678, category: "Books", brand: "James Clear", freeDelivery: true, featured: true },
  { id: "19", name: "The Psychology of Money: Timeless Lessons on Wealth", slug: "psychology-of-money", price: 14.99, originalPrice: 24.99, image: productImages.books[1], rating: 4.7, reviewCount: 23456, category: "Books", brand: "Morgan Housel", freeDelivery: true },
  { id: "20", name: "Project Hail Mary: A Novel by Andy Weir", slug: "project-hail-mary", price: 13.99, originalPrice: 22.99, image: productImages.books[2], rating: 4.9, reviewCount: 34567, category: "Books", brand: "Andy Weir", freeDelivery: true },
];

export const heroBanners = [
  { id: 1, image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1400&h=400&fit=crop", title: "Summer Sale - Up to 50% Off", link: "/search?deal=true" },
  { id: 2, image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&h=400&fit=crop", title: "New Fashion Collection", link: "/search?category=Fashion" },
  { id: 3, image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1400&h=400&fit=crop", title: "Latest Electronics & Gadgets", link: "/search?category=Electronics" },
];
