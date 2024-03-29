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

   getTask(taskID){
        const task = this.tasks.find(({id}) => id === taskID)
        return task
    }

    setTask(task){
        this.tasks.push(task)
    }

    removeTask(taskID){
        this.tasks = this.tasks.filter(task => task.id != taskID)
    }
}

export { Project }