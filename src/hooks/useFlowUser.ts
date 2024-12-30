import { useEffect, useState } from 'react';
import * as fcl from '@onflow/fcl';

export default function useFlowUser() {
  const [user, setUser] = useState({ addr: null });

  const logIn = () => {
    fcl.authenticate();
  };

  const logOut = () => {
    fcl.unauthenticate();
  };

  useEffect(() => {
    fcl.currentUser().subscribe(setUser);
  }, []);

  return {
    flowUser: user,
    flowLoggedIn: user?.addr != null,
    flowLogIn: logIn,
    flowLogOut: logOut
  };
}
