import express from 'express';
import UserController from '../controllers/UserController.js';
import authenticate from '../middlewares/authenticate.js';
import authorize from '../middlewares/authorize.js';
import upload from '../middlewares/upload.js';

const router = express.Router();


router.get('/', authenticate, authorize(['admin']), UserController.getAll);


router.get('/me', authenticate, authorize([]), UserController.getMe);


router.put('/me', authenticate, authorize([]), upload.single('avatar'), UserController.updateMe);


router.delete('/:id', authenticate, authorize(['admin']), UserController.deleteUser);

export default router;
