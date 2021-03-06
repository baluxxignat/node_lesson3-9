const { ErrorHandler } = require('../errors');
const { User } = require('../dataBase');
const {
    messages: {
        M_NOT_FOUND,
        FORBIDDEN_MSG
    }
} = require('../config');
const {
    statusCodes: {
        NOT_FOUND,
        BAD_REQUEST,
        FORBIDDEN
    }
} = require('../config');
const { userValidator } = require('../validators');

module.exports = {

    validateSomeFilds: (valid) => (req, res, next) => {
        try {
            const { error } = valid.validate(req.body);

            if (error) {
                throw new ErrorHandler(BAD_REQUEST, error.details[0].message);
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    preLoginUser: (req, res, next) => {
        try {
            const { error } = userValidator.preLoginValidator.validate(req.body);

            if (error) {
                throw new ErrorHandler(BAD_REQUEST, error.details[0].message);
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    checkUserRole: (rolesArr = []) => (req, res, next) => {
        try {
            const { role } = req.user;

            if (!rolesArr.length) {
                return next();
            }

            if (!rolesArr.includes(role)) {
                throw new ErrorHandler(FORBIDDEN, FORBIDDEN_MSG);
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    getItemByDynamicParams: (paramName, searchIn = 'body', dbFiled = paramName) => async (req, res, next) => {
        try {
            const valueParam = req[searchIn][paramName];

            const user = await User.findOne({ [dbFiled]: valueParam });

            if (!user) {
                throw new ErrorHandler(NOT_FOUND, M_NOT_FOUND);
            }

            req.user = user;
            next();
        } catch (e) {
            next(e);
        }
    },

};
