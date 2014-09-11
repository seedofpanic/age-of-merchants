<?php defined('SYSPATH') OR die('No direct script access.');

class Controller_Template extends Kohana_Controller_Template {
	protected $user;
	protected $needAuth = true;
	public $templateTopMenu = 'topmenu';
	public $post;
	
	public function before()
	{
		$this->post = $this->request->post();
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
	
	public function after()
	{
		$this->template->topmenu = View::factory($this->templateTopMenu);
		$this->template->topmenu->user = $this->user;
		parent::after();
	}
	
	public function getParam($name, $def = '')
	{
		return isset($this->post[$name]) ? $this->post[$name] : $def;
	}
}
