var GREEN = "green";
var RED = "red";
var ORRANGE = "#b74900";
var score=0;
var epilepsia_score=0;
var special_score = 0;
var epilepsia_mode = false;
var special_mode = false;
var timer;
var interval =1000;
var epilepsia_timer;
var records = [];
var game_is_started=false;

var square_size=30;

var width  ;
var heigth ;
initFirebase();
readRecordBoard();

var provider = new firebase.auth.GoogleAuthProvider();
firebase.auth().signInWithRedirect(provider);
firebase.auth().getRedirectResult().then(function(result) {
  if (result.credential) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // ...
  }
  // The signed-in user info.
  var user = result.user;
}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
});


console.log(firebase.user.displayName());

function initFirebase(){
	 var config = {
    apiKey: "AIzaSyCdjnMExwj_JahV2YJ7KWZiiwpFe8QndV4",
    authDomain: "square-873e4.firebaseapp.com",
    databaseURL: "https://square-873e4.firebaseio.com",
    projectId: "square-873e4",
    storageBucket: "",
    messagingSenderId: "994485175306"
  };
  firebase.initializeApp(config);
}



function readRecordBoard(){

	  firebase.database().ref().once('value').then(function(snapshot) {
	  var username = snapshot.val();
	 

	  for(key in username)
	  	records.push(username[key])
	  records.sort(compare);
	  records= records.filter(function(number,i) {
  		if(i<10) return number;});

	if(records.length<10){
		for(var j = records.length;j<10;j++)
			records.push({
			 	username:"NaN",
			 	score: 0
			 })
	}
	 
	 createTable();

	 ;});

	   
}

function compare(a,b) {
  if (a.score > b.score)
    return -1;
  if (a.score < b.score)
    return 1;
  return 0;
}

function createTable(color_pos){

	var table = document.getElementById("record_table");
	
	if(!color_pos) color_pos=0;

	for(var i=records.length-1;i>=0;i--){
		var row = table.insertRow(0);
		if(i==color_pos)
			row.id = "color_row"; 
		for(var j=0;j<3;j++){
			var cell = row.insertCell(j);
			if(j==0)
				cell.innerHTML=(i+1)+".";

			if(j==1) cell.innerHTML = records[i].username;

			if(j==2) cell.innerHTML = records[i].score;
		}
	}
}


function createSquare(color){
	var element = document.createElement("div");
	element.style.backgroundColor = color;
	element.style.border = "   1px solid black;";
	element.style.height = square_size+"px";
	element.style.width = square_size+"px";
	element.style.position ="absolute";
	element.id ="square";

	var w = window.innerWidth*0.8;
	var h = window.innerHeight*0.8;

	element.style.left = generateCoordinate(w-square_size)+"px";
	element.style.top = generateCoordinate(h-square_size)+"px";
	document.getElementById("field").style.width = w+"px";
	document.getElementById("field").style.height =  h+"px";

	if(color==RED)
		element.addEventListener("click", clickedRed, false); 
	else 
		element.addEventListener("click", missClick, false); 

	document.getElementById("field").appendChild(element);  
}


function generateCoordinate(limit) {
	return Math.floor((Math.random() * limit) + 1);
}

function genereateColor(){
	var letters = '0123456789ABCDEF';
  	var col = '#';
  	for (var i = 0; i < 6; i++)
    	col += letters[Math.floor(Math.random() * 16)];
    return col;
}

function generateField(){

	document.getElementById("field").innerHTML="";

	var ONLY_RED =0;
	var RED_GREEN =1;
	var RED_GREEN_ORANGE =2;
	var WITHOUT_RED = 3;
	var RANDOM_CLOR =4;
	var MANY_ORANGE = 5;

 	var condition =0;

 	if(special_mode)
 		changeBackgroundColor();

	if(score<5){
		condition=0;
		interval=1000;
	}
	
	if(score > 5 && score <=10 ){
		condition = Math.floor((Math.random() * 1));
	}

	if(score >10 && score <=20){
		condition = Math.floor((Math.random() * 2)+1);
		interval = 900;
	}

	if(score > 20 && score <=25){
		condition = Math.floor((Math.random() * 4)+1);
		interval  = 800
	}

	if(score > 25){
		condition = Math.floor((Math.random() * 5)+1);
	}

	switch(condition){

		case ONLY_RED:createSquare(RED);break;
		case RED_GREEN: createSquare(RED);createSquare(GREEN);break;
		case RED_GREEN_ORANGE: 

				var number = Math.floor((Math.random() * 10)+1);
				if(number >2) 
					createSquare(RED);
				createSquare(GREEN);
				createSquare(ORRANGE);
				break;
		
		case WITHOUT_RED:
				var color  = Math.floor((Math.random() * 1));
				if(color==1) color = GREEN;
				else color = ORRANGE;
				createSquare(GREEN);
				break;
		
		case RANDOM_CLOR:
    			createSquare(RED);
 				createSquare(genereateColor());
 				break;

		case MANY_ORANGE:
				var n = Math.floor((Math.random() * 7)+1);
				createSquare(RED);
				for(var i=0;i<n;i++)
					createSquare(ORRANGE);
				break;
	}

	if(score >=10 && !epilepsia_mode && !special_mode){
		var number = Math.floor((Math.random() * 10)+1);
		if(number <=2){
				genereteAdditionalConnditions();
		}
	}
}	

function genereteAdditionalConnditions(){
	var CHANGE_BACK =0;
	var EPILEPSIA = 1;
	var CHNAGE_BACK_ON_CLICK =3;

	var condition = Math.floor((Math.random() * 6));

	switch(condition){
		case CHANGE_BACK:
			changeBackgroundColor();break;
		case EPILEPSIA:
			epilepsia_mode= true;
			epilepsia_timer=setInterval(changeBackgroundColor,100);break;

		case CHNAGE_BACK_ON_CLICK:
			special_mode = true;break;
		default:
			document.getElementById("field").style.backgroundColor="#ccc";break;
	}
}


function changeBackgroundColor(){
	document.getElementById("field").style.backgroundColor=genereateColor();
}

function endEpilepsiaMode(){
	epilepsia_mode = false;
	document.getElementById("field").style.backgroundColor="#ccc";
	clearInterval(epilepsia_timer);
	epilepsia_score=0;
}

function clickedRed(){
	score++;
	document.getElementById("score").innerHTML = "Score :" +score;

	if(epilepsia_mode)  epilepsia_score++;
	if(epilepsia_score>=5) endEpilepsiaMode();

	if(special_mode) {special_score++;}
	if(special_score >10) {special_mode=false; special_score =0;}

	clearInterval(timer);
	generateField();
	timer = setInterval(generateField,interval);
	event.cancelBubble=true;
}

function missClick(){
	
	if(game_is_started){
		
		stopGame();
	}
	
	event.cancelBubble=true;
}


function addRecord(){
	var position;
	var user_name = document.getElementById("name").value;

	firebase.database().ref().push({
			    username: user_name,
			    score: score
			  	});

	var index;
	for(var j=0;j<records.length;j++){
		if(score>records[j].score){
			index=j;break;
		}
	}
	records.splice(index, 0, {
		username:user_name,
		score:score
	});

	records= records.filter(function(number,i) {
  		if(i<10) return number;});

	document.getElementById("record_table").innerHTML="";
	createTable(index);
	document.getElementById("color_row").style.color="#688ecc";
}


function startGame() {

	console.log(document.getElementById("name").value);
	
	if(document.getElementById("name").value){
		var heigth  = window.innerHeight; 
		var width = window.innerWidth;
		game_is_started=true;
		//document.getElementById("start_page").style.display="none";
		document.getElementById("score_start").style.display="none";
		document.getElementById("start_page").style.display="none";
		document.getElementById("field").style.display="block";
		//document.getElementById("name").style.display="none";
		generateField();
		timer = setInterval(generateField,interval);
		event.cancelBubble=true;
	}else {
		document.getElementById("name").style.border = "solid 2px red";
		setTimeout(function(){
			document.getElementById("name").style.border = "solid 2px #ccc";
			document.getElementById("name").focus();
		},750);
	}
}


function keyPressed(){
	if (event.keyCode == 13)
		startGame();
                        
}

function stopGame(){
		clearInterval(timer);
		
		if(score > records[9].score && document.getElementById("name").value){
			addRecord();
		}
		else 
			document.getElementById("color_row").style.color="#373c4f";
		
		document.getElementById("score_start").innerHTML = "Your Score : " +score;
		document.getElementById("score_start").style.display="block";
		document.getElementById("field").style.display="none";
		document.getElementById("start_page").style.display="block";
		document.getElementById("score").innerHTML ="";

		score =0;
		special_score=0;
		epilepsia_score=0;
		epilepsia_mode=false;
		special_mode=false;
		document.getElementById("field").style.backgroundColor="#ccc";
		document.getElementById("field").innerHTML="";
		clearInterval(epilepsia_timer);
	
}