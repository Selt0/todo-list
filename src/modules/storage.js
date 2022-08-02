import {Project} from './project'
import {Task} from './task'
import { format } from 'date-fns'

const Storage = (() => {
    function loadData(){
        const projects = localStorage.getItem('projects')
        const taskID = localStorage.getItem('taskID')

        return {projects, taskID}
    }

    function populateStorage(){
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

        return defaultProject
    }

    function saveData(){
        localStorage.setItem('projects', JSON.stringify(Project.allProjects))
        localStorage.setItem('taskID', JSON.stringify(Task.taskID))
    }

    return {loadData, populateStorage, saveData}
})()

export {Storage}