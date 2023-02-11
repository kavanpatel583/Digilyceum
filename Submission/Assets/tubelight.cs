using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Firebase;
using Firebase.Database;
using Firebase.Unity.Editor;

public class tubelight : MonoBehaviour
{
    DataSnapshot snapshot;
    DatabaseReference reference;

    void Start()
    {
        FirebaseApp.DefaultInstance.SetEditorDatabaseUrl("https://smartar-730e1.firebaseio.com/");
        reference = FirebaseDatabase.DefaultInstance.RootReference;
    }

    void Update()
    {
        FirebaseDatabase.DefaultInstance.GetReference("Gadgets").Child("tubelight").GetValueAsync().ContinueWith(task =>
        {
            if (task.IsFaulted)
            {
                Debug.Log("Error");
            }
            else if (task.IsCompleted)
            {
                snapshot = task.Result;
                Debug.Log("Successfully Run");
                Debug.Log(snapshot.Value);
            }
        });
        /*
        if (Input.GetMouseButtonDown(0))
        {
            Debug.Log("MouseDown");
            int status = System.Convert.ToInt32(snapshot.Value);

            if(status==0)
            {
                string json = "1";
                reference.Child("Gadgets").Child("bulb").SetRawJsonValueAsync(json);
                Debug.Log("Bulb On");
            }
            else
            {
                string json = "0";
                reference.Child("Gadgets").Child("bulb").SetRawJsonValueAsync(json);
                Debug.Log("Bulb Off");
            }
        }*/

        if ((Input.touchCount > 0) && Input.GetTouch(0).phase == TouchPhase.Began)
        {
            Debug.Log("Touch");
            int status = System.Convert.ToInt32(snapshot.Value);

            if (status == 0)
            {
                string json = "1";
                reference.Child("Gadgets").Child("tubelight").SetRawJsonValueAsync(json);
                Debug.Log("Tubelight On");
            }
            else
            {
                string json = "0";
                reference.Child("Gadgets").Child("tubelight").SetRawJsonValueAsync(json);
                Debug.Log("Tubelight Off");
            }
        }

    }
}
