const bcrypt = require('bcryptjs');

const password = 'betaadmin123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
  if (err) {
    console.error('Error generating hash:', err);
    return;
  }
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\nAdd this to your .env.local:');
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
});