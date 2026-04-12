// This is a mock salary verification service
// In the real world this would connect to a bank or payroll system
// We're faking it with hardcoded data to simulate realistic responses

// Fake database of people and their salaries
// Each person is identified by their national ID
const salaryDatabase = {
  'NAT001': { name: 'Jester Chamba',  salary: 150000, employer: 'Chamba Inc',      status: 'active' },
  'NAT002': { name: 'China Banda',    salary: 80000,  employer: 'Malawi Telecom',   status: 'active' },
  'NAT003': { name: 'Geo Phiri',      salary: 45000,  employer: 'ABC Supermarket',  status: 'active' },
  'NAT004': { name: 'Grace Mwale',    salary: 200000, employer: 'First Capital Bank', status: 'active' },
  'NAT005': { name: 'John Banda',     salary: 30000,  employer: 'Self Employed',    status: 'inactive' },
};

//This function checks of a person by thier national ID
//it returns thier thier salary or an error if not found

const verifySalary = (nationalID) => {
    const person = salaryDatabase[nationalID];

    if(!person){
        return {
            success: false,
            error: 'National ID not found in salary'
        };
    }

    return{
        success: true,
        data:{
            name: person.name,
            salary: person.salary,
            employer: person.employer,
            status: person.status,
        }
    };

};

module.exports = {verifySalary};