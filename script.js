(function jogo() {
    var cnv = document.querySelector('canvas');
    var ctx = cnv.getContext('2d');
    
    var mainFont = 'bold 48px monospace';
    var font = 'normal 32px Verdana';
    var smallFont = 'normal 26px Verdana';

    var movLeft, movUp, movRight, movDown = false;
    
    var paredes = [];

    var fimJogo = false;

    var pixel = 200;

    var dimensoesImg = 198;
    var img = new Image();
    img.src = "fim.png"; 

    var cam = {
        x: 0,
        y: 0,
        width: cnv.width,
        height: cnv.height,
        frontLeft: function() {
            return this.x + ((this.width / 100) * 25);
        },
        frontRight: function() {
            return this.x + ((this.width / 100) * 75);
        },
        frontUp: function() {
            return this.y + ((this.height / 100) * 75);
        },
        frontDown: function() {
            return this.y + ((this.height / 100) * 25);
        }
    };

    var personagem = {
        x: pixel + 20,
        y: pixel + 20,
        width: 28,
        height: 28,
        velocidade: 3
    };

    var cenario = [

        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
        [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1]
        
    ];

    function blockRetangulo(objA, objB) {
        var catX = (objA.x + objA.width / 2) - (objB.x + objB.width / 2);
        var catY = (objA.y + objA.height / 2) - (objB.y + objB.height / 2);
    
        var somaLargura = (objA.width / 2) + (objB.width / 2);
        var somaAltura = (objA.height / 2) + (objB.height / 2);
    
        if (Math.abs(catX)< somaLargura && Math.abs(catY) < somaAltura) {
            var invasaoX = somaLargura - Math.abs(catX);
            var invasaoY = somaAltura - Math.abs(catY);           
            if (invasaoX >= invasaoY) {
                if (catY > 0) {
                    objA.y += invasaoY;
                } else {
                    objA.y -= invasaoY;
                }
            } else {
                if (catX > 0) {
                    objA.x += invasaoX; 
                } else {
                    objA.x-= invasaoX; 
                }
            }
        }
    }

    function verificaChegada(objA, objB) {
        var catX = (objA.x + objA.width / 2) - (objB.x + objB.width / 2);
        var catY = (objA.y + objA.height / 2) - (objB.y + objB.height / 2);
    
        var somaLargura = (objA.width / 2) + (objB.width / 2);
        var somaAltura = (objA.height / 2) + (objB.height / 2);
    
        if (Math.abs(catX)< somaLargura && Math.abs(catY) < somaAltura) {         
            if (catY > 0) {
                fimJogo = true;
            }
        }
    }

    for (const linha in cenario) {
        for (const coluna in cenario[linha]) {
            var elemento = cenario[linha][coluna];
            
            if (elemento === 1) {
                var parede = {
                    x: pixel * coluna,
                    y: pixel * linha,
                    width: pixel,
                    height: pixel
                };
                paredes.push(parede);
            } else if (elemento === 2) {
                var chegada = {
                    x: pixel * coluna,
                    y: pixel * linha,
                    width: pixel,
                    height: pixel
                }
            }
        }
    }

    window.addEventListener("keydown", function(evento) {

        switch (evento.key) {
            case "w":
            case "ArrowUp":
                movUp = true;
                break;
            
            case "a":
            case "ArrowLeft":
                movLeft = true;
                break;
            
            case "d":
            case "ArrowRight":
                movRight = true;
                break;
            
            case "s":
            case "ArrowDown":
                movDown = true;
                break;
        }
    }, false);
    
    window.addEventListener("keyup", function(evento) {

        switch (evento.key) {
            case "w":
            case "ArrowUp":
                movUp = false;
                break;
            
            case "a":
            case "ArrowLeft":
                movLeft = false;
                break;
            
            case "d":
            case "ArrowRight":
                movRight = false;
                break;
            
            case "s":
            case "ArrowDown":
                movDown = false;
                break;
        }
    },false);

    function update() {
        if (movLeft && !movRight) {
            personagem.x -= personagem.velocidade;
        }
        
        if (movRight && !movLeft) {
            personagem.x += personagem.velocidade;
        }

        if (movUp && !movDown) {
            personagem.y -= personagem.velocidade;
        }

        if (movDown && !movUp) {
            personagem.y += personagem.velocidade;
        }

        if (personagem.x > cam.frontRight()) {
            cam.x = personagem.x - (cam.width / 100) * 75;
        }

        if (personagem.x < cam.frontLeft()) {
            cam.x = personagem.x - (cam.width / 100) * 25;
        }

        if (personagem.y > cam.frontUp()) {
            cam.y = personagem.y - (cam.height / 100) * 75;
        }
        
        if (personagem.y < cam.frontDown()) {
            cam.y = personagem.y - (cam.height / 100) * 25;
        }
        
        for (const i in paredes) {
            parede = paredes[i];
            blockRetangulo(personagem, parede);
        }

        for (const i in chegada) {
            verificaChegada(personagem, chegada);
        }
    }

    function telaInicio() {
        
        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(0, 0, 640, 640);
        
        ctx.fillStyle = "white";

        ctx.font = mainFont;
        ctx.fillText('Labirinto-jogo', 140, 100);
        
        ctx.font = smallFont;
        ctx.fillText('para mover o personagem precione:', 90, 230);
        
        ctx.fillText('W', 310, 290);
        ctx.fillText('A', 260, 340);
        ctx.fillText('S', 315, 340);
        ctx.fillText('D', 370, 340);
        
        ctx.fillRect(0, 400, 640, 140);
        
        ctx.fillStyle = "#F03A47";

        ctx.font = font;
        ctx.fillText('Instrução', 250, 190);
        
        ctx.font = mainFont;
        ctx.fillText('Clique para começar', 70, 480);
    }

    function telaFimJogo() {
        
        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(0, 0, 640, 640);
        
        ctx.fillStyle = "white";

        ctx.font = mainFont;
        ctx.fillText('Labirinto-jogo', 140, 100);

        ctx.font = font;
        ctx.fillText('FIM DE JOGO', 210, 250);
        
        ctx.font = smallFont;
        ctx.fillText('Criado por Gustavo Sachetto', 120, 600);
        
        ctx.fillStyle = "#F03A47";

        ctx.font = mainFont;
        ctx.fillText('Obrigado por jogar!', 70, 380);
    }

    
    function render() {
        ctx.clearRect(0, 0, cnv.width, cnv.height);
        ctx.save();
        ctx.translate(-cam.x, -cam.y);
        ctx.fillStyle = "#1a1a1a";
        for (const linha in cenario) {
            for (const coluna in cenario[linha]) {
                var elemento = cenario[linha][coluna];
                
                if (elemento === 1) {
                    var x = coluna * pixel;
                    var y = linha * pixel;
                    ctx.fillRect(x,y,pixel,pixel);
                } else if (elemento === 2) {
                    var x = coluna * pixel;
                    var y = linha * pixel;
                    ctx.drawImage(
                        img,
                        elemento,
                        0,
                        dimensoesImg,
                        dimensoesImg,
                        x,y,pixel,pixel
                    );
                }
            }
        }
        
        ctx.fillStyle = "#F03A47";
        ctx.fillRect(personagem.x, personagem.y, personagem.width, personagem.height);
        ctx.restore();
    }

    
    function loop() {
        update();
        render();
        requestAnimationFrame(loop, cnv);
        if (fimJogo === true) {
            telaFimJogo();
        }
    }

    window.addEventListener('click', function () {
        inicioJogo();
    });
    
    function inicioJogo() {
        requestAnimationFrame(loop, cnv);
    }

    telaInicio();
     
}());
