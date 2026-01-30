#pragma once

#include "GameTypes.h"
#include <unordered_map>
#include <vector>
#include <functional>

namespace game {

class MissionSystem {
public:
    using MissionEventCallback = std::function<void(PlayerId, MissionId, MissionState)>;

    MissionSystem() = default;

    void RegisterMission(MissionDefinition def);
    const MissionDefinition* GetMission(MissionId id) const;
    MissionInstance* GetPlayerMission(PlayerId playerId, MissionId missionId);
    const MissionInstance* GetPlayerMission(PlayerId playerId, MissionId missionId) const;

    bool StartMission(PlayerId playerId, MissionId missionId);
    void FailMission(PlayerId playerId, MissionId missionId);
    void UpdateObjectiveProgress(PlayerId playerId, MissionId missionId, ObjectiveId objectiveId, int32_t delta);
    void CompleteObjective(PlayerId playerId, MissionId missionId, ObjectiveId objectiveId);

    void NotifyKill(PlayerId playerId, const std::string& targetTag);
    void NotifyReachZone(PlayerId playerId, const std::string& zoneTag);
    void NotifyInteract(PlayerId playerId, const std::string& objectTag);
    void NotifyDefendProgress(PlayerId playerId, int32_t progress);
    void Tick(float deltaSec);

    std::vector<MissionId> GetAvailableMissions(PlayerId playerId) const;
    MissionInstance* GetActiveMission(PlayerId playerId);

    void SetEventCallback(MissionEventCallback cb) { onMissionEvent_ = std::move(cb); }

private:
    void AdvanceMission(PlayerId playerId, MissionId missionId);
    void CheckMissionSuccess(PlayerId playerId, MissionId missionId);

    std::unordered_map<MissionId, MissionDefinition> missions_;
    std::unordered_map<PlayerId, std::unordered_map<MissionId, MissionInstance>> playerMissions_;
    std::unordered_map<PlayerId, MissionId> playerActiveMission_;
    MissionEventCallback onMissionEvent_;
};

} // namespace game
