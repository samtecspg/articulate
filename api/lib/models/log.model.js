import Joi from 'joi';

class LogModel {
    static get schema() {
        return {
            '@timestamp': Joi
                .string()
                .description('Timestamp')
                .trim(),
            host: Joi
                .object()
                .description('Host'),
            agent: Joi
                .object()
                .description('Agent'),
            log: Joi
                .object()
                .description('Log'),
            stream: Joi
                .string()
                .description('Timestamp')
                .trim(),
            ecs: Joi
                .object()
                .description('Ecs'),
            event: Joi
                .object()
                .description('Event'),
            message: Joi
                .string()
                .description('Timestamp')
                .trim(),
            input: Joi
                .object()
                .description('Input'),
            container: Joi
                .object()
                .description('Container'),
        }
    }
}

module.exports = LogModel;
