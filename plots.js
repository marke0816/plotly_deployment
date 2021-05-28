function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleArray = samples.filter(j => j.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var entry1 = sampleArray[0];
    var meta = data.metadata;
    var metaArray = meta.filter(x => x.id == sample);
    var metaEntry1 = metaArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = entry1.otu_ids;
    var otuLabels = entry1.otu_labels;
    var sampleValues = entry1.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIds.slice(0,10).map(id => `OTU ${id}`).reverse();

    // 8. Create the trace for the bar chart. 
    var trace = [ {
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      text: otuLabels,
      type: 'bar',
      orientation: 'h'
    }
      
    ];
    // 9. Create the layout for the bar chart. 
    var layout = {
     title: "10 Most Populous Bacterial Species",
     xaxis: {title: "Sample Values"},
     yaxis: {title: "IDs"},
     paper_bgcolor: "#E2F5FB",
     plot_bgcolor: "#E2F5FB"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", trace, layout); 

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Viridis'
      }

    }];
    
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacterial Species Populations",
      xaxis: {title: "IDs"},
      yaxis: {title: "Sample Values"},
      paper_bgcolor: "#E2F5FB",
      plot_bgcolor: "#E2F5FB"
    };

    

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);


    // 3. Create a variable that holds the washing frequency.
    var washing = parseFloat(metaEntry1.wfreq);
    console.log(metaEntry1);
    console.log(washing);

    // 4. Create the trace for the gauge chart.
    var gaugeData = 
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washing,
        mode: "gauge+number",
        title: { text: "Belly Button Washing Frequency"},
        type: "indicator",
        gauge: {
          axis: {range: [null, 10], tickwidth: 1, tickcolor: "darkblue"},
          steps: [
            {range: [0,2], color: "lavender"},
            {range: [2,4], color: "lightsteelblue"},
            {range: [4,6], color: "cornflowerblue"},
            {range: [6,8], color: "blue"},
            {range: [8,10], color: "mediumblue"}
          ],
          bar: { color: "darkmagenta"}
        }};

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 700,
      height: 600,
      paper_bgcolor: "#E2F5FB"
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", [gaugeData], gaugeLayout);


  });
}
