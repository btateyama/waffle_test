// Saves options to chrome.storage
function save_options() {
    var issuePrefix = document.getElementById('issuePrefix').value;
    var repoUrls = document.getElementById('repoUrls').value;
    chrome.storage.sync.set({
      issuePrefix: issuePrefix,
      repoUrls: repoUrls
    }, function() {
      // Update status to let user know options were saved.
      var status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(function() {
        status.textContent = '';
      }, 750);
    });
  }
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
      issuePrefix: '', 
      repoUrls: ''
    }, function(items) {
      document.getElementById('issuePrefix').value = items.issuePrefix;
      document.getElementById('repoUrls').value = items.repoUrls;
    });
  }
  document.addEventListener('DOMContentLoaded', restore_options);
  document.getElementById('save').addEventListener('click', save_options);