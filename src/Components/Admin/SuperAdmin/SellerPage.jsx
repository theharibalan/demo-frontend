import React, { useEffect } from "react";
import { Tabs } from "antd";
import SellerDashboard from "./SuperAdminComponents/SellerDashboard";
import AllPos from "./SuperAdminComponents/AllPos";
import SellerPriceComparisionPage from "../SuperAdmin/SuperAdminComponents/SellerPriceComparisionPage"
import AllSellersProducts from "../SuperAdmin/SuperAdminComponents/AllSellerProducts";
import PendingPos from "../SuperAdmin/SuperAdminComponents/PendingPos"
import CompletedPos from "../SuperAdmin/SuperAdminComponents/CompletedPos"
import PublishedProducts from "../SuperAdmin/SuperAdminComponents/PublishedProducts"
const SellerPage = () => {
  useEffect(()=>{
    localStorage.setItem('activeTab',"2")
  },[])
  return (
    <div>
      <Tabs defaultActiveKey="1" className="custom-tabs">
        <Tabs.TabPane tab="Seller Dashboard" key="1">
            <SellerPriceComparisionPage />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Sellers" key="2">
            <SellerDashboard style={{width:"80vw"}} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="All Products" key="3">
          <AllSellersProducts />
        </Tabs.TabPane>
        <Tabs.TabPane tab="All POs" key="4">
            <AllPos/>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Pending POs" key="5">
          <PendingPos />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Received POs" key="6">
          <CompletedPos />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Published Products " key="7">
          <PublishedProducts />
        </Tabs.TabPane>
        
      </Tabs>
    </div>
  );
};

export default SellerPage;
