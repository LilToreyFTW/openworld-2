#pragma once

#include <cstdint>
#include <string>
#include <vector>

namespace game {

using PlayerId = uint32_t;
using TeamId = uint8_t;
using QuestId = uint32_t;
using MissionId = uint32_t;
using ObjectiveId = uint32_t;

// ---------------------------------------------------------------------------
// Multiplayer
// ---------------------------------------------------------------------------
enum class GameMode : uint8_t {
    None,
    TeamDeathmatch,
    Domination,
    CaptureTheFlag,
    SearchAndDestroy,
    Zombies
};

enum class Team : TeamId {
    None = 0,
    Alpha = 1,
    Bravo = 2,
    Spectator = 255
};

inline constexpr int kMaxTeams = 2;
inline constexpr int kTDMScoreLimit = 75;
inline constexpr int kDominationScoreLimit = 200;
inline constexpr int kCTFScoreLimit = 3;
inline constexpr int kSndRoundsToWin = 4;
inline constexpr float kDominationTickIntervalSec = 1.0f;
inline constexpr int kDominationPointsPerTick = 1;

// ---------------------------------------------------------------------------
// Quests
// ---------------------------------------------------------------------------
enum class QuestState : uint8_t {
    Locked,
    Available,
    InProgress,
    Completed,
    Failed
};

enum class QuestObjectiveType : uint8_t {
    Kill,
    Collect,
    ReachLocation,
    Interact,
    Deliver,
    SurviveRounds,
    WinMatches
};

struct QuestObjective {
    ObjectiveId id = 0;
    QuestObjectiveType type = QuestObjectiveType::Kill;
    int32_t current = 0;
    int32_t target = 0;
    std::string targetId;  // e.g. "zombie", "flag_capture"
    bool optional = false;
};

enum class QuestCategory : uint8_t {
    Land,
    OuterSpace
};

struct QuestDefinition {
    QuestId id = 0;
    QuestCategory category = QuestCategory::Land;
    std::string title;
    std::string description;
    std::vector<QuestObjective> objectives;
    int32_t rewardPoints = 0;
    QuestId prerequisiteQuestId = 0;
};

struct QuestProgress {
    QuestId questId = 0;
    QuestState state = QuestState::Locked;
    std::vector<QuestObjective> objectives;
    int64_t startedAt = 0;
    int64_t completedAt = 0;
};

// ---------------------------------------------------------------------------
// Missions
// ---------------------------------------------------------------------------
enum class MissionState : uint8_t {
    NotStarted,
    Active,
    ObjectiveComplete,
    Success,
    Failed
};

enum class MissionObjectiveType : uint8_t {
    EliminateAll,
    ReachZone,
    InteractWith,
    Defend,
    Escort,
    Timed
};

struct MissionObjective {
    ObjectiveId id = 0;
    MissionObjectiveType type = MissionObjectiveType::EliminateAll;
    int32_t progress = 0;
    int32_t target = 0;
    std::string targetTag;
    float timeLimitSec = 0.0f;
    bool completed = false;
};

struct MissionDefinition {
    MissionId id = 0;
    std::string title;
    std::string description;
    std::vector<MissionObjective> objectives;
    MissionId nextMissionId = 0;
};

struct MissionInstance {
    MissionId missionId = 0;
    MissionState state = MissionState::NotStarted;
    int32_t currentObjectiveIndex = 0;
    std::vector<MissionObjective> objectives;
    int64_t startedAt = 0;
};

// ---------------------------------------------------------------------------
// Search and Destroy
// ---------------------------------------------------------------------------
enum class SndPhase : uint8_t {
    PreRound,
    RoundActive,
    BombPlanted,
    PostRound
};

enum class BombState : uint8_t {
    Carried,
    Dropped,
    Planted,
    Defused,
    Exploded
};

// ---------------------------------------------------------------------------
// Zombies
// ---------------------------------------------------------------------------
enum class ZombieType : uint8_t {
    Walker,
    Runner,
    Brute,
    Boss
};

struct ZombieWaveConfig {
    int round = 1;
    int walkerCount = 0;
    int runnerCount = 0;
    int bruteCount = 0;
    bool bossSpawn = false;
    float healthMultiplier = 1.0f;
};

} // namespace game
