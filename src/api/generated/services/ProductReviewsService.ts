/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProductReviewsService {
    /**
     * Lấy danh sách đánh giá của sản phẩm
     * @param productId
     * @param rating
     * @param page
     * @param limit
     * @returns any Thành công
     * @throws ApiError
     */
    public static getProductsReviews(
        productId: number,
        rating?: number,
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/products/{productId}/reviews',
            path: {
                'productId': productId,
            },
            query: {
                'rating': rating,
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * Thêm đánh giá cho sản phẩm
     * @param productId
     * @param requestBody
     * @returns any Tạo thành công
     * @throws ApiError
     */
    public static postProductsReviews(
        productId: number,
        requestBody: {
            userName: string;
            email: string;
            rating: number;
            content: string;
            images?: Array<{
                url?: string;
                width?: number;
                height?: number;
            }>;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/products/{productId}/reviews',
            path: {
                'productId': productId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Cập nhật đánh giá
     * @param id
     * @param requestBody
     * @returns any Cập nhật thành công
     * @throws ApiError
     */
    public static putProductReviews(
        id: number,
        requestBody: {
            userName?: string;
            email?: string;
            rating?: number;
            content?: string;
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: {
            id?: number;
            userName?: string;
            email?: string;
            rating?: number;
            content?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/product-reviews/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Không tìm thấy đánh giá`,
            },
        });
    }
    /**
     * Xóa đánh giá
     * @param id
     * @returns any Xóa thành công
     * @throws ApiError
     */
    public static deleteProductReviews(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/product-reviews/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Thích/Bỏ thích đánh giá
     * @param id
     * @returns any Thành công
     * @throws ApiError
     */
    public static postProductReviewsLike(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/product-reviews/{id}/like',
            path: {
                'id': id,
            },
        });
    }
}
