import { getUser } from '@/server/user/user.service';
import ViewProfile from './components/ViewProfile';

export const metadata = {
    title: "Admin Profile",
    description: "Admin profile page",
};

const page = async () => {
    const profile = await getUser();

    if (!profile.data) {
        return (
            <div>
                <p>Error fetching profile data: {profile.message}</p>
            </div>
        );
    }
    return (
        <div>
            <ViewProfile profile={profile.data} />
        </div>
    );
};

export default page;