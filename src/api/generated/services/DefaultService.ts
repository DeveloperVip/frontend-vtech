/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Thử lại tạo 3D cho sản phẩm hoặc task cụ thể
     * @throws ApiError
     */
    public static postProducts3DRetry(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/products/{id}/3d-retry',
        });
    }
}
