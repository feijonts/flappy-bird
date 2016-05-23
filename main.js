var game = new Phaser.Game(400, 490);

var estado = {
    preload: function () {
        game.load.image('passarinho','assets/Fireball_50x50.png' );
        
        game.load.image('quadrado' , 'assets/pipe.png');
    },
    
    create: function () {
        game.stage.backgroundColor = '#71c5cf';
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.passarinho = game.add.sprite(100,245,'passarinho');
        
        game.physics.arcade.enable(this.passarinho);
        
        this.passarinho.body.gravity.y  = 1000;
        
        var espaco = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        
        espaco.onDown.add(this.pulo, this);
        
        this.canos = game.add.group();
        
        this.timer = game.time.events.loop(1500, this.addCano, this);
        
        this.placar = game.add.text(20, 20, "0", {
            font: "70px Arial Black",
            fill: "#fff"
        });
        
        this.pontos = 0;
        
        this.passarinho.anchor.setTo(-0.2, 0.5);
                
    },
        
    update: function(){
        
        if (this.passarinho.y > 490)
            this.reiniciaJogo(); 
        
        game.physics.arcade.overlap(this.passarinho, this.canos, this.reiniciaJogo);
        
        if(this.passarinho.angle < 20)
            this.passarinho.angle += 1;
        
    },
    
    reiniciaJogo: function () {
        game.state.start('main');   
    },
    
    pulo: function () {
        this.passarinho.body.velocity.y = -350;
        
        var animacao = game.add.tween(this.passarinho);
        
        animacao.to({angle: -20},100);
        
        animacao.start();
    }, 
    
    addQuadrado: function(x,y) {
        var quadrado = game.add.sprite(x,y,'quadrado');
        
        this.canos.add(quadrado);
        
        game.physics.arcade.enable(quadrado);
        
        quadrado.body.velocity.x = -200;
        
        quadrado.checkWorldBounds = true;
        quadrado.outOfBoundsKill = true;
    },
        
    addCano: function(){
        this.pontos += 1;
        this.placar.text = this.pontos;
        
        var buraco= Math.floor (Math.random() * 5) +1;
        
        for (var i = 0; i < 8; i++)
            if (i != buraco && i != buraco + 1)
                this.addQuadrado(400,10 + i*60);
        
    }


};

game.state.add('main', estado);
game.state.start('main');