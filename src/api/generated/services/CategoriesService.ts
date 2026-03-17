/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CategoriesService {
    /**
     * Lấy danh sách category
     * @returns any Thành công
     * @throws ApiError
     */
    public static getCategories(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/categories',
        });
    }
    /**
     * Tạo category mới
     * @param requestBody
     * @returns any Tạo thành công
     * @throws ApiError
     */
    public static postCategories(
        requestBody: {
            name: string;
            slug?: string;
            description?: string;
            parentId?: number;
            image?: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/categories',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Cập nhật category
     * @param id
     * @param requestBody
     * @returns any Cập nhật thành công
     * @throws ApiError
     */
    public static putCategories(
        id: number,
        requestBody: {
            name?: string;
            slug?: string;
            description?: string;
            parentId?: number;
            image?: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/categories/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Xóa category
     * @param id
     * @returns any Xóa thành công
     * @throws ApiError
     */
    public static deleteCategories(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/categories/{id}',
            path: {
                'id': id,
            },
        });
    }
}
