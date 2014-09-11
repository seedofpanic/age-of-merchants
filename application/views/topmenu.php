
 <div class="navbar navbar-default navbar-fixed-top">
 	<div class="container">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-responsive-collapse">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="/">Age of Merchants</a>
    </div>
    <div class="navbar-collapse collapse navbar-responsive-collapse">
      <ul class="nav navbar-nav">
        <li class="active"><a href="/">Main</a></li>
        <?if (isset($user)){?>
        	<li class="active"><a href="/own">Buildings</a></li>
       	<?}?>
      </ul>
      <ul class="nav navbar-nav navbar-right quick-login login-form">
      	<?if ($user){?>
      		<li><?=$user->username?></li>
      		<li><div class="btn btn-default" onclick="logoutUser(this)">Log out</div></li>
      	<?}else{?>
          	<li><a href="/user/registration">Registration</a></li>
            <li><input type="text" class="form-control username" placeholder="login"/></li>
            <li><input type="password" class="form-control password" placeholder="password"/></li>
            <li><div class="btn btn-primary" onclick="loginUser(this)">Log in</div></li>
        <?}?>
      </ul>
    </div>
    </div>
  </div>