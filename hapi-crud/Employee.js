const { Model } = require('objection');

class Employee extends Model {
  static get tableName() {
	return 'employee';
  }
  static get relationMappings() {
	return {
	  employer: {
		relation: Model.BelongsToOneRelation,
		modelClass: require('./Company'),
		join: {
		  from: 'employee.employer_id',
		  to: 'company.id'
		}
	  }
	};
  }
}

module.exports = Employee;
