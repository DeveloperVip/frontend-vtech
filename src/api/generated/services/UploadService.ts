/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UploadService {
    /**
     * Upload ảnh (có kiểm tra kích thước)
     * Upload file ảnh lên server.
     * - Giới hạn dung lượng: 5MB
     * - Chỉ chấp nhận: jpg, png, webp, gif, svg
     * - Giới hạn kích thước ảnh: MAX_WIDTH x MAX_HEIGHT
     *
     * @param formData
     * @returns any Upload thành công
     * @throws ApiError
     */
    public static postUpload(
        formData: {
            /**
             * File ảnh cần upload
             */
            file: Blob;
        },
    ): CancelablePromise<{
        success?: boolean;
        url?: string;
        filename?: string;
        width?: number;
        height?: number;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/upload',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Lỗi validate (file không hợp lệ hoặc quá kích thước)`,
                401: `Không có quyền (chưa đăng nhập)`,
                500: `Lỗi server`,
            },
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
    /**
     * Upload ảnh lên Cloudinary
     * Upload ảnh lên Cloudinary (cloud storage).
     * - Giới hạn dung lượng: 5MB
     * - Auto resize theo MAX_WIDTH x MAX_HEIGHT
     * - Auto optimize + convert webp
     *
     * @param formData
     * @returns any Upload thành công
     * @throws ApiError
     */
    public static postUploadUploadCloud(
        formData: {
            file: Blob;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/upload/upload-cloud',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * Xóa ảnh trên Cloudinary
     * @throws ApiError
     */
    public static deleteUploadUploadCloud(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/upload/upload-cloud/{public_id}',
        });
    }
    /**
     * Upload nhiều ảnh lên Cloudinary (24-36 ảnh)
     * Upload nhiều ảnh dùng cho 360° product view.
     * - Giới hạn mỗi ảnh: 5MB
     * - Auto resize + convert webp
     *
     * @param formData
     * @returns any Upload thành công
     * @throws ApiError
     */
    public static postUploadUploadCloudMulti(
        formData: {
            files: Array<Blob>;
        },
    ): CancelablePromise<{
        success?: boolean;
        files?: Array<{
            url?: string;
            public_id?: string;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/upload/upload-cloud/multi',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
}
