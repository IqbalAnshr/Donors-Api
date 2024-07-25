const { where } = require('sequelize');
const db = require('../database/models');
const { Op } = require('sequelize');

const requestService = {

  async getAllRequest(query) {
    const { page = 1, limit = 10, search = '', sort = 'desc', filterField = '', filterValue = '' } = query;

    const options = {
      order: [['createdAt', sort.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset: (page - 1) * limit,
      include: [{ model: db.User, attributes: ['id', 'name', 'email', 'phoneNumber', 'profilePicturePath'] }],
    }

    let whereClause = {};

    if (search) {
      whereClause = {
        [Op.or]: [
          { '$User.name$': { [Op.like]: `%${search}%` } },
          { hospital: { [Op.like]: `%${search}%` } },
          { city: { [Op.like]: `%${search}%` } }
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

    const requests = await db.Request.findAndCountAll(options);

    return {
      totalItems: requests.count,
      totalPages: Math.ceil(requests.count / limit),
      currentPage: parseInt(page, 10),
      data: requests.rows,
    };
  },

  async getRequestById(requestId) {
    const request = await db.Request.findByPk(requestId, { include: [{ model: db.User, attributes: ['id', 'name', 'email', 'phoneNumber', 'profilePicturePath'] }] });
    if (!request) {
      throw new Error('Request not found');
    }
    return request;
  },

  async createRequest(userId, data) {
    try {
      const request = await db.Request.create({ ...data, userId });
      return request;
    } catch (error) {
      throw error;
    }
  },

  async getUserRequest(userId) {
    try {
      const requests = await db.Request.findAll({ where: { userId } });
      return requests;
    } catch (error) {
      throw error;
    }
  },

  async getUserRequestById(requestId) {
    try {
      const request = await db.Request.findByPk(requestId);
      if (!request) {
        throw new Error('Request not found');
      }
      return request;
    } catch (error) {
      throw error;
    }
  },

  async updateRequest(requestId, data) {
    try {
      const request = await db.Request.findByPk(requestId);
      if (!request) {
        throw new Error('Request not found');
      }
      await request.update(data);
      return request;
    } catch (error) {
      throw error;
    }
  },

  async deleteRequest(requestId) {
    try {
      const request = await db.Request.findByPk(requestId);
      if (!request) {
        throw new Error('Request not found');
      }
      await request.destroy();
    } catch (error) {
      throw error;
    }
  }
};

module.exports = requestService;
