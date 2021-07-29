function start_game()
{
    var canvas=document.getElementById("mycanvas");
    document.getElementById("start_button").blur();
    var ctx=canvas.getContext("2d");
                
    var userimages=[];
    var userimagesURL=["./images/user1.png","./images/user2.png","./images/user3.png","./images/user4.png","./images/user5.png","./images/user6.png"];
    for(var i=0;i<userimagesURL.length;i++)
    {
        var image=new Image();
        image.src=userimagesURL[i];
        userimages.push(image);
    }
    var user={};
    user.images=userimages;
    user.width=100;
    user.height=100;
    user.x=270;
    user.y=400;
    user.speed=5;

    var keyMap = {};
    keyMap[38]	= { name :"up",		active:false , onactive: function() { user.y-=user.speed; } };
    keyMap[40]	= { name :"down",	active:false , onactive: function() { user.y+=user.speed; } };
    keyMap[37]	= { name :"left",	active:false , onactive: function() { user.x-=user.speed; } };
    keyMap[39]	= { name :"right",	active:false , onactive: function() { user.x+=user.speed; } };
    keyMap[32]	= { name :"space", 	active:false , onactive: function() {   if(new Date().getTime() - lastFireAt > 300) 
                                                                            { 
                                                                                lastFireAt = new Date().getTime() ; 
                                                                                addFire(user.x,user.y); 
                                                                            } 
                                                                        } };

    var counter=0;
    function drawObject(object)
    {
        var curImgidx=counter%(object.images.length);
        var curImage=object.images[curImgidx];
        ctx.drawImage(curImage,object.x,object.y,object.width,object.height);
    }

    var WIDTH = 700;
    var HEIGHT = 520;

    var fires = [];	
    var lastFireAt = new Date().getTime();
    var fireImage = new Image(); 
    fireImage.src = ["./images/fire.png"];
    function addFire(x,y)
    {
        var fire = {};
        fire.images = [fireImage];
        fire.x = x+45;
        fire.y = y;
        fire.width = 10;
        fire.height = 10;
        fire.speedX = 0;
        fire.speedY = -7;
        fire.active = true;			
        fire.move = function(){
            this.y += this.speedY; 
            if( this.y <= 0 )
                this.active = false;
        }
        fires.push(fire);
    }

    function drawAndMoveFires()
    {
        var temp = [];
        for(var i=0;i<fires.length;i++)
        {
            fires[i].move();
            drawObject(fires[i]);				
            if(fires[i].active)             // Only add active fires
                temp.push(fires[i]);
        }
        fires = temp;
    }

    var bullets = [];	
    var bulletImage1 = new Image(); 
    bulletImage1.src = ["./images/bullet1.gif"];
    var bulletImage2 = new Image(); 
    bulletImage2.src = ["./images/bullet2.gif"];

    function addBullet(x,y)
    {
        var bullet = {};
        bullet.images = [bulletImage1,bulletImage2];
        bullet.x = x+10;
        bullet.y = y;
        bullet.width = 45;
        bullet.height = 45;
        bullet.speedX = 0;
        bullet.speedY = 6;
        bullet.active = true;			
        bullet.move = function(){
            this.y += this.speedY; 
            if( this.y >= HEIGHT ){
                this.active = false;
            }
        }
        bullets.push(bullet);
    }

    function drawAndMoveBullets()
    {
        var temp = [];
        for(var i=0;i<bullets.length;i++)
        {
            bullets[i].move();
            drawObject(bullets[i]);				
            if(bullets[i].active)               // Only add active bullets
            {
                temp.push(bullets[i]);
            }
        }
        bullets = temp;
    }

    var ships = [];
    var shipImages = [];
    var shipUrls = ["./images/ship1.png","./images/ship2.png","./images/ship3.png","./images/ship4.png","./images/ship5.png","./images/ship6.png"];

    for(var i=0;i<shipUrls.length;i++)
    {
        var shipImage = new Image();
        shipImage.src = shipUrls[i];
        shipImages.push(shipImage);
    }

    for(var i=0;i<6;i++)
    {
        var ship = {};
        ship.images = shipImages;
        ship.x = (Math.random()*100000)%WIDTH;
        ship.y = 0;
        ship.width = 70;
        ship.height = 70;
        ship.speedX = 1 + Math.random()*3;
        ship.speedY = 0.7;

        ship.move = function(){
            if( this.x+this.width >= WIDTH && this.speedX >0 )
            {
                this.speedX = - this.speedX;        // now move in left
            }
            if( this.x <=0 && this.speedX < 0 )
            {
                this.speedX = - this.speedX;        // now move in right
            }
            this.x += this.speedX;
            this.y += this.speedY;
            if(this.y>=600) 
                this.y = -50;                       // Reappear
        }
        ship.fireBullet = function(){
        if(Math.random()<0.01)
            addBullet(this.x,this.y);
        }
        ships.push(ship);			
    }

    function handleKey(event, status)
    {
        var currentController = keyMap[event.keyCode];
        //console.log(status);
        if(currentController)
        {
            currentController.active = status;
        }
    }

    var audio = new Audio('./media/Overture-the-grand-score-main-theme.mp3');
    audio.addEventListener('ended', function() {
                                                    this.currentTime = 0;
                                                    this.play();
                                                }, false);
    audio.play();

    document.addEventListener("keydown", function(event) { handleKey(event, true); } );
    document.addEventListener("keyup", function(event) { handleKey(event, false); } );

    var score={};
    score.type = "text";
    score.width = "25px";
    score.height =  "Consolas";
    score.x = 550;
    score.y = 30;
    function score_print()
    {
        ctx.font = score.width + " " + score.height;
        ctx.fillStyle = "white" ;
        ctx.fillText(score.text, score.x, score.y);
    }

    var count=0;
    function updates()
    {
        var background = new Image();
        background.src = "./images/background.jpg";
        ctx.drawImage(background,0,0);  
        counter++;
        user.x += -2 + Math.random()*4; 
        user.y += -2 + Math.random()*4;
        for(var key in keyMap)
        {
            if(keyMap[key].active)
                keyMap[key].onactive();
        }
        for(var i=0;i<ships.length;i++)
        {
            drawObject(ships[i]);
            ships[i].move();
            ships[i].fireBullet();				
        }
        if(user.x+user.width >= WIDTH && user.x >0)
            user.x = 600;   
        if(user.x <= 0)
            user.x = 0; 
        if(user.y+user.height >= HEIGHT && user.y >0)
            user.y = 420; 
        if(user.y <= 0)
            user.y = 0; 
        drawObject(user);
        drawAndMoveBullets();
        drawAndMoveFires();

        for(var i=0;i<fires.length;i++)
        {
            var fire=fires[i];
            for(var j=0;j<ships.length;j++)
            {
                var ship=ships[j];
                if((fire.y<=ship.y+ship.height && fire.y+fire.height>=ship.y+(ship.height/2)))
                {
                    if(fire.x+fire.width>=ship.x && fire.x<=ship.x+ship.width)
                    {
                        count++;
                        ship.x = (Math.random()*10000)%WIDTH;
                        ship.y = 0;
                        fire.active=false;
                        ship.speedX = 1 + Math.random()*3;
                    }
                }
            }
        }  
        
        for(var i=0;i<bullets.length;i++)
        {
            var bullet=bullets[i];
            if(bullet.x+bullet.width>=user.x+20 && bullet.x+bullet.width<=user.x+50)
            {
                if((bullet.y+bullet.height>=user.y+(user.height/2)-3)&&(bullet.y+bullet.height<=user.y+(user.height/2)+5))
                {
                    audio.pause();
                    alert("GAME OVER !!!    Your score is: "+count);
                    clearInterval(interval);
                }
            }
            else if(bullet.x+bullet.width>=user.x+50 && bullet.x+bullet.width<=user.x+85)
            {
                if((bullet.y+bullet.height>=user.y+33)&&(bullet.y+bullet.height<=user.y+33+(user.height/2)))
                {
                    audio.pause();
                    alert("GAME OVER !!!    Your score is: "+count);
                    clearInterval(interval);
                }
            }
            else if(bullet.x+bullet.width>=user.x+85 && bullet.x<=user.x+user.width-20)
            {
                if((bullet.y+bullet.height>=user.y+(user.height/2)-3)&&(bullet.y+bullet.height<=user.y+(user.height/2)+5))
                {
                    audio.pause();
                    alert("GAME OVER !!!    Your score is: "+count);
                    clearInterval(interval);
                }
            }
        }            
        score.text="Score: " + count;
        score_print();
    }
    var interval = setInterval(updates,40);
}