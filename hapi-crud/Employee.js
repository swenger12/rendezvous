const { Model } = require('objection');

class Member extends Model {
  static get tableName() {
	return 'Member';
  }
  static get relationMappings() {
	return {
	  employer: {
		relation: Model.BelongsToOneRelation,
		modelClass: require('./Team'),
		join: {
		  from: 'Member.employer_id',
		  to: 'Team.id'
		}
	  }
	};
  }
}

module.exports = Member;
