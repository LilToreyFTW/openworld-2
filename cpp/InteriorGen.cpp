/**
 * InteriorGen.cpp — All building interior generation in C++.
 * Outputs JSON for the HTML/Three.js game to create meshes.
 */

#include "InteriorGen.h"
#include <cmath>
#include <sstream>
#include <cstdio>

#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif

namespace InteriorGen {

static double SeededRandom(int32_t seed) {
  return ((seed * 9301 + 49297) % 233280) / 233280.0;
}

static void AppendEscaped(std::string& out, const char* s) {
  out += '"';
  for (; *s; ++s) {
    if (*s == '"' || *s == '\\') out += '\\';
    out += *s;
  }
  out += '"';
}

static void AppendNum(std::string& out, double v) {
  char buf[64];
  snprintf(buf, sizeof(buf), "%.4g", v);
  out += buf;
}

// --- HUB tower: 4km x 2km, 3 levels ---
static std::string GenerateHubTowerJSON(const BuildingInput& in) {
  const double interiorWidth = 4000.0;
  const double interiorDepth = 2000.0;
  const double wallThickness = 50.0;
  const double tileSize = 200.0;
  const double cx = in.x, cy = in.y;
  const int level = in.hubLevel < 0 ? 0 : (in.hubLevel > 2 ? 2 : in.hubLevel);
  const uint32_t levelColors[3] = { 0x4a5568, 0x3d4a5c, 0x2d3748 };
  const uint32_t floorColor = levelColors[level];
  const uint32_t wallColor = 0x2d3748;
  const uint32_t ceilingColor = 0x1a202c;
  const double doorWidth = 120.0;

  std::string j;
  j += "{\"isHub\":true,\"level\":";
  j += std::to_string(level + 1);
  j += ",\"bounds\":{\"minX\":";
  AppendNum(j, cx - interiorWidth/2 + wallThickness + 80);
  j += ",\"maxX\":";
  AppendNum(j, cx + interiorWidth/2 - wallThickness - 80);
  j += ",\"minY\":";
  AppendNum(j, cy - interiorDepth/2 + wallThickness + 80);
  j += ",\"maxY\":";
  AppendNum(j, cy + interiorDepth/2 - wallThickness - 80);
  j += "},\"center\":{\"x\":";
  AppendNum(j, cx);
  j += ",\"y\":";
  AppendNum(j, cy);
  j += "},\"elements\":[";

  // Floor
  j += "{\"type\":\"floor\",\"x\":";
  AppendNum(j, cx);
  j += ",\"y\":";
  AppendNum(j, cy);
  j += ",\"z\":-0.06,\"w\":";
  AppendNum(j, interiorWidth);
  j += ",\"d\":";
  AppendNum(j, interiorDepth);
  j += ",\"rotZ\":0,\"color\":";
  j += std::to_string(floorColor);
  j += "}";

  // Tiles
  int tilesW = static_cast<int>(interiorWidth / tileSize);
  int tilesD = static_cast<int>(interiorDepth / tileSize);
  for (int tx = 0; tx < tilesW; ++tx) {
    for (int ty = 0; ty < tilesD; ++ty) {
      double tileX = cx - interiorWidth/2 + tx * tileSize + tileSize/2;
      double tileY = cy - interiorDepth/2 + ty * tileSize + tileSize/2;
      uint32_t tileColor = ((tx + ty) % 2 == 0) ? floorColor : 0x3d4a5c;
      j += ",{\"type\":\"tile\",\"x\":";
      AppendNum(j, tileX);
      j += ",\"y\":";
      AppendNum(j, tileY);
      j += ",\"z\":-0.059,\"w\":";
      AppendNum(j, tileSize * 0.96);
      j += ",\"d\":";
      AppendNum(j, tileSize * 0.96);
      j += ",\"rotZ\":0,\"color\":";
      j += std::to_string(tileColor);
      j += "}";
    }
  }

  // Ceiling
  j += ",{\"type\":\"ceiling\",\"x\":";
  AppendNum(j, cx);
  j += ",\"y\":";
  AppendNum(j, cy);
  j += ",\"z\":-0.045,\"w\":";
  AppendNum(j, interiorWidth);
  j += ",\"d\":";
  AppendNum(j, interiorDepth);
  j += ",\"rotZ\":0,\"color\":";
  j += std::to_string(ceilingColor);
  j += "}";

  // Walls
  double frontY = cy + interiorDepth/2;
  double backY = cy - interiorDepth/2;
  double leftX = cx - interiorWidth/2;
  double rightX = cx + interiorWidth/2;
  double frontSeg = (interiorWidth - doorWidth) / 2;

  j += ",{\"type\":\"wall\",\"x\":";
  AppendNum(j, cx - doorWidth/2 - frontSeg/2);
  j += ",\"y\":";
  AppendNum(j, frontY - wallThickness/2);
  j += ",\"z\":-0.055,\"w\":";
  AppendNum(j, frontSeg);
  j += ",\"d\":";
  AppendNum(j, wallThickness);
  j += ",\"rotZ\":1.5708,\"color\":";
  j += std::to_string(wallColor);
  j += "}";
  j += ",{\"type\":\"wall\",\"x\":";
  AppendNum(j, cx + doorWidth/2 + frontSeg/2);
  j += ",\"y\":";
  AppendNum(j, frontY - wallThickness/2);
  j += ",\"z\":-0.055,\"w\":";
  AppendNum(j, frontSeg);
  j += ",\"d\":";
  AppendNum(j, wallThickness);
  j += ",\"rotZ\":1.5708,\"color\":";
  j += std::to_string(wallColor);
  j += "}";
  j += ",{\"type\":\"wall\",\"x\":";
  AppendNum(j, cx);
  j += ",\"y\":";
  AppendNum(j, backY + wallThickness/2);
  j += ",\"z\":-0.055,\"w\":";
  AppendNum(j, interiorWidth);
  j += ",\"d\":";
  AppendNum(j, wallThickness);
  j += ",\"rotZ\":1.5708,\"color\":";
  j += std::to_string(wallColor);
  j += "}";
  j += ",{\"type\":\"wall\",\"x\":";
  AppendNum(j, leftX + wallThickness/2);
  j += ",\"y\":";
  AppendNum(j, cy);
  j += ",\"z\":-0.055,\"w\":";
  AppendNum(j, interiorDepth);
  j += ",\"d\":";
  AppendNum(j, wallThickness);
  j += ",\"rotZ\":0,\"color\":";
  j += std::to_string(wallColor);
  j += "}";
  j += ",{\"type\":\"wall\",\"x\":";
  AppendNum(j, rightX - wallThickness/2);
  j += ",\"y\":";
  AppendNum(j, cy);
  j += ",\"z\":-0.055,\"w\":";
  AppendNum(j, interiorDepth);
  j += ",\"d\":";
  AppendNum(j, wallThickness);
  j += ",\"rotZ\":0,\"color\":";
  j += std::to_string(wallColor);
  j += "}";

  // Stairs
  const double stairsW = 150.0, stairsD = 80.0;
  double stairsUpY = cy + interiorDepth/2 - 150.0;
  double stairsDownY = cy - interiorDepth/2 + 150.0;
  uint32_t stairsColor = 0x4a5568;
  j += ",{\"type\":\"stairs\",\"up\":true,\"x\":";
  AppendNum(j, cx);
  j += ",\"y\":";
  AppendNum(j, stairsUpY);
  j += ",\"z\":-0.054,\"w\":";
  AppendNum(j, stairsW);
  j += ",\"d\":";
  AppendNum(j, stairsD);
  j += ",\"rotZ\":0,\"color\":";
  j += std::to_string(stairsColor);
  j += "}";
  j += ",{\"type\":\"stairs\",\"up\":false,\"x\":";
  AppendNum(j, cx);
  j += ",\"y\":";
  AppendNum(j, stairsDownY);
  j += ",\"z\":-0.054,\"w\":";
  AppendNum(j, stairsW);
  j += ",\"d\":";
  AppendNum(j, stairsD);
  j += ",\"rotZ\":0,\"color\":";
  j += std::to_string(stairsColor);
  j += "}";

  // Hub desks
  double deskSize = 120.0;
  for (int i = 0; i < 8; ++i) {
    double dx = cx - interiorWidth/3 + (i % 4) * (interiorWidth/4);
    double dy = cy - interiorDepth/4 + (i / 4) * (interiorDepth/3);
    j += ",{\"type\":\"furniture\",\"furn\":\"desk\",\"x\":";
    AppendNum(j, dx);
    j += ",\"y\":";
    AppendNum(j, dy);
    j += ",\"z\":-0.054,\"w\":";
    AppendNum(j, deskSize);
    j += ",\"d\":";
    AppendNum(j, deskSize * 0.6);
    j += ",\"rotZ\":0,\"color\":";
    j += std::to_string(wallColor);
    j += "}";
  }
  // Pillars
  double pillarR = 40.0;
  for (int px = -1; px <= 1; ++px) {
    for (int py = -1; py <= 1; ++py) {
      if (px == 0 && py == 0) continue;
      double px_ = cx + px * 1200.0, py_ = cy + py * 500.0;
      j += ",{\"type\":\"furniture\",\"furn\":\"pillar\",\"x\":";
      AppendNum(j, px_);
      j += ",\"y\":";
      AppendNum(j, py_);
      j += ",\"z\":-0.054,\"w\":";
      AppendNum(j, pillarR * 2);
      j += ",\"d\":";
      AppendNum(j, pillarR * 2);
      j += ",\"rotZ\":0,\"color\":";
  j += std::to_string(ceilingColor);
  j += "}";
    }
  }

  j += "]}";
  return j;
}

// --- Standard building (house or city) ---
static std::string GenerateStandardBuildingJSON(const BuildingInput& in) {
  double interiorWidth = in.w * 0.85;
  double interiorDepth = in.d * 0.85;
  const double wallThickness = 12.0;
  const double cx = in.x, cy = in.y;
  double tileSize = in.isHouse ? 40.0 : 50.0;
  uint32_t floorColor = in.isHouse ? 0xd4a574 : 0x8b7355;
  uint32_t wallColor = in.isHouse ? 0xe8d5b7 : 0xa0a0a0;
  uint32_t ceilingColor = 0xf5f5dc;
  const double doorWidth = 40.0;

  std::string j;
  j += "{\"isHub\":false,\"bounds\":{\"minX\":";
  AppendNum(j, cx - interiorWidth/2 + wallThickness + 25);
  j += ",\"maxX\":";
  AppendNum(j, cx + interiorWidth/2 - wallThickness - 25);
  j += ",\"minY\":";
  AppendNum(j, cy - interiorDepth/2 + wallThickness + 25);
  j += ",\"maxY\":";
  AppendNum(j, cy + interiorDepth/2 - wallThickness - 25);
  j += "},\"center\":{\"x\":";
  AppendNum(j, cx);
  j += ",\"y\":";
  AppendNum(j, cy);
  j += "},\"elements\":[";

  // Floor
  j += "{\"type\":\"floor\",\"x\":";
  AppendNum(j, cx);
  j += ",\"y\":";
  AppendNum(j, cy);
  j += ",\"z\":-0.06,\"w\":";
  AppendNum(j, interiorWidth);
  j += ",\"d\":";
  AppendNum(j, interiorDepth);
  j += ",\"rotZ\":0,\"color\":";
  j += std::to_string(floorColor);
  j += "}";

  int tilesW = static_cast<int>(interiorWidth / tileSize);
  int tilesD = static_cast<int>(interiorDepth / tileSize);
  for (int tx = 0; tx < tilesW; ++tx) {
    for (int ty = 0; ty < tilesD; ++ty) {
      double tileX = cx - interiorWidth/2 + tx * tileSize + tileSize/2;
      double tileY = cy - interiorDepth/2 + ty * tileSize + tileSize/2;
      uint32_t tileColor = ((tx + ty) % 2 == 0) ? floorColor : (uint32_t)(floorColor * 0.9);
      if (tileColor == floorColor && (tx + ty) % 2 != 0) tileColor = 0xc49564;
      j += ",{\"type\":\"tile\",\"x\":";
      AppendNum(j, tileX);
      j += ",\"y\":";
      AppendNum(j, tileY);
      j += ",\"z\":-0.059,\"w\":";
      AppendNum(j, tileSize * 0.95);
      j += ",\"d\":";
      AppendNum(j, tileSize * 0.95);
      j += ",\"rotZ\":0,\"color\":";
      j += std::to_string(tileColor);
      j += "}";
    }
  }

  // Ceiling
  j += ",{\"type\":\"ceiling\",\"x\":";
  AppendNum(j, cx);
  j += ",\"y\":";
  AppendNum(j, cy);
  j += ",\"z\":-0.045,\"w\":";
  AppendNum(j, interiorWidth);
  j += ",\"d\":";
  AppendNum(j, interiorDepth);
  j += ",\"rotZ\":0,\"color\":";
  j += std::to_string(ceilingColor);
  j += "}";

  double frontY = cy + interiorDepth/2;
  double backY = cy - interiorDepth/2;
  double leftX = cx - interiorWidth/2;
  double rightX = cx + interiorWidth/2;
  if (interiorWidth > doorWidth + 20) {
    double seg = (interiorWidth - doorWidth) / 2;
    j += ",{\"type\":\"wall\",\"x\":";
    AppendNum(j, cx - doorWidth/2 - seg/2);
    j += ",\"y\":";
    AppendNum(j, frontY - wallThickness/2);
    j += ",\"z\":-0.055,\"w\":";
    AppendNum(j, seg);
    j += ",\"d\":";
    AppendNum(j, wallThickness);
    j += ",\"rotZ\":1.5708,\"color\":";
    j += std::to_string(wallColor);
    j += "}";
    j += ",{\"type\":\"wall\",\"x\":";
    AppendNum(j, cx + doorWidth/2 + seg/2);
    j += ",\"y\":";
    AppendNum(j, frontY - wallThickness/2);
    j += ",\"z\":-0.055,\"w\":";
    AppendNum(j, seg);
    j += ",\"d\":";
    AppendNum(j, wallThickness);
    j += ",\"rotZ\":1.5708,\"color\":";
    j += std::to_string(wallColor);
    j += "}";
  }
  j += ",{\"type\":\"wall\",\"x\":";
  AppendNum(j, cx);
  j += ",\"y\":";
  AppendNum(j, backY + wallThickness/2);
  j += ",\"z\":-0.055,\"w\":";
  AppendNum(j, interiorWidth);
  j += ",\"d\":";
  AppendNum(j, wallThickness);
  j += ",\"rotZ\":1.5708,\"color\":";
  j += std::to_string(wallColor);
  j += "}";
  j += ",{\"type\":\"wall\",\"x\":";
  AppendNum(j, leftX + wallThickness/2);
  j += ",\"y\":";
  AppendNum(j, cy);
  j += ",\"z\":-0.055,\"w\":";
  AppendNum(j, interiorDepth);
  j += ",\"d\":";
  AppendNum(j, wallThickness);
  j += ",\"rotZ\":0,\"color\":";
  j += std::to_string(wallColor);
  j += "}";
  j += ",{\"type\":\"wall\",\"x\":";
  AppendNum(j, rightX - wallThickness/2);
  j += ",\"y\":";
  AppendNum(j, cy);
  j += ",\"z\":-0.055,\"w\":";
  AppendNum(j, interiorDepth);
  j += ",\"d\":";
  AppendNum(j, wallThickness);
  j += ",\"rotZ\":0,\"color\":";
  j += std::to_string(wallColor);
  j += "}";

  // Windows
  double windowSize = 25.0;
  int windowCount = static_cast<int>(interiorDepth / (windowSize * 2));
  if (windowCount > 2) windowCount = 2;
  for (int i = 0; i < windowCount; ++i) {
    double wy = cy - interiorDepth/3 + i * (interiorDepth/2);
    uint32_t winColor = 0x87ceeb;
    j += ",{\"type\":\"window\",\"x\":";
    AppendNum(j, leftX + wallThickness/2 + 2);
    j += ",\"y\":";
    AppendNum(j, wy);
    j += ",\"z\":-0.054,\"w\":";
    AppendNum(j, windowSize);
    j += ",\"d\":";
    AppendNum(j, windowSize);
    j += ",\"rotZ\":0,\"color\":";
    j += std::to_string(winColor);
    j += "}";
    j += ",{\"type\":\"window\",\"x\":";
    AppendNum(j, rightX - wallThickness/2 - 2);
    j += ",\"y\":";
    AppendNum(j, wy);
    j += ",\"z\":-0.054,\"w\":";
    AppendNum(j, windowSize);
    j += ",\"d\":";
    AppendNum(j, windowSize);
    j += ",\"rotZ\":0,\"color\":";
    j += std::to_string(winColor);
    j += "}";
  }

  // Furniture (seeded by building id)
  int seed = in.id;
  if (in.isHouse) {
    int numRooms = interiorWidth > 150 ? 2 : 1;
    double roomWidth = interiorWidth / numRooms;
    for (int room = 0; room < numRooms; ++room) {
      double roomX = cx - interiorWidth/2 + roomWidth/2 + room * roomWidth;
      double roomY = cy;
      if (room == 0 || interiorWidth > 200) {
        j += ",{\"type\":\"furniture\",\"furn\":\"bed\",\"x\":";
        AppendNum(j, roomX - roomWidth/4);
        j += ",\"y\":";
        AppendNum(j, roomY);
        j += ",\"z\":-0.054,\"w\":50,\"d\":70,\"rotZ\":0,\"color\":";
        j += std::to_string(0x8b4513);
        j += "}";
        j += ",{\"type\":\"furniture\",\"furn\":\"pillow\",\"x\":";
        AppendNum(j, roomX - roomWidth/4);
        j += ",\"y\":";
        AppendNum(j, roomY + 25);
        j += ",\"z\":-0.053,\"w\":20,\"d\":15,\"rotZ\":0,\"color\":";
        j += std::to_string(0xf0f0f0);
        j += "}";
      }
      j += ",{\"type\":\"furniture\",\"furn\":\"table\",\"x\":";
      AppendNum(j, roomX + roomWidth/4);
      j += ",\"y\":";
      AppendNum(j, roomY);
      j += ",\"z\":-0.054,\"w\":40,\"d\":40,\"rotZ\":0,\"color\":";
      j += std::to_string(0x8b4513);
      j += "}";
      for (int c = 0; c < 4; ++c) {
        double angle = (c * 2.0 * M_PI) / 4.0;
        double chairX = roomX + roomWidth/4 + std::cos(angle) * 30;
        double chairY = roomY + std::sin(angle) * 30;
        j += ",{\"type\":\"furniture\",\"furn\":\"chair\",\"x\":";
        AppendNum(j, chairX);
        j += ",\"y\":";
        AppendNum(j, chairY);
        j += ",\"z\":-0.054,\"w\":18,\"d\":18,\"rotZ\":0,\"color\":";
        j += std::to_string(0x4a4a4a);
        j += "}";
      }
      j += ",{\"type\":\"furniture\",\"furn\":\"dresser\",\"x\":";
      AppendNum(j, roomX + roomWidth/3);
      j += ",\"y\":";
      AppendNum(j, roomY - roomWidth/4);
      j += ",\"z\":-0.054,\"w\":35,\"d\":50,\"rotZ\":0,\"color\":";
      j += std::to_string(0x654321);
      j += "}";
    }
  } else {
    int deskCount = static_cast<int>(interiorWidth / 80);
    if (deskCount > 4) deskCount = 4;
    for (int d = 0; d < deskCount; ++d) {
      double deskX = cx - interiorWidth/2 + (d + 0.5) * (interiorWidth / (deskCount + 1));
      double deskY = cy;
      j += ",{\"type\":\"furniture\",\"furn\":\"desk\",\"x\":";
      AppendNum(j, deskX);
      j += ",\"y\":";
      AppendNum(j, deskY);
      j += ",\"z\":-0.054,\"w\":35,\"d\":50,\"rotZ\":0,\"color\":";
      j += std::to_string(0x654321);
      j += "}";
      j += ",{\"type\":\"furniture\",\"furn\":\"chair\",\"x\":";
      AppendNum(j, deskX);
      j += ",\"y\":";
      AppendNum(j, deskY - 25);
      j += ",\"z\":-0.054,\"w\":20,\"d\":20,\"rotZ\":0,\"color\":";
      j += std::to_string(0x2a2a2a);
      j += "}";
      j += ",{\"type\":\"furniture\",\"furn\":\"monitor\",\"x\":";
      AppendNum(j, deskX);
      j += ",\"y\":";
      AppendNum(j, deskY + 10);
      j += ",\"z\":-0.053,\"w\":15,\"d\":20,\"rotZ\":0,\"color\":";
      j += std::to_string(0x1a1a1a);
      j += "}";
    }
    int cabinetCount = static_cast<int>(interiorDepth / 40);
    if (cabinetCount > 3) cabinetCount = 3;
    for (int c = 0; c < cabinetCount; ++c) {
      double cabinetY = cy - interiorDepth/3 + c * (interiorDepth / (cabinetCount + 1));
      j += ",{\"type\":\"furniture\",\"furn\":\"cabinet\",\"x\":";
      AppendNum(j, cx - interiorWidth/3);
      j += ",\"y\":";
      AppendNum(j, cabinetY);
      j += ",\"z\":-0.054,\"w\":20,\"d\":30,\"rotZ\":0,\"color\":";
      j += std::to_string(0x696969);
      j += "}";
      j += ",{\"type\":\"furniture\",\"furn\":\"cabinet\",\"x\":";
      AppendNum(j, cx + interiorWidth/3);
      j += ",\"y\":";
      AppendNum(j, cabinetY);
      j += ",\"z\":-0.054,\"w\":20,\"d\":30,\"rotZ\":0,\"color\":";
      j += std::to_string(0x696969);
      j += "}";
    }
  }

  // Decorative elements
  int decorCount = static_cast<int>(SeededRandom(seed) * 3) + 1;
  for (int i = 0; i < decorCount; ++i) {
    int decorSeed = seed * (i + 1) * 17;
    double decorX = cx + (SeededRandom(decorSeed) - 0.5) * interiorWidth * 0.7;
    double decorY = cy + (SeededRandom(decorSeed * 3) - 0.5) * interiorDepth * 0.7;
    int decorType = static_cast<int>(SeededRandom(decorSeed * 5) * 3);
    uint32_t decorColor = decorType == 0 ? 0x228b22 : (decorType == 1 ? 0xffd700 : 0xdeb887);
    double decorW = decorType == 0 ? 16 : (decorType == 1 ? 10 : 12);
    double decorD = decorType == 0 ? 16 : (decorType == 1 ? 15 : 12);
    j += ",{\"type\":\"furniture\",\"furn\":\"decor\",\"x\":";
    AppendNum(j, decorX);
    j += ",\"y\":";
    AppendNum(j, decorY);
    j += ",\"z\":-0.054,\"w\":";
    AppendNum(j, decorW);
    j += ",\"d\":";
    AppendNum(j, decorD);
    j += ",\"rotZ\":0,\"color\":";
    j += std::to_string(decorColor);
    j += "}";
  }

  j += "]}";
  return j;
}

std::string GetInteriorLayoutJSON(const BuildingInput& input) {
  if (input.isHubTower)
    return GenerateHubTowerJSON(input);
  return GenerateStandardBuildingJSON(input);
}

void GetInteriorBounds(const BuildingInput& input,
  double* out_minX, double* out_maxX, double* out_minY, double* out_maxY) {
  if (input.isHubTower) {
    const double interiorWidth = 4000.0;
    const double interiorDepth = 2000.0;
    const double wallThickness = 50.0;
    const double cx = input.x, cy = input.y;
    *out_minX = cx - interiorWidth/2 + wallThickness + 80;
    *out_maxX = cx + interiorWidth/2 - wallThickness - 80;
    *out_minY = cy - interiorDepth/2 + wallThickness + 80;
    *out_maxY = cy + interiorDepth/2 - wallThickness - 80;
  } else {
    double interiorWidth = input.w * 0.85;
    double interiorDepth = input.d * 0.85;
    const double wallThickness = 12.0;
    const double cx = input.x, cy = input.y;
    *out_minX = cx - interiorWidth/2 + wallThickness + 25;
    *out_maxX = cx + interiorWidth/2 - wallThickness - 25;
    *out_minY = cy - interiorDepth/2 + wallThickness + 25;
    *out_maxY = cy + interiorDepth/2 - wallThickness - 25;
  }
}

} // namespace InteriorGen
