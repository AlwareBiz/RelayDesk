import type { Profile, ProfileInsert } from '../../schema/entity/profile';

// ********************************************************************************
// == Interface ===================================================================
export interface ProfileFinderService {
 findByEmail(email: Profile['email']): Promise<Profile | null>;
 findById(id: Profile['id']): Promise<Profile | null>;
}

export interface ProfileLifecycleService {
 create(data: ProfileInsert): Promise<Profile>;
}
