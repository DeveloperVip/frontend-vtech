/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProductImagesService {
    /**
     * Lấy danh sách ảnh của sản phẩm
     * @param productId
     * @param type
     * @param page
     * @param limit
     * @returns any Thành công
     * @throws ApiError
     */
    public static getProductsImages(
        productId: number,
        type?: 'thumbnail' | 'gallery' | 360,
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/products/{productId}/images',
            path: {
                'productId': productId,
            },
            query: {
                'type': type,
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * Thêm ảnh cho sản phẩm
     * @param productId
     * @param requestBody
     * @returns any Tạo thành công
     * @throws ApiError
     */
    public static postProductsImages(
        productId: number,
        requestBody: {
            url: string;
            type?: 'thumbnail' | 'gallery' | 360;
            width?: number;
            height?: number;
            sortOrder?: number;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/products/{productId}/images',
            path: {
                'productId': productId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Cập nhật thông tin ảnh
     * @param id
     * @param requestBody
     * @returns any Cập nhật thành công
     * @throws ApiError
     */
    public static putProductImages(
        id: number,
        requestBody: {
            url?: string;
            type?: string;
            width?: number;
            height?: number;
            sortOrder?: number;
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: {
            id?: number;
            url?: string;
            type?: string;
            width?: number;
            height?: number;
            sortOrder?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/product-images/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Không tìm thấy ảnh`,
            },
        });
    }
    /**
     * Xóa ảnh
     * @param id
     * @returns any Xóa thành công
     * @throws ApiError
     */
    public static deleteProductImages(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/product-images/{id}',
            path: {
                'id': id,
            },
        });
    }
}
