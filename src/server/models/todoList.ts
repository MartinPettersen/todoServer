import mongoose from 'mongoose';
interface ITask {
    title: string,
    description: string;
    status: string;
    taskId: string;
    cost: number;
}

interface ITodoList {
    title: string;
    description: string;
    url: string;
    tasks: Array<ITask>;
    totalCost: number;
    sharedUrl: string;
    readOnly: boolean;
}

interface todoListModelInterface extends mongoose.Model<TodoListDoc>{
    build(attr: ITodoList): TodoListDoc;
}

interface TodoListDoc extends mongoose.Document {
    title: string;
    description: string;
    url: string;
    tasks: Array<ITask>;
    totalCost: number;
    sharedUrl: string;
    readOnly: boolean;
}



const todoListSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    tasks: [{
        title: { type: String },
        description: { type: String },
        status: { type: String },
        taskId: { type: String },
        cost: { type: Number},
    }],
    totalCost: {
        type: Number,
        required: true
    },
    sharedUrl: {
        type: String,
        required: true,
    },
    readOnly: {
        type: Boolean,
        required: true
    },
});

todoListSchema.statics.build = (attr: ITodoList) => {
    return new TodoList(attr)
} 

const TodoList = mongoose.model<TodoListDoc, todoListModelInterface>('TodoList', todoListSchema)

export { TodoList }


