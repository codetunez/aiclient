import React, { useState } from "react";

export function ExportHistory(data: any) {
  const currentDate = new Date();
  const dateLabel =
    "" +
    currentDate.getFullYear() +
    currentDate.getMonth() +
    currentDate.getDay() +
    currentDate.getHours() +
    currentDate.getMinutes();

  const [fileName, setFileName] = useState(
    "aiclient_history_" + dateLabel + ".json"
  );

  const handleExport = () => {
    const json = JSON.stringify(data.data);
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  return (
    <>
      <input
        type="hidden"
        placeholder="Enter file name"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
      />
      <button onClick={handleExport}>export</button>
    </>
  );
}