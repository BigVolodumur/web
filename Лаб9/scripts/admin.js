window.isOnline = () => this.navigator.onLine;
var useLocalStorage = false;

const getById = id => document.getElementById(id);

const fileForm = getById('fileForm');
const fileInput = getById('fileInput')
const bodyForm = getById('bodyForm')
const textarea = getById('bodyArea');
const titleField = getById('titleField')

class News{
  constructor(title, body){
    this.title = title;
    this.body = body;
  }
}

function writeLocally(news){
  if(useLocalStorage){
      const item = localStorage.getItem('news-data')
      let data = item ? JSON.parse(item) : [];
      data.push(news);
      localStorage.setItem('news-data', JSON.stringify(data));
  }
  else {
    var openDB = indexedDB.open("news-data", 1);

    openDB.onerror = function(event) {
      alert("Error occurred when loading news");
    };

    openDB.onsuccess = function(event) {
      var db = openDB.result;
      var tx = db.transaction(["news"], "readwrite");
      var store = tx.objectStore("news");
      var addNews = store.put(news);
      addNews.onsuccess = function(event){
        alert("News created");
      }
      addNews.onerror = function(event){
        alert("Error occurred when loading news");
      }
      tx.oncomplete = function(){
        db.close();
      }
    };
  }
}

const onSubmitPress = (e) => {
  e.preventDefault();

  const isValid = (textarea.value.length > 0 && titleField.value.length > 0);
  fileForm.classList.add('was-validated')
  bodyForm.classList.add('was-validated');

  if (!isValid) return;
	
  if (!isOnline()) {
	var news = new News(titleField.value, textarea.value);
    writeLocally(news);
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