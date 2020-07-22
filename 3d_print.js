var _3dprint_weight = null;
var _3dprint_support = null;
var _3dprint_prototyping_weight = null;
var _3dprint_prototyping_waste = null;
var _3dprint_iteration = null;
var _3dprint_time = null;
var material = 'PLA'
var end_of_life_radios = 'recycle_bin'
var machine_3dprint_radios = 'makerbot'
var first = true
var material_3dprint = null

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
    local_city_avg: (29.2 + 306.6) / 2,
    local_landfill_avg: (87.6 + 160 + 6) / 2
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
    _3dprint_support = parseFloat(document.getElementById("_3dprint_support_input").value) / 100 * _3dprint_weight;
    _3dprint_time = parseFloat(document.getElementById("_3dprint_time_input").value) * 60 * _3dprint_iteration;

    _3dprint_prototyping_weight = (_3dprint_weight - _3dprint_support);
    _3dprint_prototyping_waste = (_3dprint_support);

    material_3dprint = document.getElementById("material_3dprint").value

    // machine_3dprint = document.getElementById("machine_3dprint_dropdown").value

    var machine_3dprint_radios_nodes = document.getElementsByName('machine_3dprint_radio_button');
    l = machine_3dprint_radios_nodes.length

    for (i = 0; i < l; i++) {
        checked = machine_3dprint_radios_nodes[i].checked
        if (checked === true) {
            machine_3dprint_radios = machine_3dprint_radios_nodes[i].value
        }
    }

    var end_of_life_radios_nodes = document.getElementsByName('end_of_life_radio_button');
    l = end_of_life_radios_nodes.length

    for (i = 0; i < l; i++) {
        checked = end_of_life_radios_nodes[i].checked
        if (checked === true) {
            end_of_life_radios = end_of_life_radios_nodes[i].value
        }
    }

    if (first === false && _3dprint_iteration !== null && _3dprint_weight !== null && _3dprint_support !== null && _3dprint_time !== null) {
        start_the_magic()
    }


}

function lifecycle_calculation_PLA() {
    var results_mat_manufacturing = {
        energy: _3dprint_weight * material_PLA['PLA_emb_energy_avg'],
        co2: _3dprint_weight * material_PLA['PLA_co2_avg']
    }
    var results_transportation = {
        energy: _3dprint_weight / 1000 *
            ((transportation_energies['ocean'] * transportation_distances['international_avg']) +
                (transportation_energies['truck_14'] * transportation_distances['local_avg']) +
                (transportation_energies['light_vehicle'] * transportation_distances['local_city_avg'])),
        co2: _3dprint_weight / 1000 *
            ((transportation_co2['ocean'] * transportation_distances['international_avg']) +
                (transportation_co2['truck_14'] * transportation_distances['local_avg']) +
                (transportation_co2['light_vehicle'] * transportation_distances['local_city_avg']))
    }
    const temp1 = ((_3dprint_time * percentage_3dprint_time['cad_prep'] * makerBot_power['cad_prep']) +
        (_3dprint_time * percentage_3dprint_time['plate_warm_up'] * makerBot_power['plate_warm_up']) +
        (_3dprint_time * percentage_3dprint_time['nozzle_warm_up'] * makerBot_power['nozzle_warm_up'])) / 1000000

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
    var results_transportation = {
        energy: _3dprint_weight / 1000 *
            ((transportation_energies['ocean'] * transportation_distances['international_avg']) +
                (transportation_energies['truck_14'] * transportation_distances['local_avg']) +
                (transportation_energies['light_vehicle'] * transportation_distances['local_city_avg'])),
        co2: _3dprint_weight / 1000 *
            ((transportation_co2['ocean'] * transportation_distances['international_avg']) +
                (transportation_co2['truck_14'] * transportation_distances['local_avg']) +
                (transportation_co2['light_vehicle'] * transportation_distances['local_city_avg']))
    }
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

function start_the_magic() {
    // if (material === 'PLA') {
    results_PLA = lifecycle_calculation_PLA()
    // }
    // else if (material === 'ABS') {
    results_ABS = lifecycle_calculation_ABS()
    // }
    if (first === true) {
        first = false
    }
    // plot_diagram(results_PLA, results_ABS)
    drawChart_energy()
    drawChart_co2()
}
function drawChart_energy() {

    var chartDiv = document.getElementById('chart_div_energy');

    const mat_manufacturing_PLA = results_PLA['mat_manufacturing']
    const transportation_PLA = results_PLA['transportation']
    const fabrication_makerbot_PLA = results_PLA['fabrication_makerbot']
    const fabrication_ultimaker_PLA = results_PLA['fabrication_ultimaker']
    const end_life_recycling_PLA = results_PLA['end_life_recycling']
    const end_life_landfill_PLA = results_PLA['end_life_landfill']

    const mat_manufacturing_ABS = results_ABS['mat_manufacturing']
    const transportation_ABS = results_ABS['transportation']
    const fabrication_makerbot_ABS = results_ABS['fabrication_makerbot']
    const fabrication_ultimaker_ABS = results_ABS['fabrication_ultimaker']
    const end_life_recycling_ABS = results_ABS['end_life_recycling']
    const end_life_landfill_ABS = results_ABS['end_life_landfill']

    var fabrication_PLA = null
    var fabrication_ABS = null
    // var bar_opacity = null

    if (machine_3dprint_radios === 'makerbot') {
        fabrication_PLA = fabrication_makerbot_PLA['energy']
        fabrication_ABS = fabrication_makerbot_ABS['energy']
    } else if (machine_3dprint_radios === 'ultimaker') {
        fabrication_PLA = fabrication_ultimaker_PLA['energy']
        fabrication_ABS = fabrication_ultimaker_ABS['energy']
    }

    var end_life_PLA = null
    var end_life_ABS = null
    var bar_opacity = null

    if (end_of_life_radios === 'recycle_bin') {
        end_life_PLA = end_life_recycling_PLA['energy']
        end_life_ABS = end_life_recycling_ABS['energy']
    } else if (end_of_life_radios === 'landfill') {
        end_life_PLA = end_life_landfill_PLA['energy']
        end_life_ABS = end_life_landfill_ABS['energy']
    }

    var data = google.visualization.arrayToDataTable([
        ['Prototyping Material', 'Material & Manufacturing', 'Transportation', 'Fabrication', 'End of Life', {role: 'annotation'}],
        ['PLA', mat_manufacturing_PLA['energy'], transportation_PLA['energy'], fabrication_PLA, end_life_PLA,
            'Total: ' + String((mat_manufacturing_PLA['energy'] + transportation_PLA['energy'] + fabrication_PLA + end_life_PLA).toFixed(4))],
        ['ABS', mat_manufacturing_ABS['energy'], transportation_ABS['energy'], fabrication_ABS, end_life_ABS,
            'Total: ' + String((mat_manufacturing_ABS['energy'] + transportation_ABS['energy'] + fabrication_ABS + end_life_ABS).toFixed(4))],
    ]);


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

function drawChart_co2() {

    var chartDiv = document.getElementById('chart_div_co2');

    const mat_manufacturing_PLA = results_PLA['mat_manufacturing']
    const transportation_PLA = results_PLA['transportation']
    const fabrication_makerbot_PLA = results_PLA['fabrication_makerbot']
    const fabrication_ultimaker_PLA = results_PLA['fabrication_ultimaker']
    const end_life_recycling_PLA = results_PLA['end_life_recycling']
    const end_life_landfill_PLA = results_PLA['end_life_landfill']

    const mat_manufacturing_ABS = results_ABS['mat_manufacturing']
    const transportation_ABS = results_ABS['transportation']
    const fabrication_makerbot_ABS = results_ABS['fabrication_makerbot']
    const fabrication_ultimaker_ABS = results_ABS['fabrication_ultimaker']
    const end_life_recycling_ABS = results_ABS['end_life_recycling']
    const end_life_landfill_ABS = results_ABS['end_life_landfill']


    var fabrication_PLA = null
    var fabrication_ABS = null
    // var bar_opacity = null

    if (machine_3dprint_radios === 'makerbot') {
        fabrication_PLA = fabrication_makerbot_PLA['co2']
        fabrication_ABS = fabrication_makerbot_ABS['co2']
    } else if (machine_3dprint_radios === 'ultimaker') {
        fabrication_PLA = fabrication_ultimaker_PLA['co2']
        fabrication_ABS = fabrication_ultimaker_ABS['co2']
    }

    var end_life_PLA = null
    var end_life_ABS = null
    var bar_opacity = null

    if (end_of_life_radios === 'recycle_bin') {
        end_life_PLA = end_life_recycling_PLA['co2']
        end_life_ABS = end_life_recycling_ABS['co2']
    } else if (end_of_life_radios === 'landfill') {
        end_life_PLA = end_life_landfill_PLA['co2']
        end_life_ABS = end_life_landfill_ABS['co2']
    }

    var data = google.visualization.arrayToDataTable([
        ['Prototyping Material', 'Material & Manufacturing', 'Transportation', 'Fabrication', 'End of Life', {role: 'annotation'}],
        ['PLA', mat_manufacturing_PLA['co2'], transportation_PLA['co2'], fabrication_PLA, end_life_PLA,
            'Total: ' + String((mat_manufacturing_PLA['co2'] + transportation_PLA['co2'] + fabrication_PLA + end_life_PLA).toFixed(4))],
        ['ABS', mat_manufacturing_ABS['co2'], transportation_ABS['co2'], fabrication_ABS, end_life_ABS,
            'Total: ' + String((mat_manufacturing_ABS['co2'] + transportation_ABS['co2'] + fabrication_ABS + end_life_ABS).toFixed(4))],
    ]);


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
