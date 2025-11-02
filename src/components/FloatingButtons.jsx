import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FloatButton, Tooltip } from "antd";
import { FaWhatsapp, FaCommentDots, FaCalculator } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function FloatingButtons() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleWhatsApp = () => {
    // Replace with your WhatsApp number
    window.open("https://wa.me/971509590444", "_blank");
  };

  const handlePrivateConsultation = () => {
    navigate("/consultation");
  };

  const handleCalculator = () => {
    navigate("/calculator");
  };

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  return (
    <FloatButton.Group
      open={open}
      onOpenChange={handleOpenChange}
      icon={
        open ? (
          <FiChevronUp style={{ fontSize: "20px" }} />
        ) : (
          <FiChevronDown style={{ fontSize: "20px" }} />
        )
      }
      trigger="click"
      style={{
        right: 24,
        bottom: 24,
      }}
      type="primary"
      shape="circle"
      className="custom-float-btn-group"
    >
      <Tooltip title="Calculator" placement="left">
        <FloatButton
          icon={<FaCalculator style={{ fontSize: "20px" }} />}
          onClick={handleCalculator}
          data-calculator="true"
        />
      </Tooltip>
      <Tooltip title="WhatsApp" placement="left">
        <FloatButton
          icon={<FaWhatsapp style={{ fontSize: "20px" }} />}
          onClick={handleWhatsApp}
          data-whatsapp="true"
        />
      </Tooltip>
      <Tooltip title="Private Consultation" placement="left">
        <FloatButton
          icon={<FaCommentDots style={{ fontSize: "20px" }} />}
          onClick={handlePrivateConsultation}
          data-consultation="true"
        />
      </Tooltip>
    </FloatButton.Group>
  );
}
