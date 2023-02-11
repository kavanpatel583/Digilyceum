function FirebaseService(Firebase, firebaseURL, $firebaseObject, $firebaseArray, $q, LogService, $timeout) {

  // Initialize Firebase
  // var config = {
  //   apiKey: "AIzaSyCcTvPgXNwCAYIlcWBd2cBV5fVZmsWwNxU",
  //   authDomain: "wineactivity-66c66.firebaseapp.com",
  //   databaseURL: "https://wineactivity-66c66.firebaseio.com",
  //   projectId: "wineactivity-66c66",
  //   storageBucket: "wineactivity-66c66.appspot.com",
  //   messagingSenderId: "1083302794660"
  // };
  // firebase.initializeApp(config);

  var rootFB = firebase.database().ref();

  var serverTimeOffset = 0; //number of millis local time needs to add in order to match server time

  //connection management
  //Auto connect after a disconnection after one second delay
  var firebaseConnected = false;
  var connectedRef = rootFB.child(".info/connected");
  connectedRef.on("value", function(snap) {
    if (snap.val() === true) {
      LogService.debug('firebase connected');
      firebaseConnected = true;
    } else {
      LogService.debug("firebase disconnected .. reconnect after 1 second");
      firebaseConnected = false;

      $timeout(function() {
        if (!firebaseConnected) { //check again
          LogService.debug('reconnecting to firebase ...');
          // Firebase.goOnline();
        }

      }, 1000);
    }
  });


  //Server/Client clock sync
  //
  var offsetRef = rootFB.child(".info/serverTimeOffset");
  offsetRef.on("value", function(snap) {
    serverTimeOffset = snap.val();
    //  var estimatedServerTimeMs = new Date().getTime() + offset;
  });

  /**
   * @returns The number of milliseconds to add to local time in order to equal to server time
   */
  function getServerTimeOffset() {
    return serverTimeOffset;
  }

  function resetPassword(email) {
    var deffered = $q.defer();
    rootFB.resetPassword({
      email: email
    }, function(error) {
      if (error === null) {
        deffered.resolve(true);
      } else {
        deffered.reject(error);
      }
    });
    return deffered.promise;
  }

  function applyQueryOptions(fbRef, options) {
    options = options || {};
    if (options.orderByKey) {
      fbRef = fbRef.orderByKey();
    }

    if (options.orderByValue) {
      fbRef = fbRef.orderByValue();
    }

    if (options.orderByChild) {
      fbRef = fbRef.orderByChild(options.orderByChild);
    }

    if (options.startAt) {
      fbRef = fbRef.startAt(options.startAt);
    }

    if (options.endAt) {
      fbRef = fbRef.endAt(options.endAt);
    }

    if (options.equalTo) {
      fbRef = fbRef.equalTo(options.equalTo);
    }

    if (options.limitToLast) {
      fbRef = fbRef.limitToLast(options.limitToLast);
    }

    if (options.limitToFirst) {
      fbRef = fbRef.limitToFirst(options.limitToFirst);
    }
    return fbRef;
  }

  //@return promise that resolves to authData
  function guestAuth() {
    var deffered = $q.defer();
    rootFB.authAnonymously(function(error, authData) {
      if (error) {
        deffered.reject(error);
        LogService.info("Login Failed!", error);
      } else {
        deffered.resolve(authData);
        LogService.info("Authenticated successfully with payload:", authData);
      }
    }, {
      remember: "sessionOnly"
    });
    return deffered.promise;
  }

  //cleanup the data for persistence
  function cleanseData(obj) {
    if (window.angular.isFunction(obj) || window.angular.isUndefined(obj) || obj === null) {
      return null;
    }

    if (window.angular.isNumber(obj) || window.angular.isString(obj)) {
      return obj; //native type such as number or string
    }

    //all dates need to be converted to milliseconds
    if (window.angular.isDate(obj)) {
      return obj.getTime();
    }

    if (window.angular.isArray(obj)) {

      return obj.map(function(o) {
        return cleanseData(o);
      });
    }


    if (window.angular.isObject(obj)) {
      var lockKey = '$$inuse';
      if (obj[lockKey]) {
        throw new Error('cannot send circular linked data to firebase');
      }
      var result = {};
      obj[lockKey] = true;
      Object.keys(obj).forEach(
        function(key) {
          if (key === lockKey) {
            return;
          }
          if (key[0] === '$') {
            return;
          } //skip all the '$xxx' fields
          var val = cleanseData(obj[key]);
          result[key] = val;
        });
      delete obj[lockKey];
      return result;
    }
    return obj;
  }

  //Replace each label in the URL (ex, :user_id).
  function interpolateUrl(path, params) {
    if (!params) {
      return path;
    }

    var url = path.replace(
      /(\/)?([:$])([a-z]\w*)/gi,
      function($0, $1, $2, $3) {
        if (params && params.hasOwnProperty($3)) {
          return $1 ? ($1 + params[$3]) : params[$3];
        } else {
          LogService.info('error: un-replaced path variable', $0, ' params is', params, 'arguments is', arguments);
          return $0; //unreplaced
        }
      }
    );
    return url;
  }

  function getFBRef(path, pathparams, firebaseOptions) {
    LogService.info('access Firebase path ', path.toString(), pathparams);
    if (typeof path === 'object' && !!path.path) {
      return path; //use the existing ref
    }
    var ref = rootFB.child(interpolateUrl(path, pathparams));
    if (firebaseOptions) {
      ref = applyQueryOptions(ref, firebaseOptions);
    }
    return ref;
  }

  function getFBObject(path, pathparams) {
    LogService.info('Accessing FB at ', path.toString());
    return $firebaseObject(getFBRef(path, pathparams));
  }

  function getFBArray(path, params) {
    LogService.info('Accessing FBArray at ', path.toString());
    var ref = getFBRef(path, params);
    return $firebaseArray(ref);
  }

  /**
   * Create an infinite scrollable FirebaseArray. See @http://firebase.github.io/firebase-util/#/toolbox/Paginate/
   * @param  {[string]} order_field [The field to be used for order_key. Can be a field name, or '$key', '$priority' or '$value']
   * @param  {[type]} path        [description]
   * @param  {[type]} params      [The normal path params required to resolve the path variables such as $user_id, PLUS an additional
   *                               optional param called 'scrollParams' (an object) what can be used to customize
   *                               the scroll, such as the windowSize and maxCacheSize]
   * @return {[FirebaseArray]}    [A regular FirebaseArray object with a field called .scroll to allow scroll control
   *                              retVal.scroll.next(30), ..prev(15), ..hasNext(), ..hasPrev(), ..destroy() etc]
   */
  function getFBScrollArray(order_field, path, params) {
    LogService.info('Accessing FBScrollArray at ', path.toString(), ' order by ', order_field);
    var ref = getFBRef(path, params);
    var scrollParams = (params && params.scrollParams) ? params.scrollParams : {};
    var scrollRef = new Firebase.util.Scroll(ref, order_field, scrollParams);
    var retVal = $firebaseArray(scrollRef);
    retVal.scroll = scrollRef.scroll;
    return retVal;
  }

  function getFBArrayFromRef(ref) {
    return $firebaseArray(ref);
  }

  /**
   * get value and returns promise which resolve to the value or reject with err
   */
  function get(path, pathparams) {
    var deffered = $q.defer();
    getFBRef(path, pathparams).once('value',
      function(snapshot) {
        var val = snapshot.val();
        var key = snapshot.key;
        if (angular.isObject(val)) {
          val.$id = key;
        }
        deffered.resolve(val);
      },
      function(err) {
        deffered.reject(err);
      }
    );
    return deffered.promise;
  }


  /**
   * set value and returns promise which resolve to the value being set or reject with err
   */
  function set(path, value, pathparams) {
    var deffered = $q.defer();
    getFBRef(path, pathparams).set(cleanseData(value), function(err) {
      if (err) {
        deffered.reject(err);
      } else {
        deffered.resolve(value);
      }
    });

    return deffered.promise;
  }


  /**
   * update value and returns promise which resolve to the value being set or reject with err
   */
  function update(path, value, pathparams) {
    var deffered = $q.defer();
    getFBRef(path, pathparams).update(cleanseData(value), function(err) {
      if (err) {
        deffered.reject(err);
      } else {
        deffered.resolve(value);
      }
    });

    return deffered.promise;
  }


  /**
   * remove value and returns promise which resolve to the value being set or reject with err
   */
  function remove(path, pathparams) {
    var deffered = $q.defer();
    getFBRef(path, pathparams).remove(function(err) {
      if (err) {
        deffered.reject(err);
      } else {
        deffered.resolve();
      }
    });

    return deffered.promise;
  }


  /**
   * addNew value and
   * returns promise which resolve to the firebase reference being set or reject with err
   */
  function addNew(arraypath, value, pathparams) {
    var deffered = $q.defer();
    var result = getFBRef(arraypath, pathparams).push(cleanseData(value), function(err) {

      if (err) {
        deffered.reject(err);
      } else {
        deffered.resolve(result);
      }
    });

    return deffered.promise;
  }

  /**
   * Add a new object to the arraypath and save the key together with the object passed in
   * The key will be saved in a column called "id"
   * @param {[String or Firebase Reference]} arraypath  [description]
   * @param {[Object]} objectValue      [The value to be saved. Must be an Object]
   * @param {[Object]} pathparams [description]
   * @return The Firebase Ref to the newly added location
   */
  function addNewWithId(arraypath, objectValue, pathparams) {
    var deffered = $q.defer();
    var data = cleanseData(objectValue);
    var ref = getFBRef(arraypath, pathparams).push();
    objectValue.id = ref.key;
    data.id = objectValue.id;
    ref.set(data, function(err) {
      if (err) {
        deffered.reject(err);
      } else {
        deffered.resolve(ref);
      }
    });
    return deffered.promise;
  }

  /**
   * Push value (can be null) to the array path and returns an FBObject pointing to it the newly
   * created object
   */
  function pushAsFBObject(arraypath, value, pathParams) {
    return getFBObject(getFBRef(arraypath, pathParams).push(cleanseData(value)));
  }

  /**
   * set an object with the key/value pair under the parent path and return the FBObject pointing
   * to this newly set object
   */
  function setAsFBObject(parentpath, key, value, pathParams) {
    var ref = getFBRef(parentpath, pathParams).child(key);
    ref.set(value);
    return getFBObject(ref);
  }


  /**
   * 3 way Bind to a path and returns void. Others see changes while you are typing
   */
  function bind3way(path, scope, varName, pathparams) {
    getFBObject(path, pathparams).$bindTo(scope, varName);
  }

  /**
   * 2 way Bind to a path and returns void. Data is loaded and decoupled from Firebase
   * before it is bound
   */
  function bind2way(path, scope, varName, pathparams) {
    getFBRef(path, pathparams).once('value', function(snapshot) {
      scope[varName] = snapshot.val();
    });
  }

  /**
   * 3 Way Bind to an array path (for ngRepeat) and returns void
   * the changes to the elements are automtically saved, and new elements
   * need to be added through FBDir.addNew() call
   */
  function bind3wayArray(arraypath, scope, varName, pathparams) {
    scope[varName] = getFBArray(arraypath, pathparams);
  }


  /**
   * 2 Way Bind to an array path (for ngRepeat) and returns void
   * the changes to the elements are NOT automtically saved, and new elements
   * can be added to the array on scope directly.
   */
  function bind2wayArray(arraypath, scope, varName, pathparams) {
    scope[varName] = getFBArray(arraypath, pathparams).$loaded()
      .then(
        function(snapshot) {
          scope[varName] = snapshot.val();
        }
      )
      .catch(function(err) {
        LogService.error(err);
        scope[varName] = null;
      });
  }

  /**
   * get or set value on a path. setFunction can return a promoise or a real object
   */
  function getOrSet(path, pathparams, setFunction) {
    //TODO transaction handling
    var deferred = $q.defer();
    get(path, pathparams)
      .then(function(snapshot) {
        if (snapshot === null) {
          $q.when(setFunction()).then(function(val) {
            set(path, val, pathparams).then(function() {
              deferred.resolve(val);
            }).catch(function(err) {
              deferred.reject(err);
            });

          }).catch(function(err) {
            deferred.reject(err);
          });
        } else {
          deferred.resolve(snapshot);
        }
      }).catch(function(err) {
        deferred.reject(err);
      });
    return deferred.promise;
  }

  /**
   * copy objects from the fromPath to the toPath in Firebase
   * @return promise that resolves to the reference to the destination
   */
  function copyPath(fromPath, toPath, pathParams) {
    return get(fromPath, pathParams).then(function(val) {
      return set(toPath, val, pathParams);
    });
  }

  /**
   * Expose Firebase.ServerValue.TIMESTAMP
   */
  function getServerTimestamp() {
    return Firebase.ServerValue.TIMESTAMP;
  }

  /**
   * [create a new FirebaseRef at the passed in location for subsequent object saving]
   * @param  {[type]} path       [description]
   * @param  {[type]} pathparams [description]
   * @return {[type]}            [description]
   */
  function pushNull(path, pathparams) {
    return getFBRef(path, pathparams).push();
  }

  //increase a counter by the interval in an atomic transaction
  // @ref must point to a number value
  function increaseBy(path, interval, pathparams) {
    var deffered = $q.defer();
    var ref = getFBRef(path, pathparams);
    ref.transaction(
      function(currentVal) {
        if (currentVal === null) {
          currentVal = 0;
        }
        var newVal = currentVal + interval;
        if (newVal < 0) {
          newVal = 0;
        }
        return newVal;
      },
      function(err, commited, snap) {
        if (err) {
          LogService.error(err, ref.toString(), JSON.stringify(interval));
          deffered.reject(err);
        } else {
          deffered.resolve(snap.val());
        }
      }
    );
    return deffered.promise;
  }

  /**
   * Set All the deep paths in the objToUpdate in a single atomic transaction
   * @param {[object]} pathsToSet [contains a hash of deeppath => value pairs. path can contain pathvariables resolveable by pathparams]
   * @param {[object]} pathparams  [map of key => values used to resolve the path variables on the objToUpdate ]
   */
  function setAll(pathsToSet, pathparams) {
    var newObj = {};
    Object.keys(pathsToSet).forEach(function(key) {
      var newKey = interpolateUrl(key, pathparams);
      var newVal = cleanseData(pathsToSet[key]);
      newObj[newKey] = newVal;
    });
    return update('/', newObj);
  }

  /**
   * create a new key based on getFBRef('/').push().key()
   * @return {[String]} [The Key that is globally unique]
   */
  function createNewKey() {
    return getFBRef('/').push().key;
  }

  /**
   * Create a positive but desending timestamp in order to allow desending order of firebase rows
   * @return milliseconds from now or timeMillis to year 2100
   */
  function createInverseTimestamp(timeMillis) {
    if (timeMillis === undefined) {
      return (new Date('2100').getTime() - Date.now());
    } else {
      return (new Date('2100').getTime() - timeMillis);
    }
  }


  function base64Encode(str) {
    return btoa(str);
  }

  function base64Decode(str) {
    return atob(str);
  }

  function createServiceUpdateKey(community_name, service_id) {
    return 'COMMUNITY' + '_' + base64Encode(community_name) + '_' + service_id;
  }

  function createServiceUpdateIndex(community_name, service_id) {
    return 'COMMUNITY' + '_' + base64Encode(community_name) + '_' + createInverseTimestamp() + '_' + service_id;
  }

  function goOffline() {
    return Firebase.goOffline();
  }

  // function goOnline() {
  //   return Firebase.goOnline();
  // }

  var fb = {
    rootURL: firebaseURL,
    rootFB: rootFB,
    getFBObject: getFBObject,
    getFBArray: getFBArray,
    getFBScrollArray: getFBScrollArray,
    getFBRef: getFBRef,
    get: get,
    set: set,
    pushNull: pushNull,
    update: update,
    remove: remove,
    addNew: addNew,
    addNewWithId: addNewWithId,
    bind3way: bind3way,
    bind2way: bind2way,
    bind2wayArray: bind2wayArray,
    bind3wayArray: bind3wayArray,
    getOrSet: getOrSet,
    getFBArrayFromRef: getFBArrayFromRef,
    copyPath: copyPath,
    pushAsFBObject: pushAsFBObject,
    setAsFBObject: setAsFBObject,
    guestAuth: guestAuth,
    getServerTimestamp: getServerTimestamp,
    resetPassword: resetPassword,
    increaseBy: increaseBy,
    setAll: setAll,
    createNewKey: createNewKey,
    createInverseTimestamp: createInverseTimestamp,
    base64Encode: base64Encode,
    base64Decode: base64Decode,
    createServiceUpdateKey: createServiceUpdateKey,
    createServiceUpdateIndex: createServiceUpdateIndex,
    getServerTimeOffset: getServerTimeOffset,
    goOffline: goOffline
  };

  return fb;
}

angular.module('starter').service('FirebaseService', FirebaseService);
