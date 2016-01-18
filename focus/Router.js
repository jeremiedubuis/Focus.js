/**
  * @desc the router provides a simple linking system between hashes and callbacks
*/
var registeredRouter;

var Router = function() {
    this.routes = {};
};

Router.prototype = {

    silentRoute: null,

    addRoute: function(string, callback, scope, listening) {
        this.routes[string] = {
            callback: callback,
            scope: scope,
            listening: listening
        };

        if (listening) this.listen(string);
    },

    setRoute: function(route, _silent) {

        var _routeParams = this.splitRoute(route);
        var _route = this.routes[_routeParams.base];

        if (_route) {
            if (_route.listening && _silent) {
                this.silentRoute = _routeParams.base;
            }

            window.location.hash = route;

            if ( !_route.listening && !_silent) {
                _routeParams.options.unshift(_routeParams.base);
                _route.callback.apply(_route.scope, _routeParams.options);
            }
        }

        return _route;

    },

    setFromHash: function() {

        var _route = this.splitRoute(window.location.hash);
        if (this.routes[_route.base]) {
            _route.options.unshift(_route.base);
            this.routes[_route.base].callback.apply(this.routes[_route.base].scope, _route.options);
        }
    },

    listen: function(string) {

        var _route;
        var _this = this;
        window.onhashchange = function(e) {
            _route = _this.splitRoute(e.newURL.split('#')[1]);

            if (_this.silentRoute !== string) {
                if (_this.routes[_route.base] && _this.routes[_route.base].listening) {
                    _route.options.unshift(_route.base);
                    _this.routes[_route.base].callback.apply(_this.routes[_route.base].scope, _route.options);
                }
            } else {
                _this.silentRoute = null;
            }
        };

    },

    splitRoute: function(fullRoute) {
        var _route = fullRoute.replace('#','').split('/');

        return {
            base: _route.shift(),
            options: _route
        };
    }

};

Focus.Router = function() {
    if (!registeredRouter) registeredRouter = new Router();
    return registeredRouter;
};
