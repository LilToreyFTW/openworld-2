#!/bin/bash
echo "Starting Virtual Sim Game..."
echo ""
cd "$(dirname "$0")/cpp/build/Release"
if [ -f "./virtualsim_game" ]; then
    ./virtualsim_game
else
    echo "ERROR: virtualsim_game not found!"
    echo "Please build the game first."
    read -p "Press Enter to continue..."
fi
