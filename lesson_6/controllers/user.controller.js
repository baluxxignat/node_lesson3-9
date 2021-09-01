const { functionService } = require('../services');
const { User } = require('../dataBase');
const { statusCodes: { OK } } = require('../config');
const { messages: { DELETED } } = require('../config');
const { passwordService } = require('../services');
const { user_normalizator: { userToNormalize } } = require('../utils');

module.exports = {

    getAllUsers: async (req, res, next) => {
        try {
            const allUsers = await functionService.getAllItems(User, req.query);

            const normalizeAllUsers = allUsers.map((item) => userToNormalize(item));

            res.json(normalizeAllUsers);
        } catch (e) {
            next(e);
        }
    },

    getSingleUser: (req, res, next) => {
        try {
            const userNormalized = userToNormalize(req.user);

            res.json(userNormalized);
        } catch (e) {
            next(e);
        }
    },

    createUser: async (req, res, next) => {
        try {
            const { password } = req.body;

            const hashedPassword = await passwordService.hashPassword(password);

            const createdUser = await functionService.createItem(User, { ...req.body, password: hashedPassword });

            const userNormalized = userToNormalize(createdUser);

            res.json(userNormalized);
        } catch (e) {
            next(e);
        }
    },

    deleteUser: async (req, res, next) => {
        try {
            const { user_id } = req.params;
            await functionService.deleteCurrentItem(User, user_id);

            res.status(OK).json(`${user_id} ${DELETED}`);
        } catch (e) {
            next(e);
        }
    },

    updateUser: async (req, res, next) => {
        try {
            const { user_id } = req.params;
            const updatedUser = await functionService.updateItem(User, user_id, req.body);

            res.json(updatedUser);
        } catch (e) {
            next(e);
        }
    }
};
