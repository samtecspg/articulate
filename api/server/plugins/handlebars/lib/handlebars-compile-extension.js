import _ from 'lodash';

module.exports = async ({ Handlebars }) => {
    //Overwrite/extend compile from handlebars to complete incomplete paths
    var compile = Handlebars.compile.bind(Handlebars);
    Handlebars.compile = function (input, options) {
        return (context) => {
            try {
                input = completeTemplate(input, context);
                return compile(input, options)(context)
            } catch (err) {
                throw err;
            }
        };
    };
};

const completeTemplate = (template, context) => {
    if (template && context && typeof context === 'object') {
        let handlebarExpressions = getHandlebarExpressions(template);
        let newHandleBarExpressions = generateNewHandlebarExpressions(handlebarExpressions, context);

        let newTemplate = template;
        newHandleBarExpressions.forEach(newHandlebarExpression => {
            newTemplate = newTemplate.replace(newHandlebarExpression.original, newHandlebarExpression.new);
        })

        return newTemplate;
    }
    return template;
}

const getHandlebarExpressions = (template) => {
    const regex = /(?<=({{))[^{].*?(?=(}}))/g
    var result = template.match(regex);
    return result ? result : [];
}

// Handlebar expressions are everything between {{}} like {{a.b.c d.e.f}} and {{a.b.c #if}}
const generateNewHandlebarExpressions = function (handlebarExpressions, context) {
    let newHandlebarExpressions = [];
    handlebarExpressions.forEach((handlebarExpression) => {

        let newHandlebarExpressionUnits = generateNewHandlebarExpressionUnits(handlebarExpression, context);

        if (newHandlebarExpressionUnits.length > 0) {
            let newHandlebarExpression = handlebarExpression
            newHandlebarExpressionUnits.forEach(newPath => {
                newHandlebarExpression = newHandlebarExpression.replace(newPath.original, newPath.new);
            })
            newHandleBarExpressions.push({ 'original': "{{" + handlebarExpression + "}}", 'new': "{{" + newHandlebarExpression + "}}" });
        }
    })
    return newHandlebarExpressions;
}

// Handlebar expressions units are everything between {{}} but its units like {{a.b.c #if}} will have a.b.c and #if as units
const generateNewHandlebarExpressionUnits = function (handlebarExpression, context) {
    let handlebarExpressionUnits = handlebarExpression.split(" ");
    let newHandlebarExpressionUnits = [];
    handlebarExpressionUnits.forEach(handlebarExpressionUnit => {

        let cleanHandlebarExpressionUnit = generateCleanHandlebarExpressionUnit(handlebarExpressionUnit);
        let possiblePathSegments = cleanHandlebarExpressionUnit.split('.');

        let { lastProcessedPathSegmentCounter, newPathBuffer } = generatePathBuffer(possiblePathSegments, context);
        if (newPathBuffer.length > 0) {
            let restOfPossiblePathSegments = possiblePathSegments.splice(lastProcessedPathSegmentCounter, possiblePathSegments.length).join('.')
            let newPath = newPathBuffer.join('.') + ((restOfPossiblePathSegments.length > 0) ? ('.' + restOfPossiblePathSegments) : '')
            if (handlebarExpressionUnit !== newPath) {
                newHandlebarExpressionUnits.push({ 'original': handlebarExpressionUnit, 'new': newPath });
            }
        }
    })
    return newHandlebarExpressionUnits;
}

const generateCleanHandlebarExpressionUnit = function (handlebarExpressionUnit) {
    //Remove ../ when accessing parent context
    let cleanHandlebarExpressionUnit = handlebarExpressionUnit.replaceAll('../', '');
    //replaceAll / with . to handle only . when writing paths
    cleanHandlebarExpressionUnit = cleanHandlebarExpressionUnit.replaceAll('/', '.');
    cleanHandlebarExpressionUnit = cleanHandlebarExpressionUnit.replaceAll('\\[', '');
    cleanHandlebarExpressionUnit = cleanHandlebarExpressionUnit.replaceAll('\\]', '');
    cleanHandlebarExpressionUnit = cleanHandlebarExpressionUnit.replaceAll('\"', '');
    cleanHandlebarExpressionUnit = cleanHandlebarExpressionUnit.replaceAll('\'', '');
    return cleanHandlebarExpressionUnit;
}

//This is the final path generated from a unit recognized as being a path (if its incomplete it should be completed using context)
const generatePathBuffer = function (possiblePathSegments, context) {
    let newPathBuffer = [];
    let pathFinished = false;
    let counter = 0;
    //We only complete explicit paths (with . or /), no single elements from root
    while (possiblePathSegments.length > 1 && !pathFinished && counter < possiblePathSegments.length) {
        if (newPathBuffer.length === 0 || typeof _.get(context, newPathBuffer.join('.')) === 'object') {
            let currentContextLevelCandidates = newPathBuffer.length === 0 ? Object.keys(context) : Object.keys(_.get(context, newPathBuffer));
            if (currentContextLevelCandidates.includes(possiblePathSegments[counter])) {
                newPathBuffer.push(possiblePathSegments[counter]);
            } else {
                currentContextLevelCandidates = possiblePathSegments[counter].length > 0 ? currentContextLevelCandidates.filter(currentContextLevelCandidate => {
                    return currentContextLevelCandidate.startsWith(possiblePathSegments[counter]);
                }) : [];
                if (currentContextLevelCandidates.length > 1) {
                    let errorMessage = 'There is an ambiguity in a handlebar expression for: ' + possiblePathSegments[counter] + ', it could be resolved with: ' + currentContextLevelCandidates.join(', ');
                    console.error(errorMessage);
                    throw new Error(errorMessage);
                }
                if (currentContextLevelCandidates.length === 1) {
                    newPathBuffer.push(currentContextLevelCandidates[0])
                }
                if (currentContextLevelCandidates.length === 0) {
                    pathFinished = true;
                }
            }
        } else {
            pathFinished = true;
        }
        if (!pathFinished) {
            counter++;
        }
    }
    return { newPathBuffer, lastProcessedPathSegmentCounter: counter };
}

String.prototype.replaceAll = function (actual, replacement) {
    return this.replace(new RegExp(actual, "g"), replacement);
}
