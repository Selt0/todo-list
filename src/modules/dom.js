import { Project } from './project'
import { format } from 'date-fns'
import { Task } from './task'

const DOM = (() => {
    const projectContainer = document.querySelector('.project-container')
    const addProjectContainer = document.querySelector('.add-project')
    const addProjectBtn = document.querySelector('#add-project')
    const tasksContainer = document.querySelector('.tasks-container')
    const completedContainer = document.querySelector('.completed-tasks')


    function initListeners(){
        projectContainer.addEventListener('click', loadProjectEvent)
        addProjectBtn.addEventListener('click', renderNewProjectForm)
    }

    // PROJECT FUNCTIONS

    function loadProjectEvent(e){
        if (e.target.classList.contains('fa-xmark')){
            deleteProject(e.target.parentElement.parentElement)
        } else {
            setActiveProject(e.target)
        }
    }

    function renderProjectList(){
        const projects = Project.allProjects

        for (const project of projects){
            renderSingleProject(project)
        } 
        
        setActiveProject(document.querySelector('.project'))
    }

    function renderSingleProject(project){
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

        div.append(renderProjectButtons())
    }

    function renderProjectButtons() {
        const div = document.createElement('div')
        div.classList.add('project-buttons')

        const deleteIcon = document.createElement('i')
        deleteIcon.classList.add('fa-solid', 'fa-xmark')
        div.append(deleteIcon)
        return div
    }

    function setActiveProject(node){
        const oldActive = document.querySelector('.active')
        oldActive.classList.toggle('active')

        node.classList.add('active')
        clearTasks()
        let project = Project.getProject(node.dataset.projectTitle)
        console.log(project)
        renderProjectsTask(project)
    }

    function renderNewProjectForm(){
        addProjectBtn.style.display = 'none'
        
        const form = document.createElement('form')
        form.classList.add('projectForm')
        addProjectContainer.append(form)

        const input = document.createElement('input')
        input.type = 'text'
        input.placeholder = 'Enter project'
        input.classList.add('project-input')
        form.append(input)

        const addProjectBtns = document.createElement('div')
        addProjectBtns.classList.add('popout-project-btns')
        form.append(addProjectBtns)

        const addBtn = document.createElement('button')
        addBtn.textContent = 'Add'
        addBtn.classList.add('popout-add-project-btn')
        addBtn.addEventListener('click', (e) => { createNewProject(input.value, e)})
        addProjectBtns.append(addBtn)

        const cancelBtn = document.createElement('button')
        cancelBtn.textContent = 'Cancel'
        cancelBtn.classList.add('popout-cancel-project-btn')
        cancelBtn.addEventListener('click', removeProjectForm)
        addProjectBtns.append(cancelBtn)
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
        renderSingleProject(newProject)
        removeProjectForm()
    }

    function removeProjectForm(){
        const form = document.querySelector('.projectForm')
        form.remove()
        addProjectBtn.style.display = 'flex'
    }

    function deleteProject(node){
        console.log(Project.allProjects)

        const project = Project.getProject(node.dataset.projectTitle)
        Project.removeProject(project.title)
        node.remove()
        console.log(Project.allProjects)
    }

    // TASK FUNCTIONS

    function renderProjectsTask(project){
        const title = document.querySelector('h1.project-title')
        title.textContent = capitalizeString(project.title)

        const totalTasks = document.querySelector('.total-tasks')
        totalTasks.textContent = project.todoLength

        const completedTasks = document.querySelector('.total-completed-tasks')
        completedTasks.textContent = project.completedLength

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

        return card
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

    function clearTasks(){
        tasksContainer.innerHTML = ''
        completedContainer.innerHTML = ''
    }

    
    // HELPER FUNCTIONS

    function capitalizeString(string){
        let stringArr = string.split(' ')
        return stringArr.map(word => word[0].toUpperCase() + word.slice(1)).join(' ')
    }

    return {
        initListeners
    }
})()

export { DOM }
