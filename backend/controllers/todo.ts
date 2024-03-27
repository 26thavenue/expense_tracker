import { PrismaClient } from '@prisma/client';
import {Request, Response} from 'express';

const prisma = new PrismaClient();

export const getAllUserTodos = async(req: Request, res: Response) => {
    const userId = req.user?.id;
     if(!userId){
        return res.json({message:'User not found'}).status(404)
    }
    try {
        const todos = await prisma.todo.findMany(
            {
                where: {
                    userId: userId
                }
            }
        )
        return res.json(todos).status(200)
    } catch (error) {
        console.log(error);
    }
}

export const getOneTodo= async(req: Request, res: Response) => {
    const {id} = req.params;

    try {
        const todo = await prisma.todo.findUnique({
            where: {id: id}
        })
        return res.json(todo).status(200)
    } catch (error) {
        return res.json({message:'Todo not found'}).status(404)
    }

}

export const createTodo= async(req: Request, res: Response) => {
    const userId = req.user?.id;
    if(!userId){
        return res.json({message:'User not found'}).status(404)
    }
    const {title,description} = req.body;

    if(!title || !description){
        return res.json({message:'Title and description are required'}).status(404)
    }

    try {
        const todo = await prisma.todo.create({
            data: {
                title,
                description,
                userId
            }
        })
        return res.json(todo).status(200)
    } catch (error) {
        console.log(error)
        return res.json({message:'Error creating todo'}).status(500)
    }

}

export const markTodoAsDone = async(req: Request, res: Response) => {
    const {id} = req.params;

    if(!id){
            return res.json({message:'Todo not found'}).status(404)
    }

    const userId = req.user?.id
    if(!userId){
        return res.json({message:'User not found'}).status(404)
    }
    try {
       const todo = await prisma.todo.findUnique({
              where: {id:id}
        })
        if(!todo){
            return res.json({message:'Not found'}).status(404)
        }
        if(todo.userId !== userId){
            return res.json({message:'You are not authorized to mark this todo as done'}).status(401)
        }


        const updatedTodo = await prisma.todo.update({
            where: {id:id},
            data: {
                completed: true
            }
        })
        return res.json(updatedTodo).status(200)
    } catch (error) {
        return res.json({message:'Todo not found'}).status(404)
    }

}

export const updateTodo = async(req: Request, res: Response) => {
    const {id} = req.params;
    const{title,description} = req.body;

    if(!id){
            return res.json({message:'Todo not found'}).status(404)
    }

    const userId = req.user?.id
    if(!userId){
        return res.json({message:'User not found'}).status(404)
    }
    try {
       const todo = await prisma.todo.findUnique({
              where: {id:id}
        })
        if(!todo){
            return res.json({message:'Todo not found'}).status(404)
        }
        if(todo.userId !== userId){
            return res.json({message:'You are not authorized to mark this todo as done'}).status(401)
        }


        const updatedTodo = await prisma.todo.update({
            where: {id:id},
            data: {
                title,
                description
            }
        })
        return res.json(updatedTodo).status(200)
    } catch (error) {
        return res.json({message:'Todo not found'}).status(404)
    }

}

export const deleteTodo = async (req: Request, res: Response) =>{
        const {id} = req.params
        if(!id) return res.json({message: 'No ID found '}).status(404)

        const userId = req.user?.id
        if(!userId){
            return res.json({message:'User not found'}).status(404)
        }
        try {
             const todo = await prisma.todo.findUnique({
              where: {id:id}
            })
            if(!todo){
                return res.json({message:'Todo not found'}).status(404)
            }
            if(todo.userId !== userId){
                return res.json({message:'You are not authorized to mark this todo as done'}).status(401)
            }

            const deletedTodo = await prisma.todo.delete({
            where: {id:id},
            
        })
        return res.json('Your todo has been deleted').status(200)
        } catch (error) {
            return res.json({message:'Todo not found'}).status(404)
        }
}
