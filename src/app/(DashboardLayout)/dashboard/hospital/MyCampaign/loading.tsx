import React from 'react';
import CampaignCardsSkeleton from '../../admin/VerifyCampaigns/loading';

const loading = () => {
    return (
      <div>
        <CampaignCardsSkeleton showCreator={false} showActions={false} />
      </div>
    );
};

export default loading;