#pragma once

#include "GameTypes.h"
#include "WeaponTypes.h"
#include <vector>
#include <unordered_map>

namespace game {

class WeaponRegistry {
public:
    WeaponRegistry() { Init(); }

    void Init();  // register 50 weapons + 500 prestige camos

    const WeaponDefinition* GetWeapon(WeaponId id) const;
    const PrestigeCamoDefinition* GetPrestigeCamo(PrestigeCamoId id) const;
    const PrestigeCamoDefinition* GetPrestigeCamoForWeapon(WeaponId weaponId, int prestigeLevel) const;
    std::vector<WeaponId> GetAllWeaponIds() const;
    std::vector<PrestigeCamoDefinition> GetPrestigeCamosForWeapon(WeaponId weaponId) const;

    static constexpr int kWeaponCount = 50;
    static constexpr int kPrestigeCamoCount = 500;  // 50 * 10

private:
    void RegisterWeapons();
    void RegisterPrestigeCamos();

    std::unordered_map<WeaponId, WeaponDefinition> weapons_;
    std::unordered_map<PrestigeCamoId, PrestigeCamoDefinition> prestigeCamos_;
    std::unordered_map<WeaponId, std::vector<PrestigeCamoId>> weaponToCamos_;
};

// ---------------------------------------------------------------------------
// Weapon level & prestige progression: 55 levels, 10 prestiges, camo per prestige
// ---------------------------------------------------------------------------
struct WeaponProgressionState {
    WeaponId weaponId = 0;
    int level = 1;
    int prestige = 0;
    int32_t currentXp = 0;
    int32_t xpToNextLevel = 0;
};

class WeaponProgression {
public:
    void AddWeaponXp(WeaponId weaponId, PlayerId playerId, int32_t xp);
    bool CanPrestige(WeaponId weaponId, PlayerId playerId) const;
    bool PrestigeWeapon(WeaponId weaponId, PlayerId playerId);
    int32_t XpRequiredForLevel(int level) const;

    const WeaponProgressionState* GetState(PlayerId playerId, WeaponId weaponId) const;
    WeaponProgressionState* GetOrCreateState(PlayerId playerId, WeaponId weaponId);

private:
    void RecalcXpToNext(WeaponProgressionState& state) const;

    std::unordered_map<PlayerId, std::unordered_map<WeaponId, WeaponProgressionState>> playerWeapons_;
};

} // namespace game
