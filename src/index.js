import './style.css'
import { DOM } from './modules/dom'
import { Storage } from './modules/storage'
import { Project } from './modules/project'
import { Task } from './modules/task'
import { format } from 'date-fns'

const { projects, taskID } = Storage.loadData()

if (!projects){
    const defaultProject = new Project('default')

    const exampleTask = new Task('Walk the dog')
    exampleTask.setPriority('medium')

    const exampleCompletedTask = new Task('Wash dishes')
    exampleCompletedTask.toggleCompletion()
    exampleCompletedTask.setDueDate(format(new Date(), 'yyyy-MM-dd'))

    const clickMeTask = new Task('Click me!')
    clickMeTask.setPriority('low')
    clickMeTask.setNotes('Hello :) You can update the title, due date, and priority. You can also add notes.')

    defaultProject.setTasks([exampleTask, exampleCompletedTask, clickMeTask])

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