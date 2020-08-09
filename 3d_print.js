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
var _3dprint_end_life = null;
var recycled = false;
// var material = 'PLA'
// var _3dprint_end_life= 'recycle_bin'
// var machine_3dprint_radios = 'makerbot'
var first = true

// TODO: change co2_DF_electricity to match electricity source type
const material_3dprint = {
  PLA: {
    emb_energy_avg: ((49 + 54) / 2 + (15.4 + 17) / 2),
    co2_avg: ((3.4 + 3.8) / 2 + (1.15 + 1.27) / 2),
    // co2_DF_electricity: 0.5,
    emb_energy_recycling_avg: ((33 + 40) / 2),
    co2_recycling_avg: ((2 + 2.4) / 2),
    co2_combustion: (1.8 + 1.9) / 2,
    energy_incineration: (-18.8 + -20.1) / 2,
    plate_warm_up: (0.25 + 0.55) / 2,
    nozzle_warm_up: (0.86 + 0.92) / 2
  },
  ABS: {
    emb_energy_avg: ((90 + 99) / 2 + (18 + 20) / 2),
    co2_avg: ((3.6 + 4) / 2 + (1.4 + 1.5) / 2),
    // co2_DF_electricity: 0.5,
    emb_energy_recycling_avg: ((42 + 51) / 2),
    co2_recycling_avg: ((2.5 + 3.1) / 2),
    co2_combustion: (3.1 + 3.2) / 2,
    energy_incineration: (-37.6 + -39) / 2,
    plate_warm_up: 1,
    nozzle_warm_up: 1
  },
  Nylon: {
    emb_energy_avg: ((116 + 129) / 2 + (26.9 + 29.5) / 2),
    co2_avg: ((7.6 + 8.3) / 2 + (1.99 + 2.19) / 2),
    // co2_DF_electricity: 0.5,
    emb_energy_recycling_avg: ((38 + 47) / 2),
    co2_recycling_avg: ((2.31 + 2.8) / 2),
    co2_combustion: (2.3 + 2.4) / 2,
    energy_incineration: (-30 + -32) / 2,
    plate_warm_up: (0.88 + 0.91) / 2,
    nozzle_warm_up: (1.14 + 1.04) / 2
  }
};

const power = {
  makerbot: {
    _3dprinting: (21.752 + 20.808) / 2,
    cad_prep: (31.328 + 31.872) / 2,
    plate_warm_up: (136.370 + 138.000) / 2,
    nozzle_warm_up: (38.722 + 40.418) / 2,
    idle: (4.176 + 4.624) / 2
  },
  ultimaker: {
    _3dprinting: (46.596 + 48.281) / 2,
    cad_prep: (49.119 + 49.119) / 2,
    plate_warm_up: (131.856 + 134.144) / 2,
    nozzle_warm_up: (50.561 + 51.439) / 2,
    idle: (2.181 + 2.219) / 2
  }
};

const percentage_time = {
  cad_prep: 0.17544,
  plate_warm_up: 0.30702,
  nozzle_warm_up: 0.08772,
  idle: 1.33333
};


function refresh_user_input() {

  _3dprint_iteration = parseFloat(document.getElementById("_3dprint_iteration_input").value);
  _3dprint_weight = parseFloat(document.getElementById("_3dprint_weight_input").value) / 1000 * _3dprint_iteration;
  _3dprint_time = parseFloat(document.getElementById("_3dprint_time_input").value) * 60 * _3dprint_iteration;

  // console.log(document.getElementsByName('percent'));
  if (document.querySelector("input[value=support_percent]").checked) {
    // console.log('getting percent');
    _3dprint_support = parseFloat(document.getElementById("_3dprint_support_slider").value) / 100 * _3dprint_weight;
  } else {
    // console.log('getting grams');
    _3dprint_support = parseFloat(document.getElementById("_3dprint_support_input").value) / 1000 * _3dprint_iteration;
  }

  // console.log(_3dprint_support);
  _3dprint_prototyping_weight = (_3dprint_weight - _3dprint_support);
  _3dprint_prototyping_waste = (_3dprint_support);

  var location_radios = document.getElementsByName('location_3dprint');
  l = location_radios.length
  for (i = 0; i < l; i++) {
    checked = location_radios[i].checked
    if (checked === true) {
      _3dprint_location_type = location_radios[i].value;
      break;
    }
  }

  if (_3dprint_location_type == 'region') {
    let e = document.getElementById("where_3d_print");
    _3dprint_location = e.options[e.selectedIndex].value;
  } else {
    _3dprint_distance = parseFloat(document.getElementById('_3dprint_distance_input').value); //in km
    console.log(_3dprint_distance);
  }
  let e = document.getElementById("shipment_3dprint");
  _3dprint_shipment = e.options[e.selectedIndex].value;

  let mat = document.getElementById("material_3dprint").value
  mat = mat.split('_');
  if (mat.length == 2) {
    recycled = true;
  } else {
    recycled = false;
  }
  _3dprint_material = mat[0];
  // console.log(_3dprint_material, recycled);

  _3dprint_country = document.getElementById("country_3dprint").value;

  if (_3dprint_country == "United States") {
    let state = document.getElementById("state_3dprint").value;
    _3dprint_electric = electricity_state_coeff[state];
  } else {
    _3dprint_electric = electricity_coeff[_3dprint_country];
  }

  var machine_3dprint_radios_nodes = document.getElementsByName('machine_3dprint_radio_button');
  l = machine_3dprint_radios_nodes.length

  for (i = 0; i < l; i++) {
    checked = machine_3dprint_radios_nodes[i].checked
    if (checked === true) {
      _3dprint_machine = machine_3dprint_radios_nodes[i].value;
      break;
    }
  }

  var end_of_life_radios_nodes = document.getElementsByName('end_of_life_radio_button');
  l = end_of_life_radios_nodes.length

  for (i = 0; i < l; i++) {
    checked = end_of_life_radios_nodes[i].checked
    if (checked === true) {
      _3dprint_end_life = end_of_life_radios_nodes[i].value;
      break;
    }
  }

  // if (first === false && _3dprint_iteration !== null && _3dprint_weight !== null && _3dprint_support !== null && _3dprint_time !== null) {
  //     start_the_magic()
  // }


}

function lifecycle_calculation_3dprint() {
  //raw materials manufacturing
  // console.log(_3dprint_material);
  var results_mat_manufacturing;
  if (recycled) {
    results_mat_manufacturing = {
      energy: _3dprint_weight * material_3dprint[_3dprint_material].emb_energy_recycling_avg,
      co2: _3dprint_weight * material_3dprint[_3dprint_material].co2_recycling_avg
    }
  } else {
    results_mat_manufacturing = {
      energy: _3dprint_weight * material_3dprint[_3dprint_material].emb_energy_avg,
      co2: _3dprint_weight * material_3dprint[_3dprint_material].co2_avg
    }
  }
  //transportation
  var results_transportation;
  if (_3dprint_location_type == 'region') {
    results_transportation = transportation_calculation(_3dprint_shipment, _3dprint_location);
  } else {
    results_transportation = user_transport_calc(_3dprint_shipment, _3dprint_distance);
  }
  results_transportation.energy = _3dprint_weight * results_transportation.energy;
  results_transportation.co2 = _3dprint_weight * results_transportation.co2;

  //fabrication
  let results_fabrication = {
    energy: null,
    co2: null
  }

  results_fabrication.energy = (_3dprint_time / 1000000) *
    (power[_3dprint_machine]._3dprinting +
      power[_3dprint_machine].cad_prep * percentage_time.cad_prep +
      power[_3dprint_machine].plate_warm_up * percentage_time.plate_warm_up * material_3dprint[_3dprint_material].plate_warm_up +
      power[_3dprint_machine].nozzle_warm_up * percentage_time.nozzle_warm_up * material_3dprint[_3dprint_material].nozzle_warm_up +
      power[_3dprint_machine].idle * percentage_time.idle);

  results_fabrication.co2 = results_fabrication.energy * _3dprint_electric / 3.6;

  //end_life
  var results_end_life = end_life_calculation(_3dprint_support, _3dprint_end_life, {
    energy: material_3dprint[_3dprint_material].energy_incineration,
    co2: material_3dprint[_3dprint_material].co2_combustion
  });


  return {
    mat_manufacturing: results_mat_manufacturing,
    transportation: results_transportation,
    fabrication: results_fabrication,
    end_life: results_end_life
  }
}

document.getElementById('btn_submit_3dprint').addEventListener('click', start_the_magic);

function start_the_magic() {
  refresh_user_input();
  let results = lifecycle_calculation_3dprint()

  if (first === true) {
    first = false
  }
  let results_energy = {
    name: _3dprint_material,
    mat_manufacturing: results.mat_manufacturing.energy,
    transportation: results.transportation.energy,
    fabrication: results.fabrication.energy,
    end_life: results.end_life.energy
  };

  let results_co2 = {
    name: _3dprint_material,
    mat_manufacturing: results.mat_manufacturing.co2,
    transportation: results.transportation.co2,
    fabrication: results.fabrication.co2,
    end_life: results.end_life.co2
  };

  if (recycled) {
    results_energy.name = _3dprint_material + " Recycled";
    results_co2.name = _3dprint_material + " Recycled";
  }
  console.log(results_energy);
  console.log(results_co2);
  if (results_energy_ar.length == 0) {
    original = {
      material: recycled ? _3dprint_material + ' Recycled' : _3dprint_material,
      transport_distance: _3dprint_location,
      transport_shipment: _3dprint_shipment,
      df_electricity: _3dprint_electric,
      machine_model: _3dprint_machine,
      prototype_weight: Math.round(_3dprint_weight * 1000 / _3dprint_iteration),
      prototype_waste: Math.round(_3dprint_support * 1000 / _3dprint_iteration),
      fabrication_time: _3dprint_time / 60,
      iterations: _3dprint_iteration,
      disposal: _3dprint_end_life
    }
  }
  set_manu_3dprint();
  set_transport_3dprint();
  set_fabrication_3dprint();
  set_end_life_3dprint();

  add_ar_draw(results_energy, results_co2);
}
//manufacturing
function set_manu_3dprint() {
  let text;
  let textbox = document.querySelector('#manufacturing_textbox_3dprint');
  _3dprint_manu_exclamation.classList.remove('invisible');
  //remove if prev value was good
  textbox.classList.remove('good');
  _3dprint_manu_exclamation.classList.remove('good');

  if (_3dprint_material == 'PLA' && recycled) {
    textbox.classList.add('good');
    _3dprint_manu_exclamation.classList.add('good');
    text = document.createTextNode("PLA has a lower environmental impact than ABS and Nylon. PLA recycled uses 46% less energy and emits 54% less CO2 than PLA manufactured for the first time.");

  } else if (_3dprint_material == 'PLA') {
    text = document.createTextNode('PLA has a lower environmental impact than ABS and Nylon. However, PLA recycled uses 46% less energy and emits 54% less CO2 than PLA manufactured for the first time. Next time, ask your provider for PLA recycled to reduce your environmental impact in this phase.');
  } else if (_3dprint_material == 'ABS' && recycled) {
    text = document.createTextNode('ABS has a higher environmental impact than PLA. However, ABS recycled uses 59% less energy and emits 40% less CO2 than ABS manufactured for the first time. Next time, ask your provider for ABS recycled or PLA recycled to reduce your environmental impact in this phase.');
  } else if (_3dprint_material == 'ABS') {
    text = document.createTextNode('ABS primary manufacturing has a higher environmental impact than ABS recycled and PLA. ABS uses 41% more energy and emits 60% more CO2 than ABS recycled. Next time, ask your provider for ABS recycled or PLA recycled to reduce your environmental impact in this phase.');
  } else if (_3dprint_material == 'Nylon' && recycled) {
    text = document.createTextNode('Nylon has a higher environmental impact than ABS and PLA. However, Nylon recycled uses 69% less energy and emits 74.5% less CO2 than Nylon manufactured for the first time. Next time, ask your provider for Nylon recycled, ABS recycled or PLA recycled to reduce your environmental impact in this phase.');
  } else { //reg nylon
    text = document.createTextNode('Nylon primary manufacturing has a higher environmental impact than Nylon recycled, ABS or PLA. Nylon uses 31% more energy and emits 16.5% more CO2 than Nylon recycled. Next time, ask your provider for Nylon recycled, ABS recycled or PLA recycled to reduce your environmental impact in this phase.');
  }
  textbox.innerHTML = "";
  textbox.appendChild(text);
}
let _3dprint_manu_exclamation = document.querySelector('#manufacturing_exclamation_3dprint');
_3dprint_manu_exclamation.addEventListener('click', function() {
  document.querySelector('#manufacturing_textbox_3dprint').parentElement.classList.remove('invisible');
});

document.querySelector('#x_manufacturing_3dprint').addEventListener('click', function() {
  document.querySelector('#manufacturing_textbox_3dprint').parentElement.classList.add('invisible');
});
//transportation
function set_transport_3dprint() {
  let textbox = document.querySelector('#transport_textbox_3dprint');
  _3dprint_transport_exclamation.classList.remove('invisible');

  if (_3dprint_location == 'Local') {
    textbox.classList.add('good');
    _3dprint_transport_exclamation.classList.add('good');
  } else {
    textbox.classList.remove('good');
    _3dprint_transport_exclamation.classList.remove('good');
  }

  let text;
  if (_3dprint_location_type == 'region') {
    text = get_transport_text(_3dprint_location, _3dprint_shipment);
  } else {
    text = get_transport_text(_3dprint_distance, _3dprint_shipment);
  }
  textbox.innerHTML = "";
  textbox.appendChild(text);
}

let _3dprint_transport_exclamation = document.querySelector('#transport_exclamation_3dprint');
console.log(_3dprint_transport_exclamation);
_3dprint_transport_exclamation.addEventListener('click', function() {
  document.querySelector('#transport_textbox_3dprint').parentElement.classList.remove('invisible');
});

document.querySelector('#x_transport_3dprint').addEventListener('click', function() {
  document.querySelector('#transport_textbox_3dprint').parentElement.classList.add('invisible');
});

//fabrication
function set_fabrication_3dprint() {
  let textbox = document.querySelector('#fabrication_textbox_3dprint');
  _3dprint_fabrication_exclamation.classList.remove('invisible');
  let text = get_electric_text(_3dprint_country);

  if (_3dprint_machine == 'makerbot') {
    textbox.classList.add('good');
    _3dprint_fabrication_exclamation.classList.add('good');
    text.appendChild(document.createTextNode('Makerbot Replicator+ is the best choice, using half as much power than Ultimaker 2 Extended in the molding process. You can save energy by reducing print time by adjusting the 3D print speed to 50 mm/s average, changing the infill density to 10-15% and reducing idle time by turning off the machine when not in use'));
  } else { //ultimaker
    textbox.classList.remove('good');
    _3dprint_fabrication_exclamation.classList.remove('good');
    text.appendChild(document.createTextNode("Ultimaker 2 Extended uses twice as much power than Makerbot Replicator+ in the molding process. You can save energy by reducing print time by adjusting the 3D print speed to 50 mm/s average, changing the infill density to 10-15% and reducing idle time by turning off the machine when not in use."));
  }

  textbox.innerHTML = "";
  textbox.appendChild(text);
}

let _3dprint_fabrication_exclamation = document.querySelector('#fabrication_exclamation_3dprint');
_3dprint_fabrication_exclamation.addEventListener('click', function() {
  document.querySelector('#fabrication_textbox_3dprint').parentElement.classList.remove('invisible');
});

document.querySelector('#x_fabrication_3dprint').addEventListener('click', function() {
  document.querySelector('#fabrication_textbox_3dprint').parentElement.classList.add('invisible');
});

//end_life
function set_end_life_3dprint() {
  let textbox = document.querySelector('#end_life_textbox_3dprint');
  _3dprint_end_life_exclamation.classList.remove('invisible');
  let text = document.createDocumentFragment();
  if (_3dprint_end_life == 'idk') {
    text.appendChild(document.createTextNode("Since you didn't specify an end of life type, we assume your material will end up in the landfill."));
    text.appendChild(document.createElement("BR"));
    _3dprint_end_life = 'landfill';
  }
  if (_3dprint_end_life == 'recycle_bin') {
    text.appendChild(document.createTextNode('Recycling reduces the need for extracting, refining and processing raw materials all of which create substantial air and water pollution. Recycling allows the waste to become the raw material for a new material with lower embodied energy than a primary manufactured one. However, the recycling process still generates CO2 emissions which can be avoided by using compostable materials. We only analyzed the cost of transporting the waste to a recycling facility.'));
  } else if (_3dprint_end_life == 'incineration') {
    text.appendChild(document.createTextNode('Even though the incineration process generates energy bonus because of the burning process, it still creates about 8000% more CO2 emissions than when the waste is recycled. We analyzed the cost of transporting the waste to a garbage facility and the energy and CO2 emissions generated from burning the waste.'));
  } else if (_3dprint_end_life == 'landfill') {
    if (_3dprint_material == 'PLA') {
      text.appendChild(document.createTextNode('If PLA ends up in the landfill, it breaks down anaerobically to release methane, a greenhouse gas that is about 30 times more potent than carbon dioxide and that contributes to climate change (2). Sending your waste to recycling reduces the need for extracting, refining and processing raw materials all of which create substantial air and water pollution. Recycling allows the waste to become the raw material for a new material with lower embodied energy than a primary manufactured one. 20 % of total US methane emissions come from landfills. We only analyzed the cost of transporting the waste to a landfill.'));
    } else if (_3dprint_material == 'ABS') {
      text.appendChild(document.createTextNode('If ABS ends up in the landfill, it becomes a potential source of microplastics. Landfills can impact on air, water and land quality. Sending your waste to recycling reduces the need for extracting, refining and processing raw materials all of which create substantial air and water pollution. Recycling allows the waste to become the raw material for a new material with lower embodied energy than a primary manufactured one. We only analyzed the cost of transporting the waste to a landfill.'));
    } else if (_3dprint_material == 'Nylon') {
      text.appendChild(document.createTextNode('If Nylon ends up in the landfill, it becomes a potential source of microplastics. Landfills can impact on air, water and land quality. Sending your waste to recycling reduces the need for extracting, refining and processing raw materials all of which create substantial air and water pollution. Recycling allows the waste to become the raw material for a new material with lower embodied energy than a primary manufactured one. We only analyzed the cost of transporting the waste to a landfill.'));
    }
  }
  textbox.innerHTML = "";
  textbox.appendChild(text);
}

let _3dprint_end_life_exclamation = document.querySelector('#end_life_exclamation_3dprint');
_3dprint_end_life_exclamation.addEventListener('click', function() {
  document.querySelector('#end_life_textbox_3dprint').parentElement.classList.remove('invisible');
});

document.querySelector('#x_end_life_3dprint').addEventListener('click', function() {
  document.querySelector('#end_life_textbox_3dprint').parentElement.classList.add('invisible');
});
