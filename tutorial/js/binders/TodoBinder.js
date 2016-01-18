var TodoModel = require('../models/Todo.js');
var TodosCollection = require('../collections/Todos.js');

module.exports = Focus.Binder('Todo', {
    init: function() {

        var _this = this;
        this.list = new TodosCollection();

        Dispatcher.register('todoList:update', function() {
            _this.setState({list: _this.list.toJSON() });
        });

    },

    add: function(_text) {

        this.list.push(
            new TodoModel({
                text: _text
            })
        );
        Dispatcher.dispatch("todoList:update");
    },

    taskDone: function(_id) {
        this.list[_id].toggleDone();
        Dispatcher.dispatch("todoList:update");
    },

    delete: function(_id) {
        this.list[_id].destroy();
        this.list.splice(_id,1);
        Dispatcher.dispatch("todoList:update");
    },

    clearDone: function() {

        this.list.deleteWhere('done', true);
        Dispatcher.dispatch("todoList:update");
    }

});
