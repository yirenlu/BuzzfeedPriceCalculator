function sum(myobject) {
	var sum = 0;
	for (i = 0; i < Object.keys(myobject).length; i++) {
		sum = sum + myobject[Object.keys(myobject)[i]]
	}
	return sum
}

var census = {
	"San Francisco": 2.3,
	"Los Angeles": 2.82,
	"Silicon Valley": 2.32,
	"New York": 2.61,
	"Boston": 2.29,
	"Chicago": 2.57,
	"Portland": 2.27,
	"Detroit": 2.3,
	"Seattle": 2.05,
	"San Diego": 2.64,
	"Indianapolis": 2.46,
	"Minneapolis": 2.17,
	"Austin": 2.37,
	"Houston": 2.67,
	"Dallas": 2.79,
	"Philadelphia": 2.53,
	"Baltimore": 2.5,
	"Miami": 2.58,
	"Phoenix": 2.78,
	"San Antonio": 2.75,
	"Jacksonville": 2.57,
	"Denver": 2.24,
	"Nashville": 2.34,
	"Las Vegas": 2.72,
	"Atlanta": 2.18,
	"Tucson": 2.18,
	"Omaha": 2.46,
	"New Orleans": 2.3,
	"Tampa": 2.43,
	"Washington": 2.5
}

// object of effects
var effects = {
	"Fashionista": {
		"/spending/data/clothing-shoes-other-wear/": 3
	},
	"Organic": {
		"/spending/data/groceries/": 2
	},
	"Green": {
		"/spending/data/gas-22/": .5
	},
	"Philanthropist": {
		"/spending/data/charity-10/": 2
	},
	"Foodie": {
		"/spending/data/dining-out-2/": 3
	},
	"Pets": {},
	"Gym Buff": {},
	"Dating": {
		"/spending/data/dining-out-2/": 1.3,
		"/spending/data/clothing-shoes-other-wear/": 1.2,
		"/spending/data/personal-care-14/": 1.2,
		"/spending/data/entertainment-8/": 1.2
	},
	"Party Animal": {
		"/spending/data/entertainment-8/": 4
	},
	"Roommate": {
		"housing": .33
	},
	"Jetsetter": {
		"/spending/data/travel-9/": 4
	},
	"MTVCribs": {},
	"Student": {
		"/spending/data/entertainment-8/": 1.2,
		"/spending/data/charity-10/": .1
	},
	"Uninsured": {
		"/spending/data/insurance-25/": 6
	}
}

// defining all the global variables
var citykey = '';
var keys = document.querySelectorAll('#calculator span');
var totalcost;
var priceStorage = {}

$.getJSON("js/spendingDataOutput2.json", function(data) {

	// getting a copy of the data
	var datacopy = JSON.parse(JSON.stringify(data));
	var finalObject;
	$cities = $("#dropdown-1 ul.dropdown-menu")
	$cities.empty()
	$.each(Object.keys(data), function(index, value) {
		$('<li><a href="#1">' + value + '</a></li>').appendTo($cities)
	})

	// dealing with the dropdown city-neighborhood selection
	$(document).on('click', '#dropdown-1 ul.dropdown-menu li a', function() {
		// clear everything for a new city

		citykey = $(this).text();

		var mytimeout = setTimeout(function() {
			document.getElementById("darkenid").className = "undarken";
		}, 400);


		document.getElementById("city").innerHTML = 'City \u25BC' + '<br />' + citykey;
		delete datacopy[citykey]["/spending/data/pets-15/"]
		delete datacopy[citykey]["/spending/data/school-child-care-12/"]
		delete datacopy[citykey]["pubtransport"]
		delete datacopy[citykey]["fitness"]
		delete datacopy[citykey]["/spending/data/cable-satellite-7/"]
		finalObject = JSON.parse(JSON.stringify(datacopy));
		finalObject[citykey]['housing'] = finalObject[citykey]['housing']['1Bed']
		console.log(finalObject)

	});



	// Add onclick event to all the keys and perform operations
	for (var i = 0; i < keys.length; i++) {
		keys[i].onclick = function(e) {

			if ($(this).attr('id') == 'city' || $(this).attr('id') == 'neighborhood') {
				document.getElementById("darkenid").className = "darken";
			}
			var input = document.querySelector('.screen');

			var inputVal = input.innerHTML;
			var btnVal = this.innerHTML.replace('<p>', '').replace('</p>', '');

			console.log(btnVal)


			//make class active
			//keys[i].removeClass('active');
			if (btnVal == 'Clear') {
				input.innerHTML = '';
				decimalAdded = false;
				document.getElementById("city").innerHTML = 'City \u25BC';
				// clear everything
				$("span").removeClass('active')
				input.innerHTML = '';

			} else if (btnVal == '=') {
				console.log(finalObject[citykey])
				totalcost = sum(finalObject[citykey])
				console.log(totalcost)
				individualcost = Math.round(totalcost / (census[citykey] - .5))
				var ring = 'Your cost of living in ' + citykey + ' is $' + individualcost;

				input.innerHTML = ring;
			} else if (btnVal.search("City") != -1) {
				input.innerHTML = ''

			} else {

				if ($(this).attr("class") == 'active') {
					$(this).removeClass('active')
					//console.log(Object.keys(effects[btnVal]))

					if (btnVal == 'Pets') {
						delete finalObject[citykey]["/spending/data/pets-15/"]
					}

					if (btnVal == "Gym Buff") {
						delete finalObject[citykey]["fitness"]
					}

					if (btnVal == "Green") {
						delete finalObject[citykey]["pubtransport"]
						finalObject[citykey]["/spending/data/gas-22/"] = data[citykey]["/spending/data/gas-22/"]
						finalObject[citykey]["/spending/data/auto-expenses/"] = data[citykey]["/spending/data/auto-expenses/"]
					}


					$.each(Object.keys(effects[btnVal]), function(index, val) {
						if (val == 'housing') {
							finalObject[citykey][val] = data[citykey][val]['1Bed']

						} else {
							finalObject[citykey][val] = data[citykey][val] / effects[btnVal][val];
						}
					});

				} else {

					$(this).addClass('active');
					if (btnVal == 'Pets') {
						finalObject[citykey]["/spending/data/pets-15/"] = data[citykey]["/spending/data/pets-15/"]
					}

					if (btnVal == 'Gym Buff') {
						finalObject[citykey]["fitness"] = data[citykey]['fitness']
					}

					if (btnVal == 'Green') {
						finalObject[citykey]['pubtransport'] = data[citykey]['pubtransport']
						delete finalObject[citykey]["/spending/data/gas-22/"]
						delete finalObject[citykey]["/spending/data/auto-expenses/"]
					}

					if (btnVal == 'MTVCribs') {
						finalObject[citykey]['housing'] = data[citykey]['housing']['1Bed'] * 3
					}

					$.each(Object.keys(effects[btnVal]), function(index, val) {
						if (val == 'housing') {
							finalObject[citykey][val] = data[citykey][val]['3Bed'] * effects[btnVal][val];
							console.log(datacopy[citykey])

						} else {
							finalObject[citykey][val] = datacopy[citykey][val] * effects[btnVal][val];
						}
					});
				}
			}


		}
	}


});