import { PrismaClient } from '@prisma/client';
import {Request, Response} from 'express';
import { hashSync} from 'bcrypt';

const prisma = new PrismaClient();

export const getAllUsers = async(req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany()
        return res.json(users).status(200)
    } catch (error) {
        console.log(error);
    }
}

export const getOneUser = async(req: Request, res: Response) => {
    const {id} = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: {id: id}
        })
        return res.json(user).status(200)
    } catch (error) {
        console.log(error);
    }
}

export const changePassword = async(req: Request, res: Response) =>{
    const userId = req.user?.id;
    const { oldPassword, newPassword} = req.body;

    if(!userId){
        return res.json({message:'User not found'}).status(404)
    }
    if( !oldPassword || !newPassword){
        return res.json({message:'Name and password are required'}).status(404)
    }

    try {
        const user = await prisma.user.findUnique({
            where: {id: userId}
        })
        if(!user){
            return res.json({message:'User not found'}).status(404)
        }
        if(user.hashedPassword !== hashSync(oldPassword,10)){
            return res.json({message:'Password not found'}).status(404)
        }
        
        const updatedUser = await prisma.user.update({
            where: {id:userId },
            data: {
                hashedPassword: hashSync(newPassword,10),
            }
        })
        return res.json(updatedUser).status(200)
    } catch (error) {
        console.log(error)
        return res.json({message:'Error updating user'}).status(500)
    }

   
}

export const updateUser = async(req:Request,res:Response) => {
        const userId = req.user?.id;
        const {name, email} = req.body;

        if(!userId){
            return res.json({message:'User not found'}).status(404)
        }
        if( !name || !email){
            return res.json({message:'Name and email are required'}).status(404)
        }
        try {
            const user = await prisma.user.update({
                where: {id: userId},
                data:{
                    name,
                    email
                }
            })

            return res.json(user).status(200)
        } catch (error) {
            return res.json({message:'Error updating user'}).status(500)
        }

}