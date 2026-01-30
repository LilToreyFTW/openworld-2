/**
 * Virtual Sim Hangout — Game Server
 * 25 Land + 25 Space quests, 50 weapons, 10 prestiges × 55 levels, 500 prestige camos
 * Multiplayer (TDM, Domination, CTF, Search and Destroy), Zombies
 */

#include "GameServer.h"
#include "QuestData.h"
#include "Weapon.h"
#include "GameTypes.h"
#include <cstdio>
#include <cstdint>

using namespace game;

static void ExampleMissions(GameServer& server) {
    MissionDefinition m1;
    m1.id = 1;
    m1.title = "Operation Black Dawn";
    m1.description = "Infiltrate the base and disable communications.";
    m1.objectives.push_back({ 1, MissionObjectiveType::ReachZone, 0, 1, "comms_room", 0.0f, false });
    m1.objectives.push_back({ 2, MissionObjectiveType::InteractWith, 0, 1, "terminal", 0.0f, false });
    m1.nextMissionId = 2;
    server.Missions().RegisterMission(std::move(m1));

    MissionDefinition m2;
    m2.id = 2;
    m2.title = "Extraction";
    m2.description = "Reach the extraction point.";
    m2.objectives.push_back({ 1, MissionObjectiveType::ReachZone, 0, 1, "extraction", 120.0f, false });
    server.Missions().RegisterMission(std::move(m2));
}

int main(int argc, char** argv) {
    (void)argc;
    (void)argv;

    GameServer server;

    RegisterAllQuests(server.Quests());  // 25 land + 25 space quests
    ExampleMissions(server);

    WeaponRegistry weapons;
    WeaponProgression weaponProg;
    weaponProg.AddWeaponXp(1, 1001, 1000);
    std::printf("Weapon 1 level: %d, prestige: %d\n",
                weaponProg.GetState(1001, 1)->level,
                weaponProg.GetState(1001, 1)->prestige);
    std::printf("Weapons: %zu, Prestige camos: %zu\n",
                weapons.GetAllWeaponIds().size(),
                static_cast<size_t>(WeaponRegistry::kPrestigeCamoCount));

    server.AddPlayer(1001, Team::Alpha);
    server.AddPlayer(1002, Team::Bravo);
    server.AddPlayer(1003, Team::Alpha);

    server.Quests().StartQuest(1001, 1);
    server.Missions().StartMission(1001, 1);

    server.SetGameMode(GameMode::TeamDeathmatch);
    server.TDM().OnKill(1001, 1002);

    std::printf("TDM Alpha score: %d, Bravo score: %d\n",
                server.TDM().GetState().teamScores.at(Team::Alpha),
                server.TDM().GetState().teamScores.at(Team::Bravo));

    server.SetGameMode(GameMode::Zombies);
    server.Zombies().StartRound();
    std::printf("Zombies round: %d, zombies remaining: %d\n",
                server.Zombies().GetRoundState().currentRound,
                server.Zombies().GetRoundState().zombiesRemaining);

    std::printf("Land/Space quests registered. Game server example run complete.\n");
    return 0;
}
