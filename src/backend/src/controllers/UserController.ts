import { User } from '../entities';
import { Database } from '../modules/database';
import { Request, Response } from 'express';
import {
    ApiError,
    CreateUserRequestBody,
    CreateUserResponseBody,
    DeleteUserRequestBody,
    GetAllUsersResponseBody,
    GetUserRequestParams,
    GetUserResponseBody,
    LoginUserRequestBody,
    LoginUserResponseBody,
    RequestWithUser,
} from '../../../types/api/user/requests';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken';

export default class UserController {
    constructor() {}

    /**
     * Register a new user, this user will then be able to login into the system as an admin.
     */
    static async createUser(
        request: Request<any, any, CreateUserRequestBody>,
        response: Response<CreateUserResponseBody>
    ) {
        const userRepository = Database.getRepository(User);
        const { username, password } = request.body;

        const userExists = await userRepository.existsBy({ username });

        if (userExists) {
            return response.status(400).json({ message: 'User already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let newUser;
        try {
            newUser = userRepository.create({ username, password: hashedPassword });
            newUser = await userRepository.save(newUser);
        } catch (error) {
            return response.status(400).json({ message: 'Invalid user data.' });
        }

        const returnedUser = { uuid: newUser.uuid, username: newUser.username };
        response.status(201).json(returnedUser);
    }

    /**
     * Delete a user by their uuid.
     */
    static async deleteUser(
        request: RequestWithUser<DeleteUserRequestBody>,
        response: Response<undefined | ApiError>
    ) {
        const userRepository = Database.getRepository(User);
        const { uuid } = request.body;
        const userExists = await userRepository.existsBy({ uuid });

        if (!userExists) {
            return response.status(404).json({ message: 'User not found.' });
        }

        try {
            await userRepository.delete({ uuid });
            return response.status(200).json();
        } catch (error) {
            return response.status(400).json({ message: 'Could not delete user.' });
        }
    }

    /**
     * Login a user by setting their jwt http-only cookie
     */
    static async loginUser(
        request: RequestWithUser<LoginUserRequestBody>,
        response: Response<LoginUserResponseBody | ApiError>
    ) {
        const userRepository = Database.getRepository(User);
        const { username, password } = request.body;

        const user = await userRepository.findOneBy({ username });

        if (!user) {
            return response.status(401).json({ message: 'Invalid email or password.' });
        }

        const hashedPassword = user.password;
        const matchedWithHash = await bcrypt.compare(password, hashedPassword);

        if (!matchedWithHash) {
            return response.status(401).json({ message: 'Invalid email or password.' });
        }

        generateToken(response, user.id);
        const returnedUser = { uuid: user.uuid, username: user.username };
        response.status(200).json(returnedUser);
    }

    /**
     * Logout a user by unsetting their cookie
     */
    static async logoutUser(request: Request, response: Response) {
        response.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
        return response.status(200).json({ message: 'User logged out.' });
    }

    /**
     * Get data for the logged in user
     */
    static async getLoggedUser(
        request: RequestWithUser,
        response: Response<GetUserResponseBody | ApiError>
    ) {
        const userRepository = Database.getRepository(User);
        const { user } = request;

        const foundUser = await userRepository.findOneBy({ id: user.id });

        if (!foundUser) {
            return response
                .status(404)
                .json({ message: 'Logged user not found, something has gone very wrong! :(' });
        }

        const returnedUser: GetUserResponseBody = {
            uuid: foundUser.uuid,
            username: foundUser.username,
            creationDate: foundUser.creationDate,
            updateDate: foundUser.updateDate,
            tableVersion: foundUser.tableVersion,
        };
        return response.status(200).json(returnedUser);
    }

    /**
     * Get data for one user by uuid
     */
    static async getUser(
        request: Request<GetUserRequestParams>,
        response: Response<GetUserResponseBody | ApiError>
    ) {
        const userRepository = Database.getRepository(User);
        const { userUuid } = request.params;

        const user = await userRepository.findOneBy({ uuid: userUuid });

        if (!user) {
            return response.status(404).json({ message: 'User not found.' });
        }

        const returnedUser: GetUserResponseBody = {
            uuid: user.uuid,
            username: user.username,
            creationDate: user.creationDate,
            updateDate: user.updateDate,
            tableVersion: user.tableVersion,
        };
        return response.status(200).json(returnedUser);
    }

    /**
     * Get all registered users
     */
    static async getAllUsers(request: Request, response: Response<GetAllUsersResponseBody>) {
        const userRepository = Database.getRepository(User);

        const users = await userRepository.find();

        const returnedUsers: GetAllUsersResponseBody['users'] = users.map((user) => ({
            uuid: user.uuid,
            username: user.username,
            creationDate: user.creationDate,
            updateDate: user.updateDate,
            tableVersion: user.tableVersion,
        }));
        return response.status(200).json({ users: returnedUsers });
    }
}
