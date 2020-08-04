var _3dprint_weight = null;
var _3dprint_support = null;
var _3dprint_prototyping_weight = null;
var _3dprint_prototyping_waste = null;
var _3dprint_iteration = null;
var _3dprint_time = null;
var _3dprint_location = null;
var _3dprint_shipment = null;
// var material = 'PLA'
var end_of_life_radios = 'recycle_bin'
var machine_3dprint_radios = 'makerbot'
var first = true
var material_3dprint = null
// TODO: change co2_DF_electricity to match electricity source type
const material_PLA = {
    PLA_emb_energy_avg: ((49 + 54) / 2 + (15.4 + 17) / 2),
    PLA_co2_avg: ((3.4 + 3.8) / 2 + (1.15 + 1.27) / 2),
    PLA_co2_DF_electricity: 0.5,
    PLA_emb_energy_recycling_avg: (((33 - 18.8) + (40 - 20.1)) / 2),
    PLA_co2_recycling_avg: (((2 + 1.8) + (2.4 + 1.9)) / 2)
};

const material_ABS = {
    ABS_emb_energy_avg: ((90 + 99) / 2 + (18 + 20) / 2),
    ABS_co2_avg: ((3.6 + 4) / 2 + (1.4 + 1.5) / 2),
    ABS_co2_DF_electricity: 0.5,
    ABS_emb_energy_recycling_avg: (((42 - 37.6) + (51 - 39)) / 2),
    ABS_co2_recycling_avg: (((2.5 + 3.1) + (3.1 + 3.2)) / 2)
};

const makerBot_power = {
    _3dprinting: (21.752 + 20.808) / 2,
    cad_prep: (31.328 + 31.872) / 2,
    plate_warm_up: (136.370 + 138.000) / 2,
    nozzle_warm_up: (38.722 + 40.418) / 2,
    idle: (4.176 + 4.624) / 2
};

const ultimaker_power = {
    _3dprinting: (46.596 + 48.281) / 2,
    cad_prep: (49.119 + 49.119) / 2,
    plate_warm_up: (131.856+134.144) / 2,
    nozzle_warm_up: (50.561+51.439) / 2,
    idle: (2.181+2.219) / 2
};

const percentage_3dprint_time = {
    cad_prep: 0.17544,
    plate_warm_up: 0.30702,
    nozzle_warm_up: 0.08772,
    idle: 0.33333
};


function refresh_user_input() {

    _3dprint_iteration = parseFloat(document.getElementById("_3dprint_iteration_input").value);
    _3dprint_weight = parseFloat(document.getElementById("_3dprint_weight_input").value) / 1000 * _3dprint_iteration;
    _3dprint_time = parseFloat(document.getElementById("_3dprint_time_input").value) * 60 * _3dprint_iteration;

    // console.log(document.getElementsByName('percent'));
    if(document.querySelector("input[value=support_percent]").checked) {
      console.log('getting percent');
      _3dprint_support = parseFloat(document.getElementById("_3dprint_support_slider").value) / 100 * _3dprint_weight;
    } else {
      console.log('getting grams');
      _3dprint_support = parseFloat(document.getElementById("_3dprint_support_input").value) / 1000 * _3dprint_iteration;
    }

    console.log(_3dprint_support);
    _3dprint_prototyping_weight = (_3dprint_weight - _3dprint_support);
    _3dprint_prototyping_waste = (_3dprint_support);

    let e = document.getElementById("where_3d_print");
     _3dprint_location = e.options[e.selectedIndex].value;

    e = document.getElementById("shipment_3dprint");
    _3dprint_shipment = e.options[e.selectedIndex].value;
    // console.log("location: " + _3dprint_location);
    // console.log("shipment: " + _3dprint_shipment);
    material_3dprint = document.getElementById("material_3dprint").value

    // machine_3dprint = document.getElementById("machine_3dprint_dropdown").value

    var machine_3dprint_radios_nodes = document.getElementsByName('machine_3dprint_radio_button');
    l = machine_3dprint_radios_nodes.length

    for (i = 0; i < l; i++) {
        checked = machine_3dprint_radios_nodes[i].checked
        if (checked === true) {
            machine_3dprint_radios = machine_3dprint_radios_nodes[i].value;
            break;
        }
    }

    var end_of_life_radios_nodes = document.getElementsByName('end_of_life_radio_button');
    l = end_of_life_radios_nodes.length

    for (i = 0; i < l; i++) {
        checked = end_of_life_radios_nodes[i].checked
        if (checked === true) {
            end_of_life_radios = end_of_life_radios_nodes[i].value;
            break;
        }
    }

    // if (first === false && _3dprint_iteration !== null && _3dprint_weight !== null && _3dprint_support !== null && _3dprint_time !== null) {
    //     start_the_magic()
    // }


}

function lifecycle_calculation_PLA() {
    var results_mat_manufacturing = {
        energy: _3dprint_weight * material_PLA['PLA_emb_energy_avg'],
        co2: _3dprint_weight * material_PLA['PLA_co2_avg']
    }
    var results_transportation = transportation_calculation(_3dprint_shipment, _3dprint_location);
    results_transportation.energy = _3dprint_weight * results_transportation.energy;
    results_transportation.co2 = _3dprint_weight * results_transportation.co2;

    const temp1 = ((_3dprint_time * percentage_3dprint_time['cad_prep'] * makerBot_power['cad_prep']) +
        (_3dprint_time * percentage_3dprint_time['plate_warm_up'] * makerBot_power['plate_warm_up']) +
        (_3dprint_time * percentage_3dprint_time['nozzle_warm_up'] * makerBot_power['nozzle_warm_up'])) / 1000000

    // TODO: change PLA_co2_DF_electricity to match electricity source type
    var stand_by_energy_makerbot = {
        energy: temp1,
        co2: temp1 / 3.6 * material_PLA['PLA_co2_DF_electricity']
    }
    const temp2 = (((_3dprint_time * percentage_3dprint_time['idle']) + _3dprint_time) * makerBot_power['idle']) / 1000000
    var idle_makerbot = {
        energy: temp2,
        co2: temp2 / 3.6 * material_PLA['PLA_co2_DF_electricity']
    }
    const temp3 = _3dprint_time * makerBot_power['_3dprinting'] / 1000000
    var _3dprinting_makerbot = {
        energy: temp3,
        co2: temp3 / 3.6 * material_PLA['PLA_co2_DF_electricity']
    }
    var results_fabrication_makerbot = {
        energy: stand_by_energy_makerbot['energy'] + idle_makerbot['energy'] + _3dprinting_makerbot['energy'],
        co2: stand_by_energy_makerbot['co2'] + idle_makerbot['co2'] + _3dprinting_makerbot['co2']
    }

    const temp4 = ((_3dprint_time * percentage_3dprint_time['cad_prep'] * ultimaker_power['cad_prep']) +
        (_3dprint_time * percentage_3dprint_time['plate_warm_up'] * ultimaker_power['plate_warm_up']) +
        (_3dprint_time * percentage_3dprint_time['nozzle_warm_up'] * ultimaker_power['nozzle_warm_up'])) / 1000000

    var stand_by_energy_ultimaker = {
        energy: temp4,
        co2: temp4 / 3.6 * material_PLA['PLA_co2_DF_electricity']
    }
    const temp5 = (((_3dprint_time * percentage_3dprint_time['idle']) + _3dprint_time) * ultimaker_power['idle']) / 1000000
    var idle_ultimaker = {
        energy: temp5,
        co2: temp5 / 3.6 * material_PLA['PLA_co2_DF_electricity']
    }
    const temp6 = _3dprint_time * ultimaker_power['_3dprinting'] / 1000000
    var _3dprinting_ultimaker = {
        energy: temp6,
        co2: temp6 / 3.6 * material_PLA['PLA_co2_DF_electricity']
    }

    var results_fabrication_ultimaker = {
        energy: stand_by_energy_ultimaker['energy'] + idle_ultimaker['energy'] + _3dprinting_ultimaker['energy'],
        co2: stand_by_energy_ultimaker['co2'] + idle_ultimaker['co2'] + _3dprinting_ultimaker['co2']
    }

    var results_end_life_recycling = {
        energy: (_3dprint_support / 1000 * transportation_energies['truck_14'] * transportation_distances['local_recycling_avg']) +
            (_3dprint_support * material_PLA['PLA_emb_energy_recycling_avg']),
        co2: (_3dprint_support / 1000 * transportation_co2['truck_14'] * transportation_distances['local_recycling_avg']) +
            (_3dprint_support * material_PLA['PLA_co2_recycling_avg']),
    }
    var results_end_life_landfill = {
        energy: (_3dprint_support / 1000 * transportation_energies['truck_14'] *
            (transportation_distances['local_recycling_avg'] + transportation_distances['local_landfill_avg'])),
        co2: (_3dprint_support / 1000 * transportation_co2['truck_14'] *
            (transportation_distances['local_recycling_avg'] + transportation_distances['local_landfill_avg']))
    }


    return {
        mat_manufacturing: results_mat_manufacturing,
        transportation: results_transportation,
        fabrication_makerbot: results_fabrication_makerbot,
        fabrication_ultimaker: results_fabrication_ultimaker,
        end_life_recycling: results_end_life_recycling,
        end_life_landfill: results_end_life_landfill
    }
}

function lifecycle_calculation_ABS() {
    var results_mat_manufacturing = {
        energy: _3dprint_weight * material_ABS['ABS_emb_energy_avg'],
        co2: _3dprint_weight * material_ABS['ABS_co2_avg']
    }
    var results_transportation = transportation_calculation(_3dprint_shipment, _3dprint_location);
    console.log(results_transportation);
    results_transportation.energy = _3dprint_weight * results_transportation.energy;
    results_transportation.co2 = _3dprint_weight * results_transportation.co2;
    // console.log(results_transportation);
    const temp1 = ((_3dprint_time * percentage_3dprint_time['cad_prep'] * makerBot_power['cad_prep']) +
        (_3dprint_time * percentage_3dprint_time['plate_warm_up'] * makerBot_power['plate_warm_up']) +
        (_3dprint_time * percentage_3dprint_time['nozzle_warm_up'] * makerBot_power['nozzle_warm_up'])) / 1000000

    var stand_by_energy_makerbot = {
        energy: temp1,
        co2: temp1 / 3.6 * material_ABS['ABS_co2_DF_electricity']
    }
    const temp2 = (((_3dprint_time * percentage_3dprint_time['idle']) + _3dprint_time) * makerBot_power['idle']) / 1000000
    var idle_makerbot = {
        energy: temp2,
        co2: temp2 / 3.6 * material_ABS['ABS_co2_DF_electricity']
    }
    const temp3 = _3dprint_time * makerBot_power['_3dprinting'] / 1000000
    var _3dprinting_makerbot = {
        energy: temp3,
        co2: temp3 / 3.6 * material_ABS['ABS_co2_DF_electricity']
    }
    var results_fabrication_makerbot = {
        energy: stand_by_energy_makerbot['energy'] + idle_makerbot['energy'] + _3dprinting_makerbot['energy'],
        co2: stand_by_energy_makerbot['co2'] + idle_makerbot['co2'] + _3dprinting_makerbot['co2']
    }

    const temp4 = ((_3dprint_time * percentage_3dprint_time['cad_prep'] * ultimaker_power['cad_prep']) +
        (_3dprint_time * percentage_3dprint_time['plate_warm_up'] * ultimaker_power['plate_warm_up']) +
        (_3dprint_time * percentage_3dprint_time['nozzle_warm_up'] * ultimaker_power['nozzle_warm_up'])) / 1000000

    var stand_by_energy_ultimaker = {
        energy: temp4,
        co2: temp4 / 3.6 * material_ABS['ABS_co2_DF_electricity']
    }
    const temp5 = (((_3dprint_time * percentage_3dprint_time['idle']) + _3dprint_time) * ultimaker_power['idle']) / 1000000
    var idle_ultimaker = {
        energy: temp5,
        co2: temp5 / 3.6 * material_ABS['ABS_co2_DF_electricity']
    }
    const temp6 = _3dprint_time * ultimaker_power['_3dprinting'] / 1000000
    var _3dprinting_ultimaker = {
        energy: temp6,
        co2: temp6 / 3.6 * material_ABS['ABS_co2_DF_electricity']
    }
    var results_fabrication_ultimaker = {
        energy: stand_by_energy_ultimaker['energy'] + idle_ultimaker['energy'] + _3dprinting_ultimaker['energy'],
        co2: stand_by_energy_ultimaker['co2'] + idle_ultimaker['co2'] + _3dprinting_ultimaker['co2']
    }

    var results_end_life_recycling = {
        energy: (_3dprint_support / 1000 * transportation_energies['truck_14'] * transportation_distances['local_recycling_avg']) +
            (_3dprint_support * material_ABS['ABS_emb_energy_recycling_avg']),
        co2: (_3dprint_support / 1000 * transportation_co2['truck_14'] * transportation_distances['local_recycling_avg']) +
            (_3dprint_support * material_ABS['ABS_co2_recycling_avg']),
    }
    var results_end_life_landfill = {
        energy: (_3dprint_support / 1000 * transportation_energies['truck_14'] *
            (transportation_distances['local_recycling_avg'] + transportation_distances['local_landfill_avg'])),
        co2: (_3dprint_support / 1000 * transportation_co2['truck_14'] *
            (transportation_distances['local_recycling_avg'] + transportation_distances['local_landfill_avg']))
    }


    return {
        mat_manufacturing: results_mat_manufacturing,
        transportation: results_transportation,
        fabrication_makerbot: results_fabrication_makerbot,
        fabrication_ultimaker: results_fabrication_ultimaker,
        end_life_recycling: results_end_life_recycling,
        end_life_landfill: results_end_life_landfill
    }
}

document.getElementById('btn_submit_3dprint').addEventListener('click', start_the_magic);

function start_the_magic() {
    refresh_user_input();
    let results;
    if (material_3dprint == 'PLA') {
      results = lifecycle_calculation_PLA()
    }
    else if (material_3dprint == 'ABS') {
      results = lifecycle_calculation_ABS()
    }
    if (first === true) {
        first = false
    }
    results_energy = [
      {
        name: material_3dprint,
        mat_manufacturing: results.mat_manufacturing.energy,
        transportation: results.transportation.energy,
        fabrication: null,
        end_life: null
      }
    ]

    results_co2 = [
      {
        name: material_3dprint,
        mat_manufacturing: results.mat_manufacturing.co2,
        transportation: results.transportation.co2,
        fabrication: null,
        end_life: null
      }
    ]

    if (machine_3dprint_radios === 'makerbot') {
        results_energy[0].fabrication = results['fabrication_makerbot']['energy'];
        results_co2[0].fabrication = results['fabrication_makerbot']['co2'];
    } else if (machine_3dprint_radios === 'ultimaker') {
        results_energy[0].fabrication = results['fabrication_ultimaker']['energy'];
        results_co2[0].fabrication = results['fabrication_ultimaker']['co2'];
    }

    if (end_of_life_radios === 'recycle_bin') {
        results_energy[0].end_life = results['end_life_recycling']['energy'];
        results_co2[0].end_life = results['end_life_recycling']['co2'];
    } else if (end_of_life_radios === 'landfill') {
        results_energy[0].end_life = results['end_life_landfill']['energy'];
        results_co2[0].end_life = results['end_life_landfill']['co2'];
    }
    // console.log(results_energy);
    // console.log(results_co2);
    drawChart_energy(results_energy)
    drawChart_co2(results_co2)
}


// var options = {
//     width: 600,
//     height: 800,
//     legend: {position: 'top', maxLines: 3},
//     bar: {groupWidth: '75%'},
//     isStacked: true,
//
//     title: 'Energy Consumption',
//     series: colors,
//     vAxis: {
//         title: 'Energy (MJ)',
//     },
//     hAxis: {
//         title: 'Prototyping Material',
//
//     },
//     titleTextStyle: {
//         color: 'black',    // any HTML string color ('red', '#cc00cc')
//         fontName: 'Arial', // i.e. 'Times New Roman'
//         fontSize: 11, // 12, 18 whatever you want (don't specify px)
//         bold: true,    // true or false
//         italic: false   // true of false
//     },
// };


// view.setColumns([0, 1, 2, 3, 4,
//     { calc: "stringify",
//         sourceColumn: 1,
//         type: "string",
//         role: "annotation" },
//     2]);

// var chart = new google.visualization.ColumnChart(document.getElementById("columnchart_values"));
// chart.draw(view, options);
// }


// function plot_diagram(results_PLA, results_ABS) {
//     am4core.ready(function () {

//         const mat_manufacturing_PLA = results_PLA['mat_manufacturing']
//         const transportation_PLA = results_PLA['transportation']
//         const fabrication_makerbot_PLA = results_PLA['fabrication_makerbot']
//         const fabrication_ultimaker_PLA = results_PLA['fabrication_ultimaker']
//         const end_life_recycling_PLA = results_PLA['end_life_recycling']
//         const end_life_landfill_PLA = results_PLA['end_life_landfill']

//         const mat_manufacturing_ABS = results_ABS['mat_manufacturing']
//         const transportation_ABS = results_ABS['transportation']
//         const fabrication_makerbot_ABS = results_ABS['fabrication_makerbot']
//         const fabrication_ultimaker_ABS = results_ABS['fabrication_ultimaker']
//         const end_life_recycling_ABS = results_ABS['end_life_recycling']
//         const end_life_landfill_ABS = results_ABS['end_life_landfill']

// // Themes begin
//         am4core.useTheme(am4themes_animated);
// // Themes end

// // Create chart instance
//         var chart = am4core.create("chartdiv", am4charts.XYChart);

// // Add data
//         if (end_of_life_radios === 'recycle_bin') {
//             chart.data = [{
//                 "material": "PLA",
//                 "material_and_manufacturing": mat_manufacturing_PLA['energy'],
//                 "transportation": transportation_PLA['energy'],
//                 "fabrication": fabrication_PLA['energy'],
//                 "end_of_life": end_life_recycling_PLA['energy']
//             }, {
//                 "material": "ABS",
//                 "material_and_manufacturing": mat_manufacturing_ABS['energy'],
//                 "Transportation": transportation_ABS['energy'],
//                 "Fabrication": fabrication_ABS['energy'],
//                 "end_of_life": end_life_recycling_ABS['energy']
//             }];
//         } else if (end_of_life_radios === 'landfill') {
//             chart.data = [{
//                 "material": "PLA",
//                 "material_and_manufacturing": mat_manufacturing_PLA['energy'],
//                 "Transportation": transportation_PLA['energy'],
//                 "Fabrication": fabrication_PLA['energy'],
//                 "end_of_life": end_life_landfill_PLA['energy']
//             }, {
//                 "material": "ABS",
//                 "material_and_manufacturing": mat_manufacturing_ABS['energy'],
//                 "Transportation": transportation_ABS['energy'],
//                 "Fabrication": fabrication_ABS['energy'],
//                 "end_of_life": end_life_landfill_ABS['energy']
//             }];
//         }

//         //     ,{
//         //     "year": "2005",
//         //     "europe": 2.8,
//         //     "namerica": 2.9,
//         //     "asia": 2.4,
//         //     "lamerica": 1.4,
//         //     "meast": 0.3,
//         //     "africa": 0.1
//         // }];


// // Create axes
//         var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
//         categoryAxis.dataFields.category = "material";
//         categoryAxis.title.text = "Energy Consumption";
//         categoryAxis.renderer.grid.template.location = 0;
//         categoryAxis.renderer.minGridDistance = 20;
//         categoryAxis.renderer.cellStartLocation = 0.4;
//         categoryAxis.renderer.cellEndLocation = 0.8;

//         var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
//         valueAxis.min = 0;
//         valueAxis.title.text = "Energy(MJ)";

// // Create series
//         function createSeries(field, name, stacked) {
//             var series = chart.series.push(new am4charts.ColumnSeries());
//             series.dataFields.valueY = field;
//             series.dataFields.categoryX = "material";
//             series.name = name;
//             series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
//             series.stacked = stacked;
//             series.columns.template.width = am4core.percent(95);
//             // for (i = 0; i < chart.data.length; i++) {
//             //     material = chart.data[i]['material']
//             //     if (material_3dprint === material) {
//             //         series.columns.template.fill = am4core.color("#00ff00")
//             //     } else {
//             //         series.columns.template.fill = am4core.color("888888")
//             //     }
//             // }
//         }

//         createSeries("material_and_manufacturing", "Mat. &  Manufac.", false);
//         createSeries("transportation", "Transportation", true);
//         createSeries("fabrication", "Fabrication", true);
//         createSeries("end_of_life", "End of Life", true);
//         // createSeries("meast", "Middle East", true);
//         // createSeries("africa", "Africa", true);


// // Add legend
//         chart.legend = new am4charts.Legend();

//     }); // end am4core.ready()
// }
