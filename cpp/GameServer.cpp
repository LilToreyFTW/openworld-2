#include "GameServer.h"

namespace game {

void GameServer::SetGameMode(GameMode mode) {
    if (currentMode_ == mode) return;
    ResetMultiplayerState();
    currentMode_ = mode;

    switch (mode) {
    case GameMode::TeamDeathmatch:
        tdm_.Reset();
        for (const auto& [pid, team] : players_)
            if (team != Team::None && team != Team::Spectator)
                tdm_.AddPlayer(pid, team);
        break;
    case GameMode::Domination:
        dom_.Reset();
        dom_.SetControlPoints(3);
        for (const auto& [pid, team] : players_)
            if (team != Team::None && team != Team::Spectator)
                dom_.AddPlayer(pid, team);
        break;
    case GameMode::CaptureTheFlag:
        ctf_.Reset();
        for (const auto& [pid, team] : players_)
            if (team != Team::None && team != Team::Spectator)
                ctf_.AddPlayer(pid, team);
        break;
    case GameMode::SearchAndDestroy:
        snd_.Reset();
        for (const auto& [pid, team] : players_)
            if (team != Team::None && team != Team::Spectator)
                snd_.AddPlayer(pid, team);
        break;
    case GameMode::Zombies:
        zombies_.Reset();
        for (const auto& [pid, team] : players_)
            zombies_.AddPlayer(pid);
        break;
    default:
        break;
    }
}

void GameServer::AddPlayer(PlayerId playerId, Team team) {
    players_[playerId] = team;

    if (currentMode_ == GameMode::TeamDeathmatch && team != Team::None && team != Team::Spectator)
        tdm_.AddPlayer(playerId, team);
    else if (currentMode_ == GameMode::Domination && team != Team::None && team != Team::Spectator)
        dom_.AddPlayer(playerId, team);
    else if (currentMode_ == GameMode::CaptureTheFlag && team != Team::None && team != Team::Spectator)
        ctf_.AddPlayer(playerId, team);
    else if (currentMode_ == GameMode::SearchAndDestroy && team != Team::None && team != Team::Spectator)
        snd_.AddPlayer(playerId, team);
    else if (currentMode_ == GameMode::Zombies)
        zombies_.AddPlayer(playerId);
}

void GameServer::RemovePlayer(PlayerId playerId) {
    players_.erase(playerId);
    tdm_.RemovePlayer(playerId);
    dom_.RemovePlayer(playerId);
    ctf_.RemovePlayer(playerId);
    snd_.RemovePlayer(playerId);
    zombies_.RemovePlayer(playerId);
}

void GameServer::SetPlayerTeam(PlayerId playerId, Team team) {
    auto it = players_.find(playerId);
    if (it == players_.end()) return;
    it->second = team;

    if (currentMode_ == GameMode::TeamDeathmatch) {
        tdm_.RemovePlayer(playerId);
        if (team != Team::None && team != Team::Spectator)
            tdm_.AddPlayer(playerId, team);
    } else if (currentMode_ == GameMode::Domination) {
        dom_.RemovePlayer(playerId);
        if (team != Team::None && team != Team::Spectator)
            dom_.AddPlayer(playerId, team);
    } else if (currentMode_ == GameMode::CaptureTheFlag) {
        ctf_.RemovePlayer(playerId);
        if (team != Team::None && team != Team::Spectator)
            ctf_.AddPlayer(playerId, team);
    } else if (currentMode_ == GameMode::SearchAndDestroy) {
        snd_.RemovePlayer(playerId);
        if (team != Team::None && team != Team::Spectator)
            snd_.AddPlayer(playerId, team);
    }
}

void GameServer::Tick(float deltaSec) {
    missions_.Tick(deltaSec);

    switch (currentMode_) {
    case GameMode::Domination:
        dom_.Tick(deltaSec);
        break;
    case GameMode::SearchAndDestroy:
        snd_.Tick(deltaSec);
        break;
    case GameMode::Zombies:
        zombies_.Tick(deltaSec);
        break;
    default:
        break;
    }
}

void GameServer::ResetMultiplayerState() {
    tdm_.Reset();
    dom_.Reset();
    ctf_.Reset();
    snd_.Reset();
    zombies_.Reset();
}

} // namespace game
