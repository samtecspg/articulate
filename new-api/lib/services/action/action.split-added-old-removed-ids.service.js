import _ from 'lodash';

module.exports = ({ oldActions, newActions, AgentActionsModels }) => {

    const oldIds = _.map(_.filter(AgentActionsModels, (actionModel) => {

        return oldActions.indexOf(actionModel.property('actionName')) > -1;
    }), (filteredOldModel) => {

        return filteredOldModel.id;
    });

    const newIds = _.map(_.filter(AgentActionsModels, (actionModel) => {

        return newActions.indexOf(actionModel.property('actionName')) > -1;
    }), (filteredNewModel) => {

        return filteredNewModel.id;
    });

    const removed = _.difference(oldIds, newIds);
    const unchanged = _.intersection(oldIds, newIds);
    const previousKeywords = [...unchanged, ...removed];
    const added = _.difference(newIds, previousKeywords);

    return { added, removed, unchanged };
};
