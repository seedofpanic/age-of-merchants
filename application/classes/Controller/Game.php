<?php defined('SYSPATH') or die('No direct script access.');

class Controller_Game extends Controller_Template {

    public function before()
    {
        $config = Kohana::$config->load('buildings_types');
        $this->buildings_types = $config;
        parent::before();
    }

	public function action_index()
	{
		$this->template->content = '';
	}

	public function action_project()
	{
        $config = Kohana::$config->load('buildings_types');
        $types = $config['names'];
        $params = $config['params'];
		$view = View::factory('game/project');
		$view->types = $types['en'];
        $view->params = $params;
		$view->regions = ORM::factory('map_region')->find_all();
		$this->template->content = $view;
	}

    public function action_save_project()
    {
        $project = $this->getProject($this->request->post());
        $cost = $this->getProjectCost($project);
        if ($this->user->profile->gold >= $cost)
        {
            if ($project->check())
            {
                $building = ORM::factory('building');
                $building->name = $this->getParam('name', 'building');
                $building->type = $project['type'];
                $building->field_id = $this->tmp_field_id;
                $building->status = 'building';
                $building->buildtime = $this->buildings_types['params'][$project['type']]['build_time'];
                $building->profile_id = $this->user->profile->id;
                $building->save();
                $this->user->profile->gold -= $cost;
                $this->user->profile->save();
            }
        }
        $this->redirect('/own');
    }

    public function getProject($data)
    {
        return Validation::factory($data)
            ->rule('type', array($this, 'checkProjectType'))
            ->rule('field_id', array($this, 'checkCoords'), array(':data', ':back'));
    }

    private function getProjectCost($project)
    {
        return 100;
    }

    public function checkProjectType($value)
    {
        return in_array($value, $this->buildings_types['types']);
    }

    public function checkCoords($array, $back)
    {
        $this->tmp_field_id = ORM::factory('map_region', $array['region_id'])->fields->where('x', '=', $array['x'])->where('y', '=', $array['y'])->find()->id;
        return $this->tmp_field_id > 0;
    }

}
