import api from '@/utils/axios';

export async function callFolderDownload(url: string, folderName: string) {
  try {
    const res = await api.get(`${url}`, {
      responseType: 'blob',
    });

    const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', `${folderName}.zip`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error('Download failed', err);
  }
}
