const MATERIAL_3DPRINT = {
    PLA: {
      emb_energy_avg: (49 + 54) / 2 + (15.4 + 17) / 2,
      co2_avg: (3.4 + 3.8) / 2 + (1.15 + 1.27) / 2,
      // co2_DF_electricity: 0.5,
      emb_energy_recycling_avg: (33 + 40) / 2,
      co2_recycling_avg: (2 + 2.4) / 2,
      co2_combustion: (1.8 + 1.9) / 2,
      energy_incineration: (-18.8 + -20.1) / 2,
      plate_warm_up: (0.25 + 0.55) / 2,
      nozzle_warm_up: (0.86 + 0.92) / 2,
    },
    ABS: {
      emb_energy_avg: (90 + 99) / 2 + (18 + 20) / 2,
      co2_avg: (3.6 + 4) / 2 + (1.4 + 1.5) / 2,
      // co2_DF_electricity: 0.5,
      emb_energy_recycling_avg: (42 + 51) / 2,
      co2_recycling_avg: (2.5 + 3.1) / 2,
      co2_combustion: (3.1 + 3.2) / 2,
      energy_incineration: (-37.6 + -39) / 2,
      plate_warm_up: 1,
      nozzle_warm_up: 1,
    },
    Nylon: {
      emb_energy_avg: (116 + 129) / 2 + (26.9 + 29.5) / 2,
      co2_avg: (7.6 + 8.3) / 2 + (1.99 + 2.19) / 2,
      // co2_DF_electricity: 0.5,
      emb_energy_recycling_avg: (38 + 47) / 2,
      co2_recycling_avg: (2.31 + 2.8) / 2,
      co2_combustion: (2.3 + 2.4) / 2,
      energy_incineration: (-30 + -32) / 2,
      plate_warm_up: (0.88 + 0.91) / 2,
      nozzle_warm_up: (1.14 + 1.04) / 2,
    },
  };
  
  const POWER = {
    makerbot: {
      _3dprinting: (21.752 + 20.808) / 2,
      cad_prep: (31.328 + 31.872) / 2,
      plate_warm_up: (136.37 + 138.0) / 2,
      nozzle_warm_up: (38.722 + 40.418) / 2,
      idle: (4.176 + 4.624) / 2,
    },
    ultimaker: {
      _3dprinting: (46.596 + 48.281) / 2,
      cad_prep: (49.119 + 49.119) / 2,
      plate_warm_up: (131.856 + 134.144) / 2,
      nozzle_warm_up: (50.561 + 51.439) / 2,
      idle: (2.181 + 2.219) / 2,
    },
  };
  
  const PERCENTAGE_TIME = {
    cad_prep: 0.17544,
    plate_warm_up: 0.30702,
    nozzle_warm_up: 0.08772,
    idle: 1.33333,
  };