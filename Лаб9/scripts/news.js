window.isOnline = () => this.navigator.onLine;
var useLocalStorage = false;

const getById = (id) => document.getElementById(id);

const newsContainer = getById('news-container');

class News{
  constructor(title, body){
    this.title = title;
    this.body = body;
  }
}

function newsTemplate(news) { 
var title = news.title;
var body = news.body;

return `
              <div class="row">
                <div class="col-sm text-center">
                    <div class="card" style="width: 18rem;margin:auto;margin-bottom: 40px;">
                        <img class="card-img-top" src="./img/im1.png" alt="NEWS">
                        <div class="card-body">
                            <h5 class="card-title">${title}</h5>
                            <p class="card-text">${body}</p>
                            <a href="#" class="btn btn-primary">Read more</a>
                        </div>
                    </div>
                </div>
              </div>
`
}

const initAndRenderData = (online) => {
  if(useLocalStorage){
      if (!isOnline()) return;
      const data = localStorage.getItem('news-data');

      if (!data) {
        console.log('Нема доступних локальних даних');
      } else {
        JSON.parse(data).forEach(({ title, body }) => {
            var tempNews = new News(title, body);
            $('#news-container').append(
            feedbackTemplate(tempNews),
            );
        });
      }
  } else {
      var openDB = indexedDB.open("news-data", 1);
      openDB.onupgradeneeded = function() {
          var db = openDB.result;
          var store = db.createObjectStore("news", {keyPath: "title"});
          store.createIndex("title", "title", { unique: false });
          store.createIndex("body", "body", { unique: false });
      }
      openDB.onsuccess = function(event) {
        var db = openDB.result;
        var tx = db.transaction(["news"], "readwrite");
          var store = tx.objectStore("news");
          store.openCursor().onsuccess = function(event) {
          var cursor = event.target.result;

          if (cursor) {
            var tempNews = new News(cursor.value.title, cursor.value.body);
              $('#news-container').append(newsTemplate(tempNews));
              cursor.continue();
          }
        };
          tx.oncomplete = function(){
            db.close();
          }
      }
  }
}

const onOnline = () => {
	initAndRenderData();
  console.log('Network status: online');
}

const onOffline = () => {
  console.log('Connection lost');
}


// Bind listeners to the DOM
window.addEventListener('online', onOnline);
window.addEventListener('offline', onOffline);
window.addEventListener('DOMContentLoaded', onOffline);

