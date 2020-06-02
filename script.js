(function(){
    "use strict";

    const Printing = document.getElementById("Printing");
    const print = document.getElementById("3D_Printing");
    const Cutting = document.getElementById("Cutting");
    const cut = document.getElementById("Laser_Cutting");

    // const manu = document.getElementById("manu");
    // const trans = document.getElementById("trans");
    // const use = document.getElementById("use");
    // const end = document.getElementById("end");

    // const Manu = document.getElementsById("Manufacturing");
    // const Trans = document.getElementsById("Transportation");
    // const Use = document.getElementsById("Use phase");
    // const End = document.getElementsById("End");

    Printing.addEventListener("click", function(){
        print.setAttribute('class', 'visible');
        cut.setAttribute('class', 'invisible');

        // Manu.setAttribute('class', 'visible');
        // Trans.setAttribute('class', 'invisible');
        // Use.setAttribute('class', 'invisible');
        // End.setAttribute('class', 'invisible');
    });

    Cutting.addEventListener("click", function(){
        print.setAttribute('class', 'invisible');
        cut.setAttribute('class', 'visible');
        chart.setAttribute('class', 'visible');

        // Manu.setAttribute('class', 'visible');
        // Trans.setAttribute('class', 'invisible');
        // Use.setAttribute('class', 'invisible');
        // End.setAttribute('class', 'invisible');
    });

    // manu.addEventListener("click", function(){
    //     Manu.setAttribute('class', 'visible');
    //     Trans.setAttribute('class', 'invisible');
    //     Use.setAttribute('class', 'invisible');
    //     End.setAttribute('class', 'invisible');
    // });

    // trans.addEventListener("click", function(){
    //     Manu.setAttribute('class', 'invisible');
    //     Trans.setAttribute('class', 'visible');
    //     Use.setAttribute('class', 'invisible');
    //     End.setAttribute('class', 'invisible');
    // });

    // use.addEventListener("click", function(){
    //     Manu.setAttribute('class', 'invisible');
    //     Trans.setAttribute('class', 'invisible');
    //     Use.setAttribute('class', 'visible');
    //     End.setAttribute('class', 'invisible');
    // });

    // end.addEventListener("click", function(){
    //     Manu.setAttribute('class', 'invisible');
    //     Trans.setAttribute('class', 'invisible');
    //     Use.setAttribute('class', 'invisible');
    //     End.setAttribute('class', 'visible');
    // });

    var SupportSlider = document.getElementById("_3dprint_support_input");
    var WasteSlider = document.getElementById("Waste_laser");
    var LeftoverSlider = document.getElementById("Leftover_laser");
    // var sessionSlider = document.getElementById("sessionTime");

    SupportSlider.onchange = function(){
        //console.log(inhaleSlider.value);
        document.getElementById("Support_material_display").innerHTML = SupportSlider.value;
        refresh_user_input()
    };

    WasteSlider.onchange = function(){
        document.getElementById("Waste_laser_display").innerHTML = WasteSlider.value;
    };

    LeftoverSlider.onchange = function(){
        document.getElementById("Leftover_laser_display").innerHTML = LeftoverSlider.value;
    };

    // sessionSlider.onchange = function(){
    //     document.getElementById("sessiondisplay").innerHTML = sessionSlider.value;
    // };



}());
