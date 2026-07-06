const IceCreamAddOn = require("../models/IceCreamAddOn");
const { UPLOADS_URL } = require("../config/config");
const getPagination = require("../utils/pagination");
const { Op } = require("sequelize");

class IceCreamAddOnController {
  static async createIceCreamAddOn(req, res, next) {
    try {
      const { name_en, name_ar, slug, type, status } = req.body;

      const image_url = req.file ? req.file.filename : null;

      const iceCreamaddon = await IceCreamAddOn.create({
        name_en,
        name_ar,
        slug,
        type,
        status,
        image_url,
      });

      const responseData = {
        ...iceCreamaddon.toJSON(),
        image_url: iceCreamaddon.image_url
          ? `${UPLOADS_URL}/${iceCreamaddon.image_url}`
          : null,
      };

      return res.status(201).json(responseData);
    }catch (error) {
      next(error);
    }
  }

  static async getAllIceCreamAddOns(req, res) {
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
        "type",
        "status",
      ];

      const finalSortField = allowedSortFields.includes(sortField) ? sortField : "id";
      const finalSortOrder = sortOrder && sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

      const { count, rows } = await IceCreamAddOn.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [[finalSortField, finalSortOrder]],
      });

      // 🔥 IMAGE URL BUILD HERE
      const data = rows.map(item => {
        const iceCreamaddon = item.toJSON();
        return {
          ...iceCreamaddon,
          image_url: iceCreamaddon.image_url
            ? `${UPLOADS_URL}/${iceCreamaddon.image_url}`
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
        message: "Failed to retrieve IceCream AddOns",
        error: error.message,
      });
    }
  }

  static async updateIceCreamAddOnById(req, res, next) {
    const { id } = req.params;
    try {
      const iceCreamAddOn = await IceCreamAddOn.findByPk(id);
      if(!iceCreamAddOn) {
        return res.status(404).json({ message: "IceCream AddOn not found" });
      }

      const { name_en, name_ar, slug, type, status, } = req.body;

      // ✅ IMPORTANT: image ko overwrite mat karo agar new image nahi aayi
      let image_url = iceCreamAddOn.image_url;
      if (req.file) {
        image_url = req.file.filename;
      }

      await iceCreamAddOn.update({
        name_en: name_en ?? iceCreamAddOn.name_en,
        name_ar: name_ar ?? iceCreamAddOn.name_ar,
        slug: slug ?? iceCreamAddOn.slug,
        type: type ?? iceCreamAddOn.type,
        status: status ?? iceCreamAddOn.status,
        image_url: image_url
      });

      // 🔥 BUILD FULL IMAGE URL FOR FRONTEND
      const responseData = {
        ...iceCreamAddOn.toJSON(),
        image_url: iceCreamAddOn.image_url
          ? `${UPLOADS_URL}/${iceCreamAddOn.image_url}`
          : null,
      };

      return res.status(200).json(responseData);

    }catch (error) {
      next(error);
    }
  }

  static async deleteIceCreamAddOnById(req, res) {
    const { id } = req.params;
    try {
      const iceCreamaddon = await IceCreamAddOn.findByPk(id);
      if (!iceCreamaddon) {
        return res.status(404).json({ message: "IceCream AddOn not found" });
      }
      await iceCreamaddon.destroy();
      return res.status(200).json({ message: "IceCream AddOn deleted suucessfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = IceCreamAddOnController;
