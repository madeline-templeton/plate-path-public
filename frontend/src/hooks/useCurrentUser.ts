import { useAuth } from "../contexts/AuthContext";

export default function useCurrentUser() {
  const { user } = useAuth();
  return user;
}
