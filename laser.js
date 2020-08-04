let _laser_material, _laser_thickness, _laser_location, _laser_shipment, _laser_model, _laser_cut_time, _laser_sheet_area, _laser_proto_area, _laser_weight, _laser_end_life, _laser_waste;

//emb_energy_avg: emb eng primary + processing
//co2_avg: co2 Emissions + processing
const material = {
  Acrylic: { //missing data
    emb_energy_avg: null,
    co2_avg: null,
    co2_DF_electricity: null,
    emb_energy_recycling_avg: null,
    co2_recycling_avg: null,
    density: null
  },
  MDF: {
    emb_energy_avg: (11.3 + 11.9) / 2, //missing processing
    co2_avg: (1.1 + 1.2) / 2 + (3.67 + 3.68) / 2,
    co2_DF_electricity: 0.5,
    emb_energy_recycling_avg: (18 + 21) / 2,
    co2_recycling_avg: (0.72 + 0.8) / 2,
    density: (680 + 830) / 2
  },
  Cardboard: {
    emb_energy_avg: (49 + 54) / 2 + (0.475 + 0.525) / 2,
    co2_avg: (1.1 + 1.2) / 2 + (0.023 + 0.026) / 2,
    co2_DF_electricity: 0.5,
    emb_energy_recycling_avg: (18 + 21) / 2,
    co2_recycling_avg: (0.72 + 0.8) / 2,
    density: (480 + 860) / 2 //kg/m3
  },
  Mycelium: { //missing vals
    emb_energy_avg: 1.227,
    co2_avg: 0.039,
    co2_DF_electricity: 0.5,
    emb_energy_recycling_avg: null,
    co2_recycling_avg: null,
    density: 390
  }
};

const machine_energy = {
  Trotec: {
    cutting: (64 + 80) / 2
    // stand_by: (19.2 + 24) / 2,
    // idle: (32 + 40) / 2
  },
  Epilog: {
    cutting: (48 + 60) / 2
    // stand_by: (4.8 + 6) / 2,
    // idle: (24 + 30) / 2
  },
  Universal: {
    cutting: (60 + 75) / 2
    // stand_by: (6 + 7.5) / 2,
    // idle: (30 + 37.5) / 2
  }
};

function get_user_input() {
  let e = document.getElementById('material_lasercut');
  _laser_material = e.options[e.selectedIndex].value;

  e = document.getElementById("where_lasercut");
   _laser_location = e.options[e.selectedIndex].value;

  e = document.getElementById("shipment_lasercut");
  _laser_shipment = e.options[e.selectedIndex].value;

  e = document.getElementById("machine_lasercut");
   _laser_model = e.options[e.selectedIndex].value;

  let iteration = parseFloat(document.getElementById("laser_iteration").value)

  _laser_thickness = parseFloat(document.getElementById("mat_thickness_input_lasercut").value) / 1000; //convert from mm to m
  if(document.querySelector("input[value=length]").checked) {
    let width = parseFloat(document.getElementById("width_input_lasercut").value); //in m
    let length = parseFloat(document.getElementById("length_input_lasercut").value); //in m
    _laser_area = width * length;
  } else {
    _laser_area = parseFloat(document.getElementById("area_input_lasercut").value);
  }
  console.log(_laser_area);
  _laser_weight = _laser_area * _laser_thickness * material[_laser_material].density * iteration; //weight (kg) = volume (m3) * density (kg/m3)
  console.log("Weight: " + _laser_weight);
  if(document.querySelector("input[value=waste_percent]").checked) {
    let percent_waste = parseFloat(document.getElementById("waste_laser").value) / 100;
    _laser_waste = _laser_weight * percent_waste;
  } else {
    console.log("calc waste area");
    let _laser_waste_area = parseFloat(document.getElementById("waste_laser_area").value); //in m2
    console.log(_laser_waste_area);
    _laser_waste = _laser_waste_area * _laser_thickness * material[_laser_material].density * iteration;
  }

  console.log("Waste: " + _laser_waste);
  // e = document.getElementById("machine_lasercut");
  //  _laser_model = e.options[e.selectedIndex].value;

   _laser_cut_time = parseFloat(document.getElementById("time").value) * 60 * iteration; //covert from min to sec

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


function lifecycle_calculation() {
  let _energy = {name: _laser_material};
  let _co2 = {name: _laser_material};

  //raw materials processing
  _energy.mat_manufacturing =  _laser_weight * material[_laser_material]['emb_energy_avg'];
  _co2.mat_manufacturing = _laser_weight * material[_laser_material]['co2_avg'];

  //transportation
  let results_transportation = transportation_calculation(_laser_shipment, _laser_location);
  _energy.transportation = _laser_weight * results_transportation.energy;
  _co2.transportation = _laser_weight * results_transportation.co2;

  //fabrication
  console.log(_laser_cut_time);
  console.log(_laser_cut_time * machine_energy[_laser_model].cutting / 1000000);
  console.log(_laser_cut_time * .3 * machine_energy[_laser_model].cutting / 1000000);
  console.log(_laser_cut_time * .5 * machine_energy[_laser_model].cutting / 1000000);
  _energy.fabrication = (_laser_cut_time * machine_energy[_laser_model].cutting + _laser_cut_time * .3 * machine_energy[_laser_model].cutting  + _laser_cut_time * .5 * machine_energy[_laser_model].cutting) / 1000000;

  _co2.fabrication = _energy.fabrication / 3.6 * material[_laser_material].co2_DF_electricity;

  //end of life
  if(_laser_end_life == 'recycling') {
    _energy.end_life = (_laser_waste / 1000 * transportation_energies['truck_14'] * transportation_distances['local_recycling_avg']) +
        (_laser_waste * material[_laser_material]['emb_energy_recycling_avg']);
    _co2.end_life = (_laser_waste / 1000 * transportation_co2['truck_14'] * transportation_distances['local_recycling_avg']) +
        (_laser_waste * material[_laser_material]['co2_recycling_avg']);

  } else { //assume idk is also landfill
    _energy.end_life = (_laser_waste / 1000 * transportation_energies['truck_14'] *
      (transportation_distances['local_recycling_avg'] + transportation_distances['local_landfill_avg']));
    _co2.end_life = (_laser_waste / 1000 * transportation_co2['truck_14'] *
          (transportation_distances['local_recycling_avg'] + transportation_distances['local_landfill_avg']));
    }

  return {
    energy: _energy,
    co2: _co2
  };
}

function start_graphing() {
  get_user_input();

  let results = lifecycle_calculation();
  console.log(results);
  drawChart_energy([results.energy]);
  drawChart_co2([results.co2]);
}
