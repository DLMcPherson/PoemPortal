"use strict"

// Setup the renderer
var renderer = PIXI.autoDetectRenderer(640, 640)
renderer.backgroundColor = 0xffffff
renderer.roundPixels = true

// Connect to my Firebase
var firebase = new Firebase("https://readtimer-81ad0.firebaseio.com")

// ===================== SETUP SCREENS ================== //

// Standard Screen
var stage = new PIXI.Container()
  // Graphics object for lines and squares and such...
var graphics = new PIXI.Graphics();
stage.addChild(graphics)
  // Text
var instr1 = new PIXI.Text('Q: Paragraph',{font : '12px Gill Sans', fill : 0x077f4d});
instr1.x = 0
instr1.y = 500
stage.addChild(instr1)
var instr2 = new PIXI.Text('W: Reflection',{font : '12px Gill Sans', fill : 0x077f4d});
instr2.x = 200
instr2.y = 500
stage.addChild(instr2)
var instr3 = new PIXI.Text('E: Equation',{font : '12px Gill Sans', fill : 0x077f4d});
instr3.x = 400
instr3.y = 500
stage.addChild(instr3)
var timer = new PIXI.Text('0',{font : '24px Gill Sans', fill : 0x077f4d})
timer.x = 200
timer.y = 0
stage.addChild(timer)

// Globals
var PauseTime = 10
var tick = 0
var traj = 0
var modeExit = PauseTime

// Render Loop
var scoreVal = 0
var clock =  0 ; var now = Date.now()
var start = Date.now()

//
class Stamp{
  constructor(time, type){
    this.duration = time;
    this.type = type;
  }
};


var scores = [];

window.setInterval(function() {
  // Time management
  clock += Date.now() - now
  now = Date.now()
  console.log(clock)
  // Update the Timer display
  timer.text = (clock/1000).toFixed(1)
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
  console.log(clock,tick,key)
  // Record time and key to Firebase
  if(key==81 || key==87 || key==69){
    // Type labels
    var Typer = "Paragraph"
    if(key==87){
      Typer = "Reflection"
    }
    if(key==69){
      Typer = "Equation"
    }
    // Report
    firebase.push({
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
    label.y = 100
    click.label = label
    // Display label and move others down
    stage.addChild(label)
    for(var i = 0; i<scores.length; i++){
      scores[i].label.y += 20
    }
    scores.push(click)
    // Clean your clock
    clock = 0;
  }
  // End
})


// Wrap it up
var mount = document.getElementById("mount")
mount.insertBefore(renderer.view, mount.firstChild)
