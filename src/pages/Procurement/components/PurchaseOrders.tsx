
import React from 'react';
import SAPTile from '../../../components/SAPTile';
import { useVoiceAssistantContext } from '../../../context/VoiceAssistantContext';

const PurchaseOrders: React.FC = () => {
  const { isEnabled } = useVoiceAssistantContext();
  
  return (
    <>
      <SAPTile 
        title="Create Purchase Order"
        isVoiceAssistantEnabled={isEnabled}
        description="Create new purchase orders for goods or services."
        icon={<span className="text-xl">📝</span>}
        examples="When creating a purchase order, you'll need to select a supplier, add materials or services, specify quantities and prices, and set delivery terms."
      />
      <SAPTile 
        title="Purchase Order Overview"
        isVoiceAssistantEnabled={isEnabled}
        description="View and manage existing purchase orders."
        icon={<span className="text-xl">📋</span>}
        examples="The overview provides a list of all purchase orders with their status. You can filter by supplier, status, or date range to find specific orders."
      />
      <SAPTile 
        title="Order Tracking"
        isVoiceAssistantEnabled={isEnabled}
        description="Track the status of your purchase orders."
        icon={<span className="text-xl">🔍</span>}
        examples="Follow your orders through each stage from creation to delivery and payment. You'll see current status, expected delivery dates, and any issues that need attention."
      />
      <SAPTile 
        title="Purchase Requisitions"
        isVoiceAssistantEnabled={isEnabled}
        description="Create and manage purchase requisitions."
        icon={<span className="text-xl">📄</span>}
        examples="Purchase requisitions are internal requests for goods or services that can later be converted to purchase orders after approval."
      />
    </>
  );
};

export default PurchaseOrders;
