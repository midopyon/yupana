
    "use strict";

    const Printing = document.getElementById("Printing");
    const print = document.getElementById("3D_Printing");
    const Cutting = document.getElementById("Cutting");
    const cut = document.getElementById("Laser_Cutting");

    Printing.addEventListener("click", function(){
        print.setAttribute('class', 'visible');
        cut.setAttribute('class', 'invisible');

    });

    Cutting.addEventListener("click", function(){
        print.setAttribute('class', 'invisible');
        cut.setAttribute('class', 'visible');
    });

    let field = document.getElementById('support_field');
    let slider = document.getElementById('support_slider');
    document.getElementById('Gram').addEventListener('click', function () {
      field.classList.remove('invisible');
      slider.classList.add('invisible');
    });
    document.getElementById('Percent').addEventListener('click', function() {
      slider.classList.remove('invisible');
      field.classList.add('invisible');
    });

    let waste_area = document.getElementById('waste_field');
    let percent = document.getElementById('waste_slider');

    document.getElementById('Waste_Area').addEventListener('click', function () {
      waste_area.classList.remove('invisible');
      percent.classList.add('invisible');
    });
    document.getElementById('Waste_Percent').addEventListener('click', function() {
      percent.classList.remove('invisible');
      waste_area.classList.add('invisible');
    });

    let area = document.getElementById('area_area');
    let length = document.getElementById('area_length');

    document.getElementById('Area').addEventListener('click', function () {
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

    SupportSlider.onchange = function(){
        //console.log(inhaleSlider.value);
        document.getElementById("Support_material_display").innerHTML = SupportSlider.value;
        // refresh_user_input()
    };

    WasteSlider.onchange = function(){
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
      console.log('recieved: "' + shipment + '" "' + location +'"');
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
      if(location == 'International') {
        console.log("calc international");
        if(transport_mode == 'idk') {
          transport_mode = 'ocean'
        }
        transport_energy = ((transportation_energies[transport_mode] * transportation_distances['international_avg']) + transport_base_en);

        transport_co2 = ((transportation_co2[transport_mode] * transportation_distances['international_avg']) + transport_base_co2);

      } else if (location == "National") {
        console.log("calc national");

        if(transport_mode == 'idk') {
          transport_mode = 'truck_32'
        }
        transport_energy = ((transportation_energies[transport_mode] * transportation_distances['national_avg']) + transport_base_en);

        transport_co2 = ((transportation_co2[transport_mode] * transportation_distances['national_avg']) + transport_base_co2);

      } else if (location == 'Local') {
        console.log("calc local");

        if(transport_mode == 'idk' || transport_mode == 'truck_32') {
          transport_mode = 'truck_14';
        }
        transport_energy = (transportation_energies[transport_mode] * transportation_distances['local_avg']) +
        (transportation_energies['light_vehicle'] * transportation_distances['local_city_avg']);

        transport_co2 = (transportation_co2[transport_mode] * transportation_distances['local_avg']) +
        (transportation_co2['light_vehicle'] * transportation_distances['local_city_avg']);
      } else { //idk distance so assume the worst
        console.log("calc idk");

        if(transport_mode == 'idk') {
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

    function drawChart_energy(results) {

        var chartDiv = document.getElementById('chart_div_energy');

        let dataAr = [['Prototyping Material', 'Raw Material Processing', 'Transportation', 'Fabrication', 'End of Life', {role: 'annotation'}]]

        for(let i = 0; i < results.length; i++) {
          dataAr.push([results[i]['name'], results[i]['mat_manufacturing'], results[i]['transportation'], results[i]['fabrication'], results[i]['end_life'],
              'Total: ' + String((results[i]['mat_manufacturing'] + results[i]['transportation'] + results[i]['fabrication'] + results[i]['end_life']).toFixed(4))]);
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

        let dataAr = [['Prototyping Material', 'Raw Material Processing', 'Transportation', 'Fabrication', 'End of Life', {role: 'annotation'}]]

        for(let i = 0; i < results.length; i++) {
          dataAr.push([results[i]['name'], results[i]['mat_manufacturing'], results[i]['transportation'], results[i]['fabrication'], results[i]['end_life'],
              'Total: ' + String((results[i]['mat_manufacturing'] + results[i]['transportation'] + results[i]['fabrication'] + results[i]['end_life']).toFixed(4))]);
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
