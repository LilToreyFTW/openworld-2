#include "Zombies.h"
#include <algorithm>
#include <cmath>

namespace game {

namespace {

constexpr float kWalkerBaseHealth = 100.0f;
constexpr float kRunnerBaseHealth = 75.0f;
constexpr float kBruteBaseHealth = 400.0f;
constexpr float kBossBaseHealth = 2000.0f;
constexpr int kWalkerPoints = 60;
constexpr int kRunnerPoints = 90;
constexpr int kBrutePoints = 250;
constexpr int kBossPoints = 1500;
constexpr float kHealthPerRound = 1.1f;

} // namespace

void ZombiesMode::Reset() {
    nextZombieId_ = 1;
    roundState_ = ZombiesRoundState{};
    zombies_.clear();
    for (auto& [p, ps] : players_) {
        ps.points = 0;
        ps.lives = 3;
        ps.alive = true;
        ps.downed = false;
    }
}

void ZombiesMode::AddPlayer(PlayerId playerId) {
    ZombiesPlayerState ps;
    ps.playerId = playerId;
    ps.points = 0;
    ps.lives = 3;
    ps.alive = true;
    ps.downed = false;
    players_[playerId] = std::move(ps);
}

void ZombiesMode::RemovePlayer(PlayerId playerId) {
    players_.erase(playerId);
}

ZombieWaveConfig ZombiesMode::GetWaveConfig(int round) const {
    ZombieWaveConfig cfg;
    cfg.round = round;
    cfg.healthMultiplier = std::pow(kHealthPerRound, static_cast<float>(round - 1));

    int total = 6 + round * 2;
    total = std::min(total, 50 + (round - 10) * 2);
    total = std::max(total, 6);

    cfg.walkerCount = static_cast<int>(total * 0.7f);
    cfg.runnerCount = static_cast<int>(total * 0.25f);
    cfg.bruteCount = round >= 3 ? std::min(round / 2, 5) : 0;
    cfg.bossSpawn = (round % 5 == 0 && round >= 5);

    return cfg;
}

void ZombiesMode::SpawnZombie(ZombieType type, float healthMultiplier) {
    ZombieInstance z;
    z.id = nextZombieId_++;
    z.type = type;
    z.alive = true;

    switch (type) {
    case ZombieType::Walker:
        z.maxHealth = kWalkerBaseHealth * healthMultiplier;
        break;
    case ZombieType::Runner:
        z.maxHealth = kRunnerBaseHealth * healthMultiplier;
        break;
    case ZombieType::Brute:
        z.maxHealth = kBruteBaseHealth * healthMultiplier;
        break;
    case ZombieType::Boss:
        z.maxHealth = kBossBaseHealth * healthMultiplier;
        break;
    }
    z.health = z.maxHealth;
    zombies_[z.id] = std::move(z);
    roundState_.zombiesSpawnedThisRound++;
    roundState_.zombiesRemaining++;
}

void ZombiesMode::SpawnWave() {
    ZombieWaveConfig cfg = GetWaveConfig(roundState_.currentRound);

    for (int i = 0; i < cfg.walkerCount; ++i)
        SpawnZombie(ZombieType::Walker, cfg.healthMultiplier);
    for (int i = 0; i < cfg.runnerCount; ++i)
        SpawnZombie(ZombieType::Runner, cfg.healthMultiplier);
    for (int i = 0; i < cfg.bruteCount; ++i)
        SpawnZombie(ZombieType::Brute, cfg.healthMultiplier);
    if (cfg.bossSpawn)
        SpawnZombie(ZombieType::Boss, cfg.healthMultiplier);
}

void ZombiesMode::StartRound() {
    roundState_.currentRound++;
    roundState_.zombiesSpawnedThisRound = 0;
    roundState_.zombiesKilledThisRound = 0;
    roundState_.zombiesRemaining = 0;
    roundState_.roundActive = true;
    roundState_.roundComplete = false;

    SpawnWave();

    if (onRoundEvent_)
        onRoundEvent_(roundState_.currentRound, true);
}

void ZombiesMode::Tick(float deltaSec) {
    (void)deltaSec;
    CheckRoundComplete();
}

void ZombiesMode::CheckRoundComplete() {
    if (!roundState_.roundActive) return;
    if (roundState_.zombiesRemaining > 0) return;

    roundState_.roundComplete = true;
    roundState_.roundActive = false;

    if (onRoundEvent_)
        onRoundEvent_(roundState_.currentRound, false);
}

void ZombiesMode::OnZombieKilled(uint32_t zombieId, PlayerId killerId) {
    const ZombieInstance* z = GetZombie(zombieId);
    if (!z || !z->alive) return;

    int32_t points = PointsForZombie(z->type, roundState_.currentRound);
    AddPoints(killerId, points);

    zombies_.erase(zombieId);
    roundState_.zombiesKilledThisRound++;
    roundState_.zombiesRemaining--;

    if (onZombieKill_)
        onZombieKill_(killerId, zombieId, z->type, points);

    CheckRoundComplete();
}

int32_t ZombiesMode::PointsForZombie(ZombieType type, int round) const {
    int base = 0;
    switch (type) {
    case ZombieType::Walker:  base = kWalkerPoints; break;
    case ZombieType::Runner:  base = kRunnerPoints; break;
    case ZombieType::Brute:  base = kBrutePoints; break;
    case ZombieType::Boss:   base = kBossPoints; break;
    }
    return base + round * 10;
}

void ZombiesMode::OnPlayerDowned(PlayerId playerId) {
    auto it = players_.find(playerId);
    if (it == players_.end() || !it->second.alive) return;
    it->second.downed = true;
}

void ZombiesMode::OnPlayerRevived(PlayerId playerId) {
    auto it = players_.find(playerId);
    if (it == players_.end()) return;
    it->second.downed = false;
}

void ZombiesMode::OnPlayerDied(PlayerId playerId) {
    auto it = players_.find(playerId);
    if (it == players_.end()) return;
    it->second.lives--;
    it->second.alive = (it->second.lives > 0);
    it->second.downed = false;
}

void ZombiesMode::AddPoints(PlayerId playerId, int32_t points) {
    auto it = players_.find(playerId);
    if (it != players_.end())
        it->second.points += points;
}

bool ZombiesMode::SpendPoints(PlayerId playerId, int32_t cost) {
    auto it = players_.find(playerId);
    if (it == players_.end() || it->second.points < cost) return false;
    it->second.points -= cost;
    return true;
}

const ZombieInstance* ZombiesMode::GetZombie(uint32_t zombieId) const {
    auto it = zombies_.find(zombieId);
    return it != zombies_.end() ? &it->second : nullptr;
}

std::vector<ZombieInstance> ZombiesMode::GetAliveZombies() const {
    std::vector<ZombieInstance> out;
    for (const auto& [id, z] : zombies_)
        if (z.alive)
            out.push_back(z);
    return out;
}

const ZombiesPlayerState* ZombiesMode::GetPlayerState(PlayerId playerId) const {
    auto it = players_.find(playerId);
    return it != players_.end() ? &it->second : nullptr;
}

} // namespace game
