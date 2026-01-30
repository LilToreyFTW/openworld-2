#pragma once

#include "GameTypes.h"
#include <unordered_map>
#include <vector>
#include <functional>

namespace game {

struct ZombieInstance {
    uint32_t id = 0;
    ZombieType type = ZombieType::Walker;
    float health = 100.0f;
    float maxHealth = 100.0f;
    bool alive = true;
};

struct ZombiesRoundState {
    int currentRound = 0;
    int zombiesSpawnedThisRound = 0;
    int zombiesKilledThisRound = 0;
    int zombiesRemaining = 0;
    bool roundActive = false;
    bool roundComplete = false;
    float roundStartTime = 0.0f;
};

struct ZombiesPlayerState {
    PlayerId playerId = 0;
    int32_t points = 0;
    int32_t lives = 3;
    bool alive = true;
    bool downed = false;
};

class ZombiesMode {
public:
    using RoundEventCallback = std::function<void(int round, bool started)>;
    using ZombieKillCallback = std::function<void(PlayerId killerId, uint32_t zombieId, ZombieType type, int32_t points)>;

    ZombiesMode() = default;

    void Reset();
    void AddPlayer(PlayerId playerId);
    void RemovePlayer(PlayerId playerId);
    void StartRound();
    void Tick(float deltaSec);

    void OnZombieKilled(uint32_t zombieId, PlayerId killerId);
    void OnPlayerDowned(PlayerId playerId);
    void OnPlayerRevived(PlayerId playerId);
    void OnPlayerDied(PlayerId playerId);

    void AddPoints(PlayerId playerId, int32_t points);
    bool SpendPoints(PlayerId playerId, int32_t cost);

    const ZombiesRoundState& GetRoundState() const { return roundState_; }
    const ZombieInstance* GetZombie(uint32_t zombieId) const;
    std::vector<ZombieInstance> GetAliveZombies() const;
    const ZombiesPlayerState* GetPlayerState(PlayerId playerId) const;
    ZombieWaveConfig GetWaveConfig(int round) const;

    void SetRoundEventCallback(RoundEventCallback cb) { onRoundEvent_ = std::move(cb); }
    void SetZombieKillCallback(ZombieKillCallback cb) { onZombieKill_ = std::move(cb); }

private:
    void SpawnWave();
    void SpawnZombie(ZombieType type, float healthMultiplier);
    int32_t PointsForZombie(ZombieType type, int round) const;
    void CheckRoundComplete();

    uint32_t nextZombieId_ = 1;
    ZombiesRoundState roundState_;
    std::unordered_map<PlayerId, ZombiesPlayerState> players_;
    std::unordered_map<uint32_t, ZombieInstance> zombies_;
    RoundEventCallback onRoundEvent_;
    ZombieKillCallback onZombieKill_;
};

} // namespace game
