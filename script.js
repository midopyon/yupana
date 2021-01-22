"use strict";

let results_energy_ar = [];
let results_co2_ar = [];

let original = {};

let selectedJobsEnergy = [];
let selectedJobsCo2 = [];

let latestPage = 0;
let selectedPage = 1;
let maxEnergyValue = new Object();
maxEnergyValue.rawMat = 0;
maxEnergyValue.transp = 0;
maxEnergyValue.digFab = 0;
maxEnergyValue.endLife = 0;

let maxCo2Value = new Object();
maxCo2Value.rawMat = 0;
maxCo2Value.transp = 0;
maxCo2Value.digFab = 0;
maxCo2Value.endLife = 0;

let hasJobStackEmpty = true;
let isUpdating = false;
let isDeleteJobHidden = true;
// **** Loading Form Elements

let region_3dprint = document.getElementById("region_input_3dprint");
let distance_3dprint = document.getElementById("distance_input_3dprint");
let addjob_3dprint = document.getElementById("buttonAddJob");
let deljob_3dprint = document.getElementById("buttonDelJob");

let titleEnergy = document.getElementById("EnergyWrapper");
let titleCo2 = document.getElementById("Co2Wrapper");

let _3dprint_country_select = document.getElementById("country_3dprint");
let _3dprint_state_select = document.getElementById("state_3dprint");

let field = document.getElementById("support_field");
let slider = document.getElementById("support_slider");
var SupportSlider = document.getElementById("_3dprint_support_slider");

// **** Setting button actions

document
  .getElementById("btn_clear_3dprint")
  .addEventListener("click", function () {
    var w = confirm("Are you sure you want to clear ALL jobs?");
    if (w == true) {
      //Reset form
      reset_form();
    } else {
      //nothing
    }
  });

document
  .getElementById("region_radio_3dprint")
  .addEventListener("click", ShowRegionForm);
document
  .getElementById("distance_radio_3dprint")
  .addEventListener("click", ShowDistanceForm);

document.getElementById("btn_addJob").addEventListener("click", function () {
  document.querySelectorAll(".exclamation").forEach((item, i) => {
    item.classList.add("invisible");
  });

  createNewPageNumber();
  update_button_onNewJob();

  if (!isDeleteJobHidden) {
    SetDeleteJobInactive();
  }
});

document.getElementById("btn_delJob").addEventListener("click", function () {
  var r = confirm(
    "Are you sure you want to delete Job #" + selectedPage + " ?"
  );
  if (r == true) {
    //Delete Job
    DeleteJobFromArray(selectedPage);
  } else {
    //nothing
  }
});

_3dprint_country_select.addEventListener("change", CheckIfUS);

document.getElementById("Gram").addEventListener("click", ShowSupportField);
document.getElementById("Percent").addEventListener("click", ShowSupportSlider);

// Defining Functions called on form action

function reset_form() {
  HideDeleteJobButton();
  HideAddJobButton();

  // clearing inputs
  var inputs = document.getElementsByTagName("input");
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].classList.contains("field_selector")) {
      continue; //skip clearing this value
    }
    switch (inputs[i].type) {
      // case 'hidden':
      case "text":
        inputs[i].value = "";
        break;
      case "radio":
      case "checkbox":
        inputs[i].checked = false;
    }
  }

  // clearing selects
  var selects = document.getElementsByTagName("select");
  for (var i = 0; i < selects.length; i++) selects[i].selectedIndex = 0;

  // clearing textarea
  var text = document.getElementsByTagName("textarea");
  for (var i = 0; i < text.length; i++) text[i].innerHTML = "";

  document.getElementById("btn_calculate").textContent = "Calculate";
  document.getElementById("chart_div_energy").innerHTML = "";
  document.getElementById("chart_div_co2").innerHTML = "";
  document.getElementById("myGridEnergy").innerHTML = "";
  document.getElementById("myGridCo2").innerHTML = "";
  document.getElementById("NumbersList").innerHTML = "";

  document.querySelectorAll(".exclamation").forEach((item, i) => {
    item.classList.add("invisible");
  });

  //clear array
  rowDataEnergy = [];
  rowDataCo2 = [];
  selectedJobsEnergy = [];
  selectedJobsCo2 = [];
  jobsArray = [];

  latestPage = 0;
  selectedPage = 1;
  hasJobStackEmpty = true;
  isUpdating = false;
  isDeleteJobHidden = true;

  maxEnergyValue.rawMat = 0;
  maxEnergyValue.transp = 0;
  maxEnergyValue.digFab = 0;
  maxEnergyValue.endLife = 0;

  maxCo2Value.rawMat = 0;
  maxCo2Value.transp = 0;
  maxCo2Value.digFab = 0;
  maxCo2Value.endLife = 0;

  return false;
}

function ShowRegionForm() {
  region_3dprint.classList.remove("invisible");
  distance_3dprint.classList.add("invisible");
}

function ShowDistanceForm() {
  distance_3dprint.classList.remove("invisible");
  region_3dprint.classList.add("invisible");
}

function ShowAddJobButton() {
  createNewPageNumber();
  addjob_3dprint.classList.remove("invisible");
  update_button_onSubmit();

  hasJobStackEmpty = false;
}

function HideAddJobButton() {
  addjob_3dprint.classList.add("invisible");
}

function ShowDeleteJobButton() {
  deljob_3dprint.classList.remove("invisible");
  isDeleteJobHidden = false;
}

function HideDeleteJobButton() {
  deljob_3dprint.classList.add("invisible");
  isDeleteJobHidden = true;
}

function ShowTableTitles() {
  titleEnergy.classList.remove("invisible");
  titleCo2.classList.remove("invisible");
}

function HideTableTitles() {
  titleEnergy.classList.add("invisible");
  titleCo2.classList.add("invisible");
}

function SetDeleteJobActive() {
  document.getElementById("btn_delJob").disabled = false;
}

function SetDeleteJobInactive() {
  document.getElementById("btn_delJob").disabled = true;
}

function CheckIfUS() {
  if (_3dprint_country_select.value == "United States") {
    _3dprint_state_select.classList.remove("invisible");
  } else {
    _3dprint_state_select.classList.add("invisible");
  }
}

function ShowSupportField() {
  field.classList.remove("invisible");
  slider.classList.add("invisible");
}

function ShowSupportSlider() {
  slider.classList.remove("invisible");
  field.classList.add("invisible");
}

SupportSlider.onchange = function () {
  document.getElementById("Support_material_display").innerHTML =
    SupportSlider.value;
};

function update_button_onSubmit() {
  isUpdating = true;
  document.getElementById("btn_calculate").textContent = "Update Values";
}

function update_button_onNewJob() {
  isUpdating = false;
  document.getElementById("btn_calculate").textContent = "Calculate";
}

//Page creator script

function createNewPageNumber() {
  var ul = document.getElementById("NumbersList");

  latestPage++;
  selectedPage = latestPage;
  let tempCurrPage = selectedPage;

  var selects = document.getElementsByClassName("link selectedButton");
  for (var i = 0; i < selects.length; i++) selects[i].className = "link";

  var li = document.createElement("li");

  var button = document.createElement("button");
  button.innerHTML = latestPage.toString();
  button.className = "link selectedButton";
  button.setAttribute("id", "buttonPage" + latestPage.toString());

  li.appendChild(button);
  li.setAttribute("id", "listItem" + latestPage.toString());
  ul.appendChild(li);

  document
    .getElementById("buttonPage" + latestPage.toString())
    .addEventListener("click", function () {
      selectedPage = tempCurrPage;
      // Create the event
      var event = new CustomEvent("changePage", { detail: selectedPage });

      var selects = document.getElementsByClassName("link selectedButton");
      for (var i = 0; i < selects.length; i++) selects[i].className = "link";

      this.className = "link selectedButton";

      // Dispatch/Trigger/Fire the event
      document.dispatchEvent(event);
    });
}

// Defining functions called by an external script

function transportation_calculation(shipment, location) {
  let transport_energy;
  let transport_co2;
  let transport_mode;
  let transport_base_en =
    transportation_energies["truck_14"] *
      transportation_distances["local_avg"] +
    transportation_energies["light_vehicle"] *
      transportation_distances["local_city_avg"];
  let transport_base_co2 =
    transportation_co2["truck_14"] * transportation_distances["local_avg"] +
    transportation_co2["light_vehicle"] *
      transportation_distances["local_city_avg"];

  if (shipment == "By air") {
    transport_mode = "airplane";
  } else if (shipment == "By sea") {
    transport_mode = "ocean";
  } else if (shipment == "By road") {
    transport_mode = "truck_32";
  } else {
    //idk so defer choice
    transport_mode = "idk";
  }

  if (location == "International") {
    if (transport_mode == "idk") {
      transport_mode = "airplane";
    }
    transport_energy =
      transportation_energies[transport_mode] *
        transportation_distances["international_avg"] +
      transport_base_en;

    transport_co2 =
      transportation_co2[transport_mode] *
        transportation_distances["international_avg"] +
      transport_base_co2;
  } else if (location == "National") {
    if (transport_mode == "idk") {
      transport_mode = "truck_32";
    }
    transport_energy =
      transportation_energies[transport_mode] *
        transportation_distances["national_avg"] +
      transport_base_en;

    transport_co2 =
      transportation_co2[transport_mode] *
        transportation_distances["national_avg"] +
      transport_base_co2;
  } else if (location == "Local") {
    if (transport_mode == "idk" || transport_mode == "truck_32") {
      transport_mode = "truck_14";
    }
    transport_energy =
      transportation_energies[transport_mode] *
        transportation_distances["local_avg"] +
      transportation_energies["light_vehicle"] *
        transportation_distances["local_city_avg"];

    transport_co2 =
      transportation_co2[transport_mode] *
        transportation_distances["local_avg"] +
      transportation_co2["light_vehicle"] *
        transportation_distances["local_city_avg"];
  } else {
    if (transport_mode == "idk") {
      transport_mode = "airplane";
    }
    transport_energy =
      transportation_energies[transport_mode] *
        transportation_distances["international_avg"] +
      transport_base_en;
    transport_co2 =
      transportation_co2[transport_mode] *
        transportation_distances["international_avg"] +
      transport_base_co2;
  }

  return {
    energy: transport_energy / 1000,
    co2: transport_co2 / 1000,
  };
}

function user_transport_calc(shipment, user_distance) {
  let transport_energy;
  let transport_co2;
  let transport_mode;

  if (shipment == "By air") {
    transport_mode = "airplane";
  } else if (shipment == "By sea") {
    transport_mode = "ocean";
  } else if (shipment == "By road") {
    transport_mode = "truck_14";
  } else {
    transport_mode = "idk";
  }

  if (user_distance < transportation_distances["local_city_avg"]) {
    transport_energy = user_distance * transportation_energies["light_vehicle"];
    transport_co2 = user_distance * transportation_co2["light_vehicle"];
  } else if (
    user_distance <
    transportation_distances["local_city_avg"] +
      transportation_distances["local_avg"]
  ) {
    if (transport_mode == "idk") {
      transport_mode = "truck_14";
    }
    user_distance -= transportation_distances["local_city_avg"];
    transport_energy =
      user_distance * transportation_energies[transport_mode] +
      transportation_distances["local_city_avg"] *
        transportation_energies["light_vehicle"];
    transport_co2 =
      user_distance * transportation_co2[transport_mode] +
      transportation_distances["local_city_avg"] *
        transportation_co2["light_vehicle"];
  } else {
    if (transport_mode == "idk") {
      transport_mode = "airplane";
    } else if (transport_mode == "truck_14") {
      transport_mode = "truck_32";
    }
    user_distance -=
      transportation_distances["local_city_avg"] +
      transportation_distances["local_avg"];
    transport_energy =
      user_distance * transportation_energies[transport_mode] +
      transportation_energies["truck_14"] *
        transportation_distances["local_avg"] +
      transportation_energies["light_vehicle"] *
        transportation_distances["local_city_avg"];
    transport_co2 =
      user_distance * transportation_co2[transport_mode] +
      transportation_co2["truck_14"] * transportation_distances["local_avg"] +
      transportation_co2["light_vehicle"] *
        transportation_distances["local_city_avg"];
  }

  return {
    energy: transport_energy / 1000,
    co2: transport_co2 / 1000,
  };
}

function end_life_calculation(waste, type, incineration) {
  let results_end_life;
  if (type === "recycle_bin") {
    results_end_life = {
      energy:
        (waste / 1000) *
        transportation_energies["truck_14"] *
        transportation_distances["local_recycling_avg"],
      co2:
        (waste / 1000) *
        transportation_co2["truck_14"] *
        transportation_distances["local_recycling_avg"],
    };
  } else if (type == "incineration") {
    console.log(JSON.stringify(incineration));
    results_end_life = {
      energy:
        (waste / 1000) *
          transportation_energies["truck_14"] *
          (transportation_distances["local_recycling_avg"] +
            transportation_distances["local_landfill_avg"]) +
        waste * incineration.energy,
      co2:
        (waste / 1000) *
          transportation_co2["truck_14"] *
          (transportation_distances["local_recycling_avg"] +
            transportation_distances["local_landfill_avg"]) +
        waste * incineration.co2,
    };
  } else {
    results_end_life = {
      energy:
        (waste / 1000) *
        transportation_energies["truck_14"] *
        (transportation_distances["local_recycling_avg"] +
          transportation_distances["local_landfill_avg"]),
      co2:
        (waste / 1000) *
        transportation_co2["truck_14"] *
        (transportation_distances["local_recycling_avg"] +
          transportation_distances["local_landfill_avg"]),
    };
  }
  return results_end_life;
}

function DrawGoogleChartsEnergy(results) {
  var chartDiv = document.getElementById("chart_div_energy");

  let dataArray = [
    [
      "Prototyping Material",
      "Raw Material Processing (RM)",
      {
        role: "annotation",
      },
      "Transportation (T)",
      {
        role: "annotation",
      },
      "Digital Fabrication (DF)",
      {
        role: "annotation",
      },
      "End of Life (EL)",
      {
        role: "annotation",
      },
    ],
  ];

  dataArray.push([
    results.name,
    results.mat_manufacturing,
    results.mat_manufacturing,
    results.transportation,
    results.transportation,
    results.fabrication,
    results.fabrication,
    results.end_life,
    results.end_life,
  ]);

  var data = google.visualization.arrayToDataTable(dataArray);

  let arr = Object.values(maxEnergyValue);

  var materialOptions = {
    width: 520,
    height: 400,
    colors: ["#837BE7", "#E6BDF2", "#F97494", "#FD9F82"],
    title: "Energy Consumption\n ",
    titleTextStyle: {
      color: "#3b4456",
      fontSize: 18,
      fontName: "Open Sans",
      bold: true,
      //italic: true
    },
    chartArea: { left: 80, width: "60%", height: "40%" },
    vAxis: {
      format: "short",
      textStyle: {
        //color: '#01579b',
        fontSize: 12,
        //fontName: 'Helvetica',
        //bold: true,
        //italic: true
      },
      viewWindow: {
        min: -20,
        max: Math.ceil(Math.max(...arr) / 50) * 50,
      },
      title: "\nEnergy (MJ)",
      titleTextStyle: {
        fontSize: 12,
      },
    },
    hAxis: {
      textStyle: {
        //color: '#01579b',
        fontSize: 12,
        //fontName: 'Arial',
        //bold: true,
        //italic: true
      },
    },
    legend: { position: "top", maxLines: 3, textStyle: { fontSize: 11 } },
  };

  var view = new google.visualization.DataView(data);
  var chart = new google.visualization.ColumnChart(chartDiv);

  chart.draw(view, materialOptions);
}

////

function DrawGoogleChartsCo2(results) {
  var chartDiv = document.getElementById("chart_div_co2");

  let dataArray = [
    [
      "Prototyping Material",
      "Raw Material Processing (RM)",
      {
        role: "annotation",
      },
      "Transportation (T)",
      {
        role: "annotation",
      },
      "Digital Fabrication (DF)",
      {
        role: "annotation",
      },
      "End of Life (EL)",
      {
        role: "annotation",
      },
    ],
  ];

  dataArray.push([
    results.name,
    results.mat_manufacturing,
    results.mat_manufacturing,
    results.transportation,
    results.transportation,
    results.fabrication,
    results.fabrication,
    results.end_life,
    results.end_life,
  ]);

  var data = google.visualization.arrayToDataTable(dataArray);

  let arr2 = Object.values(maxCo2Value);

  var materialOptions = {
    width: 520,
    height: 400,
    colors: ["#837BE7", "#E6BDF2", "#F97494", "#FD9F82"],
    title: "CO2 Emissions\n ",
    titleTextStyle: {
      color: "#3b4456",
      fontSize: 18,
      fontName: "Open Sans",
      bold: true,
      //italic: true
    },
    chartArea: { left: 80, width: "60%", height: "40%" },

    vAxis: {
      format: "short",
      textStyle: {
        //color: '#01579b',
        fontSize: 12,
        //fontName: 'Helvetica',
        //bold: true,
        //italic: true
      },
      viewWindow: {
        min: 0,
        max: Math.ceil(Math.max(...arr2) / 20) * 20,
      },
      title: "\nCO2 (kg CO2/kg)",
      titleTextStyle: {
        fontSize: 12,
      },
    },
    hAxis: {
      textStyle: {
        //color: '#01579b',
        fontSize: 12,
        //fontName: 'Arial',
        //bold: true,
        //italic: true
      },
    },
    legend: { position: "top", maxLines: 3, textStyle: { fontSize: 11 } },
  };

  var view = new google.visualization.DataView(data);
  var chart = new google.visualization.ColumnChart(chartDiv);

  chart.draw(view, materialOptions);
}

///

function get_transport_text(location, shipment) {
  let content = document.createDocumentFragment();
  let text_location;
  if (!isNaN(location)) {
    if (location < transportation_distances.local_avg) {
      location = "Local";
    } else if (location < transportation_distances.national_avg) {
      location = "National";
    } else {
      location = "International";
    }
    content.appendChild(
      document.createTextNode(
        "We categorized the distance you entered into Local, National, or International based on how large it is."
      )
    );
    content.appendChild(document.createElement("BR"));
  }
  if (location == "International") {
    text_location = document.createTextNode(
      "Materials that travel international distances have a 95% higher environmental impact than national and local manufactured materials. Longer transportation distances require more fuel and therefore generate more CO2 emissions."
    );
  } else if (location == "National") {
    text_location = document.createTextNode(
      "Materials that travel national distances have a 30% higher environmental impact than local manufactured materials. Longer transportation distances require more fuel and therefore generate more CO2 emissions."
    );
  } else if (location == "Local") {
    text_location = document.createTextNode(
      "Locally manufactured materials have the least environmental impact: 95% less than international and 30% less than national. Longer transportation distances require more fuel and therefore generate more CO2 emissions."
    );
  } else {
    //idk
    text_location = document.createTextNode(
      "Since you didn't specify where your material was manufactured, we assume it travelled from China. Longer transportation distances require more fuel and therefore generate more CO2 emissions. See if you can find out where your materials are coming from and switch to local if possible."
    );
  }

  content.appendChild(text_location);
  content.appendChild(document.createElement("BR"));

  let text_shipment;
  if (shipment == "By air") {
    text_shipment = document.createTextNode(
      "Airplanes have a 1000% more environmental impact related to energy than road transportation and they emit 700% more CO2. Switching to ocean or road transportation if possible uses less fuel and generates less CO2 emissions."
    );
  } else if (shipment == "By sea") {
    text_shipment = document.createTextNode(
      "Great choice! Ocean transportation has the least environmental impact when it's combined with local - road distances to ship a material. It impacts 700% less in energy and generates 730% less CO2 emissions than national transportation by road. Longer transportation distances require more fuel and therefore generate more CO2 emissions."
    );
  } else if (shipment == "By road") {
    text_shipment = document.createTextNode(
      "Using a 32 metric ton truck to travel national distances has 30% less environmental impact related to energy than using a 14 metric ton truck, and it emits 50% less CO2. A good combination of road shipping will always be to avoid xpress deliveries because they use a light goods vehicle that has a 115% more environmental impact related to energy than a 14 metric truck and it emits 63% more CO2."
    );
  } else {
    text_shipment = document.createTextNode(
      "Since you didn't specify a shipping method, we assumed: International - airplane, National - road, Local - road."
    );
  }
  content.appendChild(text_shipment);
  return content;
}

function get_electric_text(country) {
  let content = document.createDocumentFragment();
  content.appendChild(
    document.createTextNode(
      "The co2 consumption of electricity is based on the source of the electricity (ie coal, nuclear, hydro, etc.). Different regions use different blends of electricity sources.You can check with the energy providers in your region to ensure your energy source has the least environmental impact. For example, solar and wind have a much lower environmental impact than fossil fuel sources."
    )
  );
  content.appendChild(document.createElement("BR"));
  let text_location;
  if (country_region[country] == "north america") {
    text_location = document.createTextNode(
      "In 2019, about 63% of the electricity generation was from fossil fuels-coal, natural gas, petroleum, and other gases. About 20% was from nuclear energy, and about 18% was from renewable energy sources."
    );
  } else if (country_region[country] == "latin america") {
    text_location = document.createTextNode(
      "In 2015, fossil fuel remains the most important source of energy in Latin America, with a share of around 75%, 16% bioenergy,  8% hydropower, 1% geothermal, and 1% originated from solar and wind energy (IEA, 2015)."
    );
  } else if (country_region[country] == "europe") {
    text_location = document.createTextNode(
      "In 2018, about 45.5 % of the net electricity generated in the EU came from combustible fuels (such as natural gas, coal and oil), while a quarter (25.8 %) came from nuclear power stations."
    );
  } else if (country_region[country] == "middle east") {
    text_location = document.createTextNode("");
  } else if (country_region[country] == "africa") {
    text_location = document.createTextNode("");
  } else if (country_region[country] == "south asia") {
    text_location = document.createTextNode(
      "Many South Asian countries depend on a single source to provide more than 50% of total electricity generation including India (Coal - 67.9%), Nepal (Hydropower - 99.9%), Bangladesh (Natural gas - 91.5%) and Sri Lanka (Oil - 50.2%)."
    );
  } else if (country_region[country] == "north asia") {
    text_location = document.createTextNode(
      "In 2015, the energy consumption in Northeast Asia was 2.6 billion tons of coal equivalent, accounting for 14% of the global total; the total electricity consumption was 3.3 PWh, accounting for 16 % of the global total. In 2016, the total CO2 emissions in China, Japan and the ROK reached 34 4 % for the global total."
    );
  } else {
    console.log("error");
    text_location = document.createTextNode("");
  }

  content.appendChild(text_location);
  content.appendChild(document.createElement("BR"));
  return content;
}

var columnDefsEnergy = [
  { headerName: "", field: "jobName", checkboxSelection: true },
  {
    headerName: "RM",
    field: "rawMat",
    headerClass: "rawHeader",
    valueFormatter: (params) => params.data.rawMat.toFixed(2),
    suppressMovable: true,
  },
  {
    headerName: "T",
    field: "transp",
    headerClass: "transpHeader",
    valueFormatter: (params) => params.data.transp.toFixed(2),
    suppressMovable: true,
  },
  {
    headerName: "DF",
    field: "digFab",
    headerClass: "digHeader",
    valueFormatter: (params) => params.data.digFab.toFixed(2),
    suppressMovable: true,
  },
  {
    headerName: "EL",
    field: "endLife",
    headerClass: "endHeader",
    valueFormatter: (params) => params.data.endLife.toFixed(2),
    suppressMovable: true,
  },
];

// specify the data
var rowDataEnergy = [];

//add row
function addRowEnergy(job, Results) {
  let data = {
    jobName: "J" + job.toString(),
    rawMat: Results.mat_manufacturing,
    transp: Results.transportation,
    digFab: Results.fabrication,
    endLife: Results.end_life,
  };

  maxEnergyValue.rawMat += data.rawMat;
  maxEnergyValue.transp += data.transp;
  maxEnergyValue.digFab += data.digFab;
  maxEnergyValue.endLife += data.endLife;

  rowDataEnergy.push(data);

  //set Table titles

  let TableTitle = "";

  for (i = 0; i < latestPage; i++) {
    if (TableTitle == "") {
      TableTitle += "J" + (i + 1);
    } else {
      TableTitle += ", J" + (i + 1);
    }
  }

  document.getElementById("tableEnergyTitle").innerHTML =
    "Energy Consumption for: " + TableTitle;

  document.getElementById("tableCoTitle").innerHTML =
    "Co2 Emissions for: " + TableTitle;

  updateTableEnergy();
}

//add row
function updateRowEnergy(job, Results) {
  let data = {
    jobName: "J" + job.toString(),
    rawMat: Results.mat_manufacturing,
    transp: Results.transportation,
    digFab: Results.fabrication,
    endLife: Results.end_life,
  };

  rowDataEnergy[job - 1] = data;

  maxEnergyValue.rawMat = 0;
  maxEnergyValue.transp = 0;
  maxEnergyValue.digFab = 0;
  maxEnergyValue.endLife = 0;

  rowDataEnergy.forEach(function (row, index) {
    maxEnergyValue.rawMat += row.rawMat;
    maxEnergyValue.transp += row.transp;
    maxEnergyValue.digFab += row.digFab;
    maxEnergyValue.endLife += row.endLife;
  });

  updateTableEnergy();
}

// let the grid know which columns and what data to use
var gridOptionsEnergy = {
  columnDefs: columnDefsEnergy,
  rowData: rowDataEnergy,
  rowSelection: "multiple",
  onSelectionChanged: onSelectionChangedEnergy,
  headerHeight: 23,
  onRowClicked: onrowClickedEnergy,
};

function getSelectedRowsEnergy() {
  var selectedNodes = gridOptionsEnergy.api.getSelectedNodes();
  var selectedData = selectedNodes.map(function (node) {
    return node.data;
  });
}

function onrowClickedEnergy() {
  var selectedRows = gridOptionsEnergy.api.getSelectedRows();
  var selectedRowsArray = [];

  selectedRows.forEach(function (selectedRow, index) {
    var number = parseInt(
      selectedRow.jobName.slice(selectedRow.jobName.length - 1)
    );

    selectedRowsArray.push(number);
  });

  var event = new CustomEvent("changePageFromTable", {
    detail: selectedRowsArray[0],
  });

  var selects = document.getElementsByClassName("link selectedButton");
  for (var i = 0; i < selects.length; i++) selects[i].className = "link";

  document.getElementById(
    "buttonPage" + selectedRowsArray[0].toString()
  ).className = "link selectedButton";

  document.dispatchEvent(event);

  //Dispatch on change page event
}

function onSelectionChangedEnergy() {
  var selectedRows = gridOptionsEnergy.api.getSelectedRows();
  var selectedRowsArray = [];
  var maxToShow = 5;

  selectedRows.forEach(function (selectedRow, index) {
    if (index >= maxToShow) {
      return;
    }

    var number = parseInt(
      selectedRow.jobName.slice(selectedRow.jobName.length - 1)
    );

    selectedRowsArray.push(number);
  });

  selectedJobsEnergy = selectedRowsArray;

  var event = new CustomEvent("selectionChangedEnergy", {});

  // Dispatch/Trigger/Fire the event
  document.dispatchEvent(event);
}

function updateTableEnergy() {
  gridOptionsEnergy.api.setRowData(rowDataEnergy);
  gridOptionsEnergy.api.selectAll();
  gridOptionsEnergy.api.sizeColumnsToFit();
  gridOptionsEnergy.api.refreshCells();
}

//CO2

var columnDefsCo2 = [
  { headerName: "", field: "jobName", checkboxSelection: true },
  {
    headerName: "RM",
    field: "rawMat",
    headerClass: "rawHeader",
    valueFormatter: (params) => params.data.rawMat.toFixed(2),
    suppressMovable: true,
  },
  {
    headerName: "T",
    field: "transp",
    headerClass: "transpHeader",
    valueFormatter: (params) => params.data.transp.toFixed(2),
    suppressMovable: true,
  },
  {
    headerName: "DF",
    field: "digFab",
    headerClass: "digHeader",
    valueFormatter: (params) => params.data.digFab.toFixed(2),
    suppressMovable: true,
  },
  {
    headerName: "EL",
    field: "endLife",
    headerClass: "endHeader",
    valueFormatter: (params) => params.data.endLife.toFixed(2),
    suppressMovable: true,
  },
];

// specify the data
var rowDataCo2 = [];

//add row
function addRowCo2(job, Results) {
  let data = {
    jobName: "J" + job.toString(),
    rawMat: Results.mat_manufacturing,
    transp: Results.transportation,
    digFab: Results.fabrication,
    endLife: Results.end_life,
  };

  maxCo2Value.rawMat += data.rawMat;
  maxCo2Value.transp += data.transp;
  maxCo2Value.digFab += data.digFab;
  maxCo2Value.endLife += data.endLife;

  rowDataCo2.push(data);
  updateTableCo2();
}

//add row
function updateRowCo2(job, Results) {
  let data = {
    jobName: "J" + job.toString(),
    rawMat: Results.mat_manufacturing,
    transp: Results.transportation,
    digFab: Results.fabrication,
    endLife: Results.end_life,
  };

  rowDataCo2[job - 1] = data;

  maxCo2Value.rawMat = 0;
  maxCo2Value.transp = 0;
  maxCo2Value.digFab = 0;
  maxCo2Value.endLife = 0;

  rowDataCo2.forEach(function (row, index) {
    maxCo2Value.rawMat += row.rawMat;
    maxCo2Value.transp += row.transp;
    maxCo2Value.digFab += row.digFab;
    maxCo2Value.endLife += row.endLife;
  });

  updateTableCo2();
}

// let the grid know which columns and what data to use
var gridOptionsCo2 = {
  columnDefs: columnDefsCo2,
  rowData: rowDataCo2,
  rowSelection: "multiple",
  onSelectionChanged: onSelectionChangedCo2,
  headerHeight: 23,
};

function getSelectedRowsCo2() {
  var selectedNodes = gridOptionsCo2.api.getSelectedNodes();
  var selectedData = selectedNodes.map(function (node) {
    return node.data;
  });
}

function onSelectionChangedCo2() {
  var selectedRows = gridOptionsCo2.api.getSelectedRows();
  var selectedRowsArray = [];
  var maxToShow = 5;

  selectedRows.forEach(function (selectedRow, index) {
    if (index >= maxToShow) {
      return;
    }

    var number = parseInt(
      selectedRow.jobName.slice(selectedRow.jobName.length - 1)
    );

    selectedRowsArray.push(number);
  });

  selectedJobsCo2 = selectedRowsArray;

  var event = new CustomEvent("selectionChangedCo2", {});

  // Dispatch/Trigger/Fire the event
  document.dispatchEvent(event);
}

function updateTableCo2() {
  gridOptionsCo2.api.setRowData(rowDataCo2);
  gridOptionsCo2.api.selectAll();
  gridOptionsCo2.api.sizeColumnsToFit();
  gridOptionsCo2.api.refreshCells();
}

function DeleteJobFromArray(pageToDelete) {
  var tempJobArray = [];

  jobsArray.forEach(function (job, index) {
    if (index + 1 == pageToDelete) {
      //Don't save Because you're erasing!!
    } else {
      tempJobArray.push(job);
    }
  });

  //Set jobsArray to tempJobArray
  jobsArray.length = 0;
  jobsArray = tempJobArray;

  // Update Latest Page
  latestPage = tempJobArray.length;

  // Update Selected Page (to page to Delete)
  if (pageToDelete == latestPage + 1) {
    selectedPage = latestPage;
  } else {
    selectedPage = pageToDelete;
  }

  //Set Form Values and Exclamation Marks

  SetFormValues(jobsArray[selectedPage - 1].formValues);
  SetExclamationTexts(jobsArray[selectedPage - 1].formValues);

  // If it has just one element, hide Delete Job Button

  if (tempJobArray.length == 1) {
    HideDeleteJobButton();
  }

  // Change buttons to match size of array

  var elem = document.getElementById("listItem" + (latestPage + 1).toString());
  elem.remove();

  // Set selectedPage as Selected Button
  var currentButton = document.getElementById(
    "buttonPage" + selectedPage.toString()
  );

  currentButton.className = "link selectedButton";

  // Load Table again with new values

  //Set new titles

  let TableTitleEnergy = "";

  for (i = 0; i < latestPage; i++) {
    if (TableTitleEnergy == "") {
      TableTitleEnergy += "J" + (i + 1);
    } else {
      TableTitleEnergy += ", J" + (i + 1);
    }
  }

  document.getElementById("tableEnergyTitle").innerHTML =
    "Energy Consumption for: " + TableTitleEnergy;

  document.getElementById("tableCoTitle").innerHTML =
    "Co2 Emissions for: " + TableTitleEnergy;

  //Set row datas to zero

  rowDataEnergy = [];
  rowDataCo2 = [];

  //iterate through jobArray and add row foreach value

  maxEnergyValue.rawMat = 0;
  maxEnergyValue.transp = 0;
  maxEnergyValue.digFab = 0;
  maxEnergyValue.endLife = 0;

  maxCo2Value.rawMat = 0;
  maxCo2Value.transp = 0;
  maxCo2Value.digFab = 0;
  maxCo2Value.endLife = 0;

  jobsArray.forEach(function (job, index) {
    let dataEnergy = {
      jobName: "J" + (index + 1).toString(),
      rawMat: job.resultsEnergy.mat_manufacturing,
      transp: job.resultsEnergy.transportation,
      digFab: job.resultsEnergy.fabrication,
      endLife: job.resultsEnergy.end_life,
    };

    let dataCo2 = {
      jobName: "J" + (index + 1).toString(),
      rawMat: job.resultsEnergy.mat_manufacturing,
      transp: job.resultsEnergy.transportation,
      digFab: job.resultsEnergy.fabrication,
      endLife: job.resultsEnergy.end_life,
    };

    maxEnergyValue.rawMat += dataEnergy.rawMat;
    maxEnergyValue.transp += dataEnergy.transp;
    maxEnergyValue.digFab += dataEnergy.digFab;
    maxEnergyValue.endLife += dataEnergy.endLife;

    maxCo2Value.rawMat += dataCo2.rawMat;
    maxCo2Value.transp += dataCo2.transp;
    maxCo2Value.digFab += dataCo2.digFab;
    maxCo2Value.endLife += dataCo2.endLife;

    rowDataEnergy.push(dataEnergy);
    rowDataCo2.push(dataCo2);
  });

  //update tables

  updateTableCo2();
  updateTableEnergy();
}
