<?php defined('SYSPATH') OR die('No direct script access.');

class Controller_Template extends Kohana_Controller_Template {
	private $user;
	private $needAuth = true;
	
	public function before()
	{
		parent::before();
		$this->auth();
		$this->template->user = $this->user;
	}
	
	protected function auth()
	{
		if ($this->needAuth)
		{
			$this->user = Auth::instance()->get_user();
			$this->needAuth = false;
		}
	}
}
