<?php defined('SYSPATH') or die('No direct script access.');

class Tools_JsonResponce {
	
	//enum
	public static $SUCCESS = 's';
	public static $ERROR = 'e';
	
	public static function toJson($status, $data)
	{
		return json_encode(array('status' => $status, 'data' => $data));
	}

}