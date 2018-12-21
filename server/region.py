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
def check_region(raw):
    p = raw['Point']
    id_ = raw['pixel_id']
    cc = raw['Country'].lower()
    
    if(cc == 'czech republic'):
        cc = 'czech-republic'
    if(cc == 'united states'):
        cc = 'united-states'
    found = 0
    for i in dico_region[cc]:
        for j in dico_region[cc][i]:
            if(j.contains(p)):
                return i
            
    return None
            
                

js_c = ['afghanistan', 'algeria', 'argentina','australia' ,'austria', 'azerbaijan',
       'belgium','brazil','cameroon', 'canada' ,'china','chile', 'colombia', 
        'congo','czech-republic', 'denmark',
       'finland', 'france','india','indonesia' ,
        'iran','ireland','italy','japan','kazakhstan','liberia',
       'nepal','mexico','morocco','netherlands','new-zealand','norway',
        'nigeria','pakistan',
       'peru','philippines', 'poland','portugal','romania','russia',
       'south-africa','spain','sudan','sweden','switzerland','tunisia','turkey',
       'united-arab-emirates','united-kingdom','united-states','ukraine',
       'venezuela'] 

       dico_region = {}

for c in js_c:
    before_n_one = "countries_shapefile/"
    after_n_one = "_adm1.dbf" 
    name = before_n_one + c + "/" + c + after_n_one
    regions = []
    
    for record in DBF(name,encoding = 'utf8'):
        regions.append(record['NAME_1'])

    shape = shapefile.Reader(name)
    
    #in this part, we create a polygon with every points of the borders of every segments
    #of every country (ie island, land etc..)
    # in order to create a dictionnary with the name of countries in key and the 
    # polygon corresponding to it. 

    #initial variables.
    dico_region_c = {}
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
    for i in range(len(regions)):
        dico_region_c[regions[i]] = final[i]

    dico_region[c] = dico_region_c



if(cc == 'United Kingdom'):
    cc = 'united-kingdom'
elif(cc == 'United Arab Emirates')
    cc = 'united-arab-emirates'
elif(cc == 'New Zealand'):
    cc = 'new-zealand'
elif(cc == 'South Africa'):
    cc = 'south-africa'
elif(cc =='Czech Republic'):
    cc = 'czech-republic'
elif(cc == 'Iran (Islamic Republic of)'):
    cc = 'iran'
elif(cc == 'Democratic Republic of the Congo'):
    cc = 'congo'
    


for c in js_c:
    
    print(c)
    regions_all = []
    
    if(c == 'united-arab-emirates'):
        c = 'United Arab Emirates'
    elif(c == 'south-africa'):
        c = 'South Africa'
    elif(c == 'czech-republic'):
        c = 'Czech Republic'
    elif(c == 'new-zealand'):
        c = 'New Zealand'
    elif(c == 'united-kingdom'):
        c = 'United Kingdom'
    elif(c == 'united-states'):
        c = 'United States'
    else:
        c = c.capitalize()
        
    df = data[data['Country'] == c]
    
    if( not df.empty):
    
        reg = df.apply(check_region,axis=1)
        #print(reg)
        regions_all.append(reg)
        
        df['Region'] = reg
        name = c + '_SSP1'
        df.to_csv(name)





