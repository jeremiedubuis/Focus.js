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