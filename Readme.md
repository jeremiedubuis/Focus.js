**Why I built Focus.js**

The idea started after having worked with React for a bit. When my applications got complex I started using a Flux architecture that I soon simplified using Reflux. However my stores quickly became bloated and my concern was that maintenance would be difficult.

I then started experimenting with a more classic approach based on a proved Backbone style pattern. Working on this pattern I found that passing the view to my "controller" allowed me to directly use my React views' setState method from the place where the data was gathered.

After a few quirks and problems of implentation I finally decided all the semantic separation might be an actual obstacle to readability. My idea was to derive from the Model View Presenter pattern to provide a communication component between React views and my implementation of Models and Collections.

My solution as of today was to simply keep the clear cut separation of concerns that controllers or presenters bring but to remove the component itself. As a result I built a semantic method injector that I call a Binder. It has a single role : bind functions to views. This is at its core a strict interpretation on the MVVM pattern since the methods bound the view create a direct communication between views and models, without the confusion of mixing view logic and buisness logic in the same file. 
 
 **The result**
 
 The project is still too young and I still don't have enough experience to judge if the idea amounts to anything. But this design pattern can be implemented in the following way :
 
 We have several independent views. Each implements binders for the datasets they need to use. Lets imagine a simple login form. It could for example use a UserBinder asking for the "login" method. The view can then invoke this.login has if the method and been bound directly to it. The Binder login method actually sets up communication with a User Model and uses that information. Using React, you could imagine the following UserBinder.login method:
 
```javascript
var User = require('../models/User.js');

UserBinder = Focus.Binder('User', {

    // The view calls this.login with the value of both form fields for example
    login: function(email, password) {
        var _this = this;\n        
        var _user = new User();
        // Instantiate new Focus.Model User
        //_user model has it's own login method that performs an ajax request
        _user.login(email, password, function(success, err) {
             //if success then _user model updated itself
             if (success) {
                 _this.setState({
                    user: _user.get(),
                    logged: true
                 });
             //if error update state with error
             } else {
                 _this.setState({
                     error: err
                 });
             }
        });
        
    }
    
});

module.exports = UserBinder;
```
    
The view could then implement the binder in its onSubmit method for example:
```javascript
var UserBinder = require('../binders/UserBinder.js');
var LoginView = {
        init: function() {
        UserBinder(this, ['login']);
    },
    onSubmit: this.login
};
```
