// The Brainport map library
// This library is currenlty a Work in Progress
//
const MyMap = (function () {
  // Variables
  let markers = [];
  let displayedCompanies = [];
  let checkboxes;
  let currentFilters = [];
  let searchBox;
  let infoBoxes = [];
  let jsonData;
  let markerCluster;

  /**
   * A function that creates and sets-up the map with markers, for this there should be a <div> element on the linked html page with "map" set as the div's id
   * @param {Object} data An object containing data from a json file. This file should contain information about the companies and the markers for the map.
   */
  const DataSetup = (data) => {
    jsonData = data;
    LoadData();
    MakeMap();
    CreateMarkers();
  };

  /**
   * Function that sets up most information displayed in the menu and sets-up event handelers for these items
   *
   * @param {Object} jsonData An object containing data from a json file. This file should contain information about the companies and the markers for the map.
   * @param {String} searchBoxID The ID of the <input> element in the menu that is used as searchbox, when left empty this will be set to: "searchBox"
   * @param {String} ContainerClass The class name given to each of the containers for the company information in the menu, when left empty this will be set to: "infoContainer"
   * @example PageSetup("searchBox", "infoContainer");
   */
  const PageSetup = (
    searchBoxID = "searchBox",
    containerClass = "infoContainer"
  ) => {
    SetupCheckboxes();
    SetupSearchBox(searchBoxID);
    SetupInfoContainers(containerClass);
    SetupCompanyList(containerClass);
  };

  /**
   * executes when api is loaded
   */
  const InitMap = () => {
    console.log("maps API loaded.");
  };

  /**
   * creates map and marker
   */
  const MakeMap = () => {
    const markerPos = {
      lat: jsonData.companies[0].marker.lat,
      lng: jsonData.companies[0].marker.long,
    };
    map = new google.maps.Map(document.getElementById("map"), {
      center: markerPos,
      zoom: 12,
    });
  };

  /**
   * creates makers and pushes them to markers array
   */
  const CreateMarkers = () => {
    // Check if there are no markers on the map, if there are remove all current markers
    markers.length == 0 ? true : RemoveMarkers();

    displayedCompanies.forEach((element) => {
      let info = document.createElement("p")
      info.innerHTML = `<b>${element.name}</b> <br> Adress: ${element.adress} <br> Website: <a href="${element.website}" target="blank">${element.website}</a>`;

      const markerPos = {
        lat: element.marker.lat,
        lng: element.marker.long,
      };
      const marker = new google.maps.Marker({
        position: markerPos,
        map: map,
        name: element.name,
      });
      markers.push(marker);
      let infoWindow = new google.maps.InfoWindow({
        content: info
      });
      marker.addListener("click", function () {
        infoWindow.open(map, marker);
      });
    });
    markerCluster = new MarkerClusterer(map, markers, {
      imagePath: "../Photos/m",
    });
  };

  /**
   * Pushes all the companies from the JSON file into an array
   */
  const LoadData = () => {
    // Copy all companies from the json file
    displayedCompanies = jsonData.companies.slice();

    //Debug
    console.log(
      "Loaded companies from data file, containing the following companies:"
    );
    console.log(displayedCompanies);
    console.log(
      "---------------------------------------------------------------------"
    );
  };

  /**
   * A function that filters all the companies in the dataset by labelnames and then updates the markers on the map to match those
   *
   * @param {[String]} filters An array of tags to filter the companies by, these tags should match the tags under the "labels" value in the data file
   * @returns {[Object]} An array with all the companies that match the input filters
   *
   * @example ApplyFilters(["software","app-development"]);
   */
  const ApplyFilters = (filters = []) => {
    let filteredData = jsonData.companies.filter((company) => {
      return company.labels.filter((x) => filters.includes(x)).length > 0;
    });
    console.log(filteredData);

    if (filteredData.length != 0) {
      displayedCompanies = filteredData;
      CreateMarkers();
      UpdateCompanyList("infoContainer");
    } else {
      console.log("There are no filters being applied");
      displayedCompanies = jsonData.companies;
      CreateMarkers();
      UpdateCompanyList("infoContainer");
    }
  };

  /**
   * Removes all current markers on the map and clears the array storing the markers
   */
  const RemoveMarkers = () => {
    markers.forEach((marker) => {
      marker.setMap(null);
      if (markerCluster) {
        markerCluster.clearMarkers();}
    });

    markers = [];
  };

  /**
   * A function that adds eventlisteners to all checkboxes to make them update the markers on the map based on the tag of the checkbox
   *
   */
  const SetupCheckboxes = () => {
    checkboxes = document.getElementsByClassName("labelCheckBox");
    console.log(checkboxes);
    checkboxes = Array.from(checkboxes);

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        if (this.checked) {
          if (!currentFilters.includes(checkbox.value)) {
            currentFilters.push(checkbox.value);
          }
        } else {
          if (currentFilters.includes(checkbox.value)) {
            let index = currentFilters.indexOf(checkbox.value);
            currentFilters.splice(index, 1);
          }
        }

        ApplyFilters(currentFilters);
        console.log(currentFilters);
      });
    });
  };

  /**
   * A function that adds an eventlistener to the searchbox, place this in window.onload
   * @param {String} idName The name of the id given to the input DOM element
   *
   * @example SetupSearchBox("searchBox");
   */
  const SetupSearchBox = (idName) => {
    searchBox = document.getElementById(idName);

    // Add an eventlistener that runs a function every time the value of the inputbox changes
    searchBox.addEventListener("input", function () {
      let result = GetSearchResults(searchBox.value);
      displayedCompanies = result;
      CreateMarkers();
      UpdateCompanyList("infoContainer");
    });
  };

  /**
   * A function that uses the inputfield of the button to filter the list of companies by comparing the name of the company to the input value
   *
   * @param {String} inputValue The value that will be used to search through the list of company names
   * @returns {[Object]} An array containing all the companies matching the name of the input value
   *
   * @example GetSearchResultss("BitSensor");
   */
  const GetSearchResults = (inputValue) => {
    // Reset all markers based on the current applied filters
    ApplyFilters(currentFilters);
    CreateMarkers();

    // Creating search input variable to search witouth being case sensitive
    let input = new RegExp(inputValue, `i`);
    let searchResults = [];

    // debug
    console.log(displayedCompanies);

    // !!!!!
    // TODO: gebruik hier ook de 'filter' methode om het in 1 keer te filteren: https://www.geeksforgeeks.org/es6-array-filter-method/
    displayedCompanies.forEach((company) => {
      if (company.name.match(input)) {
        // Check if there is a company that has the search input in their name
        searchResults.push(company);
      }
    });

    // Display only the markers that match the search result
    return searchResults;
  };

  /**
   * Function that adds eventlisteners to the list of companies to make them pan to the marker when clicked on a company div
   * @param {String} containerClass The class name given to the div containing the information of the company
   */
  const SetupInfoContainers = (containerClass) => {
    let infoContainers = document.getElementsByClassName(containerClass);
    infoContainers = Array.from(infoContainers);

    infoContainers.forEach((container) => {
      container.addEventListener("click", function () {
        // !!!!
        // TODO: Gebruikt maken van array.find methode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
        markers.forEach((marker) => {
          console.log("searching");
          if (container.childNodes[0].innerHTML == marker.name) {
            map.panTo(marker.getPosition());
            console.log(marker);
            google.maps.event.trigger(marker, "click");
          }
        });
      });
    });
  };

  /**
   * Sets up a list of information divs of companies based on the currently displayed markers
   * @param {String} containerClass The class name given to the div containing the information of the company
   */
  const SetupCompanyList = (containerClass) => {
    let infoContainers = document.getElementsByClassName(containerClass);
    infoContainers = Array.from(infoContainers);
    let listToDisplay = [];

    displayedCompanies.forEach((company) => {
      infoContainers.forEach((container) => {
        let nameToCheck = container.childNodes[0].innerHTML;
        if (nameToCheck == company.name) {
          listToDisplay.push(container);
        }
      });
    });

    infoBoxes = listToDisplay;
    console.log(infoBoxes);
  };

  /**
   * Updates the list of information divs in the menu to only display the information of companies that have a marker active
   * @param {String} containerClass The class name given to the div containing the information of the company
   */
  const UpdateCompanyList = (containerClass) => {
    SetupCompanyList("infoContainer");
    let infoContainers = document.getElementsByClassName(containerClass);
    infoContainers = Array.from(infoContainers);

    infoContainers.forEach((container) => {
      // Check if the container should be displayed or not and update the style setting accordingly
      container.style.display = infoBoxes.includes(container)
        ? "block"
        : "none";
    });
  };

  return {
    DataSetup: DataSetup,
    PageSetup: PageSetup,
    GetSearchResults: GetSearchResults,
    markers,
  };
})();
