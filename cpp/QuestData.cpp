#include "QuestData.h"

namespace game {

static void AddLandQuest(QuestSystem& q, QuestId id, const char* title, const char* desc,
    QuestObjectiveType type, int target, const char* targetId, int reward, QuestId prereq = 0) {
    QuestDefinition def;
    def.id = id;
    def.category = QuestCategory::Land;
    def.title = title;
    def.description = desc;
    def.rewardPoints = reward;
    def.prerequisiteQuestId = prereq;
    def.objectives.push_back({ 1, type, 0, target, targetId ? targetId : "" });
    q.RegisterQuest(std::move(def));
}

static void AddSpaceQuest(QuestSystem& q, QuestId id, const char* title, const char* desc,
    QuestObjectiveType type, int target, const char* targetId, int reward, QuestId prereq = 0) {
    QuestDefinition def;
    def.id = id;
    def.category = QuestCategory::OuterSpace;
    def.title = title;
    def.description = desc;
    def.rewardPoints = reward;
    def.prerequisiteQuestId = prereq;
    def.objectives.push_back({ 1, type, 0, target, targetId ? targetId : "" });
    q.RegisterQuest(std::move(def));
}

void RegisterLandQuests(QuestSystem& quests) {
    AddLandQuest(quests, 1, "First Blood", "Eliminate 10 enemies in the warzone.", QuestObjectiveType::Kill, 10, "enemy", 150);
    AddLandQuest(quests, 2, "Scavenger", "Collect 15 supply crates from the field.", QuestObjectiveType::Collect, 15, "supply_crate", 200);
    AddLandQuest(quests, 3, "Forward Observer", "Reach the forward outpost.", QuestObjectiveType::ReachLocation, 1, "outpost", 180);
    AddLandQuest(quests, 4, "Saboteur", "Interact with and disable 3 enemy relays.", QuestObjectiveType::Interact, 3, "relay", 250, 1);
    AddLandQuest(quests, 5, "Courier", "Deliver intel to the command bunker.", QuestObjectiveType::Deliver, 1, "intel", 220);
    AddLandQuest(quests, 6, "Survivor", "Survive 5 rounds in Zombies.", QuestObjectiveType::SurviveRounds, 5, "", 300);
    AddLandQuest(quests, 7, "Champion", "Win 3 Team Deathmatch games.", QuestObjectiveType::WinMatches, 3, "tdm", 350);
    AddLandQuest(quests, 8, "Territory Control", "Capture 10 control points in Domination.", QuestObjectiveType::Interact, 10, "control_point", 280);
    AddLandQuest(quests, 9, "Flag Runner", "Capture 2 flags in Capture The Flag.", QuestObjectiveType::Collect, 2, "flag_capture", 320);
    AddLandQuest(quests, 10, "Sniper's Nest", "Eliminate 20 enemies from long range.", QuestObjectiveType::Kill, 20, "enemy", 400, 1);
    AddLandQuest(quests, 11, "Medic", "Collect 20 medkits and deliver to base.", QuestObjectiveType::Collect, 20, "medkit", 260);
    AddLandQuest(quests, 12, "Demolition", "Destroy 5 enemy vehicles.", QuestObjectiveType::Kill, 5, "vehicle", 380);
    AddLandQuest(quests, 13, "Recon", "Reach all three recon waypoints.", QuestObjectiveType::ReachLocation, 3, "waypoint", 300);
    AddLandQuest(quests, 14, "Hack the Network", "Interact with 4 terminal nodes.", QuestObjectiveType::Interact, 4, "terminal", 340);
    AddLandQuest(quests, 15, "Supply Line", "Deliver 5 ammo crates to the front.", QuestObjectiveType::Deliver, 5, "ammo_crate", 290);
    AddLandQuest(quests, 16, "Night Watch", "Survive 10 rounds in Zombies.", QuestObjectiveType::SurviveRounds, 10, "", 500, 6);
    AddLandQuest(quests, 17, "Dominator", "Win 2 Domination matches.", QuestObjectiveType::WinMatches, 2, "domination", 400);
    AddLandQuest(quests, 18, "Close Quarters", "Get 15 shotgun kills.", QuestObjectiveType::Kill, 15, "enemy", 360);
    AddLandQuest(quests, 19, "Intel Run", "Reach the enemy comms hub.", QuestObjectiveType::ReachLocation, 1, "comms_hub", 420);
    AddLandQuest(quests, 20, "Arms Dealer", "Collect 10 weapon caches.", QuestObjectiveType::Collect, 10, "weapon_cache", 310);
    AddLandQuest(quests, 21, "Bomb Defuser", "Defuse 2 bombs in Search and Destroy.", QuestObjectiveType::Interact, 2, "bomb_defuse", 450);
    AddLandQuest(quests, 22, "Escort Duty", "Deliver the VIP to the safe zone.", QuestObjectiveType::Deliver, 1, "vip", 380);
    AddLandQuest(quests, 23, "Last Stand", "Survive 15 Zombie rounds.", QuestObjectiveType::SurviveRounds, 15, "", 600, 16);
    AddLandQuest(quests, 24, "Elite Slayer", "Eliminate 50 enemies in any mode.", QuestObjectiveType::Kill, 50, "enemy", 550, 10);
    AddLandQuest(quests, 25, "Legend", "Complete 5 wins across any multiplayer mode.", QuestObjectiveType::WinMatches, 5, "any", 700);
}

void RegisterSpaceQuests(QuestSystem& quests) {
    AddSpaceQuest(quests, 26, "Void Walker", "Eliminate 12 hostiles in the Derelict Station.", QuestObjectiveType::Kill, 12, "hostile", 200);
    AddSpaceQuest(quests, 27, "Salvage Run", "Collect 20 scrap from wreckage in the Belt.", QuestObjectiveType::Collect, 20, "scrap", 250);
    AddSpaceQuest(quests, 28, "Docking Protocol", "Reach the orbital dock at Nexus Prime.", QuestObjectiveType::ReachLocation, 1, "nexus_dock", 280);
    AddSpaceQuest(quests, 29, "Core Access", "Interact with the reactor core console.", QuestObjectiveType::Interact, 1, "reactor_core", 320);
    AddSpaceQuest(quests, 30, "Data Courier", "Deliver encrypted data to the Fleet Command.", QuestObjectiveType::Deliver, 1, "data_chip", 300);
    AddSpaceQuest(quests, 31, "Survive the Hive", "Survive 5 waves aboard the Infested Cruiser.", QuestObjectiveType::SurviveRounds, 5, "", 350);
    AddSpaceQuest(quests, 32, "Strike: Dust Bowl", "Complete the Dust Bowl strike on Mars.", QuestObjectiveType::WinMatches, 1, "strike", 400);
    AddSpaceQuest(quests, 33, "Beacon Light", "Capture 8 beacons in Sector Control.", QuestObjectiveType::Interact, 8, "beacon", 340);
    AddSpaceQuest(quests, 34, "Relic Runner", "Secure 2 relics in Relic Rush.", QuestObjectiveType::Collect, 2, "relic", 380);
    AddSpaceQuest(quests, 35, "Long Range Engagement", "Eliminate 15 hostiles from the sniper nest.", QuestObjectiveType::Kill, 15, "hostile", 420, 26);
    AddSpaceQuest(quests, 36, "Cryo Pods", "Collect 25 cryo canisters from the wreck.", QuestObjectiveType::Collect, 25, "cryo_canister", 360);
    AddSpaceQuest(quests, 37, "Breach", "Destroy 4 enemy fighter drones.", QuestObjectiveType::Kill, 4, "drone", 400);
    AddSpaceQuest(quests, 38, "Waypoint Alpha", "Reach all jump points in the sector.", QuestObjectiveType::ReachLocation, 3, "jump_point", 370);
    AddSpaceQuest(quests, 39, "Override", "Interact with 5 security nodes.", QuestObjectiveType::Interact, 5, "security_node", 410);
    AddSpaceQuest(quests, 40, "Supply Drop", "Deliver 8 fuel cells to the outpost.", QuestObjectiveType::Deliver, 8, "fuel_cell", 390);
    AddSpaceQuest(quests, 41, "Hive Siege", "Survive 10 waves on the Infested Cruiser.", QuestObjectiveType::SurviveRounds, 10, "", 550, 31);
    AddSpaceQuest(quests, 42, "Strike: Eclipse", "Complete the Eclipse strike on Titan.", QuestObjectiveType::WinMatches, 1, "strike", 480);
    AddSpaceQuest(quests, 43, "Plasma Caster", "Get 20 kills with energy weapons.", QuestObjectiveType::Kill, 20, "enemy", 440);
    AddSpaceQuest(quests, 44, "Bridge Command", "Reach the bridge of the capital ship.", QuestObjectiveType::ReachLocation, 1, "bridge", 500);
    AddSpaceQuest(quests, 45, "Artifact Hunt", "Collect 12 ancient artifacts from ruins.", QuestObjectiveType::Collect, 12, "artifact", 430);
    AddSpaceQuest(quests, 46, "Disarm", "Defuse the warhead in Zero-G Sabotage.", QuestObjectiveType::Interact, 1, "warhead", 520);
    AddSpaceQuest(quests, 47, "Evac", "Deliver the scientist to the rescue shuttle.", QuestObjectiveType::Deliver, 1, "scientist", 460);
    AddSpaceQuest(quests, 48, "Veteran of the Void", "Survive 15 waves in space horde.", QuestObjectiveType::SurviveRounds, 15, "", 650, 41);
    AddSpaceQuest(quests, 49, "Elite Hunter", "Eliminate 60 hostiles across space activities.", QuestObjectiveType::Kill, 60, "hostile", 600, 35);
    AddSpaceQuest(quests, 50, "Guardian", "Complete 5 strikes or raids.", QuestObjectiveType::WinMatches, 5, "strike", 750);
}

void RegisterAllQuests(QuestSystem& quests) {
    RegisterLandQuests(quests);
    RegisterSpaceQuests(quests);
}

} // namespace game
