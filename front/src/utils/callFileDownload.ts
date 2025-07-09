// export async function callFileDownload(url: string, filename: string) {
//   try {
//     const response = await fetch(url);

//     if (!response.ok) {
//       throw new Error(`Download failed with status ${response.status}`);
//     }

//     const blob = await response.blob();
//     const blobUrl = URL.createObjectURL(blob);

//     const a = document.createElement('a');
//     a.href = blobUrl;
//     a.download = filename;
//     a.click();

//     URL.revokeObjectURL(blobUrl);
//   } catch (err) {
//     console.error('❌ File download error:', err);
//   }
// }

import api from '@/utils/axios';

export async function callFileDownload(url: string, filename: string) {
  try {
    const response = await api.get(`${url}`, {
      responseType: 'blob',
    });

    const blobUrl = URL.createObjectURL(new Blob([response.data]));

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error('❌ File download error:', err);
  }
}
