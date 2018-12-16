window.isOnline = () => this.navigator.onLine;
const getById = (id) => document.getElementById(id);

var useLocalStorage = false;

const newsContainer = getById('news-container');

class DataService {
  constructor() {
    this.provider = useLocalStorage ? 'ls' : 'idb';
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

const itemTemplate = (title, body) => `
              <div class="row">
                <div class="col-sm text-center">
                    <div class="card" style="width: 18rem;margin:auto;margin-bottom: 40px;">
                        <img class="card-img-top" src="./images/main-img-karate.png" alt="Card image cap">
                        <div class="card-body">
                            <h5 class="card-title">${title}</h5>
                            <p class="card-text">${body}
                                content in</p>
                            <a href="#" class="btn btn-primary">Read more</a>
                        </div>
                    </div>
                </div>
              </div>
`



const initAndRenderData = async () => {
  const items = await service.getFromServer();
  console.log(items);

  items.forEach(({ title, body }) => {
        $('#news-container').append(
          itemTemplate(title, body),
        );
  });
}

const onOnline = () => {
  console.log('Network status: online');
}

const onOffline = () => {
  console.log('Connection lost');
}


// Bind listeners to the DOM
window.addEventListener('online', service.onOnline);
window.addEventListener('offline', service.onOffline);
window.addEventListener('DOMContentLoaded', initAndRenderData);

