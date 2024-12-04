// the client ID identifies each unique instance of this application
// for example, even if logged in to the same account, different tabs in the browser will have different client ID's
// this is used to determine if a notificiation originated from the current client
export const CLIENT_ID = crypto.randomUUID();
