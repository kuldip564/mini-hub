import {Router} from 'express';
import { createEvint, getEvint } from '../controlers/evint.js';
import { isLoggedIn } from '../maidlewhere/authmaidlewhare.js';
import upload from '../maidlewhere/multer.js';
const evintRouter = Router();

evintRouter.route('/')
.post(isLoggedIn,upload.single('thublenail'),createEvint)
.get(getEvint)

export default evintRouter;

