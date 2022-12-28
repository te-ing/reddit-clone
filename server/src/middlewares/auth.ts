import { User } from '@/entity/User';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: User | undefined = res.locals.user;
    if (!user) throw Error('unatuthentcated');
    return next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: 'Something went wrong on auth' });
  }
};
