import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';

import { Const } from '../providers/constants';
import { CommonProvider } from '../providers/common-provider';

@Injectable()
export class CameraService {

	constructor(
				public camera: Camera,
				public file: File,
				public filePath: FilePath,
				public common: CommonProvider,
				) {

	}

	GetCamerOptions( destinationType, sourceType ): CameraOptions {
		return {
			quality: Const.CAMERA.QUALITY,
			destinationType: destinationType,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE,
			sourceType: sourceType,
			allowEdit: true,
			targetWidth: Const.CAMERA.WIDTH,
			targetHeight: Const.CAMERA.HEIGHT
		}
	}

	base64toBlob(base64Data, contentType) {
		contentType = contentType || '';
		var sliceSize = 1024;
		var byteCharacters = atob(base64Data);
		var bytesLength = byteCharacters.length;
		var slicesCount = Math.ceil(bytesLength / sliceSize);
		var byteArrays = new Array(slicesCount);
	  
	  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
		  var begin = sliceIndex * sliceSize;
		  var end = Math.min(begin + sliceSize, bytesLength);
	  
		  var bytes = new Array(end - begin);
		  for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
			  bytes[i] = byteCharacters[offset].charCodeAt(0);
		  }
		  byteArrays[sliceIndex] = new Uint8Array(bytes);
	  }
	  return new Blob(byteArrays, { type: contentType });
	  }

	GalleryPhoto( destinationFilename, sourceType: number ): Promise<any> {
		
		return new Promise( ( resolve, reject ) => {

			let sourceDirectory;
			let sourceFileName;

			this.camera.getPicture( this.GetCamerOptions( this.camera.DestinationType.FILE_URI, sourceType ) )
				.then( imagePath => {

					if ( Const.IS_ANDROID ) {
						this.filePath.resolveNativePath( imagePath )
						  .then( filePath => {
							sourceDirectory = filePath.substr( 0, filePath.lastIndexOf( '/' ) + 1);
							sourceFileName = imagePath.substring( imagePath.lastIndexOf( '/' ) + 1, imagePath.lastIndexOf( '?' ));
							this.file.copyFile(sourceDirectory, sourceFileName, this.file.externalDataDirectory + Const.FOLDER.SHOOTERS, destinationFilename)
								.then( success => {

									resolve( {
										sourcePath: this.file.externalDataDirectory + Const.FOLDER.SHOOTERS + "/" + destinationFilename
									} );

								});
						});
						
					} else {
						sourceDirectory = imagePath.substring(0, imagePath.lastIndexOf('/') + 1);
						sourceFileName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.length);

						resolve( {
							sourcePath: imagePath
						} );

					}			
					
				}).catch( (error) => {
					alert( JSON.stringify( error ) );
				});

		});

	}

	GetPhoto( destinationFilename, sourceType: number ): Promise<any> {
		
		return new Promise( ( resolve, reject ) => {

			this.camera.getPicture( this.GetCamerOptions( this.camera.DestinationType.FILE_URI, sourceType ) )
				.then( sourcePath => {

					let sourceDirectory = sourcePath.substring(0, sourcePath.lastIndexOf('/') + 1);
					let sourceFileName = sourcePath.substring(sourcePath.lastIndexOf('/') + 1, sourcePath.length);
					
					this.file.moveFile( sourceDirectory, sourceFileName, this.file.externalDataDirectory + Const.FOLDER.SHOOTERS, destinationFilename )
						.then( res => {	
							resolve( {
								sourcePath: this.file.externalDataDirectory + Const.FOLDER.SHOOTERS + "/" + destinationFilename
						});
					
					} );

				}, (err) => {
					reject( err );
				});

		});

	}

}
