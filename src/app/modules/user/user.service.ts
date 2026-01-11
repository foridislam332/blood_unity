import { Prisma, User } from "../../../generated/prisma/client";
import { UserRole } from "../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";
import * as bcrypt from 'bcrypt'
import { calculatePagination, IOptions } from "../../utils/paginationHelpers";

const createUserToDB = async (payload: { password: string, user: User }) => {
    const hashedPassword: string = await bcrypt.hash(payload.password, 12);

    const userData = {
        ...payload.user,
        password: hashedPassword,
        role: UserRole.USER
    };

    const result = await prisma.$transaction(async (transactionClient) => {
        const user = await transactionClient.user.create({
            data: userData
        });

        await transactionClient.userProfile.create({
            data: { userId: user.id }
        });

        return user;
    });

    return result;
}

const getUsersFromDB = async (filter: any, options: IOptions) => {
    const { search, ...filterData } = filter || {};
    const { page, skip, limit, sortBy, sortOrder } = calculatePagination(options);

    const addConditions: Prisma.UserWhereInput[] = [];

    const searchAbleFields = ['name', 'email'];
    if (search) {
        addConditions.push({
            OR: searchAbleFields.map(field => ({
                [field]: {
                    contains: search,
                    mode: 'insensitive'
                }
            }))
        })
    }

    if (Object.keys(filterData).length > 0) {
        addConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    };

    const whereConditions: Prisma.UserWhereInput = { AND: addConditions };

    const result = await prisma.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            profile: true,
            donorRequests: true,
            requesterRequests: true
        }
    });

    const totalCount = await prisma.user.count({ where: whereConditions });
    return {
        data: result,
        meta: {
            page,
            limit,
            totalCount
        }
    };
}

export const UserServices = {
    createUserToDB,
    getUsersFromDB
}