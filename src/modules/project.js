class Project {
    constructor(title){
        this.title = title
        this.tasks = []
    }

    getTasks(){
        return this.tasks
    }
    
    setTasks(tasks){
        this.tasks = tasks
    }

    getTask(taskItem){
        const task = this.tasks.find(task => task.name === taskItem.name && task.dateCreated === taskItem.dateCreated)

        return task ? task : false
    }

    setTask(task){
        this.tasks.push(task)
    }

    removeTask(taskItem){
        this.tasks = this.tasks.filter(task => task.name != taskItem.name && task.dateCreated != taskItem.dateCreated)
    }

    getTitle(){
        return this.title
    }

    setNewTitle(value){
        this.title = value
    }
}