import express from 'express';
import { UserController } from '../controllers';
import { protect } from '../middleware/authMiddleware';

export default class ApiRouter {
    router;

    constructor() {
        this.router = express.Router();
        this.init();
    }

    init() {
        this.router
            .route('/user')
            .post(UserController.createUser)
            .delete(protect, UserController.deleteUser);
        this.router.post('/user/login', UserController.loginUser);
        this.router.post('/user/logout', UserController.logoutUser);
        this.router
            .route('/user/profile/:userUuid')
            .get(protect, UserController.getUser)
            .put(protect, () => {});
        this.router.get('/user/me', protect, UserController.getLoggedUser);
        this.router.get('/user/all', protect, UserController.getAllUsers);
    }
}
