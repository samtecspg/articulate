module.exports = ({ mainType, subType, mainId, subId }) => {

    const message = `${subType} id=[${subId}] is not linked to ${mainType} id=[${mainId}]`;
    return { isHandled: true, statusCode: 404, message };
};
