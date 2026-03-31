/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * Đăng nhập admin
     * @param requestBody
     * @returns any Login thành công
     * @throws ApiError
     */
    public static postAuthLogin(
        requestBody: {
            email: string;
            password: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Thiếu email hoặc password`,
            },
        });
    }
    /**
     * Lấy thông tin admin hiện tại
     * @returns any Thành công
     * @throws ApiError
     */
    public static getAuthMe(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/me',
        });
    }
    /**
     * Đăng xuất
     * @returns any Logout thành công
     * @throws ApiError
     */
    public static postAuthLogout(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/logout',
        });
    }
}
