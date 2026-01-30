#pragma once

#include <cstdint>
#include <string>
#include <vector>

namespace game {

using PlanetId = uint32_t;

enum class PlanetType : uint8_t {
    Hub,
    Mission,
    OpenWorld,
    SpaceMap
};

struct PlanetDefinition {
    PlanetId id = 0;
    std::string name;
    PlanetType type = PlanetType::OpenWorld;
    int32_t width = 0;
    int32_t height = 0;
    std::string soundtrackPath;
};

// 7 Planets: 1 Maruno, 2 Sasfire, 3 Dreadnaught IX, 4 Doom Patrol Tower (hub), 5 Haveila, 6 Nexus Prime, 7 Void's Edge
inline constexpr PlanetId kPlanetIdMaruno = 1;
inline constexpr PlanetId kPlanetIdSasfire = 2;
inline constexpr PlanetId kPlanetIdDreadnaughtIX = 3;
inline constexpr PlanetId kPlanetIdDoomPatrolTower = 4;  // TOWER HUB — first area after Doom Patrol Mission (intro)
inline constexpr PlanetId kPlanetIdHaveila = 5;
inline constexpr PlanetId kPlanetIdNexusPrime = 6;
inline constexpr PlanetId kPlanetIdVoidsEdge = 7;

// Intro flow: Character Creation → Doom Patrol Mission (intro) → Doom Patrol Tower (hub / gatherings area)
inline constexpr PlanetId kFirstHubPlanetId = kPlanetIdDoomPatrolTower;

// Haveila: lava space planet — dimensions and main game soundtrack
inline constexpr int kHaveilaWidth = 2560;
inline constexpr int kHaveilaHeight = 1080;
inline constexpr const char* kHaveilaSoundtrackPath = "game-soundtrack/Haveila(dreadnaught spacemap animated).mp3";
inline constexpr const char* kMainGameSoundtrackPath = "game-soundtrack/Haveila(dreadnaught spacemap animated).mp3";

const std::vector<PlanetDefinition>& GetPlanets();

} // namespace game
