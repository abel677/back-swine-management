import * as admin from 'firebase-admin';
import { envConfig } from './envConfig';

// const serviceAccount = require(
//   path.resolve(__dirname, './swine-management-firebase.json'),
// );
const serviceAccount = JSON.parse(envConfig.GOOGLE_SERVICE_ACCOUNT!);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
