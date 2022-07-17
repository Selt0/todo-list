class Project {
    constructor(title){
        this.title = title
        this.tasks = []
        Project.allProjects.push(this)
    }

    static allProjects = []

    static containsProject(projectTitle){
        return Project.allProjects.some(project => project.title === projectTitle)
    }
    static getProject(projectTitle){
        return Project.allProjects.find(project => project.title === projectTitle)
    }

    static removeProject(projectTitle){
        Project.allProjects = Project.allProjects.filter(project => project.title !== projectTitle)
    }

    static setAllProjects(projects){
        Project.allProjects = projects
    }
    
    setTasks(tasks){
        this.tasks = tasks
    }

    get todoLength(){
        return this.tasks.filter(task => !task.completed).length
    }

    get completedLength(){
        return this.tasks.filter(task => task.completed).length
    }

    get todoTasks(){
        return this.tasks.filter(task => !task.completed)
    }

    get completedTasks(){
        return this.tasks.filter(task => task.completed)
    }

    getTask(taskItem){
        const task = this.tasks.find(task => task.name === taskItem.name && task.dateCreated === taskItem.dateCreated)

        return task
    }

    setTask(task){
        this.tasks.push(task)
    }

    removeTask(taskItem){
        this.tasks = this.tasks.filter(task => task.name != taskItem.name && task.dateCreated != taskItem.dateCreated)
    }

    setNewTitle(value){
        this.title = value
    }
}

export { Project }