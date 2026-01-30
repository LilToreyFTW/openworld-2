#pragma once

#include "GameTypes.h"
#include <unordered_map>
#include <functional>

namespace game {

class QuestSystem {
public:
    using QuestEventCallback = std::function<void(PlayerId, QuestId, QuestState)>;

    QuestSystem() = default;

    void RegisterQuest(QuestDefinition def);
    const QuestDefinition* GetQuest(QuestId id) const;
    QuestProgress* GetPlayerProgress(PlayerId playerId, QuestId questId);
    const QuestProgress* GetPlayerProgress(PlayerId playerId, QuestId questId) const;

    bool StartQuest(PlayerId playerId, QuestId questId);
    void AbandonQuest(PlayerId playerId, QuestId questId);
    void UpdateObjective(PlayerId playerId, QuestId questId, ObjectiveId objectiveId, int32_t delta);
    void SetObjectiveProgress(PlayerId playerId, QuestId questId, ObjectiveId objectiveId, int32_t value);

    void NotifyKill(PlayerId playerId, const std::string& targetType);
    void NotifyCollect(PlayerId playerId, const std::string& itemId);
    void NotifyReachLocation(PlayerId playerId, const std::string& locationId);
    void NotifyInteract(PlayerId playerId, const std::string& objectId);
    void NotifySurviveRounds(PlayerId playerId, int32_t rounds);
    void NotifyWinMatch(PlayerId playerId, GameMode mode);

    std::vector<QuestId> GetAvailableQuests(PlayerId playerId) const;
    std::vector<QuestProgress> GetActiveQuests(PlayerId playerId) const;

    void SetEventCallback(QuestEventCallback cb) { onQuestEvent_ = std::move(cb); }

private:
    void CheckQuestCompletion(PlayerId playerId, QuestId questId);
    bool MeetsPrerequisite(PlayerId playerId, QuestId questId) const;

    std::unordered_map<QuestId, QuestDefinition> quests_;
    std::unordered_map<PlayerId, std::unordered_map<QuestId, QuestProgress>> playerProgress_;
    QuestEventCallback onQuestEvent_;
};

} // namespace game
