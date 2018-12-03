// Standard Node modules
const Path = require("path");

// Knex
const knex = require('knex')({
    client: 'pg',
    connection: {
        host: "faraday.cse.taylor.edu",
        database: "lily_pratico",
        user: "lily_pratico",
        password: "velaruve"
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

Company = require('./Company');
Employee = require('./Employee');

server.route([
    //////////////// Create ////////////////
    {
        method: 'POST',
        path: '/companies',
        config: {
            description: 'Create company',
            validate: {
                payload: {
                    name: Joi.string().min(1).required(),
                    city: Joi.string().min(1).required(),
                    state: Joi.string().length(2).required()
                }
            }
        },
        handler: async (request, h) => {
            let company = await Company.query().insert(request.payload);
            return company;
        }
    },

    //////////////// Retrieve ////////////////
    {
        method: 'GET',
        path: '/companies',
        config: {
            description: 'Retrieve all companies'
        },
        handler: async (request, h) => {
            return await Company.query();
        }
    },
    {
        method: 'GET',
        path: '/companies/{company_id}',
        config: {
            description: 'Retrieve one company',
            validate: {
                params: {
                    company_id: Joi.number().integer().min(0)
                }
            }
        },
        handler: async (request, h) => {
            return await Company.query()
                .where('id', request.params.company_id)
                .eager('employees');
        }
    },

    //////////////// Update ////////////////
    {
        method: 'PUT',
        path: '/companies/{company_id}',
        config: {
            description: 'Replace a company',
            validate: {
                params: {
                    company_id: Joi.number().integer().min(0)
                },
                payload: {
                    name: Joi.string().min(1).required(),
                    city: Joi.string().min(1).required(),
                    state: Joi.string().length(2).required()
                }
            }
        },
        handler: async (request, h) => {
            let rowsUpdated = await Company.query()
                .update(request.payload)
                .where('id', request.params.company_id);
            return {updated: rowsUpdated};
        }
    },
    {
        method: 'PATCH',
        path: '/companies/{company_id}',
        config: {
            description: 'Update a company',
            validate: {
                params: {
                    company_id: Joi.number().integer().min(0)
                },
                payload: {
                    name: Joi.string().min(1),
                    city: Joi.string().min(1),
                    state: Joi.string().length(2)
                }
            }
        },
        handler: async (request, h) => {
            let rowsUpdated = await Company.query()
                .update(request.payload)
                .where('id', request.params.company_id);
            return {updated: rowsUpdated};
        }
    },

    //////////////// Delete ////////////////
    {
        method: 'DELETE',
        path: '/companies/{company_id}',
        config: {
            description: 'Delete a company',
            validate: {
                params: {
                    company_id: Joi.number().integer().min(0)
                }
            }
        },
        handler: async (request, h) => {
            let rowsDeleted = await Company.query()
                .delete()
                .where('id', request.params.company_id);
            if (rowsDeleted == 1) {
                return {deleted: rowsDeleted};
            } else {
                return Boom.notFound(`Query returned ${rowsDeleted} rows`);
            }
        }
    }
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
