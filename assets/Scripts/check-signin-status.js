// setInterval(() => {
//    var request = new XMLHttpRequest();
//    request.open("GET", "/is-signed-in", true);
//    request.onload = function() {
//       if (this.status >= 200 && this.status < 400) {
//          if (!this.response[0]) { window.location.reload(); }
//       }
//    };
//    request.onerror = function() {
//       window.location.reload();
//    };    
//    request.send();
// }, 5000);