import React from "react";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";

const title = 2;
const address = 4;

// Загрузка файла docx
function loadFile(url, callback) {
  fetch(url)
    .then((response) => {
      // Проверка статуса ответа
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Проверка заголовков ответа
      return response.arrayBuffer();
    })
    .then((buffer) => {
      callback(null, buffer);
    })
    .catch((error) => {
      callback(error, null);
    });
}

// Экспорт документа с нужными данными
const WordExport = ({ task, form, formName }) => {
  const generateDocument = () => {
    loadFile(form, function (error, content) {
      if (error) {
        throw error;
      }
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });
      doc.render({
        title: task[title],
        address: task[address],
      });
      const out = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      }); //Output the document using Data-URI
      saveAs(out, formName + task[title] + ".docx");
    });
  };

  return <button onClick={generateDocument}>Выгрузка {formName}</button>;
};

export default WordExport;