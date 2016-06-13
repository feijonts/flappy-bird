var game = new Phaser.Game(400, 490);

var estado = {
    preload: function () {
        game.load.image('passarinho','assets/Fireball_50x50.png' );
        
        game.load.image('quadrado' , 'assets/pipe.png');
        
        game.load.audio('pulo', 'assets/jump.wav');
    },
    
    create: function () {
        this.somPulo = game.add.audio('pulo');
        
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
            this.animacaoMorte(); 
        
        game.physics.arcade.overlap(this.passarinho, this.canos, this.animacaoMorte, null, this);
        
        if(this.passarinho.angle < 20)
            this.passarinho.angle += 1;
        
    },
    
    reiniciaJogo: function () {
        game.state.start('main');   
    },
    
    pulo: function () {
        if(this.passarinho.alive && this.passarinho.y > 20) {
            this.passarinho.body.velocity.y = -350;

            var animacao = game.add.tween(this.passarinho);

            animacao.to({angle: -20},100);

            animacao.start();
            
            this.somPulo.play();
        }
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
    },
        
    animacaoMorte: function(){
        this.passarinho.alive = false;
        
        game.time.events.remove(this.timer);

        this.canos.forEach(function(quad){
            quad.body.velocity.x = 0;               
        }, this);
        
        this.mostraFinal();
    },

    mostraFinal: function() {
        this.placar = game.add.text(200, 200, this.pontos, {
            font: "70px Arial Black",
            fill: "#fff"
        });
        
    }
    
};

game.state.add('main', estado);
game.state.start('main');