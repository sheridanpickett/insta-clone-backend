const { initializeApp, cert } = require('firebase-admin/app');

let serviceAccount = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
serviceAccount = JSON.parse(serviceAccount);

initializeApp({
  credential: cert(serviceAccount)
});