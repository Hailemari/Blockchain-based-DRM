import PurchaseContent from '../components/PurchaseContent';
import { useGetUserQuery } from '../services/authApi';

const Purchase = () => {
  const { data: user } = useGetUserQuery();
  console.log(user)
  return (
    <div>
      <PurchaseContent />
    </div>
  );
}


export default Purchase