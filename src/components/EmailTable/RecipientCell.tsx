"use client";

import { useState, useEffect, useRef } from "react";

interface RecipientCellProps {
  recipients: string;
}

export const RecipientCell = ({ recipients }: RecipientCellProps) => {
  const allRecipients = recipients.split(",").map((r) => r.trim());
  const cellRef = useRef<HTMLTableCellElement>(null);
  const [maxVisible, setMaxVisible] = useState(allRecipients.length);
  const [isCalculating, setIsCalculating] = useState(true);

  useEffect(() => {
    const calculateMaxVisible = () => {
      if (!cellRef.current) return;

      setIsCalculating(true);

      requestAnimationFrame(() => {
        const cellWidth = cellRef.current!.clientWidth;
        const approxEmailWidth = 80;
        const possible = Math.floor(cellWidth / approxEmailWidth);

        const newMax = Math.max(1, Math.min(possible, allRecipients.length));
        setMaxVisible(newMax);
        setIsCalculating(false);
      });
    };

    calculateMaxVisible();
    window.addEventListener("resize", calculateMaxVisible);
    return () => window.removeEventListener("resize", calculateMaxVisible);
  }, [allRecipients.length]);

  const visibleRecipients = allRecipients.slice(0, maxVisible);
  const hiddenCount = allRecipients.length - visibleRecipients.length;

  if (isCalculating) {
    return (
      <td
        ref={cellRef}
        className="border p-2 w-1/5 overflow-hidden whitespace-nowrap text-ellipsis"
      >
        Carregando....
      </td>
    );
  }

  return (
    <td
      ref={cellRef}
      className="border p-2 w-1/5 overflow-hidden whitespace-nowrap text-ellipsis"
      title={hiddenCount > 0 ? `+${hiddenCount} e-mails ocultos` : ""}
    >
      {visibleRecipients.join(", ")}
      {hiddenCount > 0 && <>...</>}
    </td>
  );
};
