import { Month, PrismaClient } from '@prisma/client';
import {Request, Response} from 'express';

const prisma = new PrismaClient();

export const getAllUserBudget = async(req: Request, res: Response) => {
    const userId = req.user?.id;
     if(!userId){
        return res.json({message:'User not found'}).status(404)
    }
    try {
        const expenses = await prisma.expenses.findMany(
            {
                where: {
                    userId: userId
                }
            }
        )
        return res.json(expenses).status(200)
    } catch (error) {
        console.log(error);
    }
}

export const getUserBudgetByMonth = async(req: Request, res: Response) => {
    const userId = req.user?.id;
     if(!userId){
        return res.json({message:'User not found'}).status(404)
    }
    const month = req.params.month.toUpperCase();
    // Ensure that monthParam is a valid month enum value
    if (!Object.values(Month).includes(month as Month)) {
        return res.status(400).json({ message: 'Invalid month' });
    }

    
    if(!month){
        return res.json({message:'Month not found'}).status(404)
    }
    try {
        const expenses = await prisma.expenses.findMany(
            {
                where: {
                    userId: userId,
                    month: month as Month
                }
            }
        )
        return res.json(expenses).status(200)
    } catch (error) {
        console.log(error);
    }
}

export const getOneBudget= async(req: Request, res: Response) => {
    const {id} = req.params;

    try {
        const expense = await prisma.expenses.findUnique({
            where: {id: id}
        })
        return res.json(expense).status(200)
    } catch (error) {
        return res.json({message:'Expense not found'}).status(404)
    }

}

export const createBudget= async(req: Request, res: Response) => {
    const userId = req.user?.id;
    if(!userId){
        return res.json({message:'User not found'}).status(404)
    }
    const {title,amount,month} = req.body;

    if(!title || !amount || !month){
        return res.json({message:'Please input all fields'}).status(404)
    }

   

    if (!Object.values(Month).includes(month as Month)) {
        return res.status(400).json({ message: 'Invalid month' });
    }


    try {
        const expense = await prisma.expenses.create({
            data: {
                title,
                amount,
                month,
                userId
            }
        })
        return res.json(expense).status(200)
    } catch (error) {
        console.log(error)
        return res.json({message:'Error creating Expense'}).status(500)
    }

}



export const updateBudget = async(req: Request, res: Response) => {
    const {id} = req.params;

    if(!id){
            return res.json({message:'Not found'}).status(404)
    }

    const userId = req.user?.id
    if(!userId){
        return res.json({message:'User not found'}).status(404)
    }
     const {title,amount,month} = req.body;

    if(!title || !amount || !month){
        return res.json({message:'Please input all fields'}).status(404)
    }

   

    if (!Object.values(Month).includes(month as Month)) {
        return res.status(400).json({ message: 'Invalid month' });
    }


    try {
       const expense = await prisma.expenses.findUnique({
              where: {id:id}
        })
        if(!expense){
            return res.json({message:'Expense not found'}).status(404)
        }
        if(expense.userId !== userId){
            return res.json({message:'You are not authorized to do this'}).status(401)
        }


        const updatedExpense = await prisma.expenses.update({
            where: {id:id},
            data: {
                title,
                amount,
                month,
            }
        })
        return res.json(updatedExpense).status(200)
    } catch (error) {
        return res.json({message:'An error occured'}).status(404)
    }

}

export const deleteBudget = async(req: Request, res: Response) => {
    const {id} = req.params;

    if(!id){
            return res.json({message:'Todo not found'}).status(404)
    }

    const userId = req.user?.id
    if(!userId){
        return res.json({message:'User not found'}).status(404)
    }


    try {
       const budget = await prisma.budget.findUnique({
              where: {id:id}
        })
        if(!budget){
            return res.json({message:'Todo not found'}).status(404)
        }
        if(budget.userId !== userId){
            return res.json({message:'You are not authorized to do this'}).status(401)
        }


        const updatedBudget = await prisma.budget.delete({
            where: {id:id},
        })
        return res.json(updatedBudget).status(200)
    } catch (error) {
        return res.json({message:'Todo not found'}).status(404)
    }

}