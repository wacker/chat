require.config({
	paths: {
		text: 'lib/text'
	}
});
require([
	'views/LoginView',
	'views/ChatView',
	'model/users',
	'model/me',
	'socket'
], function (LoginView, ChatView, users, me, socket) {

	Backbone.View.prototype.renderSubview = function (subview) {
		this.$el.append(subview.el);
		this.subviews = this.subviews || [];
		this.subviews.push(subview);
		subview.render();
	};
	Backbone.View.prototype.close = function () {
		this.unbind();
		this.undelegateEvents();
		_.each(this.subviews, function (subview) {
			subview.close();
		});
		if (this.onClose) {
			this.onClose();
		}
		this.remove();
	};

	var currentView;

	new (Backbone.Router.extend({

		routes: {
			'': 'login',
			'*name': 'chat'
		},

		login: function () {
			this.switchView(new LoginView({ router: this }));
		},

		chat: function (name) {
			if (name) {
				socket.name(name);
				this.switchView(new ChatView({ router: this }));				
			} else {
				this.navigate('', { trigger: true });
			}
		},

		switchView: function (view) {
			if (currentView) {
				currentView.close();
			}
			currentView = view;
			$('body').append(currentView.el);
			currentView.render();
		}

	}))();

	Backbone.history.start({ pushState: true });

});