let jobsArray = [];

const TESTSOURCEVALUE = {
  material_3dprint: "PLA",
  location_3dprint: "region",
  distance_3dprint: 345.5,
  where_3dprint: "International",
  shipment_3dprint: "By sea",
  country_3dprint: "Armenia",
  machine_3dprint: "makerbot",
  weight_3dprint: 100,
  supportFieldType: "Input",
  supportInput_3dprint: 100,
  time_3dprint: 3,
  iteration_3dprint: 1,
  eol_3dprint: "recycle_bin",
};

function Form_Values(
  material_3dprint,
  location_3dprint,
  where_3dprint,
  distance_3dprint,
  shipment_3dprint,
  country_3dprint,
  state_3dprint,
  machine_3dprint,
  weight_3dprint,
  supportFieldType,
  supportInput_3dprint,
  supportSlider_3dprint,
  time_3dprint,
  iteration_3dprint,
  eol_3dprint,
  isRecycled
) {
  this.material_3dprint = material_3dprint;
  this.location_3dprint = location_3dprint;
  this.where_3dprint = where_3dprint;
  this.distance_3dprint = distance_3dprint;
  this.shipment_3dprint = shipment_3dprint;
  this.country_3dprint = country_3dprint;
  this.state_3dprint = state_3dprint;
  this.machine_3dprint = machine_3dprint;
  this.weight_3dprint = weight_3dprint;
  this.supportFieldType = supportFieldType;
  this.supportInput_3dprint = supportInput_3dprint;
  this.supportSlider_3dprint = supportSlider_3dprint;
  this.time_3dprint = time_3dprint;
  this.iteration_3dprint = iteration_3dprint;
  this.eol_3dprint = eol_3dprint;
  this.isRecycled = isRecycled;
}

function Object_3dprint(formValues, resultsEnergy, resultsCo2) {
  this.formValues = formValues;
  this.resultsEnergy = resultsEnergy;
  this.resultsCo2 = resultsCo2;
}

var _3dprint_weight = null;
var _3dprint_support = null;
var _3dprint_prototyping_weight = null;
var _3dprint_prototyping_waste = null;
var _3dprint_iteration = null;
var _3dprint_time = null;
var _3dprint_location_type = null;
var _3dprint_location = null;
var _3dprint_shipment = null;
var _3dprint_distance = null;
var _3dprint_material = null;
var _3dprint_machine = null;
var _3dprint_end_life = null;
var _3dprint_electric = null;
var _3dprint_country = null;
var recycled = false;
// var material = 'PLA'
// var _3dprint_end_life= 'recycle_bin'
// var machine_3dprint_radios = 'makerbot'
var first = true;

// //HELPER DEBUG
// document.getElementById("btn_helper").addEventListener("click", function () {
//   SetFormValues(TESTSOURCEVALUE);
// });

// Add an event listener
document.addEventListener("changePage", function (e) {
  //If already saved, show values of selected page and change text

  if (jobsArray[selectedPage - 1] !== undefined) {
    //Set Delete Job enabled
    SetDeleteJobActive();

    update_button_onSubmit();
    SetFormValues(jobsArray[selectedPage - 1].formValues);
    SetExclamationTexts(jobsArray[selectedPage - 1].formValues);
  } else {
    //Set delete Job disabled
    SetDeleteJobInactive();

    update_button_onNewJob();
    document.querySelectorAll(".exclamation").forEach((item, i) => {
      item.classList.add("invisible");
    });
  }

  //Else, do nothing (accessing a job thats just being created)
});

document.addEventListener("selectionChangedCo2", WaitForDataAndShowGraphCo2);

document.addEventListener(
  "selectionChangedEnergy",
  WaitForDataAndShowGraphEnergy
);

function WaitForDataAndShowGraphEnergy() {
  let selectedJobsEnergy = getAndAddUpSelectedJobsEnergy();
  DrawGoogleChartsEnergy(selectedJobsEnergy);
}

function WaitForDataAndShowGraphCo2() {
  let selectedJobsCo2 = getAndAddUpSelectedJobsCo2();
  DrawGoogleChartsCo2(selectedJobsCo2);
}

function SaveFormValues() {
  //Defining Form Values Object
  var CurrentFormValues = new Form_Values();

  //Saving Material and Recycled Boolean
  var mat = document.getElementById("material_3dprint").value;

  mat = mat.split("_");
  if (mat.length == 2) {
    CurrentFormValues.isRecycled = true;
  } else {
    CurrentFormValues.isRecycled = false;
  }

  CurrentFormValues.material_3dprint = mat[0];

  //Saving location type
  var location_radios = document.getElementsByName("location_3dprint");
  for (i = 0; i < location_radios.length; i++) {
    if (location_radios[i].checked) {
      CurrentFormValues.location_3dprint = location_radios[i].value;
      break;
    }
  }

  //Saving Location or Distance, depending on location type
  if (CurrentFormValues.location_3dprint == "region") {
    let e = document.getElementById("where_3d_print");
    CurrentFormValues.where_3dprint = e.options[e.selectedIndex].value;
  } else {
    CurrentFormValues.distance_3dprint = parseFloat(
      document.getElementById("_3dprint_distance_input").value
    );
  }

  //Saving Shipment method
  let e = document.getElementById("shipment_3dprint");
  CurrentFormValues.shipment_3dprint = e.options[e.selectedIndex].value;

  //Saving Country
  CurrentFormValues.country_3dprint = document.getElementById(
    "country_3dprint"
  ).value;

  //If USA, Saving State
  if (CurrentFormValues.country_3dprint == "United States") {
    CurrentFormValues.state_3dprint = document.getElementById(
      "state_3dprint"
    ).value;
  }

  //Saving Machine
  var machine_3dprint_radios_nodes = document.getElementsByName(
    "machine_3dprint_radio_button"
  );

  for (i = 0; i < machine_3dprint_radios_nodes.length; i++) {
    if (machine_3dprint_radios_nodes[i].checked) {
      CurrentFormValues.machine_3dprint = machine_3dprint_radios_nodes[i].value;
      break;
    }
  }

  //Saving Weight
  CurrentFormValues.weight_3dprint = parseFloat(
    document.getElementById("_3dprint_weight_input").value
  );

  //Saving Support Input mode and values
  if (document.querySelector("input[value=support_percent]").checked) {
    CurrentFormValues.supportFieldType = "Slider";
    CurrentFormValues.supportSlider_3dprint = parseFloat(
      document.getElementById("_3dprint_support_slider").value
    );
  } else {
    CurrentFormValues.supportFieldType = "Input";
    CurrentFormValues.supportInput_3dprint = parseFloat(
      document.getElementById("_3dprint_support_input").value
    );
  }

  //Saving Time
  CurrentFormValues.time_3dprint = parseFloat(
    document.getElementById("_3dprint_time_input").value
  );

  //Saving Iteration
  CurrentFormValues.iteration_3dprint = parseFloat(
    document.getElementById("_3dprint_iteration_input").value
  );

  //Saving End of Life method
  var end_of_life_radios_nodes = document.getElementsByName(
    "end_of_life_radio_button"
  );

  for (i = 0; i < end_of_life_radios_nodes.length; i++) {
    if (end_of_life_radios_nodes[i].checked) {
      CurrentFormValues.eol_3dprint = end_of_life_radios_nodes[i].value;
      break;
    }
  }

  return CurrentFormValues;
}

function SetFormValues(sourceValues) {
  //Set Value for Material

  if (sourceValues.isRecycled) {
    document.getElementById("material_3dprint").value =
      sourceValues.material_3dprint + "_recycled";
  } else {
    document.getElementById("material_3dprint").value =
      sourceValues.material_3dprint;
  }

  //Set Value for location type
  if (sourceValues.location_3dprint === "region") {
    document.getElementById("distance_radio_3dprint_checkbox").checked = false;
    document.getElementById("region_radio_3dprint_checkbox").checked = true;

    region_3dprint.classList.remove("invisible");
    distance_3dprint.classList.add("invisible");

    //Set selected location
    document.getElementById("where_3d_print").value =
      sourceValues.where_3dprint;

    //Clear other option
    document.getElementById("_3dprint_distance_input").value = null;
  } else {
    document.getElementById("region_radio_3dprint_checkbox").checked = false;
    document.getElementById("distance_radio_3dprint_checkbox").checked = true;

    distance_3dprint.classList.remove("invisible");
    region_3dprint.classList.add("invisible");

    //Set selected Distance
    document.getElementById("_3dprint_distance_input").value =
      sourceValues.distance_3dprint;

    //Clear other option
    document.getElementById("where_3d_print").value = "choose";
  }

  //Set shipment method
  document.getElementById("shipment_3dprint").value =
    sourceValues.shipment_3dprint;

  //Set Country
  document.getElementById("country_3dprint").value =
    sourceValues.country_3dprint;

  //Set country. If USA, also show and set state
  if (sourceValues.country_3dprint === "United States") {
    document.getElementById("country_3dprint").value =
      sourceValues.country_3dprint;

    _3dprint_state_select.classList.remove("invisible");

    document.getElementById("state_3dprint").value = sourceValues.state_3dprint;
  } else {
    document.getElementById("country_3dprint").value =
      sourceValues.country_3dprint;
    document.getElementById("state_3dprint").value = null;
    _3dprint_state_select.classList.add("invisible");
  }

  //Set Machine
  if (sourceValues.machine_3dprint === "makerbot") {
    document.getElementById("ultimaker_checkbox").checked = false;
    document.getElementById("makerbot_checkbox").checked = true;
  } else {
    document.getElementById("makerbot_checkbox").checked = false;
    document.getElementById("ultimaker_checkbox").checked = true;
  }

  //Set Weight
  document.getElementById("_3dprint_weight_input").value =
    sourceValues.weight_3dprint;

  //Set Support input mode and values
  if (sourceValues.supportFieldType === "Slider") {
    document.querySelector("input[value=weight]").checked = false;
    document.querySelector("input[value=support_percent]").checked = true;

    slider.classList.remove("invisible");
    field.classList.add("invisible");

    //--Set value into slider
    document.getElementById("_3dprint_support_slider").value =
      sourceValues.supportSlider_3dprint;

    //--Clear other option
    document.getElementById("_3dprint_support_input").value = null;
  } else {
    document.querySelector("input[value=support_percent]").checked = false;
    document.querySelector("input[value=weight]").checked = true;

    field.classList.remove("invisible");
    slider.classList.add("invisible");

    //--Set support weight into text
    document.getElementById("_3dprint_support_input").value =
      sourceValues.supportInput_3dprint;

    //--Clear other option
    document.getElementById("_3dprint_support_slider").value = 50;
  }

  //Set Time
  document.getElementById("_3dprint_time_input").value =
    sourceValues.time_3dprint;

  //Set Iteration
  document.getElementById("_3dprint_iteration_input").value =
    sourceValues.iteration_3dprint;

  //Set End Of Life
  switch (sourceValues.eol_3dprint) {
    case "recycle_bin":
      document.getElementById("recyclebin_checkbox").checked = true;
      break;

    case "landfill":
      document.getElementById("landfill_checkbox").checked = true;
      break;

    case "incineration":
      document.getElementById("incineration_checkbox").checked = true;
      break;

    case "idk":
      document.getElementById("idk_checkbox").checked = true;
      break;
  }
}

function CalculateLifecycleImpact(sourceValues) {
  // Defining temporal values for operation
  var tempIteration = sourceValues.iteration_3dprint;
  var tempWeight = (sourceValues.weight_3dprint / 1000) * tempIteration;
  var tempTime = sourceValues.time_3dprint * tempIteration * 60;
  var tempMaterial = sourceValues.material_3dprint;
  var tempShipment = sourceValues.shipment_3dprint;
  var tempIsRecycled = sourceValues.isRecycled;
  var tempMachine = sourceValues.machine_3dprint;
  var tempEOL = sourceValues.eol_3dprint;

  // Defining Support Weight according to type of value

  if (sourceValues.supportFieldType === "Slider") {
    var tempSupportWeight =
      (sourceValues.supportSlider_3dprint / 100) * tempWeight;
  } else {
    var tempSupportWeight =
      (sourceValues.supportInput_3dprint / 1000) * tempIteration;
  }

  var tempPrototypingWeight = tempWeight - tempSupportWeight;
  var tempPrototypingWaste = tempSupportWeight;

  //Defining Location and Distance

  var tempLocationType = sourceValues.location_3dprint;

  if (tempLocationType === "region") {
    var tempLocation = sourceValues.where_3dprint;
  } else {
    var tempDistance = sourceValues.distance_3dprint;
  }

  //Defining country and electric Coefficient

  var tempCountry = sourceValues.country_3dprint;

  if (tempCountry === "United States") {
    var tempState = sourceValues.state_3dprint;
    var tempElectricCoef = electricity_state_coeff[tempState];
  } else {
    var tempElectricCoef = electricity_coeff[tempCountry];
  }

  // Calculate Manufacturing results

  var results_mat_manufacturing;
  if (tempIsRecycled) {
    results_mat_manufacturing = {
      energy:
        tempWeight * MATERIAL_3DPRINT[tempMaterial].emb_energy_recycling_avg,
      co2: tempWeight * MATERIAL_3DPRINT[tempMaterial].co2_recycling_avg,
    };
  } else {
    results_mat_manufacturing = {
      energy: tempWeight * MATERIAL_3DPRINT[tempMaterial].emb_energy_avg,
      co2: tempWeight * MATERIAL_3DPRINT[tempMaterial].co2_avg,
    };
  }

  // Calculate Transportation results

  var results_transportation;
  if (tempLocationType == "region") {
    results_transportation = transportation_calculation(
      tempShipment,
      tempLocation
    );
  } else {
    results_transportation = user_transport_calc(tempShipment, tempDistance);
  }
  results_transportation.energy = tempWeight * results_transportation.energy;
  results_transportation.co2 = tempWeight * results_transportation.co2;

  // Calculate Fabrication results

  let results_fabrication = {
    energy: null,
    co2: null,
  };

  results_fabrication.energy =
    (tempTime / 1000000) *
    (POWER[tempMachine]._3dprinting +
      POWER[tempMachine].cad_prep * PERCENTAGE_TIME.cad_prep +
      POWER[tempMachine].plate_warm_up *
        PERCENTAGE_TIME.plate_warm_up *
        MATERIAL_3DPRINT[tempMaterial].plate_warm_up +
      POWER[tempMachine].nozzle_warm_up *
        PERCENTAGE_TIME.nozzle_warm_up *
        MATERIAL_3DPRINT[tempMaterial].nozzle_warm_up +
      POWER[tempMachine].idle * PERCENTAGE_TIME.idle);

  results_fabrication.co2 =
    (results_fabrication.energy * tempElectricCoef) / 3.6;

  // Calculate End Life results

  var results_end_life = end_life_calculation(tempSupportWeight, tempEOL, {
    energy: MATERIAL_3DPRINT[tempMaterial].energy_incineration,
    co2: MATERIAL_3DPRINT[tempMaterial].co2_combustion,
  });

  // Join 4 results and return them

  let results_energy = {
    name: tempMaterial,
    mat_manufacturing: results_mat_manufacturing.energy,
    transportation: results_transportation.energy,
    fabrication: results_fabrication.energy,
    end_life: results_end_life.energy,
  };

  let results_co2 = {
    name: tempMaterial,
    mat_manufacturing: results_mat_manufacturing.co2,
    transportation: results_transportation.co2,
    fabrication: results_fabrication.co2,
    end_life: results_end_life.co2,
  };

  if (tempIsRecycled) {
    results_energy.name = tempMaterial + " Recycled";
    results_co2.name = tempMaterial + " Recycled";
  }

  let FinalResults = {
    resultsEnergy: results_energy,
    resultsCo2: results_co2,
  };

  return FinalResults;
}

function SetExclamationTexts(formValues) {
  set_manu_3dprint(formValues);
  set_transport_3dprint(formValues);
  set_fabrication_3dprint(formValues);
  set_end_life_3dprint(formValues);
}

function refresh_user_input() {
  _3dprint_iteration = parseFloat(
    document.getElementById("_3dprint_iteration_input").value
  );
  _3dprint_weight =
    (parseFloat(document.getElementById("_3dprint_weight_input").value) /
      1000) *
    _3dprint_iteration;
  _3dprint_time =
    parseFloat(document.getElementById("_3dprint_time_input").value) *
    60 *
    _3dprint_iteration;

  if (document.querySelector("input[value=support_percent]").checked) {
    _3dprint_support =
      (parseFloat(document.getElementById("_3dprint_support_slider").value) /
        100) *
      _3dprint_weight;
  } else {
    _3dprint_support =
      (parseFloat(document.getElementById("_3dprint_support_input").value) /
        1000) *
      _3dprint_iteration;
  }

  _3dprint_prototyping_weight = _3dprint_weight - _3dprint_support;
  _3dprint_prototyping_waste = _3dprint_support;

  var location_radios = document.getElementsByName("location_3dprint");
  l = location_radios.length;
  for (i = 0; i < l; i++) {
    checked = location_radios[i].checked;
    if (checked === true) {
      _3dprint_location_type = location_radios[i].value;
      break;
    }
  }

  if (_3dprint_location_type == "region") {
    let e = document.getElementById("where_3d_print");
    _3dprint_location = e.options[e.selectedIndex].value;
  } else {
    _3dprint_distance = parseFloat(
      document.getElementById("_3dprint_distance_input").value
    );
  }
  let e = document.getElementById("shipment_3dprint");
  _3dprint_shipment = e.options[e.selectedIndex].value;

  let mat = document.getElementById("material_3dprint").value;
  mat = mat.split("_");
  if (mat.length == 2) {
    recycled = true;
  } else {
    recycled = false;
  }
  _3dprint_material = mat[0];

  _3dprint_country = document.getElementById("country_3dprint").value;

  if (_3dprint_country == "United States") {
    let state = document.getElementById("state_3dprint").value;
    _3dprint_electric = electricity_state_coeff[state];
  } else {
    _3dprint_electric = electricity_coeff[_3dprint_country];
  }

  var machine_3dprint_radios_nodes = document.getElementsByName(
    "machine_3dprint_radio_button"
  );
  l = machine_3dprint_radios_nodes.length;

  for (i = 0; i < l; i++) {
    checked = machine_3dprint_radios_nodes[i].checked;
    if (checked === true) {
      _3dprint_machine = machine_3dprint_radios_nodes[i].value;
      break;
    }
  }

  var end_of_life_radios_nodes = document.getElementsByName(
    "end_of_life_radio_button"
  );
  l = end_of_life_radios_nodes.length;

  for (i = 0; i < l; i++) {
    checked = end_of_life_radios_nodes[i].checked;
    if (checked === true) {
      _3dprint_end_life = end_of_life_radios_nodes[i].value;
      break;
    }
  }
}

function lifecycle_calculation_3dprint() {
  //raw materials manufacturing
  var results_mat_manufacturing;
  if (recycled) {
    results_mat_manufacturing = {
      energy:
        _3dprint_weight *
        MATERIAL_3DPRINT[_3dprint_material].emb_energy_recycling_avg,
      co2:
        _3dprint_weight * MATERIAL_3DPRINT[_3dprint_material].co2_recycling_avg,
    };
  } else {
    results_mat_manufacturing = {
      energy:
        _3dprint_weight * MATERIAL_3DPRINT[_3dprint_material].emb_energy_avg,
      co2: _3dprint_weight * MATERIAL_3DPRINT[_3dprint_material].co2_avg,
    };
  }
  //transportation
  var results_transportation;
  if (_3dprint_location_type == "region") {
    results_transportation = transportation_calculation(
      _3dprint_shipment,
      _3dprint_location
    );
  } else {
    results_transportation = user_transport_calc(
      _3dprint_shipment,
      _3dprint_distance
    );
  }
  results_transportation.energy =
    _3dprint_weight * results_transportation.energy;
  results_transportation.co2 = _3dprint_weight * results_transportation.co2;

  //fabrication
  let results_fabrication = {
    energy: null,
    co2: null,
  };

  results_fabrication.energy =
    (_3dprint_time / 1000000) *
    (POWER[_3dprint_machine]._3dprinting +
      POWER[_3dprint_machine].cad_prep * PERCENTAGE_TIME.cad_prep +
      POWER[_3dprint_machine].plate_warm_up *
        PERCENTAGE_TIME.plate_warm_up *
        MATERIAL_3DPRINT[_3dprint_material].plate_warm_up +
      POWER[_3dprint_machine].nozzle_warm_up *
        PERCENTAGE_TIME.nozzle_warm_up *
        MATERIAL_3DPRINT[_3dprint_material].nozzle_warm_up +
      POWER[_3dprint_machine].idle * PERCENTAGE_TIME.idle);

  results_fabrication.co2 =
    (results_fabrication.energy * _3dprint_electric) / 3.6;

  //end_life
  var results_end_life = end_life_calculation(
    _3dprint_support,
    _3dprint_end_life,
    {
      energy: MATERIAL_3DPRINT[_3dprint_material].energy_incineration,
      co2: MATERIAL_3DPRINT[_3dprint_material].co2_combustion,
    }
  );

  return {
    mat_manufacturing: results_mat_manufacturing,
    transportation: results_transportation,
    fabrication: results_fabrication,
    end_life: results_end_life,
  };
}

document
  .getElementById("btn_calculate")
  .addEventListener("click", start_the_magic_calculate_mode);

function start_the_magic_calculate_mode() {
  //define object
  var Object3DPrint = new Object_3dprint();

  //save the contents
  Object3DPrint.formValues = SaveFormValues();

  // calculate values
  var ResultsAux = CalculateLifecycleImpact(Object3DPrint.formValues);
  Object3DPrint.resultsEnergy = ResultsAux.resultsEnergy;
  Object3DPrint.resultsCo2 = ResultsAux.resultsCo2;

  SetExclamationTexts(Object3DPrint.formValues);

  //Save onto array
  if (hasJobStackEmpty) {
    var gridDivEnergy = document.querySelector("#myGridEnergy");
    var gridDivCo2 = document.querySelector("#myGridCo2");

    new agGrid.Grid(gridDivEnergy, gridOptionsEnergy);
    new agGrid.Grid(gridDivCo2, gridOptionsCo2);

    ShowAddJobButton();

    jobsArray.push(Object3DPrint);

    //Add to table
    addRowEnergy(selectedPage, Object3DPrint.resultsEnergy);
    addRowCo2(selectedPage, Object3DPrint.resultsCo2);
  } else {
    if (isDeleteJobHidden && selectedPage != 1) {
      ShowDeleteJobButton();
    } else {
      SetDeleteJobActive();
    }

    jobsArray[selectedPage - 1] = Object3DPrint;

    if (isUpdating) {
      updateRowEnergy(selectedPage, Object3DPrint.resultsEnergy);
      updateRowCo2(selectedPage, Object3DPrint.resultsCo2);
    } else {
      update_button_onSubmit();
      addRowEnergy(selectedPage, Object3DPrint.resultsEnergy);
      addRowCo2(selectedPage, Object3DPrint.resultsCo2);
    }
    //if it already exists, update
  }
  // Print and draw
}

function getAndAddUpSelectedJobsEnergy() {
  let selectedJobsSum = {
    name: "",
    mat_manufacturing: 0,
    transportation: 0,
    fabrication: 0,
    end_life: 0,
  };

  jobsArray.forEach(function (job, index) {
    if (selectedJobsEnergy.includes(index + 1)) {
      if (selectedJobsSum.name == "") {
        selectedJobsSum.name += "Job " + (index + 1);
      } else {
        selectedJobsSum.name += ", Job " + (index + 1);
      }

      selectedJobsSum.mat_manufacturing += job.resultsEnergy.mat_manufacturing;
      selectedJobsSum.transportation += job.resultsEnergy.transportation;
      selectedJobsSum.fabrication += job.resultsEnergy.fabrication;
      selectedJobsSum.end_life += job.resultsEnergy.end_life;
    }
  });

  return selectedJobsSum;
}

function getAndAddUpSelectedJobsCo2() {
  let selectedJobsSum = {
    name: "",
    mat_manufacturing: 0,
    transportation: 0,
    fabrication: 0,
    end_life: 0,
  };

  jobsArray.forEach(function (job, index) {
    if (selectedJobsCo2.includes(index + 1)) {
      if (selectedJobsSum.name == "") {
        selectedJobsSum.name += "Job " + (index + 1);
      } else {
        selectedJobsSum.name += ", Job " + (index + 1);
      }
      selectedJobsSum.mat_manufacturing += job.resultsCo2.mat_manufacturing;
      selectedJobsSum.transportation += job.resultsCo2.transportation;
      selectedJobsSum.fabrication += job.resultsCo2.fabrication;
      selectedJobsSum.end_life += job.resultsCo2.end_life;
    }
  });

  return selectedJobsSum;
}

//Setting Manufacturing Text
function set_manu_3dprint(sourceValues) {
  let text;
  let textbox = document.querySelector("#manufacturing_textbox_3dprint");

  var tempMaterial = sourceValues.material_3dprint;
  var tempIsRecycled = sourceValues.isRecycled;

  _3dprint_manu_exclamation.classList.remove("invisible");
  //remove if prev value was good
  textbox.classList.remove("good");
  _3dprint_manu_exclamation.classList.remove("good");

  if (tempMaterial == "PLA" && tempIsRecycled) {
    textbox.classList.add("good");
    _3dprint_manu_exclamation.classList.add("good");
    text = document.createTextNode(
      "PLA has a lower environmental impact than ABS and Nylon. PLA recycled uses 46% less energy and emits 54% less CO2 than PLA manufactured for the first time."
    );
  } else if (tempMaterial == "PLA") {
    text = document.createTextNode(
      "PLA has a lower environmental impact than ABS and Nylon. However, PLA recycled uses 46% less energy and emits 54% less CO2 than PLA manufactured for the first time. Next time, ask your provider for PLA recycled to reduce your environmental impact in this phase."
    );
  } else if (tempMaterial == "ABS" && tempIsRecycled) {
    text = document.createTextNode(
      "ABS has a higher environmental impact than PLA. However, ABS recycled uses 59% less energy and emits 40% less CO2 than ABS manufactured for the first time. Next time, ask your provider for ABS recycled or PLA recycled to reduce your environmental impact in this phase."
    );
  } else if (tempMaterial == "ABS") {
    text = document.createTextNode(
      "ABS primary manufacturing has a higher environmental impact than ABS recycled and PLA. ABS uses 41% more energy and emits 60% more CO2 than ABS recycled. Next time, ask your provider for ABS recycled or PLA recycled to reduce your environmental impact in this phase."
    );
  } else if (tempMaterial == "Nylon" && tempIsRecycled) {
    text = document.createTextNode(
      "Nylon has a higher environmental impact than ABS and PLA. However, Nylon recycled uses 69% less energy and emits 74.5% less CO2 than Nylon manufactured for the first time. Next time, ask your provider for Nylon recycled, ABS recycled or PLA recycled to reduce your environmental impact in this phase."
    );
  } else {
    //reg nylon
    text = document.createTextNode(
      "Nylon primary manufacturing has a higher environmental impact than Nylon recycled, ABS or PLA. Nylon uses 31% more energy and emits 16.5% more CO2 than Nylon recycled. Next time, ask your provider for Nylon recycled, ABS recycled or PLA recycled to reduce your environmental impact in this phase."
    );
  }
  textbox.innerHTML = "";
  textbox.appendChild(text);
}

// Defining Functionalities of Exclamation, text box and close button

let _3dprint_manu_exclamation = document.querySelector(
  "#manufacturing_exclamation_3dprint"
);

_3dprint_manu_exclamation.addEventListener("click", function () {
  document
    .querySelector("#manufacturing_textbox_3dprint")
    .parentElement.classList.remove("invisible");
});

document
  .querySelector("#x_manufacturing_3dprint")
  .addEventListener("click", function () {
    document
      .querySelector("#manufacturing_textbox_3dprint")
      .parentElement.classList.add("invisible");
  });

// Setting transportation text

function set_transport_3dprint(sourceValues) {
  var tempLocationType = sourceValues.location_3dprint;
  var tempShipment = sourceValues.shipment_3dprint;
  var tempLocation = null;
  var tempDistance = null;

  if (tempLocationType === "region") {
    tempLocation = sourceValues.where_3dprint;
  } else {
    tempDistance = sourceValues.distance_3dprint;
  }

  let textbox = document.querySelector("#transport_textbox_3dprint");
  _3dprint_transport_exclamation.classList.remove("invisible");

  if (tempLocation == "Local") {
    textbox.classList.add("good");
    _3dprint_transport_exclamation.classList.add("good");
  } else {
    textbox.classList.remove("good");
    _3dprint_transport_exclamation.classList.remove("good");
  }

  let text;
  if (tempLocationType == "region") {
    text = get_transport_text(tempLocationType, tempShipment);
  } else {
    text = get_transport_text(tempDistance, tempShipment);
  }
  textbox.innerHTML = "";
  textbox.appendChild(text);
}

// Defining Functionalities of Exclamation, text box and close button

let _3dprint_transport_exclamation = document.querySelector(
  "#transport_exclamation_3dprint"
);
_3dprint_transport_exclamation.addEventListener("click", function () {
  document
    .querySelector("#transport_textbox_3dprint")
    .parentElement.classList.remove("invisible");
});

document
  .querySelector("#x_transport_3dprint")
  .addEventListener("click", function () {
    document
      .querySelector("#transport_textbox_3dprint")
      .parentElement.classList.add("invisible");
  });

// Setting transportation text

function set_fabrication_3dprint(sourceValues) {
  var tempMachine = sourceValues.machine_3dprint;
  var tempCountry = sourceValues.country_3dprint;
  let textbox = document.querySelector("#fabrication_textbox_3dprint");
  _3dprint_fabrication_exclamation.classList.remove("invisible");
  let text = get_electric_text(tempCountry);

  var tempMachine = sourceValues.machine_3dprint;

  if (tempMachine == "makerbot") {
    textbox.classList.add("good");
    _3dprint_fabrication_exclamation.classList.add("good");
    text.appendChild(
      document.createTextNode(
        "Makerbot Replicator+ is the best choice, using half as much power than Ultimaker 2 Extended in the molding process. You can save energy by reducing print time by adjusting the 3D print speed to 50 mm/s average, changing the infill density to 10-15% and reducing idle time by turning off the machine when not in use"
      )
    );
  } else {
    //ultimaker
    textbox.classList.remove("good");
    _3dprint_fabrication_exclamation.classList.remove("good");
    text.appendChild(
      document.createTextNode(
        "Ultimaker 2 Extended uses twice as much power than Makerbot Replicator+ in the molding process. You can save energy by reducing print time by adjusting the 3D print speed to 50 mm/s average, changing the infill density to 10-15% and reducing idle time by turning off the machine when not in use."
      )
    );
  }

  textbox.innerHTML = "";
  textbox.appendChild(text);
}

// Defining Functionalities of Exclamation, text box and close button

let _3dprint_fabrication_exclamation = document.querySelector(
  "#fabrication_exclamation_3dprint"
);
_3dprint_fabrication_exclamation.addEventListener("click", function () {
  document
    .querySelector("#fabrication_textbox_3dprint")
    .parentElement.classList.remove("invisible");
});

document
  .querySelector("#x_fabrication_3dprint")
  .addEventListener("click", function () {
    document
      .querySelector("#fabrication_textbox_3dprint")
      .parentElement.classList.add("invisible");
  });

// Setting EndLife text

function set_end_life_3dprint(sourceValues) {
  let textbox = document.querySelector("#end_life_textbox_3dprint");
  _3dprint_end_life_exclamation.classList.remove("invisible");
  let text = document.createDocumentFragment();

  var tempEOL = sourceValues.eol_3dprint;
  var tempMaterial = sourceValues.material_3dprint;

  if (tempEOL == "idk") {
    text.appendChild(
      document.createTextNode(
        "Since you didn't specify an end of life type, we assume your material will end up in the landfill."
      )
    );
    text.appendChild(document.createElement("BR"));
    tempEOL = "landfill";
  }
  if (tempEOL == "recycle_bin") {
    text.appendChild(
      document.createTextNode(
        "Recycling reduces the need for extracting, refining and processing raw materials all of which create substantial air and water pollution. Recycling allows the waste to become the raw material for a new material with lower embodied energy than a primary manufactured one. However, the recycling process still generates CO2 emissions which can be avoided by using compostable materials. We only analyzed the cost of transporting the waste to a recycling facility."
      )
    );
  } else if (tempEOL == "incineration") {
    text.appendChild(
      document.createTextNode(
        "Even though the incineration process generates energy bonus because of the burning process, it still creates about 8000% more CO2 emissions than when the waste is recycled. We analyzed the cost of transporting the waste to a garbage facility and the energy and CO2 emissions generated from burning the waste."
      )
    );
  } else if (tempEOL == "landfill") {
    if (tempMaterial == "PLA") {
      text.appendChild(
        document.createTextNode(
          "If PLA ends up in the landfill, it breaks down anaerobically to release methane, a greenhouse gas that is about 30 times more potent than carbon dioxide and that contributes to climate change (2). Sending your waste to recycling reduces the need for extracting, refining and processing raw materials all of which create substantial air and water pollution. Recycling allows the waste to become the raw material for a new material with lower embodied energy than a primary manufactured one. 20 % of total US methane emissions come from landfills. We only analyzed the cost of transporting the waste to a landfill."
        )
      );
    } else if (tempMaterial == "ABS") {
      text.appendChild(
        document.createTextNode(
          "If ABS ends up in the landfill, it becomes a potential source of microplastics. Landfills can impact on air, water and land quality. Sending your waste to recycling reduces the need for extracting, refining and processing raw materials all of which create substantial air and water pollution. Recycling allows the waste to become the raw material for a new material with lower embodied energy than a primary manufactured one. We only analyzed the cost of transporting the waste to a landfill."
        )
      );
    } else if (tempMaterial == "Nylon") {
      text.appendChild(
        document.createTextNode(
          "If Nylon ends up in the landfill, it becomes a potential source of microplastics. Landfills can impact on air, water and land quality. Sending your waste to recycling reduces the need for extracting, refining and processing raw materials all of which create substantial air and water pollution. Recycling allows the waste to become the raw material for a new material with lower embodied energy than a primary manufactured one. We only analyzed the cost of transporting the waste to a landfill."
        )
      );
    }
  }
  textbox.innerHTML = "";
  textbox.appendChild(text);
}

let _3dprint_end_life_exclamation = document.querySelector(
  "#end_life_exclamation_3dprint"
);
_3dprint_end_life_exclamation.addEventListener("click", function () {
  document
    .querySelector("#end_life_textbox_3dprint")
    .parentElement.classList.remove("invisible");
});

document
  .querySelector("#x_end_life_3dprint")
  .addEventListener("click", function () {
    document
      .querySelector("#end_life_textbox_3dprint")
      .parentElement.classList.add("invisible");
  });
