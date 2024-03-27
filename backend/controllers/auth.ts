import {Request,Response} from 'express'
import { PrismaClient } from '@prisma/client';
import { hashSync, compareSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


const prisma = new PrismaClient();

export const login = async(req:Request, res:Response) => {

    try {

        const {email,password} = req.body

        if(!email || !password){
            res.status(400)
            return res.json({message: 'Please fill all the required fields'})
        }

        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        })

        if(!user){
            res.status(400)
            return res.json({message: 'Invalid password'})
        }

        if(!compareSync(password,user.hashedPassword)){
            res.status(403)
            return res.json({message: 'Invalid password'})
            // throw new Error('Invalid password')
        }

        const secret = process.env.JWT_SECRET as string

        const token = jwt.sign({id: user.id}, secret)

        return res.json({user,token})
        
    } catch (error) {
        console.log(error)
    }
    
}


export const signUp = async(req:Request, res:Response) => {
    const {email,password,name} = req.body

    if(!email || !password || !name){
        res.status(400)
        return res.json({message: 'Please fill all the required fields'})
    }

    const checkForDuplicteEmail = await prisma.user.findFirst({
        where: {
            email: email
        }
    })
    
    if(checkForDuplicteEmail){
        res.status(500)
        return res.json({message: 'Email already exists'})
    }

    const user = await prisma.user.create({
        data: {
            email: email,
            hashedPassword: hashSync(password,10),
            name: name
        }
    })
    return res.json(user)
}

export const me = async(req:Request, res:Response) => {
    return res.json(req.user)
}