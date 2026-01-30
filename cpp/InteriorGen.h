/**
 * InteriorGen.h — C++ building interior generation for Virtual Sim HTML game.
 * All building interiors (HUB tower 4km×2km 3 levels, houses, city buildings)
 * are computed here. Output is JSON for the HTML/Three.js frontend to consume.
 */

#ifndef INTERIOR_GEN_H
#define INTERIOR_GEN_H

#include <string>
#include <cstdint>

namespace InteriorGen {

// Building input (from JS)
struct BuildingInput {
  int32_t id;
  double  x, y;       // center
  double  w, d;       // width, depth (exterior)
  bool    isHouse;
  bool    isHubTower;
  int32_t hubLevel;   // 0, 1, 2 when isHubTower
};

// Single interior element for JSON (rect in 2D: position, size, color, rotation)
struct RectElement {
  double x, y, z;
  double w, d;
  double rotZ;  // radians
  uint32_t color;
  const char* type;  // "floor"|"tile"|"ceiling"|"wall"|"window"|"door"|"furniture"|"stairs"
};

// Output: JSON string describing the full interior layout.
// JS parses this and creates Three.js meshes.
std::string GetInteriorLayoutJSON(const BuildingInput& input);

// Bounds only (for player clamping) — also embedded in JSON "bounds" key
void GetInteriorBounds(const BuildingInput& input,
  double* out_minX, double* out_maxX, double* out_minY, double* out_maxY);

} // namespace InteriorGen

#endif
