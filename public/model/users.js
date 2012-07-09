define([
	'model/User'
], function (User) {

	return new (Backbone.Collection.extend({
		url: '/users',
		model: User
	}))();

});