"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import styles from "./Modal.module.css";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal({
  children,
  onClose,
}: ModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (event.target === backdropRef.current) {
      onClose();
    }
  };

  return createPortal(
    <div
      ref={backdropRef}
      className={styles.backdrop}
      onClick={handleBackdropClick}
    >
      <div className={styles.modal}>
        {children}
      </div>
    </div>,
    document.body,
  );
}