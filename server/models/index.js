const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

// ===== USER =====
const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: true },
  image: { type: DataTypes.STRING, allowNull: true },
  role: { type: DataTypes.ENUM("user", "admin"), defaultValue: "user" },
}, { timestamps: true });

// ===== CATEGORY =====
const Category = sequelize.define("Category", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  image: { type: DataTypes.STRING, allowNull: true },
  parentId: { type: DataTypes.INTEGER, allowNull: true, references: { model: "Categories", key: "id" } },
}, { timestamps: true });

// ===== PRODUCT =====
const Product = sequelize.define("Product", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  price: { type: DataTypes.FLOAT, allowNull: false },
  originalPrice: { type: DataTypes.FLOAT, allowNull: true },
  images: { type: DataTypes.JSON, allowNull: true },
  categoryId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Categories", key: "id" } },
  brand: { type: DataTypes.STRING, allowNull: true },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  rating: { type: DataTypes.FLOAT, defaultValue: 0 },
  reviewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  featured: { type: DataTypes.BOOLEAN, defaultValue: false },
  specs: { type: DataTypes.JSON, allowNull: true },
}, { timestamps: true });

// ===== CART =====
const Cart = sequelize.define("Cart", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, unique: true, references: { model: "Users", key: "id" } },
}, { timestamps: true });

// ===== CART ITEM =====
const CartItem = sequelize.define("CartItem", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  cartId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Carts", key: "id" } },
  productId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Products", key: "id" } },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
}, { timestamps: true });

// ===== ORDER =====
const Order = sequelize.define("Order", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  orderNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Users", key: "id" } },
  totalAmount: { type: DataTypes.FLOAT, allowNull: false },
  shippingAddress: { type: DataTypes.JSON, allowNull: false },
  shippingMethod: { type: DataTypes.STRING, defaultValue: "standard" },
  shippingCost: { type: DataTypes.FLOAT, defaultValue: 0 },
  tax: { type: DataTypes.FLOAT, defaultValue: 0 },
  paymentMethod: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.ENUM("pending", "processing", "shipped", "delivered", "cancelled"), defaultValue: "pending" },
  promoCode: { type: DataTypes.STRING, allowNull: true },
  discount: { type: DataTypes.FLOAT, defaultValue: 0 },
}, { timestamps: true });

// ===== ORDER ITEM =====
const OrderItem = sequelize.define("OrderItem", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  orderId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Orders", key: "id" } },
  productId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Products", key: "id" } },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
}, { timestamps: true });

// ===== REVIEW =====
const Review = sequelize.define("Review", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  productId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Products", key: "id" } },
  userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Users", key: "id" } },
  rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
  title: { type: DataTypes.STRING, allowNull: false },
  comment: { type: DataTypes.TEXT, allowNull: true },
  verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  helpful: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { timestamps: true });

// ===== ADDRESS =====
const Address = sequelize.define("Address", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Users", key: "id" } },
  label: { type: DataTypes.STRING, defaultValue: "Home" },
  fullName: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  state: { type: DataTypes.STRING, allowNull: false },
  zip: { type: DataTypes.STRING, allowNull: false },
  country: { type: DataTypes.STRING, defaultValue: "US" },
  isDefault: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { timestamps: true });

// ===== COUPON =====
const Coupon = sequelize.define("Coupon", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  code: { type: DataTypes.STRING, allowNull: false, unique: true },
  discountType: { type: DataTypes.ENUM("percentage", "fixed"), defaultValue: "percentage" },
  discountValue: { type: DataTypes.FLOAT, allowNull: false },
  minOrder: { type: DataTypes.FLOAT, defaultValue: 0 },
  maxUses: { type: DataTypes.INTEGER, defaultValue: 1000 },
  usedCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  expiresAt: { type: DataTypes.DATE, allowNull: true },
  active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { timestamps: true });

// ===== WISHLIST =====
const Wishlist = sequelize.define("Wishlist", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Users", key: "id" } },
  productId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Products", key: "id" } },
}, { timestamps: true });

// ===== ASSOCIATIONS =====
// Category self-reference
Category.hasMany(Category, { as: "children", foreignKey: "parentId" });
Category.belongsTo(Category, { as: "parent", foreignKey: "parentId" });

// Product -> Category
Product.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasMany(Product, { foreignKey: "categoryId" });

// Cart
Cart.belongsTo(User, { foreignKey: "userId" });
User.hasOne(Cart, { foreignKey: "userId" });
CartItem.belongsTo(Cart, { foreignKey: "cartId" });
Cart.hasMany(CartItem, { foreignKey: "cartId" });
CartItem.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(CartItem, { foreignKey: "productId" });

// Order
Order.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Order, { foreignKey: "userId" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });
Order.hasMany(OrderItem, { foreignKey: "orderId" });
OrderItem.belongsTo(Product, { foreignKey: "productId" });

// Review
Review.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(Review, { foreignKey: "productId" });
Review.belongsTo(User, { foreignKey: "userId" });

// Address
Address.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Address, { foreignKey: "userId" });

// Wishlist
Wishlist.belongsTo(User, { foreignKey: "userId" });
Wishlist.belongsTo(Product, { foreignKey: "productId" });
User.hasMany(Wishlist, { foreignKey: "userId" });
Product.hasMany(Wishlist, { foreignKey: "productId" });

module.exports = {
  sequelize,
  User,
  Category,
  Product,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Review,
  Address,
  Coupon,
  Wishlist,
};
