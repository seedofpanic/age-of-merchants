<!DOCTYPE html>
<html>
	<head>
		<title>Age of Merchants</title>
		<link rel="stylesheet" href="/css/bootstrap.min.css">
		<link rel="stylesheet" href="/css/style.css">

		<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
		<script src="/js/external/underscore-min.js"></script>
		<script src="/js/external/backbone-min.js"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
        <script src="/js/Router.js"></script>
        <script src="/js/Tools.js"></script>
        <script src="/js/jquery_ext.js"></script>
		
		<script src="/js/User.js"></script>
	</head>
	<body>
		<div class="container">
			<?=$topmenu?>
			<div class="main-content">
                <?
                    $profmin = View::factory('frames/profmin');
                    if (isset($user->profile))
                    {
                        $profmin->profile = $user->profile;
                        print $profmin;
                    }
                ?>
				<?$content->user = $user;?>
                <?=$content?>
			</div>
		</div>
	</body>
</html>