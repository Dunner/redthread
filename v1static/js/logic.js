

var currentRoom = findLocation('start'),
		currentCharacter,
		currentThreadIndex = 0, currentThread, timeouts = [],
		backgroundImageElement = document.getElementById('background-box'),
		characterImageElement = document.getElementById('character-box'),
		speedDragElement = document.getElementById('speed-drag'),
		speedDragIndicatorElement = document.getElementById('speed-drag-indicator'),
		speedDragDragging = false,
		readingSpeed = 30,
		playerName = 'Kalle',
		lastChoice = {locationName:'',characterName:'',threadId:0};

goLocation('start');

document.body.onkeyup = function(e){
  if(e.keyCode == 32){
  	//32 är Space för snabba hopp i texten, av debuggsyfte
  	e.preventDefault();
    nextMessage();
  }
  if(e.keyCode == 13){
  	// 13 är Enter på tangentbordet, används här för att skick input
  	// utan att sidan laddar om sig med POST-formulär.
  	e.preventDefault();
    sendPrompt();
  }
};

document.onclick=function(e){
	var choice = ancestorHasClass(e.target, 'choice');
	if (choice) {
		//Vid klick på svarsalternativ
		choice = choice.getAttribute('choice'); //Hitta svarsalternativsplats via elementattribut
		if (!currentCharacter) { //Beroende på om karaktär eller scen
			//Kör svartsalternativets specifika funktion
			currentRoom.threads[currentThreadIndex-1].choices[choice].action();
		} else {
			//Kör svartsalternativets specifika funktion
			currentCharacter.threads[currentThreadIndex-1].choices[choice].action();
		}
		
	}
	if (e.target.id == 'submit') {
		//Om tryck på "fortsätt" brevid textinputt
		sendPrompt();
	}
};

function nextMessage(threadid) {
	//Dags att visa ett nytt meddelande/ny tråd
	//Threadid avgör m det bara är nästa tråd i följden eller om vi ska visa en specifikt
	clearTimeouts(); //Rensa timeouts så vi rullar ned till det nya meddelandet alltid
	var thread;

	if (!currentCharacter) { // Om karaktär
		if (threadid) { //hoppa till specifik
			thread = findThread(currentRoom.threads, threadid);
			currentThreadIndex++;
		} else { // Till nästa karaktärstråd
			thread = currentRoom.threads[currentThreadIndex++];
		}

	} else { // Om scen

		if (threadid) { //hoppa till specifik
			thread = findThread(currentCharacter.threads, threadid);
			currentThreadIndex++;
		} else { // Till nästa scentråd
			thread = currentCharacter.threads[currentThreadIndex++];
		}

	}

	//Skapa meddelandet i DOM och visa på sidan
	displayThread(thread);
	
}


function displayThread(thread) {
	//Skapa meddelandet i DOM och visa på sidan
	currentThread = thread; //Kom ihåg vilken tråd som visas(JSON*).
	var logWrapperElement = document.getElementById('messages');
	var messageNodes = document.getElementsByClassName('message');
	if (messageNodes) {
		for (var i = 0; i < messageNodes.length; i++) {
			//Loopa alla meddelanden i DOM-trädet
			//För att ta bort 'last' klassen på dem
		  messageNodes[i].className = "message";
		}
	}

	//Skapa DOM element för tråd
	var threadBox = document.createElement('div');
			threadBox.className = 'message last';
	var question = document.createElement('span');
			question.className = 'question';
			//skriv ut htmltext från vår JSON tråd, med mellanstegsfunktion
			question.innerHTML = wordReplacement(thread.text);
	threadBox.appendChild(question);


	//Se om interaktiv tråd, valmöjligheter eller textinput.
	var choices = thread.choices;
	if (choices && choices.length) {
		//Om tråden har alternativ, skapa svarsalternativ i DOM
		var choicesContainer = document.createElement('div');
				choicesContainer.className = 'choices';
		for (var x=0; x < choices.length; x++) {
			var newChoice = document.createElement('div');
			newChoice.className = 'choice';
			newChoice.innerHTML = choices[x].text;
			newChoice.setAttribute('choice', x);
			choicesContainer.appendChild(newChoice);
		}

		//Spara tråd som senaste valmöjligheten
		if (choices.length > 1) {
			var tempName = '';
			!currentCharacter ? tempName = '' : tempName = currentCharacter.name;

			lastChoice = {
				locationName: currentRoom.name,
				characterName: tempName,
				threadId: thread.id
			}
		}

		threadBox.appendChild(choicesContainer);

	} else if(thread.prompt) {
		//Om tråden har textinput, skapa textinput i DOM
		var promptContainer = document.createElement('div');
				promptContainer.className = 'prompt';
		var questionEl = document.createElement('label');
				questionEl.innerHTML = thread.prompt.question;
		var inputEl = document.createElement('input');
				inputEl.setAttribute('placeholder', thread.prompt.value);
				inputEl.setAttribute('type', 'text');
				inputEl.setAttribute('autofocus', 'autofocus');
				inputEl.id = 'prompt';
		var submitEl = document.createElement('div');
				submitEl.innerHTML = 'Fortsätt';
				submitEl.id = 'submit';
		promptContainer.appendChild(questionEl);
		promptContainer.appendChild(inputEl);
		promptContainer.appendChild(submitEl);

		threadBox.appendChild(promptContainer);
	} else {
		//Hoppa till nästa meddelande
		//Avvänta Beroende av hur många bokstäver nuvarande trådtext består av
		//Samt hastighetsreglaget(readingspeed)
		//Sker automatiskt för ointeraktiva trådar för att visa nästa tråd.
		var time = thread.text.length * readingSpeed; 
		setTimeout(nextMessage,time);
	}

	logWrapperElement.appendChild(threadBox);

	timeouts.push(setTimeout(function(){
		scrollToBottom(logWrapperElement,1000);
	},200));

}

function wordReplacement(string) {
	string = string.replace('PLAYERNAME', playerName);
	//Här kan det fyllas på med fler 'replace' för att få mer spelarinputt i storyn
	//Inte modulärt för tillfället, då det kräver pill i koden, TODO.
	return string;
}

function sendPrompt() {
	//Funktion som körs vid klick på enter eller knapptryck vid textinput
	var promptEl = document.getElementById('prompt');
	if (currentThread.prompt) {
		//Kör nuvarande trådens action funktion med värdet av inputten.
		currentThread.prompt.action(promptEl.value);
	}
	//Ta bort fokus från inputten
	promptEl.blur();
	//Nollställ ID så vi inte råkar kalla på en redan använt input senare
	promptEl.id = '';
}

function findThread(array, threadid) {
	//Går igenom en lista av trådar och utifrån ett trådid så returneras den trådens plats i listan
	for (var i = 0; i < array.length; i++) {
		if (array[i].id == threadid) {
			currentThreadIndex = i;
			return array[i];
		}
	}
}

function findLocation(name){
	//Går igenom alla platser och returnerar platsen om den har ett visst namn
	for (var i = locations.length - 1; i >= 0; i--) {
		if (locations[i].name === name) {
			return locations[i];
		}
	}
}

function findCharacter(name){
	//Går igenom alla karaktärer och returnerar karaktären om den har ett visst namn
	for (var i = characters.length - 1; i >= 0; i--) {
		if (characters[i].name === name) {
			return characters[i];
		}
	}
}

function goLocation(name, threadid) {
	//Denna funktion kallas för att byta scen eller karaktär, körs från json.
	//Anges trådid används den även för att hoppa till specifika trådar.
	if (!threadid) {threadid = 0;}//Börjar från första tråden om ingen är angiven
	currentRoom = findLocation(name); //Så vi vet sedan vilken scen som används
	//updatera scenbild
	backgroundImageElement.style.backgroundImage = 'url(\''+currentRoom.image+'\')';
	//Spara trådplats för senare bruk
	currentThreadIndex = threadid;
	//Köa vårt nya meddelande
	nextMessage(threadid);
}

function goCharacter(name, threadid) {
	//Denna funktion kallas för att byta scen eller karaktär, körs från json.
	//Anges trådid används den även för att hoppa till specifika trådar.
	if (!threadid) {threadid = 0;}//Börjar från första tråden om ingen är angiven
	currentCharacter = findCharacter(name); //Så vi vet sedan vilken karaktär som används
	//Uppdatera karaktärsbild
	characterImageElement.style.backgroundImage = 'url(\''+currentCharacter.image+'\')';
	characterImageElement.className = 'show';
	//Spara trådplats för senare bruk
	currentThreadIndex = threadid;
	//Köa vårt nya meddelande
	nextMessage(threadid);
}

function leaveCharacter() {
	//Används för att flytta en karaktär från scenen, körs från json
	currentCharacter = undefined;
	characterImageElement.style.backgroundImage = '';
	characterImageElement.className = '';
}

function youDie() {
	if (lastChoice.characterName) {
		//Gå till plats & karaktär med karaktärstråd
		// goLocation(lastChoice.locationName);
		goCharacter(lastChoice.characterName, lastChoice.threadId);
	} else {
		//Gå till plats med platstråd
		goLocation(lastChoice.locationName, lastChoice.threadId);
	}
	lastChoice = {};
}

//Scrollskötning
function scrollToBottom(element, duration) {
	//Rulla ner så vi alltid ser vårat nyaste meddelande när vi vill
	//Hoppar inte, accelerar och deaccelererar
  if ((element !== null || undefined )) {
  	var currentTime = 0, start = element.scrollTop;
    var animateScroll = function(){
	    var stop = element.scrollHeight - element.clientHeight,
	        change = stop - start,
	        increment = 5;
      currentTime += increment;
      var val = easeInOutQuad(currentTime, start, change, duration);
      element.scrollTop = val;
      if(currentTime < duration) {
      	//Animationen är inte färdig
      	clearTimeouts();
      	//fortsätt "loopa" animationen
      	//increment timeout styr pixelhoppavstånd mellan framesen
        timeouts.push(setTimeout(animateScroll, increment));
      } else {
      	//Animationen är slut
      	clearTimeouts();
      }
    };
    animateScroll(); //Initiera animation
  }
  // Mattematisk uträkning för animationens "momentum"
  function easeInOutQuad(t, b, c, d) {
  	// Easing Equations by Robert Penner http://gizma.com/easing/
    t /= d/2;
    if (t < 1) {return c/2*t*t + b;}
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
  }
  
}


//Nedan handlar om uppläsningshastighetsreglaget, dålig UX atm. TODO

function adjustReadSpeed(e) {
	if (speedDragDragging) {
		//Körs när man drar i hastighetsreglaget längst ner på sidan
  	var indicatorX = Math.floor(e.pageX - posFromLeft(speedDragElement));
  	var draggerWidth = speedDragElement.offsetWidth;
  	readingSpeed = ((indicatorX / draggerWidth) * 100).toFixed(2);
  	console.log(posFromLeft(speedDragElement));
  	speedDragIndicatorElement.style.left = indicatorX.toFixed(2) + 'px';
	}
	function posFromLeft(obj) {
		//Linear upp muspositionen med reglagets sidoffset så vi kan räkna ut var på elementet vi drar någonstans.
		var offLeft = 0;

	  while (obj) {
			offLeft += obj.offsetLeft  + obj.clientLeft;
			obj = obj.offsetParent;
	  }
	  return offLeft;
	}
}

//Muspekar event
speedDragElement.onmousemove=function(e){
	adjustReadSpeed(e);
};
speedDragElement.onmousedown=function(e){
	speedDragDragging = true;
	adjustReadSpeed(e);
};
document.onmouseup=function(){
	speedDragDragging = false;
};

function clearTimeouts() {
	//Clearar alla timeouts som lagts till i timeout listan.
	for (var i=0; i<timeouts.length; i++) {
		clearTimeout(timeouts[i]);
	}
	//Töm timeout listan.
	timeouts = [];
}

function ancestorHasClass(element, classname) {
	//Går upp i DOMträdet utgående från specifikt element och
	//letar efter om någon släkting har en specifik klass
	if (element.className !== undefined) {
	  if (element.className.split(' ').indexOf(classname)>=0) return element;
	  return element.parentNode && ancestorHasClass(element.parentNode, classname);
	} else {
		return false;
	}
}

