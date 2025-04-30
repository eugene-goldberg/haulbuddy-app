#!/usr/bin/env python3
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import json
import os
import sys
import argparse
from datetime import datetime

def timestamp_to_str(timestamp):
    """Convert Firestore timestamp to string format"""
    if isinstance(timestamp, datetime):
        return timestamp.strftime('%Y-%m-%d %H:%M:%S')
    return str(timestamp)

def main():
    # Set up argument parser
    parser = argparse.ArgumentParser(description='Fetch documents from a Firestore collection')
    parser.add_argument('collection', type=str, help='Name of the Firestore collection to query')
    args = parser.parse_args()
    
    # Get collection name from command line argument
    collection_name = args.collection
    
    # Firebase project configuration
    firebase_config = {
        "projectId": "pickuptruckapp",
        "appId": "1:843958766652:web:5efa2599441df2ba380739",
        "storageBucket": "pickuptruckapp.firebasestorage.app",
        "apiKey": "AIzaSyCC3WwxamAscg_uK1b4y_buannwRJyG3Mk",
        "authDomain": "pickuptruckapp.firebaseapp.com",
        "messagingSenderId": "843958766652",
        "measurementId": "G-QJWM3B1Y5E"
    }
    
    # Check for service account key in the current directory
    service_account_path = 'serviceAccountKey.json'
    
    try:
        # Try to initialize with the service account if it exists
        if os.path.exists(service_account_path):
            cred = credentials.Certificate(service_account_path)
            firebase_admin.initialize_app(cred, {
                'projectId': firebase_config['projectId']
            })
        else:
            # Fall back to application default credentials with project ID
            firebase_admin.initialize_app(options={
                'projectId': firebase_config['projectId']
            })
        
        # Get Firestore client
        db = firestore.client()
    
        # Reference to specified collection
        collection_ref = db.collection(collection_name)
        
        # Get all documents from the collection
        documents = collection_ref.get()
        
        if not documents:
            print(f"No documents found in the '{collection_name}' collection.")
            return
        
        print(f"Found {len(documents)} documents in the '{collection_name}' collection:\n")
    
        # Print each document
        for i, doc in enumerate(documents, 1):
            doc_data = doc.to_dict()
            
            # Convert any timestamp fields to strings for better readability
            for key, value in doc_data.items():
                if isinstance(value, datetime):
                    doc_data[key] = timestamp_to_str(value)
            
            # Pretty print the document data
            print(f"Document {i}: ID = {doc.id}")
            print(json.dumps(doc_data, indent=2, default=str))
            print("-" * 50)
    
    except Exception as e:
        print(f"Error accessing Firestore: {e}")
        print("\nTo fix authentication issues:")
        print("1. Generate a service account key from the Firebase console:")
        print("   - Go to Project Settings > Service accounts")
        print("   - Click 'Generate new private key'")
        print("   - Save the file as 'serviceAccountKey.json' in this directory")
        print("\n2. Or set up Application Default Credentials:")
        print("   - Run: gcloud auth application-default login")
        print("   - Follow the instructions to log in with your Google account")
        print("\n3. Make sure you have the necessary permissions for this project")
        sys.exit(1)

if __name__ == "__main__":
    main()
