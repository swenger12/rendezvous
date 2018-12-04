const { Model} = require('objection');

class Teams extends Model {
    static get tableName(){
        return 'team';
    }
    static get relatioMapping(){
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