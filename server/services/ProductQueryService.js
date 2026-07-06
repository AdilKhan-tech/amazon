const { Product, Tag, Gender, Branch, Category, Occasion } = require("../models");
const { Op } = require("sequelize");
const CustomError = require("../exceptions/CustomError");
const { UPLOADS_URL } = require("../config/config");

class ProductQueryService {

  static async getAll({ page, limit, offset, query }) {
    const { keywords, sortField, sortOrder } = query;
    const where = {};

    if (keywords) {
      where[Op.or] = [
        { name_en: { [Op.like]: `%${keywords}%` } },
        { name_ar: { [Op.like]: `%${keywords}%` } }
      ];
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: this._includes(),
      limit,
      offset,
      distinct: true,
      order: [[sortField || "id", sortOrder || "DESC"]]
    });

    const data = rows.map(product => {
      const p = product.toJSON();
      return {
        ...p,
        image_url: p.image_url ? `${UPLOADS_URL}/${p.image_url}` : null
      };
    });

    return {
      pagination: {
        page,
        limit,
        total: count,
        pageCount: Math.ceil(count / limit)
      },
      data
    };
  }

  static async getById(id) {
    const product = await Product.findByPk(id, { include: this._includes() });
    if (!product) throw CustomError.notFound("Product not found");
    const p = product.toJSON();
    return {
      ...p,
      image_url: p.image_url ? `${UPLOADS_URL}/${p.image_url}` : null
    };
  }

  static _includes() {
    return [
      { model: Tag, as: "tags", attributes: ["id", "name_en", "name_ar"] },
      { model: Gender, as: "gender", attributes: ["id", "name_en", "name_ar"] },
      { model: Branch, as: "branches", attributes: ["id", "name_en", "name_ar"] },
      { model: Category, as: "categories", attributes: ["id", "name_en", "name_ar"] },
      { model: Occasion, as: "occasions", attributes: ["id", "name_en", "name_ar"] }
    ];
  }
}

module.exports = ProductQueryService;