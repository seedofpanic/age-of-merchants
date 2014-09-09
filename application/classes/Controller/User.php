<?php defined('SYSPATH') or die('No direct script access.');

class Controller_User extends Controller_Template {

	/**
	* Ajax
	* Login in
	* @return
	*/
	public function action_login()
	{
		$this->auto_render = false;
		print "OK!";
	}
	
	public function action_registration()
	{
		$this->template->content = View::factory('user/registration');
	}
	
	public function action_index()
	{
		
	}
	
	/**
	* Ajax
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
			$user = ORM::factory('user')->create_user($post, array(
						'username',
						'password',
						'email'
					));
					
			// Grant user login role
			$user->add('roles', ORM::factory('role', array('name' => 'login')));
			
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