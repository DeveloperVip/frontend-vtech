/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProductModel3DService {
    /**
     * Lấy mô hình 3D của sản phẩm
     * @param productId
     * @returns any Thành công
     * @throws ApiError
     */
    public static getProductsModel3D(
        productId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/products/{productId}/model-3d',
            path: {
                'productId': productId,
            },
        });
    }
    /**
     * Thêm hoặc Cập nhật mô hình 3D cho sản phẩm
     * @param productId
     * @param requestBody
     * @returns any Thành công
     * @throws ApiError
     */
    public static putProductsModel3D(
        productId: number,
        requestBody: {
            modelUrl: string;
            textureUrl?: string;
            poster?: string;
            fileSize?: number;
            /**
             * Mảng URL ảnh 360°
             */
            images360?: Array<string>;
            /**
             * Định dạng file model 3D (glb, gltf, fbx...)
             */
            format?: string;
        },
    ): CancelablePromise<{
        success?: boolean;
        data?: {
            id?: number;
            productId?: number;
            modelUrl?: string;
            textureUrl?: string;
            poster?: string;
            fileSize?: number;
            images360?: Array<string>;
            format?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/products/{productId}/model-3d',
            path: {
                'productId': productId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Không tìm thấy sản phẩm`,
            },
        });
    }
    /**
     * Xóa mô hình 3D của sản phẩm
     * @param productId
     * @returns any Xóa thành công
     * @throws ApiError
     */
    public static deleteProductsModel3D(
        productId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/products/{productId}/model-3d',
            path: {
                'productId': productId,
            },
        });
    }
}
