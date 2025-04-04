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
  const targetFolderId = '67effc83ef73bfc5ff63744e'; // или: '67ebe1845b1c86ef0ad1294d'

  if (targetFolderId) {
    formData.append('folderId', targetFolderId);
  }

  const res = await fetch('http://localhost:3003/folders/upload-folder', {
    method: 'POST',
    headers: {
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZpYWNoZXNsYXZib2NoYXJvdkBnbWFpbC5jb20iLCJzdWIiOiI2N2VmZjEyM2M4M2QxOGJhOGUyYThjYTAiLCJpYXQiOjE3NDM3ODExODksImV4cCI6MTc0Mzc4MjA4OX0.PGw-JW7vfVT4tUAbiJTGhZapl4tMS9h1omgzmNjnTi0',
    },
    body: formData,
  });

  const result = await res.json();
  console.log('📦 Загрузка завершена:', result);
});
//энтер
//вывбрать папку и отправить


