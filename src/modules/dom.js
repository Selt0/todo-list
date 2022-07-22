import { Project } from './project'
import { format } from 'date-fns'
import { Task } from './task'

const DOM = (() => {
    const projectContainer = document.querySelector('.project-container')
    const addProjectContainer = document.querySelector('.add-project')
    const addProjectBtn = document.querySelector('#add-project')
    
    const tasksContainer = document.querySelector('.tasks-container')
    const addTaskContainer = document.querySelector('.add-task')
    const addTaskBtn = document.querySelector('#add-task')
    const completedContainer = document.querySelector('.completed-tasks')


    function initListeners(){
        projectContainer.addEventListener('click', loadProjectEvent)
        addProjectBtn.addEventListener('click', () => {renderNewForm('project')})
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
        removeForm('project')
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

    function renderTask(task){
        const card = document.createElement('div')
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
        updateTaskProject(newTask)
        updateTotalTodoTasksLength()
        tasksContainer.prepend(renderTask(newTask))
        removeForm('task')
    }

    function updateTaskProject(task){
        const projectTitle = getProjectTitle()
        if (projectTitle !== 'All Tasks'){
            const project = Project.getProject(projectTitle)
            project.setTask(task)
            task.setProject(project.title)
        }
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
        const div = document.createElement('div')
        div.classList.add('task-details')

        const dueDate = document.createElement('div')
        dueDate.classList.add('due-date')
        div.append(dueDate)

        const icon = document.createElement('i')
        icon.classList.add('fa-solid', 'fa-calendar')
        dueDate.append(icon)

        const day = document.createElement('span')
        day.classList.add('day')
        day.textContent = 'due soon'
        dueDate.append(day)

        return div
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
            cancelBtn.addEventListener('click', () => {removeForm('task')})

        } else {
            addProjectBtn.style.display = 'none'
            addProjectContainer.append(form)
            addBtn.addEventListener('click', (e) => { createNewProject(input.value, e)})
            cancelBtn.addEventListener('click', () => {removeForm('project')})
        }

        input.focus()
    }

    function removeForm(type){
        const form = document.querySelector(`.${type}Form`)
        form.remove()

        type === 'project' ? addProjectBtn.style.display = 'flex' : addTaskBtn.style.display = 'flex'
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

    function renderModifyButtons() {
        const div = document.createElement('div')
        div.classList.add('modify-buttons')

        const deleteIcon = document.createElement('i')
        deleteIcon.classList.add('fa-solid', 'fa-xmark')
        div.append(deleteIcon)
        return div
    }

    return {
        initListeners
    }
})()

export { DOM }
