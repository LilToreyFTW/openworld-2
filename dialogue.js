/**
 * Virtual Sim — Central dialogue and unused-content strings.
 * Rival victory (location-based), Warden, Tower Chief, exhibit signs,
 * Tower/Haveila story lore, shop post-purchase, directional options,
 * pet/multiplayer activation strings.
 */

// ——— Rival victory lines (location-specific) ———
const RIVAL_VICTORY = {
  generic: "Yeah! Am I great or what?",
  city_streets: "These streets belong to me. You just live here.",
  tower_reception: "Reception was never your strong suit. The Tower agrees.",
  tower_upper_levels: "Up here, the view is mine. You had your shot downstairs.",
  haveila: "Even in the evil city, I come out on top. That's the deal.",
  safari_restricted: "The restricted zone doesn't save you. Nothing does."
};

function getRivalVictoryLine(locationKey) {
  return RIVAL_VICTORY[locationKey] || RIVAL_VICTORY.generic;
}

/** Resolve current battle location for rival victory. */
function getBattleLocationKey(playerInsideBuilding, hubInteriorLevel, isHaveilaMap) {
  if (isHaveilaMap) return 'haveila';
  if (!playerInsideBuilding) return 'city_streets';
  const building = window.buildingData && playerInsideBuilding && window.buildingData.get(playerInsideBuilding);
  if (building && building.isHubTower) {
    if (hubInteriorLevel === 0) return 'tower_reception';
    return 'tower_upper_levels';
  }
  return 'city_streets';
}

// ——— Exhibit and Tower signs (Doom Patrol Tower hub) ———
const TOWER_SIGNS = {
  exhibits: [
    "EXHIBIT A: Fossilized Klyntar — Pre-bond specimen",
    "EXHIBIT B: Symbiote Containment — Do not approach",
    "EXHIBIT C: Alien Remains — Haveila recovery",
    "RESTRICTED: Authorized personnel only"
  ],
  containment: [
    "⚠ SYMBIOTE CONTAINMENT ZONE — Level 2 clearance",
    "CONTAINMENT BREACH PROTOCOL ACTIVE",
    "Fossil display — Extinct host specimens"
  ],
  reception: [
    "Doom Patrol Tower — Reception · Gatherings Area",
    "Quest board · Missions · Multiplayer access"
  ]
};

// ——— Warden-style NPC (patrol guard) dialogue ———
const WARDEN_DIALOGUE = {
  greet: "This area is restricted. State your business.",
  no_pass: "You don't have clearance for the upper levels. Turn back.",
  warned: "I'm not asking again. Restricted zone.",
  idle: "Patrol route clear. Keep moving.",
  lore: "They used to say a high-level manager hid in the Haveila sector. Now we handle things here in the Tower."
};

// ——— Tower and Haveila story (early draft / lore) ———
const TOWER_HAVEILA_STORY = {
  early_draft: "Early intelligence suggested a key figure had gone to ground in Haveila—either in the evil city or a Safari Zone–style restricted sector. That lead was later abandoned; the real confrontation was always meant to happen here, in the Doom Patrol Tower.",
  codex_entry: "The Haveila Citadel was once rumoured to hold a high-level manager or symbiote mastermind. Operational focus later shifted to the Tower; the main antagonist is now confronted directly in Doom Patrol Tower, not in the distant districts."
};

// ——— Tower Chief / patrol enemy classes ———
const TOWER_CHIEF_DIALOGUE = {
  aggro: "You don't belong in this sector.",
  hit: "Tower security will end you.",
  death: "The Tower… will remember…"
};

const PATROL_DIALOGUE = {
  spot: "Halt! Identify yourself.",
  combat: "Restricted zone! Use of force authorized.",
  defeat: "…reinforcements…"
};

// ——— Placeholder / untranslated (exposed for NPCs that were never spawned) ———
const UNUSED_NPC_STRINGS = {
  tower_chief_placeholder: "[Tower Chief]",
  patrol_variant: "[Patrol — Restricted Zone]",
  haveila_citadel_boss: "[Citadel Authority]"
};

// ——— Shop post-purchase messages ———
const SHOP_POST_PURCHASE = {
  weapon: "Weapon equipped. Stay sharp.",
  pet: "Your new companion is ready. Summon from the Pets panel.",
  prestige_camo: "Prestige camo unlocked. Show it off in the Armory.",
  consumable: "Item added to your tool belt."
};

function getShopPostPurchaseMessage(itemType) {
  return SHOP_POST_PURCHASE[itemType] || SHOP_POST_PURCHASE.consumable;
}

// ——— Directional options (menu / navigation) ———
const DIRECTIONAL_OPTIONS = {
  NORTH_EAST: "NORTH / EAST",
  EAST_WEST: "EAST / WEST",
  NORTH_WEST: "NORTH / WEST",
  SOUTH_EAST: "SOUTH / EAST",
  SOUTH_WEST: "SOUTH / WEST",
  NORTH: "NORTH",
  SOUTH: "SOUTH",
  EAST: "EAST",
  WEST: "WEST"
};

// ——— Pet storage / summon activation ———
const PET_STORAGE_STRINGS = {
  switch_on: "Switch on!",
  summon_activate: "Companion active.",
  storage_connected: "Storage linked.",
  channel_joined: "Channel joined — companion ready."
};

// ——— Multiplayer lobby (leftover / connection) ———
const MULTIPLAYER_LOBBY_STRINGS = {
  connection_established: "Connection established.",
  lobby_synced: "Lobby synced.",
  waiting_for_players: "Waiting for players…",
  game_starting: "Game starting…"
};

if (typeof window !== 'undefined') {
  window.RIVAL_VICTORY = RIVAL_VICTORY;
  window.getRivalVictoryLine = getRivalVictoryLine;
  window.getBattleLocationKey = getBattleLocationKey;
  window.TOWER_SIGNS = TOWER_SIGNS;
  window.WARDEN_DIALOGUE = WARDEN_DIALOGUE;
  window.TOWER_HAVEILA_STORY = TOWER_HAVEILA_STORY;
  window.TOWER_CHIEF_DIALOGUE = TOWER_CHIEF_DIALOGUE;
  window.PATROL_DIALOGUE = PATROL_DIALOGUE;
  window.UNUSED_NPC_STRINGS = UNUSED_NPC_STRINGS;
  window.SHOP_POST_PURCHASE = SHOP_POST_PURCHASE;
  window.getShopPostPurchaseMessage = getShopPostPurchaseMessage;
  window.DIRECTIONAL_OPTIONS = DIRECTIONAL_OPTIONS;
  window.PET_STORAGE_STRINGS = PET_STORAGE_STRINGS;
  window.MULTIPLAYER_LOBBY_STRINGS = MULTIPLAYER_LOBBY_STRINGS;
}
