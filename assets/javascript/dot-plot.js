d3.json('/data/state_full.json').then(function(data){ 
    

var extent_state = d3.extent(data, d => d.state_name);
var extent_salary_pay = d3.extent(data, d=> d.median_salary_full)
var max_salary_pay = d3.max(data, d=> d.median_salary_full)

var t = d3.transition().duration(1000).ease(d3.easeElastic)
var svg = d3.select('svg')
    .append('g').attr("transform", "translate(150,50)")
var margin = {top: 10, right: 30, bottom: 90, left: 40}
   // width = 960 - margin.left - margin.right,
    //height = 600 - margin.top - margin.bottom;

var width = 650
var height = 650



// Add Y axis
var y = d3.scaleBand()
  .range([ height,0 ])
  .domain(data.map(function(d) { return d.state_name; }))
  .padding(1);

// Add X axis
var x = d3.scaleLinear()
  .domain([0, max_salary_pay])
  .range([ 0, width-50]);

svg.append("g")
.attr("transform", "translate(0," + (height)+")")
.call(d3.axisBottom(x));

// Axis Y

svg.append("g")
  .call(d3.axisLeft(y))
  //.attr("transform", "translate(150, 50)")
  .selectAll("text")
  .style("text-anchor", "end");
   // .attr("transform", "translate(-10,0)rotate(-45)")



function update_gender_gap() {
    console.log("gender_gap chart")
    

    var gap_line = svg.selectAll("myline")
    .data(data).enter().append("line")
    .sort(function(a, b) {
        return b.salary_gender_gap - a.salary_gender_gap;
      });
    gap_line
    .attr("x1", function(d) { return x(d.median_salary_male); })
    .attr("x2", function(d) { return x(d.median_salary_female); })
    .attr("y1", function(d) { return y(d.state_name); })
    .attr("y2", function(d) { return y(d.state_name); })
    .attr("stroke", "grey")
    .attr("stroke-width", "0px")
    gap_line
    .transition().duration(1000)
    .attr("stroke-width", "2px")


    // Circle salary female
    var femcircle = svg.selectAll("thecircle")
    .data(data).enter().append('circle')
    .sort(function(a, b) {
        return b.salary_gender_gap - a.salary_gender_gap;
      });
    femcircle.attr("cy", function(d) { return y(d.state_name); })
    .attr("cx", function(d) { return x(d.median_salary_female); })
    .attr("r", 0)

    femcircle
    .transition().duration(1000).ease(d3.easeElastic)
    .attr("r","6")
    .style("fill", "#d700d7");

    svg.selectAll("circle")
    .data(data)
    .sort(function(a, b) {
        return b.salary_gender_gap - a.salary_gender_gap;
      })
    .transition().duration(1000).ease(d3.easeElastic)
    .attr("cy", function(d) { return y(d.state_name); })
    .attr("cx", function(d) { return x(d.median_salary_male); })
    .attr("r", "6")
    .style("fill", "#00c100");

    
    svg.selectAll("thecircle")
    .data(data).exit().remove()
    svg.selectAll("myLine")
    .data(data).exit().remove()

}



// Circle salary full

function median_salary(){

    console.log("median chart")

    var salary_exit = svg.selectAll('circle').data(data)
    

    var salary = salary_exit.enter().append('circle')
    .style("fill", "#69b3a2");

    salary.merge(salary_exit)
    .transition().duration(1000).ease(d3.easeLinear)
    .attr("cy", function(d) { return y(d.state_name); })
    .attr("cx", function(d) { return x(d.median_salary_full); })
    .attr("r", "4")

    salary_exit.exit().remove()
    svg.selectAll("line").data(data).exit().remove()
    
}


svg.selectAll('circle')
    .data(data).enter().append('circle')
    .sort(function(a, b) {
        return b.median_salary_full - a.median_salary_full;
      })
    .transition().duration(1000).ease(d3.easeElastic)
    .attr("cy", function(d) { return y(d.state_name); })
    .attr("cx", function(d) { return x(d.median_salary_full); })
    .attr("r", "4")
    .style("fill", "#69b3a2");
// update_gender_gap()

// ###### DROP DOWN ########

var salaryDropDown = d3.select("select")
  .attr("class", "salary-drop-down");


salaryDropDown.selectAll("option")
  .data(['Median Salary', 'Gender Pay Gap'])
  .enter()
  .append("option")
  .text(function (d) { return d; })
  .attr("value", function (d) { return d; });



// When the button is changed, run the updateChart function
salaryDropDown.on("change", function(d) {
    // recover the option that has been chosen
    var selectedOption = d3.select(this).property('value')
    console.log(selectedOption)
    selectedOption == 'Gender Pay Gap' ? update_gender_gap() : median_salary()
})


})