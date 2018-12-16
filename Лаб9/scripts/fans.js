window.isOnline = () => this.navigator.onLine;
window.useLocalStorage = false;

const getById = id => document.getElementById(id);
const textarea = getById('addFeedbackArea');
const form = getById('feedbackForm');
const feedbackContainer = getById('fb-container');

class Feedback{
  constructor(name, text, date){
    this.name = name;
    this.text = text;
    this.date = date;
  }
}

function feedbackTemplate(feedback) { 
var name = feedback.name;
var text = feedback.text;
var date = feedback.date;
return `
    <div class="card">
        <h5 class="card-header">${name}</h5>
        <div class="card-body">
          <p class="card-text">
            ${text}
          </p>
          <a href="#" class="btn btn-primary">Like</a>
          <p style="float:right">${date}</p>
        </div>
    </div>

`
}

const initAndRenderData = (online) => {
  if(useLocalStorage){
      if (!isOnline()) return;
      const data = localStorage.getItem('feedbacks-data');

      if (!data) {
        console.log('Нема доступних локальних даних');
      } else {
        JSON.parse(data).forEach(({ name, text, date }) => {
            var tempFeedback = new Feedback(name, text, date);
            $('#fb-container').append(
            feedbackTemplate(tempFeedback),
            );
        });
      }
  } else {
      var openDB = indexedDB.open("feedbacks-data", 1);
      openDB.onupgradeneeded = function() {
          var db = openDB.result;
          var store = db.createObjectStore("feedbacks", {keyPath: "name"});
          store.createIndex("name", "name", { unique: false });
          store.createIndex("text", "text", { unique: false });
          store.createIndex("date", "date", { unique: false });
      }
      openDB.onsuccess = function(event) {
        var db = openDB.result;
        var tx = db.transaction("feedbacks", "readwrite");
          var store = tx.objectStore("feedbacks");
          store.openCursor().onsuccess = function(event) {
          var cursor = event.target.result;

          if (cursor) {
            var tempFeed = new Feedback(cursor.value.name, cursor.value.text, cursor.value.date);
              //console.log(tempFeed);
              //feedbacks.push(tempFeed);
              $('#fb-container').append(feedbackTemplate(tempFeed));
              cursor.continue();
          }
        };
          tx.oncomplete = function(){
            db.close();
          }
      }
  }
}

function writeLocally(feedback){
  if(useLocalStorage){
      const item = localStorage.getItem('feedbacks-data')
      let data = item ? JSON.parse(item) : [];
      data.push(feedback);
      localStorage.setItem('feedbacks-data', JSON.stringify(data));
  }
  else {
    var openDB = indexedDB.open("feedbacks-data", 1);

    openDB.onerror = function(event) {
      alert("Error occurred when loading feedback");
    };

    openDB.onsuccess = function(event) {
      var db = openDB.result;
      var tx = db.transaction(["feedbacks"], "readwrite");
      var store = tx.objectStore("feedbacks");
      var addFeedback = store.put(feedback);
      addFeedback.onsuccess = function(event){
        alert("Feedback created");
      }
      addFeedback.onerror = function(event){
        alert("Error occurred when loading feedbacks");
      }
      tx.oncomplete = function(){
        db.close();
      }
    };
  }
}

const onSubmitPress = (e) => {
  e.preventDefault();

  const isValid = (textarea.value.length > 0);

  if (!isValid) return;

  const date = new Date();

  var feedback = new Feedback('BoxFan2000', textarea.value, date.toLocaleDateString());

  writeLocally(feedback);

  form.classList.remove('was-validated');
  textarea.value = '';
}

const onOnline = () => {
  initAndRenderData();
  console.log('Статус: онлайн, завантажую дані на сервер...');
}

const onOffline = () => {
  console.log('Відсутнє підключення, перемикаюсь у офлайн режим...');
}


// Bind listeners to the DOM
const addButton = getById('submitBtn');
addButton.onclick = onSubmitPress;
window.addEventListener('online', onOnline);
window.addEventListener('offline', onOffline);
window.addEventListener('DOMContentLoaded', initAndRenderData);

