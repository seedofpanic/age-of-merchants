var User = Backbone.Model.extend({
	register: function(){
		save();
	},
	url: function(){
		var id = this.get('id');
		return '/user/' + (id > 0 ? id : 'register');
	}
});

function registerUser()
{
	var newUser = new User();
	newUser.set({username: $('#inputUsername').val()});
	newUser.set({email: $('#inputEmail').val()});
	newUser.set({password: $('#inputPassword').val()});
	newUser.set({passwordc: $('#inputPasswordC').val()});
	newUser.save();
}