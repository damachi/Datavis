from flask import Flask
import pandas as pd
import numpy as np
from dbfread import DBF
from time import time
from flask import render_template, request, abort, jsonify
from flask_login import LoginManager, current_user, login_user
from flask_cors import CORS
import request
import pickle
import math
import json
from flask import request
from flask_compress import Compress
from flask_csv import *
from collections import defaultdict
from flask_jsonpify import jsonpify
from flask.json import JSONEncoder

   
def default(o):
    if isinstance(o, np.int64): return int(o)  
    raise TypeError

SSP1_cc = pd.read_csv('processed/2050_ssp1_ccf.csv',index_col=0)
SSP1_gs = pd.read_csv('processed/2050_ssp1_gsf.csv',index_col=0)
SSP1_he = pd.read_csv('processed/2050_ssp1_hef.csv',index_col=0)
SSP1_mr = pd.read_csv('processed/2050_ssp1_mrf.csv',index_col=0)

SSP2_cc = pd.read_csv('processed/2050_ssp2_ccf.csv',index_col=0)
SSP2_gs = pd.read_csv('processed/2050_ssp2_gsf.csv',index_col=0)
SSP2_he = pd.read_csv('processed/2050_ssp2_hef.csv',index_col=0)
SSP2_mr = pd.read_csv('processed/2050_ssp2_mrf.csv',index_col=0)

SSP3_cc = pd.read_csv('processed/2050_ssp3_ccf.csv',index_col=0)
SSP3_gs = pd.read_csv('processed/2050_ssp3_gsf.csv',index_col=0)
SSP3_he = pd.read_csv('processed/2050_ssp3_hef.csv',index_col=0)
SSP3_mr = pd.read_csv('processed/2050_ssp3_mrf.csv',index_col=0)

SSP4_cc = pd.read_csv('processed/2050_ssp4_ccf.csv',index_col=0)
SSP4_gs = pd.read_csv('processed/2050_ssp4_gsf.csv',index_col=0)
SSP4_he = pd.read_csv('processed/2050_ssp4_hef.csv',index_col=0)
SSP4_mr = pd.read_csv('processed/2050_ssp4_mrf.csv',index_col=0)

SSP5_cc = pd.read_csv('processed/2050_ssp5_ccf.csv',index_col=0)
SSP5_gs = pd.read_csv('processed/2050_ssp5_gsf.csv',index_col=0)
SSP5_he = pd.read_csv('processed/2050_ssp5_hef.csv',index_col=0)
SSP5_mr = pd.read_csv('processed/2050_ssp5_mrf.csv',index_col=0)


SSP1_cc.loc[:, SSP1_cc.columns != 'Region'] = SSP1_cc.loc[:, SSP1_cc.columns != 'Region'].fillna(0)
SSP1_gs.loc[:, SSP1_gs.columns != 'Region'] = SSP1_gs.loc[:, SSP1_gs.columns != 'Region'].fillna(0)
SSP1_he.loc[:, SSP1_he.columns != 'Region'] = SSP1_he.loc[:, SSP1_he.columns != 'Region'].fillna(0)
SSP1_mr.loc[:, SSP1_mr.columns != 'Region'] = SSP1_mr.loc[:, SSP1_mr.columns != 'Region'].fillna(0)

SSP2_cc.loc[:, SSP2_cc.columns != 'Region'] = SSP2_cc.loc[:, SSP2_cc.columns != 'Region'].fillna(0)
SSP2_gs.loc[:, SSP2_gs.columns != 'Region'] = SSP2_gs.loc[:, SSP2_gs.columns != 'Region'].fillna(0)
SSP2_he.loc[:, SSP2_he.columns != 'Region'] = SSP2_he.loc[:, SSP2_he.columns != 'Region'].fillna(0)
SSP2_mr.loc[:, SSP2_mr.columns != 'Region'] = SSP2_mr.loc[:, SSP2_mr.columns != 'Region'].fillna(0)

SSP3_cc.loc[:, SSP3_cc.columns != 'Region'] = SSP3_cc.loc[:, SSP3_cc.columns != 'Region'].fillna(0)
SSP3_gs.loc[:, SSP3_gs.columns != 'Region'] = SSP3_gs.loc[:, SSP3_gs.columns != 'Region'].fillna(0)
SSP3_he.loc[:, SSP3_he.columns != 'Region'] = SSP3_he.loc[:, SSP3_he.columns != 'Region'].fillna(0)
SSP3_mr.loc[:, SSP3_mr.columns != 'Region'] = SSP3_mr.loc[:, SSP3_mr.columns != 'Region'].fillna(0)

SSP4_cc.loc[:, SSP4_cc.columns != 'Region'] = SSP4_cc.loc[:, SSP4_cc.columns != 'Region'].fillna(0)
SSP4_gs.loc[:, SSP4_gs.columns != 'Region'] = SSP4_gs.loc[:, SSP4_gs.columns != 'Region'].fillna(0)
SSP4_he.loc[:, SSP4_he.columns != 'Region'] = SSP4_he.loc[:, SSP4_he.columns != 'Region'].fillna(0)
SSP4_mr.loc[:, SSP4_mr.columns != 'Region'] = SSP4_mr.loc[:, SSP4_mr.columns != 'Region'].fillna(0)

SSP5_cc.loc[:, SSP5_cc.columns != 'Region'] = SSP5_cc.loc[:, SSP5_cc.columns != 'Region'].fillna(0)
SSP5_gs.loc[:, SSP5_gs.columns != 'Region'] = SSP5_gs.loc[:, SSP5_gs.columns != 'Region'].fillna(0)
SSP5_he.loc[:, SSP5_he.columns != 'Region'] = SSP5_he.loc[:, SSP5_he.columns != 'Region'].fillna(0)
SSP5_mr.loc[:, SSP5_mr.columns != 'Region'] = SSP5_mr.loc[:, SSP5_mr.columns != 'Region'].fillna(0)



SSP1_cc = SSP1_cc.rename(columns={'Calories 2050' : 'Calories2050', 'Population 2050' : 'Population2050'
                                 , 'ΔCalories' : 'diff_calories'})
SSP1_gs = SSP1_gs.rename(columns={'Calories 2050' : 'Calories2050', 'Population 2050' : 'Population2050'
                                 , 'ΔCalories' : 'diff_calories'})
SSP1_he = SSP1_he.rename(columns={'Calories 2050' : 'Calories2050', 'Population 2050' : 'Population2050'
                                 , 'ΔCalories' : 'diff_calories'})
SSP1_mr = SSP1_mr.rename(columns={'Calories 2050' : 'Calories2050', 'Population 2050' : 'Population2050'
                                 , 'ΔCalories' : 'diff_calories'})

SSP2_cc = SSP2_cc.rename(columns={'Calories 2050' : 'Calories2050', 'Population 2050' : 'Population2050'
                                 , 'ΔCalories' : 'diff_calories'})
SSP2_gs = SSP2_gs.rename(columns={'Calories 2050' : 'Calories2050', 'Population 2050' : 'Population2050'
                                 , 'ΔCalories' : 'diff_calories'})
SSP2_he = SSP2_he.rename(columns={'Calories 2050' : 'Calories2050', 'Population 2050' : 'Population2050'
                                 , 'ΔCalories' : 'diff_calories'})
SSP2_mr = SSP2_mr.rename(columns={'Calories 2050' : 'Calories2050', 'Population 2050' : 'Population2050'
                                 , 'ΔCalories' : 'diff_calories'})

SSP3_cc = SSP3_cc.rename(columns={'Calories 2050' : 'Calories2050', 'Population 2050' : 'Population2050'
                                 , 'ΔCalories' : 'diff_calories'})
SSP3_gs = SSP3_gs.rename(columns={'Calories 2050' : 'Calories2050', 'Population 2050' : 'Population2050'
                                 , 'ΔCalories' : 'diff_calories'})
SSP3_he = SSP3_he.rename(columns={'Calories 2050' : 'Calories2050', 'Population 2050' : 'Population2050'
                                 , 'ΔCalories' : 'diff_calories'})
SSP3_mr = SSP3_mr.rename(columns={'Calories 2050' : 'Calories2050', 'Population 2050' : 'Population2050'
                                 , 'ΔCalories' : 'diff_calories'})

SSP4_cc = SSP4_cc.rename(columns={'Calories 2050' : 'Calories2050', 'Population 2050' : 'Population2050'
                                 , 'ΔCalories' : 'diff_calories'})
SSP4_gs = SSP4_gs.rename(columns={'Calories 2050' : 'Calories2050', 'Population 2050' : 'Population2050'
                                 , 'ΔCalories' : 'diff_calories'})
SSP4_he = SSP4_he.rename(columns={'Calories 2050' : 'Calories2050', 'Population 2050' : 'Population2050'
                                 , 'ΔCalories' : 'diff_calories'})
SSP4_mr = SSP4_mr.rename(columns={'Calories 2050' : 'Calories2050', 'Population 2050' : 'Population2050'
                                 , 'ΔCalories' : 'diff_calories'})

SSP5_cc = SSP5_cc.rename(columns={'Calories 2050' : 'Calories2050', 'Population 2050' : 'Population2050'
                                 , 'ΔCalories' : 'diff_calories'})
SSP5_gs = SSP5_gs.rename(columns={'Calories 2050' : 'Calories2050', 'Population 2050' : 'Population2050'
                                 , 'ΔCalories' : 'diff_calories'})
SSP5_he = SSP5_he.rename(columns={'Calories 2050' : 'Calories2050', 'Population 2050' : 'Population2050'
                                 , 'ΔCalories' : 'diff_calories'})
SSP5_mr = SSP5_mr.rename(columns={'Calories 2050' : 'Calories2050', 'Population 2050' : 'Population2050'
                                 , 'ΔCalories' : 'diff_calories'})




food = pd.read_csv('food_info.csv', index_col=0)
list_food = list(food.index)



app = Flask(__name__)
Compress(app)
CORS(app)

table = {'SSP1_cc' : SSP1_cc,'SSP1_gs' : SSP1_gs,'SSP1_he' : SSP1_he,'SSP1_mr' : SSP1_mr,
        'SSP2_cc' : SSP2_cc,'SSP2_gs' : SSP2_gs,'SSP2_he' : SSP2_he,'SSP2_mr' : SSP2_mr,
        'SSP3_cc' : SSP3_cc,'SSP3_gs' : SSP3_gs,'SSP3_he' : SSP3_he,'SSP3_mr' : SSP3_mr,
        'SSP4_cc' : SSP4_cc,'SSP4_gs' : SSP4_gs,'SSP4_he' : SSP4_he,'SSP4_mr' : SSP4_mr,
        'SSP5_cc' : SSP5_cc,'SSP5_gs' : SSP5_gs,'SSP5_he' : SSP5_he,'SSP5_mr' : SSP5_mr,}


for t in table:
    table[t]['Country'] = table[t]['Country'].replace(0,np.nan)

    
    
@app.route('/', methods = ['GET'])
def main():
    
    htt = 'index.html'
    
    return render_template(htt)
    
    
@app.route('/points_country', methods = ['POST'])
def points_country():
    
    req_data = request.get_json()
    
    ssp = req_data['SSP']
    climate_model = req_data['climate_model']
    variable = req_data['stats']['variable']
    countries = req_data['stats']['countries']
    
    file = table[ssp+'_'+climate_model]
    
    
    df_country = file[file['Country'] == countries[0]][['lat','lon',variable[0],'Precipitation 2050', 'Temperature 2050',
                                             'workability_index 2050', 'altitude']]
    
    res = df_country.values.tolist()[:]
    
    return jsonify(res)

@app.route('/get_topo', methods = ['GET'])
def get_topo():
    
    country = request.args.get('Country')
    
    file = 'countries_json/' + country + '_adm1.json'
        
    with open(file,"r") as f:
        data_w = f.read()
    
    topo = json.loads(data_w)
    
    
    return jsonify(topo)



    @app.route('/country', methods=['POST']) #allow both GET and POST requests
    def stat_country():

        req_data = request.get_json()

        ssp = req_data['SSP']
        climate_model = req_data['climate_model']
        variable = req_data['stats']['variable']
        countries = req_data['stats']['countries']

        file = table[ssp+'_'+climate_model]


        for c in countries:

            df_region = file[file['Country'] == c]
            #results = df_region.groupby('Region').sum()
            #results = results[variable[0]] / results['Population2050']


            if(variable[0] == 'Calories2050' or variable[0] == 'diff_calories'):
                results = df_region.groupby('Region').sum()#[s]
                results = results[variable[0]] / results['Population2050']
            elif(variable[0] == 'altitude'or variable[0] == 'Precipitation 2050'):
                results = df_region.groupby('Region').mean()[variable[0]]



            name = 'countries_json/' + c +'_adm1.json'


            with open(name,"r") as f:
                data_w = f.read()

            topo = json.loads(data_w)
            bb = list(topo['objects'].keys())[0]


            for l in topo['objects'][bb]['geometries']:

                for s in variable:
                    try:
                        l['properties'][s] = results[l['properties']['NAME_1']]
                    except:
                        l['properties'][s]= 0
                        continue

        return jsonify(topo)




@app.route('/world', methods = ['POST'])
def stat_world():
    
    req_data = request.get_json()
    
    ssp = req_data['SSP']
    climate_model = req_data['climate_model']
    variable = req_data['stats']['variable']
    
    file = table[ssp+'_'+climate_model]
    
    with open('world.json',"r") as f:
        data_w = f.read()
    
    topo = json.loads(data_w)
    
    for s in variable:
        
        if(s == 'Calories2050' or s == 'diff_calories'):
            results = file.groupby('Country').sum()#[s]
            results = results[s] / results['Population2050']
        elif(s == 'altitude'or s == 'Precipitation 2050'):
            results = file.groupby('Country').mean()[s]
            
        
    
        
        for i in topo['objects']['countries1']['geometries']:
    
            name = i['properties']['name']
    
            mean_d = results.to_dict()
            if(name in mean_d):
                if(mean_d[name]==float('inf')):
                    v = 0
                else:
                    v = mean_d[name]
            else:
                v = 0
   
            i['properties'][s] = v
    
    
    
    return jsonify(topo)


@app.route('/carto' , methods = ['GET'])
def carto():
    
    with open("cartogram.json","r") as f:
        data_w = f.read()
    
    topo = json.loads(data_w)
    
    return jsonify(topo)


def carto_stat_calo(file):
    results = file.groupby('Country').sum()['Calories2050'] / file.groupby('Country').sum()['Population2050']
    results = dict(results)
    results['Greenland'] = 0
    
    return results

def carto_stat_diff_calo(file):
            
    results = file.groupby('Country').mean()['diff_calories'] #/ file.groupby('Country').sum()['Population2050']
    results = dict(results)
    results['Greenland'] = 0
    
    return results


def carto_stat_temp(file):

    results = file.groupby('Country').mean()['Temperature 2050'] #/ file.groupby('Country').sum()['Population2050']
    results = dict(results)
    results['Greenland'] = 0
    
    return results


def carto_stat_workability(file):
    
    
    results = file.groupby('Country').mean()['workability_index 2050'] #/ file.groupby('Country').sum()['Population2050']
    results = dict(results)
    results['Greenland'] = 0
    
    return results

def carto_stat_altitude(file):
    

    results = file.groupby('Country').mean()['altitude'] #/ file.groupby('Country').sum()['Population2050']
    results = dict(results)
    results['Greenland'] = 0
    
    return results

def carto_stat_precip(file):
    
    results = file.groupby('Country').mean()['Precipitation 2050'] #/ file.groupby('Country').sum()['Population2050']
    results = dict(results)
    results['Greenland'] = 0
    
    return results
    
    

    

@app.route('/carto_stat', methods = ['GET'])
def carto_stat():

    
    ssp = request.args.get('SSP')
    model = request.args.get('model')
    file = table[ssp+'_'+model]
    
    calories = carto_stat_calo(file)
    diff = carto_stat_diff_calo(file)
    temp = carto_stat_temp(file)
    work = carto_stat_workability(file)
    altitude = carto_stat_altitude(file)
    precip = carto_stat_precip(file)


    
    #results = {i:list(j) for i in calories.keys() for j in zip(calories.values(),temp.values(),work.values(),altitude.values())}

    dicts = [calories,diff,temp,work,altitude,precip]

    
    
    super_dict = {}#defaultdict(set)  # uses set to avoid duplicates

    for k in set(k for d in dicts for k in d):
        super_dict[k] = [d[k] for d in dicts if k in d]
            

    return jsonify(super_dict)

def chart1(country,ssp,variable):
    
    models = ['cc', 'gs' , 'he' , 'mr']
    results = []
    variable = variable[0]
    
    for m in tqdm(models):
        file = table[ssp+'_'+m]
        res = 0
        
        if(variable == 'Calories2050' or variable == 'diff_calories'):

            res = file[file['Country'] == country][variable].sum() / file[file['Country'] == country]['Population2050'].sum()

        elif(variable == 'altitude'or variable == 'Precipitation 2050'):
            res = file[file['Country' ] == country][variable].sum() #/ len(file[file['Country'] == country])
        results.append(res)
        
        
    return results

def chart2(country,climate_model,variable):
    
    models = ['SSP1', 'SSP2' , 'SSP3' , 'SSP4', 'SSP5']
    results = []
    variable = variable[0]
    
    for m in models:
        file = table[m+'_'+climate_model]
        
        res= 0
        
        if(variable == 'Calories2050' or variable == 'diff_calories'):

            res = file[file['Country'] == country][variable].sum() / file[file['Country'] == country]['Population2050'].sum()

        elif(variable == 'altitude'or variable == 'Precipitation 2050'):
            res = file[file['Country' ]== country][variable].sum() / len(file[file['Country'] == country])
            
        
        results.append(res)
        
    return results

def chart3(country,ssp,climate_model,variable):
    file = table[ssp+'_'+climate_model]
    variable = variable[0]
    
    if(variable == 'Calories2050' or variable == 'diff_calories'):
        a = file[file['Country'] == country].groupby('Region').sum()
        res = a[variable] / a['Population2050']
    elif(variable == 'altitude'or variable == 'Precipitation 2050'):
        a = file[file['Country'] == country].groupby('Region').mean()
        res = a[variable]
        
        
    return(dict(res))

@app.route('/side_stats', methods = ['POST'])
def side_stats():

    req_data = request.get_json()
    
    ssp = req_data['SSP']
    climate_model = req_data['climate_model']
    variable = req_data['stats']['variable']
    country = req_data['stats']['countries'][0]


    char1 = chart1(country,ssp,variable)


    char2 = chart2(country,climate_model,variable)


    char3 = chart3(country,ssp,climate_model,variable)

    res = [char1,char2,char3]
    #res = [char1]
    
    print(res)
    
    return jsonify(json.loads(json.dumps(res, default=default)))

@app.route('/info_food', methods = ['GET'])
def info_food():
    country = request.args.get('country')
    
    if(country in list_food):
        geo = food.loc[country]['GEOGRAPHIC SETTING AND ENVIRONMENT']
        histo = food.loc[country]['HISTORY AND FOOD']
        poli = food.loc[country]['POLITICS, ECONOMICS, AND NUTRITION']
        res = [geo,histo,poli]
    else:
        res = 0
        
    
    
    return jsonify(res)
    
    
if __name__ == "__main__":
    app.run()
