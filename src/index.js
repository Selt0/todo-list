import './style.css'
import { DOM } from './modules/dom'
import { Storage } from './modules/storage'
import { Project } from './modules/project'
import { Task } from './modules/task'

const { projects, taskID } = Storage.loadData()

if (!projects){
    const defaultProject = Storage.populateStorage()

    DOM.renderProject(defaultProject)
    DOM.setActiveProject(document.querySelector('.project'))
} else {
    const projectsData = JSON.parse(projects)

    for (const projectData of projectsData){
        const project = new Project(projectData.title)

        for (const taskData of projectData.tasks){
            const task =  new Task(taskData.title)
            task.setID(taskData.id)
            task.setCompletionStatus(taskData.completed)
            task.setDueDate(taskData.dueDate)
            task.setPriority(taskData.priority)
            task.setNotes(taskData.notes)

            project.setTask(task)
        }
    }

    Task.setTaskID = taskID

    DOM.renderProjectList(Project.allProjects)
}

DOM.initListeners()