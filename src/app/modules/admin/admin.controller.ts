import { Request, Response } from "express";
import { AdminServices } from "./admin.service";
import { pick } from "../../../shared/pick";
import { sendResponse } from "../../../helpers/sendResponse";
import { catchAsync } from "../../../shared/catchAsync";
import httpStatus from "http-status";

const getAdmin = catchAsync(async (req: Request, res: Response) => {
    const filter = pick(req.query, ['name', 'email', 'search']);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

    const result = await AdminServices.getAdminsFromDB(filter, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admins retrieve successfully',
        data: result.data,
        meta: result.meta
    });
});

const getAdminById = async (req: Request, res: Response) => {
    const result = await AdminServices.getAdminByIdFromDB(req.params.id);

    res.status(200).json({
        success: true,
        message: 'Admin retrieve successfully',
        data: result
    })
};

const updateAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminServices.updateAdminToDB(req.params.id, req.body);

    res.status(200).json({
        success: true,
        message: 'Admin updated successfully',
        data: result
    })
});

export const AdminControllers = {
    getAdmin,
    getAdminById,
    updateAdmin
}