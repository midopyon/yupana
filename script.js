("use strict");

var WarningManu3d;
var WarningTrans3d;
var WarningDig3d;
var WarningEOL3d;

var isReadingManu3d = false;
var isReadingTrans3d = false;
var isReadingDig3d = false;
var isReadingEol3d = false;

var InfoMat3d;
var InfoRegion3d;
var InfoShip3d;
var InfoLab3d;
var InfoPrint3d;
var InfoEOL3d;

var suggestionsMat3d = "";
var suggestionsTrans3d = "";
var suggestionsDig3d = "";
var suggestionsEol3d = "";

$(document).ready(function () {
  WarningManu3d = $("#warningManu3D").jBox("Tooltip", {});

  WarningTrans3d = $("#warningTrans3D").jBox("Tooltip", {});

  WarningDig3d = $("#warningDig3D").jBox("Tooltip", {});

  WarningEOL3d = $("#warningEOL3D").jBox("Tooltip", {});

  InfoMat3d = $("#infoManuMat3D").jBox("Tooltip", {
    position: {
      x: "right",
      y: "center",
    },
    outside: "x", // Horizontal Tooltips need to change their outside position
    maxWidth: 400,
    height: "auto",
  });

  InfoRegion3d = $("#infoRegion3D").jBox("Tooltip", {
    position: {
      x: "right",
      y: "center",
    },
    outside: "x", // Horizontal Tooltips need to change their outside position
    maxWidth: 400,
    height: "auto",
  });

  InfoShip3d = $("#infoShip3D").jBox("Tooltip", {
    position: {
      x: "right",
      y: "center",
    },
    outside: "x", // Horizontal Tooltips need to change their outside position
    maxWidth: 400,
    height: "auto",
  });

  InfoLab3d = $("#infoLabLoc3D").jBox("Tooltip", {
    position: {
      x: "right",
      y: "center",
    },
    outside: "x", // Horizontal Tooltips need to change their outside position
    maxWidth: 400,
    height: "auto",
  });

  InfoPrint3d = $("#infoPrinter3D").jBox("Tooltip", {
    position: {
      x: "right",
      y: "center",
    },
    outside: "x", // Horizontal Tooltips need to change their outside position
    maxWidth: 400,
    height: "auto",
  });

  InfoEOL3d = $("#infoEOL3D").jBox("Tooltip", {
    position: {
      x: "right",
      y: "center",
    },
    outside: "x", // Horizontal Tooltips need to change their outside position
    maxWidth: 400,
    height: "auto",
  });
});

///3DPRINT

let selectedJobsEnergy = [];
let selectedJobsCo2 = [];

let latestPage = 0;
let selectedPage = 1;
let maxEnergyValue = new Object();
maxEnergyValue.rawMat = 0;
maxEnergyValue.transp = 0;
maxEnergyValue.digFab = 0;
maxEnergyValue.endLife = 0;
let minEnergyValueEndLife = 0;

let maxCo2Value = new Object();
maxCo2Value.rawMat = 0;
maxCo2Value.transp = 0;
maxCo2Value.digFab = 0;
maxCo2Value.endLife = 0;

let hasJobStackEmpty = true;
let isUpdating = false;
let isDeleteJobHidden = true;

let CurrentlySelectedJobsTitleCO2 = "";
let CurrentlySelectedJobsTitleEnergy = "";

///LASER

let selectedJobsEnergy_l = [];
let selectedJobsCo2_l = [];

let latestPage_l = 0;
let selectedPage_l = 1;
let maxEnergyValue_l = new Object();
maxEnergyValue_l.rawMat = 0;
maxEnergyValue_l.transp = 0;
maxEnergyValue_l.digFab = 0;
maxEnergyValue_l.endLife = 0;
let minEnergyValueEndLife_l = 0;

let maxCo2Value_l = new Object();
maxCo2Value_l.rawMat = 0;
maxCo2Value_l.transp = 0;
maxCo2Value_l.digFab = 0;
maxCo2Value_l.endLife = 0;

let hasJobStackEmpty_l = true;
let isUpdating_l = false;
let isDeleteJobHidden_l = true;

let CurrentlySelectedJobsTitleCO2_l = "";
let CurrentlySelectedJobsTitleEnergy_l = "";

const Printing = document.getElementById("Printing");
const print = document.getElementById("_3D_Printing");
const Cutting = document.getElementById("Cutting");
const cut = document.getElementById("Laser_Cutting");

Printing.addEventListener("click", function () {
  print.setAttribute("class", "visible");
  cut.setAttribute("class", "invisible");
});

Cutting.addEventListener("click", function () {
  print.setAttribute("class", "invisible");
  cut.setAttribute("class", "visible");
});

// **** Loading Form Elements 3D PRINT

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
  //change for WARNING

  document.querySelectorAll(".clickableAwesomeFont3D").forEach((item, i) => {
    item.classList.add("invisible");
  });

  document.querySelectorAll(".hoverAwesomeFont3D").forEach((item, i) => {
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

  HideTableTitles();

  document.querySelectorAll(".exclamation").forEach((item, i) => {
    item.classList.add("invisible");
  });

  //CHANGE FOR WARNING (RESET FORM)

  document.querySelectorAll(".clickableAwesomeFont3D").forEach((item, i) => {
    item.classList.add("invisible");
  });

  document.querySelectorAll(".hoverAwesomeFont3D").forEach((item, i) => {
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

  minEnergyValueEndLife = 0;

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

  if (ul.innerHTML == ""){

  }
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

  let minTable = minEnergyValueEndLife;

  var materialOptions = {
    width: 520,
    height: 400,
    colors: ["#837BE7", "#E6BDF2", "#F97494", "#FD9F82"],
    title: "Energy Consumption:  " + CurrentlySelectedJobsTitleEnergy + "\n ",
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
        min: minTable,
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
    title: "CO\u2082 Emissions:  " + CurrentlySelectedJobsTitleCO2 + "\n ",
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
        max: Math.ceil(Math.max(...arr2) / 10) * 10,
      },
      title: "\nCO\u2082 (kg CO\u2082/kg)",
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
      "<span class='innerRedText'>- USA: 63% fossil fuels-coal, natural gas, petroleum; 20% nuclear energy, and 18% renewable energy.</span>";
  } else if (country_region[country] == "north america") {
    countryText = "";
  } else if (country_region[country] == "latin america") {
    countryText =
      "<span class='innerRedText'>- Latin America: 75% fossil fuel, 16% bioenergy,  8% hydropower, 1% geothermal, and 1% solar and wind energy.</span>";
  } else if (country_region[country] == "europe") {
    countryText =
      "<span class='innerRedText'>- European Union: 45.5% natural gas, coal, and oil; 25.8% nuclear power.</span>";
  } else if (country_region[country] == "middle east") {
    countryText = "";
  } else if (country_region[country] == "africa") {
    countryText = "";
  } else if (country_region[country] == "south asia") {
    countryText =
      "<span class='innerRedText'>- South Asian: India (Coal – 67.9%), Nepal (Hydropower – 99.9%), Bangladesh (Natural gas – 91.5%), and Sri Lanka (Oil – 50.2%).</span>";
  } else if (country_region[country] == "north asia") {
    countryText =
      "<span class='innerRedText'>- Northern Asian: In 2015, the energy consumption was 2.6 billion tons of coal equivalent, accounting for 14% of the global total; the total electricity consumption was 3.3 PWh, accounting for 16 % of the global total. In 2016, the total CO<sub>2</sub> emissions in China, Japan, and the ROK reached 34.4% of the global total.</span>";
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

  if (data.endLife < minEnergyValueEndLife) {
    minEnergyValueEndLife = data.endLife;
  }

  if (maxEnergyValue.endLife < minEnergyValueEndLife) {
    minEnergyValueEndLife = maxEnergyValue.endLife;
  }

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
    "Job History: " + TableTitle;

  document.getElementById("tableCoTitle").innerHTML =
    "Job History: " + TableTitle;

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
  minEnergyValueEndLife = 0;

  rowDataEnergy.forEach(function (row, index) {
    maxEnergyValue.rawMat += row.rawMat;
    maxEnergyValue.transp += row.transp;
    maxEnergyValue.digFab += row.digFab;
    maxEnergyValue.endLife += row.endLife;

    if (data.endLife < minEnergyValueEndLife) {
      minEnergyValueEndLife = data.endLife;
    }
  });

  if (maxCo2Value.endLife < minEnergyValueEndLife) {
    minEnergyValueEndLife = maxCo2Value.endLife;
  }

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
    "Job History: " + TableTitleEnergy;

  document.getElementById("tableCoTitle").innerHTML =
    "Job History: " + TableTitleEnergy;

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

  minEnergyValueEndLife = 0;

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

    if (dataEnergy.endLife < minEnergyValueEndLife) {
      minEnergyValueEndLife = dataEnergy.endLife;
    }

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

  if (maxEnergyValue.endLife < minEnergyValueEndLife) {
    minEnergyValueEndLife = maxEnergyValue.endLife;
  }

  //update tables

  updateTableCo2();
  updateTableEnergy();
}

/// LASER FUNCTIONS

// **** Loading Form Elements laser

let region_laser = document.getElementById("region_input_laser");
let distance_laser = document.getElementById("distance_input_laser");
let addjob_laser = document.getElementById("buttonAddJob_l");
let deljob_laser = document.getElementById("buttonDelJob_l");

let titleEnergyLaser = document.getElementById("EnergyWrapper_L");
let titleCo2Laser = document.getElementById("Co2Wrapper_L");

let laser_country_select = document.getElementById("country_laser");
let laser_state_select = document.getElementById("state_laser");

let area_select = document.getElementById("Area");
let length_select = document.getElementById("Length");

let area_length = document.getElementById("area_length");
let area_area = document.getElementById("area_area");

let waste_field = document.getElementById("waste_field");
let waste_slider = document.getElementById("waste_slider");
var wasteSliderObj = document.getElementById("waste_laser");

// **** Setting button actions

document
  .getElementById("btn_clear_laser")
  .addEventListener("click", function () {
    var w = confirm("Are you sure you want to clear ALL jobs?");
    if (w == true) {
      //Reset form
      reset_form_laser();
    } else {
      //nothing
    }
  });

document
  .getElementById("region_radio_laser")
  .addEventListener("click", ShowRegionFormLaser);
document
  .getElementById("distance_radio_laser")
  .addEventListener("click", ShowDistanceFormLaser);

document.getElementById("btn_addJob_l").addEventListener("click", function () {
  document.querySelectorAll(".exclamationLaser").forEach((item, i) => {
    item.classList.add("invisible");
  });

  createNewPageNumberLaser();
  update_button_onNewJob_Laser();

  if (!isDeleteJobHidden_l) {
    SetDeleteJobInactiveLaser();
  }
});

document.getElementById("btn_delJob_l").addEventListener("click", function () {
  var r = confirm(
    "Are you sure you want to delete Job #" + selectedPage_l + " ?"
  );
  if (r == true) {
    //Delete Job
    DeleteJobFromArrayLaser(selectedPage_l);
  } else {
    //nothing
  }
});

laser_country_select.addEventListener("change", CheckIfUSLaser);

document.getElementById("Waste_Area").addEventListener("click", ShowWasteField);
document
  .getElementById("Waste_Percent")
  .addEventListener("click", ShowWasteSlider);

document.getElementById("Length").addEventListener("click", ShowAreaLength);
document.getElementById("Area").addEventListener("click", ShowAreaArea);

// Defining Functions called on form action

function reset_form_laser() {
  HideDeleteJobButtonLaser();
  HideAddJobButtonLaser();

  // clearing inputs
  //TODO: diff between input 3d and input laser
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

  document.getElementById("btn_calculate_l").textContent = "Calculate";
  document.getElementById("chart_div_energy_L").innerHTML = "";
  document.getElementById("chart_div_co2_L").innerHTML = "";
  document.getElementById("myGridEnergy_L").innerHTML = "";
  document.getElementById("myGridCo2_L").innerHTML = "";
  document.getElementById("NumbersList_l").innerHTML = "";

  HideTableTitlesLaser();

  document.querySelectorAll(".exclamationLaser").forEach((item, i) => {
    item.classList.add("invisible");
  });

  //clear array
  rowDataEnergy_l = [];
  rowDataCo2_l = [];
  selectedJobsEnergy_l = [];
  selectedJobsCo2_l = [];
  jobsArray_L = [];

  latestPage_l = 0;
  selectedPage_l = 1;
  hasJobStackEmpty_l = true;
  isUpdating_l = false;
  isDeleteJobHidden_l = true;

  maxEnergyValue_l.rawMat = 0;
  maxEnergyValue_l.transp = 0;
  maxEnergyValue_l.digFab = 0;
  maxEnergyValue_l.endLife = 0;

  maxCo2Value_l.rawMat = 0;
  maxCo2Value_l.transp = 0;
  maxCo2Value_l.digFab = 0;
  maxCo2Value_l.endLife = 0;

  minEnergyValueEndLife_l = 0;

  return false;
}

function ShowRegionFormLaser() {
  region_laser.classList.remove("invisible");
  distance_laser.classList.add("invisible");
}

function ShowDistanceFormLaser() {
  distance_laser.classList.remove("invisible");
  region_laser.classList.add("invisible");
}

function ShowAddJobButtonLaser() {
  createNewPageNumberLaser();
  addjob_laser.classList.remove("invisible");
  update_button_onSubmit_Laser();

  hasJobStackEmpty_l = false;
}

function HideAddJobButtonLaser() {
  addjob_laser.classList.add("invisible");
}

function ShowDeleteJobButtonLaser() {
  deljob_laser.classList.remove("invisible");
  isDeleteJobHidden_l = false;
}

function HideDeleteJobButtonLaser() {
  deljob_laser.classList.add("invisible");
  isDeleteJobHidden_l = true;
}

function ShowTableTitlesLaser() {
  titleEnergyLaser.classList.remove("invisible");
  titleCo2Laser.classList.remove("invisible");
}

function HideTableTitlesLaser() {
  titleEnergyLaser.classList.add("invisible");
  titleCo2Laser.classList.add("invisible");
}

function SetDeleteJobActiveLaser() {
  document.getElementById("btn_delJob_l").disabled = false;
}

function SetDeleteJobInactiveLaser() {
  document.getElementById("btn_delJob_l").disabled = true;
}

function CheckIfUSLaser() {
  if (laser_country_select.value == "United States") {
    laser_state_select.classList.remove("invisible");
  } else {
    laser_state_select.classList.add("invisible");
  }
}

function ShowWasteField() {
  waste_field.classList.remove("invisible");
  waste_slider.classList.add("invisible");
}

function ShowWasteSlider() {
  waste_slider.classList.remove("invisible");
  waste_field.classList.add("invisible");
}

function ShowAreaLength() {
  area_length.classList.remove("invisible");
  area_area.classList.add("invisible");
}

function ShowAreaArea() {
  area_length.classList.add("invisible");
  area_area.classList.remove("invisible");
}

wasteSliderObj.onchange = function () {
  document.getElementById("Waste_laser_display").innerHTML =
    wasteSliderObj.value;
};

function update_button_onSubmit_Laser() {
  isUpdating_l = true;
  document.getElementById("btn_calculate_l").textContent = "Update Values";
}

function update_button_onNewJob_Laser() {
  console.log("updating");
  isUpdating_l = false;
  document.getElementById("btn_calculate_l").textContent = "Calculate";
}

//Page creator script

function createNewPageNumberLaser() {
  var ul = document.getElementById("NumbersList_l");

  latestPage_l++;
  selectedPage_l = latestPage_l;
  let tempCurrPage = selectedPage_l;

  var selects = document.getElementsByClassName("link selectedButtonLaser");
  for (var i = 0; i < selects.length; i++) selects[i].className = "link";

  var li = document.createElement("li");

  var button = document.createElement("button");
  button.innerHTML = latestPage_l.toString();
  button.className = "link selectedButtonLaser";
  button.setAttribute("id", "buttonPageLaser" + latestPage_l.toString());

  li.appendChild(button);
  li.setAttribute("id", "listItemLaser" + latestPage_l.toString());
  ul.appendChild(li);

  document
    .getElementById("buttonPageLaser" + latestPage_l.toString())
    .addEventListener("click", function () {
      selectedPage_l = tempCurrPage;
      // Create the event
      var event = new CustomEvent("changePageLaser", {
        detail: selectedPage_l,
      });

      var selects = document.getElementsByClassName("link selectedButtonLaser");
      for (var i = 0; i < selects.length; i++) selects[i].className = "link";

      this.className = "link selectedButtonLaser";

      // Dispatch/Trigger/Fire the event
      document.dispatchEvent(event);
    });
}

// Defining functions called by an external script

function DrawGoogleChartsEnergyLaser(results) {
  var chartDiv = document.getElementById("chart_div_energy_L");

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

  let arr = Object.values(maxEnergyValue_l);

  let minTable = minEnergyValueEndLife_l;

  var materialOptions = {
    width: 520,
    height: 400,
    colors: ["#837BE7", "#E6BDF2", "#F97494", "#FD9F82"],
    title: "Energy Consumption:  " + CurrentlySelectedJobsTitleEnergy_l + "\n ",
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
        min: minTable,
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

function DrawGoogleChartsCo2Laser(results) {
  var chartDiv = document.getElementById("chart_div_co2_L");

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

  let arr2 = Object.values(maxCo2Value_l);

  var materialOptions = {
    width: 520,
    height: 400,
    colors: ["#837BE7", "#E6BDF2", "#F97494", "#FD9F82"],
    title: "CO\u2082 Emissions:  " + CurrentlySelectedJobsTitleCO2_l + "\n ",
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
        max: Math.ceil(Math.max(...arr2) / 10) * 10,
      },
      title: "\nCO\u2082 (kg CO\u2082/kg)",
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

function get_electric_text_laser(country) {
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
      "<span class='innerRedText'>- Northern Asian: In 2015, the energy consumption was 2.6 billion tons of coal equivalent, accounting for 14% of the global total; the total electricity consumption was 3.3 PWh, accounting for 16 % of the global total. In 2016, the total CO<sub>2</sub> emissions in China, Japan, and the ROK reached 34.4% of the global total.</span>\r\n";
  } else {
    console.log("error");
  }

  return countryText;
}

var columnDefsEnergyLaser = [
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
var rowDataEnergy_l = [];

//add row
function addRowEnergyLaser(job, Results) {
  let data = {
    jobName: "J" + job.toString(),
    rawMat: Results.mat_manufacturing,
    transp: Results.transportation,
    digFab: Results.fabrication,
    endLife: Results.end_life,
  };

  maxEnergyValue_l.rawMat += data.rawMat;
  maxEnergyValue_l.transp += data.transp;
  maxEnergyValue_l.digFab += data.digFab;
  maxEnergyValue_l.endLife += data.endLife;

  if (data.endLife < minEnergyValueEndLife_l) {
    minEnergyValueEndLife_l = data.endLife;
  }

  if (maxEnergyValue_l.endLife < minEnergyValueEndLife_l) {
    minEnergyValueEndLife_l = maxEnergyValue_l.endLife;
  }

  rowDataEnergy_l.push(data);

  //set Table titles

  let TableTitle = "";

  for (i = 0; i < latestPage_l; i++) {
    if (TableTitle == "") {
      TableTitle += "J" + (i + 1);
    } else {
      TableTitle += ", J" + (i + 1);
    }
  }

  document.getElementById("tableEnergyTitle_L").innerHTML =
    "Job History: " + TableTitle;

  document.getElementById("tableCoTitle_L").innerHTML =
    "Job History: " + TableTitle;

  updateTableEnergyLaser();
}

//add row
function updateRowEnergyLaser(job, Results) {
  let data = {
    jobName: "J" + job.toString(),
    rawMat: Results.mat_manufacturing,
    transp: Results.transportation,
    digFab: Results.fabrication,
    endLife: Results.end_life,
  };

  rowDataEnergy_l[job - 1] = data;

  maxEnergyValue_l.rawMat = 0;
  maxEnergyValue_l.transp = 0;
  maxEnergyValue_l.digFab = 0;
  maxEnergyValue_l.endLife = 0;
  minEnergyValueEndLife_l = 0;

  rowDataEnergy_l.forEach(function (row, index) {
    maxEnergyValue_l.rawMat += row.rawMat;
    maxEnergyValue_l.transp += row.transp;
    maxEnergyValue_l.digFab += row.digFab;
    maxEnergyValue_l.endLife += row.endLife;

    if (data.endLife < minEnergyValueEndLife_l) {
      minEnergyValueEndLife_l = data.endLife;
    }
  });

  if (maxCo2Value_l.endLife < minEnergyValueEndLife_l) {
    minEnergyValueEndLife_l = maxCo2Value_l.endLife;
  }

  updateTableEnergyLaser();
}

// let the grid know which columns and what data to use
var gridOptionsEnergy_l = {
  columnDefs: columnDefsEnergyLaser,
  rowData: rowDataEnergy_l,
  rowSelection: "multiple",
  onSelectionChanged: onSelectionChangedEnergyLaser,
  headerHeight: 23,
  onRowClicked: onrowClickedEnergyLaser,
};

function onrowClickedEnergyLaser() {
  var selectedRows = gridOptionsEnergy_l.api.getSelectedRows();
  var selectedRowsArray = [];

  selectedRows.forEach(function (selectedRow, index) {
    var number = parseInt(
      selectedRow.jobName.slice(selectedRow.jobName.length - 1)
    );

    selectedRowsArray.push(number);
  });

  var event = new CustomEvent("changePageFromTableLaser", {
    detail: selectedRowsArray[0],
  });

  var selects = document.getElementsByClassName("link selectedButtonLaser");
  for (var i = 0; i < selects.length; i++) selects[i].className = "link";

  document.getElementById(
    "buttonPageLaser" + selectedRowsArray[0].toString()
  ).className = "link selectedButtonLaser";

  document.dispatchEvent(event);

  //Dispatch on change page event
}

function onSelectionChangedEnergyLaser() {
  var selectedRows = gridOptionsEnergy_l.api.getSelectedRows();
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

  selectedJobsEnergy_l = selectedRowsArray;

  var event = new CustomEvent("selectionChangedEnergyLaser", {});

  // Dispatch/Trigger/Fire the event
  document.dispatchEvent(event);
}

function updateTableEnergyLaser() {
  gridOptionsEnergy_l.api.setRowData(rowDataEnergy_l);
  gridOptionsEnergy_l.api.selectAll();
  gridOptionsEnergy_l.api.sizeColumnsToFit();
  gridOptionsEnergy_l.api.refreshCells();
}

//CO2

var columnDefsCo2Laser = [
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
var rowDataCo2_l = [];

//add row
function addRowCo2Laser(job, Results) {
  let data = {
    jobName: "J" + job.toString(),
    rawMat: Results.mat_manufacturing,
    transp: Results.transportation,
    digFab: Results.fabrication,
    endLife: Results.end_life,
  };

  maxCo2Value_l.rawMat += data.rawMat;
  maxCo2Value_l.transp += data.transp;
  maxCo2Value_l.digFab += data.digFab;
  maxCo2Value_l.endLife += data.endLife;

  rowDataCo2_l.push(data);
  updateTableCo2Laser();
}

//add row
function updateRowCo2Laser(job, Results) {
  let data = {
    jobName: "J" + job.toString(),
    rawMat: Results.mat_manufacturing,
    transp: Results.transportation,
    digFab: Results.fabrication,
    endLife: Results.end_life,
  };

  rowDataCo2_l[job - 1] = data;

  maxCo2Value_l.rawMat = 0;
  maxCo2Value_l.transp = 0;
  maxCo2Value_l.digFab = 0;
  maxCo2Value_l.endLife = 0;

  rowDataCo2_l.forEach(function (row, index) {
    maxCo2Value_l.rawMat += row.rawMat;
    maxCo2Value_l.transp += row.transp;
    maxCo2Value_l.digFab += row.digFab;
    maxCo2Value_l.endLife += row.endLife;
  });

  updateTableCo2Laser();
}

// let the grid know which columns and what data to use
var gridOptionsCo2_l = {
  columnDefs: columnDefsCo2Laser,
  rowData: rowDataCo2_l,
  rowSelection: "multiple",
  onSelectionChanged: onSelectionChangedCo2Laser,
  headerHeight: 23,
};

function getSelectedRowsCo2Laser() {
  var selectedNodes = gridOptionsCo2_l.api.getSelectedNodes();
  var selectedData = selectedNodes.map(function (node) {
    return node.data;
  });
}

function onSelectionChangedCo2Laser() {
  var selectedRows = gridOptionsCo2_l.api.getSelectedRows();
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

  selectedJobsCo2_l = selectedRowsArray;

  var event = new CustomEvent("selectionChangedCo2Laser", {});

  // Dispatch/Trigger/Fire the event
  document.dispatchEvent(event);
}

function updateTableCo2Laser() {
  gridOptionsCo2_l.api.setRowData(rowDataCo2_l);
  gridOptionsCo2_l.api.selectAll();
  gridOptionsCo2_l.api.sizeColumnsToFit();
  gridOptionsCo2_l.api.refreshCells();
}

function DeleteJobFromArrayLaser(pageToDelete) {
  var tempJobArray = [];

  jobsArray_L.forEach(function (job, index) {
    if (index + 1 == pageToDelete) {
      //Don't save Because you're erasing!!
    } else {
      tempJobArray.push(job);
    }
  });

  //Set jobsArray to tempJobArray
  jobsArray_L.length = 0;
  jobsArray_L = tempJobArray;

  // Update Latest Page
  latestPage_l = tempJobArray.length;

  // Update Selected Page (to page to Delete)
  if (pageToDelete == latestPage_l + 1) {
    selectedPage_l = latestPage_l;
  } else {
    selectedPage_l = pageToDelete;
  }

  //Set Form Values and Exclamation Marks

  SetFormValuesLaser(jobsArray_L[selectedPage_l - 1].formValues);
  SetExclamationTextsLaser(jobsArray_L[selectedPage_l - 1].formValues);

  // If it has just one element, hide Delete Job Button

  if (tempJobArray.length == 1) {
    HideDeleteJobButtonLaser();
  }

  // Change buttons to match size of array

  var elem = document.getElementById(
    "listItemLaser" + (latestPage_l + 1).toString()
  );
  elem.remove();

  // Set selectedPage_l as Selected Button
  var currentButton = document.getElementById(
    "buttonPageLaser" + selectedPage_l.toString()
  );

  currentButton.className = "link selectedButtonLaser";

  // Load Table again with new values

  //Set new titles

  let TableTitleEnergy = "";

  for (i = 0; i < latestPage_l; i++) {
    if (TableTitleEnergy == "") {
      TableTitleEnergy += "J" + (i + 1);
    } else {
      TableTitleEnergy += ", J" + (i + 1);
    }
  }

  document.getElementById("tableEnergyTitle_L").innerHTML =
    "Job History: " + TableTitleEnergy;

  document.getElementById("tableCoTitle_L").innerHTML =
    "Job History: " + TableTitleEnergy;

  //Set row datas to zero

  rowDataEnergy_l = [];
  rowDataCo2_l = [];

  //iterate through jobArray and add row foreach value

  maxEnergyValue_l.rawMat = 0;
  maxEnergyValue_l.transp = 0;
  maxEnergyValue_l.digFab = 0;
  maxEnergyValue_l.endLife = 0;

  maxCo2Value_l.rawMat = 0;
  maxCo2Value_l.transp = 0;
  maxCo2Value_l.digFab = 0;
  maxCo2Value_l.endLife = 0;

  minEnergyValueEndLife_l = 0;

  jobsArray_L.forEach(function (job, index) {
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

    if (dataEnergy.endLife < minEnergyValueEndLife_l) {
      minEnergyValueEndLife_l = dataEnergy.endLife;
    }

    maxEnergyValue_l.rawMat += dataEnergy.rawMat;
    maxEnergyValue_l.transp += dataEnergy.transp;
    maxEnergyValue_l.digFab += dataEnergy.digFab;
    maxEnergyValue_l.endLife += dataEnergy.endLife;

    maxCo2Value_l.rawMat += dataCo2.rawMat;
    maxCo2Value_l.transp += dataCo2.transp;
    maxCo2Value_l.digFab += dataCo2.digFab;
    maxCo2Value_l.endLife += dataCo2.endLife;

    rowDataEnergy_l.push(dataEnergy);
    rowDataCo2_l.push(dataCo2);
  });

  if (maxEnergyValue_l.endLife < minEnergyValueEndLife_l) {
    minEnergyValueEndLife_l = maxEnergyValue_l.endLife;
  }

  //update tables

  updateTableCo2Laser();
  updateTableEnergyLaser();
}

////

function SetInfoText(infoName, text, isBad) {
  switch (infoName) {
    case "mat":
      document.getElementById("infoManuMat3D").style.color = "black";
      InfoMat3d.setContent(text);
      if (isBad) {
        document.getElementById("infoManuMat3D").style.color = "red";
        WarningManu3d.setContent("You have 1 suggestion.");
      }
      break;
    case "reg":
      document.getElementById("infoRegion3D").style.color = "black";
      InfoRegion3d.setContent(text);
      if (isBad) {
        document.getElementById("infoRegion3D").style.color = "red";
      }
      break;
    case "ship":
      document.getElementById("infoShip3D").style.color = "black";
      InfoShip3d.setContent(text);
      if (isBad) {
        document.getElementById("infoShip3D").style.color = "red";
      }
      break;
    case "lab":
      InfoLab3d.setContent(text);
      if (isBad) {
        document.getElementById("infoLabLoc3D").style.color = "red";
      }
      break;
    case "print":
      document.getElementById("infoPrinter3D").style.color = "black";
      InfoPrint3d.setContent(text);
      if (isBad) {
        document.getElementById("infoPrinter3D").style.color = "red";
      }
      break;
    case "eol":
      InfoEOL3d.setContent(text);
      if (isBad) {
        document.getElementById("infoEOL3D").style.color = "red";
      }
      break;
  }
}
