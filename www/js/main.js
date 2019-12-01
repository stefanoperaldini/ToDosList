class ToDoList {
  constructor(parent, dbName) {
    this.state = {
      todos: []
    };

    this.addForm = parent.querySelector("form.add");
    this.cleanButton = parent.querySelector("button.clean");
    this.destroyButton = parent.querySelector("button.destroy");
    this.todoList = parent.querySelector("ul.todoList");
    this.dbName = dbName;

    if (
      !this.addForm ||
      !this.cleanButton ||
      !this.destroyButton ||
      !this.todoList
    ) {
      throw new Error("Faltan elementos. Revisa el HTML");
    }
  }

  start() {
    this.addForm.addEventListener("submit", e => {
      e.preventDefault();
      const todoInput = this.addForm.elements.todotext;
      const todoText = todoInput.value;
      if (todoText.length > 0 && todoText.length < 200) {
        this.addToDo(todoText);
        this.addForm.reset();
      }
    });

    this.destroyButton.addEventListener("click", e => {
      if (prompt("Escribe BORRAR para borrar la lista de todos") === "BORRAR") {
        this.deleteTodoList();
      }
    });

    this.todoList.addEventListener("input", e => {
      if (e.target.matches("input")) {
        const item = e.target.parentElement;
        const index = item.getAttribute("data-index");
        this.toggleTodoStatus(index);
      }
    });

    this.cleanButton.addEventListener("click", e => {
      this.cleanToDoList();
    });

    const listSaved = localStorage.getItem(this.dbName);

    if (listSaved) {
      this.state.todos = JSON.parse(listSaved);
      this.render();
    }
  }

  //Añadir todo
  //Marcar un todo como hecho/pendiente
  toggleTodoStatus(index) {
    const todo = this.state.todos[index];
    todo.done = !todo.done;
    this.sync();
  }

  //Limpiar lista de todos
  cleanToDoList() {
    this.state.todos = this.state.todos.filter(todo => !todo.done);
    this.sync();
  }

  //Borrar todos los todos
  deleteTodoList() {
    this.state.todos = [];
    this.todoList.innerHTML = "";
    this.sync();
  }

  addToDo(texto) {
    const newTodo = {
      text: texto,
      done: false
    };
    this.state.todos.push(newTodo);
    this.sync();
  }

  render() {
    this.todoList.innerHTML = "";
    let index = 0;
    for (const item of this.state.todos) {
      const toDo = document.createElement("li");
      toDo.setAttribute("data-index", index);
      const toDoCheck = document.createElement("input");
      toDoCheck.setAttribute("type", "checkbox");
      if (item.done) {
        toDo.classList.add("done");
        toDoCheck.setAttribute("checked", true);
      }
      const toDoP = document.createElement("p");
      toDoP.textContent = item.text;
      toDo.appendChild(toDoCheck);
      toDo.appendChild(toDoP);
      this.todoList.appendChild(toDo);
      index++;
    }
  }

  sync() {
    localStorage.setItem(this.dbName, JSON.stringify(this.state.todos));
    this.render();
  }
}

const main = document.querySelector("main");

const todos = new ToDoList(main, "myTodos");
todos.start();
