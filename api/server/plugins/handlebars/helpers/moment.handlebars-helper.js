import MomentHandler from 'handlebars.moment';

export const name = 'Handlebars moment';

export default ({ Handlebars }) => {

  MomentHandler.registerHelpers(Handlebars);
};
