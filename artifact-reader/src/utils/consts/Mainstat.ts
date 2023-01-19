export const mainstatKey = [
  "hp",
  "hp_",
  "atk",
  "atk_",
  "def_",
  "eleMas",
  "enerRech_",
  "heal_",
  "critRate_",
  "critDMG_",
  "physical_dmg_",
  "anemo_dmg_",
  "geo_dmg_",
  "electro_dmg_",
  "hydro_dmg_",
  "pyro_dmg_",
  "cryo_dmg_",
  "dendro_dmg_",
];

//data from https://genshin-impact.fandom.com/wiki/Artifact/Scaling
const elemDMG5 = [7.0,9.0,11.0,12.9,14.9,16.9,18.9,20.9,22.8,24.8,26.8,28.8,30.8,32.8,34.7,36.7,38.7,40.7,42.7,44.6,46.6]
const phyDMG5 = [8.7,11.2,13.7,16.2,18.6,21.1,23.6,26.1,28.6,31,33.5,36,38.5,40.9,43.4,45.9,48.4,50.8,53.3,55.8,58.3]
const elemDMG4 = [6.3,8.1,9.9,11.6,13.4,15.2,17.0,18.8,20.6,22.3,24.1,25.9,27.7,29.5,31.3,33.0,34.8]
const phyDMG4 = [7.9,10.1,12.3,14.6,16.8,19.0,21.2,23.5,25.7,27.9,30.2,32.4,34.6,36.8,39.1,41.3,43.5]
const elemDMG3 = [5.2,6.7,8.2,9.7,11.2,12.7,14.2,15.6,17.1,18.6,20.1,21.6,23.1]
const phyDMG3 = [6.6,8.4,10.3,12.1,14.0,15.8,17.7,19.6,21.4,23.3,25.1,27.0,28.8]
const elemDMG2 = [4.2,5.4,6.6,7.8,9]
const phyDMG2 = [5.2,6.7,8.2,9.7,11.2]
const elemDMG1 = [3.1,4.3,5.5,6.7,7.9]
const phyDMG1 = [3.9,5.4,6.9,8.4,9.9]

export const mainstatValueTable = {
  5: {
    hp: [
      717, 920, 1123, 1326, 1530, 1733, 1936, 2139, 2342, 2545, 2749, 2952,
      3155, 3358, 3561, 3764, 3967, 4171, 4374, 4577, 4780,
    ],
    hp_:elemDMG5,
    atk:[47,60,73,86,100,113,126,139,152,166,179,192,205,219,232,245,258,272,285,298,311],
    atk_:elemDMG5,
    def_:phyDMG5,
    eleMas:[28.0,35.9,43.8,51.8,59.7,67.6,75.5,83.5,91.4,99.3,107.2,115.2,123.1,131.0,138.9,146.9,154.8,162.7,170.6,178.6,186.5],
    enerRech_:[7.8,10.0,12.2,14.4,16.6,18.8,21.0,23.2,25.4,27.6,29.8,32.0,34.2,36.4,38.6,40.8,43.0,45.2,47.4,49.6,51.8],
    heal_:[5.4,6.9,8.4,10.0,11.5,13.0,14.5,16.1,17.6,19.1,20.6,22.1,23.7,25.2,26.7,28.2,29.8,31.3,32.8,34.3,35.9 ],
    critRate_:[4.7,6.0,7.3,8.6,9.9,11.3,12.6,13.9,15.2,16.6,17.9,19.2,20.5,21.8,23.2,24.5,25.8,27.1,28.4,29.8,31.1],
    critDMG:[9.3,12.0,14.6,17.3,19.9,22.5,25.2,27.8,30.5,33.1,35.7,38.4,41.0,43.7,46.3,49.0,51.6,54.2,56.9,59.6,62.2],
    physical_dmg_:phyDMG5,
    anemo_dmg_:elemDMG5,
    geo_dmg_:elemDMG5,
    electro_dmg_:elemDMG5,
    hydro_dmg_:elemDMG5,
    pyro_dmg_:elemDMG5,
    cryo_dmg_:elemDMG5,
    dendro_dmg_:elemDMG5
  },
  4: {
    hp: [
      645,828,1011,1194,1377,1559,1742,1925,2108,2291,2474,2657,2839,3022,3205,3388,3571
    ],
    hp_:elemDMG4,
    atk:[42,54,66,78,90,102,113,125,137,149,161,173,185,197,209,221,232],
    atk_:elemDMG4,
    def_:phyDMG4,
    eleMas:[25.2,32.3,39.4,46.6,53.7,60.8,68.0,75.1,82.2,89.4,96.5,103.6,110.8,117.9,125.0,132.2,139.3],
    enerRech_:[7.0,9.0,11.0,12.9,14.9,16.9,18.9,20.9,22.8,24.8,26.8,28.8,30.8,32.8,34.7,36.7,38.7],
    heal_:[4.8,6.2,7.6,9.0,10.3,11.7,13.1,14.4,15.8,17.2,18.6,19.9,21.3,22.7,24.0,25.4,26.8],
    critRate_:[4.2,5.4,6.6,7.8,9.0,10.1,11.3,12.5,13.7,14.9,16.1,17.3,18.5,19.7,20.8,22.0,23.2],
    critDMG:[8.4,10.8,13.1,15.5,17.9,20.3,22.7,25.0,27.4,29.8,32.2,34.5,36.9,39.3,41.7,44.1,46.4],
    physical_dmg_:phyDMG4,
    anemo_dmg_:elemDMG4,
    geo_dmg_:elemDMG4,
    electro_dmg_:elemDMG4,
    hydro_dmg_:elemDMG4,
    pyro_dmg_:elemDMG4,
    cryo_dmg_:elemDMG4,
    dendro_dmg_:elemDMG4
  },
  3: {
    hp: [
      430,552,674,796,918,1040,1162,1283,1405,1527,1649,1771,1893
    ],
    hp_:elemDMG3,
    atk:[28,36,44,52,60,68,76,84,91,99,107,115,123],
    atk_:elemDMG3,
    def_:phyDMG3,
    eleMas:[21.0,26.9,32.9,38.8,44.8,50.7,56.7,62.6,68.5,74.5,80.4,86.4,92.3],
    enerRech_:[5.8,7.5,9.1,10.8,12.4,14.1,15.7,17.4,19.0,20.7,22.3,24.0,25.6],
    heal_:[4.0,5.2,6.3,7.5,8.6,9.8,10.9,12.0,13.2,14.3,15.5,16.6,17.8],
    critRate_:[3.5,4.5,5.5,6.5,7.5,8.4,9.4,10.4,11.4,12.4,13.4,14.4,15.4],
    critDMG:[7.0,9.0,11.0,12.9,14.9,16.9,18.9,20.9,22.8,24.8,26.8,28.8,30.8],
    physical_dmg_:phyDMG3,
    anemo_dmg_:elemDMG3,
    geo_dmg_:elemDMG3,
    electro_dmg_:elemDMG3,
    hydro_dmg_:elemDMG3,
    pyro_dmg_:elemDMG3,
    cryo_dmg_:elemDMG3,
    dendro_dmg_:elemDMG3
  },
  2: {
    hp: [
      258,331,404,478,551
    ],
    hp_:elemDMG2,
    atk:[17,22,26,31,36],
    atk_:elemDMG2,
    def_:phyDMG2,
    eleMas:[16.8,21.5,26.3,31.1,35.8],
    enerRech_:[4.7,6,7.3,8.6,9.9],
    heal_:[3.2,4.1,5.1,6,6.9],
    critRate_:[2.8,3.6,4.4,5.2,6],
    critDMG:[5.6,7.2,8.8,10.4,11.9],
    physical_dmg_:phyDMG2,
    anemo_dmg_:elemDMG2,
    geo_dmg_:elemDMG2,
    electro_dmg_:elemDMG2,
    hydro_dmg_:elemDMG2,
    pyro_dmg_:elemDMG2,
    cryo_dmg_:elemDMG2,
    dendro_dmg_:elemDMG2
  },
  1: {
    hp: [129,178,227,275,324
    ],
    hp_:elemDMG1,
    atk:[8,12,15,18,21],
    atk_:elemDMG1,
    def_:phyDMG1,
    eleMas:[12.6,17.3,22.1,26.9,31.6],
    enerRech_:[3.5,4.8,6.1,7.5,8.8],
    heal_:[2.4,3.3,4.3,5.2,6.1],
    critRate_:[2.1,2.9,3.7,4.5,5.3],
    critDMG:[4.2,5.8,7.4,9.0,10.5],
    physical_dmg_:phyDMG1,
    anemo_dmg_:elemDMG1,
    geo_dmg_:elemDMG1,
    electro_dmg_:elemDMG1,
    hydro_dmg_:elemDMG1,
    pyro_dmg_:elemDMG1,
    cryo_dmg_:elemDMG1,
    dendro_dmg_:elemDMG1
  },
};