"use strict";
var declareRand = function () { return Math.floor((Math.random() * 45) + 1); }
var Score = 0;
var lock = true;
var TimeOut =2;
var isStart = false;
var isGameOver = false;
var timeInterval;


window.PhaserDemo.state.menu = {

	preload: function(){
	    this.game.load.audio('bgm', ['assets/Music/CatAstroPhi_shmup_normal.wav']);
	    this.game.load.audio('correct', ['assets/Music/p-ping.mp3']);
	    this.game.load.audio('wrong', ['assets/Music/WrongBuzzer.wav']);
	    this.BlackGroup = mt.create("BlackGroup");
	    this.game.load.image('startbtn', 'assets/Objects/StartGam1.png');
	    
	},
	create: function(){
		// you can create menu group in map editor and load it like this:
	    // mt.create("menu");
	    //Loading  
	    this.game.load.onLoadStart.add(this.loadStart, this);
	    this.game.load.onFileComplete.add(this.fileComplete, this);
	    this.game.load.onLoadComplete.add(this.loadComplete, this);
	    this.button = this.game.add.button(this.game.world.centerX -150, this.game.world.centerY, 'startbtn', 
            function () {
                this.game.load.start();
            }
            , this);

	  

	},
	loadStart: function () {
	    this.LoadingText = this.game.add.text(this.game.world.centerX - 90, this.game.world.centerY - 50, ' Loading ... ', { fontSize: '52px', fill: '#FFFF33' })
	    this.button.visible = false;
	},
	fileComplete: function (progress, cacheKey, success, totalLoaded, totalFiles) {
	    this.LoadingText.text = progress + ' %';
	},
	loadComplete: function () {
        //Ojbect Load Complete
	    //init Physics System
	    // this.game.physics.startSystem(Phaser.Physics.P2JS);
	    //init Scene All Objects
	    this.LoadingText.visible = false;

	    this.Instruction = mt.create("Instrulction");
	    this.ScoreText = this.game.add.text(40, 40, 'Score: 0', { fontSize: '52px', fill: '#FFFF33' });
	    this.TimeText = this.game.add.text(200, 40, 'Time: ' + TimeOut, { fontSize: '52px', fill: '#FFFF33' });
	    this.arrow_up = mt.create("arrow_up");
	    this.QuestionText = mt.create("Text");
	    //Blue Box sequence need re order 
	    this.Box_Blue1 = mt.create("Box_Blue");
	    this.Box_Blue2 = mt.create("Box_Blue1");
	    this.Box_Blue = mt.create("Box_Blue2");
	    this.Text1 = mt.create("Text1");
	    this.Text2 = mt.create("Text2");
	    this.Text3 = mt.create("Text3");

	    this.Box_Blue.name = "0";
	    this.Box_Blue1.name = "1";
	    this.Box_Blue2.name = "2";

	    this.Box_Blue.animations.add('Click', [0, 1, 0, 1, 0, 1, 0], 10, false);
	    this.Box_Blue1.animations.add('Click', [0, 1, 0, 1, 0, 1, 0], 10, false);
	    this.Box_Blue2.animations.add('Click', [0, 1, 0, 1, 0, 1, 0], 10, false);


	    this.Box_Blue.inputEnabled = true;
	    this.Box_Blue1.inputEnabled = true;
	    this.Box_Blue2.inputEnabled = true;
	    //Init Answer OnClick Event For Mobile
	    this.Box_Blue.events.onInputDown.add(MobilecheckAnswer, this);
	    this.Box_Blue1.events.onInputDown.add(MobilecheckAnswer, this);
	    this.Box_Blue2.events.onInputDown.add(MobilecheckAnswer, this);

	    //Sound Button
	    this.SoundOn = mt.create('soundOn');
	    this.SoundOff = mt.create('soundOff');
	    this.SoundOn.inputEnabled = true;
	    this.SoundOff.inputEnabled = true;

	    this.SoundOff.visible = false;

	    this.SoundOn.events.onInputDown.add(function () {
	        content.music.stop();
	        content.SoundOn.visible = false;
	        content.SoundOff.visible = true;
	    }, this);
	    this.SoundOff.events.onInputDown.add(function () {
	        content.music.play();
	        content.SoundOff.visible = false;
	        content.SoundOn.visible = true;
	    }, this);

	    //Enable physics  at arrow_up
	    // this.game.physics.arcade.enable(this.arrow_up);
	    //  this.game.physics.p2.enable(this.arrow_up);
	    //Init Choose Position Object
	    this.ObjIndex = {
	        index: 0
	    };
	    //Init Answer Position
	    this.box_X_velocity = [200, 453, 678];
	    this.Question = {
	        x: '',
	        y: '',
	        operator: '',
	        QText: '',
	        QAnswer: ''
	    };
	    //Init FirstQuestion
	    randomQ(this.Question);
	    //init AnswerList 
	    this.AnsList = [this.Text1, this.Text2, this.Text3];
	    this.BoxList = [this.Box_Blue, this.Box_Blue1, this.Box_Blue2];
	    //initKeyboard
	    this.game.input.keyboard.onDownCallback = this.keydown;

	    //initMusic
	    this.music = this.game.add.audio('bgm', 1, true);
	    this.correct = this.game.add.audio('correct', 1);
	    this.wrong = this.game.add.audio('wrong', 1);
	    this.music.play();

        //initSound

	},
	update: function () {

	},
	keydown: function (e) {

	    //TODO: IF User Get More 3 Hits will Add Game Time 1 Second;

        //Restful Testing
	    //jQuery.ajax(
        //    'http://gtwhome.no-ip.biz/API/api'
        //   , {
        //       type:'GET',
        //       crossDomain: true,
        //       data: '{id:1}',
        //       dataType: 'json',
        //       contentType: "application/json; charset=utf-8",
        //       error: function (e) { console.log('error'); },
        //       success: function (e) { console.log('success');}
        //    }
	    //);

	    //jQuery.ajax(
	    //    'http://gtwhome.no-ip.biz/API/api/values/1'
	    //   , {
	    //       type:'GET',
	    //       crossDomain: true,
	    //       data: '',
	    //       dataType: 'json',
	    //       contentType: "application/json; charset=utf-8",
	    //       error: function (e) { console.log('error'); },
	    //       success: function (e) {
	    //           console.log('success');
	    //           console.log(e);
	    //       }
	    //    }
	    //);

	  
        //When User Press Key
	    if (!isStart && !isGameOver) {
	        StartGame();
	    }
	     if (isStart) {
                    //When User Press Left 
	                if (e.keyCode == 37) {
	                    content.ObjIndex.index--
	                    content.arrow_up.x = content.box_X_velocity[checkindex(content.ObjIndex)];
	                }
	                //When User Press Right 
	                else if (e.keyCode == 39) {
	                    content.ObjIndex.index++
	                    content.arrow_up.x = content.box_X_velocity[checkindex(content.ObjIndex)];
	                }
	                //When User Press UP or spaces 
	                if ((e.keyCode == 32 || e.keyCode == 38) && lock) {
	                    lock = false;
	                    content.BoxList[content.ObjIndex.index].play('Click');
	                  
                        //maybe can merger Desktop & Mobile
	                    if (content.Question.QAnswer == content.AnsList[content.ObjIndex.index].text) {
	                        AnsRight();
	                    } else {
	                        AnsWrong();
	                    }
	                }
	    } //Game isStart 
	}
};

//Gloab Scope put this , content is initializer  finished
var content = window.PhaserDemo.state.menu;
function StartGame() {
   
    //StartGameTime 
    if(!isStart){
        timeInterval = setInterval(function () {
            TimeOut--;
            if (TimeOut == 0) {
                isStart = false;
                isGameOver = true;
                clearInterval(timeInterval);
                GameOver();
            };
            content.TimeText.text = 'Time: ' + TimeOut;
        }, 1000);
    }
    isStart = true;
}
function GameOver() {
    
    content.game.add.text(content.game.world.centerX-350 , content.game.world.centerY-100, ' GameOver ', { font: 'bold 90pt Arial', fill: '#FFFF33' });

    //Remove or Hide Object 
    content.music.stop();
    content.Instruction.destroy()
    content.arrow_up.destroy()
    content.QuestionText.destroy()
    //Blue Box sequence need re order 
    content.Box_Blue1.destroy()
    content.Box_Blue2.destroy()
    content.Box_Blue.destroy()
    content.Text1.destroy()
    content.Text2.destroy()
    content.Text3.destroy()

}
function MobilecheckAnswer(sprite, pointer) {

    //When User Press Key
    if (!isStart && !isGameOver) {
        StartGame();
    }
    if (!isGameOver) {
        if (lock) {
            var Touchindex = parseInt(sprite.name, 10);
            lock = false;
            content.arrow_up.x = content.box_X_velocity[Touchindex];
            content.BoxList[Touchindex].play('Click');
            if (content.Question.QAnswer == content.AnsList[Touchindex].text) {
                AnsRight();
            } else {
                AnsWrong();
            }
        }
    }
}
function showCorrectAnswer() {
    content.QuestionText.text = 'Q: ' + content.Question.x + '  ' + content.Question.operator + '  ' + content.Question.y + ' = ' + content.Question.QAnswer;
}
function AnsRight() {
    content.accept = mt.create("accept");
    Score += 10;
    content.ScoreText.text = 'Score : ' + Score;
    content.correct.play();
    showCorrectAnswer();
    setTimeout(function () {
        content.accept.kill(); randomQ(content.Question);
        lock = true;
    }, 1000);
}
function AnsWrong() {
    content.deny = mt.create("deny")
    content.wrong.play();
    showCorrectAnswer();
    setTimeout(function () {
        content.deny.kill();
        randomQ(content.Question);
        lock = true;

    }, 1000);
}
//This is check user move a arrow always in  [0,1,2] three Answers 
function checkindex(Obji) {
    if (Obji.index == 3) {
        Obji.index = 0;
    }
    else if (Obji.index == -1) {
        Obji.index = 2;
    }
    return Obji.index;
}
//Generator random Question 
function randomQ(Question) {

    var x = declareRand();
    var y = declareRand();
    var ans = 0;
    var Qtxt = '';
    var operator = ['+', '-', '/', '*'];
    var rand = Math.floor((Math.random() * 2) + 0);
    
    switch (rand) {
        case 0:
            ans = x + y;
            break;
        case 1:
            x = declareRand();
            //Limit Y always  low X 
            y = Math.floor((Math.random() * x) + 1);
            ans = x - y;
            break;
        case 2:
            ans = x * y;
            break;
        case 3:
            ans = x / y;
            break;
    }

    Qtxt = 'Q: ' + x + '  ' + operator[rand] + '  ' + y + ' = ?';
    Question.x = x;
    Question.y = y;
    Question.operator = operator[rand];
    Question.QText = Qtxt;
    Question.QAnswer = ans;

    content.QuestionText.text = content.Question.QText;

    //Rand Answer
    var Ans = [content.Text1, content.Text2, content.Text3];
    var count = Ans.length;

    for (var i = 0; i < count; i++) {
        if (Ans.length != 1) {
            var rand = Math.floor((Math.random() * Ans.length) + 0);
            Ans[rand].text = declareRand();
            Ans.splice(rand, 1);
        } else {
            Ans[0].text = content.Question.QAnswer;
            Ans.splice(0, 1);
        }
    }
}