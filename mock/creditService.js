// This is a mock credit bureau service
// In the real world this would connect to a real credit bureau
// like Compuscan or TransUnion Malawi
// We're faking it with hardcoded data to simulate realistic responses

// Fake credit database
// Credit score is between 300 (very bad) and 850 (excellent)
// activeLoans is how many loans they currently have running
// hasDefaults means they have unpaid loans in the past
const creditDatabase = {
  'NAT001': { creditScore: 750, activeLoans: 1, hasDefaults: false },
  'NAT002': { creditScore: 620, activeLoans: 2, hasDefaults: false },
  'NAT003': { creditScore: 580, activeLoans: 1, hasDefaults: true  },
  'NAT004': { creditScore: 810, activeLoans: 0, hasDefaults: false },
  'NAT005': { creditScore: 450, activeLoans: 4, hasDefaults: true  },
};

// This function checks the credit history of a person by their national ID
const checkCredit = (nationalId) => {

  // Look up the person in our fake credit database
  const record = creditDatabase[nationalId];

  // If person not found return an error response
  if (!record) {
    return {
      success: false,
      error: 'National ID not found in credit bureau database'
    };
  }

  // If person is found return their credit details
  return {
    success: true,
    data: {
      nationalId,
      creditScore:  record.creditScore,
      activeLoans:  record.activeLoans,
      hasDefaults:  record.hasDefaults,
      rating: record.creditScore >= 750 ? 'Excellent' :
              record.creditScore >= 700 ? 'Good' :
              record.creditScore >= 650 ? 'Fair' :
              record.creditScore >= 600 ? 'Poor' : 'Very Poor'
    }
  };
};

// Export so our loan service can use this function
module.exports = { checkCredit };