'use strict';
const db = require('../database/models');
const { Op } = require('sequelize');

const donorService = {
  async createDonor(userId, data) {
    try {
      const donor = await db.Donor.create({ ...data, userId });
      return donor;
    } catch (error) {
      throw error;
    }
  },

  async getAllDonors(query) {
    try {
      const { page = 1, limit = 10, search = '', sort = 'desc', filterField = '', filterValue = '' } = query;

      const options = {
        order: [['createdAt', sort.toUpperCase()]],
        limit: parseInt(limit, 10),
        offset: (page - 1) * limit,
        include: [{
          model: db.User, attributes: ['id', 'name', 'email', 'phoneNumber', 'profilePicturePath'], include: [
            {
              model: db.Address,
              attributes: ['city', 'district']
            }
          ]
        }],
      }

      let whereClause = {};

      if (search) {
        whereClause = {
          [Op.or]: [
            { '$User.name$': { [Op.like]: `%${search}%` } },
          ],
        };
      }

      if (filterField && filterValue) {
        if (Object.keys(whereClause).length) {
          whereClause = {
            [Op.and]: [
              whereClause,
              { [filterField]: { [Op.like]: `%${filterValue}%` } }
            ]
          };
        } else {
          whereClause = {
            [filterField]: { [Op.like]: `%${filterValue}%` }
          };
        }
      }

      options.where = whereClause;

      const requests = await db.Donor.findAndCountAll(options);

      return {
        totalItems: requests.count,
        totalPages: Math.ceil(requests.count / limit),
        currentPage: parseInt(page, 10),
        data: requests.rows,
      };
    } catch (error) {
      throw error;
    }
  },

  async getDonorById(donorId) {
    try {
      const donor = await db.Donor.findByPk(donorId, {
        include: [{
          model: db.User, attributes: ['id', 'name', 'email', 'phoneNumber', 'profilePicturePath'], include: [
            {
              model: db.Address,
              attributes: ['city', 'district']
            }]
        }]
      });
      if (!donor) {
        throw new Error('Donor not found');
      }
      return donor;
    } catch (error) {
      throw error;
    }
  },

  async getUserDonors(userId) {
    try {
      const donors = await db.Donor.findAll({ where: { userId } });
      return donors;
    } catch (error) {
      throw error;
    }
  },

  async getUserDonorById(donorId) {
    try {
      const donor = await db.Donor.findByPk(donorId);
      if (!donor) {
        throw new Error('Donor not found');
      }
      return donor;
    } catch (error) {
      throw error;
    }
  },

  async updateDonor(donorId, data) {
    try {
      const donor = await db.Donor.findByPk(donorId);
      if (!donor) {
        throw new Error('Donor not found');
      }
      await donor.update(data);
      return donor;
    } catch (error) {
      throw error;
    }
  },

  async deleteDonor(donorId) {
    try {
      const donor = await db.Donor.findByPk(donorId);
      if (!donor) {
        throw new Error('Donor not found');
      }
      await donor.destroy();
    } catch (error) {
      throw error;
    }
  }
};

module.exports = donorService;
