//The Keras lib should be loaded before this file is called
const model = new KerasJS.Model({
  filepaths: {
    model: "../resources/Models/musicClassifier.json",
    weights: "../resources/Models/musicClassifier_weights.buf",
    metadata: "../resources/Models/musicClassifier_metadata.json"
  },
  gpu: false
});

function predictSample(data, callback){
  model.ready()
  .then(() => {
    const inputData = {
      "input_1": new Float32Array(data)
    }
    // make predictions
    return model.predict(inputData)
  })
  .then(outputData => {
    callback(outputData)
  }).catch(err => {
    console.log("There was an error" + err.message)
    callback({"error": err.message})
  });
}

function loadJSON(fileName, callback) {

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', '', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);
 }

// Creating the skeleton functions required to
function predictSongGenre(type){
  predictionResult = []
  data = type.toLowerCase() === "jazz" ? jazzData : hiphopData
  processData(data, function(prediction){
    //TODO: Process the prediction results
    console.log("It will be good to see and understand what the results of the model are")
  });
}

function processData(data, callback){
    if(typeof data !== "undefined"){
        //Data is now loaded lets get to work
        //For each of the sample we need to call the predict sample function
        //Average out the probabilities for each class for the 21 samples
        //Also perform voting and return the majority vote
        for (var i = 0; i < data.length; i++){
          predictSample(data[i], function(response){
            if(thisSession.hasOwnProperty("error")){
              //There was en error occurred need to propogate this up
              predictionResult[predictionResult.length] = response["error"]
            } else {
              predictionResult[predictionResult.length] = response
            }

            if(predictionResult.length == SAMPLES){
              callback(predictionResult)
            }
          });
        }
    }
    else{
        setTimeout(processData(data, callback), 250);
    }
}

 var hiphopData,
     jazzData,
     predictionResult,
     SAMPLES = 21
 loadJSON("../reources/data/hiphop.00053.json", function(response) {
  // Parse JSON string into object
    hiphopData = JSON.parse(response);
 });

 loadJSON("../reources/data/jazz.00051.json", function(response) {
  // Parse JSON string into object
    jazzData = JSON.parse(response);
 });
 //Need to add a wait or something to ensure that the data has been loaded
