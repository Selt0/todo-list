class Task {
    constructor(title, dateCreated){
        this.title = title
        this.dateCreated = dateCreated
        this.completed = false
    }

    setTitle(value){
         this.title = value
    }

    getDueDate(){
        if (this.dueDate) return this.dueDate
    }

    setDueDate(date){
        this.dueDate = date
    }

    getPriority(){
        if (this.priority) return this.priority
    }

    setPriority(value){
        this.priority = value
    }

    getProject(){
        if (this.project) return this.project
    }
    
    setProject(project){
        this.project = project
    }

    setComplete(){
        this.completed = true
    }
}