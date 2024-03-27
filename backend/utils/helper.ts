// import { PrismaClient } from '@prisma/client';


// const prisma = new PrismaClient();

// enum ModelName{
//     User = 'user',
//     Todo = 'todo'

// }

// export const validate = async (modelName:ModelName, id:string, userId:string) => {
//     const model = await prisma[modelName].findUnique({
//         where: { id: id }
//     });
//     if (!model) {
//         return { message: `${modelName} not found`, status: 404 };
//     }
//     if (model.userId !== userId) {
//         return { message: `You are not authorized to access this ${modelName}`, status: 401 };
//     }
//     return { message: `${modelName} found and authorized`, status: 200 }; // Or any other default message
// };


