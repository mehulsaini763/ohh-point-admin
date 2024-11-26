import React from 'react';
import DynamicTable from '../NewTable';

const BrandCard3 = ({ campaigns }) => {
    const getStatus = (startDate, endDate) => {
        const currentDate = new Date().setHours(0, 0, 0, 0); // Current date without time (only date)
        const start = new Date(startDate.seconds * 1000).setHours(0, 0, 0, 0); // Start date without time
        const end = new Date(endDate?.seconds * 1000).setHours(0, 0, 0, 0); // End date without time
    
        if (currentDate < start) {
          return 'Upcoming'; // If current date is before start date
        } else if (currentDate > end) {
          return 'Closed'; // If current date is after end date
        } else {
          return 'Active'; // If current date is between or on the start and end dates
        }
      };
    

  // Map campaigns data to match the table structure
  const campaignData = campaigns.map((campaign) => ({
    campaignName: campaign.campaignName, // "Campaign Name"
    campaignId: campaign.campaignId, // "Campaign ID"
    impressions: campaign.ipAddress?.length || 0, // Assuming moq represents impressions
    startDate: new Date(campaign.startDate.seconds * 1000).toLocaleDateString(), // Convert timestamp to readable date
    endDate: new Date(campaign.endDate?.seconds * 1000).toLocaleDateString(), // Convert timestamp to readable date
    status: getStatus(campaign.startDate, campaign.endDate), // Determine status based on dates
    budgetAllocated: `Rs. ${campaign.campaignBudget}`, // "Budget Allocated"
  }));

  return (
    <div className='w-full'>
      <DynamicTable
        headings={[
          "Campaign Name", 
          "Campaign ID", 
          "Impressions", 
          "Start Date", 
          "End Date", 
          "Status", 
          "Budget Allocated"
        ]}
        data={campaignData}
        rowsPerPage={2}
        pagination={true}
        functionn={(id) => alert(`Action for campaign ID: ${id}`)} // Placeholder for button actions
      />
    </div>
  );
};

export default BrandCard3;
