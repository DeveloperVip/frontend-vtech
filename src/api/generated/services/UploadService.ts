/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UploadService {
    /**
     * Upload ảnh
     * @param formData
     * @returns any Upload thành công
     * @throws ApiError
     */
    public static postUpload(
        formData: {
            file: Blob;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/upload',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * Xóa file đã upload
     * @param filename
     * @returns any Xóa thành công
     * @throws ApiError
     */
    public static deleteUpload(
        filename: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/upload/{filename}',
            path: {
                'filename': filename,
            },
        });
    }
}
