document.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById('saveAsPdfButton');

    button.addEventListener('click', function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Tabelle als PDF hinzufügen
        doc.autoTable({ html: '#trainingTable' });

        // PDF-Datei speichern
        doc.save('trainingdata.pdf');

        // E-Mail-Vorbereitung
        const emailSubject = encodeURIComponent('Meine Trainingsdaten');
        const emailBody = encodeURIComponent('Hier ist die PDF-Datei mit meinen Trainingsdaten. Bitte finden Sie die angehängte Datei.');

        // Trainer-Daten abrufen
        const trainerName = document.getElementById('trainerName').textContent.trim();
        const trainerEmail = `${trainerName.replace(/\s+/g, '').toLowerCase()}.fitsama@gmail.com`;
        const emailHref = `mailto:${trainerEmail}?subject=${emailSubject}&body=${emailBody}`;

        // E-Mail öffnen (PDF muss manuell hinzugefügt werden)
        window.location.href = emailHref;

        alert('Eine neue E-Mail wurde geöffnet. Bitte fügen Sie die PDF-Datei manuell als Anhang hinzu.');
    });
});