<?php defined('SYSPATH') or die('No direct script access.');

class Controller_Admin_Regions extends Admin_Controller {

	public function action_index()
	{
		$this->template->content = View::factory('admin/regionsList');
		$this->template->content->regions = ORM::factory('map_region')->find_all();
	}

	public function action_add()
	{
		$region = ORM::factory('map_region');
		$region->name = $this->getParam('name');
		$region->x = $this->getParam('x');
		$region->y = $this->getParam('y');
		$region->save();
		$fields = array();
		for ($x = 0; $x < 64; $x++)
		{
			for ($y = 0; $y < 64; $y++)
			{
				$field = "(" . $region->id . ", $x, $y)";
				array_push($fields, $field);
			}
		}
		$query = DB::query(Database::INSERT, 'INSERT INTO map_fields(region_id, x, y) VALUES' . join(',', $fields));
		$query->execute();
		$this->redirect('/admin/regions');
	}

}
