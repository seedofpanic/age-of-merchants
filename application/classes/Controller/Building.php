<?php defined('SYSPATH') or die('No direct script access.');

class Controller_Building extends Controller_Template {

    public function before()
    {
        $param = $this->request->param();
        $this->id = isset($param['id'])? $param['id'] : 0;
        parent::before();
    }

    public function action_index()
    {
        if ($this->id > 0)
        {
            $this->template->content = View::factory('building');
            $this->template->content->building = ORM::factory('building', $this->id);
        }else{
            $this->template->content = View::factory('errors/404');
        }
    }

    public function action_home()
    {
        $this->auto_render = false;
        $this->template->content = '';
    }

    public function action_goods()
    {
        $this->auto_render = false;
        $view = View::factory('building/goods');
        $view->goods = ORM::factory('goods')->where('building_id', '=', $this->id)->find_all();
        print $view->render();
    }

}
