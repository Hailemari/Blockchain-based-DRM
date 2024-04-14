

const ProfileForm = () => {
    return (
        <div className="bg-gray-200 p-4 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold">Profile</h1>
            <div className="flex items-center mt-4">
                <img src="user-avatar.png" alt="User Avatar" className="w-16 h-16 rounded-full" />
                <div className="ml-4">
                    <h2 className="text-xl font-semibold">John Doe</h2>
                    <p className="text-gray-600">Email: john.doe@example.com</p>
                    <p className="text-gray-600">Location: New York, USA</p>
                    <p className="text-gray-600">Role: Content Creator</p>
                    <p className="text-gray-600">Member Since: 2021</p>
                </div>
            </div>
        </div>
    );
};

export default ProfileForm;