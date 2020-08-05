"use strict";

let results_energy_ar = [];
let results_co2_ar = [];

const Printing = document.getElementById("Printing");
const print = document.getElementById("3D_Printing");
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

let _3dprint_state_select = document.getElementById('_3dprint_state_selector');

let _3dprint_country_select = document.getElementById('country_3dprint')
_3dprint_country_select.addEventListener('change', function(e) {
  if (_3dprint_country_select.value == "United States") {
    _3dprint_state_select.classList.remove('invisible');
  } else {
    _3dprint_state_select.classList.add('invisible');
  }
});

let _laser_state_select = document.getElementById('_laser_state_selector');

let _laser_country_select = document.getElementById('country_laser')
_laser_country_select.addEventListener('change', function(e) {
  if (_3dprint_country_select.value == "United States") {
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
  console.log("calling transport calc");
  console.log('recieved: "' + shipment + '" "' + location + '"');
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
  console.log(transport_mode);
  if (location == 'International') {
    console.log("calc international");
    if (transport_mode == 'idk') {
      transport_mode = 'ocean'
    }
    transport_energy = ((transportation_energies[transport_mode] * transportation_distances['international_avg']) + transport_base_en);

    transport_co2 = ((transportation_co2[transport_mode] * transportation_distances['international_avg']) + transport_base_co2);

  } else if (location == "National") {
    console.log("calc national");

    if (transport_mode == 'idk') {
      transport_mode = 'truck_32'
    }
    transport_energy = ((transportation_energies[transport_mode] * transportation_distances['national_avg']) + transport_base_en);

    transport_co2 = ((transportation_co2[transport_mode] * transportation_distances['national_avg']) + transport_base_co2);

  } else if (location == 'Local') {
    console.log("calc local");

    if (transport_mode == 'idk' || transport_mode == 'truck_32') {
      transport_mode = 'truck_14';
    }
    transport_energy = (transportation_energies[transport_mode] * transportation_distances['local_avg']) +
      (transportation_energies['light_vehicle'] * transportation_distances['local_city_avg']);

    transport_co2 = (transportation_co2[transport_mode] * transportation_distances['local_avg']) +
      (transportation_co2['light_vehicle'] * transportation_distances['local_city_avg']);
  } else { //idk distance so assume the worst
    console.log("calc idk");

    if (transport_mode == 'idk') {
      transport_mode = 'ocean'
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

function end_life_calculation(waste, type) {
  let results_end_life;
  if (type === 'recycle_bin') {
    results_end_life = {
        energy: (waste / 1000 * transportation_energies['truck_14'] * transportation_distances['local_recycling_avg']),
        co2: (waste / 1000 * transportation_co2['truck_14'] * transportation_distances['local_recycling_avg']),
    }
  } else {
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
  if(results_energy_ar.length == 0) {
    results_energy_ar = [results_energy];
    results_co2_ar = [results_co2];
  } else if (results_energy_ar.length == 1) {
    results_energy_ar[0].name = 'Original ' + results_energy_ar[0].name;
    results_co2_ar[0].name = 'Original ' + results_co2_ar[0].name;
    results_energy.name = 'Updated ' + results_energy.name;
    results_co2.name = 'Updated ' + results_co2.name;
    results_energy_ar.push(results_energy);
    results_co2_ar.push(results_co2);
  } else {
    results_energy.name = 'Updated ' + results_energy.name;
    results_co2.name = 'Updated ' + results_co2.name;
    results_energy_ar[1] = results_energy;
    results_co2_ar[1] = results_co2;
  }
  drawChart_energy(results_energy_ar);
  drawChart_co2(results_co2_ar);
}

function drawChart_energy(results) {

  var chartDiv = document.getElementById('chart_div_energy');

  let dataAr = [
    ['Prototyping Material', 'Raw Material Processing', 'Transportation', 'Fabrication', 'End of Life', {
      role: 'annotation'
    }]
  ]

  for (let i = 0; i < results.length; i++) {
    dataAr.push([results[i]['name'], results[i]['mat_manufacturing'], results[i]['transportation'], results[i]['fabrication'], results[i]['end_life'],
      'Total: ' + String((results[i]['mat_manufacturing'] + results[i]['transportation'] + results[i]['fabrication'] + results[i]['end_life']).toFixed(4))
    ]);
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
  var materialChart = new google.charts.Bar(chartDiv);
  materialChart.draw(data, google.charts.Bar.convertOptions(materialOptions));
}

function drawChart_co2(results) {

  var chartDiv = document.getElementById('chart_div_co2');

  let dataAr = [
    ['Prototyping Material', 'Raw Material Processing', 'Transportation', 'Fabrication', 'End of Life', {
      role: 'annotation'
    }]
  ]

  for (let i = 0; i < results.length; i++) {
    dataAr.push([results[i]['name'], results[i]['mat_manufacturing'], results[i]['transportation'], results[i]['fabrication'], results[i]['end_life'],
      'Total: ' + String((results[i]['mat_manufacturing'] + results[i]['transportation'] + results[i]['fabrication'] + results[i]['end_life']).toFixed(4))
    ]);
  }

  var data = google.visualization.arrayToDataTable(dataAr);

  var materialOptions = {
    //margin: auto,
    width: 700,
    height: 600,
    colors: ['#3C91CE', '#44C6E7', '#A8D8B7', '#FDD96E'],
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
  var materialChart = new google.charts.Bar(chartDiv);
  materialChart.draw(data, google.charts.Bar.convertOptions(materialOptions));
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
