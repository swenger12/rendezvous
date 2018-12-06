const { Model} = require('objection');

class Team extends Model {
    static get tableName(){
        return 'team';
    }
    static get relationMapping(){
        return{
            employees: {
                relation: Model.HasManyRelation,
                modelClass: require('./Member'),
                join: {
                    from: 'team_id',
                    to: 'member.email'
                }
            }
        };
    }
}

module.exports = Team;