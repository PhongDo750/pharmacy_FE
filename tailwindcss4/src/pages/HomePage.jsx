import { useState } from "react";
import Tabbar from "../components/Tabbar";
import UnitManagement from "./UnitManagement";
import ProductManagement from "./ProductManagement";
import ReceptionManagement from "./ReceiptionManagement"
import OrderManagement from "./OrderManagement";
import UserManagement from "./UserManagement";
import StatisticManagement from "./StatisticManagement";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("unit");

  const renderContent = () => {
    switch (activeTab) {
      case "unit":
        return <UnitManagement />;
      case "product":
        return <ProductManagement />;
      case "receiption" :
        return <ReceptionManagement />;
      case "order" :
        return <OrderManagement />
      case "user" : 
        return <UserManagement />
      case "statistic":
        return <StatisticManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Trang quản lý</h1>
      <Tabbar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="mt-4">{renderContent()}</div>
    </div>
  );
}

