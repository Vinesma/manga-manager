import { Response } from 'express';
import jwt from 'jsonwebtoken';

const generateToken = (response: Response, userId: number) => {
    const cookieAgeDays = 7;

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: `${cookieAgeDays}d`,
    });

    response.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: cookieAgeDays * 24 * 60 * 60 * 1000,
    });
};

export default generateToken;
