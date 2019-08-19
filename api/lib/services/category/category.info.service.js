import _ from 'lodash';
import Categories from '../../categories';

module.exports = async function () {

    const categories = {}
    Object.keys(Categories).forEach((category) => {

        const info = Categories[category].info;
        const samples = _.take(_.map(Categories[category].sayings, 'userSays'), 10);
        if (Categories[category].info.enabled){
            categories[category] = { ...info, samples };
        }
    });
    return categories;
};
