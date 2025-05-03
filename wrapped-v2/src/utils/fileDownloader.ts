import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface Files {
  [key: string]: string;
}

export const downloadFiles = (files: Files, zipName: string = 'discord-bot.zip'): void => {
  const zip = new JSZip();
  
  // Add files to the zip
  Object.entries(files).forEach(([path, content]) => {
    // Handle directory paths
    if (path.endsWith('/')) {
      zip.folder(path);
    } else {
      // Create folders if needed
      const folderPath = path.split('/').slice(0, -1).join('/');
      if (folderPath) {
        zip.folder(folderPath);
      }
      
      // Add the file
      zip.file(path, content);
    }
  });
  
  // Generate the zip file and trigger download
  zip.generateAsync({ type: 'blob' })
    .then((content) => {
      saveAs(content, zipName);
    })
    .catch((error) => {
      console.error('Error creating zip file:', error);
      alert('Error creating zip file. Please try again.');
    });
};

export default downloadFiles;
