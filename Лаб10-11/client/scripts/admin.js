window.isOnline = () => this.navigator.onLine;
const getById = id => document.getElementById(id);

const fileForm = getById('fileForm');
const fileInput = getById('fileInput')
const bodyForm = getById('bodyForm')
const textarea = getById('bodyArea');
const titleField = getById('titleField')

class DataService {
  constructor() {
    this.provider = 'ls'
  }

  // Working with REST here

  async sendToServer(data) {
    try {
      await fetch('/api/news', {
        method: 'post',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Cannot fetch data: ', error);
    }
  }

  async getFromServer() {
    try {
      const data = await fetch('/api/news');
      return data.json();
    } catch (error) {
      console.error('Cannot fetch data: ', error);
    }
  }

  async writeData(obj) {
    if (this.provider === 'ls') {
      const item = localStorage.getItem('news-data')
      let data = item ? JSON.parse(item) : [];
      data.push(obj);
      localStorage.setItem('news-data', JSON.stringify(data));
    } else {
      const db = await idb.open('news', 1, upgradeDB => upgradeDB.createObjectStore('items', { autoIncrement: true }))
      const tx = db.transaction(['items'], 'readwrite')
      const store = tx.objectStore('items')

      await store.put(obj);

      await tx.complete;
      db.close();
    }
  }

  async readData() {
    if (this.provider === 'ls') {
      const data = localStorage.getItem('news-data');
      return data ? JSON.parse(data) : [];
    } else {
      const db = await idb.open('news', 1)

      const tx = db.transaction('items', 'readonly')
      const store = tx.objectStore('items')

      const allSavedItems = await store.getAll()

      console.log(allSavedItems)

      db.close()
      return allSavedItems;
    }
  }

  async onOnline() {
    // await service.initAndRenderData();
    console.log('Network status: online, uploading local-stored data...');
  }

  async onOffline() {
    // await service.initAndRenderData();
    console.log('Connection lost, switching to offline mode');
  }

}

const service = new DataService();

const writeLocally = (obj) => {
  const items = localStorage.getItem('news-data')
  let data = items ? JSON.parse(items) : [];
  data.push(obj);
  localStorage.setItem('news-data', JSON.stringify(data));
}

const onSubmitPress = async (e) => {
  e.preventDefault();

  const isValid = (textarea.value.length > 0 && titleField.value.length > 0);
  fileForm.classList.add('was-validated')
  bodyForm.classList.add('was-validated');
  
   await service.sendToServer({
    title: titleField.value,
    body: textarea.value,
  });

  if (!isValid) return;

  if (!isOnline()) {
    writeLocally({
      title: titleField.value,
      body: textarea.value,
    });
  } else {
    console.log('Emulating server request...');
  }
  


  fileForm.classList.remove('was-validated');
  bodyForm.classList.remove('was-validated');
  fileForm.reset();
  bodyForm.reset();

  alert('Successfully saved!');
}

// Bind listeners to the DOM
const addButton = getById('submit-btn');
addButton.onclick = onSubmitPress;
window.addEventListener('online', service.onOnline);
window.addEventListener('offline', service.onOffline);