@echo off
REM Build C++ building interiors to WebAssembly for the HTML game.
REM Requires Emscripten SDK: https://emscripten.org/docs/getting_started/downloads.html
REM Run: emsdk activate && cd cpp && build_interior_wasm.bat

where emcc >nul 2>nul
if errorlevel 1 (
  echo emcc not found. Install Emscripten and run: emsdk activate
  exit /b 1
)

emcc -o interior_gen.js InteriorGenWasm.cpp InteriorGen.cpp -I. ^
  -s EXPORTED_RUNTIME_METHODS=ccall,cwrap ^
  -s MODULARIZE=1 -s EXPORT_NAME=InteriorGenModule ^
  -s ALLOW_MEMORY_GROWTH=1 ^
  -s EXPORTED_FUNCTIONS=_malloc,_free ^
  -std=c++17 -O2

if exist interior_gen.js (
  echo Built interior_gen.js and interior_gen.wasm
  echo Copy to project root cpp/ so the game can load cpp/interior_gen.js
) else (
  echo Build failed
  exit /b 1
)
