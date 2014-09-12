<?php defined('SYSPATH') or die('No direct script access.');

class Controller_Game extends Controller_Template {

	public function action_index()
	{
		$this->template->content = '';
	}
	
	public function action_project()
	{
		$types = array('hunting' => 'Hunting hut', 'sawmill' => 'Sawmill');
		$view = View::factory('game/project');
		$view->types = $types;
		$view->regions = Model::factory('map_region')->find_all();
		$this->template->content = $view;
	}

}
