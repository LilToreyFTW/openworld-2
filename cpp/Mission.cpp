#include "Mission.h"
#include <algorithm>
#include <chrono>
#include <utility>

namespace game {

void MissionSystem::RegisterMission(MissionDefinition def) {
    if (def.id == 0) return;
    missions_[def.id] = std::move(def);
}

const MissionDefinition* MissionSystem::GetMission(MissionId id) const {
    auto it = missions_.find(id);
    return it != missions_.end() ? &it->second : nullptr;
}

MissionInstance* MissionSystem::GetPlayerMission(PlayerId playerId, MissionId missionId) {
    auto pit = playerMissions_.find(playerId);
    if (pit == playerMissions_.end()) return nullptr;
    auto mit = pit->second.find(missionId);
    return mit != pit->second.end() ? &mit->second : nullptr;
}

const MissionInstance* MissionSystem::GetPlayerMission(PlayerId playerId, MissionId missionId) const {
    auto pit = playerMissions_.find(playerId);
    if (pit == playerMissions_.end()) return nullptr;
    auto mit = pit->second.find(missionId);
    return mit != pit->second.end() ? &mit->second : nullptr;
}

bool MissionSystem::StartMission(PlayerId playerId, MissionId missionId) {
    const MissionDefinition* def = GetMission(missionId);
    if (!def) return false;

    MissionInstance inst;
    inst.missionId = missionId;
    inst.state = MissionState::Active;
    inst.currentObjectiveIndex = 0;
    inst.objectives = def->objectives;
    inst.startedAt = static_cast<int64_t>(std::chrono::duration_cast<std::chrono::seconds>(
        std::chrono::steady_clock::now().time_since_epoch()).count());

    playerMissions_[playerId][missionId] = std::move(inst);
    playerActiveMission_[playerId] = missionId;

    if (onMissionEvent_)
        onMissionEvent_(playerId, missionId, MissionState::Active);
    return true;
}

void MissionSystem::FailMission(PlayerId playerId, MissionId missionId) {
    MissionInstance* inst = GetPlayerMission(playerId, missionId);
    if (!inst || inst->state != MissionState::Active) return;
    inst->state = MissionState::Failed;
    if (playerActiveMission_[playerId] == missionId)
        playerActiveMission_.erase(playerId);
    if (onMissionEvent_)
        onMissionEvent_(playerId, missionId, MissionState::Failed);
}

void MissionSystem::UpdateObjectiveProgress(PlayerId playerId, MissionId missionId, ObjectiveId objectiveId, int32_t delta) {
    MissionInstance* inst = GetPlayerMission(playerId, missionId);
    if (!inst || inst->state != MissionState::Active) return;

    for (auto& obj : inst->objectives) {
        if (obj.id == objectiveId && !obj.completed) {
            obj.progress = std::max(0, std::min(obj.target, obj.progress + delta));
            if (obj.progress >= obj.target) {
                obj.completed = true;
                AdvanceMission(playerId, missionId);
            }
            return;
        }
    }
}

void MissionSystem::CompleteObjective(PlayerId playerId, MissionId missionId, ObjectiveId objectiveId) {
    MissionInstance* inst = GetPlayerMission(playerId, missionId);
    if (!inst || inst->state != MissionState::Active) return;

    for (auto& obj : inst->objectives) {
        if (obj.id == objectiveId && !obj.completed) {
            obj.completed = true;
            obj.progress = obj.target;
            AdvanceMission(playerId, missionId);
            return;
        }
    }
}

void MissionSystem::AdvanceMission(PlayerId playerId, MissionId missionId) {
    MissionInstance* inst = GetPlayerMission(playerId, missionId);
    if (!inst || inst->state != MissionState::Active) return;

    size_t next = static_cast<size_t>(inst->currentObjectiveIndex);
    while (next < inst->objectives.size() && inst->objectives[next].completed)
        ++next;
    inst->currentObjectiveIndex = static_cast<int32_t>(next);

    CheckMissionSuccess(playerId, missionId);
}

void MissionSystem::CheckMissionSuccess(PlayerId playerId, MissionId missionId) {
    MissionInstance* inst = GetPlayerMission(playerId, missionId);
    if (!inst || inst->state != MissionState::Active) return;

    bool allDone = true;
    for (const auto& obj : inst->objectives) {
        if (!obj.completed) {
            allDone = false;
            break;
        }
    }

    if (allDone) {
        inst->state = MissionState::Success;
        if (playerActiveMission_[playerId] == missionId)
            playerActiveMission_.erase(playerId);
        if (onMissionEvent_)
            onMissionEvent_(playerId, missionId, MissionState::Success);

        const MissionDefinition* def = GetMission(missionId);
        if (def && def->nextMissionId != 0)
            StartMission(playerId, def->nextMissionId);
    }
}

void MissionSystem::NotifyKill(PlayerId playerId, const std::string& targetTag) {
    MissionInstance* inst = GetActiveMission(playerId);
    if (!inst || inst->state != MissionState::Active) return;
    for (auto& obj : inst->objectives)
        if (obj.type == MissionObjectiveType::EliminateAll && obj.targetTag == targetTag && !obj.completed)
            UpdateObjectiveProgress(playerId, inst->missionId, obj.id, 1);
}

void MissionSystem::NotifyReachZone(PlayerId playerId, const std::string& zoneTag) {
    MissionInstance* inst = GetActiveMission(playerId);
    if (!inst || inst->state != MissionState::Active) return;
    for (auto& obj : inst->objectives)
        if (obj.type == MissionObjectiveType::ReachZone && obj.targetTag == zoneTag && !obj.completed)
            CompleteObjective(playerId, inst->missionId, obj.id);
}

void MissionSystem::NotifyInteract(PlayerId playerId, const std::string& objectTag) {
    MissionInstance* inst = GetActiveMission(playerId);
    if (!inst || inst->state != MissionState::Active) return;
    for (auto& obj : inst->objectives)
        if (obj.type == MissionObjectiveType::InteractWith && obj.targetTag == objectTag && !obj.completed)
            CompleteObjective(playerId, inst->missionId, obj.id);
}

void MissionSystem::NotifyDefendProgress(PlayerId playerId, int32_t progress) {
    MissionInstance* inst = GetActiveMission(playerId);
    if (!inst || inst->state != MissionState::Active) return;
    for (auto& obj : inst->objectives)
        if (obj.type == MissionObjectiveType::Defend && !obj.completed)
            UpdateObjectiveProgress(playerId, inst->missionId, obj.id, progress - obj.progress);
}

void MissionSystem::Tick(float deltaSec) {
    std::vector<std::pair<PlayerId, MissionId>> toFail;
    for (auto& [playerId, missions] : playerMissions_) {
        for (auto& [missionId, inst] : missions) {
            if (inst.state != MissionState::Active) continue;
            for (auto& obj : inst.objectives) {
                if (obj.completed || obj.timeLimitSec <= 0.0f) continue;
                obj.timeLimitSec -= deltaSec;
                if (obj.timeLimitSec <= 0.0f)
                    toFail.emplace_back(playerId, missionId);
            }
        }
    }
    for (const auto& [pid, mid] : toFail)
        FailMission(pid, mid);
}

std::vector<MissionId> MissionSystem::GetAvailableMissions(PlayerId playerId) const {
    std::vector<MissionId> out;
    for (const auto& [mid, def] : missions_) {
        const MissionInstance* inst = GetPlayerMission(playerId, mid);
        if (inst && (inst->state == MissionState::Active || inst->state == MissionState::Success))
            continue;
        out.push_back(mid);
    }
    return out;
}

MissionInstance* MissionSystem::GetActiveMission(PlayerId playerId) {
    auto it = playerActiveMission_.find(playerId);
    if (it == playerActiveMission_.end()) return nullptr;
    return GetPlayerMission(playerId, it->second);
}

} // namespace game
