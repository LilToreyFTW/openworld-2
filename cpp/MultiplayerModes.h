#pragma once

#include "GameTypes.h"
#include <unordered_map>
#include <vector>
#include <functional>

namespace game {

// ---------------------------------------------------------------------------
// Team Deathmatch
// ---------------------------------------------------------------------------
struct TDMState {
    std::unordered_map<Team, int32_t> teamScores;
    std::unordered_map<PlayerId, Team> playerTeams;
    bool gameOver = false;
    Team winningTeam = Team::None;
};

class TeamDeathmatch {
public:
    void Reset();
    void AddPlayer(PlayerId playerId, Team team);
    void RemovePlayer(PlayerId playerId);
    void OnKill(PlayerId killerId, PlayerId victimId);
    const TDMState& GetState() const { return state_; }
    bool IsGameOver() const { return state_.gameOver; }

private:
    void CheckWinCondition();

    TDMState state_;
};

// ---------------------------------------------------------------------------
// Domination (control points)
// ---------------------------------------------------------------------------
constexpr int kMaxControlPoints = 5;

struct ControlPoint {
    int32_t id = 0;
    Team owner = Team::None;
    float captureProgress = 0.0f;  // 0 = neutral, 1 = fully captured
    Team contestingTeam = Team::None;
};

struct DominationState {
    std::vector<ControlPoint> points;
    std::unordered_map<Team, int32_t> teamScores;
    std::unordered_map<PlayerId, Team> playerTeams;
    std::unordered_map<PlayerId, int32_t> playerOnPoint;  // point id or -1
    float tickAccumulator = 0.0f;
    bool gameOver = false;
    Team winningTeam = Team::None;
};

class Domination {
public:
    void Reset();
    void SetControlPoints(int count);
    void AddPlayer(PlayerId playerId, Team team);
    void RemovePlayer(PlayerId playerId);
    void SetPlayerOnPoint(PlayerId playerId, int32_t pointId);
    void Tick(float deltaSec);
    const DominationState& GetState() const { return state_; }
    bool IsGameOver() const { return state_.gameOver; }

private:
    void UpdateCapture(int32_t pointId, Team team, float deltaSec);
    void CheckWinCondition();

    DominationState state_;
};

// ---------------------------------------------------------------------------
// Capture The Flag
// ---------------------------------------------------------------------------
struct FlagState {
    Team team;
    bool atBase = true;
    PlayerId carrierId = 0;
    float returnTimerSec = 0.0f;
};

struct CTFState {
    std::unordered_map<Team, FlagState> flags;
    std::unordered_map<Team, int32_t> teamScores;
    std::unordered_map<PlayerId, Team> playerTeams;
    bool gameOver = false;
    Team winningTeam = Team::None;
};

class CaptureTheFlag {
public:
    void Reset();
    void AddPlayer(PlayerId playerId, Team team);
    void RemovePlayer(PlayerId playerId);
    void PickupFlag(PlayerId playerId, Team flagTeam);
    void CaptureFlag(PlayerId playerId);
    void DropFlag(PlayerId playerId);
    void ReturnFlag(Team team);
    const CTFState& GetState() const { return state_; }
    bool IsGameOver() const { return state_.gameOver; }

private:
    void CheckWinCondition();

    CTFState state_;
};

// ---------------------------------------------------------------------------
// Search and Destroy
// ---------------------------------------------------------------------------
struct SndRoundState {
    int roundNumber = 0;
    SndPhase phase = SndPhase::PreRound;
    float phaseTimerSec = 0.0f;
    BombState bombState = BombState::Carried;
    PlayerId bombCarrierId = 0;
    Team plantingTeam = Team::None;
    float plantDefuseTimerSec = 0.0f;
    std::unordered_map<Team, int32_t> roundsWon;
    std::unordered_map<PlayerId, Team> playerTeams;
    std::unordered_map<PlayerId, bool> playerAlive;
    Team roundWinner = Team::None;
};

inline constexpr float kSndPreRoundSec = 5.0f;
inline constexpr float kSndRoundDurationSec = 120.0f;
inline constexpr float kSndPlantTimeSec = 5.0f;
inline constexpr float kSndDefuseTimeSec = 7.0f;
inline constexpr float kSndBombExplodeSec = 45.0f;

class SearchAndDestroy {
public:
    void Reset();
    void AddPlayer(PlayerId playerId, Team team);
    void RemovePlayer(PlayerId playerId);
    void StartRound();
    void Tick(float deltaSec);
    void OnPlayerKilled(PlayerId victimId);
    void OnBombPlanted(PlayerId planterId);
    void OnBombDefused(PlayerId defuserId);
    void OnBombDropped(PlayerId carrierId);
    void OnBombPickedUp(PlayerId playerId);
    const SndRoundState& GetState() const { return state_; }
    bool IsMatchOver() const;

private:
    void NextPhase();
    void EndRound(Team winner);
    void CheckAliveCondition();

    SndRoundState state_;
};

} // namespace game
