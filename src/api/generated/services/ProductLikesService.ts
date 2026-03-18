/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProductLikesService {
    /**
     * Thích hoặc Bỏ thích sản phẩm (Toggle Like)
     * @param productId
     * @returns any Thành công
     * @throws ApiError
     */
    public static postProductsLike(
        productId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/products/{productId}/like',
            path: {
                'productId': productId,
            },
        });
    }
    /**
     * Kiểm tra xem user hiện tại đã thích sản phẩm chưa
     * @param productId
     * @returns any Thành công
     * @throws ApiError
     */
    public static getProductsLike(
        productId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/products/{productId}/like',
            path: {
                'productId': productId,
            },
        });
    }
}
