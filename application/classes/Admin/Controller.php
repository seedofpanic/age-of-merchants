<?php defined('SYSPATH') OR die('No direct script access.');

class Admin_Controller extends Controller_Template {
	private $isAdmin = false;
	
	public function execute()
	{
		$this->templateTopMenu = 'admin/topmenu';
		$this->auth();
		if (isset($this->user))
		{
			$this->isAdmin = Auth::instance()->logged_in('admin');
		}
		if ($this->isAdmin > 0)
		{
			return parent::execute();
		}else{
			$this->redirect('/');
		}
	}
	
}
