import util from 'util';

const log = (data) => console.log(util.inspect(data, false, 5, true));

export default log;
