var app = app || {};

app.TodoView = Backbone.View.extend({
    el: '#note',

    initialize: function() {
        this.collection = new app.Todo();
        this.collection.fetch({reset: true});
        this.render();

        this.listenTo(this.collection, 'add', this.renderNote);
        this.listenTo(this.collection, 'reset', this.render);
    },

    events: {
        'click #add':'addNote'
    },

    addNote: function(e) {
        var formData = {};
        e.preventDefault();

        $('#addNote').children().each(function(i, el) {
            if($(el).val() !== '') {
                formData[ el.id ] = $(el).val();
            }
            // Clear input field value
            $(el).val('');
        });
        formData['postdate'] = Date.now();

        this.collection.create(formData);
    },

    render: function() {
        this.collection.each(function(item) {
            this.renderNote(item);
        }, this);
    },

    renderNote: function(item) {
        var noteView = new app.NoteView({
            model: item
        });
        $("#notes").append(noteView.render().el);
        // this.$el.append(noteView.render().el);
    }
});