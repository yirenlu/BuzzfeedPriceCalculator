import requests
from bs4 import BeautifulSoup
import re
import json

citiesDict = {
"New York": ["Manhattan", "Brooklyn", "Bronx", "Queens", "Staten Island"],
"Boston": ["Allston", "Charlestown", "East Boston", "Jamaica Plain", "Mattapan", "Roslindale", "West Roxbury", "Milton Village"],
"Chicago": ["Evanston", "Elgin", "Aurora", "Joliet", "Naperville"],
"Detroit": ["Canton","Grosse Pointe", "Bloomfield Hills", "Macomb", "Dearborn"],
"Washington": ["Bethesda"],
"Los Angeles":["Beverly Hills", "Culver City", "Dodgertown","Huntington Park","Inglewood","Universal City","West Hollywood"],
"San Francisco":["San Francisco", "Brisbane","Daly City","Sausalito"],
"Portland":["Gresham", "Hillsboro"],
"Seattle": ["Seattle", "Tacoma", "Bellevue"],
"Silicon Valley": ["Palo Alto", "Mountain View", "Santa Clara", "Sunnyvale", "San Jose", "Berkeley", "Fremont"],
"San Diego": ["La Jolla"],
"Indianapolis": ["Beech Grove"],
"Minneapolis":["Minneapolis", "Saint Paul"],
"Austin": ["Austin","Round Rock", "San Marcos"],
"Houston": ["Sugar Land", "Bellaire", "Baytown", "Houston"],
"Dallas": ["Dallas", "Fort Worth", "Arlington"],
"Philadelphia": ["Bala Cynwyd", "Merion Station", "Elkins Park", "Cheltenham", "Wyncote"],
"Baltimore": ["Brooklyn","Gwynn Oak","Halethorpe","Parkville","Riderwood","Stevenson","Towson"],
"Miami": ["Fort Lauderdale", "Pompano Beach", "Miami Beach", "Boca Raton", "Deerfield Beach", "Boynton Beach", "Delray Beach", "Homestead"],
"Phoenix":["Chandler", "Gilbert", "Glendale", "Mesa", "Peoria", "Scottsdale", "Surprise", "Tempe"],
"San Antonio": ["San Antonio","New Braunfels"],
"Jacksonville": ["Jacksonville Beach", "Orange Park", "Middleburg", "Green Cove Springs", "Macclenny"],
"Denver":["Arvada", "Aurora", "Westminster"],
"Nashville":["Murfreesboro", "Franklin"],
"Las Vegas": ["Las Vegas", "Henderson"],
"Atlanta": ["Roswell", "Marietta", "Gainesville"],
"Tucson": ["Tucson"],
"Omaha": ["Omaha"],
"New Orleans": ["New Orleans", "Metairie", "Kenner"],
"Tampa": ["Tampa", "Hernando"]
}

# reading in file of urls
f = open('spendingData.txt', 'r')
lines = f.readlines()
g = open('spendingDataOutput2.json', 'w+')

neighborhoodStates = {'New York': 'NY', 'Los Angeles': 'CA', 
'Chicago':'IL', 'Houston':'TX', 'Philadelphia': 'PA', 'Phoenix': 'AZ', 
'San Diego':'CA', 'San Francisco':'CA', 'Indianapolis':'IN', 'Boston':'MA',
'Denver':'CO', 'Seattle':'WA', 'Portland':'OR', 'Las Vegas':'NV', 'Baltimore':'MD',
'Detroit': 'MI',
'Washington': 'DC',
'Silicon Valley': 'CA',
'Minneapolis':"MN",
"Austin": 'TX',
"Houston": 'TX',
"Dallas": 'TX',
"Miami": 'FL',
"Phoenix": 'AZ',
"San Antonio": 'TX',
"Jacksonville": 'FL',
"Nashville": 'TN',
"Atlanta": 'GA',
"Tucson": 'AZ',
"Omaha": 'NE',
"New Orleans": 'LA',
"Tampa": 'FL',
"San Antonio": 'TX'
}

baseurl = 'http://www.bundle.com'
craigslistBase = ''
mycity = ''

cityDict = {}
for city in citiesDict.keys():
	if city == 'New York':
		craigslistBase = 'http://newyork.craigslist.org/search/aap/'
	elif city == 'Silicon Valley':
		craigslistBase = 'http://sfbay.craigslist.org/search/apa/'
	elif city == 'Boston':
		craigslistBase = 'http://boston.craigslist.org/search/aap/'
	elif city == 'Washington':
		craigslistBase = 'http://washingtondc.craigslist.org/search/apa/'
	else:
		craigslistBase = 'http://'+ ''.join(city.lower().split(' ')) + '.craigslist.org/search/apa/'
	tempDict = {}
	bedroomDict = {}
	for numberBedrooms in range(1,5,1):
		print numberBedrooms
		payload = {"query":"2br"}
		d = requests.get(url=craigslistBase, params=payload)
		soup = BeautifulSoup(d.text)
		#print soup
		prices = [p.text for p in soup.findAll('span', attrs={'class': 'price'})]
		rows = soup.findAll('p', attrs={'class':'row'})
		i = 0
		tempList = []
		for price in prices:
			i=i+1
			tempList.append(int(price.strip().replace('$', '')))
		print tempList
		if len(tempList) == 0:
			averge = 'N/A'
		else:
			average = sum(tempList)/len(tempList)
		bedroomDict[str(numberBedrooms)+'Bed'] = average
	tempDict['housing'] = bedroomDict
	if city == 'Silicon Valley':
		mycity = 'San Jose'
	else:
		mycity = city
	for category in lines:
		print category
		wholeurl = baseurl+category.strip()+'-'.join(mycity.lower().split(' '))+'-'+neighborhoodStates[city]
		print wholeurl
		r = requests.get(wholeurl)
		soup = BeautifulSoup(r.text)
		content = soup.find("div", attrs={"id":"content"}).find("p").text
		averageExpend = re.findall('\d+', content)
		tempDict[category.strip()] = int(averageExpend[0])
	cityDict[city] = tempDict

g.write(json.dumps(dict(cityDict), indent=4, sort_keys=True))







