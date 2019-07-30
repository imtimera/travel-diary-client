import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, Observer, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Cloudinary } from '@cloudinary/angular-5.x';
import { Post } from './../model/post';
import { environment } from '../../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class PostsService {
    baseUrl = environment.baseUrl;
    endpoint = this.baseUrl + "/posts";

    constructor(private http:HttpClient, private cloudinary: Cloudinary) {
    }

    getPostsPage(requestParams?:any):Observable<any> {
        return this.http.get(this.endpoint, {params: requestParams})
            .pipe(
                tap(val => console.log(`Calling getAllPosts method. The response: ${val}`)),
                map(res => {
                    return res;
                }),
                catchError((error:any) => {
                    /*console.error(error);*/
                    return of(error);
                })
            );
    }

    getPostDetails(id:number):Observable<any> {
        return this.http.get(this.endpoint + "/" + id)
            .pipe(
                map(res => {
                    return res;
                }),
                catchError((error:any) => {
                    return of(error);
                })
            );
    }
    uploadImage(blobInfo: any, success: any, failure: any):void {
        var cloudinaryUrl = `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/upload`;
        var uploadPreset = this.cloudinary.config().upload_preset;
        var xhr, formData;
        xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.open('POST', cloudinaryUrl);
        xhr.onload = function() {
            var json;
            if (xhr.status != 200) {
                failure('HTTP Error: ' + xhr.status);
                return;
            }
            json = JSON.parse(xhr.responseText);
            if (!json || typeof json.url != 'string') {
                failure('Invalid JSON: ' + xhr.responseText);
                return;
            }
            success(json.url);
        };
        formData = new FormData();
        formData.append('file', blobInfo.blob(), blobInfo.filename());
        formData.append("upload_preset", uploadPreset);
        xhr.send(formData);
    }
}