import { jsPDF } from "jspdf";

function stripHtml(html) {
  if (typeof window !== "undefined") {
    const tmp = document.createElement("div");
    tmp.innerHTML = html || "";
    return tmp.innerText || tmp.textContent || "";
  }
  return (html || "").replace(/<[^>]*>?/gm, "");
}

export function exportTextToPdf({ title, content, fontFamily = "courier", fontSize = 11 }) {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    const maxLineWidth = pageWidth - margin * 2;
    const lineHeight = 14;

    // Map editor font family to jsPDF standard fonts
    let pdfFont = "courier";
    if (fontFamily.toLowerCase().includes("times")) {
      pdfFont = "times";
    } else if (fontFamily.toLowerCase().includes("arial") || fontFamily.toLowerCase().includes("sans")) {
      pdfFont = "helvetica";
    }

    // Document header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(title || "Untitled Document", margin, margin);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    const dateStr = new Date().toLocaleString();
    doc.text(`Generated on: ${dateStr}`, margin, margin + 16);

    // Separator line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, margin + 24, pageWidth - margin, margin + 24);

    // Body text (clean text extracted from editor)
    const cleanText = stripHtml(content || "");
    doc.setTextColor(20, 20, 20);
    doc.setFont(pdfFont, "normal");
    doc.setFontSize(fontSize);

    let startY = margin + 45;
    const textLines = doc.splitTextToSize(cleanText, maxLineWidth);

    let currentPage = 1;

    for (let i = 0; i < textLines.length; i++) {
      if (startY + lineHeight > pageHeight - margin) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${currentPage}`, pageWidth - margin - 35, pageHeight - 20);

        doc.addPage();
        currentPage++;
        startY = margin;

        doc.setFont(pdfFont, "normal");
        doc.setFontSize(fontSize);
        doc.setTextColor(20, 20, 20);
      }
      doc.text(textLines[i], margin, startY);
      startY += lineHeight;
    }

    // Footer for last page
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${currentPage}`, pageWidth - margin - 35, pageHeight - 20);

    const filename = (title || "notepad-document").replace(/\.[^/.]+$/, "") + ".pdf";
    doc.save(filename);
    return true;
  } catch (error) {
    console.error("PDF generation failed:", error);
    throw error;
  }
}
