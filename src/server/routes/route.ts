import express, {Request, Response} from 'express';
import { TodoList } from '../models/todoList'

interface ITask {
    title: string,
    description: string;
    status: string;
    taskId: string;
    cost: number;
}

const router = express.Router();

router.get("/api", (req:Request, res:Response): void => {
    res.json({ message: "I was not sleeping on the job and if the database says something else then its lying"});
})
router.get('/api/list', [], async (req:Request, res:Response) => {
    const todoList = await TodoList.find({})
    return res.status(200).send(todoList);
});
router.get('/api/list/:id', [], async (req:Request, res:Response) => {
    const todoList = await TodoList.find({url: req.params.id})
    return res.status(200).send(todoList);
});
router.get('/api/list/freeze/:id', [], async (req:Request, res:Response) => {
    let todoList = await TodoList.find({url: req.params.id});

    await TodoList.updateOne({ url: req.params.id }, {
        readOnly: !todoList[0].readOnly,
    });


    return res.status(200).send(todoList);
});
router.get('/api/list/shared/:id', [], async (req:Request, res:Response) => {
    const todoList = await TodoList.find({sharedUrl: req.params.id})
    return res.status(200).send(todoList);
});

router.post('/api/list', async (req:Request, res:Response) => {
    const { title, description, url, sharedUrl } = req.body;
    const tasks: Array<ITask> = [];
    const totalCost: number = 0;
    const readOnly = false;

    

    const todoList = TodoList.build({ title, description, url, tasks, totalCost, sharedUrl, readOnly });
    await todoList.save();

    return await res.status(201).send(todoList);
})

router.post('/api/list/add/:id', async (req:Request, res:Response) => {
    const { title, description, status, taskId, cost } = req.body;


    
    let todoList = await TodoList.find({url: req.params.id});

    await TodoList.updateOne({ url: req.params.id }, {
        tasks: [...todoList[0].tasks, { 
            title: title,
            description: description,
            status: status,
            taskId: taskId,
            cost: cost,
        }],
        totalCost: todoList[0].totalCost + cost
    });

    todoList = await TodoList.find({url: req.params.id});


    return res.status(200).send(todoList);

})

router.post('/api/list/uppdate/:id', async (req:Request, res:Response) => {
    const {status, taskId } = req.body;

    
    let todoList = await TodoList.find({url: req.params.id});

    const index = todoList[0].tasks.findIndex((task => task.taskId === taskId));

    todoList[0].tasks[index] = { 
        title: todoList[0].tasks[index].title,
        description: todoList[0].tasks[index].description,
        status: status,
        taskId: taskId,
        cost: todoList[0].tasks[index].cost,
    };
    await TodoList.updateOne({ url: req.params.id }, {
        tasks: [...todoList[0].tasks]
    });

    todoList = await TodoList.find({url: req.params.id});


    return res.status(200).send(todoList);

})


export { router as listRouter }