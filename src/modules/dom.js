import { Project } from './project'
import { format } from 'date-fns'
import { Task } from './task'

const DOM = (() => {
    const projectContainer = document.querySelector('.projects-container')
    const projectList = document.querySelector('.projects')
    const taskContainer = document.querySelector('.task-container')
    const addProjectBtn = document.querySelector('#add-project')
    const addTaskBtn = document.querySelector('#add-task')

   function initListeners(){
        addProjectBtn.addEventListener('click', () => { displayForm('project') })
        projectList.addEventListener('click', loadProjectTasks)
        addTaskBtn.addEventListener('click', () => { displayForm('task') })
    }

    function displayForm(type){
        const form = document.querySelector(`#${type}Form`)
        if (form) return

        type === 'project' ? projectContainer.insertBefore(createForm(type), addProjectBtn) :
                             taskContainer.insertBefore(createForm(type), addTaskBtn)
    }

    function createForm(type){
        const form = document.createElement('form')
        form.id = `${type}Form`

        const input = document.createElement('input')
        input.id = `${type}TitleInput`
        input.type = 'text'
        input.placeholder = `Enter ${type}`
        form.appendChild(input)

        const submitBtn = document.createElement('button')
        submitBtn.textContent = 'Add'
        form.appendChild(submitBtn)

        const cancelBtn = document.createElement('button')
        cancelBtn.textContent = 'Cancel'
        form.appendChild(cancelBtn)

       if (type == 'project') {
        submitBtn.addEventListener('click', addProject)
        cancelBtn.addEventListener('click', () => { removeForm('project') })
       } else {
        submitBtn.addEventListener('click', addTask)
        cancelBtn.addEventListener('click', () => { removeForm('task') })
       }

       return form
    }

    function removeForm(type){
        document.querySelector(`#${type}Form`).remove()
    }

    function addProject(e){
        e.preventDefault()
        const projectTitle = document.querySelector('#projectTitleInput').value.trim()
        if (Project.allProjects.includes(projectTitle)){
            alert('Name is already in use')
            return false
        } else if (!projectTitle) {
            alert('Please give the project a name')
            return false 
        } else {
            removeForm('project')
        }

        const project = new Project(projectTitle)
        
        const li = document.createElement('li')
        li.classList.add('project')
        li.textContent = project.title
        projectList.appendChild(li)
    }

    function loadProjectTasks(e){
        if (!e.target.classList.contains('project')) return
        const project = Project.getProject(e.target.textContent)

        const title = document.querySelector('.project-title')
        const amountOfTasks = document.querySelector('.total-tasks')
        
        amountOfTasks.textContent = project.length
        title.textContent = project.title

        for (const task of project.tasks){
            console.log(task)
        }
    }

    function addTask(e){
        e.preventDefault()
        const taskTitle = document.querySelector('#taskTitleInput').value.trim()

        if (!taskTitle){
            alert('Please give the task a name')
            return false
        } else {
            removeForm('task')
        }
        const task = new Task(taskTitle)
        console.log(task.id)

        const div = document.createElement('div')
        div.textContent = task.title
        taskContainer.insertBefore(div, addTaskBtn)
    }

    return {
        initListeners,
    }
})()

export { DOM }
