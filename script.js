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

function get_transport_location(location) {
  var typeLocation;

  if (!isNaN(location)) {
    if (location < transportation_distances.local_avg) {
      typeLocation = "Local";
    } else if (location < transportation_distances.national_avg) {
      typeLocation = "National";
    } else {
      typeLocation = "International";
    }
  }

  return typeLocation;
}

function get_electric_text(country) {
  let countryText = "";

  if (country == "United States") {
    countryText =
      "<span class='innerRedText'>- USA: 63% fossil fuels-coal, natural gas, petroleum; 20% nuclear energy, and 18% renewable energy.</span>\r\n";
  } else if (country_region[country] == "north america") {
    countryText = "";
  } else if (country_region[country] == "latin america") {
    countryText =
      "<span class='innerRedText'>- Latin America: 75% fossil fuel, 16% bioenergy,  8% hydropower, 1% geothermal, and 1% solar and wind energy.</span>\r\n";
  } else if (country_region[country] == "europe") {
    countryText =
      "<span class='innerRedText'>- European Union: 45.5% natural gas, coal, and oil; 25.8% nuclear power.</span>\r\n";
  } else if (country_region[country] == "middle east") {
    countryText = "";
  } else if (country_region[country] == "africa") {
    countryText = "";
  } else if (country_region[country] == "south asia") {
    countryText =
      "<span class='innerRedText'>- South Asian: India (Coal – 67.9%), Nepal (Hydropower – 99.9%), Bangladesh (Natural gas – 91.5%), and Sri Lanka (Oil – 50.2%).</span>\r\n";
  } else if (country_region[country] == "north asia") {
    countryText =
      "<span class='innerRedText'>- Northern Asian: In 2015, the energy consumption was 2.6 billion tons of coal equivalent, accounting for 14% of the global total; the total electricity consumption was 3.3 PWh, accounting for 16 % of the global total. In 2016, the total CO2 emissions in China, Japan, and the ROK reached 34.4% of the global total.</span>\r\n";
  } else {
    console.log("error");
  }

  return countryText;
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
