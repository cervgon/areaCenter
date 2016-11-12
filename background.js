chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    'outerBounds': {
      'width': 500,
      'height': 700
    }
  });
  if(!chrome.storage){
  	chrome.storage.local.set({'filter':70});
  };
});