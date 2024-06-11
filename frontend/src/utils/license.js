import fs from 'fs';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { getContentPermissions } from './Interact';



export const licenseAgreement = async (contentId, content) => {
    try {
        const permissions = await getContentPermissions(contentId);

        const date = new Date().toLocaleDateString(); 
        const partyA = content.creator; 
        const partyB = "Licensee Name"; 
        const duration = "1 year"; 
        const additionalTerms = "This license is non-transferable and non-exclusive."; 

        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        const fontSize = 12;
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

        page.drawText(`Licensing Agreement for Content ID ${contentId}`, {
            x: 50,
            y: height - 50,
            size: fontSize + 6,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
        });
        page.drawText(`Date: ${date}`, { x: 50, y: height - 80, size: fontSize, font: timesRomanFont });
        page.drawText(`Parties: ${partyA} (Licensor) and ${partyB} (Licensee)`, { x: 50, y: height - 100, size: fontSize, font: timesRomanFont });
        page.drawText(`Title: ${content.title}`, { x: 50, y: height - 120, size: fontSize, font: timesRomanFont });
        page.drawText(`Description: ${content.description}`, { x: 50, y: height - 140, size: fontSize, font: timesRomanFont });
        page.drawText(`Permissions:`, { x: 50, y: height - 160, size: fontSize, font: timesRomanFont });
        page.drawText(`  - View Only: ${permissions.viewOnly}`, { x: 70, y: height - 180, size: fontSize, font: timesRomanFont });
        page.drawText(`  - Download: ${permissions.download}`, { x: 70, y: height - 200, size: fontSize, font: timesRomanFont });
        page.drawText(`Duration: ${duration}`, { x: 50, y: height - 220, size: fontSize, font: timesRomanFont });
        page.drawText(`Additional Terms: ${additionalTerms}`, { x: 50, y: height - 240, size: fontSize, font: timesRomanFont });

        const pdfBytes = await pdfDoc.save();
        fs.writeFileSync(`Licensing_Agreement_${contentId}.pdf`, pdfBytes);

        console.log(`Licensing Agreement for Content ID ${contentId} generated successfully.`);
    } catch (error) {
        console.error('Error fetching permissions and generating agreement:', error);
    }
};


