import _ from 'lodash';

module.exports = async function ({ rasaResults }) {

    //Iterate over each rasa result and return an array of all the keywords in all the rasa results
    return _.flatMap(rasaResults, (category) => {

        //Iterate over each keyword in a rasa result (which is a category on a multimodel agent)
        category.keywords = _.map(category.keywords, (keyword) => {

            //MARK: assigns category name to keyword
            keyword.category = category.category;
            return keyword;
        });
        return category.keywords;
    });
};