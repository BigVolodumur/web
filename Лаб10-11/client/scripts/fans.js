window.isOnline = () => this.navigator.onLine;
var useLocalStorage = false;

class DataService {
  constructor() {
    this.provider = useLocalStorage ? 'ls' : 'idb';
  }

  // Working with REST here

  async sendToServer(data) {
    try {
      await fetch('/api/feedbacks', {
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
      const data = await fetch('/api/feedbacks');
      return data.json();
    } catch (error) {
      console.error('Cannot fetch data: ', error);
    }
  }

  async writeData(obj) {
    if (this.provider === 'ls') {
      const item = localStorage.getItem('feedbacks-data')
      let data = item ? JSON.parse(item) : [];
      data.push(obj);
      localStorage.setItem('feedbacks-data', JSON.stringify(data));
    } else {
      const db = await idb.open('feedbacks', 1, upgradeDB => upgradeDB.createObjectStore('items', { autoIncrement: true }))
      const tx = db.transaction(['items'], 'readwrite')
      const store = tx.objectStore('items')

      await store.put(obj);

      await tx.complete;
      db.close();
    }
  }

  async readData() {
    if (this.provider === 'ls') {
      const data = localStorage.getItem('feedbacks-data');
      return data ? JSON.parse(data) : [];
    } else {
      const db = await idb.open('feedbacks', 1)

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

const getById = id => document.getElementById(id);
const textarea = getById('addFeedbackArea');
const form = getById('feedbackForm');
const feedbackContainer = getById('fb-container');

const feedbackTemplate = (name, body, date) => `
    <div class="card">
        <h5 class="card-header">${name}</h5>
        <div class="card-body">
          <p class="card-text">
            ${body}
          </p>
          <a href="#" class="btn btn-primary">Like</a>
          <p style="float:right">${date}</p>
        </div>
    </div>
`

const initAndRenderData = async () => {

  const items = await service.getFromServer();
  console.log(items);

  items.forEach(({ title, body, createdAt }) => {
        $('#fb-container').append(
          feedbackTemplate(title, body, createdAt),
        );
  });
}

const onSubmitPress = async (e) => {
  e.preventDefault();

  const isValid = textarea.value.length > 0;
  form.classList.add('was-validated')

  if (!isValid) return;

  const date = new Date();

  /* service.writeData({
    title: 'Anonimous',
    value: textarea.value,
    date: date.toLocaleDateString(),
  }); */

  await service.sendToServer({
    title: 'BoxFan2000',
    body: textarea.value,
  });

  // if (isOnline()) return;
  $('#fb-container').append(
    feedbackTemplate('BoxFan2000', textarea.value, date.toLocaleDateString())
  );

  form.classList.remove('was-validated')
  textarea.value = '';
}

// Bind listeners to the DOM
const addButton = getById('submitBtn');
addButton.onclick = onSubmitPress;
window.addEventListener('online', service.onOnline);
window.addEventListener('offline', service.onOffline);
window.addEventListener('DOMContentLoaded', initAndRenderData);

