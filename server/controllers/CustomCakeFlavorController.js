const { CustomCakeFlavor, CustomCakeType } = require("../models");
const { UPLOADS_URL } = require("../config/config");
const getPagination = require("../utils/pagination");
const { Op } = require("sequelize");

class CustomCakeFlavorController {

  static async createCustomCakeFlavor(req, res, next) {
    try {
      const { name_en, name_ar, custom_cake_type_id, slug, status } = req.body;

      const image_url = req.file ? req.file.filename : null;

      const customCakeFlavor = await CustomCakeFlavor.create({
        name_en,
        name_ar,
        custom_cake_type_id,
        slug,
        status,
        image_url,
      });
      const responseData = {
          ...customCakeFlavor.toJSON(),
          image_url: customCakeFlavor.image_url
            ? `${UPLOADS_URL}/${customCakeFlavor.image_url}`
            : null,
        };
      return res.status(200).json(responseData);
    } catch (error) {
      next(error);
    }
  }

  static async getAllCustomCakeFlavor(req, res) {
    const { page, limit, offset } = getPagination(req);
    const { keywords, sortField, sortOrder } = req.query;

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
        "status",
        "custom_cake_type_id",
      ];

      const finalSortField = allowedSortFields.includes(sortField) ? sortField : "id";
      const finalSortOrder = sortOrder && sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";
      const { count, rows } = await CustomCakeFlavor.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: CustomCakeType,
            as: "customCakeTypes",
            attributes: ["id", "name_en", "name_ar"],
          },
        ],
        limit,
        offset,
        order: [[finalSortField, finalSortOrder]],
      });

      const data = rows.map(item => {
        const customCakeFlavor = item.toJSON();
        return {
          ...customCakeFlavor,
          image_url: customCakeFlavor.image_url
            ? `${UPLOADS_URL}/${customCakeFlavor.image_url}`
            : null,
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
        message: "Failed to get Custom Cake Flavor",
        error: error.message,
      });
    }
  }

  static async updateCustomCakeFlavorById(req, res, next) {
    const { id } = req.params;
    try {
        const customCakeFlavor = await CustomCakeFlavor.findByPk(id);
        if (!customCakeFlavor) {
            return res.status(404).json({ message: "Cake size not found" });
        }
        const {
            name_en,
            name_ar,
            custom_cake_type_id,
            slug,
            status
        } = req.body;

        let image_url = customCakeFlavor.image_url;
          if (req.file) {
            image_url = req.file.filename;
          }

        await customCakeFlavor.update({
          name_en: name_en ?? customCakeFlavor.name_en,
          name_ar: name_ar ?? customCakeFlavor.name_ar,
          custom_cake_type_id: custom_cake_type_id ?? customCakeFlavor.custom_cake_type_id,
          slug: slug ?? customCakeFlavor.slug,
          status: status ?? customCakeFlavor.status,
          image_url: image_url
        });
      
        const responseData = {
          ...customCakeFlavor.toJSON(),
          image_url: customCakeFlavor.image_url
            ? `${UPLOADS_URL}/${customCakeFlavor.image_url}`
            : null,
        };

        return res.status(200).json(responseData);

    } catch (error) {
      next(error);
    }
  }

  static async deleteCustomCakeFlavorById(req, res) {
    try {
      const { id } = req.params;
      const customCakeFlavor = await CustomCakeFlavor.findByPk(id);
      if(!customCakeFlavor) {
        return res.status(404).json({ message: "Cake size not found" });
      }
      await customCakeFlavor.destroy();
      return res.status(200).json({ message: "Custom Cake Flavor Deleted successfully" });     
    }
    catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
}
module.exports = CustomCakeFlavorController;
