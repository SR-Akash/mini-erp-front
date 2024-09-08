const html2pdf = require("html2pdf.js");

const commonPdfExport = ({ setPdfLoading, title, orientation = "p", id }: any) => {
  setPdfLoading(true);
  var element = document.getElementById( id || "pdf-section");
  var opt = {
    margin: 1,
    filename: `${title}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      dpi: 300,
      letterRendering: true,
      scrollX: 0,
      scrollY: 0,
      useCORS: true,
    },
    jsPDF: {
      unit: "px",
      hotfixes: ["px_scaling"],
      orientation: orientation,
    },
  };

  html2pdf()
    .set(opt)
    .from(element)
    .save()
    .then(() => {
      setPdfLoading(false);
    });
};

export { commonPdfExport };
