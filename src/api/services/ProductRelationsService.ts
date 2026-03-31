/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProductRelationsService {
    /**
     * Lấy danh sách sản phẩm liên quan/gợi ý
     * @param productId
     * @param type
     * @returns any Thành công
     * @throws ApiError
     */
    public static getProductsRelations(
        productId: number,
        type?: 'related' | 'similar' | 'upsell',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/products/{productId}/relations',
            path: {
                'productId': productId,
            },
            query: {
                'type': type,
            },
        });
    }
    /**
     * Thêm sản phẩm liên quan
     * @param productId
     * @param requestBody
     * @returns any Tạo thành công
     * @throws ApiError
     */
    public static postProductsRelations(
        productId: number,
        requestBody: {
            relatedProductId: number;
            type: 'related' | 'similar' | 'upsell';
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/products/{productId}/relations',
            path: {
                'productId': productId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Xóa một liên kết sản phẩm
     * @param id
     * @returns any Xóa thành công
     * @throws ApiError
     */
    public static deleteProductRelations(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/product-relations/{id}',
            path: {
                'id': id,
            },
        });
    }
}
