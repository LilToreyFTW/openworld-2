cmake_minimum_required(VERSION 3.14)
project(VirtualSimGameServer LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)

# Building interior generation (shared logic; used by server or Emscripten/WASM for HTML game)
add_library(interior_gen STATIC InteriorGen.cpp)
target_include_directories(interior_gen PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})

# Full-stack game executable (HTTP server + game logic)
add_executable(virtualsim_game
  GameServerMain.cpp
  Quest.cpp
  Mission.cpp
  MultiplayerModes.cpp
  Zombies.cpp
  GameServer.cpp
  Weapon.cpp
  QuestData.cpp
  Planets.cpp
)

target_include_directories(virtualsim_game PRIVATE ${CMAKE_CURRENT_SOURCE_DIR})

if(MSVC)
  target_compile_options(virtualsim_game PRIVATE /W4)
  target_link_libraries(virtualsim_game ws2_32)
else()
  target_compile_options(virtualsim_game PRIVATE -Wall -Wextra -pedantic)
endif()

# Original test server
add_executable(game_server
  main.cpp
  Quest.cpp
  Mission.cpp
  MultiplayerModes.cpp
  Zombies.cpp
  GameServer.cpp
  Weapon.cpp
  QuestData.cpp
  Planets.cpp
)

target_include_directories(game_server PRIVATE ${CMAKE_CURRENT_SOURCE_DIR})

if(MSVC)
  target_compile_options(game_server PRIVATE /W4)
else()
  target_compile_options(game_server PRIVATE -Wall -Wextra -pedantic)
endif()
