import { prisma } from "../../../lib/prisma";
import * as bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwt";

export type ILogin = {
    email: string,
    password: string
}

const loginUserIntoDB = async (payload: ILogin) => {
    const { email, password } = payload;
    const user = await prisma.user.findUniqueOrThrow({
        where: { email }
    });

    const isPasswordValid: boolean = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Password incorrect!')
    }

    const accessToken = generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role
    });

    const refreshToken = generateRefreshToken({
        id: user.id,
        email: user.email,
        role: user.role
    });

    return {
        accessToken,
        refreshToken,
    };
};

const refreshToken = async (token: string) => {
    const decoded = verifyRefreshToken(token);

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: decoded?.email
        }
    });

    const accessToken = generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role
    });

    return { accessToken };
};

export const AuthServices = {
    loginUserIntoDB,
    refreshToken
};