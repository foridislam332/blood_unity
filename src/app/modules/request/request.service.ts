import { prisma } from "../../../lib/prisma"
import { BloodRequest, Prisma } from "../../../generated/prisma/client";
import { calculatePagination, IOptions } from "../../utils/paginationHelpers";

const createRequestIntoDB = async (payload: BloodRequest) => {
    const result = await prisma.bloodRequest.create({
        data: payload
    });

    return result;
};

const getRequestFromDB = async (filter: any, options: IOptions) => {
    const { search, ...filterData } = filter || {};
    const { page, skip, limit, sortBy, sortOrder } = calculatePagination(options);

    const addConditions: Prisma.BloodRequestWhereInput[] = [];

    const searchAbleFields = ['phoneNumber', 'hospitalName'];
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

    const whereConditions: Prisma.BloodRequestWhereInput = { AND: addConditions };

    const result = await prisma.bloodRequest.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            donor: true,
            requester: true
        }
    });

    const totalCount = await prisma.bloodRequest.count({ where: whereConditions });
    return {
        data: result,
        meta: {
            page,
            limit,
            totalCount
        }
    };
}

export const RequestServices = {
    createRequestIntoDB,
    getRequestFromDB
}