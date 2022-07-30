import { Project } from './project'
import { format } from 'date-fns'
import { Task } from './task'


const DOM = (() => {
    const projectContainer = document.querySelector('.project-container')
    const addProjectContainer = document.querySelector('.add-project')
    const addProjectBtn = document.querySelector('#add-project')
    const taskSection = document.querySelector('.tasks')
    const tasksContainer = document.querySelector('.tasks-container')
    const addTaskContainer = document.querySelector('.add-task')
    const addTaskBtn = document.querySelector('#add-task')
    const completedContainer = document.querySelector('.completed-tasks')


    function initListeners(){
        projectContainer.addEventListener('click', loadProjectEvent)
        addProjectBtn.addEventListener('click', () => {renderNewForm('project')})
        tasksContainer.addEventListener('click', loadTaskEvent)
        completedContainer.addEventListener('click', loadTaskEvent)
        addTaskBtn.addEventListener('click', () => {renderNewForm('task')})
    }

    // PROJECT FUNCTIONS

    function loadProjectEvent(e){
        if (e.target.classList.contains('fa-xmark')){
            deleteProject(e.target.parentElement.parentElement)
        } else {
            setActiveProject(e.target)
        }
    }

    function renderProject(project){
        const div = document.createElement('div')
        div.classList.add('project')
        div.dataset.projectTitle = project.title
        projectContainer.append(div)

        const projectInfo = document.createElement('div')
        projectInfo.classList.add('project-info')
        div.append(projectInfo)

        const icon = document.createElement('i')
        icon.classList.add('fa-solid', 'fa-book-open')
        projectInfo.append(icon)

        const span = document.createElement('span')
        span.classList.add('project-title')
        span.textContent = capitalizeString(project.title)
        projectInfo.append(span)

        div.append(renderModifyButtons())
    }

    function setActiveProject(node){
        const oldActive = document.querySelector('.active')
        if (oldActive){
            oldActive.classList.toggle('active')
        }

        node.classList.add('active')
        clearTasks()
        let project = Project.getProject(node.dataset.projectTitle)
        renderProjectsTask(project)
    }

    function createNewProject(project, e){
        e.preventDefault()

        if (!project){
            alert('Please enter a name for your project')
            return false
        } else if (Project.containsProject(project)){
            alert('Name is already in use')
            return false
        }

        const newProject = new Project(project)
        renderProject(newProject)
        removeAddForm('project')
    }

    function deleteProject(node){
        const project = Project.getProject(node.dataset.projectTitle)
        Project.removeProject(project.title)
        node.remove()
        setActiveProject(document.querySelector('.project'))
    }

    function renderProjectList(){
        const projects = Project.allProjects

        for (const project of projects){
            renderProject(project)
        } 
        
        setActiveProject(document.querySelector('.project'))
    }

    // TASK FUNCTIONS

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

    function renderTask(task){
        const card = document.createElement('div')
        card.dataset.taskId = task.id
        card.classList.add('card')

        const checkbox = document.createElement('div')
        checkbox.classList.add('checkbox')
        card.append(checkbox)

        const taskInfo = document.createElement('div')
        taskInfo.classList.add('task-info')
        card.append(taskInfo)

        const taskTitle = document.createElement('p')
        taskTitle.classList.add('task-title')
        taskTitle.textContent = task.title
        taskInfo.append(taskTitle)

        if (task.completed){
            checkbox.classList.add('checked')
            taskTitle.classList.add('completed')

            const icon = document.createElement('i')
            icon.classList.add('fa-solid', 'fa-check')
            checkbox.append(icon)
        }

        taskInfo.append(renderTaskDetails(task))
        card.append(renderModifyButtons())

        return card
    }

    function createNewTask(task, e){
        e.preventDefault()
       
        if (!task){
            alert('Please enter a name for your task')
            return false
        }

        const newTask = new Task(task)
        updateProjectsTask(newTask)
        updateTotalTodoTasksLength()
        tasksContainer.prepend(renderTask(newTask))
        removeAddForm('task')
    }

    function updateProjectsTask(task){
        const projectTitle = getProjectTitle()
        const project = Project.getProject(projectTitle)
        project.setTask(task)
    }

    function renderProjectsTask(project){
        const title = document.querySelector('h1.project-title')
        title.textContent = capitalizeString(project.title)

        updateTotalTodoTasksLength()
        updateCompletedTasksLength()
        renderUncompletedTasks(project)
        renderCompletedTasks(project)
    }

    function renderUncompletedTasks(project){
        const tasks = project.todoTasks

        for (const task of tasks){
            tasksContainer.append(renderTask(task))
        }
    }

    function renderCompletedTasks(project){
        const tasks = project.completedTasks

        for (const task of tasks){
            completedContainer.append(renderTask(task))
        }
    }

    function renderTaskDetails(task){
        const taskDetails = document.createElement('div')
        taskDetails.classList.add('task-details')

        taskDetails.append(renderTaskDueDate(task))
        taskDetails.append(renderTaskPriority(task))

        return taskDetails
    }

    function renderTaskDueDate(task){
        const dueDateDiv = document.createElement('div')
        dueDateDiv.classList.add('due-date')

        if (task.dueDate){
            const icon = document.createElement('i')
            icon.classList.add('fa-solid', 'fa-calendar')
            dueDateDiv.append(icon)

            const day = document.createElement('span')
            day.classList.add('day')
            day.textContent = 'due soon'
            dueDateDiv.append(day)
        }

        return dueDateDiv
    }

    function renderTaskPriority(task){
        const priorityDiv = document.createElement('div')
        priorityDiv.classList.add('priority')

        const icon = document.createElement('i')
        icon.classList.add('fa-solid', 'fa-triangle-exclamation', `${task.priority}`)
        priorityDiv.append(icon)
    
        return priorityDiv
    }

    function updateTotalTodoTasksLength(){
        const projectTitle = getProjectTitle()
        const project = Project.getProject(projectTitle)
        const totalTasks = document.querySelector('.total-tasks')
        totalTasks.textContent = project.todoLength
    }

    function updateCompletedTasksLength(){
        const projectTitle = getProjectTitle()
        const project = Project.getProject(projectTitle)
        const completedTasks = document.querySelector('.total-completed-tasks')
        completedTasks.textContent = project.completedLength
    }

    function toggleTaskCompletion(node){
        const project = Project.getProject(getProjectTitle())
        const taskCard = node.parentElement
        const task = project.getTask(Number(taskCard.dataset.taskId))

        taskCard.remove()
        task.toggleCompletion()
        updateCheckbox(task, node)
        updateTotalTodoTasksLength()
        updateCompletedTasksLength()

        if (task.completed){
            completedContainer.prepend(renderTask(task))
        } else {
            tasksContainer.prepend(renderTask(task))
        }
    }

    function updateCheckbox(task, node){
        node.classList.toggle('checked')
        if (task.completed){
            const icon = document.createElement('i')
            icon.classList.add('fa-solid', 'fa-check')
            node.append(icon)
        }
    }

    function deleteTask(node){
        const project = Project.getProject(getProjectTitle())
        const taskCard = node.parentElement.parentElement
        const taskID = Number(taskCard.dataset.taskId)
        const task = project.getTask(taskID)

        project.removeTask(taskID)
        taskCard.remove()

        task.completed ? updateCompletedTasksLength() : updateTotalTodoTasksLength()
    }

    // FORM

    function renderNewForm(type){
        const form = document.createElement('form')
        form.classList.add(`${type}Form`)

        const input = document.createElement('input')
        input.type = 'text'
        input.placeholder = `Enter ${type}`
        input.classList.add(`${type}-input`)
        form.append(input)

        const btnContainer = document.createElement('div')
        btnContainer.classList.add(`popout-btns`)
        form.append(btnContainer)

        const addBtn = document.createElement('button')
        addBtn.textContent = 'Add'
        btnContainer.append(addBtn)

        const cancelBtn = document.createElement('button')
        cancelBtn.textContent = 'Cancel'
        btnContainer.append(cancelBtn)

        if (type === 'task'){
            addTaskBtn.style.display = 'none'
            addTaskContainer.append(form)
            addBtn.addEventListener('click', (e) => { createNewTask(input.value, e)})
            cancelBtn.addEventListener('click', () => {removeAddForm('task')})
        } else {
            addProjectBtn.style.display = 'none'
            addProjectContainer.append(form)
            addBtn.addEventListener('click', (e) => { createNewProject(input.value, e)})
            cancelBtn.addEventListener('click', () => {removeAddForm('project')})
        }

        input.focus()
    }

    function renderModifyButtons() {
        const div = document.createElement('div')
        div.classList.add('modify-buttons')

        const deleteIcon = document.createElement('i')
        deleteIcon.classList.add('fa-solid', 'fa-xmark')
        div.append(deleteIcon)
        return div
    }

    function removeAddForm(type){
        const form = document.querySelector(`.${type}Form`)
        form.remove()

        type === 'project' ? addProjectBtn.style.display = 'flex' : addTaskBtn.style.display = 'flex'
    }

    function renderTaskDetailsForm(taskID){
        const project = Project.getProject(getProjectTitle())
        const task = project.getTask(taskID)

        const form = document.createElement('form')
        form.classList.add('detailsForm')
        taskSection.append(form)

        const legend = document.createElement('legend')
        legend.textContent = 'Task Details'
        form.append(legend)

        const titleContainer = document.createElement('div')
        titleContainer.classList.add('form-control')
        form.append(titleContainer)
        const titleLabel = document.createElement('label')
        titleLabel.htmlFor = 'title'
        titleLabel.textContent = 'Task: '
        titleContainer.append(titleLabel)
        const titleInput = document.createElement('input')
        titleInput.type = 'text'
        titleInput.id = 'title'
        titleInput.value = task.title
        titleContainer.append(titleInput)

        const dueDateContainer = document.createElement('div')
        dueDateContainer.classList.add('form-control')
        form.append(dueDateContainer)
        const dueDateLabel = document.createElement('label')
        dueDateLabel.htmlFor = 'date'
        dueDateLabel.textContent = 'Due Date: '
        dueDateContainer.append(dueDateLabel)
        const dueDateInput = document.createElement('input')
        dueDateInput.type = 'date'
        dueDateInput.id = 'date'
        // dueDateInput.value = YYYY-MM-DD
        dueDateContainer.append(dueDateInput)

        const priorityContainer = document.createElement('div')
        priorityContainer.classList.add('form-control')
        form.append(priorityContainer)
        const priorityLabel = document.createElement('label')
        priorityLabel.htmlFor = 'priority'
        priorityLabel.textContent = 'Priority: '
        priorityContainer.append(priorityLabel)
        const prioritySelect = document.createElement('select')
        prioritySelect.id = 'priority'
        renderPriorityOptions(task, prioritySelect)
        priorityContainer.append(prioritySelect)

        const notesContainer = document.createElement('div')
        notesContainer.classList.add('form-control')
        form.append(notesContainer)
        const notesLabel = document.createElement('label')
        notesLabel.htmlFor = 'notes'
        notesLabel.textContent = 'Notes: '
        notesContainer.append(notesLabel)
        const notes = document.createElement('textarea')
        notes.cols = 50
        notes.rows = 10
        notes.id = 'notes'
        notes.value = task.notes
        notesContainer.append(notes)

        //prevent user from submitting form on 'enter'
        const disabledBtn = document.createElement('input')
        disabledBtn.type = 'submit'
        disabledBtn.disabled = true
        disabledBtn.style.display = 'none'
        disabledBtn.ariaHidden = 'true'
        form.append(disabledBtn)
    }
    
    function renderPriorityOptions(task, prioritySelect){
        const priorities = ['None', 'Low', 'Medium', 'High']

        for (const priority of priorities){
            const option = document.createElement('option')
            option.value = priority.toLowerCase()
            option.textContent = priority
            if (priority.toLowerCase() === task.priority){
                option.selected = true
            }
            prioritySelect.append(option)
        }
    }

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

    function closeDetailsForm(e){
        const form = document.querySelector('.detailsForm')
        if (!form.contains(e.target)){
            form.remove()
            document.removeEventListener('click', closeDetailsForm)
        }
    }

    function updateTaskTitle(task, node, newTitle){
        task.setTitle(newTitle)
        node.querySelector('.task-title').textContent = newTitle
    }

    function updateTaskDueDate(task, newDate){
        // const taskInfo = node.querySelector('.task-info')
        // task.setDueDate(newDate)
        // taskInfo.append(renderTaskDetails(task))
    }

    function updateTaskPriority(task, node, newPriority){        
        const icon = node.querySelector('.fa-triangle-exclamation')
        icon.classList.remove(task.priority)
        task.setPriority(newPriority)
        icon.classList.add(task.priority)
    }

    function updateTaskNotes(task, newNotes){
        console.log(task.notes)
        task.setNotes(newNotes)
        console.log(task.notes)
    }

    // HELPER FUNCTIONS
    function clearTasks(){
        tasksContainer.innerHTML = ''
        completedContainer.innerHTML = ''
    }

    function capitalizeString(string){
        let stringArr = string.split(' ')
        return stringArr.map(word => word[0].toUpperCase() + word.slice(1)).join(' ')
    }

    function getProjectTitle(){
        return document.querySelector('h1.project-title').textContent.toLowerCase()
    }



    return {
        initListeners
    }
})()

export { DOM }
