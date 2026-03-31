/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProductAttributesService {
    /**
     * Lấy danh sách thuộc tính của sản phẩm
     * @param productId
     * @returns any Thành công
     * @throws ApiError
     */
    public static getProductsAttributes(
        productId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/products/{productId}/attributes',
            path: {
                'productId': productId,
            },
        });
    }
    /**
     * Thêm thuộc tính cho sản phẩm
     * @param productId
     * @param requestBody
     * @returns any Tạo thành công
     * @throws ApiError
     */
    public static postProductsAttributes(
        productId: number,
        requestBody: {
            name: string;
            value: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/products/{productId}/attributes',
            path: {
                'productId': productId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Cập nhật thuộc tính
     * @param id
     * @param requestBody
     * @returns any Cập nhật thành công
     * @throws ApiError
     */
    public static putProductAttributes(
        id: number,
        requestBody: {
            name?: string;
            value?: string;
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: {
            id?: number;
            name?: string;
            value?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/product-attributes/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Không tìm thấy thuộc tính`,
            },
        });
    }
    /**
     * Xóa thuộc tính
     * @param id
     * @returns any Xóa thành công
     * @throws ApiError
     */
    public static deleteProductAttributes(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/product-attributes/{id}',
            path: {
                'id': id,
            },
        });
    }
}
