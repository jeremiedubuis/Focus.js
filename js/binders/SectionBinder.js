module.exports = Focus.Binder('Section', {

    getFromJson: function(section, callback) {

        var _this = this;
        if (!App.cache[section]) {
            Focus.ajax({
                url: "json/"+section+".json",
                method: "GET",
                onSuccess: function(xhr, data) {

                    App.cache[section] = data;

                    _this._('onData', [data, callback]);
                }
            });
        } else {
            this._('onData', [App.cache[section], callback]);

        }
    },

    onData: function(data, callback) {
        if (typeof callback === "function") callback(data);
        else {
            this.setState({
                content: data
            });
        }
        App.dispatcher.dispatch('view:loaded');
    }

});