/* 
	I've created a function here that is a simple d3 chart.
	This could be anthing that has discrete steps, as simple as changing
	the background color, or playing/pausing a video.
	The important part is that it exposes and update function that
	calls a new thing on a scroll trigger.
*/

//d3.json('data/state_full.json').then(function(data){
    window.createGraphic = function(graphicSelector) {
	
        var colors = ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"]
        var graphicEl = d3.select('.graphic')
        var graphicVisEl = graphicEl.select('.graphic__vis')
        var graphicProseEl = graphicEl.select('.graphic__prose')
    
    
        
        var margin = 20
        var size = 800
        var chartSize = size - margin * 2
        var scaleX = null
        var scaleR = null
        var minR = 10
        var maxR = 24
    
        // actions to take on each step of our scroll-driven story
        var steps = [
            function step0(data) {
                console.log("step0")
                console.log(data)
                // circles are centered and small
                // var t = d3.transition()
                // 	.duration(800)
                // 	.ease(d3.easeQuadInOut)
                // // Add Y axis
                // var y = d3.scaleBand()
                // .range([ size,0 ])
                // .domain(data.map(function(d) { return d.state_name; }))
                // .padding(1);
    
                // // Add X axis
                // var x = d3.scaleLinear()
                // .domain([0, max_salary_pay])
                // .range([ 0, size-margin]);
                
                // var max_salary_pay = d3.max(data, d=> d.median_salary_full)
    
                // // Add Y axis
                // var y = d3.scaleBand()
                // .range([ (size-(2*margin)),0 ])
                // .domain(data.map(function(d) { return d.state_name; }))
                // .padding(1);
    
                // // Add X axis
                // var x = d3.scaleLinear()
                // .domain([0, max_salary_pay])
                // .range([ 0, size-150-margin]);
                
                // // circles are positioned
                // var salary_chart = graphicVisEl.select('.chart');
                // console.log(salary_chart)
                // salary_chart.selectAll('circle')
                // 	.data(data)
                // 	.enter().append('circle')
                // 	.transition(t)
                // 	.attr("cy", function(d) { return y(d.state_name); })
                // 	.attr("cx", function(d) { return x(d.median_salary_full); })
                // 	.attr("r", "4")
                // 	.style("fill", "#69b3a2");
            
    
            },
    
            function step1(data) {
                console.log("step1")
                var t = d3.transition()
                    .duration(1000)
                    .ease(d3.easeQuadInOut)
                // Add Y axis
                var y = d3.scaleBand()
                .range([ size,0 ])
                .domain(data.map(function(d) { return d.state_name; }))
                .padding(1);
    
                // Add X axis
                var x = d3.scaleLinear()
                .domain([0, max_salary_pay])
                .range([ 0, size-margin]);
                
                var max_salary_pay = d3.max(data, d=> d.median_salary_full)
    
                // Add Y axis
                var y = d3.scaleBand()
                .range([ (size-(2*margin)),0 ])
                .domain(data.map(function(d) { return d.state_name; }))
                .padding(1);
                //var sorted_data = data.sort((a,b) => d3.ascending(a.median_salary_full, b.median_salary_full))
                // Add X axis
                var x = d3.scaleLinear()
                .domain([0, max_salary_pay])
                .range([ 0, size-150-margin]);
                // circles are positioned
                var salary_chart = graphicVisEl.select('.chart');
                var salary_exit = salary_chart.selectAll('circle').data(data)
    
                salary_chart.selectAll("line")
                    .attr('stroke-width', 0)
    
                var salary = salary_exit.enter().append('circle')
                            .style("fill", colors[0]);
                    salary.merge(salary_exit)
                    .transition(t)
                    .attr("cy", function(d) { return y(d.state_name); })
                    .attr("cx", function(d) { return x(d.median_salary_full); })
                    .attr("r", "6")
                    .style("fill", colors[0]);
    
                    salary_exit.exit().remove()
                    salary_chart.selectAll("line").exit().transition(t).remove()
                
            },
    
            function step2(data) {
                console.log("step2")
                //var sorted_data = data.sort((a,b) => d3.ascending(a.salary_gender_gap, b.salary_gender_gap))
    
                var t = d3.transition()
                    .duration(1000)
                    .ease(d3.easeQuadInOut)
                // Add Y axis
                var y = d3.scaleBand()
                .range([ size,0 ])
                .domain(data.map(function(d) { return d.state_name; }))
                .padding(1);
    
                // Add X axis
                var x = d3.scaleLinear()
                .domain([0, max_salary_pay])
                .range([ 0, size-margin]);
                
                var max_salary_pay = d3.max(data, d=> d.median_salary_full)
    
                // Add Y axis
                var y = d3.scaleBand()
                .range([ (size-(2*margin)),0 ])
                .domain(data.map(function(d) { return d.state_name; }))
                .padding(1);
    
                // Add X axis
                var x = d3.scaleLinear()
                .domain([0, max_salary_pay])
                .range([ 0, size-150-margin]);
                // circles are positioned
                var salary_chart = graphicVisEl.select('.chart');
                var salary_y_axis = graphicVisEl.select('yaxis');
                salary_y_axis.selectAll("text").data(data)
                .sort((a,b) => d3.ascending(a.salary_gender_gap, b.salary_gender_gap))
    
                var gap_line = salary_chart.selectAll("myline").data(data)
                .enter().append("line");
    
                gap_line
                .attr("x1", function(d) { return x(d.median_salary_male); })
                .attr("x2", function(d) { return x(d.median_salary_female); })
                .attr("y1", function(d) { return y(d.state_name); })
                .attr("y2", function(d) { return y(d.state_name); })
                .attr("stroke", "grey")
                .attr("stroke-width", "0px")
                gap_line
                .transition(t)
                .attr("stroke-width", "2px")
    
                var femcircle = salary_chart.selectAll("thecircle").data(data)
                .enter().append('circle')
                femcircle.attr("cy", function(d) { return y(d.state_name); })
                .attr("cx", function(d) { return x(d.median_salary_female); })
                .attr("r", 0)
            
                femcircle
                .transition(t)
                .attr("r","6")
                .style("fill", colors[4]);
    
                salary_chart.selectAll('circle').data(data)
                    .transition(t)
                    .attr("cy", function(d) { return y(d.state_name); })
                    .attr("cx", function(d) { return x(d.median_salary_male); })
                    .attr("r", "6")
                    .style("fill", colors[1]);
    
                salary_chart.selectAll("thecircle")
                    .exit().transition(t).remove()
                salary_chart.selectAll("myLine")
                    .exit().transition(t).remove()
            },
            function step3(data) {
                console.log('step3')
                console.log(data)
                // sankey = d3.sankey()
                // 	.nodeSort(null)
                // 	.linkSort(null)
                // 	.nodeWidth(4)
                // 	.nodePadding(20)
                // 	.extent([[0, 5], [width, height - 5]])
    
    
    
            },
            function step4() {
                var t = d3.transition()
                    .duration(800)
                    .ease(d3.easeQuadInOut)
    
                // circles are sized
                var item = graphicVisEl.selectAll('.item')
                
                item.select('circle')
                    .transition(t)
                    .delay(function(d, i) { return i * 200 })
                    .attr('r', function(d, i) {
                        return scaleR(d)
                    })
    
                item.select('text')
                    .transition(t)
                    .delay(function(d, i) { return i * 200 })
                    .style('opacity', 1)
            },
        ]
    
        // update our chart
        function update(step) {
            if (steps < 3){
                d3.json('data/state_full.json').then(function(data){
                    steps[step](data)
                })
            }
            else if (step == 3) {
                d3.json('data/edu_full.json').then(function(data){
                    steps[step](data)
                })
            }
        }
        
        // little helper for string concat if using es5
        function translate(x, y) {
            return 'translate(' + x + ',' + y + ')'
        }
    
        function setupCharts(data) {
            console.log("setupCharts")
            var svg = graphicVisEl.append('svg')
                    .attr('width', size + 'px')
                    .attr('height', size + 'px')
        
                var max_salary_pay = d3.max(data, d=> d.median_salary_full)
    
    
                // Add Y axis
                var y = d3.scaleBand()
                .range([ size,0 ])
                .domain(data.map(function(d) { return d.state_name; }))
                .padding(1);
    
                // Add X axis
                var x = d3.scaleLinear()
                .domain([0, max_salary_pay])
                .range([ 0, size-margin]);
                
                var max_salary_pay = d3.max(data, d=> d.median_salary_full)
    
                // Add Y axis
                var y = d3.scaleBand()
                .range([ (size-(2*margin)),0 ])
                .domain(data.map(function(d) { return d.state_name; }))
                .padding(1);
    
                // Add X axis
                var x = d3.scaleLinear()
                .domain([0, max_salary_pay])
                .range([ 0, size-150-margin]);
    
                var chart = svg.append('g')
                    .classed('chart', true)
                    .attr("transform", "translate(150," + margin + ")")
    
                chart.append('g')
                    .classed('xaxis', true)
                    .attr('transform', 'translate(0,' + (size-(2*margin)) + ')')
                    .call(d3.axisBottom(x));
                
                chart.append('g')
                .classed('yaxis', true)
                .call(d3.axisLeft(y))
                .selectAll("text")
                .style("text-anchor", "end");
    
    
        }
    
        function setupProse() {
            var height = window.innerHeight * 0.5
            graphicProseEl.selectAll('.trigger')
                .style('size', height + 'px')
        }
    
        function init() {
            d3.json('data/state_full.json').then(function(data){
                setupCharts(data)
                setupProse(data)
                update(0)
            })
        }
        
        init()
    
        return {
            update: update,
        }
    
    //
    }
    