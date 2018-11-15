
class MapPlot {

	makeColorbar(svg, color_scale, top_left, colorbar_size, scaleClass=d3.scaleLog) {

		const value_to_svg = scaleClass()
			.domain(color_scale.domain())
			.range([colorbar_size[1], 0]);

		const range01_to_color = d3.scaleLinear()
			.domain([0, 1])
			.range(color_scale.range())
			.interpolate(color_scale.interpolate());

		// Axis numbers
		const colorbar_axis = d3.axisLeft(value_to_svg)
			.tickFormat(d3.format(".0f"))

		const colorbar_g = this.svg.append("g")
			.attr("id", "colorbar")
			.attr("transform", "translate(" + top_left[0] + ', ' + top_left[1] + ")")
			.call(colorbar_axis);

		// Create the gradient
		function range01(steps) {
			return Array.from(Array(steps), (elem, index) => index / (steps-1));
		}

		const svg_defs = this.svg.append("defs");

		const gradient = svg_defs.append('linearGradient')
			.attr('id', 'colorbar-gradient')
			.attr('x1', '0%') // bottom
			.attr('y1', '100%')
			.attr('x2', '0%') // to top
			.attr('y2', '0%')
			.attr('spreadMethod', 'pad');

		gradient.selectAll('stop')
			.data(range01(10))
			.enter()
			.append('stop')
				.attr('offset', d => Math.round(100*d) + '%')
				.attr('stop-color', d => range01_to_color(d))
				.attr('stop-opacity', 1);

		// create the colorful rect
		colorbar_g.append('rect')
			.attr('id', 'colorbar-area')
			.attr('width', colorbar_size[0])
			.attr('height', colorbar_size[1])
			.style('fill', 'url(#colorbar-gradient)')
			.style('stroke', 'black')
			.style('stroke-width', '1px')
	}

	constructor(svg_element_id) {
		this.svg = d3.select('#' + svg_element_id);

		// may be useful for calculating scales
		const svg_viewbox = this.svg.node().viewBox.animVal;
		this.svg_width = svg_viewbox.width;
		this.svg_height = svg_viewbox.height;


		const population_promise = d3.csv("data/cantons-population.csv", function(d){
	
			return {'code':d.code, 'density': +d.density}
		
		}).then((data) => {
			return data	
		});

		const map_promise = d3.json("data/ch-cantons.json").then((topojson_raw) => {
			const canton_paths = topojson.feature(topojson_raw, topojson_raw.objects.cantons);
			return canton_paths.features;
		});

		const point_promise = d3.csv("data/locations.csv", function(d){
			return {'lat': +d.lat, 'lon': +d.lon}

		}).then((data) => {
			return data
		});

		Promise.all([population_promise, map_promise, point_promise]).then((results) => {
			let cantonId_to_population = results[0];
			let map_data = results[1];
			let point_data = results[2];

			
			map_data = map_data.map((value) =>{
				
				for (let i = 0; i < cantonId_to_population.length; i++){
					//could be optimzed later
					let canton = cantonId_to_population[i]
					if(value['id'] == canton['code']){
						value['properties']['density'] = canton['density'] 
						
						return value
					}	
				}
				return value
			})

			let center_lon = 6.143158,
				center_lat = 46.204391


			const scale = 15000
			
			let projection = d3.geoEqualEarth()
								.center([center_lon, center_lat])
								.scale(scale)
								.translate([this.svg_width/7, this.svg_height/1.4])
			
			let path = d3.geoPath(projection)

			
			let min_max = d3.extent(cantonId_to_population, function(d){
				return d.density
			})
			
			const color1  =  "white",
				  color2 =   "blue"
			
			//create color scale
			let color_scale = d3.scaleLog()
								.range([color1, color2])
								.domain(min_max)
								.interpolate(d3.interpolateHcl)
			
			//create map using the topojson
			this.svg.selectAll("path")
					  .data(map_data)
					  .enter().append("path")
						.attr("d", path)
						.attr("class","canton")
						.style("fill", function(d){
							return color_scale(d.properties.density)
						})


			// Draw the canton labels
			this.svg.selectAll("text")
					.data(map_data)
					.enter().append("text")
						.attr("x", function(d){
							return path.centroid(d)[0]
						})
						.attr("y", function(d){
							return path.centroid(d)[1]
						})
						.text(function(d){
							return d.properties.name
						})
							.attr("class", "canton-label")
						
				let filter_point_data = point_data.filter((element, index) => {
					return index%4 === 0
				})

				// Draw the points
				this.svg.selectAll("circles")
						.data(filter_point_data)
						.enter().append("circle")
						.attr("class","point")
						.attr("cx",function(d){
							return projection([d.lon, d.lat])[0]
						})
						.attr("cy",function(d){
							return projection([d.lon, d.lat])[1]
						})
					    .attr("r",5)
						
				this.makeColorbar(this.svg, color_scale, [50, 30], [20, this.svg_height - 2*30]);
		});
	}
}

function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else {
		// `DOMContentLoaded` already fired
		action();
	}
}

whenDocumentLoaded(() => {
	plot_object = new MapPlot('map-plot');
	// plot object is global, you can inspect it in the dev-console
});
