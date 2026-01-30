#include "Weapon.h"
#include <algorithm>
#include <cmath>

namespace game {

static const char* kWeaponNames[] = {
    "Iron Fist", "Stormbreaker", "Nightfall", "Dawnbreaker", "Void Edge",
    "Whisper", "Phantom", "Eclipse", "Serpent", "Viper",
    "Titan", "Colossus", "Hammer", "Anvil", "Bastion",
    "Longbow", "Shadowstrike", "Widow", "Oracle", "Sentinel",
    "Thunder", "Rage", "Breaker", "Warden", "Judge",
    "Sidewinder", "Ember", "Stinger", "Fury", "Apex",
    "Javelin", "Meteor", "Oblivion",
    "Scout", "Ranger", "Pathfinder", "Tracker",
    "Blade", "Hatchet", "Cleaver", "Scythe",
    "Nullifier", "Singularity", "Vortex", "Catalyst",
    "Vanguard", "Reaper", "Harbinger", "Spectre", "Nemesis"
};

static const WeaponCategory kWeaponCategories[] = {
    WeaponCategory::AssaultRifle, WeaponCategory::AssaultRifle, WeaponCategory::AssaultRifle, WeaponCategory::AssaultRifle, WeaponCategory::AssaultRifle,
    WeaponCategory::SMG, WeaponCategory::SMG, WeaponCategory::SMG, WeaponCategory::SMG, WeaponCategory::SMG,
    WeaponCategory::LMG, WeaponCategory::LMG, WeaponCategory::LMG, WeaponCategory::LMG, WeaponCategory::LMG,
    WeaponCategory::SniperRifle, WeaponCategory::SniperRifle, WeaponCategory::SniperRifle, WeaponCategory::SniperRifle, WeaponCategory::SniperRifle,
    WeaponCategory::Shotgun, WeaponCategory::Shotgun, WeaponCategory::Shotgun, WeaponCategory::Shotgun, WeaponCategory::Shotgun,
    WeaponCategory::Pistol, WeaponCategory::Pistol, WeaponCategory::Pistol, WeaponCategory::Pistol, WeaponCategory::Pistol,
    WeaponCategory::Launcher, WeaponCategory::Launcher, WeaponCategory::Launcher,
    WeaponCategory::MarksmanRifle, WeaponCategory::MarksmanRifle, WeaponCategory::MarksmanRifle, WeaponCategory::MarksmanRifle,
    WeaponCategory::Melee, WeaponCategory::Melee, WeaponCategory::Melee, WeaponCategory::Melee,
    WeaponCategory::Special, WeaponCategory::Special, WeaponCategory::Special, WeaponCategory::Special,
    WeaponCategory::AssaultRifle, WeaponCategory::SMG, WeaponCategory::LMG, WeaponCategory::SniperRifle, WeaponCategory::Special
};

static const char* kPrestigeCamoNames[] = {
    "Ember", "Void", "Aurora", "Prism", "Plasma", "Obsidian", "Chroma", "Nebula", "Eclipse", "Aether",
    "Inferno", "Abyss", "Polaris", "Spectrum", "Fusion", "Onyx", "Hologram", "Cosmos", "Umbra", "Ethereal",
    "Crimson", "Voidwalker", "Starlight", "Rainbow", "Ion", "Carbon", "Neon", "Galaxy", "Shadow", "Phantom",
    "Blaze", "Dark Matter", "Nova", "Prismatic", "Plasma Core", "Blackout", "Synthwave", "Orbit", "Dusk", "Spirit",
    "Scorch", "Event Horizon", "Solar", "Crystal", "Reactor", "Stealth", "Cyber", "Comet", "Twilight", "Ghost",
    "Magma", "Singularity", "Lunar", "Diamond", "Fission", "Midnight", "Retro", "Pulsar", "Dawn", "Wraith",
    "Inferno II", "Void II", "Aurora II", "Prism II", "Plasma II", "Obsidian II", "Chroma II", "Nebula II", "Eclipse II", "Aether II",
    "Flux", "Rift", "Zenith", "Vertex", "Catalyst", "Cipher", "Pulse", "Drift", "Veil", "Echo",
    "Voltage", "Gravity", "Frost", "Blaze II", "Core", "Cipher II", "Signal", "Drift II", "Mist", "Echo II",
    "Inferno X", "Void X", "Aurora X", "Prism X", "Plasma X", "Obsidian X", "Chroma X", "Nebula X", "Eclipse X", "Aether X"
};

static GradientStop MakeStop(uint8_t r, uint8_t g, uint8_t b, float pos) {
    GradientStop s;
    s.r = r; s.g = g; s.b = b; s.a = 255;
    s.position = pos;
    return s;
}

static void SetCamoGradient(PrestigeCamoDefinition& camo, int seed) {
    int w = (seed * 31) % 256;
    int x = (seed * 17 + 1) % 256;
    int y = (seed * 47 + 2) % 256;
    int z = (seed * 61 + 3) % 256;
    camo.stopCount = 3 + (seed % 3);
    camo.stops[0] = MakeStop(static_cast<uint8_t>(w), static_cast<uint8_t>(x % 256), static_cast<uint8_t>(y), 0.0f);
    camo.stops[1] = MakeStop(static_cast<uint8_t>(x), static_cast<uint8_t>(y), static_cast<uint8_t>(z), 0.5f);
    camo.stops[2] = MakeStop(static_cast<uint8_t>(y), static_cast<uint8_t>(z), static_cast<uint8_t>(w), 1.0f);
    if (camo.stopCount >= 4) {
        camo.stops[3] = MakeStop(static_cast<uint8_t>(z), static_cast<uint8_t>(w), static_cast<uint8_t>(x), 0.33f);
        camo.stops[4] = MakeStop(static_cast<uint8_t>((w + x) % 256), static_cast<uint8_t>((y + z) % 256), static_cast<uint8_t>((w + z) % 256), 0.66f);
    }
    if (camo.stopCount >= 6) {
        camo.stops[5] = MakeStop(static_cast<uint8_t>((seed * 7) % 256), static_cast<uint8_t>((seed * 11) % 256), static_cast<uint8_t>((seed * 13) % 256), 0.2f);
    }
}

void WeaponRegistry::RegisterWeapons() {
    for (WeaponId i = 1; i <= static_cast<WeaponId>(kWeaponCount); ++i) {
        WeaponDefinition w;
        w.id = i;
        w.name = kWeaponNames[i - 1];
        w.category = kWeaponCategories[i - 1];
        w.unlock.type = (i <= 10) ? WeaponUnlockType::Default : WeaponUnlockType::PlayerLevel;
        w.unlock.value = (i <= 10) ? 0 : static_cast<uint32_t>(std::min(55, (int)i + 5));
        weapons_[w.id] = std::move(w);
    }
}

void WeaponRegistry::RegisterPrestigeCamos() {
    PrestigeCamoId id = 1;
    for (WeaponId wid = 1; wid <= static_cast<WeaponId>(kWeaponCount); ++wid) {
        for (int prestige = 1; prestige <= kMaxPrestige; ++prestige) {
            PrestigeCamoDefinition camo;
            camo.id = id;
            camo.weaponId = wid;
            camo.prestigeLevel = prestige;
            int nameIdx = ((wid - 1) * 10 + (prestige - 1)) % (sizeof(kPrestigeCamoNames) / sizeof(kPrestigeCamoNames[0]));
            camo.name = std::string(kWeaponNames[wid - 1]) + " - " + kPrestigeCamoNames[nameIdx];
            SetCamoGradient(camo, static_cast<int>(wid * 100 + prestige * 10 + id));
            camo.animationType = static_cast<CamoAnimationType>((id - 1) % 10);
            camo.animationSpeed = 0.5f + (id % 10) * 0.1f;
            camo.animationParam = (id % 360) * 1.0f;
            prestigeCamos_[camo.id] = std::move(camo);
            weaponToCamos_[wid].push_back(id);
            ++id;
        }
    }
}

void WeaponRegistry::Init() {
    RegisterWeapons();
    RegisterPrestigeCamos();
}

const WeaponDefinition* WeaponRegistry::GetWeapon(WeaponId id) const {
    auto it = weapons_.find(id);
    return it != weapons_.end() ? &it->second : nullptr;
}

const PrestigeCamoDefinition* WeaponRegistry::GetPrestigeCamo(PrestigeCamoId id) const {
    auto it = prestigeCamos_.find(id);
    return it != prestigeCamos_.end() ? &it->second : nullptr;
}

const PrestigeCamoDefinition* WeaponRegistry::GetPrestigeCamoForWeapon(WeaponId weaponId, int prestigeLevel) const {
    auto wit = weaponToCamos_.find(weaponId);
    if (wit == weaponToCamos_.end()) return nullptr;
    size_t idx = static_cast<size_t>(prestigeLevel - 1);
    if (idx >= wit->second.size()) return nullptr;
    return GetPrestigeCamo(wit->second[idx]);
}

std::vector<WeaponId> WeaponRegistry::GetAllWeaponIds() const {
    std::vector<WeaponId> out;
    for (const auto& [id, w] : weapons_)
        out.push_back(id);
    std::sort(out.begin(), out.end());
    return out;
}

std::vector<PrestigeCamoDefinition> WeaponRegistry::GetPrestigeCamosForWeapon(WeaponId weaponId) const {
    std::vector<PrestigeCamoDefinition> out;
    auto wit = weaponToCamos_.find(weaponId);
    if (wit == weaponToCamos_.end()) return out;
    for (PrestigeCamoId cid : wit->second) {
        const PrestigeCamoDefinition* c = GetPrestigeCamo(cid);
        if (c) out.push_back(*c);
    }
    return out;
}

// ---------------------------------------------------------------------------
// Weapon Progression
// ---------------------------------------------------------------------------
int32_t WeaponProgression::XpRequiredForLevel(int level) const {
    return kXpPerLevel * level;
}

void WeaponProgression::RecalcXpToNext(WeaponProgressionState& state) const {
    state.xpToNextLevel = XpRequiredForLevel(state.level);
}

const WeaponProgressionState* WeaponProgression::GetState(PlayerId playerId, WeaponId weaponId) const {
    auto pit = playerWeapons_.find(playerId);
    if (pit == playerWeapons_.end()) return nullptr;
    auto wit = pit->second.find(weaponId);
    return wit != pit->second.end() ? &wit->second : nullptr;
}

WeaponProgressionState* WeaponProgression::GetOrCreateState(PlayerId playerId, WeaponId weaponId) {
    WeaponProgressionState& state = playerWeapons_[playerId][weaponId];
    if (state.weaponId == 0) {
        state.weaponId = weaponId;
        state.level = 1;
        state.prestige = 0;
        state.currentXp = 0;
        RecalcXpToNext(state);
    }
    return &state;
}

void WeaponProgression::AddWeaponXp(WeaponId weaponId, PlayerId playerId, int32_t xp) {
    WeaponProgressionState* state = GetOrCreateState(playerId, weaponId);
    if (state->prestige >= kMaxPrestige && state->level >= kWeaponMaxLevel) return;
    state->currentXp += xp;
    while (state->currentXp >= state->xpToNextLevel && (state->level < kWeaponMaxLevel || state->prestige < kMaxPrestige)) {
        state->currentXp -= state->xpToNextLevel;
        if (state->level < kWeaponMaxLevel) {
            ++state->level;
            RecalcXpToNext(*state);
        } else
            break;
    }
}

bool WeaponProgression::CanPrestige(WeaponId weaponId, PlayerId playerId) const {
    const WeaponProgressionState* state = GetState(playerId, weaponId);
    return state && state->level >= kWeaponMaxLevel && state->prestige < kMaxPrestige;
}

bool WeaponProgression::PrestigeWeapon(WeaponId weaponId, PlayerId playerId) {
    WeaponProgressionState* state = GetOrCreateState(playerId, weaponId);
    if (state->level < kWeaponMaxLevel || state->prestige >= kMaxPrestige) return false;
    state->level = 1;
    state->prestige++;
    state->currentXp = 0;
    RecalcXpToNext(*state);
    return true;
}

} // namespace game
