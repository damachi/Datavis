let v = 2000;
let countryScales = {
Russia	: v,
Canada	: v,
China	:v,
Brazil:	v,
Australia	:v,
India	:v,
Argentina:	v,
Kazakhstan:	v,
Algeria	:v,
Mexico	:v,
Indonesia:	v,
Sudan	:v,
Libya	:v,
Iran	:v,
Mongolia:	v,
Peru	: v,
Chad	:v,
Niger	:v,
Angola	:v,
Mali:   v,
Colombia	:v,
Ethiopia	:v,
Mauritania	:v,
Egypt	:v,
Tanzania:v,
}

let scaleToUse;

countryScales['United States'] = v
countryScales['South Africa'] = v
countryScales['Saudi Arabia'] = v

loader = document.getElementById("loader")

function getSelected(year, map, model, ssp){
	
	let selYear = document.getElementById(year),
		selMap = document.getElementById(map),
		selModel = document.getElementById(model),
		selSSP = document.getElementById(ssp);

	const selections = [selYear, selMap, selModel, selSSP],
		valuesToReturn = [];
		
	for(let i = 0; i < selections.length; i++){
		const selectedIndex = selections[i].selectedIndex;
		
		if(selectedIndex.value == 0 ){
			return null;
		}

		const value = selections[i].options[selectedIndex].text
		valuesToReturn.push(value)
	}

	return valuesToReturn
}

function pointsPerCountryRequest(country, sspChoice, modelChoice){
	loader.style.display = "block"
	return axios({
		url: 'http://139.59.213.158:5000/points_country',
		method:'post',
		data:{
			SSP: sspChoice,
			climate_model: modelChoice,
			stats:{
				variable:["Calories2050"],
				countries:[country]
			}
		}
	})
}


const divid2data = {precipitation:"precipitation", altitudes:"altitude", temperatures: "temperature", workability_index:"workability_index"}

function compare(topoJsonToRead, countryClicked){

	let div = d3.select('#circle_tool_tip')

	let defaultPrecipitation = 771.0,
		defaultAltitude = 294.0,
		defaultTemperature = -36.0,
		defaultWorkability = 1.0;

	let sliderPrecipitation;
	let sliderAltitude;
	let sliderTemperature;
	let sliderWorkabilityIndex;

	let objectName = countryClicked.toLowerCase()+"_adm1"

	let circle1;
	let circle2;

	function createPath(g,adm1, path, clicked, us, name){

		g.selectAll(name)
		.data(topojson.feature(us, us.objects[adm1]).features)
		.enter().append("path")
			.attr("d", path)
			.attr("class", "feature")
			.on("click", clicked)
			.on("mouseenter",function(){
				d3.select(this)
				.style('fill-opacity','1')
				.style('fill','orange')

			})
			.on("mouseleave",function(){
				d3.select(this)
				.style('fill-opacity','1')
				.style('fill','#ccc')
			})
	}
	

	function parsetoJsonPoints(file){


		return file.map(function(d){
			return {
				lat: -1*+d[0],
				lon: +d[1],
				calories :+d[2],
				precipitation: +d[3],
				temperature: +d[4],
				altitude: +d[6],
				workability_index:+d[5],
			}
		});
	}


	function createCircles(g,name,points, radius, projection, admin,path,topo, info){

			
		let circles1 = g.selectAll(name)
						.data(points)
						.enter().append("circle")
						.attr("cx", function(d){
							return projection([d.lon, d.lat])[0]
						})
						.attr("cy",function(d){
							return projection([d.lon, d.lat])[1]
						})
						.attr("r",radius)
						.style("fill",function(){
							return "red"
							
						})
						.attr("opacity", function(d){
							if(d['calories'] > 0 && d['precipitation'] >= defaultPrecipitation && d['altitude'] >= defaultAltitude && d['temperature'] >= defaultTemperature && d['workability_index'] >= defaultWorkability){
								return 1;
							}else{
								return 0;
							}
						
						})
						.on("mouseover", function(d){


							let calories =d3.format(".2s")(d['calories']).replace("M", " Million").replace("G", " Billion").replace("T", " Trillion")
							div.style("opacity", .9);
							div.html("<p class=compareP>"+"Calories: "+"<span class=vCompare>"+calories+"</span>"+ "</p>"+
									"<p class=compareP>"+"Precipitation: "+ "<span class=vCompare>"+d['precipitation']+ "mm</span>"+ "</p>"+
									"<p class=compareP>"+"Altitude: " + "<span class=vCompare>"+ d['altitude'] + "m</span>"+"</p>"+
									"<p class=compareP>"+"Temperature: " + "<span class=vCompare>"+d['temperature']+"°F</span>"+"</p>"+
									"<p class=compareP>"+"Workability Index: " + "<span class=vCompare>"+ d['workability_index']+ "</span>"+"</p>"
									)
								.style("left", info + "px")
								//.style("top", (d3.event.pageY - 28) + "px");
							d3.select(this).style("fill","blue")
						})
						.on("mouseout", function(){

							div.transition()
								.style("opacity", 0);
							d3.select(this).style("fill","red")
						});

						g.append("path")
							.datum(topojson.mesh(topo, topo.objects[admin], function(a, b) { return a !== b; }))
								.attr("class", "mesh")
								.attr("d", path);

		return circles1
	}

	let usaPoints;

	let data1;
	let data2;

	let country= countryClicked;

	if(countryScales.hasOwnProperty(countryClicked)){
		scaleToUse = countryScales[countryClicked]
			
	}else{
		scaleToUse = 3000
	
	}
	
	document.getElementById('button1').addEventListener('click',function(){

		let values = getSelected('selectYear', 'selectMap', 'selectModel', 'selectSSP')

		if(values != null){

			
			//get selected choice for the compare part
			let sspChoice = values[3];
			let modelChoice = values[2];
	
			let allPoints = pointsPerCountryRequest(country, sspChoice, modelChoice).then(function(results){
				loader.style.display = "none";

				return parsetoJsonPoints(results.data);
			}).catch((r)=>{
				location.reload();
			})

			
			d3.select('#svg').remove()
			
			let width =  600,
				height = 500,
				active = d3.select(null);


			console.log(country)
			let center= centerForCountry[country]
			

			let center_lon= center[0],
				center_lat = center[1]

			

			let projection = d3.geoMercator() // updated for d3 v4
						.center([center_lon, center_lat])
						.scale(scaleToUse)
						.translate([width / 2, height / 2]);

			
			let zoom = d3.zoom()
				.scaleExtent([1, 8])
				.on("zoom", zoomed);


			let path = d3.geoPath() // updated for d3 v4
						.projection(projection);
			
			let svg = d3.select("#compareSlider").append("svg")
						.attr("id",'svg')
						.attr("width", width)
						.attr("height", height)
						.on("click", stopped, true);

				svg.append("rect")
					.attr("class", "background")
					.attr("width", width)
					.attr("height", height)
					.on("click", reset);

			let g = svg.append("g");

			svg
			.call(zoom); 
			//read topojson

			const c1 = topoJsonToRead;



			//usaPoints = readfile('swiss_points.csv')

			Promise.all([allPoints]).then((results)=>  {

				let us = c1,
					points = results[0];
					data1 = results[0];

				
				console.log(points)
				//create topojson map
				createPath(g, objectName, path, clicked, us,'path0')

				//add circles or to map
				circle1 = createCircles(g, 'circles2', points, 2, projection, objectName, path, us,0)
				createLabels(g, "text1", us, objectName, path)

			}).catch(r=>{
				location.reload();
			});

			function clicked(d) {
				if (active.node() === this) return reset();
				active.classed("active", false);
				active = d3.select(this).classed("active", true);

				let bounds = path.bounds(d),
					dx = bounds[1][0] - bounds[0][0],
					dy = bounds[1][1] - bounds[0][1],
					x = (bounds[0][0] + bounds[1][0]) / 2,
					y = (bounds[0][1] + bounds[1][1]) / 2,
					scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
					translate = [width / 2 - scale * x, height / 2 - scale * y];

				svg.transition()
					.duration(750)

					.call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) ); 
					
			}

			function reset() {
				active.classed("active", false);
				active = d3.select(null);

				svg.transition()
					.duration(750)
					.call( zoom.transform, d3.zoomIdentity ); // updated for d3 v4
			}

			function zoomed() {
				d3.selectAll()
				g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
				g.attr("transform", d3.event.transform); // updated for d3 v4
			}

	}else{
		alert("Fill everything first")
	}

	});

	let usaPoints2;

	document.getElementById('button2').addEventListener('click',function(){


		let values = getSelected('selectYear1', 'selectMap1', 'selectModel1', 'selectSSP1')

		//let sspChoice = values[3];
		//let modelChoice = values[2];
	   	if(values != null){
		   //get selected choice for the compare part
		   let sspChoice = values[3];
		   let modelChoice = values[2];
   
		   let allPoints = pointsPerCountryRequest(country, sspChoice, modelChoice).then(function(results){
				loader.style.display = "none"
			   return parsetoJsonPoints(results.data);
		   }).catch(r=>{
			   location.reload()
		   });

		d3.select('#svg1').remove()



		let width1 =  600,
			height1 = 500,
			active1 = d3.select(null);

			
			let center_lon1 = centerForCountry[country][0],
				center_lat1 = centerForCountry[country][1]

		let projection1 = d3.geoMercator() // updated for d3 v4
					.center([center_lon1, center_lat1])
					.scale(scaleToUse)
					.translate([width1 / 2, height1 / 2]);

		let zoom1 = d3.zoom()
					.scaleExtent([1, 8])
					.on("zoom", zoomed1);

		let path1 = d3.geoPath() // updated for d3 v4
					.projection(projection1);
						
		let svg1 = d3.select("#compareSlider").append("svg")
					.attr('id','svg1')
					.attr("width", width1)
					.attr("height", height1)
					.on("click", stopped, true);

			
			svg1.append("rect")
				.attr("class", "background1")
				.attr("width", width1)
				.attr("height", height1)
				.on("click", reset1);

		let g1 = svg1.append("g");

		svg1
		.call(zoom1);
		
		
		const c2 = topoJsonToRead;
			//usaPoints2 = readfile("swiss_points2.csv")

			
		Promise.all([allPoints]).then((results)=>  {



			let us = c2,
				points = results[0];
				data2 = results[0];

	
			//create 4 sliders at this point
			createPath(g1, objectName, path1, clicked1, us, 'path1' )

			//console.log(data1)

			getMiniumValues(data1, data2)

			circle1.style("opacity",function(d){

				if((d['calories'] > 0) && (d['precipitation'] >= defaultPrecipitation) && (d['temperature']>= defaultTemperature) && (d['altitude'] >= defaultAltitude) && (d['workability_index'] >= defaultWorkability)){
					return 1;
				}else{
					return 0;
				}	
			})
			
			circle2 = createCircles(g1, 'circles2', points, 2, projection1, objectName, path1, us, 680)
			createLabels(g1, "text2", us, objectName, path1)


			sliderPrecipitation = createSlider(data1, data2, 'precipitation', circle1, circle2)
			sliderAltitude = createSlider(data1, data2,'altitudes', circle1, circle2)
			sliderTemperature = createSlider(data1, data2, 'temperatures', circle1, circle2)
			sliderWorkabilityIndex = createSlider(data1, data2, 'workability_index', circle1, circle2)

			

		}).catch(r=>{
			location.reload()
		});

		function clicked1(d) {
			if (active1.node() === this) return reset1();
			active1.classed("active", false);
			active1 = d3.select(this).classed("active", true);

			let bounds = path1.bounds(d),
				dx = bounds[1][0] - bounds[0][0],
				dy = bounds[1][1] - bounds[0][1],
				x = (bounds[0][0] + bounds[1][0]) / 2,
				y = (bounds[0][1] + bounds[1][1]) / 2,
				scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width1, dy / height1))),
				translate = [width1 / 2 - scale * x, height1 / 2 - scale * y];

			svg1.transition()
				.duration(750)
				.call( zoom1.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) ); // updated for d3 v4
				
		}

		function reset1() {
			active1.classed("active", false);
			active1 = d3.select(null);

			svg1.transition()
				.duration(750)
				// .call( zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1) ); // not in d3 v4
				.call( zoom1.transform, d3.zoomIdentity ); // updated for d3 v4
		}

		let circleScale = d3.scaleLinear()
							.domain([500,4500])
		function zoomed1() {


			g1.style("stroke-width", 1.5 / d3.event.transform.k + "px");
			// g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); // not in d3 v4
			g1.attr("transform", d3.event.transform); // updated for d3 v4
		}
	}
	});


	function getMiniumValues(data1, data2){

		const divid = ["precipitation", "temperature", "altitude", "workability_index"]
		let mins = []

		for(let i = 0; i < divid.length ; i++){

			let min_max1 = d3.extent(data1, function(d){return d[divid[i]]}),
				min1 = min_max1[0];

			let min_max2 = d3.extent(data2, function(d){ return d[divid[i]]}),
				min2 = min_max2[0];

			let min = min1 < min2 ? min1 : min2

			mins.push(min)
		}

		defaultPrecipitation = mins[0]
		defaultTemperature = mins[1]
		defaultAltitude = mins[2]
		defaultWorkability = mins[3]

	}

	function createSlider(data1, data2, divid, circle1, circle2){

		let extent = divid2data[divid]

		let min_max1 = d3.extent(data1, function(d){return d[extent]}),
			min1 = min_max1[0],
			max1 = min_max1[1];
		
		let min_max2 = d3.extent(data2, function(d){ return d[extent]}),
			min2 = min_max2[0],
			max2 = min_max2[1];

		
		let min = min1 < min2 ? min1 : min2
		let max = max1 < max2 ? max2 : max1



		let slider1 = d3.sliderHorizontal()
					.min(min)
					.max(max)
					.width(250)
					.tickFormat(d3.format('.1f'))
					.ticks(3)
					.default(min)
					.on('onchange', () => {


						circle1.style("opacity", function(d){

							//get compare the values on the slide vs the circles so circles values > values on slider
							if((d['calories'] > 0) &&(d['precipitation'] >= sliderPrecipitation.value()) && (d['temperature']>= sliderTemperature.value()) && (d['altitude'] >= sliderAltitude.value()) && (d['workability_index'] >= sliderWorkabilityIndex.value())){
								return 1;
							}else{
								return 0;
							}	
						})

						circle2.style("opacity", function(d){
							if((d['calories'] > 0) &&(d['precipitation'] >= sliderPrecipitation.value()) && (d['temperature']>= sliderTemperature.value()) && (d['altitude'] >= sliderAltitude.value()) && (d['workability_index'] >= sliderWorkabilityIndex.value())){
								return 1;
							}else{
								return 0;
							}	
						})

						
						
					});

			
			d3.select("#"+divid).select("svg").remove();

			let group1 = d3.select('#'+divid).append("svg")
							.attr("width", '100%')
							.attr("height", 100)
							.append("g")
							.attr("transform", "translate(30,30)");
							group1.call(slider1)
		

			return slider1;
	}

	// If the drag behavior prevents the default click,
	// also stop propagation so we don’t click-to-zoom.
	function stopped() {
	if (d3.event.defaultPrevented) d3.event.stopPropagation();
	}
}


function topoJsonPerCountry(country_){

	return axios({
		url: 'http://139.59.213.158:5000/get_topo?Country='+country_,
		method: 'get',
		data: {
		foo: 'bar'
		}
	});

}

