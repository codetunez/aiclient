import './importHistory.css';
import { useState } from "react";
import { useGptContext } from "../hooks/useGptContext";
import Modal from "../modal";

export function ImportHistory(data: any) {
  const gptContext: any = useGptContext();
  const [importing, setImporting] = useState<boolean>(false);
  const [importData, setImportData] = useState<string>("");

  const handleImport = () => {
    setImporting(true);
  };

  const renderModal = () => {
    return (
      <Modal>
        <div id="importContainer">
          <div>
            <textarea
              placeholder="import history"
              name="import"
              onChange={(e: any) => {
                setImportData(e.target.value);
              }}
            ></textarea>
          </div>
          <div>
            <button
              className="button-primary"
              onClick={() => gptContext.importHistory(importData)}
            >
              Import
            </button>
            <button
              className="button-secondary"
              onClick={() => setImporting(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <>
      <button onClick={handleImport}>import</button>
      {importing && renderModal()}
    </>
  );
}
