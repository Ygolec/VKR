import bcrypt from "bcrypt";
import {PrismaClient, Student} from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient()

const createJwtToken = (user: Student, secret: string, expiresIn: string) => {
    const payload = {
        email: user.email,
        roles: user.roles
    };
    return jwt.sign(payload, secret, { expiresIn });
};

export default defineEventHandler(async (event) => {
    const body:Pick<Student,'email'|'password'> = await readBody(event)

    if (!body.password || !body.email){
        throw createError({
            statusCode:400,
            statusMessage:"Email and password are required"
        })
    }
    const user = await prisma.student.findUnique({where:{email:body.email}});

    if (!user){
        throw createError({
            statusCode:403,
            statusMessage:"Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(body.password,user.password);

    if (!isPasswordValid){
        throw createError({
            statusCode:403,
            statusMessage:"Invalid email or password"
        })
    }

    const jwtSecret = useRuntimeConfig().secretKey || 'your-secret-key';
    const token = createJwtToken(user, jwtSecret, '1h');

    return {
        token,
        user: {
            name:  user.surName+' '+user.name+' '+user.middleName,
            email: user.email,
            roles: user.roles.toString()
        }
    };
})