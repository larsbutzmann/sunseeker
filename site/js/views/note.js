var app = app || {};

app.NoteView = Backbone.View.extend({
    tagName: 'div',
    className: 'noteContainer',
    template: _.template($('#noteTemplate').html()),

    events: {
        'click .delete': 'deleteNote'
    },

    deleteNote: function() {
        this.model.destroy();
        this.remove();
    },

    render: function() {
        //this.el is what we defined in tagName. use $el to get access to jQuery html() function
        this.$el.html(this.template(this.model.toJSON()));

        return this;
    }
});