#include "Planets.h"
#include <algorithm>

namespace game {

static std::vector<PlanetDefinition> g_planets;

static void InitPlanets() {
    if (!g_planets.empty()) return;

    g_planets.push_back({
        kPlanetIdMaruno,
        "Maruno",
        PlanetType::OpenWorld,
        0, 0,
        ""
    });
    g_planets.push_back({
        kPlanetIdSasfire,
        "Sasfire",
        PlanetType::OpenWorld,
        0, 0,
        ""
    });
    g_planets.push_back({
        kPlanetIdDreadnaughtIX,
        "Dreadnaught IX",
        PlanetType::SpaceMap,
        0, 0,
        ""
    });
    g_planets.push_back({
        kPlanetIdDoomPatrolTower,
        "Doom Patrol Tower",
        PlanetType::Hub,
        0, 0,
        ""
    });
    g_planets.push_back({
        kPlanetIdHaveila,
        "Haveila",
        PlanetType::SpaceMap,
        kHaveilaWidth,
        kHaveilaHeight,
        kHaveilaSoundtrackPath
    });
    g_planets.push_back({
        kPlanetIdNexusPrime,
        "Nexus Prime",
        PlanetType::OpenWorld,
        0, 0,
        ""
    });
    g_planets.push_back({
        kPlanetIdVoidsEdge,
        "Void's Edge",
        PlanetType::SpaceMap,
        0, 0,
        ""
    });
}

const std::vector<PlanetDefinition>& GetPlanets() {
    InitPlanets();
    return g_planets;
}

} // namespace game
