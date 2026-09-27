import type { Profile } from '../type';

// ********************************************************************************
// == Type ========================================================================
/** the profile as exposed to the client; never includes the password hash */
export type PublicProfile = Omit<Profile, 'password_hash'>;

export type FetchCurrentProfileResponseData = {
 profile: PublicProfile;
};
