# Maps.js

## An introduction

Maps.js is a javascript library written to create a map with markers containing information about companies on your website easily. It is written specificly for a school project in which a map was need to show companies in the area. This project can be viewed here: 
https://github.com/RobinGalema/Brainport-Groep-1/tree/Map/Prototypes/Technisch/Map

## Downloading and installing Maps.js

To use Maps.js the Maps.js file in this repository can be downloaded (https://github.com/RobinGalema/Maps.js/blob/DEV/Map.js) and linked at the bottom of the body elemtent of your html page.

````html

<body>
  
  <!-- Here goes regular html -->
  
  <script src="map.js"></script>
</body>

````

This will get the module loaded on your page and ready for setting up your map.

## Requirements

As this library works with an API from Google to create and manage a map, you will need to get your own Google Maps API Key.
A guide on how to get this key can be found on Google's documentation (https://developers.google.com/maps/gmp-get-started).
Once you have gotten your key from Google it is time to also link the Google API in your html document. This can be done as follows:

````html
<body>
  
  <!-- Here goes regular html -->
  
 
  <!-- Maps.js reference -->
  <script src="map.js"></script>
  
  <!-- Google API reference reference -->
  <script async defer src="https://maps.googleapis.com/maps/api/js?key={YOUR KEY GOES HERE}&callback=initMap"></script>
</body>

````

Fill in the key from your Google Maps API account in the script reference in order to load the Google API correctly. For the library to work the Google API **IS REQUIRED** otherwise the app will not function.

## Getting the data for markers

At this moment the data for the markers on the map is gathered from a .json file containing some sample start-ups. The formatting of this file is **VERY** important when adding or removing companies or when creating your own data file. For now the library only works with a JSON file that is formatted as follows:

````json
{
  "companies": [
    {
      "name": "NAME HERE",
      "adress": "ADRESS HERE",
      "zip": "ZIP HERE",
      "city": "CITY HERE",
      "labels": ["TAG HERE", "TAG HERE"],
      "website": "LINK HERE",
      "marker": {
        "lat": 0,
        "long": 0
      }
     },
         {
      "name": "NAME HERE",
      "adress": "ADRESS HERE",
      "zip": "ZIP HERE",
      "city": "CITY HERE",
      "labels": ["TAG HERE", "TAG HERE"],
      "website": "LINK HERE",
      "marker": {
        "lat": 0,
        "long": 0
      }
     }
    ]
  }

````
This data should be then read in javascript and the data should be placed in an object that will be used as a parameter to feed information to the library which will create markers based on this data.

## Creating the map

In order to create a map on a html page there needs to be a div on the page that has been given the id "map". The size of this div should also be set or at least be not 0 as the map won't show in that case.

````html

<div id="map" style="width: 800px; height: 800px;"></div>

````

After this has been set up and the data from the JSON file has been read and put into an object generating the map is as easy as running the MyMap.DataSetup(data) function and passing the object containing the JSON data as argument.

An example:

````js

// Function for loading the JSON file, this is an example way to do this and can be done differntly
const fetchJSONFile = (path, callback) => {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function () {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        var data = JSON.parse(httpRequest.responseText);
        if (callback) callback(data);
      }
    }
  };
  httpRequest.open("GET", path);
  httpRequest.send();
};


// Executing the setup in window.onload makes sure that the div in which the map will be displayed can be found by the script
window.onload = () => {

// Putting the JSON data into a variable called data
fetchJSONFile("data.json", function (data) 
{
  // Running the setup function and passing the data as argument
  MyMap.DataSetup(data);
});

}

````

## Examples

The folder example contains an example of Map.js being used to generate a map in an empty div.
This example can be simply downloaded and opened or ran with a live-server.

Follow the link below to see how the module was used to create an Application to show Start-ups in the area around Eindhoven.
http://i416153.hera.fhict.nl/
  
## Contributors
**Robin Galema** https://github.com/RobinGalema
 s 
With the help of 
**Thomas Dwarshuis** https://github.com/ThomasHBOICT
