"use strict";

let results_energy_ar = [];
let results_co2_ar = [];
let original = {};

const Printing = document.getElementById("Printing");
const print = document.getElementById("_3D_Printing");
const Cutting = document.getElementById("Cutting");
const cut = document.getElementById("Laser_Cutting");

Printing.addEventListener("click", function() {
  print.setAttribute('class', 'visible');
  cut.setAttribute('class', 'invisible');

});

Cutting.addEventListener("click", function() {
  print.setAttribute('class', 'invisible');
  cut.setAttribute('class', 'visible');
});

function reset_form() {
  // clearing inputs
  var inputs = document.getElementsByTagName('input');
  for (var i = 0; i < inputs.length; i++) {
    if(inputs[i].classList.contains('field_selector')) {
      continue; //skip clearing this value
    }
    switch (inputs[i].type) {
      // case 'hidden':
      case 'text':
        inputs[i].value = '';
        break;
      case 'radio':
      case 'checkbox':
        inputs[i].checked = false;
    }
  }

  // clearing selects
  var selects = document.getElementsByTagName('select');
  for (var i = 0; i < selects.length; i++)
    selects[i].selectedIndex = 0;

  // clearing textarea
  var text = document.getElementsByTagName('textarea');
  for (var i = 0; i < text.length; i++)
    text[i].innerHTML = '';

  document.getElementById('btn_submit_3dprint').textContent = "Submit";
  document.getElementById('btn_submit_laser').textContent = "Submit";
  document.getElementById('chart_div_energy').innerHTML = "";
  document.getElementById('chart_div_co2').innerHTML = "";
  document.getElementById('original').classList.add('invisible');
  document.querySelectorAll('.exclamation').forEach((item, i) => {
    item.classList.add('invisible');
  });

  return false;
}

document.getElementById('btn_clear_laser').addEventListener('click', reset_form);
document.getElementById('btn_clear_3dprint').addEventListener('click', reset_form);

let region_3dprint = document.getElementById('region_input_3dprint');
let distance_3dprint = document.getElementById('distance_input_3dprint');

document.getElementById('region_radio_3dprint').addEventListener('click', function() {
  region_3dprint.classList.remove('invisible');
  distance_3dprint.classList.add('invisible');
});

document.getElementById('distance_radio_3dprint').addEventListener('click', function() {
  distance_3dprint.classList.remove('invisible');
  region_3dprint.classList.add('invisible');
});

let region_laser = document.getElementById('region_input_laser');
let distance_laser = document.getElementById('distance_input_laser');

document.getElementById('region_radio_laser').addEventListener('click', function() {
  region_laser.classList.remove('invisible');
  distance_laser.classList.add('invisible');
});

document.getElementById('distance_radio_laser').addEventListener('click', function() {
  distance_laser.classList.remove('invisible');
  region_laser.classList.add('invisible');
});

let _3dprint_state_select = document.getElementById('state_3dprint');

let _3dprint_country_select = document.getElementById('country_3dprint')
_3dprint_country_select.addEventListener('change', function(e) {
  if (_3dprint_country_select.value == "United States") {
    _3dprint_state_select.classList.remove('invisible');
  } else {
    _3dprint_state_select.classList.add('invisible');
  }
});

let _laser_state_select = document.getElementById('state_laser');

let _laser_country_select = document.getElementById('country_laser')
_laser_country_select.addEventListener('change', function(e) {
  // console.log('checking country');
  // console.log(_laser_state_select);
  // console.log(_laser_country_select.value);
  if (_laser_country_select.value == "United States") {
    // console.log('found US');
    _laser_state_select.classList.remove('invisible');
  } else {
    _laser_state_select.classList.add('invisible');
  }
});

let field = document.getElementById('support_field');
let slider = document.getElementById('support_slider');
document.getElementById('Gram').addEventListener('click', function() {
  field.classList.remove('invisible');
  slider.classList.add('invisible');
});
document.getElementById('Percent').addEventListener('click', function() {
  slider.classList.remove('invisible');
  field.classList.add('invisible');
});

let waste_area = document.getElementById('waste_field');
let percent = document.getElementById('waste_slider');

document.getElementById('Waste_Area').addEventListener('click', function() {
  waste_area.classList.remove('invisible');
  percent.classList.add('invisible');
});
document.getElementById('Waste_Percent').addEventListener('click', function() {
  percent.classList.remove('invisible');
  waste_area.classList.add('invisible');
});

let area = document.getElementById('area_area');
let length = document.getElementById('area_length');

document.getElementById('Area').addEventListener('click', function() {
  area.classList.remove('invisible');
  length.classList.add('invisible');
});
document.getElementById('Length').addEventListener('click', function() {
  length.classList.remove('invisible');
  area.classList.add('invisible');
});

let recycle_choice = document.getElementById('recycling');
let material_choice = document.getElementById('material_lasercut');
material_choice.addEventListener('change', function() {
  let value = material_choice.options[material_choice.selectedIndex].value;
  if (value == 'Cardboard' || value == 'Cardboard_recycled') {
    recycle_choice.classList.remove('invisible');
  } else {
    recycle_choice.classList.add('invisible');
  }
});

var SupportSlider = document.getElementById("_3dprint_support_slider");
var WasteSlider = document.getElementById("waste_laser");
// var LeftoverSlider = document.getElementById("Leftover_laser");
// var sessionSlider = document.getElementById("sessionTime");

SupportSlider.onchange = function() {
  //console.log(inhaleSlider.value);
  document.getElementById("Support_material_display").innerHTML = SupportSlider.value;
  // refresh_user_input()
};

WasteSlider.onchange = function() {
  document.getElementById("Waste_laser_display").innerHTML = WasteSlider.value;
};

function update_button() {
  document.getElementById('btn_submit_3dprint').textContent = "Update Values";
  document.getElementById('btn_submit_laser').textContent = "Update Values";
}

// LeftoverSlider.onchange = function(){
//     document.getElementById("Leftover_laser_display").innerHTML = LeftoverSlider.value;
// };

// sessionSlider.onchange = function(){
//     document.getElementById("sessiondisplay").innerHTML = sessionSlider.value;
// };

// document.getElementById('btn_submit_3dprint').addEventListener('click', start_the_magic);
const transportation_energies = {
  airplane: 13.00,
  ocean: 0.16,
  truck_32: 0.82,
  truck_14: 1.15,
  light_vehicle: 2.5
};

const transportation_co2 = {
  airplane: 0.76,
  ocean: 0.015,
  truck_32: 0.06,
  truck_14: 0.11,
  light_vehicle: 0.18
};

const transportation_distances = {
  international_avg: (8111.176 + 9542.560) / 2,
  national_avg: (3617.515 + 4255.900) / 2,
  local_avg: (313.973 + 369.380) / 2,
  local_recycling_avg: (29.2 + 306.6) / 2,
  local_city_avg: (87.6 + 160.6) / 2,
  local_landfill_avg: (87.6 + 160.6) / 2
};


function transportation_calculation(shipment, location) {
  // console.log("calling transport calc");
  // console.log('recieved: "' + shipment + '" "' + location + '"');
  let transport_energy;
  let transport_co2;
  let transport_mode;
  let transport_base_en = (transportation_energies['truck_14'] * transportation_distances['local_avg']) +
    (transportation_energies['light_vehicle'] * transportation_distances['local_city_avg']);
  let transport_base_co2 = (transportation_co2['truck_14'] * transportation_distances['local_avg']) +
    (transportation_co2['light_vehicle'] * transportation_distances['local_city_avg']);

  if (shipment == "By air") {
    transport_mode = 'airplane';
  } else if (shipment == 'By sea') {
    transport_mode = 'ocean';
  } else if (shipment == 'By road') {
    transport_mode = 'truck_32';
  } else { //idk so defer choice
    transport_mode = 'idk'
  }
  // console.log(transport_mode);
  if (location == 'International') {
    // console.log("calc international");
    if (transport_mode == 'idk') {
      transport_mode = 'airplane';
    }
    transport_energy = ((transportation_energies[transport_mode] * transportation_distances['international_avg']) + transport_base_en);

    transport_co2 = ((transportation_co2[transport_mode] * transportation_distances['international_avg']) + transport_base_co2);

  } else if (location == "National") {
    // console.log("calc national");

    if (transport_mode == 'idk') {
      transport_mode = 'truck_32'
    }
    transport_energy = ((transportation_energies[transport_mode] * transportation_distances['national_avg']) + transport_base_en);

    transport_co2 = ((transportation_co2[transport_mode] * transportation_distances['national_avg']) + transport_base_co2);

  } else if (location == 'Local') {
    // console.log("calc local");

    if (transport_mode == 'idk' || transport_mode == 'truck_32') {
      transport_mode = 'truck_14';
    }
    transport_energy = (transportation_energies[transport_mode] * transportation_distances['local_avg']) +
      (transportation_energies['light_vehicle'] * transportation_distances['local_city_avg']);

    transport_co2 = (transportation_co2[transport_mode] * transportation_distances['local_avg']) +
      (transportation_co2['light_vehicle'] * transportation_distances['local_city_avg']);
  } else { //idk distance so assume the worst
    // console.log("calc idk");

    if (transport_mode == 'idk') {
      transport_mode = 'airplane';
    }
    transport_energy = ((transportation_energies[transport_mode] * transportation_distances['international_avg']) +
      transport_base_en);
    transport_co2 = ((transportation_co2[transport_mode] * transportation_distances['international_avg']) +
      transport_base_co2);
  }

  return {
    energy: transport_energy / 1000,
    co2: transport_co2 / 1000
  }
}

function user_transport_calc(shipment, user_distance) {
  let transport_energy;
  let transport_co2;
  let transport_mode;

  if (shipment == "By air") {
    transport_mode = 'airplane';
  } else if (shipment == 'By sea') {
    transport_mode = 'ocean';
  } else if (shipment == 'By road') {
    transport_mode = 'truck_14';
  } else { //idk so defer choice
    transport_mode = 'idk'
  }

  if (user_distance < transportation_distances['local_city_avg']) {
    transport_energy = user_distance * transportation_energies['light_vehicle'];
    transport_co2 = user_distance * transportation_co2['light_vehicle'];
  } else if (user_distance < transportation_distances['local_city_avg'] + transportation_distances['local_avg']) {
    if (transport_mode == 'idk') {
      transport_mode = 'truck_14';
    }
    user_distance -= transportation_distances['local_city_avg']
    transport_energy = user_distance * transportation_energies[transport_mode] + transportation_distances['local_city_avg'] * transportation_energies['light_vehicle'];
    transport_co2 = user_distance * transportation_co2[transport_mode] + transportation_distances['local_city_avg'] * transportation_co2['light_vehicle'];
  } else {
    if (transport_mode == 'idk') {
      transport_mode = 'airplane';
    } else if (transport_mode == 'truck_14') {
      transport_mode = 'truck_32';
    }
    user_distance -= (transportation_distances['local_city_avg'] + transportation_distances['local_avg']);
    transport_energy = user_distance * transportation_energies[transport_mode] + (transportation_energies['truck_14'] * transportation_distances['local_avg']) +
      (transportation_energies['light_vehicle'] * transportation_distances['local_city_avg']);
    transport_co2 = user_distance * transportation_co2[transport_mode] + (transportation_co2['truck_14'] * transportation_distances['local_avg']) +
      (transportation_co2['light_vehicle'] * transportation_distances['local_city_avg']);
  }

  return {
    energy: transport_energy / 1000,
    co2: transport_co2 / 1000
  }
}

function end_life_calculation(waste, type, incineration) {
  let results_end_life;
  if (type === 'recycle_bin') {
    results_end_life = {
      energy: (waste / 1000 * transportation_energies['truck_14'] * transportation_distances['local_recycling_avg']),
      co2: (waste / 1000 * transportation_co2['truck_14'] * transportation_distances['local_recycling_avg']),
    }
  } else if (type == 'incineration') {
    results_end_life = {
      energy: (waste / 1000 * transportation_energies['truck_14'] *
        (transportation_distances['local_recycling_avg'] + transportation_distances['local_landfill_avg'])) + waste * incineration.energy,
      co2: (waste / 1000 * transportation_co2['truck_14'] *
        (transportation_distances['local_recycling_avg'] + transportation_distances['local_landfill_avg'])) + waste * incineration.co2
    }
  } else { //assume idk is landfill
    results_end_life = {
      energy: (waste / 1000 * transportation_energies['truck_14'] *
        (transportation_distances['local_recycling_avg'] + transportation_distances['local_landfill_avg'])),
      co2: (waste / 1000 * transportation_co2['truck_14'] *
        (transportation_distances['local_recycling_avg'] + transportation_distances['local_landfill_avg']))
    }
  }
  return results_end_life;
}

function add_ar_draw(results_energy, results_co2) {
  if (results_energy_ar.length == 0) {
    results_energy_ar = [results_energy];
    results_co2_ar = [results_co2];
    update_button();
  } else if (results_energy_ar.length == 1) {
    // console.log(original);
    create_original();
    results_energy_ar[0].name = 'Original Values: ' + results_energy_ar[0].name;
    results_co2_ar[0].name = 'Original Values: ' + results_co2_ar[0].name;
    results_energy.name = 'Updated Values: ' + results_energy.name;
    results_co2.name = 'Updated Values: ' + results_co2.name;
    results_energy_ar.push(results_energy);
    results_co2_ar.push(results_co2);
  } else {
    results_energy.name = 'Updated Values: ' + results_energy.name;
    results_co2.name = 'Updated Values: ' + results_co2.name;
    results_energy_ar[1] = results_energy;
    results_co2_ar[1] = results_co2;
  }
  drawChart_energy(results_energy_ar);
  drawChart_co2(results_co2_ar);
}

function create_original() {
  let original_div = document.getElementById('original');
  original_div.classList.remove('invisible');
  original_div.innerHTML = "<h5>Original Values</h5><ul><li><b>Material: </b>" + original.material +
    "</li><li><b>Transport Distance: </b>" + original.transport_distance +
    "</li><li><b>Transport Shipment: </b>" + original.transport_shipment +
    "</li><li><b>Electricity Coefficient: </b>" + original.df_electricity +
    " CO2 kg/kWh</li><li><b>Machine Model: </b>" + original.machine_model +
    "</li><li><b>Prototype Weight: </b>" + original.prototype_weight +
    " gr</li><li><b>Prototype Waste: </b>" + original.prototype_waste +
    " gr</li><li><b>Fabrication Time: </b>" + original.fabrication_time +
    " min</li><li><b>Iterations: </b>" + original.iterations +
    "</li><li><b>Disposal: </b>" + original.disposal + "</li><ul>";

  // let chartRect = document.querySelector('#chart_div_energy').getBoundingClientRect();
  // console.log(chartRect);
  // original_div.style.top = (window.scrollY + chartRect.top + 220) + 'px';
  // original_div.style.left = (window.scrollX + chartRect.left + 500) + 'px';
}

function drawChart_energy(results) {

  var chartDiv = document.getElementById('chart_div_energy');

  let dataAr = [
    ['Prototyping Material', 'Raw Material Processing', {
      role: 'annotation'
    }, 'Transportation', {
      role: 'annotation'
    }, 'Fabrication', {
      role: 'annotation'
    }, 'End of Life', {
      role: 'annotation'
    }]
  ]

  for (let i = 0; i < results.length; i++) {
    dataAr.push([results[i]['name'], results[i]['mat_manufacturing'], results[i]['mat_manufacturing'], results[i]['transportation'], results[i]['transportation'], results[i]['fabrication'], results[i]['fabrication'], results[i]['end_life'], results[i]['end_life']]);
  }

  var data = google.visualization.arrayToDataTable(dataAr);

  var materialOptions = {
    width: 700,
    height: 600,
    colors: ['#837BE7', '#E6BDF2', '#F97494', '#FD9F82'],
    titleTextStyle: {
      color: '#3b4456',
      fontSize: 16,
      fontName: 'Helvetica',
      bold: true,
      //italic: true
    },
    chart: {
      title: 'Energy Consumption',
      subtitle: ''
    },
    vAxis: {
      title: 'Energy (MJ)',
      format: "short",
      textStyle: {
        //color: '#01579b',
        fontSize: 14,
        //fontName: 'Helvetica',
        //bold: true,
        //italic: true
      }
    },
    hAxis: {
      textStyle: {
        //color: '#01579b',
        fontSize: 14,
        //fontName: 'Arial',
        //bold: true,
        //italic: true
      }
    },
  };
  var view = new google.visualization.DataView(data);
  // var materialChart = new google.charts.Bar(chartDiv);
  // materialChart.draw(data, google.charts.Bar.convertOptions(materialOptions));
  var chart = new google.visualization.ColumnChart(chartDiv);
  chart.draw(view, materialOptions);
}

function drawChart_co2(results) {

  var chartDiv = document.getElementById('chart_div_co2');

  let dataAr = [
    ['Prototyping Material', 'Raw Material Processing', {
      role: 'annotation'
    }, 'Transportation', {
      role: 'annotation'
    }, 'Fabrication', {
      role: 'annotation'
    }, 'End of Life', {
      role: 'annotation'
    }]
  ]

  for (let i = 0; i < results.length; i++) {
    dataAr.push([results[i]['name'], results[i]['mat_manufacturing'], results[i]['mat_manufacturing'], results[i]['transportation'], results[i]['transportation'], results[i]['fabrication'], results[i]['fabrication'], results[i]['end_life'], results[i]['end_life']]);
  }

  var data = google.visualization.arrayToDataTable(dataAr);

  var materialOptions = {
    //margin: auto,
    width: 700,
    height: 600,
    colors: ['#837BE7', '#E6BDF2', '#F97494', '#FD9F82'],
    titleTextStyle: {
      color: '#3b4456',
      fontSize: 16,
      fontName: 'Helvetica',
      bold: true,
      //italic: true
    },
    chart: {
      title: 'CO2 Emissions',
      subtitle: ''
    },
    vAxis: {
      title: 'CO2 (kg CO2/kg)',
      format: "short",
      textStyle: {
        //color: '#01579b',
        fontSize: 14,
        //fontName: 'Arial',
        //bold: true,
        //italic: true
      }
    },
    hAxis: {
      textStyle: {
        //color: '#01579b',
        fontSize: 14,
        //fontName: 'Arial',
        //bold: true,
        //italic: true
      }
    },
  };
  var view = new google.visualization.DataView(data);
  // var materialChart = new google.charts.Bar(chartDiv);
  // materialChart.draw(data, google.charts.Bar.convertOptions(materialOptions));
  var chart = new google.visualization.ColumnChart(chartDiv);
  chart.draw(view, materialOptions);
}

function get_transport_text(location, shipment) {
  let content = document.createDocumentFragment();
  let text_location;
  if (location == 'International') {
    text_location = document.createTextNode('Materials that travel international distances have a 95% higher environmental impact than national and local manufactured materials. Longer transportation distances require more fuel and therefore generate more CO2 emissions.');
  } else if (location == 'National') {
    text_location = document.createTextNode('Materials that travel national distances have a 30% higher environmental impact than local manufactured materials. Longer transportation distances require more fuel and therefore generate more CO2 emissions.');
  } else if (location == 'Local') {
    text_location = document.createTextNode('Locally manufactured materials have the least environmental impact: 95% less than international and 30% less than national. Longer transportation distances require more fuel and therefore generate more CO2 emissions.');
  } else { //idk
    text_location = document.createTextNode('Since you didn’t specify where your material was manufactured, we assume it travelled from China. Longer transportation distances require more fuel and therefore generate more CO2 emissions. See if you can find out where your materials are coming from and switch to local if possible.');
  }

  content.appendChild(text_location);
  content.appendChild(document.createElement("BR"));

  let text_shipment;
  if (shipment == "By air") {
    text_shipment = document.createTextNode('Airplanes have a 1000% more environmental impact related to energy than road transportation and they emit 700% more CO2. Switching to ocean or road transportation if possible uses less fuel and generates less CO2 emissions.');
  } else if (shipment == 'By sea') {
    text_shipment = document.createTextNode("Great choice! Ocean transportation has the least environmental impact when it's combined with local - road distances to ship a material. It impacts 700% less in energy and generates 730% less CO2 emissions than national transportation by road. Longer transportation distances require more fuel and therefore generate more CO2 emissions.");
  } else if (shipment == 'By road') {
    text_shipment = document.createTextNode('Using a 32 metric ton truck to travel national distances has 30% less environmental impact related to energy than using a 14 metric ton truck, and it emits 50% less CO2. A good combination of road shipping will always be to avoid xpress deliveries because they use a light goods vehicle that has a 115% more environmental impact related to energy than a 14 metric truck and it emits 63% more CO2.');
  } else {
    text_shipment = document.createTextNode('Since you didn’t specify a shipping method, we assumed: International - airplane, National - road, Local - road.');
  }
  content.appendChild(text_shipment);
  return content;
}

function get_electric_text(country) {
  let content = document.createDocumentFragment();
  content.appendChild(document.createTextNode('The co2 consumption of electricity is based on the source of the electricity (ie coal, nuclear, hydro, etc.). Different regions use different blends of electricity sources.You can check with the energy providers in your region to ensure your energy source has the least environmental impact. For example, solar and wind have a much lower environmental impact than fossil fuel sources.'));
  content.appendChild(document.createElement("BR"));
  let text_location;
  if (country_region[country] == 'north america') {
    text_location = document.createTextNode('In 2019, about 63% of the electricity generation was from fossil fuels-coal, natural gas, petroleum, and other gases. About 20% was from nuclear energy, and about 18% was from renewable energy sources.');
  } else if (country_region[country] == 'latin america') {
    text_location = document.createTextNode('In 2015, fossil fuel remains the most important source of energy in Latin America, with a share of around 75%, 16% bioenergy,  8% hydropower, 1% geothermal, and 1% originated from solar and wind energy (IEA, 2015).');
  } else if (country_region[country] == 'europe') {
    text_location = document.createTextNode('In 2018, about 45.5 % of the net electricity generated in the EU came from combustible fuels (such as natural gas, coal and oil), while a quarter (25.8 %) came from nuclear power stations.');
  } else if (country_region[country] == 'middle east') {
    text_location = document.createTextNode('');
  } else if (country_region[country] == 'africa') {
    text_location = document.createTextNode('');
  } else if (country_region[country] == 'south asia') {
    text_location = document.createTextNode('Many South Asian countries depend on a single source to provide more than 50% of total electricity generation including India (Coal - 67.9%), Nepal (Hydropower - 99.9%), Bangladesh (Natural gas - 91.5%) and Sri Lanka (Oil - 50.2%).');
  } else if (country_region[country] == 'north asia') {
    text_location = document.createTextNode('In 2015, the energy consumption in Northeast Asia was 2.6 billion tons of coal equivalent, accounting for 14% of the global total; the total electricity consumption was 3.3 PWh, accounting for 16 % of the global total. In 2016, the total CO2 emissions in China, Japan and the ROK reached 34 4 % for the global total.');
  }

  content.appendChild(text_location);
  content.appendChild(document.createElement("BR"));
  return content;
}
// Africa: 0.736,
//Asia excluding China	0.928
// Southeast Asia/ASEAN	0.627
// "South Asia": 1.214,
// Central/Eastern Europe	0.822
// "Caspian Region": 0.589,
// "Latin America":	0.210
// "Middle East":	0.735,
// Non-OECD Europe	1.111
// Non-OECD Total	0.777
// OECD Europe	0.452
// OECD North America	0.497
// OECD Pacific	0.529
const electricity_coeff = {
  Afghanistan: 0.735,
  Albania: 0.009,
  Algeria: 0.664,
  "American Samoa": 0.928,
  Andorra: 0.822,
  Angola: 0.038,
  Argentina: 0.392,
  Armenia: 0.128,
  Australia: 0.992,
  Austria: 0.177,
  Azerbaijan: 0.392,
  Bahrain: 0.727,
  Bangladesh: 0.637,
  Belarus: 0.611,
  Belgium: 0.225,
  Belize: 0.210,
  Benin: 0.701,
  Bhutan: 0.928,
  Bolivia: 0.535,
  "Bosnia and Herzegovina": 1.326,
  Botswana: 1.826,
  Brazil: 0.093,
  "Brunei Darussalam": 0.819,
  Bulgaria: 1.166,
  "Burkina Faso": 0.736,
  Burundi: 0.736,
  Cambodia: 1.171,
  Cameroon: 0.217,
  Canada: 0.180,
  "Cape Verde": 0.736,
  "Central African Republic": 0.736,
  "Chad": 0.736,
  Chile: 0.409,
  China: 0.973,
  "Chinese Taipei": 0.578,
  Colombia: 0.111,
  Comoros: 0.736,
  Congo: 0.120,
  "Costa Rica": 0.064,
  "Cote d'Ivoire": 0.501,
  Croatia: 0.386,
  Cuba: 0.938,
  Cyprus: 0.772,
  "Czech Republic": 0.938,
  Denmark: 0.375,
  Djibouti: 0.736,
  "Dominican Republic": 0.642,
  "East Timor": 0.627,
  Ecuador: 0.270,
  Egypt: 0.501,
  "El Salvador": 0.256,
  "Equatorial Guinea": 0.736,
  Eritrea: 0.678,
  Estonia: 1.907,
  Ethiopia: 0.119,
  Fiji: 0.627,
  Finland: 0.225,
  France: 0.071,
  Gabon: 0.425,
  Gambia: 0.736,
  Georgia: 0.089,
  Germany: 0.672,
  Ghana: 0.215,
  Gibraltar: 0.772,
  Greece: 1.921,
  Greenland: 1.111,
  Guam: 0.627,
  Guatemala: 0.342,
  Guinea: 0.736,
  "Guinea-Bissau": 0.736,
  Guyana: 0.736,
  Haiti: 0.483,
  Honduras: 0.415,
  "Hong Kong": 0.787,
  Hungary: 0.590,
  Iceland: 0.000,
  India: 1.333,
  Indonesia: 0.685,
  Iran: 0.631,
  Iraq: 0.821,
  Ireland: 0.521,
  Israel: 0.740,
  Italy: 0.411,
  Jamaica: 0.796,
  Japan: 0.443,
  Jordan: 0.644,
  Kazakhstan: 0.923,
  Kenya: 0.332,
  Kiribati: 0.627,
  "Korea, DPRK": 0.495,
  "Korea, ROK": 0.504,
  Kuwait: 0.637,
  Kyrgyzstan: 0.091,
  Laos: 0.637,
  Latvia: 0.192,
  Lebanon: 0.695,
  Lesotho: 0.736,
  Liberia: 0.736,
  "Libyan Arab Jamahiriya": 0.920,
  Liechtenstein: 1.111,
  Lithuania: 0.116,
  Luxembourg: 0.276,
  Macedonia: 1.941,
  Madagascar: 0.736,
  Malawi: 0.736,
  Malaysia: 0.749,
  Maldives: 0.928,
  Mali: 0.749,
  Malta: 0.866,
  Mauritania: 0.749,
  Mauritius: 0.749,
  Mayotte: 0.749,
  Mexico: 0.452,
  Moldova: 0.637,
  Monaco: 1.111,
  Mongolia: 2.311,
  Morocco: 0.731,
  Mozambique: 0.000,
  Myanmar: 0.316,
  Namibia: 0.490,
  Nauru: 0.627,
  Nepal: 0.003,
  Netherlands: 0.413,
  "Netherlands Antilles": 0.718,
  "New Zealand": 0.198,
  Nicaragua: 0.472,
  Niger: 0.736,
  Nigeria: 0.440,
  Norway: 0.002,
  Oman: 0.936,
  Pakistan: 0.473,
  Panama: 0.277,
  "Papua New Guinea": 0.736,
  Paraguay: 0.000,
  Peru: 0.238,
  Philippines: 0.527,
  Poland: 1.196,
  Portugal: 0.400,
  "Puerto Rico": 0.497,
  Qatar: 0.596,
  Romania: 1.069,
  Russia: 0.513,
  Rwanda: 0.736,
  "Saudi Arabia": 0.796,
  Senegal: 0.598,
  Serbia: 1.549,
  Sierra: 0.736,
  Singapore: 0.579,
  "Slovak Republic": 0.283,
  Slovenia: 0.578,
  Somalia: 0.736,
  "South Africa": 1.069,
  Spain: 0.343,
  "Sri Lanka": 0.417,
  Sudan: 0.615,
  Swaziland: 0.736,
  Sweden: 0.023,
  Switzerland: 0.003,
  Syria: 0.639,
  Taiwan: 0.578,
  Tajikistan: 0.023,
  Tanzania: 0.267,
  Thailand: 0.627,
  Togo: 0.207,
  "Trinidad and Tobago": 0.767,
  Tunisia: 0.572,
  Turkey: 0.866,
  Turkmenistan: 0.645,
  Uganda: 0.736,
  Ukraine: 0.563,
  "United Arab Emirates": 0.938,
  "United Kingdom": 0.509,
  "United States": 0.547,
  Uruguay: 0.304,
  Uzbekistan: 0.567,
  Venezuela: 0.208,
  Vietnam: 0.467,
  "Western Sahara": 0.736,
  Yemen: 0.644,
  Zambia: 0.003,
  Zimbabwe: 0.600
}

const electricity_state_coeff = {
  AK: 0.412,
  AL: 0.392,
  AR: 0.549,
  AZ: 0.439,
  CA: 0.191,
  CO: 0.618,
  CT: 0.230,
  DC: 0.199,
  DE: 0.407,
  FL: 0.428,
  GA: 0.420,
  HI: 0.686,
  IA: 0.485,
  ID: 0.073,
  IL: 0.369,
  IN: 0.788,
  KS: 0.449,
  KY: 0.827,
  LA: 0.379,
  MA: 0.330,
  MD: 0.379,
  ME: 0.117,
  MI: 0.503,
  MN: 0.452,
  MO: 0.771,
  MS: 0.416,
  MT: 0.525,
  NC: 0.363,
  ND: 0.683,
  NE: 0.638,
  NH: 0.136,
  NJ: 0.227,
  NM: 0.605,
  NV: 0.338,
  NY: 0.189,
  OH: 0.599,
  OK: 0.404,
  OR: 0.142,
  PA: 0.356,
  RI: 0.394,
  SC: 0.286,
  SD: 0.234,
  TN: 0.337,
  TX: 0.444,
  UT: 0.725,
  VA: 0.335,
  VT: 0.020,
  WA: 0.090,
  WI: 0.629,
  WV: 0.883,
  WY: 0.929
}

const country_region = {
  Afghanistan: "middle east",
  Albania: "europe",
  Algeria: "africa",
  "American Samoa": "south asia",
  Andorra: "europe",
  Angola: "africa",
  Argentina: "latin america",
  Armenia: "middle east",
  Australia: "europe",
  Austria: "europe",
  Azerbaijan: "middle east",
  Bahrain: "middle east",
  Bangladesh: "south asia",
  Belarus: "europe",
  Belgium: "europe",
  Belize: "latin america",
  Benin: "africa",
  Bhutan: "south asia",
  Bolivia: "latin america",
  "Bosnia and Herzegovina": "europe",
  Botswana: "africa",
  Brazil: "latin america",
  "Brunei Darussalam": "south asia",
  Bulgaria: "europe",
  "Burkina Faso": "africa",
  Burundi: "africa",
  Cambodia: "south asia",
  Cameroon: "africa",
  Canada: "north america",
  "Cape Verde": "africa",
  "Central African Republic": "africa",
  "Chad": "africa",
  Chile: "latin america",
  China: "north asia",
  Colombia: "latin america",
  Comoros: "africa",
  Congo: "africa",
  "Costa Rica": "latin america",
  "Cote d'Ivoire": "africa",
  Croatia: "europe",
  Cuba: "latin america",
  Cyprus: "europe",
  "Czech Republic": "europe",
  Denmark: "europe",
  Djibouti: "africa",
  "Dominican Republic": "latin america",
  "East Timor": "south asia",
  Ecuador: "latin america",
  Egypt: "africa",
  "El Salvador": "latin america",
  "Equatorial Guinea": "africa",
  Eritrea: "africa",
  Estonia: "europe",
  Ethiopia: "africa",
  Fiji: "south asia",
  Finland: "europe",
  France: "europe",
  Gabon: "africa",
  Gambia: "africa",
  Georgia: "middle east",
  Germany: "europe",
  Ghana: "africa",
  Gibraltar: "europe",
  Greece: "europe",
  Greenland: "europe",
  Guam: "south asia",
  Guatemala: "latin america",
  Guinea: "africa",
  "Guinea-Bissau": "africa",
  Guyana: "latin america",
  Haiti: "latin america",
  Honduras: "latin america",
  "Hong Kong": "north asia",
  Hungary: "europe",
  Iceland: "europe",
  India: "south asia",
  Indonesia: "south asia",
  Iran: "middle east",
  Iraq: "middle east",
  Ireland: "europe",
  Israel: "middle east",
  Italy: "europe",
  Jamaica: "latin america",
  Japan: "north asia",
  Jordan: "middle east",
  Kazakhstan: "middle east",
  Kenya: "africa",
  Kiribati: "south asia",
  "Korea, DPRK": "north asia",
  "Korea, ROK": "north asia",
  Kuwait: "middle east",
  Kyrgyzstan: "middle east",
  Laos: "south asia",
  Latvia: "europe",
  Lebanon: "middle east",
  Lesotho: "africa",
  Liberia: "africa",
  "Libyan Arab Jamahiriya": "africa",
  Liechtenstein: "europe",
  Lithuania: "europe",
  Luxembourg: "europe",
  Macedonia: "europe",
  Madagascar: "africa",
  Malawi: "africa",
  Malaysia: "south asia",
  Maldives: "south asia",
  Mali: "africa",
  Malta: "europe",
  Mauritania: "africa",
  Mauritius: "africa",
  Mayotte: "africa",
  Mexico: "latin america",
  Moldova: "europe",
  Monaco: "europe",
  Mongolia: "north asia",
  Morocco: "africa",
  Mozambique: "africa",
  Myanmar: "south asia",
  Namibia: "africa",
  Nauru: "south asia",
  Nepal: "south asia",
  Netherlands: "europe",
  "Netherlands Antilles": "europe",
  "New Zealand": "europe",
  Nicaragua: "latin america",
  Niger: "africa",
  Nigeria: "africa",
  Norway: "europe",
  Oman: "middle east",
  Pakistan: "middle east",
  Panama: "latin america",
  "Papua New Guinea": "africa",
  Paraguay: "latin america",
  Peru: "latin america",
  Philippines: "south asia",
  Poland: "europe",
  Portugal: "europe",
  "Puerto Rico": "latin america",
  Qatar: "middle east",
  Romania: "europe",
  Russia: "north asia",
  Rwanda: "africa",
  "Saudi Arabia": "middle east",
  Senegal: "africa",
  Serbia: "europe",
  Sierra: "africa",
  Singapore: "south asia",
  "Slovak Republic": 0.283,
  Slovenia: 0.578,
  Somalia: 0.736,
  "South Africa": 1.069,
  Spain: 0.343,
  "Sri Lanka": 0.417,
  Sudan: 0.615,
  Swaziland: 0.736,
  Sweden: 0.023,
  Switzerland: 0.003,
  Syria: 0.639,
  Taiwan: 0.578,
  Tajikistan: 0.023,
  Tanzania: 0.267,
  Thailand: 0.627,
  Togo: 0.207,
  "Trinidad and Tobago": 0.767,
  Tunisia: 0.572,
  Turkey: 0.866,
  Turkmenistan: 0.645,
  Uganda: 0.736,
  Ukraine: 0.563,
  "United Arab Emirates": 0.938,
  "United Kingdom": 0.509,
  "United States": "north america",
  Uruguay: 0.304,
  Uzbekistan: 0.567,
  Venezuela: 0.208,
  Vietnam: 0.467,
  "Western Sahara": 0.736,
  Yemen: 0.644,
  Zambia: 0.003,
  Zimbabwe: 0.600
}
