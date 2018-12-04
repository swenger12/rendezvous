// Standard Node modules
const Path = require("path");

// Knex
const knex = require('knex')({
    client: 'pg',
    connection: {
        host: "faraday.cse.taylor.edu",
        database: "sarah_wenger",
        user: "sarah_wenger",
        password: "bayinore"
    }
});

// Objection
const Model = require('objection').Model;
Model.knex(knex);

// Hapi
const Joi = require('joi');
const Boom = require('boom');
const Hapi = require('hapi');
const server = Hapi.server({
    host: 'localhost',
    port: 3000
});

Team = require('./Team');
Member = require('./Member');

server.route([
    //////////////// Create ////////////////
    {
        method: 'POST',
        path: '/Teams',
        config: {
            description: 'Create Team',
            validate: {
                payload: {
                    name: Joi.string().min(1).required(),
                    city: Joi.string().min(1).required(),
                    state: Joi.string().length(2).required()
                }
            }
        },
        handler: async (request, h) => {
            let Team = await Team.query().insert(request.payload);
            return Team;
        }
    },

    //////////////// Retrieve ////////////////
    {
        method: 'GET',
        path: '/Teams',
        config: {
            description: 'Retrieve all Teams'
        },
        handler: async (request, h) => {
            return await Team.query();
        }
    },
    {
        method: 'GET',
        path: '/Teams/{Team_id}',
        config: {
            description: 'Retrieve one Team',
            validate: {
                params: {
                    Team_id: Joi.number().integer().min(0)
                }
            }
        },
        handler: async (request, h) => {
            return await Team.query()
                .where('id', request.params.Team_id)
                .eager('Members');
        }
    },

    //////////////// Update ////////////////
    /*{
        method: 'PUT',
        path: '/Teams/{Team_id}',
        config: {
            description: 'Replace a Team',
            validate: {
                params: {
                    Team_id: Joi.number().integer().min(0)
                },
                payload: {
                    name: Joi.string().min(1).required(),
                    city: Joi.string().min(1).required(),
                    state: Joi.string().length(2).required()
                }
            }
        },
        handler: async (request, h) => {
            let rowsUpdated = await Team.query()
                .update(request.payload)
                .where('id', request.params.Team_id);
            return {updated: rowsUpdated};
        }
    },
    {
        method: 'PATCH',
        path: '/Teams/{Team_id}',
        config: {
            description: 'Update a Team',
            validate: {
                params: {
                    Team_id: Joi.number().integer().min(0)
                },
                payload: {
                    name: Joi.string().min(1),
                    city: Joi.string().min(1),
                    state: Joi.string().length(2)
                }
            }
        },
        handler: async (request, h) => {
            let rowsUpdated = await Team.query()
                .update(request.payload)
                .where('id', request.params.Team_id);
            return {updated: rowsUpdated};
        }
    },

    //////////////// Delete ////////////////
    {
        method: 'DELETE',
        path: '/Teams/{Team_id}',
        config: {
            description: 'Delete a Team',
            validate: {
                params: {
                    Team_id: Joi.number().integer().min(0)
                }
            }
        },
        handler: async (request, h) => {
            let rowsDeleted = await Team.query()
                .delete()
                .where('id', request.params.Team_id);
            if (rowsDeleted == 1) {
                return {deleted: rowsDeleted};
            } else {
                return Boom.notFound(`Query returned ${rowsDeleted} rows`);
            }
        }
    }*/
]);

// Catch promises lacking a .catch.
process.on('unhandledRejection', err => {
    console.error(err);
    process.exit(1);
});

// Fire up the server.
async function init() {
    // Configure plug-ins.
    await server.register([
        require('vision'),
        require('inert'),
        require('lout')
    ]);

    await server.register(require('blipp'));

    // Configure logging.
    await server.register({
        plugin: require('hapi-pino'),
        options: {
            prettyPrint: true
        }
    });

    // Start the server.
    await server.start();
    console.log(`Server running at ${server.info.uri}`);
}

// Go!
init();
