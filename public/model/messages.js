define([
	'model/Message'
], function (Message) {

	return new (Backbone.Collection.extend({
		model: Message
	}))();

});