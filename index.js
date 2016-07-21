var box =function(options) {
	var bmd  =game.add.bitmapData(options.length,options.width);
	bmd.ctx.beginPath();
	bmd.ctx.rect(0,0,options.length,options.width);
	bmd.ctx.fillStyle= options.color;
	bmd.ctx.fill();
	return bmd;
};
var circle =function(options) {
	var bmd  =game.add.bitmapData(options.length,options.width);
	bmd.ctx.beginPath();
	bmd.ctx.oval(0,0,options.length,options.width);
	bmd.ctx.fillStyle= options.color;
	bmd.ctx.fill();
	return bmd;
};
var b =false;
var game = new Phaser.Game(500,600);
var mainState = {
	create: function(){
		game.stage.backgroundColor ="#9DC2C5";
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.world.enableBody =true;
		this.player= game.add.sprite(32,32,box({length:32,width: 32,color: '#129994'}));
		this.cursor = game.input.keyboard.createCursorKeys();	
		this.walls =game.add.group();
		this.walls.enableBody =true;
			
		var top = this.walls.create(0,0,box(
		{
			length:game.world.width,width:16,color: '#374A59'
		}))	;
		top.body.immovable =true;
		var bottom = this.walls.create(0,game.world.height-16,box(
		{
			length:game.world.width,width:16,color: '#374A59'
		}))	;
		bottom.body.immovable =true;

		var left = this.walls.create(0,16,box(
		{
			length:16,width:game.world.height-32,color: '#374A59'
		}))	;
		left.body.immovable =true;
		var right = this.walls.create(game.world.width-16,16,box(
		{
			length:16,width:game.world.height-32,color: '#374A59'
		}))	;
		right.body.immovable =true;
		var iw1 = this.walls.create(game.world.width/4,16,box(
		{
			length:16,width:game.world.height-game.world.height/4,color: '#374A59'
		}))	;
		iw1.body.immovable =true;
		var iw2 = this.walls.create(game.world.width/2,game.world.height/4,box(
		{
			length:16,width:game.world.height-game.world.height/4,color: '#374A59'
		}))	;
		iw2.body.immovable =true;
		var gate = this.walls.create(game.world.width-22,game.world.height-50,box(
		{
			length:6,width:36,color: '#A96262'
		}))	;
		gate.body.immovable =true;
		this.enemy= game.add.sprite(200,32,box({length:32,width: 32,color: '#A96262'}));
		this.enemy.body.velocity.setTo(200, 200);

    	//  This makes the game world bounce-able
   	 	this.enemy.body.collideWorldBounds = true;
		this.enemy.body.bounce.setTo(1, 1);
		
		this.key= game.add.sprite(244,42,box(
		{
			length:12,width:12,color: '#FF8C00'
		}))	;
		this.key.body.velocity.setTo(200,-50);

    	//  This makes the game world bounce-able
   	 	this.key.body.collideWorldBounds = true;
		this.key.body.bounce.setTo(1, 1);
	

	},
	update: function(){
		game.physics.arcade.collide(this.player,this.walls);
		game.physics.arcade.collide(this.key,this.walls);
	

		game.physics.arcade.collide(this.enemy,this.walls);
		var speed =250;
		this.player.body.velocity.x =0;
		this.player.body.velocity.y =0;
		if(this.cursor.up.isDown){
			this.player.body.velocity.y -=speed;
		}
		else if(this.cursor.down.isDown){
			this.player.body.velocity.y +=speed;
		}
		if(this.cursor.left.isDown){
			this.player.body.velocity.x -=speed;
		}
		else if(this.cursor.right.isDown){
			this.player.body.velocity.x +=speed;
		}
		game.physics.arcade.overlap(this.player,this.enemy,this.handleKill,null,this);
		game.physics.arcade.overlap(this.player,this.key,this.gateopen,null,this);

		if (b==true) {
			this.gate = game.add.sprite(game.world.width-24,game.world.height-60,box(
		{
			length:8,width:46,color: '#129994'
		}))	;
		this.gate.body.immovable =true;
		b=false;
		}
		game.physics.arcade.overlap(this.player,this.gate,this.finishFun,null,this);
	},
	handleKill: function(player,enemy){
		player.kill();
		game.state.start("gameOver");
	},
	gateopen:function(player,key){
		key.kill();
		b=true;

	},
	finishFun:function(player,gate){
		game.state.start("finish");
	}
};

gameOverState ={
	create: function(){
		label = game.add.text(game.world.width/2,game.world.height/2,"Game Over \n Press SPACE to restart",
		{
			font: '22px Arial',fill: '#fff' , align: 'center'
		});
		label.anchor.setTo(0.5,0.5);
		this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	},
	update: function(){
		if(this.spacebar.isDown){
			game.state.start('main');
		}

	}
};
finishState ={
	create: function(){
		label = game.add.text(game.world.width/2,game.world.height/2,"Level Completed \n Press SPACE to to start Level 2",
		{
			font: '22px Arial',fill: '#fff' , align: 'center'
		});
		label.anchor.setTo(0.5,0.5);
		this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	},
	update: function(){
		if(this.spacebar.isDown){
			game.state.start('main');
		}

	}
};

game.state.add('main',mainState);
game.state.add('gameOver',gameOverState);
game.state.add('finish',finishState);
game.state.start('main');
