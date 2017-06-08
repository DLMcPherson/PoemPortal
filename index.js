"use strict"

// Setup the renderer
var renderer = PIXI.autoDetectRenderer(640, 640)
renderer.backgroundColor = 0xffffff
renderer.roundPixels = true

// Connect to my Firebase
var firebase = new Firebase("https://readtimer-81ad0.firebaseio.com")
var firstbase = [];

// ===================== SETUP SCREENS ================== //

// Standard Screen
var stage = new PIXI.Container()
  // Graphics object for lines and squares and such...
var graphics = new PIXI.Graphics();
stage.addChild(graphics)
  // Text
var instr1 = new PIXI.Text('1: Paragraph',{font : '12px Gill Sans', fill : 0x077f4d});
instr1.x = 0
instr1.y = 50
stage.addChild(instr1)
var instr2 = new PIXI.Text('2: Reflection',{font : '12px Gill Sans', fill : 0x077f4d});
instr2.x = 200
instr2.y = 50
stage.addChild(instr2)
var instr3 = new PIXI.Text('3: Equation',{font : '12px Gill Sans', fill : 0x077f4d});
instr3.x = 400
instr3.y = 50
stage.addChild(instr3)
 // Timer
var timer = new PIXI.Text('0',{font : '30px Gill Sans', fill : 0xcf4c34, align: 'center'})
timer.x = 200
timer.y = 0
stage.addChild(timer)
 // Top Speeds
var highscore1 = 1000000;
var top1 = new PIXI.Text('NA',{font : '24px Gill Sans', fill : 0x077f4d});
top1.x = 0
top1.y = 0
stage.addChild(top1)
var highscore2 = 1000000;
var top2 = new PIXI.Text('NA',{font : '24px Gill Sans', fill : 0x077f4d});
top2.x = 200
top2.y = 0
//stage.addChild(top2)
var highscore3 = 1000000;
var top3 = new PIXI.Text('NA',{font : '24px Gill Sans', fill : 0x077f4d});
top3.x = 400
top3.y = 0
stage.addChild(top3)

// Render Loop
var scoreVal = 0
var clock =  0 ;
var now = Date.now()
var start = Date.now()

//
class Stamp{
  constructor(time, type){
    this.duration = time;
    this.type = type;
  }
};


var scores = [];
var record = [];
var go = 0

window.setInterval(function() {
  if(go == 1){
    // Time management
    clock += Date.now() - now
    now = Date.now()
    console.log(clock)
    // Update the Timer display
    timer.text = (clock/1000).toFixed(0)
  }
  // Render the stage
  renderer.render(stage)
},100)

// Keyboard Listener Loop
var key = null
var correctP = 0
var correctQ = 0
document.addEventListener("keydown",function(event) {
  // Log time and key
  key = event.keyCode
  console.log(clock,key)
  // Record time and key to Firebase
  if((key==49 || key==50 || key==51) && go == 1){
    // Type labels
    var Typer = "Paragraph"
    if(key==49){
      if(clock<highscore1){
        highscore1=clock
        top1.text = (clock/1000).toFixed(2)
      }
      Typer = "Paragraph"
    }
    if(key==50){
      if(clock<highscore2){
        highscore2=clock
        top2.text = (clock/1000).toFixed(2)
      }
      Typer = "Reflection"
    }
    if(key==51){
      if(clock<highscore3){
        highscore3=clock
        top3.text = (clock/1000).toFixed(2)
      }
      Typer = "Equation"
    }
    // Report
    firstbase.push({
      type : Typer,
      time : clock,
      date : Date.now(),
      ip : userip,
      keystroke : key,
    })
    // Push to session scoreboard array
    var click = new Stamp(clock,Typer)
    var label = new PIXI.Text(Typer.concat(": ",(clock/1000).toFixed(2)),{font : '12px Gill Sans', fill : 0x077f4d});
    label.x = 200
    label.y = 150
    click.label = label
    // Display label and move others down
    stage.addChild(label)
    for(var i = 0; i<scores.length; i++){
      scores[i].label.y += 20
    }
    scores.push(click)
    record.push(new Stamp(clock,Typer))
    // Clean your clock
    clock = 0;
  }
  // Fire the starting pistol
  if(go == 0 && key == 13){
    go = 1;
    now = Date.now()
    start = Date.now()
  }
  // End
})

window.onbeforeunload = sendData;
function sendData(){
  var title = document.getElementById("myText").value;
  if(title != "Title; a Semiotic Exploration of Declared Identity"){
    firebase.push({sprints : record,
      ip : userip,
      filename : title,
      begin : start,
    })
  }
}

// Wrap it up
var mount = document.getElementById("mount")
mount.insertBefore(renderer.view, mount.firstChild)
