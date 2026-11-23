import React from 'react';
import UserManagementTableSkeleton from '../users/loading';

const loading = () => {
    return (
        <div>
            <UserManagementTableSkeleton/>
        </div>
    );
};

export default loading;