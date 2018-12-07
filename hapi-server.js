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

async function init() {
    // Show routes at startup.
    await server.register(require("blipp"));

    // Output logging information.
    await server.register({
        plugin: require("hapi-pino"),
        options: {
            prettyPrint: true
        }
    });

    // Configure static file service.
    await server.register(require("inert"));

    // Configure routes.
    server.route([
        //WHAT THE DATABASE DOES WHEN SIGNING IN
        {
            method: "POST",
            path: "/api/members",
            config: {
                description: "Sign in as a member",
                validate: {
                    payload: {

                        email: Joi.string()
                            .email()
                            .required(),
                        password: Joi.string().required()
                    }
                }
            },
            handler: async (request, h) => {
                let resultSet = await knex("members")
                    .select()
                    .where("email", request.payload.email);

                if (resultSet.length > 0) {
                    return {
                        ok: true,
                        msge: `Welcome back '${request.payload.email}'`
                    };
                }

                let result = await knex("members").insert({

                    email: request.payload.email,
                    password: request.payload.password
                });

                if (result.rowCount === 1) {

                    //first time sign in, add core hours
                    return {
                        ok: true,
                        msge: `Signed in '${request.payload.email}'`
                    };

                } else {
                    return {
                        ok: false,
                        msge: `Couldn't add '${
                            request.payload.email
                            }' to the database`
                    };
                }
            }
        },

        {

            method: "POST",
            path: "/api/core-hours",
            config: {
                description: "Set core hours",
                validate: {
                    payload:{
                        email: Joi.string()
                            .email()
                            .required(),
                        startdatetime: Joi.string().required(),
                        enddatetime: Joi.string().required(),
                        day: Joi.string().required(),
                    }
                }
            },
            handler: async (request, h) => {

                /*let resultSet = await knex("corehours")
                    .select()
                    .where("email", request.payload.email);
*/

                let result = await knex("corehours").insert({

                    email: request.payload.email,
                    startdatetime: request.payload.startdatetime,
                    enddatetime: request.payload.enddatetime,
                    day: request.payload.day,
                });
                return{
                    ok: true,
                    //msge: `Added Core Hour'`
                };
            }
        },

        {
            method: "POST",
            path: "/api/reset-password",
            config: {
                description: "Reset your password",
                validate: {
                    payload: {
                        email: Joi.string().email().required(),
                        original_password: Joi.string().required(),
                        new_password: Joi.string().required(),
                        validate_password: Joi.string().required()
                    }
                }
            },
            handler: async (request, h) => {
                if (request.payload.new_password !== request.payload.validate_password){
                    return{
                        ok: false,
                        msge: `Passwords do not match!`
                    };
                }

                let emailCheck = await knex("teams").select().where("email", request.payload.email)
                let passwordCheck = await knex("teams").select("password").where("email", request.payload.email)

                if (emailCheck.length === 1){
                    if (passwordCheck === request.payload.original_password){
                        let result = await knex("teams").insert({
                            password: request.payload.new_password
                        });
                        if (result.rowCount === 1){
                            return{
                                ok: true,
                                msge: `Password changed successfully!'`
                            };
                        }

                    }
                }else return {
                    ok: false,
                    msge: "Does not work"
                };
            }
        },

        {
            method: "GET",
            path: "/api/teams",
            config: {
                description: "Retrieve all teams"
            },
            handler: async (request, h) => {
                return knex("teams").select("email", "firstname", "lastname");
            }
        },
        {
            method: "GET",
            path: "/{param*}",
            config: {
                description: "Production Application"
            },
            handler: {
                directory: {
                    path: ".",
                    redirectToSlash: true,
                    index: true
                }
            }
        }
    ]);

    // Start the server.
    await server.start();
    server.logger().info(`Server running at ${server.info.uri}`);
}

process.on("unhandledRejection", err => {
    server.logger().error(err);
    process.exit(1);
});

// Go!
init();









/*
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
*/