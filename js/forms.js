// Contact form handler for contact.html
// Collects: name, phone, email, comments, and send_to
// Submits via AJAX to the form's action URL

const form = document.querySelector("form");

form.addEventListener("submit", function(e) {
  e.preventDefault();
  sendContactData();
});

function sendContactData() {
  const XHR = new XMLHttpRequest();
  const urlEncodedDataPairs = [];

  urlEncodedDataPairs.push(
    encodeURIComponent("name") + "=" + encodeURIComponent(form.querySelector("[name='name']").value)
  );
  urlEncodedDataPairs.push(
    encodeURIComponent("send_to") + "=" + encodeURIComponent(form.querySelector("[name='send_to']").value)
  );
  urlEncodedDataPairs.push(
    encodeURIComponent("email") + "=" + encodeURIComponent(form.querySelector("[name='email']").value)
  );
  urlEncodedDataPairs.push(
    encodeURIComponent("phone") + "=" + encodeURIComponent(form.querySelector("[name='phone']").value)
  );
  urlEncodedDataPairs.push(
    encodeURIComponent("comments") + "=" + encodeURIComponent(form.querySelector("[name='comments']").value)
  );

  const urlEncodedData = urlEncodedDataPairs.join("&").replace(/%20/g, "+");

  XHR.addEventListener("load", function() {
    if (XHR.readyState === XHR.DONE) {
      if (XHR.status === 200) {
        alert("Thank you! Your message has been sent.");
        form.reset();
      } else {
        alert("Sorry, there was a problem sending your message. " + XHR.responseText);
      }
    }
  });

  XHR.addEventListener("error", function() {
    alert("Oops! Something went wrong. Please try again later.");
  });

  XHR.open(form.getAttribute("method"), form.getAttribute("action"));
  XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  XHR.send(urlEncodedData);
}
