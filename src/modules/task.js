class Task {
    constructor(title){
        this.id = ++Task.taskID
        this.title = title
        this.completed = false
        this.dueDate = ''
        this.priority = 'none'
        this.notes = ''
    }

    static taskID = 0

    static setTaskID(value){
        Task.taskID = value
    }

    setID(value){
        this.id = value
    }

    setTitle(value){
         this.title = value
    }

    setCompletionStatus(value){
        this.completed = value
    }

    toggleCompletion(){
        this.completed ? this.completed = false : this.completed = true
    }

    setDueDate(date){
        this.dueDate = date
    }

    setPriority(value){
        this.priority = value
    }

    setNotes(value){
        this.notes = value
    }   
}

export { Task }