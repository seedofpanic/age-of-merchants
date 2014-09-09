<?php defined('SYSPATH') OR die('No direct script access.');

class Admin_Controller extends Controller_Template {
	private $isAdmin = false;
	
	public function execute()
	{
		$this->auth();
		if (isset($this->user))
		{
			$this->isAdmin = $this->user->has('role', 'admin');
		}
		if ($this->isAdmin)
		{
			parent::execute();
		}else{
			$this->redirect('admin/login');
		}
	}
	
}
