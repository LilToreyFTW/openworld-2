#pragma once

#include "Quest.h"
#include "GameTypes.h"

namespace game {

void RegisterLandQuests(QuestSystem& quests);
void RegisterSpaceQuests(QuestSystem& quests);
void RegisterAllQuests(QuestSystem& quests);

} // namespace game
