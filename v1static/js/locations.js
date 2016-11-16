var locations = [

	{
		"name": "start",
		"image": "./images/skogen.jpg",
		"threads": [
			{
				"id":0,
				"text": "Hej och välkommen!",
				"choices": [],
				"prompt": {
					"question": "Vad heter du?",
					"value": "Kalle",
					"action": function(value){ playerName = value; goLocation('start',1); }
				}
			},
			{
				"id":1,
				"text": "Hej PLAYERNAME, du är en kanin och har blivit inbjuden till inflyttningsfest hos din gode vän Harald Hare, han har flyttat till fältet på andra sidan floden. För att ta sig dit behöver man först gå igenom en skog",
				"choices": [
					{
						"text": "Skutta in i skogen",
						"action": function(){ goLocation('skogen'); }
					}
				]
			}
		],
		
	},

	{
		"name": "skogen",
		"image": "./images/skogen.jpg",
		"threads": [
			{
				"id": 200,
				"text": "Du tar försiktigt ett par skutt in i den mörka skogen",
				"choices": []
			},
			{
				"id": 201,
				"text": "Mellan trädstammarna tycker du dig kunna urskillja glimmret av vatten en bit in",
				"choices": []
			},
			{
				"id": 202,
				"text": "Det är väldigt snårigt, man kan bara ta sig fram på en smal stig",
				"choices": []
			},
			{
				"id": 202,
				"text": "Bakom ett träd vid sidan av stigen ser du en lätt viftande rävsvans",
				"choices": []
			},
			{
				"id": 203,
				"text": "Vad vill du göra?",
				"choices": [
					{
						"text": "Gå tillbaka",
						"action": function(){ goLocation('start'); }
					},
					{
						"text": "Skutta djupare in i skogen",
						"action": function(){ goCharacter('raven', 0); }
					}
				]
			},
			{
				"id": 207,
				"text": "När du ligger där på stigen och väntar på att bli uppäten",
				"choices": []
			},
			{
				"id": 208,
				"text": "Så ser du att skogen runtom är är full av stora och saftiga blåbär",
				"choices": []
			},
			{
				"id": 209,
				"text": "Vad tänker du?",
				"choices": [
					{
						"text": "Skall man dö kan man väl göra det avnjutandes blåbär!",
						"action": function(){ goLocation('grottan', 0); }
					},
					{
						"text": "Undvik frestelsen och ligg helt stilla",
						"action": function(){ goCharacter('raven', 31);  }
					}
				]
			},
			{
				"id": 242,
				"text": "Du skuttar tillbaka till stigen med björnen luffsandes förväntansfullt bakom dig",
				"choices": []
			},
			{
				"id": 243,
				"text": "Räven sitter återigen på stigen och viftar lätt på svansen",
				"choices": []
			},			{
				"id": 244,
				"text": "Vad vill du göra",
				"choices": [
					{
						"text": "Ropa kaxigt på räven!",
						"action": function(){ goCharacter('raven', 21); }
					},
					{
						"text": "Försök smyga förbi räven",
						"action": function(){ goCharacter('raven', 21); }
					}
				]
			}

		],
		
	},



	{
		"name": "grottan",
		"image": "./images/grottan.jpg",
		"threads": [
			{
				"id": 301,
				"text": "Du har precis fyllt munnen med bläbär när du plötsligt skådar en grotta bakom bläbärsriset",
				"choices": []
			},
			{
				"id": 302,
				"text": "Vad gör du?",
				"choices": [
					{
						"text": "Sitt still och njut av din sista måltid!",
						"action": function(){ goCharacter('raven', 31);  }
					},
					{
						"text": "Fly mot grottan",
						"action": function(){ goCharacter('raven', 11); }
					}
				]
			}
		]
	},




	{
		"name": "floden",
		"image": "./images/floden.jpg",
		"threads": [
			{
				"id": 300,
				"text": "Du kommer ut ur skogen och ser nut ut över en flod, på andra sidan kan du se Haralds	Håla, det är dit du ska!",
				"choices": []
			},
			{
				"id": 301,
				"text": "Plötsligt kurrar det till något väldans bakom dig",
				"choices": [
					{
						"text": "Se efter vem som är hungrig",
						"action": function(){ goCharacter('bjornen', 21); }
					}
				]
			},

			{
				"id": 303,
				"text": "Du kan se Haralds Håla på andra sidan floden",
				"choices": []
			},

			{
				"id": 304,
				"text": "Det ligger en flotte vid stranden",
				"choices": []
			},
			{
				"id": 305,
				"text": "Vad vill du göra?",
				"choices": [
					{
						"text": "Klättra upp på flotten",
						"action": function(){ goCharacter('bavern'); }
					}
				]
			},
		]
	},

	{
		"name": "haralds",
		"image": "./images/haralds.jpg",
		"threads": [
			{
				"id": 301,
				"text": "Du tog dig fram till Haralds kalas! Grattis PLAYERNAME!",
				"choices": [
					{
						"text": "En gång till!",
						"action": function(){ leaveCharacter(); goLocation('start'); }
					}
				]
			}
		]
	}

];