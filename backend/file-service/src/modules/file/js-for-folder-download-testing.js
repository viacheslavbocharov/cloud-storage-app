// открыть https://example.com/
//в консоль добавить:
document.body.innerHTML += `<input type="file" id="folderInput" webkitdirectory multiple />`;
//энтер
//в консоль добавить:
document.getElementById('folderInput').addEventListener('change', async (e) => {
  const formData = new FormData();

  let index = 0;
  for (const file of e.target.files) {
    console.log('[📁]', file.webkitRelativePath, file.name);
    formData.append('files', file);
    formData.append(`paths[${index}]`, file.webkitRelativePath);
    index++;
  }

  // ❗ folderId можно указать, если надо вложить в конкретную папку
  const targetFolderId = '67f13a8ce03c2cf409b45c8f'; // или: '67ebe1845b1c86ef0ad1294d'

  if (targetFolderId) {
    formData.append('folderId', targetFolderId);
  }

  const res = await fetch('http://localhost:3003/folders/upload-folder', {
    method: 'POST',
    headers: {
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZpYWNoZXNsYXZib2NoYXJvdkBnbWFpbC5jb20iLCJzdWIiOiI2N2VmZjEyM2M4M2QxOGJhOGUyYThjYTAiLCJpYXQiOjE3NDM4NjMwNDMsImV4cCI6MTc0Mzg2Mzk0M30.gxN463jA5C70vxJhaQKjxB47aidXS4xRowBCYs1ylB0',
    },
    body: formData,
  });

  const result = await res.json();
  console.log('📦 Загрузка завершена:', result);
});
//энтер
//вывбрать папку и отправить
