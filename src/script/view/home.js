const home = () => {
  const deleteAllBtn = document.querySelector('#delete-all-btn');

  deleteAllBtn.addEventListener('click', () => {
    localStorage.removeItem('notes');

    const noteList = document.querySelector('note-list');
    noteList.clearNotes();
  });
};

export default home;
