
import { Admin, Prisma } from "@prisma/client";
import { prisma } from "../../../lib/prisma"
import { calculatePagination, IOptions } from "../../../helpers/paginationHelpers";

const getAdminsFromDB = async (filter: any, options: IOptions) => {
    const { search, ...filterData } = filter || {};
    const { page, skip, limit, sortBy, sortOrder } = calculatePagination(options);

    const addConditions: Prisma.AdminWhereInput[] = [];

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

    addConditions.push({ is_deleted: false });

    const whereConditions: Prisma.AdminWhereInput = { AND: addConditions };

    const result = await prisma.admin.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        }
    });

    const totalCount = await prisma.admin.count({ where: whereConditions });
    return {
        data: result,
        meta: {
            page,
            limit,
            totalCount
        }
    };
};

const getAdminByIdFromDB = async (id: string) => {
    const result = await prisma.admin.findUnique({
        where: { id, is_deleted: false }
    });
    return result;
};

const updateAdminToDB = async (id: string, payload: Partial<Admin>) => {
    await prisma.admin.findUniqueOrThrow({ where: { id, is_deleted: false } });

    const result = await prisma.admin.update({
        where: { id },
        data: payload
    })
    return result;
}

export const AdminServices = {
    getAdminsFromDB,
    getAdminByIdFromDB,
    updateAdminToDB
}