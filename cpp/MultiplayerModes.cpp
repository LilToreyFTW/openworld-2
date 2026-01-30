#include "MultiplayerModes.h"
#include <algorithm>

namespace game {

// ---------------------------------------------------------------------------
// Team Deathmatch
// ---------------------------------------------------------------------------
void TeamDeathmatch::Reset() {
    state_ = TDMState{};
    state_.teamScores[Team::Alpha] = 0;
    state_.teamScores[Team::Bravo] = 0;
}

void TeamDeathmatch::AddPlayer(PlayerId playerId, Team team) {
    if (team == Team::None || team == Team::Spectator) return;
    state_.playerTeams[playerId] = team;
}

void TeamDeathmatch::RemovePlayer(PlayerId playerId) {
    state_.playerTeams.erase(playerId);
}

void TeamDeathmatch::OnKill(PlayerId killerId, PlayerId victimId) {
    (void)victimId;
    if (state_.gameOver) return;
    auto kit = state_.playerTeams.find(killerId);
    if (kit == state_.playerTeams.end() || kit->second == Team::None) return;
    state_.teamScores[kit->second]++;
    CheckWinCondition();
}

void TeamDeathmatch::CheckWinCondition() {
    int alpha = state_.teamScores[Team::Alpha];
    int bravo = state_.teamScores[Team::Bravo];
    if (alpha >= kTDMScoreLimit || bravo >= kTDMScoreLimit) {
        state_.gameOver = true;
        state_.winningTeam = alpha >= kTDMScoreLimit ? Team::Alpha : Team::Bravo;
    }
}

// ---------------------------------------------------------------------------
// Domination
// ---------------------------------------------------------------------------
void Domination::Reset() {
    state_ = DominationState{};
    state_.teamScores[Team::Alpha] = 0;
    state_.teamScores[Team::Bravo] = 0;
}

void Domination::SetControlPoints(int count) {
    count = std::clamp(count, 1, kMaxControlPoints);
    state_.points.clear();
    state_.points.resize(static_cast<size_t>(count));
    for (int i = 0; i < count; ++i) {
        state_.points[static_cast<size_t>(i)].id = i;
    }
}

void Domination::AddPlayer(PlayerId playerId, Team team) {
    if (team == Team::None || team == Team::Spectator) return;
    state_.playerTeams[playerId] = team;
    state_.playerOnPoint[playerId] = -1;
}

void Domination::RemovePlayer(PlayerId playerId) {
    state_.playerTeams.erase(playerId);
    state_.playerOnPoint.erase(playerId);
}

void Domination::SetPlayerOnPoint(PlayerId playerId, int32_t pointId) {
    state_.playerOnPoint[playerId] = pointId;
}

void Domination::UpdateCapture(int32_t pointId, Team team, float deltaSec) {
    if (pointId < 0 || static_cast<size_t>(pointId) >= state_.points.size()) return;
    ControlPoint& pt = state_.points[static_cast<size_t>(pointId)];

    if (pt.owner == team) {
        pt.captureProgress = std::min(1.0f, pt.captureProgress + deltaSec * 0.3f);
        return;
    }

    pt.contestingTeam = team;
    pt.captureProgress += deltaSec * 0.2f;
    if (pt.captureProgress >= 1.0f) {
        pt.captureProgress = 1.0f;
        pt.owner = team;
        pt.contestingTeam = Team::None;
    }
}

void Domination::Tick(float deltaSec) {
    if (state_.gameOver) return;

    state_.tickAccumulator += deltaSec;
    while (state_.tickAccumulator >= kDominationTickIntervalSec) {
        state_.tickAccumulator -= kDominationTickIntervalSec;
        for (const auto& pt : state_.points) {
            if (pt.owner == Team::Alpha)
                state_.teamScores[Team::Alpha] += kDominationPointsPerTick;
            else if (pt.owner == Team::Bravo)
                state_.teamScores[Team::Bravo] += kDominationPointsPerTick;
        }
        CheckWinCondition();
    }

    for (const auto& [playerId, pointId] : state_.playerOnPoint) {
        if (pointId < 0) continue;
        auto tit = state_.playerTeams.find(playerId);
        if (tit == state_.playerTeams.end() || tit->second == Team::None) continue;
        UpdateCapture(pointId, tit->second, deltaSec);
    }
}

void Domination::CheckWinCondition() {
    int alpha = state_.teamScores[Team::Alpha];
    int bravo = state_.teamScores[Team::Bravo];
    if (alpha >= kDominationScoreLimit || bravo >= kDominationScoreLimit) {
        state_.gameOver = true;
        state_.winningTeam = alpha >= kDominationScoreLimit ? Team::Alpha : Team::Bravo;
    }
}

// ---------------------------------------------------------------------------
// Capture The Flag
// ---------------------------------------------------------------------------
void CaptureTheFlag::Reset() {
    state_ = CTFState{};
    state_.teamScores[Team::Alpha] = 0;
    state_.teamScores[Team::Bravo] = 0;
    state_.flags[Team::Alpha] = FlagState{ Team::Alpha, true, 0, 0.0f };
    state_.flags[Team::Bravo] = FlagState{ Team::Bravo, true, 0, 0.0f };
}

void CaptureTheFlag::AddPlayer(PlayerId playerId, Team team) {
    if (team == Team::None || team == Team::Spectator) return;
    state_.playerTeams[playerId] = team;
}

void CaptureTheFlag::RemovePlayer(PlayerId playerId) {
    state_.playerTeams.erase(playerId);
    for (auto& [t, flag] : state_.flags) {
        (void)t;
        if (flag.carrierId == playerId) {
            flag.carrierId = 0;
            flag.atBase = false;
            flag.returnTimerSec = 30.0f;
        }
    }
}

void CaptureTheFlag::PickupFlag(PlayerId playerId, Team flagTeam) {
    if (state_.gameOver) return;
    auto fit = state_.flags.find(flagTeam);
    if (fit == state_.flags.end() || !fit->second.atBase) return;
    auto pit = state_.playerTeams.find(playerId);
    if (pit == state_.playerTeams.end() || pit->second == flagTeam) return;
    fit->second.atBase = false;
    fit->second.carrierId = playerId;
}

void CaptureTheFlag::CaptureFlag(PlayerId playerId) {
    if (state_.gameOver) return;
    auto pit = state_.playerTeams.find(playerId);
    if (pit == state_.playerTeams.end()) return;
    Team playerTeam = pit->second;
    auto fit = state_.flags.find(playerTeam);
    if (fit == state_.flags.end() || !fit->second.atBase) return;

    auto efit = state_.flags.find(playerTeam == Team::Alpha ? Team::Bravo : Team::Alpha);
    if (efit == state_.flags.end() || efit->second.carrierId != playerId) return;

    efit->second.carrierId = 0;
    efit->second.atBase = true;
    state_.teamScores[playerTeam]++;
    CheckWinCondition();
}

void CaptureTheFlag::DropFlag(PlayerId playerId) {
    for (auto& [t, flag] : state_.flags) {
        (void)t;
        if (flag.carrierId == playerId) {
            flag.carrierId = 0;
            flag.atBase = false;
            flag.returnTimerSec = 30.0f;
            return;
        }
    }
}

void CaptureTheFlag::ReturnFlag(Team team) {
    auto it = state_.flags.find(team);
    if (it != state_.flags.end()) {
        it->second.atBase = true;
        it->second.carrierId = 0;
        it->second.returnTimerSec = 0.0f;
    }
}

void CaptureTheFlag::CheckWinCondition() {
    int alpha = state_.teamScores[Team::Alpha];
    int bravo = state_.teamScores[Team::Bravo];
    if (alpha >= kCTFScoreLimit || bravo >= kCTFScoreLimit) {
        state_.gameOver = true;
        state_.winningTeam = alpha >= kCTFScoreLimit ? Team::Alpha : Team::Bravo;
    }
}

// ---------------------------------------------------------------------------
// Search and Destroy
// ---------------------------------------------------------------------------
void SearchAndDestroy::Reset() {
    state_ = SndRoundState{};
    state_.roundsWon[Team::Alpha] = 0;
    state_.roundsWon[Team::Bravo] = 0;
}

void SearchAndDestroy::AddPlayer(PlayerId playerId, Team team) {
    if (team == Team::None || team == Team::Spectator) return;
    state_.playerTeams[playerId] = team;
    state_.playerAlive[playerId] = false;
}

void SearchAndDestroy::RemovePlayer(PlayerId playerId) {
    state_.playerTeams.erase(playerId);
    state_.playerAlive.erase(playerId);
    if (state_.bombCarrierId == playerId)
        state_.bombCarrierId = 0;
}

void SearchAndDestroy::StartRound() {
    state_.roundNumber++;
    state_.phase = SndPhase::PreRound;
    state_.phaseTimerSec = kSndPreRoundSec;
    state_.bombState = BombState::Carried;
    state_.bombCarrierId = 0;
    state_.plantingTeam = Team::None;
    state_.plantDefuseTimerSec = 0.0f;
    state_.roundWinner = Team::None;
    for (auto& [p, alive] : state_.playerAlive)
        alive = true;
}

void SearchAndDestroy::NextPhase() {
    switch (state_.phase) {
    case SndPhase::PreRound:
        state_.phase = SndPhase::RoundActive;
        state_.phaseTimerSec = kSndRoundDurationSec;
        break;
    case SndPhase::RoundActive:
        break;
    case SndPhase::BombPlanted:
        break;
    case SndPhase::PostRound:
        break;
    }
}

void SearchAndDestroy::EndRound(Team winner) {
    state_.phase = SndPhase::PostRound;
    state_.roundWinner = winner;
    if (winner != Team::None)
        state_.roundsWon[winner]++;
}

bool SearchAndDestroy::IsMatchOver() const {
    return state_.roundsWon.at(Team::Alpha) >= kSndRoundsToWin ||
           state_.roundsWon.at(Team::Bravo) >= kSndRoundsToWin;
}

void SearchAndDestroy::CheckAliveCondition() {
    int alphaAlive = 0, bravoAlive = 0;
    for (const auto& [pid, alive] : state_.playerAlive) {
        if (!alive) continue;
        auto it = state_.playerTeams.find(pid);
        if (it == state_.playerTeams.end()) continue;
        if (it->second == Team::Alpha) alphaAlive++;
        else if (it->second == Team::Bravo) bravoAlive++;
    }
    if (state_.phase == SndPhase::RoundActive || state_.phase == SndPhase::BombPlanted) {
        if (alphaAlive == 0) EndRound(Team::Bravo);
        else if (bravoAlive == 0) EndRound(Team::Alpha);
    }
}

void SearchAndDestroy::Tick(float deltaSec) {
    state_.phaseTimerSec -= deltaSec;

    if (state_.phase == SndPhase::PreRound) {
        if (state_.phaseTimerSec <= 0.0f)
            NextPhase();
        return;
    }

    if (state_.phase == SndPhase::BombPlanted) {
        state_.plantDefuseTimerSec -= deltaSec;
        if (state_.phaseTimerSec <= 0.0f) {
            state_.bombState = BombState::Exploded;
            EndRound(state_.plantingTeam);
        }
        return;
    }

    if (state_.phase == SndPhase::RoundActive && state_.phaseTimerSec <= 0.0f) {
        EndRound(Team::Bravo);
        return;
    }
}

void SearchAndDestroy::OnPlayerKilled(PlayerId victimId) {
    state_.playerAlive[victimId] = false;
    if (state_.bombCarrierId == victimId) {
        state_.bombCarrierId = 0;
        state_.bombState = BombState::Dropped;
    }
    CheckAliveCondition();
}

void SearchAndDestroy::OnBombPlanted(PlayerId planterId) {
    auto it = state_.playerTeams.find(planterId);
    if (it == state_.playerTeams.end()) return;
    state_.phase = SndPhase::BombPlanted;
    state_.bombState = BombState::Planted;
    state_.bombCarrierId = 0;
    state_.plantingTeam = it->second;
    state_.phaseTimerSec = kSndBombExplodeSec;
}

void SearchAndDestroy::OnBombDefused(PlayerId defuserId) {
    state_.bombState = BombState::Defused;
    auto it = state_.playerTeams.find(defuserId);
    EndRound(it != state_.playerTeams.end() ? it->second : Team::None);
}

void SearchAndDestroy::OnBombDropped(PlayerId carrierId) {
    if (state_.bombCarrierId == carrierId) {
        state_.bombCarrierId = 0;
        state_.bombState = BombState::Dropped;
    }
}

void SearchAndDestroy::OnBombPickedUp(PlayerId playerId) {
    state_.bombCarrierId = playerId;
    state_.bombState = BombState::Carried;
}

} // namespace game
