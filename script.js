document.addEventListener('DOMContentLoaded', (event) => {
    const button = document.getElementById('Download');
    const success = document.getElementById("S-download");

    // const folderPath = '/test';
    const folderPath = 'https://thedaos.github.io/Wallpaper/Wallpaper/'
    const zip = new JSZip();

    async function zipFile() {
        try {
            const response = await fetch(folderPath);
            const folderContent = await response.json();

            // Assuming folderContent is an array of file names
            for (const fileName of folderContent) {
                const fileResponse = await fetch(`${folderPath}/${fileName}`);
                const fileBlob = await fileResponse.blob();
                zip.file(fileName, fileBlob);
            }

            const zipBlob = await zip.generateAsync({ type: 'blob' });
            saveAs(zipBlob, 'test.zip');
        } catch (error) {
            console.error('Error zipping and downloading the folder:', error);
        }
    }

    button.addEventListener('click', () => {
        success.style.display = 'block';
        zipFile();
    });
});