import { Request } from 'express';
import { User } from '../../../backend/src/entities';
import { JwtPayload } from 'jsonwebtoken';

export interface SignedJwtUserId extends JwtPayload {
    userId: number;
}

export type ApiError = {
    message: string;
};

export type RequestWithUser<Body = any, Params = any, Query = any, Locals = any> = {
    user: User;
} & Request<Params, any, Body, Query, Locals>;

export type CreateUserRequestBody = {
    username: string;
    password: string;
};

export type CreateUserResponseBody = Pick<User, 'uuid' | 'username'> | ApiError;

export type DeleteUserRequestBody = {
    uuid: string;
};

export type LoginUserRequestBody = CreateUserRequestBody;
export type LoginUserResponseBody = CreateUserResponseBody;

export type GetUserRequestParams = {
    userUuid: string;
};
export type GetUserResponseBody = Omit<User, 'id' | 'password' | 'generateUuid'>;

export type GetAllUsersResponseBody = {
    users: Omit<User, 'id' | 'password' | 'generateUuid'>[];
};
