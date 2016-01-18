var views = {};
import React from 'react';
import ReactDOM from 'react-dom';

import vHome from './views/home.jsx';
import vStart from './views/start.jsx';
import vDoc from './views/doc.jsx';
import NavigationMenu from './views/menu.jsx';

import _consts from './constants.js';

views.home = vHome;
views.start = vStart;
views.doc = vDoc;



window.App = {
    cache : {},
    constants: _consts,
    init() {

        this.dispatcher = Focus.Dispatcher();
        ReactDOM.render(
            React.createElement(NavigationMenu, null),
            document.getElementById('nav')
        );
        this.router = Focus.Router();
        this.registerRoutes();
        this.router.setFromHash('home');
    },

    registerRoutes() {
        var _this = this;
        this.router.addRoute('home', function() {
            _this.setView('home');
        }, this.router, true);
        this.router.addRoute('start', function() {
            _this.setView('start');
        }, this.router, true);
        this.router.addRoute('doc', function(view, option) {
            _this.setView('doc', option);
        }, this.router, true);

    },

    setView(view, option) {
        var _wrapper = document.getElementById('wrapper');
        _wrapper.className="";
        var _this = this;
        setTimeout(function() {
            _this.dispatcher.dispatch(App.constants.actions.viewChange);
            ReactDOM.unmountComponentAtNode(document.getElementById('wrapper'));
            ReactDOM.render(
                React.createElement(views[view], option ? {option: option} : null),
                document.getElementById('wrapper')
            );
            setTimeout(function() {
                _wrapper.className = "faded-in";
            },350);

        },350);
    }

};

App.init();