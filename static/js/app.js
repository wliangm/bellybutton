function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var metaUrl = `/metadata/${sample}`;
  var metaData = d3.json(metaUrl).then(data=> {
    console.log(data);

    // Use d3 to select the panel with id of `#sample-metadata`
    var metaPanel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    $("#sample-metadata").html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    //http://127.0.0.1:5000/

    var metaArray = Object.entries(data);
    console.log(metaArray);

    metaArray.forEach(([key,value]) => {
      var pairItem = metaPanel.append("p");
      pairItem.text(`${key}: ${value}`);
      console.log(`${key}: ${value}`);
    });
    // BONUS: Build the Gauge Chart (codes for gauge chart is given from bonus.js?!)
    buildGauge(data.WFREQ);
  });


};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var sampleUrl = `/samples/${sample}`;
  var sampleData = d3.json(sampleUrl).then(data=> {
    console.log(data);


    // @TODO: Build a Bubble Chart using the sample data
    //Use otu_ids for the x values
    var x_otu_ids = data["otu_ids"];
    console.log(x_otu_ids);
    //Use otu_labels for the text values
    var text_otu_labels = data["otu_labels"];
    console.log(text_otu_labels);
    //Use sample_values for the y values
    var y_sample_values = data["sample_values"];
    console.log(y_sample_values);

    //Use sample_values for the marker size
    //Use otu_ids for the marker colors
    var bubble_trace = {
      x: x_otu_ids,
      y: y_sample_values,
      mode: "markers",
      type: "scatter",
      marker: {
        size: y_sample_values,
        color: x_otu_ids,
        colorscale: "rainbow"
      },
      text: text_otu_labels,
    };

    var bubblyLayout = {
      title: 'OTU vs. Sample Values',
      showlegend: false,
      yaxis: {autorange: true}
    };
    var bubbleData = [bubble_trace];
    Plotly.newPlot("bubble", bubbleData,bubblyLayout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var top10_samplevalues = data["sample_values"].slice(0,9);
    console.log(top10_samplevalues );
    var top10_otu_labels = data["otu_ids"].slice(0,9);
    console.log(top10_otu_labels);
    var top10_hover = data["otu_labels"].slice(0,9);

    var pieData = [{
      values: top10_samplevalues,
      labels: top10_otu_labels,
      type: "pie",
      text: top10_hover,
      hoverinfo: "label+text+value+percent",
      textinfo: "percent"
    }];

    var pieLayout = {
      //title: "OTU per Sample",
      yaxis: {autorange: true},
      margin: {l: 10, r: 10, b: 10, t: 10, pad: 4}
    };
    Plotly.newPlot("pie", pieData, pieLayout);
  });
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
