
window.Dispatcher = Focus.Dispatcher();
var todosView = require('./views/Todos.jsx');

ReactDOM.render(
    React.createElement(todosView, null),
    document.getElementById('todos-wrapper')
);