/**
  * @desc Focus.js is a simple MVVM Javascript Framework
  * @version 0.1.0
  * @author Jérémie Dubuis jeremie.dubuis@gmail.com
  * @license The MIT License (MIT)
*/
var Focus = function() {

    var Focus = {
        models: [],
        binderInstances: []
    };

/**
  * @desc An XMLHttpRequest wrapper
  * @param object {
  *    method (string) : 'POST' || 'GET' || 'PUT' || 'UPDATE' || 'DELETE'
  *    url (string) : the resource to reach
  *    onSuccess (xhr, response) : success callback
  *    onFailure (xhr) : failure callback
  *    data (string) : parameters
  * }
*/

var ajax = Focus.ajax = function(object) {

    var _method = object.method.toUpperCase() || 'GET';
    var _url = object.url;
    var _onSuccess = object.onSuccess || function() {};
    var _onFailure = object.onFailure || function() {};

    if (_method === 'GET' && object.data) {
        _url= _url+'?'+object.data;
        delete object.data;
    }

    var xhr = new XMLHttpRequest();
    xhr.open(_method, _url, true);

    if (object.contentType) {
        xhr.setRequestHeader('Content-type', object.contentType);
    }

    if (object.onProgress && typeof object.onProgress ==="function") {
        var _onprogress = function (evt) {
            object.onProgress(evt);
        };
        xhr.addEventListener("progress", _onprogress);

    }



    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4  ) {
            if (_onprogress) xhr.removeEventListener("progress", _onprogress);
            if ( xhr.status != 200) {
                _onFailure(xhr);
            } else if (xhr.status == 200) {
                _onSuccess(xhr, JSON.parse(xhr.responseText) );
                return true;
            }

            return false;
        }

    };

    xhr.send( object.data );

};

/**
  * @desc An equivalent to jQuery's extend, a mixin function that extends an object with another,
  * @param object1: object to be complemented
  * @param object2: object's properties will be applied to object1
*/
var extend = Focus.extend = function() {
    for(var i=1; i<arguments.length; i++)
        for(var key in arguments[i])
            if(arguments[i].hasOwnProperty(key))
                arguments[0][key] = arguments[i][key];
    return arguments[0];
}

/**
  * @desc An equivalent to jquery's proxy function that allows function creation with specified context and arguments
  * @param  function, [scope, [arguments]]
*/

var proxy = Focus.proxy = function(fn, context) {
    var args = [].slice.call(arguments, 2);

    return function() {
        return fn.apply(context || this, args.concat([].slice.call(arguments)));
    };
};


/**
  * @desc Validator is a singleton that allows to validate data from RegExp that can be overriden
*/
var Validator = function() {

    this.regex = {
        alphanumeric : /^[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._\s-]+$/,
        numeric: /^\d+$/,
        alpha: /^[a-zA-ZÁÀÂÃÄÉÈËÍÌÎÏÓÒÔÚÙáàãâéèíìîóòúùûü]+$/,
        email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    };
};

Validator.prototype = {

    /**
      * @desc  extends regex object with provided object holding RegExp
      * @param object (object)
    */
    set: function(object) {

        for (var key in object) {
            if (!object[key] instanceof RegExp) return false;
        }

        extend(this.regex, object);

        return this;

    },

    /**
      * @desc  validates value using RegExp type defined in regex object or crude RegExp
      * @param type (string || RegExp)
      * @param value (multitype)
    */
    validate: function(type, value) {

        if (this.regex[type])
            return this.regex[type].test(value);
        else if (type instanceof RegExp)
            return type.test(value);
        else
            throw new Error('Validator->validate() requires a regex of a valid check type as parameter and a value');

    }

};

// Holds a reference to the registered Dispatcher
var registeredValidator;

Focus.Validator = function() {

    if (!registeredValidator) registeredValidator = new Validator();

    return registeredValidator;

};


// Holds a reference to the registered Dispatcher
var registeredDispatcher;

/**
  * @desc The Dispatcher is a singleton that registers callbacks to be executed on a string dispatch
*/
var Dispatcher = function() {
    this.actions = [];
};

Dispatcher.prototype = {

    /**
      * @desc  Registers a callback to a string, when dispatched callback is fired
      * @param action (string) : the dispatch to which the callback will be bound
      * @param callback (function)
      * @param scope (object) : callback scope
    */
    register: function(action, callback, scope) {

        if (typeof callback !== 'function') throw new Error('Dispatcher-> register() requires both string and callback');

        if (!this.actions[action]) this.actions[action] = [{
            scope: scope,
            callback: callback
        }];
        else this.actions[action].push({
            scope: scope,
            callback: callback
        });

    },

    /**
      * @desc  unregisters a callback that was registered with the register function
      * @param action (string) : the dispatch to which the callback was bound
      * @param callback (function)
    */
    unregister: function(action, callback) {
        if (!this.actions[action]) throw new Error('Dispatcher->'+action+' is undefined');

        if (!callback) this.actions[action] = [];

        var _index = this.actions[action].indexOf(callback);
        if (_index > -1) this.actions[action].splice(_index,1);
    },

    /**
      * @desc  Fires every  registered callbacks associated with a string
      * @param action (string) : the dispatch key to trigger on
      * @param object (object) :an object that will be passed as a paramater to the callback
    */
    dispatch: function(action, object) {

        if (this.actions[action]) {
            this.actions[action].forEach(function(_action) {
                if (typeof _action.callback === 'function') {
                    if (_action.scope) _action.callback.call(_action.scope, object);
                    else _action.callback(object);
                }
            });
        }

    },

    /**
      * @desc  A debug function that lists registered callbacks for a given string
      * @param action (string)
    */
    list: function(action) {
        console.log('Dispatcher->'+action+'-> Callbacks :');
        this.actions[action].forEach(function(_action) {
            console.log(_action.callback);
        });
    }

};

Focus.Dispatcher = function() {
    if (!registeredDispatcher) registeredDispatcher = new Dispatcher();
    return registeredDispatcher;
};



//methods that will be inherited by various components

/**
  * @desc Dispatches as string so that all associated callbacks are fired
  * @param _action(string)
*/
var _dispatch = function(_action, object) {
    Focus.Dispatcher().dispatch(_action, object);

};

/**
  * @desc Registers a callback to an action string
  * @param _action(string)
  * @param callback(function)
*/
var _onDispatch = function(_action, callback, scope) {

    if (!this._actions[_action]) this._actions[_action] = [];

    this._actions[_action].push({
        scope: scope,
        callback: callback
    });
    Focus.Dispatcher().register(_action, callback, scope);

    return this;

};

/**
  * @desc Unregisters all dispatch callbacks associated to a model, collection
  * @param _action(string)
  * @param callback(function)
*/
var _removeDispatchListeners = function() {
    if (registeredDispatcher) {

        for (_key in this._actions) {

            this._actions[_key].forEach(function(callback) {
                registeredDispatcher.unregister(_key, callback);
            });

        }

        return true;

    } else {

        return false;

    }
};

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

/**
  * @desc  Focus.Model holds data and has data related methods such as get, has or attribute is
           it stores its data in an attributes object andevery model declared is stored in a
           Focus.models array for checking model instanceof in Collections fo rexample
  * @param name (string): holds the model's name for further reference
  * @param extended (object): holds data that will extend Model functionnality, all functions
           will be added to object prototype whereas values will be added to object itself
*/
var Model = function (name, extended) {

     var Model = function(_options) {

        for (var key in extended) {
            if (typeof extended[key] === 'function') Model.prototype[key] = extended[key];
            else Model[key] = extended[key];
        }

        this.name = name;
        this._actions = {};
        this.attributes = {};
        this.set(_options);
        this.init();
    };

    Model.prototype = {

        init: function() {

        },

        /**
          * @desc  extends attributes with an object || sets property by string name
          * @param _data (object || string): _object to extend attributes with or single
                   attribute string identifier
          * @param value (multitype) the value to set for a given attribute string
        */
        set: function(_data) {
            if (typeof _data === 'object')
                extend(this.attributes, _data);
            else if (typeof _data === 'string' && arguments.length>1) {
                this.attributes[_data] = arguments[1];
            }

            return this.attributes;
        },

        /**
          * @desc  returns single attribute if define or the whole attributes object
          * @param attribute (string)
        */
        get: function(attribute) {
            return attribute ? this.attributes[attribute] : this.attributes;
        },

        /**
          * @desc  Checks if attribute is defined in model
          * @param attribute (string)
        */
        has: function(attribute) {
            return typeof this.attributes[attribute] !== 'undefined';
        },

        attributeIs: function(attribute, validatorType) {
            var _validator = Focus.Validator();
            return _validator.validate(validatorType, this.attributes[attribute]);
        },

        /**
          * @desc builds an XMLHTTPRequest and fires onSuccess or onFailure accordingly
          * @param options {
          *    url
          *    method: GET || PUT || POST || UPDATE
          *    onSuccess (xhr, response)
          *    onFailure (xhr)
          *    data: dataString
          * }
        */
        request: function(options) {
            ajax(options);
            return this;
        },

        destroy: function() {

            _removeDispatchListeners();

        },

        dispatch: _dispatch,
        onDispatch: _onDispatch

    };

    Focus.models[name] = Model;

    return Model;

};

Focus.Model = Model;

/**
  * @desc  Focus.Collection is an extended array that holds models and can sort through their
           attributes. The prototype of Array can not be modified therefor Collections instanciate
           single arrays and then apply methods to them (they don't profit from prototype optimization
            for multiple instances)
  * @param _extended (object): holds data and functions that will extend Collection functionnality
                               also holds model string reference for model type checking
*/
var Collection = Focus.Collection  = function(extended) {


    var Collection = function() {

        if (!extended.model || !Focus.models[extended.model]) throw new Error('Collection->model must be a valid Focus.Model');

        var _Collection = new Array();

        extend (_Collection, extended)

        /**
          * @desc Returns elements where Model.attributes.attribute is equal to value
                  -> is a private function used in public functions
          * @param attribute (string)
          * @param value
          * @param model (bool) return value (if false or undefined returns id)
        */
        var _getWhere = function(attribute, value, model) {
            var _vals = [];
            for (var i = 0, j = _Collection.length; i<j; ++i) {
                if (_Collection[i].attributes[attribute] === value) _vals.push((model ? _Collection[i] :  i));
            }

            return _vals;
        };

        var _methods = {

            /**
              * @desc overrides the push method to provide model type verifications
            */
            push: function() {
                for (var i = 0, j = arguments.length; i<j; ++i) {
                    if (!arguments[i] instanceof Focus.models[extended.model]) throw new Error('Collection->push must provide valid Focus.Models');
                }
                return Array.prototype.push.apply(this,arguments);
            },

            /**
              * @desc Sorts models in collection by attribute
              * @param attribute string
              * @param order '>' || '<'
            */
            sortBy: function(attribute, order) {
                if (_Collection[0]) {

                    if (typeof _Collection[0].attributes[attribute] === 'string') {
                        _Collection.sort(function(a,b) {
                            if(a.attributes[attribute] < b.attributes[attribute]) return -1;
                            if(a.attributes[attribute] > b.attributes[attribute]) return 1;
                            return 0;
                        });
                    } else if ( parseInt(_Collection[0].attributes[attribute]) ) {
                        _Collection.sort(function(a,b) {
                            return a.attributes[attribute] - b.attributes[attribute];
                        });
                    }

                    if (order === '<') return this;
                    else return _Collection.reverse();

                }

                return this;

            },

            /**
              * @desc Returns all models in collection where attribute === value
              * @param attribute (string)
              * @param value
            */
            getWhere: function(attribute, value) {
                return _getWhere(attribute, value, true);
            },

            /**
              * @desc Sets all models 'attributeToset' to 'value' in collection where 'attribute' === 'oldValue'
              * @param attribute (string)
              * @param oldvalue
              * @param attributeToSet (string)
              * @param value
            */
            setWhere: function(attribute, oldValue, attributeToSet, value) {


                if (typeof value === 'undefined') {
                    value = attributeToSet;
                    attributeToSet = attribute;
                }


                //store because foreach returns undefined instead of array
                var _models =_getWhere(attribute, oldValue, true);

                _models.forEach(function(_model) {
                     _model.set(attributeToSet, value);
                 });

                 return _models;
            },

            /**
              * @desc Deletes all models in collection where attribute === value
              * @param attribute (string)
              * @param value
            */
            deleteWhere: function(attribute, value) {

                if (attribute==='index') {
                    _Collection[value].destroy();
                    _Collection.splice(value, 1);
                } else {
                     _getWhere(attribute, value).forEach(function(val) {
                        _Collection[val].destroy();
                        _Collection.splice(val, 1);
                    });
                }

                return this;

            },

            /**
              * @desc builds an XMLHTTPRequest and fires onSuccess or onFailure accordingly
              * @param options {
              *    url
              *    method: GET || PUT || POST || UPDATE
              *    onSuccess (xhr, response)
              *    onFailure (xhr)
              *    data: dataString
              * }
            */
            request: function(options) {
                ajax(options);
                return this;
            },

            /**
              * @desc Returns every models' attributes in an array
            */
            toJSON: function() {
                var _json = [];
                _Collection.forEach(function(model) {
                    _json.push(model.get());
                });
                return _json;
            },

            dispatch: _dispatch,
            onDispatch: _onDispatch

        };

        extend (_Collection, _methods);

        if (extended.values) _Collection.push.apply(this, extended.values);

        return _Collection;

    };

    return Collection;
};

/**
 * @desc The binder is a singleton component that allows to bind methods to views
 *       by creating binders you literally create method libraries that will be bound
 *       to objects (usually view objects), invoking a declared binder with a view
 *       will allow it to inherit the methods it called for
 *       Binder declaration uses a name string to identify a binder in the singleton pattern and
 *       an object that will extend the default binder with methods and properties
 * @param name (string)
 * @param extended (object)
 */
var Binder = function(name, extended) {

    for (var key in extended) {
        this[key] = extended[key];
    }

    this.binderName = name;
    Focus.binderInstances[name] = this;
};

Binder.prototype = {

    /**
     * @desc bindToView binds an array of Binder methods to a view
     *       also attaches binderName to view to be used in _ method
     * @param view (object) the view to which the methods will be bound
     * @param functions (array of strings) the methods that will be bound
     * @param scope (the scope these functions will be called with)
     * @returns view
     */
    bindToView : function(view, functions, scope) {
        var _this = this;

        if (typeof view === "object") {

            functions.forEach(function(fn) {
                if (typeof _this[fn] === 'function') {
                    view[fn] = scope ? _this[fn].bind(scope) : _this[fn].bind(view) ;
                } else {
                    throw new Error('Binder->bindToView() requires an array of functions associated with a view, '+fn+' is not a valid method of binder instance');
                }
            });

        } else {
            throw new Error('Binder->bindToView() requires a view object to which functions will be bound');
        }
        view.binderName = this.binderName;
        view._ = this._;
        return view;

    },

    /**
     * @desc _ is a function that allows scoped binders to access their methods
     * @param functionName (string) method to use
     * @param args (array or value) arguments passed to the invoked method
     */
    _ : function(functionName, args) {
        if (typeof Focus.binderInstances[this.binderName][functionName] === "function") {
            if (typeof args !=="object" || !args.length) args = [args];
            Focus.binderInstances[this.binderName][functionName].apply(this, args);
        } else {
            throw new Error('Binder->_() requires a valid Binder method to be called')
        }
    }
};

/**
 * @desc Creates a Binder instance if binder was never invoked using the singleton pattern
 * @param name (string) the binder name by which it will be identified
 * @param extended (object) an object holding the binder methods
 * @returns an instances of the Binder
 */
Focus.Binder = function(name, extended) {
    return function(view, functions) {

        if (!Focus.binderInstances[name]) {
            new Binder(name, extended);
        }

        Focus.binderInstances[name].bindToView(view, functions);
        if (typeof Focus.binderInstances[name].init === "function") Focus.binderInstances[name].init.call(view);
        return view;
    };
};
return Focus;
}();
