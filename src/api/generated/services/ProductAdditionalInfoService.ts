/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProductAdditionalInfoService {
    /**
     * Lấy danh sách thông tin bổ sung của sản phẩm
     * @param productId
     * @param isActive
     * @returns any Thành công
     * @throws ApiError
     */
    public static getProductsAdditionalInfo(
        productId: number,
        isActive?: boolean,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/products/{productId}/additional-info',
            path: {
                'productId': productId,
            },
            query: {
                'isActive': isActive,
            },
        });
    }
    /**
     * Thêm thông tin bổ sung cho sản phẩm
     * @param productId
     * @param requestBody
     * @returns any Tạo thành công
     * @throws ApiError
     */
    public static postProductsAdditionalInfo(
        productId: number,
        requestBody: {
            name: string;
            value?: string;
            sortOrder?: number;
            isActive?: boolean;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/products/{productId}/additional-info',
            path: {
                'productId': productId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Cập nhật thông tin bổ sung
     * @param id
     * @param requestBody
     * @returns any Cập nhật thành công
     * @throws ApiError
     */
    public static putProductAdditionalInfos(
        id: number,
        requestBody: {
            name?: string;
            value?: string;
            sortOrder?: number;
            isActive?: boolean;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/product-additional-infos/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Xóa thông tin bổ sung
     * @param id
     * @returns any Xóa thành công
     * @throws ApiError
     */
    public static deleteProductAdditionalInfos(
        id: number,
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: Record<string, any> | null;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/product-additional-infos/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Không tìm thấy thông tin`,
            },
        });
    }
}
