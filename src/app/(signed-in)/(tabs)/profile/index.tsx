import { ProfileView } from "./view";
import { useProfileViewModel } from "./viewModel";

const Profile = () => {
  const methods = useProfileViewModel();
  return <ProfileView {...methods} />;
};

export default Profile;
