import {Router} from 'express'
import { createContect } from '../controlers/contactus.js';

const contactRoute = Router();

contactRoute.route('/').post(createContect)

export default contactRoute;