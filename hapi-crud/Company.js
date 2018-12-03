const { Model } = require('objection');

class Company extends Model {
  static get tableName() {
	return 'company';
  }
  static get relationMappings() {
	return {
	  employees: {
		relation: Model.HasManyRelation,
		modelClass: require('./Employee'),
		join: {
		  from: 'company.id',
		  to: 'employee.employer_id'
		}
	  }
	};
  }
}

module.exports = Company;
