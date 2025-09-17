import { useSetAtom } from 'jotai';
import { userInfoKeyState, userInfoState } from '@/state';
import { authorize, getSetting, getUserInfo } from 'zmp-sdk/apis';
import { useAtomCallback } from 'jotai/utils';
import toast from 'react-hot-toast';

export function useRequestInformation() {
  const getStoredUserInfo = useAtomCallback(async (get) => {
    const userInfo = await get(userInfoState);
    return userInfo;
  });
  const setInfoKey = useSetAtom(userInfoKeyState);
  const refreshPermissions = () => setInfoKey((key) => key + 1);

  return async () => {
    const userInfo = await getStoredUserInfo();
    if (!userInfo) {
      await authorize({
        scopes: ["scope.userInfo", "scope.userPhonenumber"],
      }).then(refreshPermissions);
      return await getStoredUserInfo();
    }
    return userInfo;
  };
}
