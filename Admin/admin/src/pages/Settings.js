// src/pages/Settings.js
import React, { useState } from "react";
import GeneralSettings from "../components/GeneralSettings";
import PaymentSettings from "../components/PaymentSettings";
import ShippingSettings from "../components/ShippingSettings";
import EmailSettings from "../components/EmailSettings";
import RolesPermissions from "../components/RolesPermissions";

import styles from "../styles/setting.module.css";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");

  const renderTab = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSettings />;
      case "payment":
        return <PaymentSettings />;
      case "shipping":
        return <ShippingSettings />;
      case "email":
        return <EmailSettings />;
      case "roles":
        return <RolesPermissions />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabHeader}>
        <button
          className={activeTab === "general" ? styles.active : ""}
          onClick={() => setActiveTab("general")}
        >
          General
        </button>
        <button
          className={activeTab === "payment" ? styles.active : ""}
          onClick={() => setActiveTab("payment")}
        >
          Payment
        </button>
        <button
          className={activeTab === "shipping" ? styles.active : ""}
          onClick={() => setActiveTab("shipping")}
        >
          Shipping
        </button>
        <button
          className={activeTab === "email" ? styles.active : ""}
          onClick={() => setActiveTab("email")}
        >
          Email
        </button>
        <button
          className={activeTab === "roles" ? styles.active : ""}
          onClick={() => setActiveTab("roles")}
        >
          Roles
        </button>
      </div>

      <main className={styles.content}>{renderTab()}</main>
    </div>
  );
};

export default SettingsPage;
