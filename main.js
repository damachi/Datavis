


function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else {
		// `DOMContentLoaded` already fired
		action();
	}
}

let svg_height,
	svg_width,
	centered,
	width,
	height;

let svg;
let g;

let projection;

let path;
const scale =  150
const old_color = "blue",
	  center_lon = 10.143158,
	  center_lat = 46.204391

whenDocumentLoaded(() => {
	let svg_element_id = 'map-plot'
	// plot object is global, you can inspect it in the dev-console
	svg = d3.select('#' + svg_element_id);

	// may be useful for calculating scales
	

	svg_height = +svg.attr('height')
	svg_width =  +svg.attr('width')

	width = svg_width;
	height = svg_height;

	const map_promise = d3.json("data/topojson.json").then((topojson_raw) => {
		const countries_paths = topojson.feature(topojson_raw, topojson_raw.objects.countries1);
		const meshes = topojson.mesh(topojson_raw, topojson_raw.objects.countries1, function(a, b) { return a !== b; })

		return [countries_paths.features, meshes];
	});

	// svg.append("rect")
	// 		.style("fill", "#c8ece7")
	// 		.attr("width", svg_width)
	// 		.attr("height", svg_height)
	// 		.on("click", clicked)

	g  = svg.append("g")

	Promise.all([map_promise]).then((results) => {


		let map_data = results[0][0];
		let meshes = results[0][1];

		projection = d3.geoEquirectangular()
							.center([center_lon, center_lat])
							.scale(scale)
							.translate([svg_width/2, svg_height/4])
		
		path = d3.geoPath(projection)
		
		//create map using the topojson
		g.selectAll("path")
					.data(map_data)
					.enter().append("path")
					.attr("d", path)
					.attr("class","country")
					.style("fill", function(d){
						return  'blue'
					})
					.on("mouseover",function(d){
						d3.select(this)
							.style("fill", "red")
					})
					.on("mouseout", function(d){
						d3.select(this)
							.style("fill", old_color)
					})
					.on("click", clicked)
	
	});

	function clicked(d){
		let xPosition, yPosition, zoomScale;
		
		if (d && centered !== d) {
			//get center of clicked country
			let centroid = path.centroid(d);
			
			let geometry = d.geometry.coordinates
			// console.log(d.geometry.type)
			// console.log(geometry[0].length)
			
			// get the x and y coordinate
			xPosition = +centroid[0];
			yPosition = +centroid[1];

			if(d.geometry.type == 'Polygon'){
				zoomScale = 15;
			}else{
				zoomScale = 4;
			}
	
			centered = d;
		}else{
			// we didn't clicka country
			zoomScale = 1
			//reposition
			xPosition = width / 2;
			yPosition = height / 2;
			
			centered = null;

		}	

		g.transition()
			.duration(1500)
			.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + zoomScale + ")translate(" + -xPosition + "," + -yPosition + ")")
	}

});
