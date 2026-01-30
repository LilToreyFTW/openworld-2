#pragma once

#include "GameTypes.h"
#include "Quest.h"
#include "Mission.h"
#include "MultiplayerModes.h"
#include "Zombies.h"
#include <memory>
#include <unordered_map>
#include <string>

namespace game {

class GameServer {
public:
    GameServer() = default;

    // ---- Quests ----
    QuestSystem& Quests() { return quests_; }
    const QuestSystem& Quests() const { return quests_; }

    // ---- Missions ----
    MissionSystem& Missions() { return missions_; }
    const MissionSystem& Missions() const { return missions_; }

    // ---- Multiplayer ----
    void SetGameMode(GameMode mode);
    GameMode GetGameMode() const { return currentMode_; }

    TeamDeathmatch& TDM() { return tdm_; }
    const TeamDeathmatch& TDM() const { return tdm_; }

    Domination& Dom() { return dom_; }
    const Domination& Dom() const { return dom_; }

    CaptureTheFlag& CTF() { return ctf_; }
    const CaptureTheFlag& CTF() const { return ctf_; }

    SearchAndDestroy& SND() { return snd_; }
    const SearchAndDestroy& SND() const { return snd_; }

    ZombiesMode& Zombies() { return zombies_; }
    const ZombiesMode& Zombies() const { return zombies_; }

    void AddPlayer(PlayerId playerId, Team team = Team::None);
    void RemovePlayer(PlayerId playerId);
    void SetPlayerTeam(PlayerId playerId, Team team);

    void Tick(float deltaSec);

private:
    void ResetMultiplayerState();

    GameMode currentMode_ = GameMode::None;
    std::unordered_map<PlayerId, Team> players_;

    QuestSystem quests_;
    MissionSystem missions_;

    TeamDeathmatch tdm_;
    Domination dom_;
    CaptureTheFlag ctf_;
    SearchAndDestroy snd_;
    ZombiesMode zombies_;
};

} // namespace game
