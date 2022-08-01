import {Project} from './project'
import {Task} from './task'

const Storage = (() => {
    function loadData(){
        const projects = localStorage.getItem('projects')
        const taskID = localStorage.getItem('taskID')

        return {projects, taskID}
    }

    function saveData(){
        localStorage.setItem('projects', JSON.stringify(Project.allProjects))
        localStorage.setItem('taskID', JSON.stringify(Task.taskID))
    }

    return {loadData, saveData}
})()

export {Storage}