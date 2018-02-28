import firebase from 'firebase'
import FirebaseServer from 'firebase-server'
import detect from 'detect-port'
import Jest from 'jest'

export async function startFirebaseTestServer () {
    let server
  const port = await detect(5000)
  if (port === 5000) {
        server = new FirebaseServer(5000, '127.0.0.1', {})
  }
    firebase.initializeApp({ databaseURL: 'ws://127.0.1:5000' })
  const dbRef = firebase.app().database().ref()
  return { server, dbRef }
}
let dbRef
beforeAll(async () => {
    ({ dbRef } = await startFirebaseTestServer())
})
