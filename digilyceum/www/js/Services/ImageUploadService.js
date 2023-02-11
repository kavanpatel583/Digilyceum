angular.module('starter')

.service('ImageUploadService', function($q,sharedUtils) {

  this.uploadImage = function(uploadpath, file_initials, file) {

    var storage = firebase.storage();
    var storageRef = storage.ref();
    // Create the file metadata
    var metadata = {
      contentType: 'image/jpeg'
    };

    var uploadTask = storageRef.child(uploadpath + file_initials +  '_' + new Date().getTime()).put(file, metadata);

    var deferred = $q.defer();
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      function(snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        sharedUtils.showLoading();
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      },
      function(error) {
        console.log('At error : ' + angular.toJson(error));
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;

          case 'storage/canceled':
            // User canceled the upload
            break;

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
        deferred.reject(error);
      },
      function() {
        sharedUtils.showLoading();
        // Upload completed successfully, now we can get the download URL
        var downloadURL = uploadTask.snapshot;
        deferred.resolve(downloadURL);
      });
    return deferred.promise;
  };

  this.cameraImage = function(uploadpath, file_initials, file) {

    var storage = firebase.storage();
    var storageRef = storage.ref();
    // Create the file metadata
    var metadata = {
      contentType: 'image/jpeg'
    };

    var uploadTask = storageRef.child(uploadpath + file_initials + firebase.auth().currentUser.uid + '_' + new Date().getTime()).putString(file,'base64',metadata);

    var deferred = $q.defer();
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      function(snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        sharedUtils.showLoading();
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      },
      function(error) {
        console.log('At error : ' + angular.toJson(error));
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;

          case 'storage/canceled':
            // User canceled the upload
            break;

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
        deferred.reject(error);
      },
      function() {
        sharedUtils.showLoading();
        // Upload completed successfully, now we can get the download URL
        var downloadURL = uploadTask.snapshot;
        deferred.resolve(downloadURL);
      });
    return deferred.promise;
  };

  this.deleteImage = function(url) {
    var deferred = $q.defer();
    var storage = firebase.storage();
    var httpsReference = storage.refFromURL(url);
    httpsReference.delete().then(function() { // Delete the file
      deferred.resolve('file deleted successfully');
    }).catch(function(error) {
      deferred.reject(error);
    });
    return deferred.promise;
  };

});
