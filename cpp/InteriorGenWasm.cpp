/**
 * InteriorGenWasm.cpp — Emscripten export for HTML game.
 * Compile with: emcc -o interior_gen.js InteriorGenWasm.cpp InteriorGen.cpp -I. -s EXPORTED_RUNTIME_METHODS=['ccall','cwrap'] -s EXPORTED_FUNCTIONS=['_malloc','_free'] -s MODULARIZE=1 -s EXPORT_NAME='InteriorGenModule' -s ALLOW_MEMORY_GROWTH=1
 */

#include "InteriorGen.h"
#include <string>
#include <cstring>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#include <emscripten/bind.h>

// Build JSON from C++ and return as JS string (Emscripten handles std::string -> JS string)
std::string getInteriorLayoutJSON(int32_t buildingId, bool isHubTower, int32_t hubLevel,
  double x, double y, double w, double d, bool isHouse) {
  InteriorGen::BuildingInput in;
  in.id = buildingId;
  in.x = x;
  in.y = y;
  in.w = w;
  in.d = d;
  in.isHouse = isHouse;
  in.isHubTower = isHubTower;
  in.hubLevel = hubLevel;
  return InteriorGen::GetInteriorLayoutJSON(in);
}

// Get bounds only (minX, maxX, minY, maxY) — pass as pointer to 4 doubles for JS to read
EMSCRIPTEN_KEEPALIVE
void getInteriorBounds(int32_t buildingId, bool isHubTower, int32_t hubLevel,
  double x, double y, double w, double d, bool isHouse,
  double* out_minX, double* out_maxX, double* out_minY, double* out_maxY) {
  InteriorGen::BuildingInput in;
  in.id = buildingId;
  in.x = x;
  in.y = y;
  in.w = w;
  in.d = d;
  in.isHouse = isHouse;
  in.isHubTower = isHubTower;
  in.hubLevel = hubLevel;
  InteriorGen::GetInteriorBounds(in, out_minX, out_maxX, out_minY, out_maxY);
}

EMSCRIPTEN_BINDINGS(interior_gen) {
  emscripten::function("getInteriorLayoutJSON", &getInteriorLayoutJSON);
}
#endif
