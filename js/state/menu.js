"use strict";
var declareRand = function () { return Math.floor((Math.random() * 45) + 1); }

    var Score = 0;
    var lock = true;
    var TimeOut =60;
    var isStart = false;
    var isGameOver = false;
    var timeInterval;
    var arrowLoop;
    //FontSize
    var OriginalSize=90;
    var QNum = 90;
    var ANum = 50;
    var ScoreNum = 20;
    var FonType = {
        QNum: 'QNum',
        ANum: 'ANum',
        ScoreNum:'ScoreNum'
    }
    var TotalQ = 0;
    var CorrectQ = 0;
   // Neo + lunchbox
    var GameName = 'N¡Dunchbox'
window.PhaserDemo.state.menu = {

    preload: function () {

	    this.game.load.audio('bgm', ['assets/Music/CatAstroPhi_shmup_normal.wav']);
	    this.game.load.audio('correct', ['assets/Music/p-ping.mp3']);
	    this.game.load.audio('wrong', ['assets/Music/WrongBuzzer.wav']);
	    this.game.load.audio('Alarm', ['assets/Music/Alarm.wav']);
	    this.game.load.audio('end', ['assets/Music/End.wav']);

	    this.BlackGroup = mt.create("BlackGroup");
	    this.game.load.image('startbtn', 'assets/Objects/StartGam1.png');

	    this.game.load.spritesheet('Num', 'assets/Objects/hackerNum.png', OriginalSize, OriginalSize);

	    this.game.load.spritesheet('backbtn', 'assets/Objects/restart.png', 150, 150);
	    
	},
	create: function(){
		// you can create menu group in map editor and load it like this:
	    // mt.create("menu");
	    //Loading  
	    this.game.load.onLoadStart.add(this.loadStart, this);
	    this.game.load.onFileComplete.add(this.fileComplete, this);
	    this.game.load.onLoadComplete.add(this.loadComplete, this);

	    this.GameName = this.game.add.text((content.game.world.centerX/2 )-100, content.game.world.centerY - 200, ' N', { font: 'bold 90pt Arial', fill: '#00FF00' });
	    this.GameName2 = this.game.add.text((content.game.world.centerX / 2) - 20, content.game.world.centerY - 200, ' ¡D', { font: 'bold 90pt Arial', fill: '#CC0000' });
	    this.GameName3 = this.game.add.text((content.game.world.centerX /2)+50, content.game.world.centerY - 200, 'unchbox', { font: 'bold 90pt Arial', fill: '#EE7700' });
	    console.log(this.GameName2.text);
	    this.button = this.game.add.button(this.game.world.centerX -150, this.game.world.centerY, 'startbtn', 
            function () {
                this.game.load.start();
            }
            , this);

	  

	},
	loadStart: function () {
	    this.LoadingText = this.game.add.text(this.game.world.centerX - 90, this.game.world.centerY - 50, ' Loading ... ', { fontSize: '52px', fill: '#FFFF33' })
	    this.button.visible = false;
	    this.GameName.visible = false;
	    this.GameName2.visible = false;
	    this.GameName3.visible = false;
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

        //TODO: Add arrow Animation
	 

	    this.QuestionText = mt.create("Text");
	    //Blue Box sequence need re order 
	    this.Box_Blue = mt.create("bulb_on_off");
	    this.Box_Blue1 = mt.create("bulb_on_off1");
	    this.Box_Blue2 = mt.create("bulb_on_off2");
	  

	    this.Box_Blue.name = "0";
	    this.Box_Blue1.name = "1";
	    this.Box_Blue2.name = "2";

	    this.Box_Blue.animations.add('Wrong', [0, 1, 0, 1, 0, 1], 10, false);
	    this.Box_Blue1.animations.add('Wrong', [0, 1, 0, 1, 0, 1,], 10, false);
	    this.Box_Blue2.animations.add('Wrong', [0, 1, 0, 1, 0, 1], 10, false);

	    this.Box_Blue.animations.add('Right', [0, 1, 0, 1, 0, 1, 0], 10, false);
	    this.Box_Blue1.animations.add('Right', [0, 1, 0, 1, 0, 1, 0], 10, false);
	    this.Box_Blue2.animations.add('Right', [0, 1, 0, 1, 0, 1, 0], 10, false);

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
	    this.box_X_velocity = [179, 445, 701];
	    this.Question = {
	        x: '',
	        y: '',
	        operator: '',
	        QText: '',
	        QAnswer: ''
	    };
	   
	    ////init AnswerList 
	    this.AnsList = ['0','0','0'];
	    this.BoxList = [this.Box_Blue, this.Box_Blue1, this.Box_Blue2];
	    //initKeyboard
	    this.game.input.keyboard.onDownCallback = this.keydown;

	    ////initMusic
	    this.music = this.game.add.audio('bgm', 1, true);
	    this.correct = this.game.add.audio('correct', 1);
	    this.wrong = this.game.add.audio('wrong', 1);
	    this.alarm = this.game.add.audio('Alarm', 1);
	    this.end = this.game.add.audio('end', 1);
	    this.music.play();
      //TODO:Add GameOver Effect Sound


	    //Init NumGroup 
	    this.QnumGroup = this.game.add.group();
	    this.AnumGroup = this.game.add.group();
	    this.SnumGroup = this.game.add.group();
	    //Init FirstQuestion
	    randomQ(this.Question);
	 

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
	    if (isStart && !isGameOver) {
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
	                  
                        //maybe can merger Desktop & Mobile
	                    if (content.Question.QAnswer == content.AnsList[content.ObjIndex.index]) {
	                        content.BoxList[content.ObjIndex.index].play('Right');
	                        AnsRight();
	                    } else {
	                        content.BoxList[content.ObjIndex.index].play('Wrong');
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
            if(TimeOut>0)
            TimeOut--;
            content.TimeText.text = 'Time: ' + TimeOut;
            //Warnning User Last Time
            if (TimeOut == 10) {
                content.alarm.play();
            }
            if (TimeOut == 0) {
                isStart = false;
                isGameOver = true;
                clearInterval(timeInterval);
                GameOver();
            };
        }, 1000);
    }
    isStart = true;
}
function GameOver() {
    


    var Endtxt = content.game.add.text(content.game.world.centerX - 350, content.game.world.centerY + 100, ' GameOver ', { font: 'bold 90pt Arial', fill: '#FFFF33' });
    var Percen = content.game.add.text((content.game.world.centerX / 2) - 200, content.game.world.centerY - 200, ' Great! Your Correct ' + CorrectQ + '/' + TotalQ + ' ' + Math.floor((CorrectQ / TotalQ) * 100) + '% Hits', { font: 'bold 37pt Arial', fill: '#FFFF33' });
    var back =  content.game.add.sprite(content.game.world.centerX/2, content.game.world.centerY-100 , 'backbtn', 0);
    var restart = content.game.add.sprite((content.game.world.centerX / 2) + 200, content.game.world.centerY - 100, 'backbtn', 1);

    back.inputEnabled = true;
    restart.inputEnabled = true;

    back.events.onInputDown.add(function () {
        console.log('I Back !');
    }, content);
    restart.events.onInputDown.add(function () {
        setTimeout(function () {
            lock = true;
            isStart = false;
            isGameOver = false;
            TimeOut = 3;
            Score = 0;
            timeInterval;
            arrowLoop;
            TotalQ = 0;
            CorrectQ = 0;

            content.loadComplete();
            back.destroy();
            Endtxt.destroy();
            Percen.destroy();
            restart.destroy();
           // back.visible = false;
            //restart.visible = false;

        }, 1000);
    }, content);

    content.end.play();
    //Remove or Hide Object 
    content.ScoreText.destroy();
    content.TimeText.destroy();
    content.music.stop();
    content.Instruction.destroy();
    content.arrow_up.destroy();
    content.QuestionText.destroy();
    //Blue Box sequence need re order 
    content.Box_Blue1.destroy();
    content.Box_Blue2.destroy();
    content.Box_Blue.destroy();

    content.AnumGroup.removeAll();
    content.QnumGroup.removeAll();
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
            if (content.Question.QAnswer == content.AnsList[Touchindex]) {
                AnsRight();
            } else {
                AnsWrong();
            }
        }
    }
}


function showCorrectAnswer() {

    //content.QuestionText.text = 'Q: ' + content.Question.x + '  ' + content.Question.operator + '  ' + content.Question.y + ' = ' + content.Question.QAnswer;
    content.QuestionText.text = 'Q: ' + '       ' + content.Question.operator + '       = '
    var splistr = content.Question.QAnswer.toString().split('');
    var QtxtX = content.QuestionText.x;
    var QtxtY = content.QuestionText.y;

    if (splistr.length > 1) {
        AddNum(splistr[0].toString(), QtxtX + 630, QtxtY, FonType.QNum, content.QnumGroup);
        AddNum(splistr[1].toString(), QtxtX + 700, QtxtY, FonType.QNum, content.QnumGroup);
    } else {
        AddNum(splistr[0].toString(), QtxtX + 630, QtxtY, FonType.QNum, content.QnumGroup);
    }

}
function AnsRight() {
    CorrectQ += 1;
    TimeOut += 2;
    content.accept = mt.create("accept");
    Score += 10;
    content.ScoreText.text = 'Score : ' + Score;
    content.correct.play();
    showCorrectAnswer();
    setTimeout(function () {
        content.accept.kill();
        lock = true;
        if (!isGameOver) {
            randomQ(content.Question);
        }
    }, 1000);
}
function AnsWrong() {

    if (TimeOut > 1)
     TimeOut -= 1;
    content.deny = mt.create("deny")
    content.wrong.play();
    showCorrectAnswer();
    setTimeout(function () {
        content.deny.kill();
        lock = true;
        if (!isGameOver) {
            randomQ(content.Question);
        }
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
function resetLightAnimation() {
    //reset Light Animation 
    for (var i = 0; i < content.BoxList.length; i++) {
       // console.log();
        content.BoxList[i].animations.frame = 1
    }
}
//Generator random Question 
function randomQ(Question) {

    TotalQ += 1;

    content.AnumGroup.removeAll();
    content.QnumGroup.removeAll();
    resetLightAnimation();

    var x = declareRand();
    var y = declareRand();
    var ans = 0;
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

    Question.x = x;
    Question.y = y;
    Question.operator = operator[rand];
    Question.QText = 'Q: ' + x + '  ' + operator[rand] + '  ' + y + '    = ?';
    Question.QAnswer = ans;

    

    //Rand Answer
    var Ans = [0,1,2];
    var count = Ans.length;
    for (var i = 0; i < count; i++) {
        if (Ans.length != 1) {
            var rand = Math.floor((Math.random() * Ans.length) + 0);
            content.AnsList[Ans[rand]] = declareRand();
            Ans.splice(rand, 1);
        } else {
            content.AnsList[Ans[0]] = content.Question.QAnswer;
            Ans.splice(0, 1);
        }
    }
 
    //setting num on Light 
    ////init AnswerList 
    //this.AnsList = ['0', '0', '0'];
    //this.BoxList = [this.Box_Blue, this.Box_Blue1, this.Box_Blue2];


    for (var i = 0; i < count; i++) {
        //console.log(content.AnsList[i].toString());
        var splitstr = content.AnsList[i].toString().split('');
        var xPosition = content.BoxList[i].x;
        var yPosition = content.BoxList[i].y;
        if (splitstr.length > 1) {
            AddNum(splitstr[0].toString(), xPosition + 50, yPosition + 50, FonType.ANum, content.AnumGroup);
            AddNum(splitstr[1].toString(), xPosition + 80, yPosition + 50, FonType.ANum, content.AnumGroup);
           
        } else {
            AddNum(splitstr[0].toString(), xPosition + 50, yPosition + 50, FonType.ANum, content.AnumGroup);
        }
    }
    ////setting num on QuestionText 
    var QtxtX = content.QuestionText.x;
    var QtxtY = content.QuestionText.y;
    var Xsplitstr = Question.x.toString().split('');
    var Ysplitstr = Question.y.toString().split('');
    if (Xsplitstr.length > 1) {
        AddNum(Xsplitstr[0].toString(), QtxtX + 150, QtxtY , FonType.QNum, content.QnumGroup);
        AddNum(Xsplitstr[1].toString(), QtxtX + 230, QtxtY , FonType.QNum, content.QnumGroup);
    } else {
        AddNum(Xsplitstr[0].toString(), QtxtX + 150, QtxtY, FonType.QNum, content.QnumGroup);
    }

    if (Ysplitstr.length > 1) {
        AddNum(Ysplitstr[0].toString(), QtxtX + 400, QtxtY , FonType.QNum, content.QnumGroup);
        AddNum(Ysplitstr[1].toString(), QtxtX + 470, QtxtY, FonType.QNum, content.QnumGroup);
    } else {
        AddNum(Ysplitstr[0].toString(), QtxtX + 400, QtxtY, FonType.QNum, content.QnumGroup);
    }

    content.QuestionText.text = 'Q: ' + '       ' + Question.operator + '        = ?';

}
function AddNum(num, x, y, type,group) {

    if(!isGameOver){
        if (typeof group === 'undefined') { group = content.game.world; }

        var addsprite = content.game.add.sprite(x, y, 'Num', parseInt(num, 10), group);

        if (type == FonType.ANum) {
            addsprite.scale.x= (ANum/OriginalSize);
            addsprite.scale.y = (ANum / OriginalSize);
        }
        if (type == FonType.QNum) {
            addsprite.scale.x = (QNum / OriginalSize);
            addsprite.scale.y = (QNum / OriginalSize);
        }
        if (type == FonType.ScoreNum) {
            addsprite.scale.x = (ScoreNum / OriginalSize);
            addsprite.scale.y = (ScoreNum / OriginalSize);
        }
  }
    //console.log(content.game);
}