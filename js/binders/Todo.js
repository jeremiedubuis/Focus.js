var TodoModel = require('../models/Todo.js');
var TodosCollection = require('../collections/Todos.js');

module.exports = Focus.Binder('Todo', {
    init: function() {

        var _this = this;
        this.list = new TodosCollection();

        Focus.Dispatcher().register('todoList:update', function() {
            _this.setState({list: _this.list.toJSON() });
        });

    },

    add: function(_text) {


        this.list.push(
            new TodoModel({
                text: _text
            })
        );

        Focus.Dispatcher().dispatch("todoList:update");

        // this exemple illustrates how you may call Binder methods that weren't
        // bound to the current scope
        this._('secret', "test");

    },

    taskDone: function(_id) {
        this.list[_id].toggleDone();
        Focus.Dispatcher().dispatch("todoList:update");
    },

    delete: function(_id) {
        this.list[_id].destroy();
        this.list.splice(_id,1);
        Focus.Dispatcher().dispatch("todoList:update");
    },

    clearDone: function() {

        this.list.deleteWhere('done', true);
        Focus.Dispatcher().dispatch("todoList:update");
    },

    secret: function(string) {
        console.log('here is my secret:'+string)
    }
});