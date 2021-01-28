let jobsArray = [];

const TESTSOURCEVALUE = {
  material_3dprint: "PLA",
  location_3dprint: "distance",
  distance_3dprint: 17353,
  where_3dprint: "International",
  shipment_3dprint: "By sea",
  country_3dprint: "Peru",
  machine_3dprint: "ultimaker",
  weight_3dprint: 654.88,
  supportFieldType: "Input",
  supportInput_3dprint: 41.12,
  time_3dprint: 2053,
  iteration_3dprint: 1,
  eol_3dprint: "landfill",
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

//HELPER DEBUG
document.getElementById("btn_helper").addEventListener("click", function () {
  SetFormValues(TESTSOURCEVALUE);
});

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

    //ADD WARNING EXCLAMATION

    document.querySelectorAll(".clickableAwesomeFont3D").forEach((item, i) => {
      item.classList.add("invisible");
    });

    document.querySelectorAll(".hoverAwesomeFont3D").forEach((item, i) => {
      item.classList.add("invisible");
    });
  }

  //Else, do nothing (accessing a job thats just being created)
});

document.addEventListener("changePageFromTable", function (e) {
  selectedPage = e;
  //Set Delete Job enabled
  SetDeleteJobActive();

  update_button_onSubmit();
  SetFormValues(jobsArray[e.detail - 1].formValues);
  SetExclamationTexts(jobsArray[e.detail - 1].formValues);
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
    document.getElementById("pagJob").classList.remove("invisible");
    document.getElementById("pagLeft").classList.remove("invisible");
    document.getElementById("pagRight").classList.remove("invisible");

    var gridDivEnergy = document.querySelector("#myGridEnergy");
    var gridDivCo2 = document.querySelector("#myGridCo2");

    new agGrid.Grid(gridDivEnergy, gridOptionsEnergy);
    new agGrid.Grid(gridDivCo2, gridOptionsCo2);

    ShowAddJobButton();
    ShowTableTitles();

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

  CurrentlySelectedJobsTitleEnergy = "";

  jobsArray.forEach(function (job, index) {
    if (selectedJobsEnergy.includes(index + 1)) {
      if (selectedJobsSum.name == "") {
        selectedJobsSum.name += "Job " + (index + 1);
        CurrentlySelectedJobsTitleEnergy += "J" + (index + 1);
      } else {
        selectedJobsSum.name += ", Job " + (index + 1);
        CurrentlySelectedJobsTitleEnergy += ", J" + (index + 1);
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

  CurrentlySelectedJobsTitleCO2 = "";

  jobsArray.forEach(function (job, index) {
    if (selectedJobsCo2.includes(index + 1)) {
      if (selectedJobsSum.name == "") {
        selectedJobsSum.name += "Job " + (index + 1);
        CurrentlySelectedJobsTitleCO2 += "J" + (index + 1);
      } else {
        selectedJobsSum.name += ", Job " + (index + 1);
        CurrentlySelectedJobsTitleCO2 += ", J" + (index + 1);
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
  let textbox = document.querySelector("#manufacturing_textbox_3dprint");

  var tempMaterial = sourceValues.material_3dprint;
  var tempIsRecycled = sourceValues.isRecycled;

  warningManu3D.classList.remove("invisible");
  document.getElementById("infoManuMat3D").classList.remove("invisible");

  textDiv = document.createElement("div");
  textDiv.innerHTML = "";
  textDiv.style.cssText = "display: inline-block;";
  var textTemp = "";

  if (tempMaterial == "PLA" && tempIsRecycled) {
    textTemp =
      "Pros:<br>- Lower environmental impact compared to ABS and Nylon.<br>- It uses 46% less energy than Standard (virgin) PLA when manufactured .<br>- It emits 54% less CO<sub>2</sub> than Standard (virgin) PLA when manufactured.";
    SetInfoText("mat", textTemp, false);
  } else if (tempMaterial == "PLA") {
    textDiv.innerHTML =
      "Suggestion:\r\n- Switch to Recycled PLA filament.</span>";
    textTemp =
      "Pros:<br>- Lower environmental impact compared to ABS and Nylon.<br><span class='innerRedText'>Cons:<br>-  It uses <span class='innerBoldText'>46% more energy</span> than Recycled PLA when manufactured.<br>-  It emits <span class='innerBoldText'>54% more CO<sub>2</sub></span> than Recycled PLA when manufactured.</span>";
    SetInfoText("mat", textTemp, true);
  } else if (tempMaterial == "ABS" && tempIsRecycled) {
    textDiv.innerHTML =
      "<span class='innerRedText'>Suggestion:\r\n- Switch to Recycled PLA filament.</span>";
    textTemp =
      "Pros:<br>- Lower environmental impact compared to Standard (virgin) ABS and Nylon.<br>- It uses <span class='innerBoldText'>60% less energy</span> than Standard (virgin) ABS when manufactured.<br>- It emits <span class='innerBoldText'>41% less CO<sub>2</sub></span> than Standard (virgin) ABS when manufactured.<br><span class='innerRedText'>Cons:<br>-  It uses <span class='innerBoldText'>27% more energy</span>  than Recycled PLA when manufactured.<br>-  It emits <span class='innerBoldText'>27% more CO<sub>2</sub></span>  than Recycled PLA when manufactured.</span>";
    SetInfoText("mat", textTemp, true);
  } else if (tempMaterial == "ABS") {
    textDiv.innerHTML =
      "<span class='innerRedText'>\r\nSuggestion:\r\n- Switch to Recycled ABS or Recycled PLA filament.</span> ";
    textTemp =
      "Pros:<br>- Lower environmental impact compared to Nylon.<br><span class='innerRedText'>Cons:<br>-  It uses <span class='innerBoldText'>60% more energy</span>  than Recycled ABS when manufactured.\r\n-  It emits <span class='innerBoldText'>41% more CO<sub>2</sub></span>  than Recycled ABS when manufactured.</span>";
    SetInfoText("mat", textTemp, true);
  } else if (tempMaterial == "Nylon" && tempIsRecycled) {
    textTemp =
      "Pros:<br>- Lower environmental impact compared to recycled ABS.<br>- It uses <span class='innerBoldText'>69% less energy</span>  than Standard (virgin) Nylon when manufactured.<br>- It emits <span class='innerBoldText'>75% less CO<sub>2</sub></span>  than Standard (virgin) Nylon when manufactured.";
    SetInfoText("mat", textTemp, false);
  } else {
    //reg nylon
    textDiv.innerHTML =
      "<span class='innerRedText'>Suggestion:\r\n- Switch to Recycled Nylon, ABS, or PLA filaments.</span>";
    textTemp =
      "<span class='innerRedText'>Cons:<br>- Higher environmental impact compared to Standard (virgin) ABS and PLA.<br>-  It uses <span class='innerBoldText'>31% more energy</span>  than Recycled Nylon when manufactured.<br>-  It emits <span class='innerBoldText'>17% more CO<sub>2</sub></span>  than Recycled Nylon when manufactured.</span>";
    SetInfoText("mat", textTemp, true);
  }
  textbox.innerHTML = "";

  if (textDiv.innerHTML == "") {
    warningManu3D.classList.add("invisible");
  } else {
    textbox.appendChild(textDiv);
  }
}

// Defining Functionalities of Exclamation, text box and close button

let warningManu3D = document.querySelector("#warningManu3D");

warningManu3D.addEventListener("click", function () {
  if (!isReadingManu3d) {
    document
      .querySelector("#manufacturing_textbox_3dprint")
      .parentElement.classList.remove("invisible");
    isReadingManu3d = true;
  } else {
    document
      .querySelector("#manufacturing_textbox_3dprint")
      .parentElement.classList.add("invisible");
    isReadingManu3d = false;
  }
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
  warningTrans3d.classList.remove("invisible");
  document.getElementById("infoRegion3D").classList.remove("invisible");
  document.getElementById("infoShip3D").classList.remove("invisible");

  var textTemp = "";
  var sugCounter = 0;

  // Set Location Type text

  if (tempLocationType != "region") {
    tempLocation = get_transport_location(tempDistance);
  }

  textDivSug = document.createElement("div");
  textDivSug.innerHTML = "";
  textDivSug.style.cssText = "display: inline-block;";

  textbox.innerHTML = "";

  switch (tempLocation) {
    case "International":
      textTemp =
        "<span class='innerRedText'>Cons:<br>- International: <span class='innerBoldText'>95% higher</span>  environmental impact than national and local distances. Therefore, more fuel consumption and CO<sub>2</sub> emissions.</span>";
      SetInfoText("reg", textTemp, true);
      textDivSug.innerHTML += "- Use locally manufactured material.\r\n";
      sugCounter++;
      break;

    case "National":
      textTemp =
        "<span class='innerRedText'>Cons:<br>- National: <span class='innerBoldText'>30% higher</span>  environmental impact than local distances. Therefore, more fuel consumption and CO<sub>2</sub> emissions.</span>";
      textDivSug.innerHTML += "- Use locally manufactured material.\r\n";
      SetInfoText("reg", textTemp, true);
      sugCounter++;
      break;

    case "Local":
      textTemp =
        "Pros:<br>- Local distances have <span class='innerBoldText'>95% and 30% lower</span>  environmental impact than international and national distances respectively.<br>- Shorter distances require less fuel and therefore generate less CO<sub>2</sub> emissions.";
      SetInfoText("reg", textTemp, false);
      break;
    case "IDK":
      textTemp =
        "<span class='innerRedText'>Cons:<br>- We assumed your material traveled from China. Therefore, more fuel consumption and CO<sub>2</sub> emissions.</span>";
      SetInfoText("reg", textTemp, true);
      textDivSug.innerHTML +=
        "- Find out where your materials are coming from.\r\n- Use locally manufactured material.\r\n";
      sugCounter++;
      break;
  }

  // Set Shipping Text

  switch (tempShipment) {
    case "By air":
      textTemp =
        "<span class='innerRedText'>Cons:<br>- Airplanes consume <span class='innerBoldText'>1000% more energy</span> and emit <span class='innerBoldText'>700% more CO<sub>2</sub></span> than road transportation.</span>";
      SetInfoText("ship", textTemp, true);
      textDivSug.innerHTML += "- Switch to ocean or road shipping.\r\n";
      sugCounter++;
      break;
    case "By sea":
      textTemp =
        "Pros:<br>- Ocean shipping has a lower environmental impact compared to air and road shipping.<br>- It uses <span class='innerBoldText'>700% less energy</span> and emits <span class='innerBoldText'>730% less CO<sub>2</sub></span> than road shipping for national distances.";
      SetInfoText("ship", textTemp, false);
      break;
    case "By road":
      textTemp =
        "<span class='innerRedText'>Cons:<br>- Light goods vehicles use <span class='innerBoldText'>115% more energy</span> and emit <span class='innerBoldText'>63% more CO<sub>2</sub></span> than trucks.<br>- A small truck uses <span class='innerBoldText'>30% more energy</span> and emits <span class='innerBoldText'>50% more CO<sub>2</sub></span> than a big truck.</span>";
      SetInfoText("ship", textTemp, false);
      textDivSug.innerHTML += "- Avoid express delivery.\r\n";
      sugCounter++;
      break;

    case "I don't know":
      if (tempLocation == "IDK") {
        textTemp =
          "<span class='innerRedText'>Cons:<br>- We assumed your material traveled from China, by airplane. Therefore, more fuel consumption and CO<sub>2</sub> emissions.</span>";
        SetInfoText("ship", textTemp, true);
        textDivSug.innerHTML =
          "- Find out where your materials are coming from.\r\n- Use locally manufactured material.\r\n";
        sugCounter++;
      } else if (tempLocation == "International") {
        textTemp =
          "<span class='innerRedText'>Cons:<br>- We assumed your material traveled from China, by airplane. Therefore, more fuel consumption and CO<sub>2</sub> emissions.</span>";
        SetInfoText("ship", textTemp, true);
      } else if (tempLocation == "National") {
        textTemp =
          "<span class='innerRedText'>Cons:<br>- We assumed your material was transported from 300km away by road.</span>";
        SetInfoText("ship", textTemp, true);
      } else {
        textTemp =
          "<span class='innerRedText'>Cons:<br>- We assumed your material was transported from 100km away by road.</span>";
        SetInfoText("ship", textTemp, true);
      }

      break;
  }

  if (textDivSug.innerHTML != "") {
    textDivSug.innerHTML =
      "<br/><span class='innerRedText'>Suggestion:\r\n" +
      textDivSug.innerHTML +
      "</span>";
    textbox.appendChild(textDivSug);
    WarningTrans3d.setContent("You have " + sugCounter + " suggestion(s).");
  } else {
    document.getElementById("warningTrans3D").classList.add("invisible");
  }
}

// Defining Functionalities of Exclamation, text box and close button

let warningTrans3d = document.querySelector("#warningTrans3D");

warningTrans3d.addEventListener("click", function () {
  if (!isReadingTrans3d) {
    document
      .querySelector("#transport_textbox_3dprint")
      .parentElement.classList.remove("invisible");
    isReadingTrans3d = true;
  } else {
    document
      .querySelector("#transport_textbox_3dprint")
      .parentElement.classList.add("invisible");
    isReadingTrans3d = false;
  }
});

document
  .querySelector("#x_transport_3dprint")
  .addEventListener("click", function () {
    document
      .querySelector("#transport_textbox_3dprint")
      .parentElement.classList.add("invisible");
  });

// Setting fabrication text

function set_fabrication_3dprint(sourceValues) {
  var tempMachine = sourceValues.machine_3dprint;
  var tempCountry = sourceValues.country_3dprint;
  let textbox = document.querySelector("#fabrication_textbox_3dprint");

  warningDig3D.classList.remove("invisible");
  document.getElementById("infoLabLoc3D").classList.remove("invisible");
  document.getElementById("infoPrinter3D").classList.remove("invisible");

  textbox.innerHTML = "";

  textDivMachine = document.createElement("div");
  textDivMachine.innerHTML = "";
  textDivMachine.style.cssText = "display: inline-block;";

  var textTemp = "";

  let textCountry = get_electric_text(tempCountry);
  textTemp =
    "Electricity Mix:<br>- The lab location determines the source of the electricity used to run the machines.<br>- The CO<sub>2</sub> emissions depend on the blends of electricity sources.<br>- From worst to best sources: coal, nuclear power, hydroelectric power, solar photovoltaics, geothermal power, and Concentrated Solar Power (CSP).<br><br>" +
    textCountry;
  SetInfoText("lab", textTemp, true);

  var tempMachine = sourceValues.machine_3dprint;

  if (tempMachine == "makerbot") {
    textTemp =
      "Pros:<br>- Makerbot Replicator+ uses half as much power as Ultimaker 2 Extended in the molding process.<br><br><span class='innerRedText'>";
    SetInfoText("print", textTemp, false);
  } else {
    //ultimaker
    textTemp =
      "<span class='innerRedText'>Cons:<br>- Ultimaker 2 Extended uses twice as much power as Makerbot Replicator+ in the molding process.<span>";
    textDivMachine.innerHTML =
      "<span class='innerRedText'>Suggestions:\r\n- Reduce printing time by adjusting printing speed to 50 mm/s average.\r\n- Change infill density to 10-15%.\r\n- Turn off the machine when not in use.\r\n- 3D print in series.\r\n- Edit the firmware to turn off the motors during stand-by time.</span>";
  }

  textTemp =
    "Energy efficiency:<br>- Energy consumption of machines varies widely depending on printer type, part geometry, machine utilization rate (idle, stand by, and printing time), print set-up, and material.<br><br>" +
    textTemp;

  if (tempMachine == "makerbot") {
    SetInfoText("print", textTemp, false);
  } else {
    SetInfoText("print", textTemp, true);
  }
  WarningDig3d.setContent("You have 5 suggestions.");
  textbox.appendChild(textDivMachine);
}

// Defining Functionalities of Exclamation, text box and close button

let warningDig3D = document.querySelector("#warningDig3D");

warningDig3D.addEventListener("click", function () {
  if (!isReadingDig3d) {
    document
      .querySelector("#fabrication_textbox_3dprint")
      .parentElement.classList.remove("invisible");
    isReadingDig3d = true;
  } else {
    document
      .querySelector("#fabrication_textbox_3dprint")
      .parentElement.classList.add("invisible");
    isReadingDig3d = false;
  }
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
  warningEOL3D.classList.remove("invisible");
  document.getElementById("infoEOL3D").classList.remove("invisible");
  textbox.innerHTML = "";

  var tempEOL = sourceValues.eol_3dprint;
  var tempMaterial = sourceValues.material_3dprint;

  textDivSug = document.createElement("div");
  textDivSug.innerHTML = "";
  textDivSug.style.cssText = "display: inline-block;";
  var TooltipTxt = "";

  if (tempEOL == "recycle_bin") {
    TooltipTxt =
      "Recycling:<br><br>Pros:<br>- Recycling reduces the need for extracting, refining and processing raw materials all of which create substantial air and water pollution.<br>- It allows the waste to become the raw material for a new material with lower embodied energy than a virgin one.<br><br/><span class='innerRedText'>Cons:<br>- The recycling process in an industrial facility generates CO<sub>2</sub> emissions.<br><br/></span><span class='innerSmallerText'>*We only analyzed the cost of transporting the waste to a recycling facility.<br></span>";
    textDivSug.innerHTML =
      "- Look for alternative materials that are either compostable or biodegradable in natural conditions.\r\n";
  }
  if (tempEOL == "landfill" || tempEOL == "idk") {
    var tempText;

    if (tempMaterial == "PLA") {
      tempText =
        "- PLA that ends up in the landfill breaks down anaerobically to release methane, a greenhouse gas that is about 30 times more potent than carbon dioxide and contributes to climate change.<br>- 20% of total US. methane emissions come from landfills.<br/>";
    } else if (tempMaterial == "ABS") {
      tempText =
        "- ABS that ends up in the landfill becomes a potential source of microplastics.<br>- Landfills impact the air, water, and land quality.<br>";
    } else if (tempMaterial == "Nylon") {
      tempText =
        "- Nylon that ends up in the landfill becomes a potential source of microplastics.<br>- Landfills impact the air, water, and land quality. <br/>";
    }

    textDivSug.innerHTML +=
      "- Send your waste to a recycling facility to reduce the need for extracting, refining and processing raw materials all of which create substantial air and water pollution.\r\n- Recycling allows the waste to become the raw material for a new material with lower embodied energy than virgin material.\r\n";

    if (tempEOL == "idk") {
      tempText =
        "We analyzed the cost of transporting the waste to a landfill area.<br><br><span class='innerRedText'>Cons:<br>- We assumed your material ended up in the landfill.<br>" +
        tempText +
        "</span>";
    } else {
      tempText =
        "We analyzed the cost of transporting the waste to a landfill area.<br><br/><span class='innerRedText'>Cons:<br>" +
        tempText +
        "</span>";
    }

    TooltipTxt = TooltipTxt + tempText;
    SetInfoText("eol", TooltipTxt, true);
  } else if (tempEOL == "incineration") {
    TooltipTxt +=
      "We analyzed the cost of transporting the waste to a garbage facility and the energy and CO<sub>2</sub> emissions generated from burning the waste.<br><br/>Pros:<br>- The incineration process generates an energy bonus because of the burning process.<br><br/><span class='innerRedText'>Cons:<br>- It creates about 8000% more CO<sub>2</sub> emissions than recycling. </span>";
    SetInfoText("eol", TooltipTxt, true);
  }

  textbox.appendChild(textDivSug);
}

let warningEOL3D = document.querySelector("#warningEOL3D");

warningEOL3D.addEventListener("click", function () {
  if (!isReadingEol3d) {
    document
      .querySelector("#end_life_textbox_3dprint")
      .parentElement.classList.remove("invisible");
    isReadingEol3d = true;
  } else {
    document
      .querySelector("#end_life_textbox_3dprint")
      .parentElement.classList.add("invisible");
    isReadingEol3d = false;
  }
});

document
  .querySelector("#x_end_life_3dprint")
  .addEventListener("click", function () {
    document
      .querySelector("#end_life_textbox_3dprint")
      .parentElement.classList.add("invisible");
  });

//-- arrow nav -- //

let leftNav3D = document.querySelector("#pagLeft");

leftNav3D.addEventListener("click", function () {
  console.log("peeji" + selectedPage);
  let targetPage = selectedPage - 1;

  if (targetPage != 0) {
    console.log("yup");
    selectedPage = targetPage;
    SetDeleteJobActive();

    var selects = document.getElementsByClassName("link selectedButton");
    for (var i = 0; i < selects.length; i++) selects[i].className = "link";

    document.getElementById("buttonPage" + targetPage.toString()).className =
      "link selectedButton";

    update_button_onSubmit();
    SetFormValues(jobsArray[targetPage - 1].formValues);
    SetExclamationTexts(jobsArray[targetPage - 1].formValues);
  } else {
    console.log("nope");
  }
});

let rightNav3D = document.querySelector("#pagRight");

rightNav3D.addEventListener("click", function () {
  console.log("peeji" + selectedPage);
  let targetPage = selectedPage + 1;

  if (targetPage != latestPage + 1) {
    console.log("yupr");
    selectedPage = targetPage;
    SetDeleteJobActive();

    var selects = document.getElementsByClassName("link selectedButton");
    for (var i = 0; i < selects.length; i++) selects[i].className = "link";

    document.getElementById("buttonPage" + targetPage.toString()).className =
      "link selectedButton";

    update_button_onSubmit();
    SetFormValues(jobsArray[targetPage - 1].formValues);
    SetExclamationTexts(jobsArray[targetPage - 1].formValues);
  } else {
    console.log("noper");
  }
});
