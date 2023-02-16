import { useState } from "react";
import IQuery from "../core/entities/IQuery";

export function GenerateReport(data: any) {
  const currentDate = new Date();
  const dateLabel =
    "" +
    currentDate.getFullYear() +
    currentDate.getMonth() +
    currentDate.getDay() +
    currentDate.getHours() +
    currentDate.getMinutes();
  const [fileName, setFileName] = useState(
    "openAI_prompt_history_" + dateLabel + ".html"
  );

  const handleReport = () => {
    const blob = new Blob([generateReport()], {
      type: "Text/plain;charset=UTF-8",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  const generateReport = () => {
    let html = "<html><body>";
    html += "<style>body {font-size: 15px;} </style>";
    html += `<style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      font-size: 15px;
    }
    div.queryContainer {
        padding:20px;
    }
    div.prompt, div.result 
    { resize: none; padding:10px; white-space: pre-wrap; border: rgb(209, 209, 209) solid 1px; height:150px; background:rgb(241, 241, 241);} 
    div.details {padding:10px; } 
    div.result { font-family:monospace; margin-top:0; border-top-left-radius:0; border-top-right-radius: 0; overflow-y: auto; } 
    div.prompt { font-family:monospace; margin-bottom:0; border-bottom-left-radius:0; border-bottom-right-radius: 0; overflow-y: auto;  }
    </style>
    <script>
    function copy(id) {
      var txt = document.getElementById(id).innerHTML;
      navigator.clipboard.writeText(txt);
    }</script>`;
    html += data.data.map((q: IQuery, index: number) => {
      return `<div class="queryContainer">
      <h2>${index + 1} - ${q.queryProfile.prompt.substring(0, 40)}</h2>
        <div>
        <div class="prompt" id="prompt-${q.id}">${q.queryProfile.prompt}</div></div>
        <div><a href="#" onclick="copy('prompt-${q.id}'); return false;">copy prompt</a></div>
        <h5>Response:</h5>
        <div>
        <div class="result" id="result-${q.id}">${q.result}</div></div>
        <div><a href="#" onclick="copy('result-${q.id}'); return false;">copy result</a></div>
        <div class="details">
        ${q.api}<br/>
        ${q.date}<br/>
            ${q.queryProfile.model} (${q.format})<br/>
            ${q.ms}ms<br/>
            ${q.tokens} tokens<br/>
            $${q.cost}<br/>
        </div></div><hr />`;
    });
    html += "</body></html>";
    return html;
  };

  return (
    <div>
      <input
        type="hidden"
        placeholder="Enter file name"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
      />
      <button onClick={handleReport}>Report</button>
    </div>
  );
}