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
    console.log("server was called")
    res.json({ message: "I was not sleeping on the job and if the database says something else then its lying"});
})
router.get('/api/list', [], async (req:Request, res:Response) => {
    console.log("list was called");
    const todoList = await TodoList.find({})
    return res.status(200).send(todoList);
});
router.get('/api/list/:id', [], async (req:Request, res:Response) => {
    console.log("list was called with id: " + req.params);
    console.log(req.params);
    const todoList = await TodoList.find({url: req.params.id})
    return res.status(200).send(todoList);
});


router.post('/api/list', async (req:Request, res:Response) => {
    console.log("i was called")
    console.log(req.body)
    const { title, description, url } = req.body;
    const tasks: Array<ITask> = [];
    const totalCost: number = 0;
    console.log('title: ' + title);
    console.log('description: ' + description);
    console.log('description: ' + url);

    
    console.log(1);

    const todoList = TodoList.build({ title, description, url, tasks, totalCost });
    console.log(2);
    console.log(todoList)
    await todoList.save();
    console.log(3);

    return await res.status(201).send(todoList);
})

router.post('/api/list/add/:id', async (req:Request, res:Response) => {
    const { title, description, status, taskId, cost } = req.body;
    console.log('title: ' + title);
    console.log('description: ' + description);
    console.log("status " + status)
    console.log('taskId: ' + taskId);
    console.log('cost: ' + cost);


    console.log(1);
    
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
    console.log(2);

    todoList = await TodoList.find({url: req.params.id});

    console.log(3);

    return res.status(200).send(todoList);

})

router.post('/api/list/uppdate/:id', async (req:Request, res:Response) => {
    const {status, taskId } = req.body;
    console.log("status " + status)
    console.log('taskId: ' + taskId);

    
    let todoList = await TodoList.find({url: req.params.id});

    const index = todoList[0].tasks.findIndex((task => task.taskId === taskId));

    console.log('task length is ' + todoList[0].tasks.length)
    console.log('index ' + index);
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