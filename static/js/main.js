
let cache = {}


$('html, body').animate({
    scrollTop: $("#page1").offset().top
}, 500);

let loader = document.getElementById("loader")



function getTypeofSelection(selection,i){
    let div = document.getElementById(selection);
    let index = document.getElementById(selection).selectedIndex
    return div.options[index].text
}

function foodInfoRequest(country){

    loader.style.display = "block"
    return axios({
        url:'http://139.59.213.158:5000/info_food?country='+country,
        method : 'get',


    })
}


let detailedTopojson = "ch-cantons.json";

let yLabel;

let titleBarChart1;
let titleBarChart2;
let titleBarChart3;
let countryClickedBarChart;

let countryClickedDetail;
let parametersSelected;

let color_scale_aggregated;
let selectedForDetailed;


let requests = {Calorie:"Calories2050", Altitude:"altitude", Precipitation:"Precipitation 2050", Cropland:"%cropland 2050"}


//*******topojson per coutry with values************//¨



let loading = false;
function topoJsonPerCountryWithValuesRequest(ssp, model, country,variable){


    
    loader.style.display = "block"
    return axios({
        url: 'http://139.59.213.158:5000/country',
        method:'post',
        data:{
            SSP:ssp,
            climate_model: model,
            stats:{
                variable:[variable],
                countries:[country]     
            }
        }
    })
    

}



const variables ={ altitude: "altitude", calorie: "Calorie 2050", temperature:"Temperature 2050", precipitaion:"Precipitation 2050", cropland:"%cropland 2050" }


function worldMapRequest(url_, ssp_, model, variable_){

  loader.style.display = "block"
  return axios({
        url: url_,
        method:'post',
        data:{
            SSP:ssp_,
            climate_model:model,
            stats:{
                variable:[variable_],     
            }
        }
    });
}

function topoJsonPerCountry(country_){
    loader.style.display = "block"
	return axios({
		url: 'http://139.59.213.158:5000/get_topo?Country='+country_,
		method: 'get',
		data: {
		foo: 'bar'
		}
	});

}

url = 'http://139.59.213.158:5000/world'
ssp = "SSP1"
model = "cc"
variable_ = "Calories2050"



urlBar = 'http://139.59.213.158:5000/side_stats'
ssp  = "SSP1"
model = "cc"
variable = "Calories2050"
country = "France"

function sideBarRequest(url_, ssp, model, variable, country){
    loader.style.display = "block"
    return axios({
        url: url_,
        method: 'post',
        data:{
            SSP:ssp,
            climate_model:model,
            stats:{
                variable:[variable],     
                countries:[country]
            }

        }
    })
}


let variableToDisplay = "Calories2050"


function produceLegend(map_data, colors ){

    let colorScaleInternal = d3.scaleQuantize() 
    .domain([0, d3.max(map_data.features, function (d) { return +d.properties[variableToDisplay]; })])
    .range(colors);

    let color_scale = function(value) {
    return !!value ? colorScaleInternal(value) : colors[0];
    };

    d3.select("#legend").select("svg").remove()
    let svgs = d3.select("#legend").append("svg")
    svgs.append("g")
    .attr("class", "legendQuant")
        
    let colorLegend = d3.legendColor()
    .labelFormat(d3.format(",.0f"))
    .scale(colorScaleInternal);

    svgs.select(".legendQuant")
    .call(colorLegend);


    return color_scale;
}



$("#Detail").click(function() {

    w3_close();
    $('html, body').animate({
        scrollTop: $("#compareSlider").offset().top
    }, 500);

    let selectedSSP = document.getElementById("scenario").options.selectedIndex;
    let selectedModel = document.getElementById("model").options.selectedIndex;

    document.getElementById("selectModel").options.selectedIndex =  selectedSSP;
    document.getElementById("selectSSP").options.selectedIndex = selectedModel;

    document.getElementById("selectModel1").options.selectedIndex =  selectedSSP;
    document.getElementById("selectSSP1").options.selectedIndex =  selectedSSP;

  
    topoJsonPerCountry(countryClickedDetail).then(function(topojson){
        loader.style.display = "none"
        compare(topojson.data, countryClickedDetail);

        document.getElementById("button1").click();
        document.getElementById("button2").click();

    }).catch((reason)=>{
        location.reload()
        loader.style.display = "none"
    })

});

function writeText(string, div){

    let p = document.createElement("p")
    let text = document.createTextNode(string)

    p.style.color = "white"
    p.style.fontFamily = "Cardo, Serif"

    p.appendChild(text)
    div.appendChild(p)


}


$("#startJourney").click(function() {

    $('html, body').animate({
        scrollTop: $("#page2").offset().top 
    }, 500);

});

$("#skipToMap").click(function() {

    $('html, body').animate({
        scrollTop: $("#mapSlide").offset().top 
    }, 500);

});

$("#startMap").click(function() {

    $('html, body').animate({
        scrollTop: $("#mapSlide").offset().top 
    }, 500);

});

$("#info").click(function() {


    foodInfoRequest(countryClickedDetail).then(result =>{
        loader.style.display ="none";
        
         let div = document.getElementById("moreInfo");
         div.style.display = "block"
         let infos = result.data;

         $('#moreInfo').empty();

         console.log(infos.length)
         if(!infos.length){

            writeText("MISSING INFO FOR "+countryClickedDetail.toUpperCase()+ ".PLEASE TRY ANOTHER COUNTRY", div )

         }else{
         for(let i = 0; i <infos.length; i++){
            writeText(infos[i],div)
         }
        }
        
    }).catch((reason)=>{

        location.reload();
        loader.style.display="none";  
    })
});


$("#backButton").click(function() {


    $('html, body').animate({
        scrollTop: $("#mapSlide").offset().top
    }, 500);


});

$("#backCompareCarto").click(function() {

    
    $('html, body').animate({
        scrollTop: $("#cartogramSlide").offset().top 
    }, 500);

});


$("#backCompareWorld").click(function() {
    
    $('html, body').animate({
        scrollTop: $("#mapSlide").offset().top
    }, 500);

    setTimeout(function(){
        location.reload();
    },1000)  
});


$("#cartogramButton").click(function() {

    w3_close();
   
    $('html, body').animate({
        scrollTop: $("#cartogramSlide").offset().top
    }, 500);


    document.getElementById('reset').click();




});
function w3_open() {
    document.getElementById("mySidebar").style.display = "block";
    
}
function w3_close() {
    document.getElementById("mySidebar").style.display = "none";
    divCompare.style.display = "none";
    document.getElementById("moreInfo").style.display = "none";
}


function getDifferencePercentage(originalNumber, newNumber){
    let decrease = newNumber- originalNumber,
        value    = d3.format(".1f")(decrease/originalNumber*100);
      
    return value;
  
  }

function insertCompare(key, value, div){


    let pTag = document.createElement("p")
    pTag.style.color = "white";

    let text = document.createTextNode(key+": ")

    let text2 = document.createTextNode(value+"%");



    let span = document.createElement("span");
    span.appendChild(text2);

    let color;

    if(value > 0){
        color = "green"
    }else if(value < 0){
        color = "red"
    }else{
        color = "white"
    }
    span.style.fontSize = "15px";
    span.style.color= color

    pTag.appendChild(text);
    pTag.appendChild(span);

    div.appendChild(pTag);

}

const divCompare = document.getElementById("compare")

function generateBarChart(data, 
    divid,
    color,
    dy,
    dx,
    yLabel,
    title,
    titleid,
    regionBar,
    fontSize,
    ){

    

    document.getElementById(titleid).innerHTML = title + " in " +countryClickedBarChart;

    let divToolTip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    const div = document.getElementById(divid);

    const W = 400
    const H = 300;


    const margin = 40;
    const width = W - 2 * margin;
    const height = H - 2 * margin;

    const svg= d3.select("#"+divid).append("svg")

    svg.attr("width", "100%")
    svg.attr("height", "100%")

    const chart = svg.append("g")
                    .attr('transform', 'translate('+70+","+(margin-30)+")")

    
    const min_max = d3.extent(data,function(d){
    return d['value']
    })

    const min = min_max[0],
    max = min_max[1];

    const yScale = d3.scaleLinear()
    .range([height, 0])
    .domain([0, max]);

    //splits range in bands
    const xScale = d3.scaleBand()
    .range([0, width])
    .domain(data.map((s)=> s.key))
    .padding(0.2)


    chart.append('g')
    .attr('transform','translate(0,'+height+")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("font-size",fontSize)
    .attr("transform", "rotate(90)")
    .attr("dy", dy)
    .attr("dx", dx)

    chart.append('g')
    .call(d3.axisLeft(yScale).ticks(5).tickFormat(d3.format(".1e"))
    );



    const gridLines = () => d3.axisLeft()
    .scale(yScale)

    chart.append('g')
    .attr('class', 'grid')
    .call(gridLines()
    .tickSize(-width, 0, 0)
    .tickFormat('')
    )

    const bars = chart.selectAll()
    .data(data)
    .enter()
    .append('g')


    bars.append("rect")
    .style("fill", color)

    .attr('x', function(d){
    return xScale(d.key)
    })
    .attr("y", function(d){
    return yScale(d.value)
    })

    .attr("height", function(d){
    return height - yScale(d.value)
    })
    .transition()
    .duration(500)
    .ease(d3.easeLinear) //TODO 
    .attr("width", function(d){
    return  xScale.bandwidth()
    });



    bars.on("click", function(d){

    divCompare.style.display="block"

    $('#compare').empty();

    for(let i = 0; i < data.length;i++){
    const value = getDifferencePercentage(d.value, data[i]['value'])
    insertCompare(data[i]['key'],value,divCompare)
    }
    })
    .on('mouseenter', function(d,i){

        if(regionBar){

            d3.select("#"+d.key)
            .transition()
            .duration(500)
            .style("opacity","0.1")

        }


    d3.selectAll('.value')
    .attr('opacity',0)

    divToolTip.transition()
    .duration(200)
    .style("opacity", .9);

    const format = d3.format(",.0f")
    divToolTip.html("<p class='hoverSide'>Calories for </p>"+"<p class='cantonhover'>"+d.key+ "</p>"+"<p class='hoverSide'>"+format(d.value)  +"</p>"+
                    "<p class='clickBar'>click on bar to compare </p>")
    .style("left", (d3.event.pageX) + "px")
    .style("top", (d3.event.pageY - 28) + "px");

    d3.select(this)
    .transition()
    .duration(300)
    .attr('opacity', 0.6)
    .attr('x', (d) => xScale(d.key) - 5)
    .attr('width', xScale.bandwidth() + 10)

    //draw dashed line
    const y = yScale(d.value)

    let line = chart.append('line')
    .attr('id', 'limit')
    //first point
    .attr('x1', 0)
    .attr('y1', y)
    //second point
    .attr('x2', width)
    .attr('y2', y)

    })
    .on('mouseleave', function(d){


        if(regionBar){
            d3.select("#"+d.key)
            .transition()
            .duration(500)
            .style("opacity", 1)

        }

        divToolTip.transition()
                .duration(500)
                .style("opacity", 0);


        d3.selectAll('.value')
         .attr('opacity',1)

        d3.select(this)
            .transition()
            .duration(200)
            .attr('opacity', 1)
            .attr('x', (d) => xScale(d.key))
            .attr('width', xScale.bandwidth)


        d3.select('#limit').remove()
        d3.selectAll('.difference').remove()
       
    })

    svg.append("text")
    .attr('x', -(height/2) - margin)
    .attr('y', margin/2)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text(yLabel)
    .attr("font-size", 20)


    svg.append("text")
    .attr('x', -height- margin)
    .attr('y', margin/2)

    .attr('text-anchor', 'middle')
    .text('Decide later')

}
$(document).ready(function(){


    let informationBar = d3.select('#information_bar')
                            .style('opacity',1)

    let map = new L.Map('mapcanvas',{
        minZoom: 2
});

const colorsTotal = {Calorie : ['#fff5eb', '#fee6ce', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#a63603', '#7f2704'],
                    Cropland : ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'],
                    Precipitation: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1','#6baed6','#4292c6','#2171b5','#08519c','#08306b'],
                    Altitude :     ['#fcfbfd','#efedf5','#dadaeb','#bcbddc','#9e9ac8','#807dba','#6a51a3','#54278f','#3f007d'],
                    }


let osmUrl='https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';
let osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
let osm = new L.TileLayer(osmUrl, {attribution: osmAttrib});		

map.setView(new L.LatLng(46.8182,8.2275),2);
map.addLayer(osm);
// map.scrollWheelZoom.disable()

let country_data;
let colors;
let path;
let country_info;
let g;
let svg;

function onClickRaw(e){

    console.log("raw called")
    let selection = getTypeofSelection("typeOfMap",1)
    let variable = requests[selection]
    let sspChosen = getTypeofSelection("scenario")
    let modelChosen = getTypeofSelection("model")

    //TODO correct
    const country_info_promise = topoJsonPerCountryWithValuesRequest(sspChosen, modelChosen, countryClickedDetail, variable).then(function(raw){
    
        loader.style.display = "none"
        let objectsname = countryClickedDetail.toLowerCase() + "_adm1"
        let topojson_raw = raw.data;
        const results = topojson.feature(topojson_raw, topojson_raw.objects[objectsname]);

        //update legend here
        country_data = results

        d3.selectAll("path").remove()
        country_info = g.selectAll("topojson")
        .data(country_data.features)
        .enter()
        .append("path")

        color_scale_aggregated = produceLegend(country_data, colors);

        country_info.attr("d",path)
                .attr("id", function(d){
                    return d.properties['NAME_1']
                })
                .on("mouseover",function(d){
                    d3.select(this).style("fill","red")
                    
                    divAggregatedHover.transition()
                        .style("opacity", .9);
                    
                    let valueToDisplay = d3.format(".2s")(+d.properties[variableToDisplay]).replace("G"," Billion").replace("M", " Million")

                    divAggregatedHover.html(
                    "<p style='color:white';>"+d.properties['NAME_1']+"<p/>"+
                    "<p style='color:red';>"+valueToDisplay+"<p/>" 
                    )
                    .style("left", (d3.event.pageX-3) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");


                })
                .on("mouseout",function(d){

                    divAggregatedHover.transition()
                        .style("opacity", 0);

                    d3.select(this).style("fill", function(d){
                        return color_scale_aggregated(d.properties[variableToDisplay])
                    })

                })
                .attr("class", "canton")
                .style("fill",function(d){
                    return color_scale_aggregated(d.properties[variableToDisplay]);
                });
                
        
        map.on("viewreset", reset2);
    }).catch(r=>{
        location.reload()
    });            
}


function setBounds(map_data){
    let bounds = path.bounds(map_data),
        topLeft = bounds[0],
        bottomRight = bounds[1];
        
        svg .attr("width", bottomRight[0] - topLeft[0])
            .attr("height", bottomRight[1] - topLeft[1])
            .style("left", topLeft[0] + "px")
            .style("top", topLeft[1] + "px");
        
        g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

}

function reset2(){
                
    setBounds(country_data)
    country_info.attr("d", path)
        .attr("id", function(d){
            return d.properties['NAME_1']
        })
        .style("stroke", function(d){
            return "gray"
        })
        .style("stroke-dasharray", "4,4")
        .style("fill", function(d){
            return color_scale_aggregated(d.properties[variableToDisplay])
        })
        .style("stroke-width", "0.5px")    
}


document.getElementById("raw").addEventListener("click", onClickRaw)

let divAggregatedHover;
function buildMapTop(topojson_raw, col){

    colors = col
    d3.select(map.getPanes().overlayPane).select('svg').remove()

    svg = d3.select(map.getPanes().overlayPane).append("svg");
    g = svg.append("g").attr("class", "leaflet-zoom-hide");

    const map_promise = topojson.feature(topojson_raw, topojson_raw.objects.countries1)

    let div = d3.select("body").append("div")
                .attr("class", "tooltips")
                .style("opacity", 0);

    divAggregatedHover = d3.select("body").append("div")
                            .attr("class", "tooltips")
                            .style("opacity", 0);

    let divRawOrDetail = d3.select("#raw_or_detail")
                            .style("opacity", 0)

    const button = d3.select('#goBack').style('opacity',0)
    const button1 = d3.select('#raw').style('opacity',0)
    const button2 = d3.select('#detail').style('opacity',0)
    const button3 = d3.select('#normal').style('opacity',0)

    Promise.all([map_promise]).then((results) => {

        console.log(document.getElementById("raw"))

        let map_data = results[0]

        let min_max = d3.extent(map_data.features, function(d){

                return +d.properties[variableToDisplay]
        })


        let color_scale = produceLegend(map_data,colors)

        let transform = d3.geoTransform({point: projectPoint});
                path = d3.geoPath().projection(transform);
        
        let feature = g.selectAll("path")
                        .data(map_data.features)
                        .enter().append("path")



                
        let clicked = false

        map.on("viewreset", reset);

        map.on('click',function(e){
        const lat =  e.latlng.lat
        const lon =  e.latlng.lng

        map.setView([e.latlng.lat, e.latlng.lng], 6);
        });
        reset();
        

    

        
        let point
        function reset() {
                    
                    let color;
                    setBounds(map_data)
                    feature.attr("d", path)
                        .style("stroke", "gray")
                        .style("stroke-dasharray", "4,4")
                        .style("fill", function(d){
                            return color_scale(d.properties[variableToDisplay])
                        })
                        .on("mouseover", function(d){
                                d3.select(this)
                                    .style("fill","red")

                                div.transition()
                                    .style("opacity", .9);
                                
                                let format = d3.format(".2s");
                                
                                let data = format(d.properties[variableToDisplay]).replace("G"," Billion").replace("M", " Million");

                                div.html("<p style='color:white';>"+d.properties.name+"<p/>"+
                                        "<p  style='color:red';>"+data+"<p/>" 
                                        )
                                    .style("left", (d3.event.pageX-3) + "px")
                                    .style("top", (d3.event.pageY - 28) + "px");
                                
                        })

                        .on("mouseout", function(d){
                                div.transition()
                                .style("opacity", 0);

                                d3.select(this)
                                .style("fill",color_scale(d.properties[variableToDisplay]))            
                        })
                        .style("stroke-width", "0.5px")
                            .on("click", function(d){

                                countryClickedBarChart = d.properties.name;
                                countryClickedDetail = d.properties.name;
                                w3_open();
                                d3.select("#container").select("svg").remove()
                                d3.select("#container1").select("svg").remove()
                                d3.select("#container2").select("svg").remove()


                                
                                let typeOfMap_ = requests[getTypeofSelection("typeOfMap",1)]



                                sideBarRequest(urlBar, parametersSelected[3], parametersSelected[2], typeOfMap_, countryClickedBarChart).then(function(result){
                                    loader.style.display = "none"
                                    results = result.data


                                    //1 scenario under multiple models(4)
                                    let scenarioForModels = results[0]
                                    //1 model under multiple scenarios(5)
                                    let modelForScenarios = results[1]
                                
                                    let resultsRegions = results[2]
                                    let keys = Object.keys(resultsRegions)
                                    let regions = keys.map(function(values){
                                                        return   { key:values,
                                                                    value: resultsRegions[values]
                                                                }
                                                        })
                                    
                                    modelForScenarios = modelForScenarios.map(function(values,i){
                                                            return {
                                                            key:"SSP"+(i+1),
                                                            value:values 
                                                            }
                                                        }
                                                        )
                                
                                    //the server provides me in this order
                                    const models  = ['cc', 'gs', 'he', 'mr']
                                
                                    scenarioForModels = scenarioForModels.map(function(values,i){
                                    return ({key: models[i], value: values})
                                    })
                                    
                                    
                                    if(regions.length == 0){
                                        document.getElementById("raw").style.display = "none"
                                        document.getElementById("Detail").style.display= "none"
                                        document.getElementById("container").style.display="none"

                                    }else{
                                        document.getElementById("raw").style.display = "block"
                                        document.getElementById("Detail").style.display = "block"
                                        document.getElementById("container").style.display="block"
                                    }
                                    generateBarChart(regions, 'container', colors[8],-5.9, 65, yLabel, titleBarChart1, "title",true,10, 200, 240)
                                    generateBarChart(modelForScenarios, 'container1', colors[8],"-0.1em","2em", yLabel, titleBarChart2, "title1",false,20,160,120)
                                    generateBarChart(scenarioForModels, 'container2', colors[8],"-0.1em","1em", yLabel, titleBarChart3, "title2",false,20, 200, 240)
                                })


                                d3.select(this).style("fill","red")
                                
                                const button = d3.select('#goBack').style('opacity',1);
                                const button1 = d3.select('#raw').style('opacity',1);
                                const button2 = d3.select('#detail').style('opacity',1);
                                const  button3 = d3.select("#normal").style('opacity',1)


                                divRawOrDetail.style("opacity",1)
                                .style("left", (d3.event.pageX-3) + "px")
                                .style("top", (d3.event.pageY - 28) + "px");

                                div.transition()
                                    .style("opacity", .0);
                                let m = d3.mouse(this),
                                    x = m[0],
                                    y = m[1];


                            informationBar.style('opacity', 1)
                            //d3.selectAll("path").remove()

                        })

    }

    function projectPoint1(x, y) {
        let point = map.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
        return point
    }


    
    function projectPoint(x, y) {
    let point = map.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
    }

    document.getElementById("normal").addEventListener("click", function(){

        const button = d3.select('#goBack').style('opacity',1)
        const button1 = d3.select('#raw').style('opacity',1)
        const button2 = d3.select('#detail').style('opacity',1)
        d3.select('#normal').style('opacity',1)

        //w3_close()
        d3.selectAll('path').remove()

        feature = g.selectAll("path")
                .data(map_data.features)
                .enter().append("path")
                .attr("d", path)
                    .style("stroke", "red")
                    .style("stroke-width", "1px")
                
                //map.setView([46.8182,8.2275],2)
                map.on("viewreset", reset);
                color_scale = produceLegend(map_data, colors)
                reset()
    })

    document.getElementById("goBack").addEventListener("click", function(){

        const button = d3.select('#goBack').style('opacity',0)
        const button1 = d3.select('#raw').style('opacity',0)
        const button2 = d3.select('#detail').style('opacity',0)
        d3.select('#normal').style('opacity',0)

        w3_close()
        d3.selectAll('path').remove()

        feature = g.selectAll("path")
                .data(map_data.features)
                .enter().append("path")
                .attr("d", path)
                    .style("stroke", "red")
                    .style("stroke-width", "1px")
                
                map.setView([46.8182,8.2275],2)
                map.on("viewreset", reset);
                color_scale = produceLegend(map_data, colors)
                reset()
    })
    });
}

document.getElementById("go3").addEventListener("click",go)

function go(){
    let selYear = document.getElementById('year'),
    selMap = document.getElementById('typeOfMap'),
    selModel = document.getElementById('model'),
    selSSP = document.getElementById('scenario')


    const selections = [selYear, selMap, selModel, selSSP],
            valuesToReturn = [];
    
    let Allgood = true
    for(let i = 0; i < selections.length; i++){
        const selectedIndex = selections[i].selectedIndex;
        
        if(selectedIndex == 0 ){
            Allgood = false
            break;	
        }

        const value = selections[i].options[selectedIndex].text

        valuesToReturn.push(value)   
    } 

    parametersSelected = valuesToReturn;

    selectedForDetailed = valuesToReturn;


    yLabel = selections[1].options[selections[1].selectedIndex].text;

    modelClicked = selections[2].options[selections[2].selectedIndex].text;
    sspClicked = selections[3].options[selections[2].selectedIndex].text;

    titleBarChart1 = yLabel + " for all regions";
    titleBarChart2 = yLabel + " for " + modelClicked+ " model with all SSPs"
    titleBarChart3 = yLabel + " for " + sspClicked+ " scenario with all models"


    let color = selections[1].options[selections[1].selectedIndex].text;



    if(Allgood){

        let mapToDisplay = requests[valuesToReturn[1]];
            variableToDisplay = mapToDisplay

        worldMapRequest('http://139.59.213.158:5000/world', valuesToReturn[3], valuesToReturn[2], mapToDisplay).then(function(results){

            loader.style.display="none"
            buildMapTop(results.data,  colorsTotal[color])
        })
        
    }else{
        alert("fill all first")
    }
}

  });
