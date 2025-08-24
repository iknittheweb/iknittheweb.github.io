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
        // Show a popup message for user feedback
        showPopup("Your message was submitted successfully!");
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

// Popup message function
function showPopup(message) {
  // Create popup container
  const popup = document.createElement('div');
  popup.textContent = message;
  popup.setAttribute('role', 'alert');
  popup.style.position = 'fixed';
  popup.style.top = '30px';
  popup.style.left = '50%';
  popup.style.transform = 'translateX(-50%)';
  popup.style.background = '#52D949';
  popup.style.color = '#222';
  popup.style.padding = '1rem 2rem';
  popup.style.borderRadius = '8px';
  popup.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
  popup.style.fontSize = '1.2rem';
  popup.style.zIndex = '9999';
  document.body.appendChild(popup);
  setTimeout(() => {
    popup.remove();
  }, 3500);
}

// Remove Clear Form button JS if present
// (No clear form button will be added dynamically)

// Add event listener for unobtrusive clear form button
const clearBtn = document.getElementById('clear-form-btn');
if (clearBtn) {
  clearBtn.addEventListener('click', function() {
    form.reset();
    showPopup('Form cleared.');
  });
}

// Add event listener for Formspree clear form button
const fsClearBtn = document.getElementById('fs-clear-form-btn');
const fsForm = document.querySelector('form.fs-form');
if (fsClearBtn && fsForm) {
  fsClearBtn.addEventListener('click', function() {
    fsForm.reset();
    if (typeof showPopup === 'function') showPopup('Form cleared.');
  });
}

// Run on DOMContentLoaded to ensure form is present
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addClearFormButton);
} else {
  addClearFormButton();
}
