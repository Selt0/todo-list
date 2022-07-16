import { Project } from './project'

const DOM = (() => {
    const projectContainer = document.querySelector('.projects-container')
    const projectList = document.querySelector('.projects')
    const taskContainer = document.querySelector('.task-container')
    const addProjectBtn = document.querySelector('#add-project')
    const addTaskBtn = document.querySelector('#add-task')

   function initListeners(){
        addProjectBtn.addEventListener('click', displayProjectForm)
        projectList.addEventListener('click', loadProjectTasks)
        addTaskBtn.addEventListener('click', addTask)
    }

    function displayProjectForm(){
        const form = document.querySelector('#projectForm')
        if (form) return
        projectContainer.insertBefore(createProjectForm(), addProjectBtn)
    }

    function createProjectForm(){
        const form = document.createElement('form')
        form.id = 'projectForm'
        const input = document.createElement('input')
        input.id = 'projectTitleInput'
        input.type = 'text'
        input.placeholder = "Enter project's title"
        form.appendChild(input)

        const submitBtn = document.createElement('button')
        submitBtn.textContent = 'Add'
        submitBtn.addEventListener('click', addProject)
        form.appendChild(submitBtn)

        const cancelBtn = document.createElement('button')
        cancelBtn.textContent = 'Cancel'
        cancelBtn.addEventListener('click', removeForm)
        form.appendChild(cancelBtn)

        return form
    }

    function addProject(e){
        e.preventDefault()
        const projectTitle = document.querySelector('#projectTitleInput').value.trim()
        if (Project.allProjects.includes(projectTitle)){
            alert('Name is already in use')
            return false
        } else {
            removeForm()
        }
        const project = new Project(projectTitle)
        
        const li = document.createElement('li')
        li.classList.add('project')
        li.textContent = project.title
        projectList.appendChild(li)
    }

    function removeForm(){
        document.querySelector('#projectForm').remove()
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

    function addTask(){
        console.log('click')
    }

    return {
        initListeners,
    }
})()

export { DOM }
