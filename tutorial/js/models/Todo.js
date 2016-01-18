module.exports = Focus.Model('Todo', {
    attributes: {
        done: false
    },

    toggleDone: function() {
        this.set("done", !this.attributes.done);
    }
});