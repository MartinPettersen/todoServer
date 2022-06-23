import mongoose from 'mongoose';
interface ITask {
    title: string,
    description: string;
    status: string;
    taskId: string;
}

interface ITodoList {
    title: string;
    description: string;
    url: string;
    tasks: Array<ITask>;
}

interface todoListModelInterface extends mongoose.Model<TodoListDoc>{
    build(attr: ITodoList): TodoListDoc;
}

interface TodoListDoc extends mongoose.Document {
    title: string;
    description: string;
    url: string;
    tasks: Array<ITask>;
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
    }],
});

todoListSchema.statics.build = (attr: ITodoList) => {
    return new TodoList(attr)
} 

const TodoList = mongoose.model<TodoListDoc, todoListModelInterface>('TodoList', todoListSchema)

/*
TodoList.build({
    title: "test",
    description: "testing to see if this works",
    url: "test1",
    tasks: []
})
*/
export { TodoList }


