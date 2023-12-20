const BC = require('bcrypt')
// ###########
// VALIDATE FN
// ###########
const validate = async (request, username, password) => {
  const user = users[username];
  if (!user) {
	  return { credentials: null, isValid: false };
  }
  const isValid = await BC.compare(password, user.password)
  const credentials = { id: user.id, name: user.name };
  
  return { isValid, credentials};
}

module.exports = validate; 