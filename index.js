const extend = require('xtend')
const choo = require('choo')
const html = require('choo/html')
const app = choo()

app.model({
    state: {
        todos: []
    },
    reducers: {
        receiveTodos: (data, state) => {
            return { todos: data }
        },
        addTodo: (data, state) => {
            const todo = extend(data, {
                completed: false
            });
            const newTodos = state.todos.slice()
            newTodos.push(todo)
            return { todos: newTodos }
        },
        updateTodo: (data, state) => {
            oldTodo = state.todos[data.index];
            console.log(oldTodo);
            const newTodo = extend(oldTodo, data.updates);
            const newTodos = state.todos.slice();
            newTodos[data.index] =  newTodo;
            return { todos: newTodos }
        }
    },
    effects: {
        getTodos: (data, state, send, done) => {
            store.getAll('todos', (todos) => {
                send('receiveTodos', todos, done)
            })
        }
    }
});

const view = (state, prev, send) => {
    return html`
        <div onload=${() => send('getTodos')}>
        <form onsubmit=${onSubmit}>
            <input type="text" placeholder="New item" id="title">
        </form>
        <ul>
        ${state.todos.map((todo, index) => html`
            <li>
                <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange=${(e) => {
                    const updates = {completed: e.target.checked};
                    send('updateTodo', {index: index, updates: updates});
                }} />
                ${todo.title}
            </li>`)}
        </ul>
        </div>`

    function onSubmit(e) {
        const input = e.target.children[0]
        send('addTodo', { title: input.value })
        input.value = ''
        e.preventDefault()
    }
}

app.router((route) => [
    route('/', view)
]);

const tree = app.start();
document.body.appendChild(tree);

// localStorage wrapper
const store = {
  getAll: (storeName, cb) => {
    try {
      cb(JSON.parse(window.localStorage[storeName]))
    } catch (e) {
      cb([])
    }
  },
  add: (storeName, item, cb) => {
    store.getAll(storeName, (items) => {
      items.push(item)
      window.localStorage[storeName] = JSON.stringify(items)
      cb()
    })
  },
  replace: (storeName, index, item, cb) => {
    store.getAll(storeName, (items) => {
      items[index] = item
      window.localStorage[storeName] = JSON.stringify(items)
      cb()
    })
  }
}
