var app = app || {};

app.Todo = Backbone.Collection.extend({
    model: app.Note,
    url: '/api/notes'
});