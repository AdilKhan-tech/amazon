const Gender = require("../models/Gender");
const getPagination = require("../utils/pagination");
const { Op } = require("sequelize");

class GenderController {

    static async createGender(req, res, next) {
        try {
            const { name_en, name_ar, parent_gender, slug } = req.body;

            const image_url = req.file?.path || null;

            const gender = await Gender.create({
                name_en,
                name_ar,
                parent_gender,
                slug,
                image_url,
            });
            return res.status(201).json(gender);
        }catch (error) {
            next(error)
        }
    }

    static async getAllGenders(req, res) {
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
                "name_ar",
                "parent_gender",
            ];
    
            const finalSortField = allowedSortFields.includes(sortField) ? sortField : "id";
            const finalSortOrder = sortOrder && sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";
        
            const { count, rows } = await Gender.findAndCountAll({
                where: whereClause,
                limit,
                offset,
                order: [[finalSortField, finalSortOrder]],
            });
    
            const pageCount = Math.ceil(count / limit);
        
            return res.status(200).json({
                pagination: {
                    page,
                    limit,
                    total: count,
                    pageCount,
                },
                data: rows,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Failed to retrieve genders",
                error: error.message,
            });
        }
    }

    static async updateGenderById(req, res, next) {
        const { id } = req.params;
        try {
            const gender = await Gender.findByPk(id);
            if (!gender) {
                return res.status(404).json({ message: "Gender not found" });
            }
        
            const { name_en, name_ar, parent_gender, slug } = req.body;
        
            const image_url = req.file?.path || gender.image_url;
        
            await gender.update({
                name_en: name_en ?? gender.name_en,
                name_ar: name_ar ?? gender.name_ar,
                parent_gender: parent_gender ?? gender.parent_gender,
                slug: slug ?? gender.slug,
                image_url: image_url
            });
        
            return res.status(200).json(gender);
    
        }catch (error) {
            next(error);
        }
      }

    static async deleteGenderById(req, res) {
        const { id } = req.params;
        try {
            const gender = await Gender.findByPk(id);
            if (!gender) {
                return res.status(404).json({ message: "Gender not found" });
            }
            await gender.destroy();
            return res.status(200).json({ message: "Gender deleted successfully" });
        } catch (error) {
            return res.status(500).json({ message: "Failed to delete gender", error: error.message });
        }
    }
}

module.exports = GenderController;
