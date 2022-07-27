let taskID = 0

class Task {
    constructor(title){
        this.title = title
        this.completed = false
        this.id = taskID++
        this.priority = 'none'
        this.notes = ''
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

    setPriority(value){
        this.priority = value
    }

    setNotes(value){
        this.notes = value
    }

    toggleCompletion(){
        this.completed ? this.completed = false : this.completed = true
    }
}

export { Task }