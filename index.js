// created Kanban.js to place all the function to perform the CRUD operations
import Kanban from "./kanban.js";


const todo = document.querySelector(".cards.todo");
const inprogress = document.querySelector(".cards.inprogress");
const completed = document.querySelector(".cards.completed");

const taskBox = [todo,inprogress,completed];

// Card generate template
function generateTemplate(task,index){
    const card = `
                    <form class="card" draggable="true" data-id="${task.taskId}">
                        <input type="text" name="task" value="${task.content}" autocomplete="off" disabled>
                        <div>
                            <span class="task-id">#${task.taskId}</span>
                            <span>
                                <button class="bi bi-pencil edit" data-id="${task.taskId}"></button>
                                <button class="bi bi-check-lg hide update" data-id="${task.taskId}" data-column="${index}"></button>
                                <button class="bi bi-trash3 delete" data-id="${task.taskId}"></button>
                            </span>
                        </div>
                    </form>
                `

    taskBox[index].innerHTML += card;    
}

// getting all task on page loadup
Kanban.getAllTasks().forEach((tasks,index) =>{
    tasks.forEach(task=>{
        generateTemplate(task,index);
    })
});


// add task
const addTaskForm = document.querySelectorAll("form.task");
addTaskForm.forEach(form =>{
    form.addEventListener("submit",Event =>{
        Event.preventDefault();

        const newTask = Kanban.insertTask(
                                            form.submit.dataset.id,
                                            form.task.value.trim()
                                        );
        
        /* insertTask will return the newtask created and by calling generateTemplate 
        funtion we will add the card to column
        */                                
        generateTemplate(newTask,form.submit.dataset.id);
        form.reset();
    })
});


// edit task
const taskUpdateForm = document.querySelectorAll("form.card");
taskUpdateForm.forEach(form =>{
    form.addEventListener("click",Event =>{
        Event.preventDefault();

        // first we capture the edit button click and make changes
        if (Event.target.classList.contains("edit")){
            Event.target.classList.add("hide");
            form.task.removeAttribute("disabled");
            Event.target.nextElementSibling.classList.remove("hide");
        }

        // then we capture the update button click and make changes
        if(Event.target.classList.contains("update")){
            const columnId = Event.target.dataset.column;

            const newtaskcontent = {
                                    columnId:columnId,
                                    content:form.task.value
                                };
            Kanban.updateTask(Event.target.getAttribute("data-id"),newtaskcontent);
            form.task.setAttribute("disabled","disabled");
            Event.target.classList.add("hide");
            Event.target.previousElementSibling.classList.remove("hide");

        }


        // Since, we have a reference to the form we also capture the click on delete button
        if(Event.target.classList.contains("delete")){
            Event.preventDefault();
            form.remove();
            Kanban.deleteTask(Event.target.dataset.id);
        }
    })

});


// draging task from one box to another
taskBox.forEach(column=>{
    // start dragging and add the dragging class to the card which we are dragging
    column.addEventListener("dragstart",Event=>{
        if(Event.target.classList.contains("card")){
            Event.target.classList.add("dragging");
        }
    })


    // drag over functionality
    column.addEventListener("dragover",Event => {
        const card = document.querySelector(".dragging");

        // append the card over the column we drag over and want to place
        column.appendChild(card);
    
    })

    // drag end and updating the data
    column.addEventListener("dragend",Event => {
        if(Event.target.classList.contains("card")){
            Event.target.classList.remove("dragging");
            const taskId = Event.target.dataset.id;
            const columnId = Event.target.parentElement.dataset.id;
            const taskContent = Event.target.task.value;
            Kanban.updateTask(taskId,{columnId:columnId,content:taskContent});
            
        }
    })
})
