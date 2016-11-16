var characters = [
	{
		"name": "raven",
		"image": "./images/raven.png",
		"threads": [
			{
				"id":0,
				"text": "Hej, det är jag som är Ronny Räv, kanin är min favoritmat!",
				"choices": []
			},
			{
				"id":1,
				"text": "Nu måste jag tyvärr äta upp dig",
				"choices": []
			},
			{
				"id":2,
				"text": "Ronny Räv springer emot dig, vad gör du?",
				"choices": [
					{
						"text": "Spela död",
						"action": function(){ leaveCharacter(); goLocation('skogen', 207); }
					},
					{
						"text": "Fly i panik samma väg du kom",
						"action": function(){ goCharacter('raven', 31); }
					}
				]
			},
			{
				"id":11,
				"text": "Nu har jag dig!",
				"choices": []
			},
			{
				"id":12,
				"text": "Attans, Ronny Räv har hunnit ifatt dig!",
				"choices": [
					{
						"text": "Svälj blåbären och ge upp",
						"action": function(){ goCharacter('raven', 31); }
					},
					{
						"text": "Spotta blåbären på Ronny Räv i en sista patetiskt protest",
						"action": function(){ goCharacter('raven', 13); }
					}
				]
			},
			{
				"id":13,
				"text": "Ett förfärligt vrål hörs ifrån grottans mynning!",
				"choices": []
			},
			{
				"id":14,
				"text": "\"AAh, det är björnen!\" skriker Ronny Räv och flyr iväg samma väg han kom",
				"choices": [
					{
						"text": "Vänd dig om långsamt",
						"action": function(){ leaveCharacter(); goCharacter('bjornen', 0); }
					}
				]
			},
			{
				"id":21,
				"text": "Ronny Räv hör er komma!",
				"choices": []
			},
			{
				"id":22,
				"text": "\"AAh, det är björnen igen!\" skriker Ronny Räv och flyger in i skogen för att aldrig mer återvända",
				"choices": [
					{
						"text": "Skutta av glädje!",
						"action": function(){ leaveCharacter(); goCharacter('bjornen', 11); }
					}
				]
			},

			{
				"id":31,
				"text": "Ronny Räv hinner ifatt dig",
				"choices": []
			},
			{
				"id":32,
				"text": "Ronny Räv äter upp dig",
				"choices": [
					{
						"text": "Försök igen",
						"action": function(){ leaveCharacter(); youDie(); }
					}
				]
			},
		],
	},


	{
		"name": "bjornen",
		"image": "./images/bjornen.png",
		"threads": [
			{
				"id":0,
				"text": "Utanför grottan står en stor björn!",
				"choices": []
			},
			{
				"id":1,
				"text": "Hej, det är jag som är Björne Björn, vad var det du spottade på räven?",
				"choices": []
			},
			{
				"id":2,
				"text": "Vad svarar du björnen?",
				"choices": [
					{
						"text": "Det var Blåbär!",
						"action": function(){ leaveCharacter(); goCharacter('bjornen', 3); }
					},
					{
						"text": "Ingenting",
						"action": function(){ goCharacter('bjornen', 23); }
					}
				]
			},
			{
				"id":3,
				"text": "Blåbär, jag älskar blåbär!",
				"choices": []
			},
			{
				"id":4,
				"text": "säg mig kan du visa vart du hittat dem",
				"choices": [
					{
						"text": "Ta med björnen tillbaka till stigen!",
						"action": function(){ leaveCharacter(); goLocation('skogen', 242); }
					},
					{
						"text": "Nej, det är min hemlighet!",
						"action": function(){ goCharacter('bjornen', 23); }
					}
				]
			},
			{
				"id":11,
				"text": "Haha, det var mig en lustig liten typ!",
				"choices": []
			},
			{
				"id":12,
				"text": "Säg, vart är mina blåbär? Jag börjar bli förfärligt hungrig",
				"choices": [
					{
						"text": "Peka ut blåbären vid sidan av stigen!",
						"action": function(){ goCharacter('bjornen', 13); }
					},
					{
						"text": "Följ stigen ned till vattnet",
						"action": function(){ leaveCharacter(); goLocation('floden'); }
					}
				]
			},
			{
				"id":13,
				"text": "Åh jösses, vilka stora bär!",
				"choices": []
			},
			{
				"id":14,
				"text": "Björnen kastar sig ner i blåbärsriset",
				"choices": [
					{
						"text": "Tacka björnen för hjälpen med räven",
						"action": function(){ goCharacter('bjornen', 15); }
					},
					{
						"text": "Lämna björnen och följ stigen ned till vattnet",
						"action": function(){ leaveCharacter(); goLocation('floden', 303); }
					}
				]
			},
			{
				"id":15,
				"text": "Björnen är upptagen med att gluffsa i sig blåbär!",
				"choices": []
			},
			{
				"id":16,
				"text": "Vad vill du göra",
				"choices": [
					{
						"text": "Lämna björnen och följ stigen ned till vattnet",
						"action": function(){ leaveCharacter(); goLocation('floden', 303); }
					}
				]
			},
			{
				"id":21,
				"text": "- Såvitt jag vet växer blåbär inte under vatten, säger björnen frustrerat",
				"choices": []
			},
			{
				"id":22,
				"text": "- Nu är jag vrålhungrig, och du ser faktiskt ganska smaskig ut!",
				"choices": []
			},
			{
				"id":23,
				"text": "Björnen åt upp dig",
				"choices": [
					{
						"text": "Försök igen",
						"action": function(){ leaveCharacter(); youDie(); }
					}
				]
			},
		]
	},



	{
		"name": "bavern",
		"image": "./images/bavern.png",
		"threads": [
			{
				"id":0,
				"text": "En bäver dyker upp ur vattnet!",
				"choices": []
			},
			{
				"id":1,
				"text": "Hej, det är jag som är Bert Bäver, vad gör du på min flotte?",
				"choices": []
			},
			{
				"id":2,
				"text": "Vad svarar du Bert Bäver?",
				"choices": [
					{
						"text": "Nu är den min; fann den, vann den!",
						"action": function(){ goCharacter('bavern', 11); }
					},
					{
						"text": "Jag försöker ta mig över floden",
						"action": function(){ goCharacter('bavern', 3); }
					}
				]
			},
			{
				"id":3,
				"text": "Då ska jag hjälpa dig, håll i dig!",
				"choices": []
			},
			{
				"id":4,
				"text": "Bert Bäver knuffar flotten med dig på över floden",
				"choices": [
					{
						"text": "Stig iland!",
						"action": function(){ leaveCharacter(); goLocation('haralds'); }
					},
				]
			},
			{
				"id":11,
				"text": "Bert Bäver blir arg och välter flotten",
				"choices": []
			},
			{
				"id":12,
				"text": "Du förs iväg av strömmen",
				"choices": [
					{
						"text": "Försök igen",
						"action": function(){ leaveCharacter(); youDie(); }
					}
				]
			},
		]
	}

];