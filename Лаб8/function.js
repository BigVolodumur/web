function saveComments(){
   
 localStorage.setItem('comments', JSON.stringify(comments));

}
function saveNews(){

 localStorage.setItem('newss', JSON.stringify(newss));
}

function loadComments(){
    if (localStorage.getItem('comments')) comments = JSON.parse(localStorage.getItem('comments'));
    showComments();

}

function showComments (){
    if (navigator.onLine) {
    
        let commentField = document.getElementById('comment-field');
        let out = '';
        comments.forEach(function(item){
        
            out += `<br><br>`;          
            out += `<p>${item.body}</p><br>`;
            out += `<br><br>`;
           
            out += `<div class="row"><div class="container"><div class="col-xs-6 text-left">${timeConverter(item.time)}</div>`;
            out += `<div class="col-xs-6 text-right" >BoxFan2000</div></div></div><br>`;
            out += `<div style="border-bottom: 2px solid"></div>`;
       });
        commentField.innerHTML = out;
    };
   

}
function loadNewss(){
    if (localStorage.getItem('newss')) newss = JSON.parse(localStorage.getItem('newss'));
    showNewss();
}


function showNewss (){
    if (navigator.onLine) {
        let commentField = document.getElementById('news-field');
        let out = '';
        newss.forEach(function(item){
        
            out += `<div class="col-md-3"><div class="col-xs" style="border: 1px solid"><img src="images/1.jpg" width="100%"><div class="panel"><div class="panel-heading" style="background: #EAEAEA">`;          
            out += `<p style="height: 75px;overflow: auto;">${item.Title}</p>`;
            out += `</div><div class="panel-body">`;
           
            out += `<p style="height: 200px;overflow: auto;">${item.Text}</p>`;
            out += `</div></div></div></div>`;
                
        });
        commentField.innerHTML = out;
    };
}

function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }