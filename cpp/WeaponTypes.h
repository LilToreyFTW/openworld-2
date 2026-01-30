#pragma once

#include <cstdint>
#include <string>

namespace game {

using WeaponId = uint32_t;
using PrestigeCamoId = uint32_t;

// ---------------------------------------------------------------------------
// Weapon categories
// ---------------------------------------------------------------------------
enum class WeaponCategory : uint8_t {
    AssaultRifle,
    SMG,
    LMG,
    SniperRifle,
    Shotgun,
    Pistol,
    Launcher,
    MarksmanRifle,
    Melee,
    Special
};

// ---------------------------------------------------------------------------
// Unlock condition for default / unlockable weapons
// ---------------------------------------------------------------------------
enum class WeaponUnlockType : uint8_t {
    Default,           // available from start
    PlayerLevel,       // unlock at player level N
    QuestComplete,     // complete quest id
    MissionComplete,   // complete mission id
    PrestigeWeapon,    // unlock via weapon prestige
    Challenge          // complete challenge id
};

struct WeaponUnlock {
    WeaponUnlockType type = WeaponUnlockType::Default;
    uint32_t value = 0;  // level, quest id, mission id, etc.
};

// ---------------------------------------------------------------------------
// Prestige: 55 levels per prestige, 10 prestiges, 1 unique camo per prestige
// ---------------------------------------------------------------------------
inline constexpr int kWeaponMaxLevel = 55;
inline constexpr int kMaxPrestige = 10;
inline constexpr int kXpPerLevel = 500;  // base XP needed per level (can scale)

// ---------------------------------------------------------------------------
// Prestige camo: gradient + animation (for 50 guns × 10 prestiges = 500 camos)
// ---------------------------------------------------------------------------
enum class CamoAnimationType : uint8_t {
    Flow,       // gradient flows in one direction
    Pulse,      // gradient brightness/scale pulses
    Wave,       // wave pattern moves
    Shift,      // color stops shift
    Rotate,     // gradient angle rotates
    Ripple,     // ripple effect
    Glitch,     // glitch-style color shift
    Aurora,     // northern lights style
    Plasma,     // plasma flow
    Prism       // prismatic sweep
};

// RGBA 0-255 per channel, up to 6 stops for gradient
struct GradientStop {
    uint8_t r = 255, g = 255, b = 255, a = 255;
    float position = 0.0f;  // 0-1
};

inline constexpr int kMaxGradientStops = 6;

struct PrestigeCamoDefinition {
    PrestigeCamoId id = 0;
    WeaponId weaponId = 0;
    int prestigeLevel = 0;   // 1-10
    std::string name;
    GradientStop stops[kMaxGradientStops];
    int stopCount = 2;
    CamoAnimationType animationType = CamoAnimationType::Flow;
    float animationSpeed = 1.0f;
    float animationParam = 0.0f;  // angle, scale, etc.
};

struct WeaponDefinition {
    WeaponId id = 0;
    std::string name;
    WeaponCategory category = WeaponCategory::AssaultRifle;
    WeaponUnlock unlock;
};

} // namespace game
