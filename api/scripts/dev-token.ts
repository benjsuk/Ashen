import { auth } from "./firebase";

const uid = process.argv[2] ?? "test-user-123";
const customToken = await auth.createCustomToken(uid);

const res = await fetch(
  "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=fake",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: customToken, returnSecureToken: true }),
  },
);
const data = (await res.json()) as { idToken?: string };
console.log(data.idToken);
