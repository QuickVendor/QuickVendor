
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingState from '@/components/LoadingState';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home page immediately
    navigate('/home', { replace: true });
  }, [navigate]);

  return <LoadingState message="Redirecting..." />;
};

export default Index;
