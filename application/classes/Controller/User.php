<?php defined('SYSPATH') or die('No direct script access.');

class Controller_User extends Controller_Template {

	/**
	* JSON
	* Login in
	* @return
	*/
	public function action_login()
	{
		$this->auto_render = false;
		$post = $this->request->post();
		$success = Auth::instance()->login($post['username'], $post['password']);
		if ($success)
		{
			$user = Auth::instance()->get_user();
			if (!$user->profile->find()->loaded())
			{
				$profile = Model::factory('profile');
				$profile->user_id = $user->id;
				$profile->name = $user->username;
				$profile->save();
			}
		}
		print Tools_JsonResponce::toJson($success ? Tools_JsonResponce::$SUCCESS : Tools_JsonResponce::$ERROR, '');
	}
	
	/**
	* JSON
	* Logount
	* @return
	*/
	public function action_logout()
	{
		$this->auto_render = false;
		$success = Auth::instance()->logout();
		print Tools_JsonResponce::toJson($success ? Tools_JsonResponce::$SUCCESS : Tools_JsonResponce::$ERROR, '');
	}
	
	public function action_registration()
	{
		$this->template->content = View::factory('user/registration');
	}
	
	public function action_index()
	{
		
	}
	
	/**
	* JSON
	* Compleat user registration
	* @return
	*/
	public function action_register()
	{
		$this->auto_render = false;
		$user = json_decode(file_get_contents('php://input'));
		$post = array(
			'username' => $user->username,	
			'email' => $user->email,	
			'password' => $user->password,
			'password_confirm' => $user->passwordc	
		);
		
		try {
			$user = ORM::factory('User')->create_user($post, array(
						'username',
						'password',
						'email'
					));
					
			// Grant user login role
			$user->add('roles', ORM::factory('Role', array('name' => 'login')));
			
			print Tools_JsonResponce::toJson(Tools_JsonResponce::$SUCCESS, null);
		} catch (ORM_Validation_Exception $e) {
			print Tools_JsonResponce::toJson(Tools_JsonResponce::$ERROR, $e->errors('user'));
		}
	}
	
	public function action_regsuccess()
	{
		$this->template->content = View::factory('user/regsuccess');
	}
	
}
