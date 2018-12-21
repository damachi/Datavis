import pandas as pd
import shapefile
import numpy as np
import matplotlib.pyplot as plt
from dbfread import DBF
from shapely.geometry import Polygon, Point
from time import time
from flask import Flask, request, abort, jsonify
from flask_login import LoginManager, current_user, login_user
from flask_cors import CORS
import request
import pickle
import math

#Function that check the country for every point.
count = {}
def check_country(raw):
    cont = []
    p = raw['Point']
    id_ = raw['pixel_id']
    for i in dico:
        for j in dico[i]:
            if(j.contains(p)):
                #print(i, id_)
                count[id_]=i
            

#list of all countries in the shapefile file.
countries_all = []
for record in DBF("TM_WORLD_BORDERS-0.3.dbf"):
    countries_all.append(record['NAME'])

#in this part, we create a polygon with every points of the borders of every segments
#of every country (ie island, land etc..)
# in order to create a dictionnary with the name of countries in key and the 
# polygon corresponding to it. 

#initial variables.
dico = {}
co = Polygon()
final = []


#For every shape in the file
for shape in list(shape.iterShapes()):
    #initial variables within for loop.
    poly = []
    curr_count = []
    points_c = []
    poly = []
    npoints=len(shape.points) # total points
    nparts = len(shape.parts) # total parts

    #if country as only one part (no island, no discontinuities..)
    if nparts == 1:
        x_lon = np.zeros((len(shape.points),1))
        y_lat = np.zeros((len(shape.points),1))
        #for every point of the borders.
        for ip in range(len(shape.points)):
            x_lon[ip] = shape.points[ip][0]
            y_lat[ip] = shape.points[ip][1]
            points_c = (x_lon[ip][0],y_lat[ip][0])
            curr_count.append(points_c)

        
        #create a polygon with all the points of the border.
        co = Polygon(curr_count)
        #append the polygon to the list. 
        poly.append(co)

    #basically same thing as previous part but this time
    #we keep creating polygons for every segment of the country
    else: # loop over parts of each shape, plot separately
        for ip in range(nparts): # loop over parts, plot separately
            i0=shape.parts[ip]
            if ip < nparts-1:
                i1 = shape.parts[ip+1]-1
            else:
                i1 = npoints
            
            curr_count = []
            seg=shape.points[i0:i1+1]
            x_lon = np.zeros((len(seg),1))
            y_lat = np.zeros((len(seg),1))
            for ip in range(len(seg)):
                x_lon[ip] = seg[ip][0]
                y_lat[ip] = seg[ip][1]
                points_c = (x_lon[ip][0],y_lat[ip][0])
                curr_count.append(points_c)
   
            #create polygon
            co = Polygon(curr_count)
            #append to the list
            poly.append(co)
            
     
    #append all the polygons to the "final" list
    final.append(poly)

        



#make correspondance between countries
#and the list of all its polygons
for i in range(len(countries_all)):
    dico[countries_all[i]] = final[i]




rez1 = pickle.load(open('results_country/SSP1_cc.csv.pkl', 'rb'))
countries = [rez1[i][1] for i in range(len(rez1))]


#data provided by stanford
data = pd.read_csv('SSP1_cc.csv')

#set countries from pickle as 'Country' column for each pixel_id
data['Country'] = countries
#Multiply by -1 to have correct latitude
data['lat'] = data['lat'].apply(lambda x: -x)


#data from http://thematicmapping.org/downloads/world_borders.php in shapefile format
#in order to know in which country belongs the (lat,lon) points.
shape = shapefile.Reader("TM_WORLD_BORDERS-0.3.shp")


#due to the algo, we have to take the lon/lat (opposed to lat/lon) of every points in our dataset.
pix = data[['lon','lat']]
#pandas spec
crit = data[['lon','lat']].index
#we have to create a Point with the (lon/lat) of every pixel
a = pix.apply(Point,axis=1)
new_df = data.loc[crit,:]
new_df['Point'] = a
#reconstruct our data with Point.
data = new_df.copy()

#Apply the check country to every pixel_id
l = r.apply(check_country,axis=1)



