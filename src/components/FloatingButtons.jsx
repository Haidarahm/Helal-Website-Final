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
        <span role="img" aria-label="Open quick actions">
          <FiChevronDown style={{ fontSize: "20px" }} aria-hidden />
        </span>
      }
      closeIcon={
        <span role="img" aria-label="Close quick actions">
          <FiChevronUp style={{ fontSize: "20px" }} aria-hidden />
        </span>
      }
      trigger="click"
      style={{
        right: 24,
        bottom: 24,
      }}
      type="primary"
      shape="circle"
      className="custom-float-btn-group"
      aria-label="Quick actions menu"
    >
      <Tooltip title="Calculator" placement="left">
        <FloatButton
          icon={
            <>
              <span className="sr-only">Open Calculator</span>
              <FaCalculator style={{ fontSize: "20px" }} aria-hidden />
            </>
          }
          onClick={handleCalculator}
          data-calculator="true"
          aria-label="Open Calculator"
        />
      </Tooltip>
      <Tooltip title="WhatsApp" placement="left">
        <FloatButton
          icon={
            <>
              <span className="sr-only">Contact on WhatsApp</span>
              <FaWhatsapp style={{ fontSize: "20px" }} aria-hidden />
            </>
          }
          onClick={handleWhatsApp}
          data-whatsapp="true"
          aria-label="Contact on WhatsApp"
        />
      </Tooltip>
      <Tooltip title="Private Consultation" placement="left">
        <FloatButton
          icon={
            <>
              <span className="sr-only">Book private consultation</span>
              <FaCommentDots style={{ fontSize: "20px" }} aria-hidden />
            </>
          }
          onClick={handlePrivateConsultation}
          data-consultation="true"
          aria-label="Book private consultation"
        />
      </Tooltip>
    </FloatButton.Group>
  );
}
