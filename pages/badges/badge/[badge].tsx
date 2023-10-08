import { useRouter } from 'next/router';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import Badges from '@modules/assessment/component/Badges/Badges';
import BadgesHeader from '@modules/assessment/component/Badges/BadgesHeader';
import MainLayout from '../../../components/Layout/MainLayout';

const Page: React.FC = () => {
  const params = useParams();
  const badgelabel = params.badge;

  const [scorePercentage, setScorePercentage] = useState<number>(90);
  const [isdownloadOpen, setIsdownloadOpen] = useState(false);
  const onClose = () => {
    setIsdownloadOpen(false);
  };

  return (
    <>
      <MainLayout activePage="marketplace" showDashboardSidebar={false} showFooter={true} showTopbar={true}>
        <BadgesHeader />
        <Badges
          scorePercentage={scorePercentage}
          badgelabel={badgelabel}
          setIsdownloadOpen={setIsdownloadOpen}
          isdownloadOpen={isdownloadOpen}
          onClose={onClose}
        />
      </MainLayout>
    </>
  );
};

export default Page;
