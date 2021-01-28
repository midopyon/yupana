let jobsArray_L = [];

const TESTSOURCEVALUE_L = {
  material_laser: "Acrylic",
  location_laser: "region",
  distance_laser: 345.5,
  where_laser: "International",
  shipment_laser: "By sea",
  country_laser: "Armenia",
  machine_laser: "Epilog",
  thick_laser: 5,
  areaType_laser: "LengthWidth",
  width_laser: 1.2,
  length_laser: 0.45,
  wasteFieldTypeLaser: "Input",
  wasteInput_laser: 0.3,
  time_laser: 3,
  iteration_laser: 1,
  eol_laser: "landfill",
};

function Form_Values_L(
  material_laser,
  location_laser,
  where_laser,
  distance_laser,
  shipment_laser,
  country_laser,
  state_laser,
  machine_laser,
  thick_laser,
  areaType_laser,
  width_laser,
  length_laser,
  area_laser,
  wasteFieldTypeLaser,
  wasteInput_laser,
  wasteSlider_laser,
  time_laser,
  iteration_laser,
  eol_laser,
  isRecycled_laser
) {
  this.material_laser = material_laser;
  this.location_laser = location_laser;
  this.where_laser = where_laser;
  this.distance_laser = distance_laser;
  this.shipment_laser = shipment_laser;
  this.country_laser = country_laser;
  this.state_laser = state_laser;
  this.machine_laser = machine_laser;
  this.areaType_laser = areaType_laser;
  this.thick_laser = thick_laser;
  this.width_laser = width_laser;
  this.length_laser = length_laser;
  this.area_laser = area_laser;
  this.wasteFieldTypeLaser = wasteFieldTypeLaser;
  this.wasteInput_laser = wasteInput_laser;
  this.wasteSlider_laser = wasteSlider_laser;
  this.time_laser = time_laser;
  this.iteration_laser = iteration_laser;
  this.eol_laser = eol_laser;
  this.isRecycled_laser = isRecycled_laser;
}

function Object_laser(formValues, resultsEnergy, resultsCo2) {
  this.formValues = formValues;
  this.resultsEnergy = resultsEnergy;
  this.resultsCo2 = resultsCo2;
}

//HELPER DEBUG
document.getElementById("btn_helper_l").addEventListener("click", function () {
  SetFormValuesLaser(TESTSOURCEVALUE_L);
});

// Add an event listener
document.addEventListener("changePageLaser", function (e) {
  //If already saved, show values of selected page and change text

  if (jobsArray_L[selectedPage_l - 1] !== undefined) {
    //Set Delete Job enabled
    SetDeleteJobActiveLaser();

    update_button_onSubmit_Laser();
    SetFormValuesLaser(jobsArray_L[selectedPage_l - 1].formValues);
    SetExclamationTextsLaser(jobsArray_L[selectedPage_l - 1].formValues);
  } else {
    //Set delete Job disabled
    SetDeleteJobInactiveLaser();

    update_button_onNewJob_Laser();
    document.querySelectorAll(".exclamationLaser").forEach((item, i) => {
      item.classList.add("invisible");
    });
  }

  //Else, do nothing (accessing a job thats just being created)
});

document.addEventListener("changePageFromTableLaser", function (e) {
  //Set Delete Job enabled
  SetDeleteJobActiveLaser();

  update_button_onSubmit_Laser();
  SetFormValuesLaser(jobsArray_L[e.detail - 1].formValues);
  SetExclamationTextsLaser(jobsArray_L[e.detail - 1].formValues);
});

document.addEventListener(
  "selectionChangedCo2Laser",
  WaitForDataAndShowGraphCo2Laser
);

document.addEventListener(
  "selectionChangedEnergyLaser",
  WaitForDataAndShowGraphEnergyLaser
);

function WaitForDataAndShowGraphEnergyLaser() {
  let selectedJobsEnergyLaser = getAndAddUpSelectedJobsEnergyLaser();
  DrawGoogleChartsEnergyLaser(selectedJobsEnergyLaser);
}

function WaitForDataAndShowGraphCo2Laser() {
  let selectedJobsCo2Laser = getAndAddUpSelectedJobsCo2Laser();
  DrawGoogleChartsCo2Laser(selectedJobsCo2Laser);
}

function SaveFormValuesLaser() {
  //Defining Form Values Object
  var CurrentFormValuesLaser = new Form_Values_L();

  //Saving Material and Recycled Boolean
  var mat = document.getElementById("material_lasercut").value;

  mat = mat.split("_");
  if (mat.length == 2) {
    CurrentFormValuesLaser.isRecycled_laser = true;
  } else {
    CurrentFormValuesLaser.isRecycled_laser = false;
  }

  CurrentFormValuesLaser.material_laser = mat[0];

  //Saving location type
  var location_radios = document.getElementsByName("location_laser");
  for (i = 0; i < location_radios.length; i++) {
    if (location_radios[i].checked) {
      CurrentFormValuesLaser.location_laser = location_radios[i].value;
      break;
    }
  }

  //Saving Location or Distance, depending on location type
  if (CurrentFormValuesLaser.location_laser == "region") {
    let e = document.getElementById("where_lasercut");
    CurrentFormValuesLaser.where_laser = e.options[e.selectedIndex].value;
  } else {
    CurrentFormValuesLaser.distance_laser = parseFloat(
      document.getElementById("_laser_distance_input").value
    );
  }

  //Saving Shipment method
  let e = document.getElementById("shipment_lasercut");
  CurrentFormValuesLaser.shipment_laser = e.options[e.selectedIndex].value;

  //Saving Country
  CurrentFormValuesLaser.country_laser = document.getElementById(
    "country_laser"
  ).value;

  //If USA, Saving State
  if (CurrentFormValuesLaser.country_laser == "United States") {
    CurrentFormValuesLaser.state_laser = document.getElementById(
      "state_laser"
    ).value;
  }

  //Saving Machine
  let mac = document.getElementById("machine_lasercut");
  CurrentFormValuesLaser.machine_laser = mac.options[mac.selectedIndex].value;

  //Saving Thiccness
  CurrentFormValuesLaser.thick_laser = parseFloat(
    document.getElementById("mat_thickness_input_lasercut").value
  );

  //Saving Area Input mode and values
  if (document.querySelector("input[value=area]").checked) {
    CurrentFormValuesLaser.areaType_laser = "Area";
    CurrentFormValuesLaser.area_laser = parseFloat(
      document.getElementById("area_input_lasercut").value
    );
  } else {
    CurrentFormValuesLaser.areaType_laser = "LengthWidth";
    CurrentFormValuesLaser.width_laser = parseFloat(
      document.getElementById("width_input_lasercut").value
    );
    CurrentFormValuesLaser.length_laser = parseFloat(
      document.getElementById("length_input_lasercut").value
    );
  }

  //Saving Waste Input mode and values

  if (document.querySelector("input[value=waste_percent]").checked) {
    CurrentFormValuesLaser.wasteFieldTypeLaser = "Slider";
    CurrentFormValuesLaser.wasteSlider_laser = parseFloat(
      document.getElementById("waste_laser").value
    );
  } else {
    CurrentFormValuesLaser.wasteFieldTypeLaser = "Input";
    CurrentFormValuesLaser.wasteInput_laser = parseFloat(
      document.getElementById("waste_laser_area").value
    );
  }

  //Saving Time
  CurrentFormValuesLaser.time_laser = parseFloat(
    document.getElementById("time").value
  );

  //Saving Iteration
  CurrentFormValuesLaser.iteration_laser = parseFloat(
    document.getElementById("laser_iteration").value
  );

  //Saving End of Life method
  var end_of_life_radios_nodes = document.getElementsByName(
    "end_life_lasercut"
  );

  for (i = 0; i < end_of_life_radios_nodes.length; i++) {
    if (end_of_life_radios_nodes[i].checked) {
      CurrentFormValuesLaser.eol_laser = end_of_life_radios_nodes[i].value;
      break;
    }
  }

  return CurrentFormValuesLaser;
}

function SetFormValuesLaser(sourceValues) {
  console.log("setting sourcevalues:" + JSON.stringify(sourceValues));
  //Set Value for Material

  if (sourceValues.isRecycled_laser) {
    document.getElementById("material_lasercut").value =
      sourceValues.material_laser + "_recycled";
  } else {
    document.getElementById("material_lasercut").value =
      sourceValues.material_laser;
  }

  //Set Value for location type
  if (sourceValues.location_laser === "region") {
    document.getElementById("distance_radio_laser_checkbox").checked = false;
    document.getElementById("region_radio_laser_checkbox").checked = true;

    region_laser.classList.remove("invisible");
    distance_laser.classList.add("invisible");

    //Set selected location
    document.getElementById("where_lasercut").value = sourceValues.where_laser;

    //Clear other option
    document.getElementById("_laser_distance_input").value = null;
  } else {
    document.getElementById("region_radio_laser").checked = false;
    document.getElementById("distance_radio_laser").checked = true;

    distance_laser.classList.remove("invisible");
    region_laser.classList.add("invisible");

    //Set selected Distance
    document.getElementById("_laser_distance_input").value =
      sourceValues.distance_laser;

    //Clear other option
    document.getElementById("where_lasercut").value = "choose";
  }

  //Set shipment method
  document.getElementById("shipment_lasercut").value =
    sourceValues.shipment_laser;

  //Set Country
  document.getElementById("country_laser").value = sourceValues.country_laser;

  //Set country. If USA, also show and set state
  if (sourceValues.country_laser === "United States") {
    document.getElementById("country_laser").value = sourceValues.country_laser;

    laser_state_select.classList.remove("invisible");

    document.getElementById("state_laser").value = sourceValues.state_laser;
  } else {
    document.getElementById("country_laser").value = sourceValues.country_laser;
    document.getElementById("state_laser").value = null;
    laser_state_select.classList.add("invisible");
  }

  //Set Machine
  document.getElementById("machine_lasercut").value =
    sourceValues.machine_laser;

  //Set thiccness
  document.getElementById("mat_thickness_input_lasercut").value =
    sourceValues.thick_laser;

  //Set area type and area
  if (sourceValues.areaType_laser === "Area") {
    document.querySelector("input[value=area]").checked = true;
    document.querySelector("input[value=length]").checked = false;

    area_area.classList.remove("invisible");
    area_length.classList.add("invisible");

    document.getElementById("area_input_lasercut").value =
      sourceValues.area_laser;

    document.getElementById("length_input_lasercut").value = null;
    document.getElementById("width_input_lasercut").value = null;
  } else {
    document.querySelector("input[value=area]").checked = false;
    document.querySelector("input[value=length]").checked = true;

    area_area.classList.add("invisible");
    area_length.classList.remove("invisible");

    document.getElementById("length_input_lasercut").value =
      sourceValues.length_laser;
    document.getElementById("width_input_lasercut").value =
      sourceValues.width_laser;

    document.getElementById("area_input_lasercut").value = null;
  }

  //Set Waste type and values
  if (sourceValues.wasteFieldTypeLaser === "Slider") {
    document.querySelector("input[value=waste_area]").checked = false;
    document.querySelector("input[value=waste_percent]").checked = true;

    waste_slider.classList.remove("invisible");
    waste_field.classList.add("invisible");

    //--Set value into slider
    document.getElementById("waste_laser").value =
      sourceValues.wasteSlider_laser;

    //--Clear other option
    document.getElementById("waste_laser_area").value = null;
  } else {
    document.querySelector("input[value=waste_area]").checked = true;
    document.querySelector("input[value=waste_percent]").checked = false;

    waste_slider.classList.add("invisible");
    waste_field.classList.remove("invisible");

    //--Set waste area in field
    document.getElementById("waste_laser_area").value =
      sourceValues.wasteInput_laser;

    //--Clear other option
    document.getElementById("waste_laser").value = 50;
  }

  //Set Time
  document.getElementById("time").value = sourceValues.time_laser;

  //Set Iteration
  document.getElementById("laser_iteration").value =
    sourceValues.iteration_laser;

  //Set End Of Life
  switch (sourceValues.eol_laser) {
    case "recycling":
      document
        .getElementById("RecycledHiddenLabel")
        .classList.remove("invisible");
      document.getElementById("recycling_checkbox_laser").checked = true;
      break;

    case "landfill":
      console.log("enter");
      document.getElementById("landfill_checkbox_laser").checked = true;
      break;

    case "incineration":
      document.getElementById("incineration_checkbox_laser").checked = true;
      break;

    case "idk":
      document.getElementById("idk_checkbox_laser").checked = true;
      break;
  }
}

function CalculateLifecycleImpactLaser(sourceValues) {
  // Defining temporal values for operation
  var tempIteration = sourceValues.iteration_laser;
  var tempTime = sourceValues.time_laser * tempIteration * 60;
  var tempThickness = sourceValues.thick_laser / 1000;
  var tempArea = 0;
  var tempWeight = 0;
  var tempMaterial = sourceValues.material_laser;
  var tempShipment = sourceValues.shipment_laser;
  var tempIsRecycled = sourceValues.isRecycled_laser;
  var tempMachine = sourceValues.machine_laser;
  var tempEOL = sourceValues.eol_laser;

  // Calculating area according to type of input
  if (sourceValues.areaType_laser === "Area") {
    tempArea = sourceValues.area_laser;
  } else {
    tempArea = sourceValues.width_laser * sourceValues.length_laser;
  }

  //Defining Weight
  tempWeight =
    tempArea *
    tempThickness *
    MATERIAL_LASER[tempMaterial].density *
    tempIteration;

  // Defining Waste according to type of value

  if (sourceValues.wasteFieldTypeLaser === "Slider") {
    var tempWasteWeight = (sourceValues.wasteSlider_laser / 100) * tempWeight;
  } else {
    var tempWasteWeight =
      sourceValues.wasteInput_laser *
      MATERIAL_LASER[tempMaterial].density *
      tempThickness *
      tempIteration;
  }

  //Defining Location and Distance

  var tempLocationType = sourceValues.location_laser;

  if (tempLocationType === "region") {
    var tempLocation = sourceValues.where_laser;
  } else {
    var tempDistance = sourceValues.distance_laser;
  }

  //Defining country and electric Coefficient

  var tempCountry = sourceValues.country_laser;

  if (tempCountry === "United States") {
    var tempState = sourceValues.state_laser;
    var tempElectricCoef = electricity_state_coeff[tempState];
  } else {
    var tempElectricCoef = electricity_coeff[tempCountry];
  }

  // Calculate Manufacturing results

  var results_mat_manufacturing;

  results_mat_manufacturing = {
    energy: tempWeight * MATERIAL_LASER[tempMaterial].emb_energy_avg,
    co2: tempWeight * MATERIAL_LASER[tempMaterial].co2_avg,
  };

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
    (tempTime * 0.85 * MACHINE_ENERGY_LASER[tempMachine].cutting +
      tempTime * 0.15 * MACHINE_ENERGY_LASER[tempMachine].stand_by +
      tempTime * 0.2 * MACHINE_ENERGY_LASER[tempMachine].idle) /
    1000000;

  results_fabrication.co2 =
    (results_fabrication.energy * tempElectricCoef) / 3.6;

  // Calculate End Life results

  var results_end_life = end_life_calculation(tempWasteWeight, tempEOL, {
    energy: MATERIAL_LASER[tempMaterial].energy_incineration,
    co2: MATERIAL_LASER[tempMaterial].co2_combustion,
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

function SetExclamationTextsLaser(formValues) {
  set_manu_laser(formValues);
  set_transport_laser(formValues);
  set_fabrication_laser(formValues);
  set_end_life_laser(formValues);
}

document
  .getElementById("btn_calculate_l")
  .addEventListener("click", start_the_magic_laser);

function start_the_magic_laser() {
  //define object
  var ObjectLaser = new Object_laser();

  //save the contents
  ObjectLaser.formValues = SaveFormValuesLaser();

  // calculate values
  var ResultsAux = CalculateLifecycleImpactLaser(ObjectLaser.formValues);
  ObjectLaser.resultsEnergy = ResultsAux.resultsEnergy;
  ObjectLaser.resultsCo2 = ResultsAux.resultsCo2;

  SetExclamationTextsLaser(ObjectLaser.formValues);

  //Save onto array
  if (hasJobStackEmpty_l) {
    var gridDivEnergyLaser = document.querySelector("#myGridEnergy_L");
    var gridDivCo2Laser = document.querySelector("#myGridCo2_L");

    new agGrid.Grid(gridDivEnergyLaser, gridOptionsEnergy_l);
    new agGrid.Grid(gridDivCo2Laser, gridOptionsCo2_l);

    ShowAddJobButtonLaser();
    ShowTableTitlesLaser();

    jobsArray_L.push(ObjectLaser);

    //Add to table
    addRowEnergyLaser(selectedPage_l, ObjectLaser.resultsEnergy);
    addRowCo2Laser(selectedPage_l, ObjectLaser.resultsCo2);
  } else {
    if (isDeleteJobHidden_l && selectedPage_l != 1) {
      ShowDeleteJobButtonLaser();
    } else {
      SetDeleteJobActiveLaser();
    }

    jobsArray_L[selectedPage_l - 1] = ObjectLaser;

    if (isUpdating_l) {
      updateRowEnergyLaser(selectedPage_l, ObjectLaser.resultsEnergy);
      updateRowCo2Laser(selectedPage_l, ObjectLaser.resultsCo2);
    } else {
      update_button_onSubmit_Laser();
      addRowEnergyLaser(selectedPage_l, ObjectLaser.resultsEnergy);
      addRowCo2Laser(selectedPage_l, ObjectLaser.resultsCo2);
    }
    //if it already exists, update
  }
  // Print and draw
}

function getAndAddUpSelectedJobsEnergyLaser() {
  let selectedJobsSum = {
    name: "",
    mat_manufacturing: 0,
    transportation: 0,
    fabrication: 0,
    end_life: 0,
  };

  CurrentlySelectedJobsTitleEnergy_l = "";

  jobsArray_L.forEach(function (job, index) {
    if (selectedJobsEnergy_l.includes(index + 1)) {
      if (selectedJobsSum.name == "") {
        selectedJobsSum.name += "Job " + (index + 1);
        CurrentlySelectedJobsTitleEnergy_l += "J" + (index + 1);
      } else {
        selectedJobsSum.name += ", Job " + (index + 1);
        CurrentlySelectedJobsTitleEnergy_l += ", J" + (index + 1);
      }

      selectedJobsSum.mat_manufacturing += job.resultsEnergy.mat_manufacturing;
      selectedJobsSum.transportation += job.resultsEnergy.transportation;
      selectedJobsSum.fabrication += job.resultsEnergy.fabrication;
      selectedJobsSum.end_life += job.resultsEnergy.end_life;
    }
  });

  return selectedJobsSum;
}

function getAndAddUpSelectedJobsCo2Laser() {
  let selectedJobsSum = {
    name: "",
    mat_manufacturing: 0,
    transportation: 0,
    fabrication: 0,
    end_life: 0,
  };

  CurrentlySelectedJobsTitleCO2_l = "";

  jobsArray_L.forEach(function (job, index) {
    if (selectedJobsCo2_l.includes(index + 1)) {
      if (selectedJobsSum.name == "") {
        selectedJobsSum.name += "Job " + (index + 1);
        CurrentlySelectedJobsTitleCO2_l += "J" + (index + 1);
      } else {
        selectedJobsSum.name += ", Job " + (index + 1);
        CurrentlySelectedJobsTitleCO2_l += ", J" + (index + 1);
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
function set_manu_laser(sourceValues) {
  let textbox = document.querySelector("#manufacturing_textbox_laser");

  var tempMaterial = sourceValues.material_laser;
  var tempIsRecycled = sourceValues.isRecycled_laser;

  laser_manu_exclamation.classList.remove("invisible");

  laser_manu_exclamation.classList.remove("good");

  textDiv = document.createElement("div");
  textDiv.style.cssText = "display: inline-block;";

  if (tempMaterial == "PLA" && tempIsRecycled) {
    laser_manu_exclamation.classList.add("good");
    textDiv.innerHTML =
      "Pros:\r\n- Lower environmental impact compared to ABS and Nylon.\r\n- It uses 46% less energy than Standard (virgin) PLA when manufactured .\r\n- It emits 54% less CO<sub>2</sub> than Standard (virgin) PLA when manufactured.";
  } else if (tempMaterial == "PLA") {
    textDiv.innerHTML =
      "Pros:\r\n- Lower environmental impact compared to ABS and Nylon.\r\n<span class='innerRedText'>Cons:\r\n-  It uses <span class='innerBoldText'>46% more energy</span> than Recycled PLA when manufactured.\r\n-  It emits <span class='innerBoldText'>54% more CO<sub>2</sub></span> than Recycled PLA when manufactured.\r\nSuggestion:\r\n- Switch to Recycled PLA filament.</span>";
  } else if (tempMaterial == "ABS" && tempIsRecycled) {
    textDiv.innerHTML =
      "Pros:\r\n- Lower environmental impact compared to Standard (virgin) ABS and Nylon.\r\n- It uses <span class='innerBoldText'>60% less energy</span> than Standard (virgin) ABS when manufactured.\r\n- It emits <span class='innerBoldText'>41% less CO<sub>2</sub></span> than Standard (virgin) ABS when manufactured.\r\n<span class='innerRedText'>Cons:\r\n-  It uses <span class='innerBoldText'>27% more energy</span>  than Recycled PLA when manufactured.\r\n-  It emits <span class='innerBoldText'>27% more CO<sub>2</sub></span>  than Recycled PLA when manufactured.\r\nSuggestion:\r\n- Switch to Recycled PLA filament.</span>";
  } else if (tempMaterial == "ABS") {
    textDiv.innerHTML =
      "Pros:\r\n- Lower environmental impact compared to Nylon.\r\n<span class='innerRedText'>Cons:\r\n-  It uses <span class='innerBoldText'>60% more energy</span>  than Recycled ABS when manufactured.\r\n-  It emits <span class='innerBoldText'>41% more CO<sub>2</sub></span>  than Recycled ABS when manufactured.\r\nSuggestion:\r\n- Switch to Recycled ABS or Recycled PLA filament.</span> ";
  } else if (tempMaterial == "Nylon" && tempIsRecycled) {
    textDiv.innerHTML =
      "Pros:\r\n- Lower environmental impact compared to recycled ABS.\r\n- It uses <span class='innerBoldText'>69% less energy</span>  than Standard (virgin) Nylon when manufactured.\r\n- It emits <span class='innerBoldText'>75% less CO<sub>2</sub></span>  than Standard (virgin) Nylon when manufactured.";
  } else {
    //reg nylon
    textDiv.innerHTML =
      "<span class='innerRedText'>Cons:\r\n- Higher environmental impact compared to Standard (virgin) ABS and PLA.\r\n-  It uses <span class='innerBoldText'>31% more energy</span>  than Recycled Nylon when manufactured.\r\n-  It emits <span class='innerBoldText'>17% more CO<sub>2</sub></span>  than Recycled Nylon when manufactured.\r\nSuggestion:\r\n- Switch to Recycled Nylon, ABS, or PLA filaments.</span>";
  }
  textbox.innerHTML = "";
  textbox.appendChild(textDiv);
}

// Defining Functionalities of Exclamation, text box and close button

let laser_manu_exclamation = document.querySelector(
  "#manufacturing_exclamation_laser"
);

laser_manu_exclamation.addEventListener("click", function () {
  document
    .querySelector("#manufacturing_textbox_laser")
    .parentElement.classList.remove("invisible");
});

document
  .querySelector("#x_manufacturing_laser")
  .addEventListener("click", function () {
    document
      .querySelector("#manufacturing_textbox_laser")
      .parentElement.classList.add("invisible");
  });

// Setting transportation text

function set_transport_laser(sourceValues) {
  var tempLocationType = sourceValues.location_laser;
  var tempShipment = sourceValues.shipment_laser;
  var tempLocation = null;
  var tempDistance = null;

  if (tempLocationType === "region") {
    tempLocation = sourceValues.where_laser;
  } else {
    tempDistance = sourceValues.distance_laser;
  }

  let textbox = document.querySelector("#transport_textbox_laser");
  laser_transport_exclamation.classList.remove("invisible");
  laser_transport_exclamation.classList.remove("good");

  // Set Location Type text

  if (tempLocationType != "region") {
    tempLocation = get_transport_location(tempDistance);
  }

  textDivPros = document.createElement("div");
  textDivPros.innerHTML = "";
  textDivPros.style.cssText = "display: inline-block;";

  textDivCons = document.createElement("div");
  textDivCons.innerHTML = "";
  textDivCons.style.cssText = "display: inline-block;";

  textDivSug = document.createElement("div");
  textDivSug.innerHTML = "";
  textDivSug.style.cssText = "display: inline-block;";

  textbox.innerHTML = "";

  switch (tempLocation) {
    case "International":
      textDivCons.innerHTML +=
        "- International: <span class='innerBoldText'>95% higher</span>  environmental impact than national and local distances. Therefore, more fuel consumption and CO<sub>2</sub> emissions.\r\n";
      textDivSug.innerHTML += "- Use locally manufactured material.\r\n";
      break;

    case "National":
      textDivCons.innerHTML +=
        "- National: <span class='innerBoldText'>30% higher</span>  environmental impact than local distances. Therefore, more fuel consumption and CO<sub>2</sub> emissions.\r\n";
      textDivSug.innerHTML += "- Use locally manufactured material.\r\n";
      break;

    case "Local":
      textDivPros.innerHTML +=
        "- Local distances have <span class='innerBoldText'>95% and 30% lower</span>  environmental impact than international and national distances respectively.\r\n- Shorter distances require less fuel and therefore generate less CO<sub>2</sub> emissions.\r\n";

      break;
    case "IDK":
      textDivCons.innerHTML +=
        "- We assumed your material traveled from China. Therefore, more fuel consumption and CO<sub>2</sub> emissions.\r\n";
      textDivSug.innerHTML +=
        "- Find out where your materials are coming from.\r\n- Use locally manufactured material.\r\n";

      break;
  }

  // Set Shipping Text

  switch (tempShipment) {
    case "By air":
      textDivCons.innerHTML +=
        "- Airplanes consume <span class='innerBoldText'>1000% more energy</span> and emit <span class='innerBoldText'>700% more CO<sub>2</sub></span> than road transportation.\r\n";
      textDivSug.innerHTML += "- Switch to ocean or road shipping.\r\n";

      break;
    case "By sea":
      textDivPros.innerHTML +=
        "- Ocean shipping has a lower environmental impact compared to air and road shipping.\r\n- It uses <span class='innerBoldText'>700% less energy</span> and emits <span class='innerBoldText'>730% less CO<sub>2</sub></span> than road shipping for national distances.";

      break;
    case "By road":
      textDivSug.innerHTML +=
        "- Avoid express delivery.\r\n- Light goods vehicles use <span class='innerBoldText'>115% more energy</span> and emit <span class='innerBoldText'>63% more CO<sub>2</sub></span> than trucks.\r\n- A small truck uses <span class='innerBoldText'>30% more energy</span> and emits <span class='innerBoldText'>50% more CO<sub>2</sub></span> than a big truck.";

      break;
    case "I don't know":
      if (tempLocation == "IDK") {
        textDivCons.innerHTML =
          "- We assumed your material traveled from China, by airplane. Therefore, more fuel consumption and CO<sub>2</sub> emissions.\r\n";
        textDivSug.innerHTML =
          "- Find out where your materials are coming from.\r\n- Use locally manufactured material.\r\n";
      } else if (tempLocation == "International") {
        textDivCons.innerHTML +=
          "- We assumed your material traveled from China, by airplane. Therefore, more fuel consumption and CO<sub>2</sub> emissions.\r\n";
      } else if (tempLocation == "National") {
        textDivCons.innerHTML +=
          "- We assumed your material was transported from 300km away by road.\r\n";
      } else {
        textDivCons.innerHTML +=
          "- We assumed your material was transported from 100km away by road.\r\n";
      }

      break;
  }

  if (textDivPros.innerHTML != "") {
    laser_transport_exclamation.classList.add("good");
    textDivPros.innerHTML = "Pros:\r\n" + textDivPros.innerHTML + "<br/>";
    textbox.appendChild(textDivPros);
  }

  if (textDivCons.innerHTML != "") {
    laser_transport_exclamation.classList.remove("good");

    if (textDivPros.innerHTML != "") {
      textDivCons.innerHTML =
        "<br/><span class='innerRedText'>Cons:\r\n" +
        textDivCons.innerHTML +
        "</span>";
    } else {
      textDivCons.innerHTML =
        "<span class='innerRedText'>Cons:\r\n" +
        textDivCons.innerHTML +
        "</span>";
    }

    textbox.appendChild(textDivCons);
  }

  if (textDivSug.innerHTML != "") {
    textDivSug.innerHTML =
      "<br/><span class='innerRedText'>Suggestion:\r\n" +
      textDivSug.innerHTML +
      "</span>";
    textbox.appendChild(textDivSug);
  }
}

// Defining Functionalities of Exclamation, text box and close button

let laser_transport_exclamation = document.querySelector(
  "#transport_exclamation_laser"
);
laser_transport_exclamation.addEventListener("click", function () {
  document
    .querySelector("#transport_textbox_laser")
    .parentElement.classList.remove("invisible");
});

document
  .querySelector("#x_transport_laser")
  .addEventListener("click", function () {
    document
      .querySelector("#transport_textbox_laser")
      .parentElement.classList.add("invisible");
  });

// Setting fabrication text

function set_fabrication_laser(sourceValues) {
  var tempMachine = sourceValues.machine_laser;
  var tempCountry = sourceValues.country_laser;
  let textbox = document.querySelector("#fabrication_textbox_laser");
  laser_fabrication_exclamation.classList.remove("invisible");

  textbox.innerHTML = "";

  textDivCountry = document.createElement("div");
  textDivCountry.innerHTML = "";
  textDivCountry.style.cssText = "display: inline-block;";

  textDivMachine = document.createElement("div");
  textDivMachine.innerHTML = "";
  textDivMachine.style.cssText = "display: inline-block;";

  let textCountry = get_electric_text_laser(tempCountry);
  textDivCountry.innerHTML = textCountry;

  var tempMachine = sourceValues.machine_laser;

  if (tempMachine == "makerbot") {
    laser_fabrication_exclamation.classList.add("good");
    textDivMachine.innerHTML =
      "Pros:\r\n- Makerbot Replicator+ uses half as much power as Ultimaker 2 Extended in the molding process.\r\n\r\n<span class='innerRedText'>Suggestions:\r\n- Reduce printing time by adjusting printing speed to 50 mm/s average.\r\n- Change infill density to 10-15%.\r\n- Turn off the machine when not in use.\r\n- 3D print in series.\r\n- Edit the firmware to turn off the motors during stand-by time.</span>";
  } else {
    //ultimaker
    laser_fabrication_exclamation.classList.remove("good");
    textDivMachine.innerHTML =
      "<span class='innerRedText'>Cons:\r\n- Ultimaker 2 Extended uses twice as much power as Makerbot Replicator+ in the molding process.\r\n\r\nSuggestions:\r\n- Reduce printing time by adjusting printing speed to 50 mm/s average.\r\n- Change infill density to 10-15%.\r\n- Turn off the machine when not in use.\r\n- 3D print in series.\r\n- Edit the firmware to turn off the motors during stand-by time.</span>";
  }

  textDivCountry.innerHTML =
    "Electricity Mix:\r\n- The lab location determines the source of the electricity used to run the machines.\r\n- The CO<sub>2</sub> emissions depend on the blends of electricity sources.\r\n- From worst to best sources: coal, nuclear power, hydroelectric power, solar photovoltaics, geothermal power, and Concentrated Solar Power (CSP).\r\n<br/>" +
    textDivCountry.innerHTML +
    "<br/>";

  textbox.appendChild(textDivCountry);

  textDivMachine.innerHTML =
    "Energy efficiency:\r\n- Energy consumption of machines varies widely depending on printer type, part geometry, machine utilization rate (idle, stand by, and printing time), print set-up, and material.\r\n<br/>" +
    textDivMachine.innerHTML;

  textbox.appendChild(textDivMachine);
}

// Defining Functionalities of Exclamation, text box and close button

let laser_fabrication_exclamation = document.querySelector(
  "#fabrication_exclamation_laser"
);
laser_fabrication_exclamation.addEventListener("click", function () {
  document
    .querySelector("#fabrication_textbox_laser")
    .parentElement.classList.remove("invisible");
});

document
  .querySelector("#x_fabrication_laser")
  .addEventListener("click", function () {
    document
      .querySelector("#fabrication_textbox_laser")
      .parentElement.classList.add("invisible");
  });

// Setting EndLife text

function set_end_life_laser(sourceValues) {
  let textbox = document.querySelector("#end_life_textbox_laser");
  laser_end_life_exclamation.classList.remove("invisible");
  textbox.innerHTML = "";

  var tempEOL = sourceValues.eol_laser;
  var tempMaterial = sourceValues.material_laser;

  textDivRecycle = document.createElement("div");
  textDivRecycle.innerHTML = "";
  textDivRecycle.style.cssText = "display: inline-block;";

  if (tempEOL == "recycle_bin") {
    textDivRecycle.innerHTML =
      "Pros:\r\n- Recycling reduces the need for extracting, refining and processing raw materials all of which create substantial air and water pollution.\r\n- It allows the waste to become the raw material for a new material with lower embodied energy than a virgin one.\r\n<br/><span class='innerRedText'>Cons:\r\n- The recycling process in an industrial facility generates CO<sub>2</sub> emissions.\r\n<br/>Suggestion:\r\n- Look for alternative materials that are either compostable or biodegradable in natural conditions.\r\n<br/></span><span class='innerSmallerText'>*We only analyzed the cost of transporting the waste to a recycling facility.\r\n</span>";
  }
  if (tempEOL == "landfill" || tempEOL == "idk") {
    var tempText;

    if (tempMaterial == "PLA") {
      tempText =
        "- PLA that ends up in the landfill breaks down anaerobically to release methane, a greenhouse gas that is about 30 times more potent than carbon dioxide and contributes to climate change.\r\n- 20% of total US. methane emissions come from landfills.<br/>\r\nSuggestion:\r\n- Send your waste to a recycling facility to reduce the need for extracting, refining and processing raw materials all of which create substantial air and water pollution.\r\n- Recycling allows the waste to become the raw material for a new material with lower embodied energy than virgin material.\r\n";
    } else if (tempMaterial == "ABS") {
      tempText =
        "- ABS that ends up in the landfill becomes a potential source of microplastics.\r\n- Landfills impact the air, water, and land quality.\r\n<br/>Suggestion:\r\n- Send your waste to a recycling facility to reduce the need for extracting, refining and processing raw materials all of which create substantial air and water pollution.\r\n - Recycling allows the waste to become the raw material for a new material with lower embodied energy than virgin material.\r\n";
    } else if (tempMaterial == "Nylon") {
      tempText =
        "- Nylon that ends up in the landfill becomes a potential source of microplastics.\r\n- Landfills impact the air, water, and land quality.\r\n<br/>Suggestion:\r\n- Send your waste to a recycling facility to reduce the need for extracting, refining and processing raw materials all of which create substantial air and water pollution.\r\n - Recycling allows the waste to become the raw material for a new material with lower embodied energy than virgin material.\r\n";
    }

    if (tempEOL == "idk") {
      textDivRecycle.innerHTML =
        "We analyzed the cost of transporting the waste to a landfill area.\r\n<br/><span class='innerRedText'>Cons:\r\n- We assumed your material ended up in the landfill.\r\n" +
        tempText +
        "</span>";
    } else {
      textDivRecycle.innerHTML =
        "We analyzed the cost of transporting the waste to a landfill area.\r\n<br/><span class='innerRedText'>Cons:\r\n" +
        tempText +
        "</span>";
    }
  } else if (tempEOL == "incineration") {
    textDivRecycle.innerHTML =
      "We analyzed the cost of transporting the waste to a garbage facility and the energy and CO<sub>2</sub> emissions generated from burning the waste.\r\n<br/>Pros:\r\n- The incineration process generates an energy bonus because of the burning process.\r\n<br/><span class='innerRedText'>Cons:\r\n- It creates about 8000% more CO<sub>2</sub> emissions than recycling. </span>";
  }

  textbox.appendChild(textDivRecycle);
}

let laser_end_life_exclamation = document.querySelector(
  "#end_life_exclamation_laser"
);
laser_end_life_exclamation.addEventListener("click", function () {
  document
    .querySelector("#end_life_textbox_laser")
    .parentElement.classList.remove("invisible");
});

document
  .querySelector("#x_end_life_laser")
  .addEventListener("click", function () {
    document
      .querySelector("#end_life_textbox_laser")
      .parentElement.classList.add("invisible");
  });
