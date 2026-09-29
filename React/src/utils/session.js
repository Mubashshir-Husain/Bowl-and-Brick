import { v4 as uuidv4 } from 'uuid';

const SESSION_KEY = 'bowl_brick_session_id';

export const getOrCreateSessionId = () => {
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = uuidv4();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};
