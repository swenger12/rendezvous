const { Model } = require('objection');

class Team extends Model {
  static get tableName() {
	return 'Team';
  }
  static get relationMappings() {
	return {
	  Members: {
		relation: Model.HasManyRelation,
		modelClass: require('./Member'),
		join: {
		  from: 'Team.id',
		  to: 'Member.employer_id'
		}
	  }
	};
  }
}

module.exports = Team;
