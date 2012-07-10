require.config({
	paths: {
		text: 'lib/text'
	}
});
require([
	'views/Login',
	'views/Chat',
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

	new (Backbone.Router.extend({

		initialize: function () {
			$('a').live('click', function () {
				this.navigate($(this).attr('href'), true);
				return false;
			});
		},

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
				this.switchView(new ChatView());				
			} else {
				this.navigate('', { trigger: true });
			}
		},

		switchView: function (view) {
			if (this.currentView) {
				this.currentView.close();
			}
			this.currentView = view;
			$('body').append(view.el);
			view.render();
		}

	}))();

	Backbone.history.start({ pushState: true });

});