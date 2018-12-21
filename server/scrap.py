from bs4 import BeautifulSoup
import requests
import pandas as pd

def get_info(page_content):
    res = {}
    for t in page_content.find_all('div',attrs={"class" : "article_container"}):
        #print(t)
        if(t.findAll("h2")):
            a = t.findAll("h2")[0].text


            if(a[a.find("G"):a.find("\n",2)] == "GEOGRAPHIC SETTING AND ENVIRONMENT"):
                for n in t.findAll("p"):
                    inter = n.text.split()
                    g = " ".join(inter)
                    res["GEOGRAPHIC SETTING AND ENVIRONMENT"] = g
            elif(a[a.find("H"):a.find("\n",2)] == "HISTORY AND FOOD"):
                for n in t.findAll("p"):
                    inter = n.text.split()
                    g = " ".join(inter)
                    res["HISTORY AND FOOD"] = g
            elif(a[a.find("P"):a.find("\n",2)] == "POLITICS, ECONOMICS, AND NUTRITION"): 
                for n in t.findAll("p"):
                    inter = n.text.split()
                    g = " ".join(inter)
                    res["POLITICS, ECONOMICS, AND NUTRITION"] = g

    return res

    country_scrap = ["Algeria","Argentina" ,"Australia", "Brazil" , "Cameroon", "Canada", "Chile", "China" ,"Côte d'Ivoire",
                 "Cuba" ,"Czech Republic" , "Egypt", "Ethiopia", "France" , "Germany" , "Ghana", "Greece" , "Guatemala", 
                 "Haiti" , "Hungary" , "India" , "Indonesia"  , "Iran" , "Iraq" , "Ireland",  "Israel",  "Italy" , "Jamaica" ,
                 "Japan" , "Kazakhstan" , "Kenya" , "Korea",  "Lebanon" , "Liberia" , "Mexico",  "Morocco" , "Mozambique", 
                 "Nigeria" , "Pakistan" , "Peru" , "Philippines" , "Poland" , "Russia"  , "Saudi Arabia" , "Slovenia"  ,
                 "South Africa"  , "Spain" , 
                 "Sweden" , "Tanzania" , "Thailand" ,"Turkey" , "Ukraine", "United Kingdom" ,  "Vietnam"  ,"Zimbabwe"]

country_alge = ['Algeria',
 'Argentina',
 'Australia',
 'Brazil',
 'Cameroon',
 'Canada',
 'Chile',
 'China',
 'Cuba',
 'Egypt',
 'Ethiopia',
 'France',
 'Czech Republic']



country_iv = ["Côte d'Ivoire"]

country_germ = ['Germany',
               'Ghana',
                 'Greece',
 'Guatemala',
 'Haiti',
 'Hungary',
 'India',
 'Indonesia',
 'Iran',
 'Iraq',
 'Ireland',
 'Israel',
 'Italy',
 'Jamaica',
 'Japan',
               ]

country_kaz = ['Kazakhstan',
 'Kenya',
 'Korea',
 'Lebanon',
 'Liberia',
 'Mexico',
 'Morocco',
 'Mozambique',
 'Nigeria',
 'Pakistan',
 'Peru',
 'Philippines',
 'Poland',
 'Russia',
 'Saudi Arabia',
 'Slovenia',
 'South Africa',]

country_spain = [ 'Spain',
 'Sweden',
 'Tanzania',
 'Thailand',
 'Turkey',
 'Ukraine',
 'United Kingdom',
 'Vietnam',
 'Zimbabwe']

food_info = {}
for country in country_scrap:
    
    if(country in country_alge):
        link = 'http://www.foodbycountry.com/Algeria-to-France/' + country + '.html'
    elif(country in country_germ):
        link = 'http://www.foodbycountry.com/Germany-to-Japan/' + country + '.html'
    elif(country in country_iv):
        link = 'http://www.foodbycountry.com/Algeria-to-France/C-te-d-Ivoire.html'
    elif(country in country_kaz):
        link = 'http://www.foodbycountry.com/Kazakhstan-to-South-Africa/' + country + '.html'
    elif(country in country_spain):
        link = 'http://www.foodbycountry.com/Spain-to-Zimbabwe-Cumulative-Index/' + country + '.html'
    if(country == 'South Africa'):
        link = 'http://www.foodbycountry.com/Kazakhstan-to-South-Africa/South-Africa.html'
    if(country == 'Czech Republic'):
        link = 'http://www.foodbycountry.com/Algeria-to-France/Czech-Republic.html'
    if(country == 'Saudi Arabia'):
        link = 'http://www.foodbycountry.com/Kazakhstan-to-South-Africa/Saudi-Arabia.html'
    if(country == 'United Kingdom'):
        link = 'http://www.foodbycountry.com/Spain-to-Zimbabwe-Cumulative-Index/United-Kingdom.html'
    
    
    
    page_response = requests.get(link, timeout=5)
    page_content = BeautifulSoup(page_response.content, "html.parser")
    
    food_info[country] = get_info(page_content)
    

df_info.to_csv('food_info.csv')

