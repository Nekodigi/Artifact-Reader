//table can be replaced by min and step?

const statDef = {
  hp: {
    weight: 0,
    abri: "HP ",
    name: { en: "HP", ja: "HP" },
    table: [209.13, 239.0, 268.88, 298.75],
  },
  hp_: {
    weight: 0,
    name: { en: "HP%", ja: "HP%" },
    abri: "HP%",
    table: [4.08, 4.66, 5.25, 5.83],
  },
  atk: {
    weight: 0,
    name: { en: "ATK", ja: "攻撃力" },
    table: [13.62, 15.56, 17.51, 19.45],
  },
  atk_: {
    weight: 1,
    name: { en: "ATK%", ja: "攻撃力%" },
    table: [4.08, 4.66, 5.25, 5.83],
  },
  def: {
    weight: 0,
    name: { en: "DEF", ja: "防御力" },
    table: [16.2, 18.52, 20.83, 23.15],
  },
  def_: {
    weight: 0,
    name: { en: "DEF%", ja: "防御力%" },
    table: [5.1, 5.83, 6.56, 7.29],
  },
  eleMas: {
    weight: 0,
    name: { en: "Elemental Mastery", ja: "元素熟知" },
    table: [16.32, 18.65, 20.98, 23.31],
  },
  enerRech_: {
    weight: 0,
    name: { en: "Energy Recharge%", ja: "元素チャージ効率%" },
    table: [4.53, 5.18, 5.83, 6.48],
  },
  heal_: {
    weight: 0,
    name: { en: "Healing Bonus" },
  },
  critRate_: {
    weight: 2,
    name: { en: "CRIT Rate%", ja: "会心率%" },
    table: [2.72, 3.11, 3.5, 3.89],
  },
  critDMG_: {
    weight: 1,
    name: { en: "CRIT DMG%", ja: "会心ダメージ%" },
    table: [5.44, 6.22, 6.99, 7.77],
  },

  physical_dmg_: {
    weight: 0,
    name: { en: "Physical DMG Bonus" },
    table: [0, 0, 0, 0],
  },
  anemo_dmg_: {
    weight: 0,
    name: { en: "Anemo DMG Bonus" },
    table: [0, 0, 0, 0],
  },
  geo_dmg_: { weight: 0, name: { en: "Geo DMG Bonus" }, table: [0, 0, 0, 0] },
  electro_dmg_: {
    weight: 0,
    name: { en: "Electro DMG Bonus" },
    table: [0, 0, 0, 0],
  },
  hydro_dmg_: {
    weight: 0,
    name: { en: "Hydro DMG Bonus" },
    table: [0, 0, 0, 0],
  },
  pyro_dmg_: { weight: 0, name: { en: "Pyro DMG Bonus" }, table: [0, 0, 0, 0] },
  cryo_dmg_: { weight: 0, name: { en: "Cryo DMG Bonus" }, table: [0, 0, 0, 0] },
  dendro_dmg_: {
    weight: 0,
    name: { en: "Dendro DMG Bonus" },
    table: [0, 0, 0, 0],
  },
  ERR: {
    weight: 0,
    name: { en: "Substat", ja: "サブステータス" },
    icon: undefined,
    table: [0, 0, 0, 0],
  },
} as const;

export { statDef };
