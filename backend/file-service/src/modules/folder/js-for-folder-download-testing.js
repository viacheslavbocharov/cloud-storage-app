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
  const targetFolderId = '67f7bb7a42ccc78b33329ef3'; // или: '67ebe1845b1c86ef0ad1294d'

  if (targetFolderId) {
    formData.append('folderId', targetFolderId);
  }

  const res = await fetch('http://localhost:3000/api/folders/upload-folder', {
    method: 'POST',
    headers: {
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZpYWNoZXNsYXZib2NoYXJvdkBnbWFpbC5jb20iLCJzdWIiOiI2N2Y1MDc3N2NhZGIxNTcyMWNjZGI0ZjkiLCJpYXQiOjE3NDQyODk3OTIsImV4cCI6MTc0NDI5MDY5Mn0.Og9I4_OPUg1jUcVhtp0QaGp24HTaZikonQjXr-O-m0A',
    },
    body: formData,
  });

  const result = await res.json();
  console.log('📦 Загрузка завершена:', result);
});
//энтер
//вывбрать папку и отправить
