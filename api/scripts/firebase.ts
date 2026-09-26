import { cert, initializeApp } from "firebase-admin/app";
import { config } from "../config";
import { getAuth } from "firebase-admin/auth";

const app = initializeApp({
  credential: cert("./firebase-service-account.json"),
  projectId: config.firebase.projectId,
});

export const auth = getAuth(app);
