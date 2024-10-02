// import { Injectable, OnModuleInit } from '@nestjs/common';
// import { join } from 'path';
// import * as admin from 'firebase-admin';
// import * as serviceAccount from '../config/firebase-service-account.json';

// @Injectable()
// export class FirebaseService  {
//     constructor(){
//         admin.initializeApp({
//             credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
//             storageBucket: 'gs://insta-clone-c6d16.appspot.com',
//         });
//     }
//     async uploadFile(file: Express.Multer.File): Promise<string> {
//         const bucket = admin.storage().bucket();
//         const fileName = `${Date.now()}-${file.originalname}`;
//         const fileUpload = bucket.file(fileName);
    
//         await fileUpload.save(file.buffer, {
//           metadata: {
//             contentType: file.mimetype,
//           },
//         });
    
//         // Get a public URL for the uploaded image
//         const [url] = await fileUpload.getSignedUrl({
//           action: 'read',
//           expires: '03-09-2500', // Set a long expiration date or remove this for a permanent link
//         });
    
//         return url;
//       }
// }

import { Injectable, OnModuleInit } from '@nestjs/common';
import { join } from 'path';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
    private static appInitialized = false;
    
    onModuleInit() {
        // Check if the app has already been initialized
        if (!FirebaseService.appInitialized) {
            const serviceAccount = require(join(__dirname, '..', 'config', 'firebase-service-account.json'));

            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                storageBucket: 'gs://insta-clone-c6d16.appspot.com',
            });

            FirebaseService.appInitialized = true; // Set the flag to true after initialization
        }
    }

    getStorageBucket() {
        return admin.storage().bucket();
    }
}
