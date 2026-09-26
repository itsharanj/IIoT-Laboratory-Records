import { jsPDF } from 'jspdf';
import { Experiment } from '../types/experiment';

/**
 * Generates and downloads a clean, beautifully formatted Complete Laboratory Record PDF client-side.
 */
export function generateExperimentPDF(exp: Experiment) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  // Helper to add new page if content overflows
  const checkPageBreak = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - margin) {
      doc.addPage();
      cursorY = margin;
      // Header on subsequent pages
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(140, 140, 145);
      doc.text(`IIoT Laboratory Record — Experiment #${exp.expNo}: ${exp.title.substring(0, 48)}`, margin, cursorY);
      cursorY += 5;
      doc.setDrawColor(225, 225, 230);
      doc.line(margin, cursorY, pageWidth - margin, cursorY);
      cursorY += 8;
    }
  };

  // Helper for section header
  const addSectionHeader = (title: string) => {
    checkPageBreak(14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(0, 122, 255); // iOS Blue accent
    doc.text(title, margin, cursorY);
    cursorY += 6;
  };

  // Top Category Pill & Metadata
  doc.setFillColor(0, 122, 255); // iOS Blue
  doc.roundedRect(margin, cursorY, 34, 6, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(`EXPERIMENT ${String(exp.expNo).padStart(2, '0')}`, margin + 3, cursorY + 4.2);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 125);
  doc.setFontSize(8.5);
  doc.text(`Category: ${exp.category}`, margin + 38, cursorY + 4.2);
  cursorY += 11;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(28, 28, 30);
  const titleLines = doc.splitTextToSize(exp.title, contentWidth);
  doc.text(titleLines, margin, cursorY);
  cursorY += titleLines.length * 7 + 4;

  // Top Divider
  doc.setDrawColor(220, 220, 225);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 8;

  // 1. AIM
  addSectionHeader('1. Aim & Objective');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(45, 45, 48);
  const aimLines = doc.splitTextToSize(exp.aim, contentWidth);
  checkPageBreak(aimLines.length * 4.6 + 4);
  doc.text(aimLines, margin, cursorY);
  cursorY += aimLines.length * 4.6 + 6;

  // 2. APPARATUS
  if (exp.apparatus && exp.apparatus.length > 0) {
    addSectionHeader('2. Apparatus & Components Required');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);

    // Table Header
    checkPageBreak(12 + exp.apparatus.length * 6);
    doc.setFillColor(242, 244, 247);
    doc.rect(margin, cursorY, contentWidth, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(50, 50, 55);
    doc.text('#', margin + 2, cursorY + 4.2);
    doc.text('Component Name', margin + 10, cursorY + 4.2);
    doc.text('Specification', margin + 74, cursorY + 4.2);
    doc.text('Quantity', margin + contentWidth - 22, cursorY + 4.2);
    cursorY += 6;

    // Table Rows
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 45);
    exp.apparatus.forEach((item, index) => {
      checkPageBreak(6);
      if (index % 2 === 1) {
        doc.setFillColor(250, 250, 252);
        doc.rect(margin, cursorY, contentWidth, 5.5, 'F');
      }
      doc.text(String(item.slNo || index + 1), margin + 2, cursorY + 3.8);
      doc.text(item.name, margin + 10, cursorY + 3.8);
      doc.text(item.specs, margin + 74, cursorY + 3.8);
      doc.text(item.quantity, margin + contentWidth - 22, cursorY + 3.8);
      cursorY += 5.5;
    });
    cursorY += 6;
  }

  // 3. PROCEDURE
  const procedureContent = exp.procedure || exp.theory;
  if (procedureContent && procedureContent.trim().length > 0) {
    addSectionHeader('3. Procedure');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(45, 45, 48);
    const procLines = doc.splitTextToSize(procedureContent, contentWidth);
    checkPageBreak(procLines.length * 4.4 + 4);
    doc.text(procLines, margin, cursorY);
    cursorY += procLines.length * 4.4 + 6;
  }

  // 4. CIRCUIT / IOT DATA FLOW DIAGRAM
  addSectionHeader('4. Circuit Architecture & IoT Data Flow Diagram');
  const isThingSpeak =
    exp.category.toLowerCase().includes('thingspeak') ||
    exp.title.toLowerCase().includes('thingspeak') ||
    (exp.expNo >= 8 && exp.expNo <= 11);

  if (isThingSpeak) {
    // Render Vector ThingSpeak Data Flow Pipeline in PDF
    checkPageBreak(38);
    const diagramBoxW = contentWidth;
    const diagramBoxH = 32;
    doc.setFillColor(245, 248, 252);
    doc.setDrawColor(200, 220, 245);
    doc.roundedRect(margin, cursorY, diagramBoxW, diagramBoxH, 2, 2, 'FD');

    // 5 Key Stage nodes
    const stages = [
      { top: 'Sensor Input', bot: exp.expNo === 11 ? 'LM35 Analog' : exp.expNo === 8 ? 'DHT11' : exp.expNo === 9 ? 'LDR' : 'HC-SR04' },
      { top: 'Microcontroller', bot: 'NodeMCU ESP8266' },
      { top: 'Data Processing', bot: exp.expNo === 11 ? '10mV/°C Calc' : 'Telemetry Sampling' },
      { top: 'Network Uplink', bot: 'Wi-Fi 2.4GHz HTTP' },
      { top: 'ThingSpeak Cloud', bot: 'Channel Telemetry' },
    ];

    const nodeW = (diagramBoxW - 12 - (stages.length - 1) * 6) / stages.length;
    const nodeH = 18;
    const nodeY = cursorY + 7;

    stages.forEach((st, idx) => {
      const nodeX = margin + 6 + idx * (nodeW + 6);
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(180, 205, 240);
      doc.roundedRect(nodeX, nodeY, nodeW, nodeH, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(0, 100, 220);
      doc.text(st.top, nodeX + nodeW / 2, nodeY + 6.5, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(60, 60, 65);
      doc.text(st.bot, nodeX + nodeW / 2, nodeY + 12.5, { align: 'center' });

      // Arrow between nodes
      if (idx < stages.length - 1) {
        const arrowStartX = nodeX + nodeW;
        const arrowEndX = arrowStartX + 6;
        const arrowY = nodeY + nodeH / 2;
        doc.setDrawColor(0, 122, 255);
        doc.line(arrowStartX + 1, arrowY, arrowEndX - 1, arrowY);
      }
    });

    cursorY += diagramBoxH + 6;
  } else {
    // 3-Block Architecture diagram in PDF
    checkPageBreak(28);
    const diagramBoxW = contentWidth;
    const diagramBoxH = 24;
    doc.setFillColor(248, 249, 250);
    doc.setDrawColor(220, 220, 225);
    doc.roundedRect(margin, cursorY, diagramBoxW, diagramBoxH, 2, 2, 'FD');

    const blocks = [
      { title: 'Input / Sensors', sub: exp.apparatus[0]?.name ? exp.apparatus[0].name.substring(0, 22) : 'Transducer' },
      { title: 'Processing SoC', sub: 'NodeMCU ESP8266' },
      { title: 'Output / Cloud', sub: exp.category.includes('Blynk') ? 'Blynk IoT App' : exp.category.includes('Web') ? 'HTTP Web Server' : 'Actuator / Serial' },
    ];

    const blockW = (diagramBoxW - 16 - 2 * 12) / 3;
    const blockH = 14;
    const blockY = cursorY + 5;

    blocks.forEach((b, idx) => {
      const blockX = margin + 8 + idx * (blockW + 12);
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(210, 210, 215);
      doc.roundedRect(blockX, blockY, blockW, blockH, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(0, 122, 255);
      doc.text(b.title, blockX + blockW / 2, blockY + 5.5, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(70, 70, 75);
      doc.text(b.sub, blockX + blockW / 2, blockY + 10.5, { align: 'center' });

      if (idx < 2) {
        const arrowStartX = blockX + blockW;
        const arrowEndX = arrowStartX + 12;
        const arrowY = blockY + blockH / 2;
        doc.setDrawColor(120, 120, 130);
        doc.line(arrowStartX + 2, arrowY, arrowEndX - 2, arrowY);
      }
    });

    cursorY += diagramBoxH + 6;
  }

  // CONNECTIONS & PIN CONFIGURATION
  if (exp.connections && exp.connections.length > 0) {
    addSectionHeader('Connections & Pin Configuration');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(40, 40, 45);

    checkPageBreak(exp.connections.length * 6 + 6);
    exp.connections.forEach((conn) => {
      checkPageBreak(6);
      doc.setFillColor(0, 122, 255);
      doc.circle(margin + 2.5, cursorY + 2.8, 0.9, 'F');
      doc.setFont('courier', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(30, 40, 60);
      doc.text(conn, margin + 6, cursorY + 3.8);
      cursorY += 5.5;
    });
    cursorY += 4;
  }

  // 5. SOURCE CODE
  const isPacketTracerExp =
    exp.categoryShort === 'Packet Tracer' ||
    exp.category.toLowerCase().includes('packet tracer');

  if (exp.code && exp.code.trim().length > 0 && !isPacketTracerExp) {
    addSectionHeader(`5. Arduino / Embedded Source Code (${exp.codeFilename || 'program.ino'})`);
    doc.setFont('courier', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(30, 30, 35);

    const rawLines = exp.code.split('\n');
    const lineHeight = 3.6;
    const padding = 5;

    // Render code line by line with automatic multi-page break
    let chunkStart = 0;
    while (chunkStart < rawLines.length) {
      const remainingPageHeight = pageHeight - margin - cursorY - 14;
      const linesFit = Math.max(4, Math.floor((remainingPageHeight - padding * 2) / lineHeight));
      const chunk = rawLines.slice(chunkStart, chunkStart + linesFit);

      const boxHeight = chunk.length * lineHeight + padding * 2;
      checkPageBreak(boxHeight + 4);

      doc.setFillColor(248, 249, 251);
      doc.setDrawColor(215, 220, 228);
      doc.roundedRect(margin, cursorY, contentWidth, boxHeight, 2, 2, 'FD');

      chunk.forEach((line, lineIdx) => {
        const textY = cursorY + padding + (lineIdx + 1) * lineHeight - 0.8;
        // Truncate ultra long lines to contentWidth
        const printableLine = line.length > 95 ? `${line.substring(0, 92)}...` : line;
        doc.text(printableLine, margin + 4, textY);
      });

      cursorY += boxHeight + 5;
      chunkStart += linesFit;
    }
  } else if (!isPacketTracerExp) {
    addSectionHeader('5. Arduino / Embedded Source Code');
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(120, 120, 125);
    checkPageBreak(8);
    doc.text('[Embedded source code pending submission / Candidate to attach lab program]', margin, cursorY);
    cursorY += 8;
  }

  // 6. RESULT
  addSectionHeader('6. Result');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(45, 45, 50);
  const resultLines = doc.splitTextToSize(exp.conclusion, contentWidth);
  checkPageBreak(resultLines.length * 4.5 + 4);
  doc.text(resultLines, margin, cursorY);
  cursorY += resultLines.length * 4.5 + 8;

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 155);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 18, pageHeight - 8);
    doc.text('Industrial IoT Laboratory Record · Single Source of Truth', margin, pageHeight - 8);
  }

  // Trigger download
  const safeTitle = exp.title.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 24);
  doc.save(`Exp_${String(exp.expNo).padStart(2, '0')}_${safeTitle}_Record.pdf`);
}

/**
 * Trigger client-side download of the code file
 */
export function downloadCodeFile(code: string, filename: string = 'program.ino') {
  const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Trigger client-side download of a photo/schematic
 */
export function downloadImageFile(dataUrl: string, filename: string = 'circuit_diagram.svg') {
  if (dataUrl.startsWith('data:image/svg+xml')) {
    // Direct SVG download
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename.endsWith('.svg') ? filename : `${filename}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/**
 * Trigger client-side download of any experiment photo file (blob, data URL, or remote file)
 */
export async function downloadPhotoFile(url: string, filename: string = 'experiment_photo.jpg') {
  if (!url) return;
  try {
    if (url.startsWith('data:') || url.startsWith('blob:')) {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error('Fetch failed');
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  } catch {
    // Fallback: direct download attribute
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
