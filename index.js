"use strict"

var IntervalBegins = [45512,44259,44623,44603,44991,45113,43725,43743,46775,54729]
var IntervalLength = [56,18,31,6,13,35,11,38,12,7]

function poemNumGetStraight(index){
  var base = 0;

  for (var i = 0; i < IntervalBegins.length; i++) {
    if(index-base < IntervalLength[i]){
      return(IntervalBegins[i] + (index-base) )
    }
    base += IntervalLength[i];
  }
}

var poemNum = 45512;
var dayIndex = (Math.round(Date.now() / (24.0*3600000.0)) *11)% 228
var poemNum = poemNumGetStraight(dayIndex)

window.location.replace("https://www.poetryfoundation.org/poems/" + poemNum);
