const logger = require('./logger');

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method);
    logger.info('Path:  ', request.path);
    logger.info('Body:  ', request.body);

    logger.info('---');
    next();
};


const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token =  authorization.substring(7);
    }
    logger.info('Token extracted: ', request.token);
    next();
};



const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
    /// Logging ///

    // Error handling
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({
            error: 'invalid token'
        });
    } else if (error.name === 'ReferenceError'){
        return response.status(404).json({ error: 'book not found'})
    } else if (error.name === 'EmptyResultError'){
        return response.status(404).json({error: error.message})
    } else if (error.name === 'QueryError'){
        return response.status(400).json({error: error.message})        // Should not go here
    } else if (error.name === 'UniqueConstraintError'){
        return response.status(500).json({error: 'Unique Constraint Error'})
    }

    next(error);
};


const databaseLogger = (request, response, next) => {
    logger.info('-----------------------Entered logger for database----------------------')
    logger.info(response.body);
    //
    // logger.winstonLogger.log({
    //     level: 'info',
    //     message: mes,
    //     meta: {
    //         request:
    //             {
    //                 path: request.path,
    //                 body: request.body,
    //                 method: request.method,
    //             },
    //         response:
    //             {
    //                 statusCode: response.statusCode,
    //                 statusMessage: response.body
    //             }
    //     }
    // })
    next()

}


module.exports = {
    requestLogger,
    tokenExtractor,
    unknownEndpoint,
    errorHandler,
    databaseLogger
};



