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
	newUser.save(null, {success: function(data){
		if (data.changed.status == 'e')
		{
			$('#formError').html('');
			fields = ['username', 'email', 'password'];
			fields.forEach(function (index){
				if (data.changed.data[index])
				{
					$('#formError').append('<div class="alert alert-dismissable alert-danger">' + data.changed.data[index] + '</div>');	
				}
				if (data.changed.data._external[index])
				{
					$('#formError').append('<div class="alert alert-dismissable alert-danger">' + data.changed.data._external[index] + '</div>');	
				}
			});
		}else{
			window.location.href = '/user/regsuccess';
		}
	}});
}