let _laser_material, _laser_thickness, _laser_location_type, _laser_location, _laser_distance, _laser_shipment, _laser_machine, _laser_cut_time, _laser_sheet_area, _laser_proto_area, _laser_weight, _laser_end_life, _laser_waste, _laser_electric, _laser_country;

//emb_energy_avg: emb eng primary + processing
//co2_avg: co2 Emissions + processing
const material_laser = {
  Acrylic: { //missing data
    emb_energy_avg: (90 + 131.5) / 2,
    co2_avg: (2.8 + 3.2) / 2,
    co2_combustion: (1.96 + 2.05) / 2,
    energy_incineration: (-25.1 + -25.6) / 2,
    density: 1180
  },
  MDF: {
    emb_energy_avg: (11.3 + 11.9) / 2, //missing processing
    co2_avg: (0.6 + 0.78) / 2 + (3.67 + 3.68) / 2,
    co2_combustion: (1.509 + 3.247) / 2,
    energy_incineration: (-12.4 + -16.7) / 2,
    density: (680 + 830) / 2
  },
  Cardboard: {
    emb_energy_avg: (49 + 54) / 2 + (0.475 + 0.525) / 2,
    co2_avg: (1.1 + 1.2) / 2 + (0.023 + 0.026) / 2,
    co2_combustion: (1.8 + 1.9) / 2,
    energy_incineration: (-19 + -20) / 2,
    density: (480 + 860) / 2 //kg/m3
  },
  Cardboard_recycled: {
    emb_energy_avg: (18 + 21) / 2,
    co2_avg: (0.72 + 0.8) / 2,
    co2_combustion: (1.8 + 1.9) / 2,
    energy_incineration: (-19 + -20) / 2,
    density: (480 + 860) / 2 //kg/m3
  },
  Mycelium: { //missing vals
    emb_energy_avg: 1.227,
    co2_avg: 0.039,
    co2_combustion: null,
    energy_incineration: null,
    density: 390
  }
};

const machine_energy = {
  Trotec: {
    cutting: (64 + 85) / 2,
    stand_by: (7.48 + 21.25) / 2,
    idle: (3.4 + 7.65) / 2
  },
  Epilog: {
    cutting: (48 + 60) / 2,
    stand_by: (5.28 + 15) / 2,
    idle: (2.40 + 5.40) / 2
  },
  Universal: {
    cutting: (60 + 75) / 2,
    stand_by: (6.6 + 18.75) / 2,
    idle: (3 + 6.75) / 2
  }
};

function get_user_input() {
  let e = document.getElementById('material_lasercut');
  _laser_material = e.options[e.selectedIndex].value;

  var location_radios = document.getElementsByName('location_laser');
  l = location_radios.length
  for (i = 0; i < l; i++) {
    checked = location_radios[i].checked
    if (checked === true) {
      _laser_location_type = location_radios[i].value;
      break;
    }
  }

  if (_laser_location_type == 'region') {
    let e = document.getElementById("where_lasercut");
    _laser_location = e.options[e.selectedIndex].value;
  } else {
    _laser_distance = parseFloat(document.getElementById('_laser_distance_input').value); //in km
  }

  e = document.getElementById("shipment_lasercut");
  _laser_shipment = e.options[e.selectedIndex].value;

  e = document.getElementById("machine_lasercut");
  _laser_machine = e.options[e.selectedIndex].value;

  _laser_country = document.getElementById("country_laser").value;

  if (_laser_country == "United States") {
    let state = document.getElementById("state_laser").value;
    _laser_electric = electricity_state_coeff[state];
  } else {
    _laser_electric = electricity_coeff[_laser_country];
  }

  _laser_iteration = parseFloat(document.getElementById("laser_iteration").value)

  _laser_thickness = parseFloat(document.getElementById("mat_thickness_input_lasercut").value) / 1000; //convert from mm to m
  if (document.querySelector("input[value=length]").checked) {
    let width = parseFloat(document.getElementById("width_input_lasercut").value); //in m
    let length = parseFloat(document.getElementById("length_input_lasercut").value); //in m
    _laser_area = width * length;
  } else {
    _laser_area = parseFloat(document.getElementById("area_input_lasercut").value);
  }
  console.log(_laser_area);
  _laser_weight = _laser_area * _laser_thickness * material_laser[_laser_material].density * _laser_iteration; //weight (kg) = volume (m3) * density (kg/m3)
  console.log("Weight: " + _laser_weight);
  if (document.querySelector("input[value=waste_percent]").checked) {
    let percent_waste = parseFloat(document.getElementById("waste_laser").value) / 100;
    _laser_waste = _laser_weight * percent_waste;
  } else {
    console.log("calc waste area");
    let _laser_waste_area = parseFloat(document.getElementById("waste_laser_area").value); //in m2
    console.log(_laser_waste_area);
    _laser_waste = _laser_waste_area * _laser_thickness * material_laser[_laser_material].density * _laser_iteration;
  }

  console.log("Waste: " + _laser_waste);
  // e = document.getElementById("machine_lasercut");
  //  _laser_machine = e.options[e.selectedIndex].value;

  _laser_cut_time = parseFloat(document.getElementById("time").value) * 60 * _laser_iteration; //covert from min to sec

  var end_of_life_radios_nodes = document.getElementsByName('end_life_lasercut');
  l = end_of_life_radios_nodes.length

  for (i = 0; i < l; i++) {
    checked = end_of_life_radios_nodes[i].checked
    if (checked === true) {
      _laser_end_life = end_of_life_radios_nodes[i].value
      break;
    }
  }
}
document.getElementById('btn_submit_laser').addEventListener('click', start_graphing);


function lifecycle_calculation_laser() {
  let _energy = {
    name: _laser_material
  };
  let _co2 = {
    name: _laser_material
  };

  //raw materials processing
  _energy.mat_manufacturing = _laser_weight * material_laser[_laser_material]['emb_energy_avg'];
  _co2.mat_manufacturing = _laser_weight * material_laser[_laser_material]['co2_avg'];

  //transportation
  var results_transportation;
  if (_laser_location_type == 'region') {
    results_transportation = transportation_calculation(_laser_shipment, _laser_location);
  } else {
    results_transportation = user_transport_calc(_laser_shipment, _laser_distance);
  }
  _energy.transportation = _laser_weight * results_transportation.energy;
  _co2.transportation = _laser_weight * results_transportation.co2;

  //fabrication
  _energy.fabrication = (_laser_cut_time * .85 * machine_energy[_laser_machine].cutting + _laser_cut_time * .15 * machine_energy[_laser_machine].stand_by + _laser_cut_time * .2 * machine_energy[_laser_machine].idle) / 1000000;

  _co2.fabrication = _energy.fabrication / 3.6 * _laser_electric;

  //end of life
  let end_life_results = end_life_calculation(_laser_waste, _laser_end_life, {
    energy: material_laser[_laser_material].energy_incineration,
    co2: material_laser[_laser_material].co2_combustion
  });
  _energy.end_life = end_life_results.energy;
  _co2.end_life = end_life_results.co2;

  return {
    energy: _energy,
    co2: _co2
  };
}

function start_graphing() {
  get_user_input();
  let results = lifecycle_calculation_laser();
  console.log(results);
  if (results_energy_ar.length == 0) {
    original = {
      material: _laser_material,
      transport_distance: _laser_location,
      transport_shipment: _laser_shipment,
      df_electricity: _laser_electric,
      machine_model: _laser_machine,
      prototype_weight: _laser_weight * 1000 / _laser_iteration,
      prototype_waste: _laser_waste * 1000 / _laser_iteration,
      fabrication_time: _laser_cut_time / 60,
      iterations: _laser_iteration,
      disposal: _laser_end_life
    }
  }
  set_manu_laser();
  set_transport_laser();
  set_fabrication_laser();
  set_end_life_laser();
  add_ar_draw(results.energy, results.co2);
}
//manufacturing
function set_manu_laser() {
  let text;
  let textbox = document.querySelector('#manufacturing_textbox_laser');
  _laser_manu_exclamation.classList.remove('invisible');
  //remove if prev value was good
  textbox.classList.remove('good');
  _laser_manu_exclamation.classList.remove('good');

  if (_laser_material == 'Acrylic') {
    text = document.createTextNode("Acrylic has the highest environmental impact in this group of materials followed by Cardboard/Matboard first time manufactured and MDF. Acrylic is not recycled at its end of life which means it's always created from virgin raw material. It uses 89% more energy and emits 33% more CO2 than MDF. Next time, ask your provider  for alternative recycled materials to reduce your environmental impact in this phase.");
  } else if (_laser_material == 'MDF') {
    text = document.createTextNode("MDF has a lower environmental impact than Acrylic. MDF is not recycled at its end of life which means it's always created from primary production raw material. It uses 89% less energy and emits 33% less CO2 than Acrylic. Next time, ask your provider for alternative recycled materials to reduce your environmental impact in this phase.");
  } else if (_laser_material == 'Cardboard' && recycled) {
    textbox.classList.add('good');
    _laser_manu_exclamation.classList.add('good');
    text = document.createTextNode('Cardboard/Matboard recycled has a lower environmental impact than MDF and Acrylic. Cardboard/Matboard recycled uses 62% less energy and emits 33% less CO2 than Cardboard/Matboard manufactured for the first time, 82% less energy and 74% less CO2 emissions than Acrylic.');
  } else if (_laser_material == 'Cardboard') {
    text = document.createTextNode('Cardboard/Matboard has a lower environmental impact than MDF and Acrylic. However, Cardboard/Matboard recycled uses 62% less energy and emits 33% less CO2 than Cardboard/Matboard manufactured for the first time. Next time, ask your provider for Cardboard/Matboard recycled to reduce your environmental impact in this phase.');
  } else { //Mycelium
    text = document.createTextNode('');
  }
  textbox.innerHTML = "";
  textbox.appendChild(text);
}
let _laser_manu_exclamation = document.querySelector('#manufacturing_exclamation_laser');
_laser_manu_exclamation.addEventListener('click', function() {
  document.querySelector('#manufacturing_textbox_laser').parentElement.classList.remove('invisible');
});

document.querySelector('#x_manufacturing_laser').addEventListener('click', function() {
  document.querySelector('#manufacturing_textbox_laser').parentElement.classList.add('invisible');
});
//transportation
function set_transport_laser() {
  let textbox = document.querySelector('#transport_textbox_laser');
  _laser_transport_exclamation.classList.remove('invisible');

  if (_laser_location == 'Local') {
    textbox.classList.add('good');
    _laser_transport_exclamation.classList.add('good');
  } else {
    textbox.classList.remove('good');
    _laser_transport_exclamation.classList.remove('good');
  }

  let text;
  if (_laser_location_type == 'region') {
    text = get_transport_text(_laser_location, _laser_shipment);
  } else {
    text = get_transport_text(_laser_distance, _laser_shipment);
  }
  textbox.innerHTML = "";
  textbox.appendChild(text);
}

let _laser_transport_exclamation = document.querySelector('#transport_exclamation_laser');
console.log(_laser_transport_exclamation);
_laser_transport_exclamation.addEventListener('click', function() {
  document.querySelector('#transport_textbox_laser').parentElement.classList.remove('invisible');
});

document.querySelector('#x_transport_laser').addEventListener('click', function() {
  document.querySelector('#transport_textbox_laser').parentElement.classList.add('invisible');
});

//fabrication
function set_fabrication_laser() {
  let textbox = document.querySelector('#fabrication_textbox_laser');
  _laser_fabrication_exclamation.classList.remove('invisible');
  let text = get_electric_text(_laser_country);
  textbox.classList.remove('good');
  _laser_fabrication_exclamation.classList.remove('good');

  if (_laser_machine == 'Trotec') {
    text.appendChild(document.createTextNode('Trotec Speedy 400 uses 41% more power than Epilog Fusion Pro 32, and 25% more than Universal PLS6.75 in the cutting process. You can save energy by reducing laser cutting time, avoiding double cuts, optimizing the cutting area, and using the optimal cutting parameters per material. You can also save energy reducing idle time by turning off the machine when not in use, or sending jobs in series.'));
  } else if (_laser_machine == 'Epilog') {
    textbox.classList.add('good');
    _laser_fabrication_exclamation.classList.add('good');
    text.appendChild(document.createTextNode('Epilog Fusion Pro 32 uses 41% less power than Trotec Speedy 400, and 25% less power than Universal PLS6.75 in the cutting process. You can save energy by reducing laser cutting time, avoiding double cuts, optimizing the cutting area, and using the optimal cutting parameters per material. You can also save energy reducing idle time by turning off the machine when not in use, or sending jobs in series.'));
  } else { //Universal
    text.appendChild(document.createTextNode("Universal PLS6.75 uses 25% more power than Epilog Fusion Pro 32, and 12% less than Trotec Speedy 400 in the cutting process. You can save energy by reducing laser cutting time, avoiding double cuts, optimizing the cutting area, and using the optimal cutting parameters per material. You can also save energy reducing idle time by turning off the machine when not in use, or sending jobs in series."));
  }

  textbox.innerHTML = "";
  textbox.appendChild(text);
}

let _laser_fabrication_exclamation = document.querySelector('#fabrication_exclamation_laser');
_laser_fabrication_exclamation.addEventListener('click', function() {
  document.querySelector('#fabrication_textbox_laser').parentElement.classList.remove('invisible');
});

document.querySelector('#x_fabrication_laser').addEventListener('click', function() {
  document.querySelector('#fabrication_textbox_laser').parentElement.classList.add('invisible');
});

//end_life
function set_end_life_laser() {
  let textbox = document.querySelector('#end_life_textbox_laser');
  _laser_end_life_exclamation.classList.remove('invisible');
  let text = document.createDocumentFragment();
  if (_laser_end_life == 'idk') {
    text.appendChild(document.createTextNode("Since you didn't specify an end of life type, we assume your material will end up in the landfill."));
    text.appendChild(document.createElement("BR"));
    _laser_end_life = 'landfill';
  }
  if (_laser_end_life == 'recycle_bin') {
    text.appendChild(document.createTextNode('Recycling reduces the need for extracting, refining and processing raw materials all of which create substantial air and water pollution. Recycling allows the waste to become the raw material for a new material with lower embodied energy than a primary manufactured one. However, the recycling process still generates CO2 emissions which can be avoided by using compostable materials. We only analyzed the cost of transporting the waste to a recycling facility.'));
  } else if (_laser_end_life == 'incineration') {
    text.appendChild(document.createTextNode('Even though the incineration process generates energy bonus because of the burning process, it still creates about 8000% more CO2 emissions than when the waste is recycled. We analyzed the cost of transporting the waste to a garbage facility and the energy and CO2 emissions generated from burning the waste.'));
  } else if (_laser_end_life == 'landfill') {
    if (_laser_material == 'Acrylic') {
      text.appendChild(document.createTextNode('If acrylic or plexiglass ends up in the landfill, it could take up to 400 years to degrade, and it becomes a potential source of microplastics. Landfills can impact on air, water and land quality. We only analyzed the cost of transporting the waste to a landfill in this phase.'));
    } else if (_laser_material == 'MDF') {
      text.appendChild(document.createTextNode('If MDF ends up in the landfill, it could take up to 14 years to degrade. Landfills can impact on air, water and land quality. In fact, landfilling this material is the least preferable option to use to dispose of it. Sending your waste to recycling reduces the need for extracting, refining and processing raw materials all of which create substantial air and water pollution. 20 % of total US methane emissions come from landfills. We only analyzed the cost of transporting the waste to a landfill.'));
    } else if (_laser_material == 'Cardboard' || _laser_material == "Cardboard_recycled") {
      text.appendChild(document.createTextNode("If Cardboard/Matboard ends up in the landfill, it will decompose in about  2 months. Landfills can impact on air, water and land quality, and sending recyclable materials to the landfill will require extracting, refining and processing raw materials all over again to manufacture a new material, which processes create substantial air and water pollution. Make sure you're disposing your waste in the right place. We only analyzed the cost of transporting the waste to a landfill in this phase."));
    } else { //Mycelium
      text.appendChild(document.createTextNode("If Mycelium ends up in the landfill, it will decompose in about 2 months if oxygen is available. However, when compostable materials are placed in the more common anaerobic landfill and deprived of oxygen and microorganisms, their ability to decompose will be severely restricted. Landfills can impact on air, water and land quality. Make sure you're disposing your waste in the right place. We only analyzed the cost of transporting the waste to a landfill in this phase."));
    }
  }
  textbox.innerHTML = "";
  textbox.appendChild(text);
}

let _laser_end_life_exclamation = document.querySelector('#end_life_exclamation_laser');
_laser_end_life_exclamation.addEventListener('click', function() {
  document.querySelector('#end_life_textbox_laser').parentElement.classList.remove('invisible');
});

document.querySelector('#x_end_life_laser').addEventListener('click', function() {
  document.querySelector('#end_life_textbox_laser').parentElement.classList.add('invisible');
});
