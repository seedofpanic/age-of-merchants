<?php defined('SYSPATH') OR die('No direct script access.');

class Controller_Template extends Kohana_Controller_Template {
	private $user;
	
	public function before()
	{
		parent::before();
		$this->template->user = $this->user = Auth::instance()->get_user();
	} 
}
