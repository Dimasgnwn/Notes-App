// src/api/notesApi.js
const BASE_URL = 'https://notes-api.dicoding.dev/v2';

export async function getNotes() {
  const response = await fetch(`${BASE_URL}/notes`);
  const result = await response.json();

  if (response.ok) {
    return result.data;
  } else {
    throw new Error(result.message);
  }
}

export async function addNote(note) {
  const response = await fetch(`${BASE_URL}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

  if (!response.ok) {
    throw new Error('Gagal menambahkan catatan');
  }

  const data = await response.json();
  return data;
}

export async function removeNote(id) {
  const response = await fetch(`${BASE_URL}/notes/${id}`, {
    method: 'DELETE',
  });
  return response.ok;
}
