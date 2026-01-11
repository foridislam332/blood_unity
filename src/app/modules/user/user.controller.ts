import httpStatus from "http-status";
import { Request, Response } from "express";
import { UserServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import { pick } from "../../utils/pick";
import { catchAsync } from "../../utils/catchAsync";

const createUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UserServices.createUserToDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User created in successfully',
        data: result
    });
});

const getUsers = async (req: Request, res: Response) => {
    const filter = pick(req.query, ['name', 'email', 'search']);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

    const result = await UserServices.getUsersFromDB(filter, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Users retrieve successfully',
        data: result
    });
}

export const UserControllers = {
    createUser,
    getUsers
}