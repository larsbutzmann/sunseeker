var app = app || {};

app.Note = Backbone.Model.extend({
    defaults: {
        text: 'No text',
        postdate: 'Unknown'
    },

    parse: function( response ) {
        response.id = response._id;
        return response;
    }
});