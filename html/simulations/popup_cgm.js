//pop1 
var e = document.getElementById('popupBoxOnePosition');
var close = document.getElementById('closebox1');

document.getElementById('box1').addEventListener('click', function(){
  if(e.style.display == 'block')
    e.style.display = 'none';
  else{
    e.style.display = 'block';
    e.style.transform = 'scale(1.7)';}
});

// When the user clicks on Click here to close modal
close.onclick = function() {
    e.style.display = "none";
}

//pop2 js
var elpopupBoxTwoPosition = document.getElementById('popupBoxTwoPosition');
var closeclosebox2 = document.getElementById('closebox2');

document.getElementById('box2').addEventListener('click', function(){
  if(elpopupBoxTwoPosition.style.display == 'block')
    elpopupBoxTwoPosition.style.display = 'none';
  else{
    elpopupBoxTwoPosition.style.display = 'block';
    elpopupBoxTwoPosition.style.transform = 'scale(1.7)';}
});
  
// When the user clicks on Click here to close modal
closeclosebox2.onclick = function() {
    elpopupBoxTwoPosition.style.display = "none";
}