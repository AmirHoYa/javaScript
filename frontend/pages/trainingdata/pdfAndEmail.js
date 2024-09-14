document.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById('saveAsPdfButton');

    button.addEventListener('click', function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.autoTable({ html: '#trainingTable' });

        doc.save('trainingdata.pdf');

        const emailSubject = encodeURIComponent('Meine Trainingsdaten');
        const emailBody = encodeURIComponent('Hier ist die PDF-Datei mit meinen Trainingsdaten.');
        const trainerImage = document.getElementById('trainerImage');
        const trainerEmail = trainerImage.alt + '.fitsama@gmail.com';
        const emailHref = `mailto:${trainerEmail}?subject=${emailSubject}&body=${emailBody}%0A%0A[PDF-Anhang: Trainingsdaten]`;

        window.location.href = emailHref;

        alert('Eine neue E-Mail wurde geöffnet. Bitte fügen Sie die PDF-Datei manuell als Anhang hinzu.');
    });
});