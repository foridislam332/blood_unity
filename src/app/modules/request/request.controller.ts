import httpStatus from 'http-status';
import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { RequestServices } from "./request.service";
import { pick } from '../../utils/pick';

const createRequest = catchAsync(async (req: Request, res: Response) => {
    const result = await RequestServices.createRequestIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Request created in successfully',
        data: result
    });
});

const getRequests = async (req: Request, res: Response) => {
    const filter = pick(req.query, ['name', 'email', 'search']);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

    const result = await RequestServices.getRequestFromDB(filter, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Requests retrieve successfully',
        data: result
    });
}

export const RequestControllers = {
    createRequest,
    getRequests
}