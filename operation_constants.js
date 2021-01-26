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

const MATERIAL_LASER = {
  Acrylic: {
    //missing data
    emb_energy_avg: (90 + 131.5) / 2,
    co2_avg: (2.8 + 3.2) / 2,
    co2_combustion: (1.96 + 2.05) / 2,
    energy_incineration: (-25.1 + -25.6) / 2,
    density: 1180,
  },
  MDF: {
    emb_energy_avg: (11.3 + 11.9) / 2, //missing processing
    co2_avg: (0.6 + 0.78) / 2 + (3.67 + 3.68) / 2,
    co2_combustion: (1.509 + 3.247) / 2,
    energy_incineration: (-12.4 + -16.7) / 2,
    density: (680 + 830) / 2,
  },
  Cardboard: {
    emb_energy_avg: (49 + 54) / 2 + (0.475 + 0.525) / 2,
    co2_avg: (1.1 + 1.2) / 2 + (0.023 + 0.026) / 2,
    co2_combustion: (1.8 + 1.9) / 2,
    energy_incineration: (-19 + -20) / 2,
    density: (480 + 860) / 2, //kg/m3
  },
  Cardboard_recycled: {
    emb_energy_avg: (18 + 21) / 2,
    co2_avg: (0.72 + 0.8) / 2,
    co2_combustion: (1.8 + 1.9) / 2,
    energy_incineration: (-19 + -20) / 2,
    density: (480 + 860) / 2, //kg/m3
  },
  Mycelium: {
    //missing vals
    emb_energy_avg: 1.227,
    co2_avg: 0.039,
    co2_combustion: null,
    energy_incineration: null,
    density: 390,
  },
};

const MACHINE_ENERGY_LASER = {
  Trotec: {
    cutting: (64 + 85) / 2,
    stand_by: (7.48 + 21.25) / 2,
    idle: (3.4 + 7.65) / 2,
  },
  Epilog: {
    cutting: (48 + 60) / 2,
    stand_by: (5.28 + 15) / 2,
    idle: (2.4 + 5.4) / 2,
  },
  Universal: {
    cutting: (60 + 75) / 2,
    stand_by: (6.6 + 18.75) / 2,
    idle: (3 + 6.75) / 2,
  },
};
