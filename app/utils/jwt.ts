import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();

interface IJWT {
  id: string;
  expireIn?: string;
}

export const createToken = ({id, expireIn = '2d'}: IJWT) => {
  return jwt.sign({id}, process.env.JWT_SECRET ?? 'secret', {expiresIn: expireIn});
}