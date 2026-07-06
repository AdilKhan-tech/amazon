const { UPLOADS_URL } = require("../config/config");
const CakePortionSize = require("../models/CakePortionSize");
const getPagination = require("../utils/pagination");
const { Op } = require("sequelize");


class CakePortionSizeController {

  static async createCakePortionSize(req, res, next) {
    try {
      const { name_en, name_ar, slug, parent_id } = req.body

      const image_url = req.file ? req.file.filename : null;
      const cakePortionSize = await CakePortionSize.create({
        name_en,
        name_ar,
        slug,
        parent_id: parent_id || null,
        image_url,
      });
        
      await cakePortionSize.reload({
        include: [
          {
            model: CakePortionSize,
            as: "parent",
            attributes: ["id", "name_en"],
          },
        ],
      });
  
      const responseData = {
        ...cakePortionSize.toJSON(),
        image_url: cakePortionSize.image_url
          ? `${UPLOADS_URL}/${cakePortionSize.image_url}`
          : null,
      };
      return res.status(201).json(responseData);
    }catch (error) {
      next(error);
    }
  }

  static async getAllCakePortionSizes(req, res) {
    const { page, limit, offset } = getPagination(req);
    const { keywords, sortField, sortOrder, parent_slug } = req.query;
  
    try {
      const whereClause = {};
  
      if (keywords) {
        whereClause[Op.or] = [
          { name_en: { [Op.like]: `%${keywords}%` } },
          { name_ar: { [Op.like]: `%${keywords}%` } },
        ];
      }
  
      const allowedSortFields = [
        "id",
        "name_en",
        "name_ar",
        "slug",
        "parent_id",
      ];
  
      const finalSortField = allowedSortFields.includes(sortField) ? sortField : "id";
      const finalSortOrder = sortOrder && sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

      const include = [];
        if (parent_slug) {
          include.push({
            model: CakePortionSize,
            as: "parent",
            where: { slug: parent_slug },
            attributes: [],
          });
        } else {
            include.push({
              model: CakePortionSize,
              as: "parent",
              attributes: ["id", "name_en"],
            });
        }
  
      const { count, rows } = await CakePortionSize.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [[finalSortField, finalSortOrder]],
        include,
      });

      const data = rows.map(item => {
        const cakePortionSize = item.toJSON();
        return {
          ...cakePortionSize,
          image_url: cakePortionSize.image_url ? `${UPLOADS_URL}/${cakePortionSize.image_url}` : null,
        };
      });
      const pageCount = Math.ceil(count / limit);
  
      return res.status(200).json({
        pagination: {
          page,
          limit,
          total: count,
          pageCount,
        },
        data,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to retrieve Cake Portion Sizes",
        error: error.message,
      });
    }
  }

  static async updateCakePortionSizeById(req, res, next) {
    const { id } = req.params;
  
    try {
      const cakePortionSize = await CakePortionSize.findByPk(id);
      if (!cakePortionSize) {
        return res.status(404).json({ message: "Cake Portion Size not found" });
      }
  
      const { name_en, name_ar, slug, parent_id } = req.body;
  
      let image_url = cakePortionSize.image_url;
      if (req.file) {
        image_url = req.file.filename;
      }
  
      let parsedParentId = null;
      if (parent_id !== undefined && parent_id !== "" && parent_id !== "null") {
        parsedParentId = Number(parent_id);
      }
  
      if (parsedParentId === Number(id)) {
        return res.status(400).json({
          message: "Cake Portion Size cannot be its own parent",
        });
      }
  
      await cakePortionSize.update({
        name_en: name_en ?? cakePortionSize.name_en,
        name_ar: name_ar ?? cakePortionSize.name_ar,
        slug: slug ?? cakePortionSize.slug,
        parent_id: parsedParentId,
        image_url,
      });
  
      const responseData = {
        ...cakePortionSize.toJSON(),
        image_url: cakePortionSize.image_url
          ? `${UPLOADS_URL}/${cakePortionSize.image_url}`
          : null,
      };
  
      return res.status(200).json(responseData);
    } catch (error) {
      next(error);
    }
  }
      
  static async deleteCakePortionSizeById(req, res) {
    const { id } = req.params;
    try {
      const cakePortionSize = await CakePortionSize.findByPk(id);
      if (!cakePortionSize) {
          return res.status(404).json({ message: "Cake Portion Size not found" });
      }
      await cakePortionSize.destroy();
      return res.status(200).json({ message: "Cake Portion Size deleted successfully" });
    }catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getCakePortionSizeTree(req, res) {
    try {
      const cakePortionSize = await CakePortionSize.findAll({
        where: { parent_id: null },
        attributes: ["id", "name_en", "slug", "parent_id"],
        include: [
          {
            model: CakePortionSize,
            as: "children",
            attributes: ["id", "name_en", "slug", "parent_id"],
            include: [
              {
                model: CakePortionSize,
                as: "children",
                attributes: ["id", "name_en", "slug", "parent_id"],
              },
            ],
          },
        ],
        order: [["id", "ASC"]],
      });
  
      return res.status(200).json({ data: cakePortionSize });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to fetch parent portion size tree",
        error: error.message,
      });
    }
  }
}

module.exports = CakePortionSizeController;