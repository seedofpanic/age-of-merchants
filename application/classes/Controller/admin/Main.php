<?php defined('SYSPATH') or die('No direct script access.');

class Controller_Admin_Main extends Admin_Controller {

	public function action_index()
	{
		$this->template->content = 'Admin';
	}

}
