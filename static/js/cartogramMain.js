
function reset() {    
    reloadCartogram(ssp, model)
}




function getTopoJsonCartogram(){
    
    return axios({
        url: 'http://139.59.213.158:5000/carto',
        method: 'get',
    })



}

let ssp = "SSP1",
    model = "cc";
function getResponseRequest(ssp, model){

    return axios({
        url: 'http://139.59.213.158:5000/carto_stat?SSP='+ssp+"&"+"model="+model,
        method: 'get',
    });
}


function reloadCartogram(ssp, model){

    d3.select("#map").select("g").remove()


    let calorie = document.getElementById("calories"),
        diffCalorie = document.getElementById("diff_calories"),
        temperature = document.getElementById("temperature"),
        workIndex = document.getElementById("workability"),
        altitude = document.getElementById("altitude"),
        resetButton = document.getElementById("reset");


    let radioButtons= [resetButton,calorie, diffCalorie, temperature, workIndex, altitude]

    for(let i = 0 ; i < radioButtons.length; i++){
        radioButtons[i].onclick = handler
    }



    let clickedRadioButton = "calories"

    function handler(){
        if(this.id == 'reset'){
            reset()
        }else{
            update(this.id)
        }
    }

    let colors = [

        
        'rgb(222,235,247)',
        'rgb(198,219,239)',
        'rgb(158,202,225)',
        'rgb(107,174,214)',
        'rgb(66,146,198)',
        'rgb(33,113,181)',
        'rgb(8,81,156)',
        'rgb(8,48,107)',
    ];


    let keys = ['calories', 'diff_calories', 'temperature', 'workability', 'altitude']

    let body = d3.select("body"),
            stat = d3.select("#status");


    let map = d3.select("#map"),
            layer = map.append("g")
                    .attr("id", "layer"),
            countries = layer.append("g")
                    .attr("id", "countries")
                    .selectAll("path");


    updateZoom();

    function updateZoom() {
        let scale = 1.4
        layer.attr("transform",
                "translate(" + 9 +","+ 72 + ") " +
                        "scale(" + [scale,  scale] + ")");
    }

    let proj = d3.geoMercator(),
            topology,
            geometries,
            rawData,
            dataById = {},
            carto = d3.cartogram()
                    .projection(proj)
                    .properties(function(d) {
                        d_id = '$'+d.id
                        if (d_id in dataById) {
                            return dataById[d_id];
                        } else {

                            let tmp = d3.keys(dataById[d3.keys(dataById)[0]]);
                            let ret = {"numcode": d.id};
                                tmp.forEach(function(i){ret[i] = 0});
                            return ret;
                        }
                    })
                    // .value(function(d) {
                    //     return +d.properties.calories;
                    // });

    let url =  "data/world-110m.json"
    
    let url2 = "response.json"

    let parameters = ['calories', 'diff_calories', 'temperature', 'workability', 'altitude', 'precipitation']
    /*hear read the big json given by the server */ 


    getResponseRequest(ssp, model).then(function(d){
        csv = d.data

        //.then(function(topo) {
        getTopoJsonCartogram().then(function(topo){
            topology = topo.data;
            geometries = topology.objects.countries.geometries


            //read template given by the server where we will match by id
            d3.csv("../static/test.csv").then(function(data) {

                //console.log(data)
                data = data.map(function(value){

                    if(csv.hasOwnProperty(value['country'])){
                        values = csv[value['country']]
                        for(let i = 0; i < parameters.length; i++){
                            let param = parameters[i];
                            value[param] = values[i]   
                        }
                    }else{
                        for(let i = 0; i < parameters.length; i++){
                            let param = parameters[i];
                            value[param] = 0;
                        }
                    }

                    return value
                })




                rawData = data;

                dataById = d3.nest()
                        .key(function(d) {return d.numcode; })
                        .rollup(function(d) {return d[0]; })
                        .map(data); 
                init();
            });
        });

    })

    function getColorScale(key, colors){

        const value = function(d) {

                return +d.properties[key];
            },
        values = countries.data()
            .map(value)
            .filter(function(n) {
                return !isNaN(n);
            })
            .sort(d3.ascending),

        lo = values[0],
        hi = values[values.length - 1];

        let colorScaleInternal = d3.scaleQuantize()
            .range(colors)
            .domain([lo, hi]);

        let color = function(value) {
        return !!value ? colorScaleInternal(value) : 'rgb(247,251,255)';
        };


        return [colorScaleInternal, color, lo, hi,value]
    }

    function init() {
        let features = carto.features(topology, geometries),
                path = d3.geoPath()
                        .projection(proj);

        countries = countries.data(features)
                .enter()
                .append("path")
                .attr("class", "country")
                .attr("id", function(d) {
                    return d.id;
                })
                .on("mouseover", function(d){
                    d3.select(this).style("opacity","0.1")
                })
                .on("mouseout", function(d){
                d3.select(this).style("opacity", 1)
                })
                .attr("name", function(d) {
                    return d.properties.country;
                })
                .attr("d", path)
        
        let colorScale = getColorScale('calories',colors)
        let colorScaleInternal = colorScale[0],
            color_ = colorScale[1]

        countries.attr("fill", function(d){
            return color_(d.properties.calories)

        })
                
        createLegend(colorScaleInternal)
        countries.append("title");
    }


    function createLegend(colorScaleInternal){
        d3.select("#legendsvg").remove()

        let svgs = d3.select("#cartogramLegend").append("svg")
        svgs.attr("id","legendsvg")

            svgs.append("g")
            .attr("class", "legendQuant")
                                    
        let colorLegend = d3.legendColor()
                                .labelFormat(d3.format(",.0f"))
                                .scale(colorScaleInternal);

        svgs.select(".legendQuant")
            .call(colorLegend);
    }

    function update(key) {

        clickedRadioButton = key;
        let colorScale = getColorScale(key,colors)
        const lo = colorScale[2],
            hi = colorScale[3];

        const value = colorScale[4]

        let colorScaleInternal = colorScale[0],
            color = colorScale[1];

        createLegend(colorScaleInternal)


        
        // normalize the scale to positive numbers
        let scale = d3.scaleLinear()
                .domain([lo, hi])
                .range([1, 100]);

        
        console.log(lo, hi)

        // tell the cartogram to use the scaled values
        carto.value(function(d) {
            let v = value(d)
            return scale(v);
        });

        // generate the new features, pre-projected
        let features = carto(topology, geometries).features;

        // update the data
    countries.data(features)
        countries.transition()
                .duration(3050)
                .ease(d3.easeLinear)
                .attr("fill", function(d) {

                    return color(value(d));
                })
                .attr("d", carto.path)

        countries.on("mouseover", function(d){
                    d3.select(this).style("opacity","0.1")
                })
                .on("mouseout", function(d){
                d3.select(this).style("opacity", 1)
                });

        countries.on("mouseover",function(d){
            console.log(value(d)/1000)
        })
    }

    let deferredUpdate = (function() {
        let timeout;
        return function() {
            let args = arguments;
            clearTimeout(timeout);
            return timeout = setTimeout(function() {
                update.apply(null, arguments);
            }, 10);
        };
    })();
}

reloadCartogram(ssp,model)