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

}
