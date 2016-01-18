(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

window.Dispatcher = Focus.Dispatcher();
var todosView = require('./views/Todos.jsx');

ReactDOM.render(
    React.createElement(todosView, null),
    document.getElementById('todos-wrapper')
);

},{"./views/Todos.jsx":5}],2:[function(require,module,exports){
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
},{"../collections/Todos.js":3,"../models/Todo.js":4}],3:[function(require,module,exports){
module.exports = Focus.Collection({
    model: "Todo"
});

},{}],4:[function(require,module,exports){
module.exports = Focus.Model('Todo', {
    attributes: {
        done: false
    },

    toggleDone: function() {
        this.set("done", !this.attributes.done);
    }
});

},{}],5:[function(require,module,exports){
var TodosBinder = require('../binders/TodoBinder.js');

module.exports = React.createClass({displayName: "exports",

    getInitialState: function() {

        return {
            list: []
        };

    },

    componentDidMount: function() {

        TodosBinder(this, ['add','delete','taskDone', 'clearDone']);

    },

    render: function() {

        var _this = this;

        return React.createElement("div", {className: "todos"}, 

            React.createElement("input", {type: "text", ref: "textInput", className: "add", onKeyUp: this.onKeyUp}), React.createElement("button", {onClick: this.onAddClick}, "Add"), 
            React.createElement("ul", null, 
                
                    this.state.list.map(function(_todo, i) {
                        return (React.createElement("li", {key: "todo-"+i}, 
                            React.createElement("input", {type: "checkbox", 
                            onClick: _this.taskDone.bind(_this, i), checked: _todo.done ? true : false}), 
                            React.createElement("label", null, " ", _todo.text, " "), 
                            React.createElement("button", {onClick: _this.delete.bind(_this, i)}, "Delete")
                        ))
                    })
                
            ), 
            React.createElement("button", {className: "clear", onClick: _this.clearDone}, " Clear done ")
        )

    },

    onKeyUp: function(e,a) {
        if (e.which === 13) this.onAddClick();
    },

    onAddClick: function() {
        var _value = this.refs.textInput.value;
        if (_value.length>0)
            this.add(_value);
        this.refs.textInput.value= "";
        this.refs.textInput.focus();
    }

});

},{"../binders/TodoBinder.js":2}]},{},[1]);
