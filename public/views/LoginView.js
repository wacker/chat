define([
	'text!views/LoginView.html',
	'socket'
], function (loginTemplate, socket) {
	return Backbone.View.extend({

		tagName: 'table',

		render: function () {
			this.$el.html(Mustache.render(loginTemplate, {}));
			this.$('input').focus();
		},

		events: {
			'keypress #name': 'login'
		},

		login: function (event) {
			if (event.which == 13) {
				this.options.router.navigate(this.$('#name').val(), { trigger: true });
			}
		}

	});
});