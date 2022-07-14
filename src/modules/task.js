class Task {
    constructor(title, dateCreated){
        this.title = title
        this.dateCreated = dateCreated
    }

    getTitle(){
        return this.title
    }

    setTitle(value){
         this.title = value
    }

    getDateCreated(){
        return this.dateCreated
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
    
    setProject(project){
        this.project = project
    }

    getProject(){
        if (this.project) return this.project
    }
}