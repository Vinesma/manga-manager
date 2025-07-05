import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import { Database } from '../modules/database';
import { User } from '../entities';
import { RequestWithUser, SignedJwtUserId } from '../../../types/api/user/requests';

const isSignedJwtUserPayload = (decoded: string | JwtPayload): decoded is SignedJwtUserId => {
    return typeof decoded !== 'string' && 'userId' in decoded;
};

const protect = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    const userRepository = Database.getRepository(User);
    let token = request.cookies.jwt;

    if (!token) {
        return response.status(401).json({ message: 'Unauthorized.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!isSignedJwtUserPayload(decoded)) {
            return response.status(401).json({ message: 'Unauthorized.' });
        }

        request.user = await userRepository.findOne({
            where: { id: decoded.userId },
            select: { id: true, username: true },
        });

        next();
    } catch (error) {
        return response.status(401).json({ message: 'Unauthorized.' });
    }
};

export { protect };
