const sequelize = require("../config/database");

// Import models
const User = require("./User");
const Category = require("./Category");
const Product = require("./Product");
const Cart = require("./Cart");
const CartItem = require("./CartItem");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const Review = require("./Review");
const Address = require("./Address");
const Coupon = require("./Coupon");
const Wishlist = require("./Wishlist");
const AdminSettings = require("./AdminSettings");

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
  AdminSettings,
};
