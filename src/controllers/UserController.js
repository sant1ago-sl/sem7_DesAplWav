    import userService from '../services/UserService.js';

class UserController {

    async getAll(req, res, next) {
        try {
            const users = await userService.getAll();
            res.status(200).json(users);
        } catch (err) {
            next(err);
        }
    }

    async getMe(req, res, next) {
        try {
            const user = await userService.getById(req.userId);
            res.status(200).json(user);
        } catch (err) {
            next(err);
        }
    }

    async updateMe(req, res, next) {
        try {
            const data = req.body;
            if (req.file) {
                
                data.url_profile = '/uploads/' + req.file.filename;
            }
            const updatedUser = await userService.update(req.userId, data);
            res.status(200).json(updatedUser);
        } catch (err) {
            next(err);
        }
    }

    async deleteUser(req, res, next) {
        try {
            const result = await userService.delete(req.params.id);
            res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    }
}

export default new UserController();
