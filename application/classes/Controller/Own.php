<?php defined('SYSPATH') or die('No direct script access.');

class Controller_Own extends Controller_Template {

	private $ON_PAGE = 20;
	
	public function action_index()
	{
		$param = $this->request->param();
		$post = $this->request->post();
		$page = isset($post['page']) ? $post['page'] : 1;
		if (isset($param['owner']))
		{
			$ownerName = $param['owner'];
			$owner = Model::factory('profile')->where('name', 'like', $ownerName)->find();	
		}else{
			if (!isset($this->user))
			{
				$this->redirect('/');
				return;
			}
			$owner = $this->user->profile;
		}
		
		$this->template->content = View::factory('own');
		$this->template->content->owner = $owner;
		$this->template->content->buildings = $owner->buildings->limit($this->ON_PAGE)->offset(($page - 1) * $this->ON_PAGE)->find_all();
	}

}
