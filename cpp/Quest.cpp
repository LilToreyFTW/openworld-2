#include "Quest.h"
#include <algorithm>
#include <chrono>

namespace game {

void QuestSystem::RegisterQuest(QuestDefinition def) {
    if (def.id == 0) return;
    quests_[def.id] = std::move(def);
}

const QuestDefinition* QuestSystem::GetQuest(QuestId id) const {
    auto it = quests_.find(id);
    return it != quests_.end() ? &it->second : nullptr;
}

QuestProgress* QuestSystem::GetPlayerProgress(PlayerId playerId, QuestId questId) {
    auto pit = playerProgress_.find(playerId);
    if (pit == playerProgress_.end()) return nullptr;
    auto qit = pit->second.find(questId);
    return qit != pit->second.end() ? &qit->second : nullptr;
}

const QuestProgress* QuestSystem::GetPlayerProgress(PlayerId playerId, QuestId questId) const {
    auto pit = playerProgress_.find(playerId);
    if (pit == playerProgress_.end()) return nullptr;
    auto qit = pit->second.find(questId);
    return qit != pit->second.end() ? &qit->second : nullptr;
}

bool QuestSystem::MeetsPrerequisite(PlayerId playerId, QuestId questId) const {
    const QuestDefinition* def = GetQuest(questId);
    if (!def || def->prerequisiteQuestId == 0) return true;
    const QuestProgress* prereq = GetPlayerProgress(playerId, def->prerequisiteQuestId);
    return prereq && prereq->state == QuestState::Completed;
}

bool QuestSystem::StartQuest(PlayerId playerId, QuestId questId) {
    const QuestDefinition* def = GetQuest(questId);
    if (!def) return false;
    if (!MeetsPrerequisite(playerId, questId)) return false;

    QuestProgress* existing = GetPlayerProgress(playerId, questId);
    if (existing && (existing->state == QuestState::InProgress || existing->state == QuestState::Available))
        return false;

    QuestProgress prog;
    prog.questId = questId;
    prog.state = QuestState::InProgress;
    prog.objectives = def->objectives;
    prog.startedAt = static_cast<int64_t>(std::chrono::duration_cast<std::chrono::seconds>(
        std::chrono::steady_clock::now().time_since_epoch()).count());

    playerProgress_[playerId][questId] = std::move(prog);

    if (onQuestEvent_)
        onQuestEvent_(playerId, questId, QuestState::InProgress);
    return true;
}

void QuestSystem::AbandonQuest(PlayerId playerId, QuestId questId) {
    QuestProgress* prog = GetPlayerProgress(playerId, questId);
    if (!prog || prog->state != QuestState::InProgress) return;
    prog->state = QuestState::Available;
    if (onQuestEvent_)
        onQuestEvent_(playerId, questId, QuestState::Available);
}

void QuestSystem::UpdateObjective(PlayerId playerId, QuestId questId, ObjectiveId objectiveId, int32_t delta) {
    QuestProgress* prog = GetPlayerProgress(playerId, questId);
    if (!prog || prog->state != QuestState::InProgress) return;

    for (auto& obj : prog->objectives) {
        if (obj.id == objectiveId) {
            obj.current = std::max(0, std::min(obj.target, obj.current + delta));
            CheckQuestCompletion(playerId, questId);
            return;
        }
    }
}

void QuestSystem::SetObjectiveProgress(PlayerId playerId, QuestId questId, ObjectiveId objectiveId, int32_t value) {
    QuestProgress* prog = GetPlayerProgress(playerId, questId);
    if (!prog || prog->state != QuestState::InProgress) return;

    for (auto& obj : prog->objectives) {
        if (obj.id == objectiveId) {
            obj.current = std::max(0, std::min(obj.target, value));
            CheckQuestCompletion(playerId, questId);
            return;
        }
    }
}

void QuestSystem::CheckQuestCompletion(PlayerId playerId, QuestId questId) {
    QuestProgress* prog = GetPlayerProgress(playerId, questId);
    if (!prog || prog->state != QuestState::InProgress) return;

    bool allRequired = true;
    for (const auto& obj : prog->objectives) {
        if (obj.optional) continue;
        if (obj.current < obj.target) {
            allRequired = false;
            break;
        }
    }

    if (allRequired) {
        prog->state = QuestState::Completed;
        prog->completedAt = static_cast<int64_t>(std::chrono::duration_cast<std::chrono::seconds>(
            std::chrono::steady_clock::now().time_since_epoch()).count());
        if (onQuestEvent_)
            onQuestEvent_(playerId, questId, QuestState::Completed);
    }
}

void QuestSystem::NotifyKill(PlayerId playerId, const std::string& targetType) {
    auto pit = playerProgress_.find(playerId);
    if (pit == playerProgress_.end()) return;
    for (auto& [qid, prog] : pit->second) {
        if (prog.state != QuestState::InProgress) continue;
        for (const auto& obj : prog.objectives)
            if (obj.type == QuestObjectiveType::Kill && obj.targetId == targetType)
                UpdateObjective(playerId, qid, obj.id, 1);
    }
}

void QuestSystem::NotifyCollect(PlayerId playerId, const std::string& itemId) {
    auto pit = playerProgress_.find(playerId);
    if (pit == playerProgress_.end()) return;
    for (auto& [qid, prog] : pit->second) {
        if (prog.state != QuestState::InProgress) continue;
        for (const auto& obj : prog.objectives)
            if (obj.type == QuestObjectiveType::Collect && obj.targetId == itemId)
                UpdateObjective(playerId, qid, obj.id, 1);
    }
}

void QuestSystem::NotifyReachLocation(PlayerId playerId, const std::string& locationId) {
    auto pit = playerProgress_.find(playerId);
    if (pit == playerProgress_.end()) return;
    for (auto& [qid, prog] : pit->second) {
        if (prog.state != QuestState::InProgress) continue;
        for (const auto& obj : prog.objectives)
            if (obj.type == QuestObjectiveType::ReachLocation && obj.targetId == locationId)
                SetObjectiveProgress(playerId, qid, obj.id, 1);
    }
}

void QuestSystem::NotifyInteract(PlayerId playerId, const std::string& objectId) {
    auto pit = playerProgress_.find(playerId);
    if (pit == playerProgress_.end()) return;
    for (auto& [qid, prog] : pit->second) {
        if (prog.state != QuestState::InProgress) continue;
        for (const auto& obj : prog.objectives)
            if (obj.type == QuestObjectiveType::Interact && obj.targetId == objectId)
                UpdateObjective(playerId, qid, obj.id, 1);
    }
}

void QuestSystem::NotifySurviveRounds(PlayerId playerId, int32_t rounds) {
    auto pit = playerProgress_.find(playerId);
    if (pit == playerProgress_.end()) return;
    for (auto& [qid, prog] : pit->second) {
        if (prog.state != QuestState::InProgress) continue;
        for (const auto& obj : prog.objectives)
            if (obj.type == QuestObjectiveType::SurviveRounds)
                SetObjectiveProgress(playerId, qid, obj.id, rounds);
    }
}

void QuestSystem::NotifyWinMatch(PlayerId playerId, GameMode /*mode*/) {
    auto pit = playerProgress_.find(playerId);
    if (pit == playerProgress_.end()) return;
    for (auto& [qid, prog] : pit->second) {
        if (prog.state != QuestState::InProgress) continue;
        for (const auto& obj : prog.objectives)
            if (obj.type == QuestObjectiveType::WinMatches)
                UpdateObjective(playerId, qid, obj.id, 1);
    }
}

std::vector<QuestId> QuestSystem::GetAvailableQuests(PlayerId playerId) const {
    std::vector<QuestId> out;
    for (const auto& [qid, def] : quests_) {
        const QuestProgress* prog = GetPlayerProgress(playerId, qid);
        if (prog && prog->state == QuestState::Completed) continue;
        if (prog && prog->state == QuestState::InProgress) continue;
        if (MeetsPrerequisite(playerId, qid))
            out.push_back(qid);
    }
    return out;
}

std::vector<QuestProgress> QuestSystem::GetActiveQuests(PlayerId playerId) const {
    std::vector<QuestProgress> out;
    auto pit = playerProgress_.find(playerId);
    if (pit == playerProgress_.end()) return out;
    for (const auto& [qid, prog] : pit->second)
        if (prog.state == QuestState::InProgress)
            out.push_back(prog);
    return out;
}

} // namespace game
