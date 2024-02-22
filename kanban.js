export default class Kanban{
    // method to get all tasks of a particular column based on column id
    static getTasks(columnId){
        // one way to get tasks of a particular column
        // const data = read()[columnId].tasks;

        // using find we can run a function on data to get that particular column id
        const data = read().find(column =>{
            return column.columnId == columnId;
        });

        if (!data){
            return [];
        }

        return data;

    }

//*******method to insert task in a particular column based on column id*******

    static insertTask(columnId, taskContent){
        // get the current data in localStorage
        const data = read();
        // get the task list based on the provided columnId from the data
        const tasks = data[columnId].tasks;
        // create the newtask with the provided information to add in tasks list 
        const newTask = {
                taskId:Math.floor(Math.random()*100000),
                content: taskContent
            };
        
        // add the new task in the tasks array
        tasks.push(newTask);
        
        /*
        as we are capturing the current data in localStorage and then adding the new task in it
        we can updating the whole data in localStorage by passing the data again
        Since, the datya we get from read method is of JS we pass the data again using JSON stringify
        */
        save(data);
        return newTask;
    }


//******method to update task data*******

    static updateTask(task_id,newTaskContent){
        const data = read();
        
        // first we run a function to get information about the target task and its column
        function getCurrentTask(){
            for (const column of data){
                const currentTask = column.tasks.find(task =>{
                    return task.taskId == task_id;
                });

                if (currentTask){
                    return [currentTask,column];
                }
            };
        }
        
        // get values of curr_task and it's curr_column using the functuion getCurrentTask
        const [curr_task,curr_column] = getCurrentTask();

        // now we get hold of the target column
        const targetColumn = data.find(column =>{
            return column.columnId == newTaskContent.columnId;
        })

        // then using the newContent provided we update the content of the task
        curr_task.content = newTaskContent.content;

        // then remove the task from the current column and place it into the new column
        // this will happen in backend when we use dragable property to put the task by draging it to diff column
        curr_column.tasks.splice(curr_column.tasks.indexOf(curr_task),1);
        // and push the curr_task to targetColumn
        targetColumn.tasks.push(curr_task);

        // save the data
        save(data);
    }


//********method to delete a task using task_id********

    static deleteTask(task_id){
        const data = read();
        
        // getting hold of the column of the target task
        for(const column of data){
            const currentTask = column.tasks.find(task =>{
                return task.taskId == task_id;
            
            });
            if(currentTask){
                // using the splice method of arrays to remove the target task
                column.tasks.splice(column.tasks.indexOf(currentTask),1);
            }
        };

        save(data);
    };


//******* method to get task of all the columns *******
    static getAllTasks(){
        const data = read();
        columnTaskCount();
        return [data[0].tasks,data[1].tasks,data[2].tasks];
    }

}

//******* function to get data from localStorage*******

function read(){
    const data = localStorage.getItem("data");

    //if data is empty then we will provide dummy data with empty tasks array
    if (!data){
        return [
                {columnId:0,tasks:[]},
                {columnId:1,tasks:[]},
                {columnId:2,tasks:[]}
            ];
    }

    return JSON.parse(data);
};


//*****function to save data on localstorage********

function save(data){
    localStorage.setItem("data",JSON.stringify(data));
    columnTaskCount()

};

function columnTaskCount(){
    const data = read();

    const todoCount = document.querySelector("span.todo");
    todoCount.textContent = data[0].tasks.length;

    const inprogressCount = document.querySelector("span.inprogress");
    inprogressCount.textContent = data[1].tasks.length;

    const completedCount = document.querySelector("span.completed");
    completedCount.textContent = data[2].tasks.length;
}



// console.log(Kanban.getAllTasks());
// console.log(Kanban.getTasks(3));
// console.log(Kanban.insertTask(1,"Building Kanban Project"));

// console.log(Kanban.updateTask(1,81140,"Building update function"));

// console.log(Kanban.deleteTask(81140));
// console.log(Kanban.deleteTask(88198));

// Kanban.updateTask(97522,{columnId:1,content:"Recording Javascript Intro"});

// console.log(Kanban.getAllTasks());
