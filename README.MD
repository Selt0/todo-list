# The Odin Project - Project: Todo List

This is a solution to the [Project: Todo List on Odin](https://www.theodinproject.com/lessons/node-path-javascript-todo-list).

## Overview

A todo app where you can create new projects and create tasks that are associated with those projects. Created with different modules to separate the application logic and webpack to bundle them. Also used an external library, date-fns, for formating and manipulating date and times.

### Features

Users should be able to:

- View all projects
- View all todos in each project
- Expand a single todo to see/edit its details
- Delete a project
- Delete a todo
- Data is stored in localStorage

### Screenshot/Video


https://user-images.githubusercontent.com/23282172/182672453-fa47fcc0-bd1d-49c1-ae00-461ee7978cfe.mp4



### Links

- Live Site URL: [https://selt0.github.io/todo-list/](https://selt0.github.io/todo-list/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- [date-fns](https://github.com/date-fns/date-fns)
- Vanilla JS
- [Webpack] (https://webpack.js.org/)
- localStorage


### What I learned

I wanted users to be able to click the task card to open up details. During testing, I noticed that clicking on certain elements didn't fire the event. My solution was to set <code>pointer-events</code> to none so it wouldn't be a target of pointer events.

I also wanted to be able to update the task whenever the user decided to update the title. I was deciding between rerendering the card or finding a way to keep track of the card that was clicked. I decided to add an ID to a task whenever it was created so that I could also use that ID to select the card while also using the ID to grab the proper task within the Project. I applied that ID to card as a data attribute. Then I set event listeners on the form elements to run the function on 'change'.

```css

.project-info, .task-info, .fa-check {
    pointer-events: none;
}

```

```js

class Task {
    constructor(title){
        this.id = ++Task.taskID
        ...
    }
        static taskID = 0
        ...
}

class Project {
    ...
       get todoTasks(){
        return this.tasks.filter(task => !task.completed)
    }
        get todoLength(){
        return this.tasks.filter(task => !task.completed).length
    }
    ...
}

const DOM = (() => {
    ...
    function loadTaskEvent(e){
        if (e.target.classList.contains('checkbox')){
            toggleTaskCompletion(e.target)
        } else if (e.target.classList.contains('fa-xmark')){
            deleteTask(e.target)
        } else if (e.target.classList.contains('card')) {
            const taskID = Number(e.target.dataset.taskId)
            renderTaskDetailsForm(taskID)
            setTimeout(() => {
                taskDetailListeners(e.target, taskID)
              }, 0)
        }
    }
    ...
    function taskDetailListeners(node, taskID) {
        const form = document.querySelector('.detailsForm')
        const project = Project.getProject(getProjectTitle())
        const task = project.getTask(taskID)

        form.elements.title.addEventListener('change', (e) => {updateTaskTitle(task, node, e.target.value)})
        form.elements.date.addEventListener('change', (e) => {updateTaskDueDate(task, node, e.target.value)})
        form.elements.priority.addEventListener('change', (e) => {updateTaskPriority(task, node, e.target.value)})
        form.elements.notes.addEventListener('change', (e) => {updateTaskNotes(task, e.target.value)})

        setTimeout(() => {
            document.addEventListener('click', closeDetailsForm)
          }, 0)
    }

    function updateTaskTitle(task, node, newTitle){
        task.setTitle(newTitle)
        Storage.saveData()
        node.querySelector('.task-title').textContent = newTitle
    }

    function closeDetailsForm(e){
        const form = document.querySelector('.detailsForm')
        if (!form.contains(e.target)){
            form.remove()
            document.removeEventListener('click', closeDetailsForm)
        }
    }
})()




const { projects, taskID } = Storage.loadData()

if (!projects){
    const defaultProject = Storage.populateStorage()
}

```

### Continued development

I'm trying to improve my ability to code following the SOLID principles. When I created the DOM module, I was stuck debating how to design the code so that the DOM module's only responsibilty was rending the HTML. However, while I was coding out the project, I found it easier to update the Task/Project properties within the same function that also rendered the HTML. I realized I didn't put much thought in my design process.

## Author

- Website - [Michael Martinez](https://michael-martinez.netlify.app/)
- Twitter - [@MMocomochi](https://twitter.com/MMocomochi)
