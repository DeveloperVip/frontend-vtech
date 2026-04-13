/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProductsService {
    /**
     * Lấy danh sách sản phẩm
     * @param page
     * @param limit
     * @param search
     * @param categoryId
     * @param minPrice
     * @param maxPrice
     * @param sort
     * @returns any Thành công
     * @throws ApiError
     */
    public static getProducts(
        page?: number,
        limit?: number,
        search?: string,
        categoryId?: number,
        minPrice?: number,
        maxPrice?: number,
        sort?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/products',
            query: {
                'page': page,
                'limit': limit,
                'search': search,
                'categoryId': categoryId,
                'minPrice': minPrice,
                'maxPrice': maxPrice,
                'sort': sort,
            },
        });
    }
    /**
     * Tạo sản phẩm
     * @param requestBody
     * @returns any Tạo thành công
     * @throws ApiError
     */
    public static postProducts(
        requestBody: {
            name: string;
            slug?: string;
            description?: string;
            price: number;
            discountPrice?: number;
            stock?: number;
            thumbnail?: string;
            categoryId?: number;
            isActive?: boolean;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/products',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Lấy sản phẩm theo slug
     * @param slug
     * @returns any Thành công
     * @throws ApiError
     */
    public static getProductsSlug(
        slug: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/products/slug/{slug}',
            path: {
                'slug': slug,
            },
        });
    }
    /**
     * Lấy sản phẩm theo ID
     * @param id
     * @returns any Thành công
     * @throws ApiError
     */
    public static getProducts1(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/products/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Cập nhật sản phẩm
     * @param id
     * @param requestBody
     * @returns any Cập nhật thành công
     * @throws ApiError
     */
    public static putProducts(
        id: number,
        requestBody: {
            name?: string;
            slug?: string;
            description?: string;
            content?: string;
            price?: number;
            priceType?: 'fixed' | 'contact';
            thumbnail?: string;
            images?: Array<string>;
            categoryId?: number;
            isFeatured?: boolean;
            isActive?: boolean;
            sortOrder?: number;
            metaTitle?: string;
            metaDescription?: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/products/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Xóa sản phẩm
     * @param id
     * @returns any Xóa thành công
     * @throws ApiError
     */
    public static deleteProducts(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/products/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Tạo mô hình 3D (.glb) từ ảnh sản phẩm
     * @param id
     * @param requestBody
     * @returns any Đã nhận yêu cầu, đang xử lý ngầm
     * @throws ApiError
     */
    public static postProductsGenerate3D(
        id: number,
        requestBody?: {
            /**
             * URL ảnh cụ thể để tạo 3D (nếu để trống sẽ dùng ảnh đầu tiên của sản phẩm)
             */
            imageUrl?: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/products/{id}/generate-3d',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Tạo mô hình 3D preview (chưa gán sản phẩm)
     * @param requestBody
     * @returns any Đã nhận yêu cầu
     * @throws ApiError
     */
    public static postProducts3DPreview(
        requestBody?: {
            imageUrl: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/products/3d-preview',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Kiểm tra trạng thái task tạo 3D (poll endpoint)
     * Gọi endpoint này định kỳ để kiểm tra tiến trình tạo 3D.
     * - modelId là ID của ProductModel3D record (trả về từ generate-3d hoặc 3d-preview)
     * - Status: pending → processing → succeeded | failed
     * - Khi succeeded: modelUrl chứa URL file GLB có màu
     *
     * @param modelId ID của ProductModel3D record (không phải productId)
     * @returns any Trạng thái hiện tại
     * @throws ApiError
     */
    public static getProducts3DStatus(
        modelId: number,
    ): CancelablePromise<{
        success?: boolean;
        data?: {
            modelId?: number;
            productId?: number | null;
            status?: 'pending' | 'processing' | 'succeeded' | 'failed';
            /**
             * URL file GLB khi succeeded
             */
            modelUrl?: string | null;
            errorMessage?: string | null;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/products/3d-status/{modelId}',
            path: {
                'modelId': modelId,
            },
        });
    }
    /**
     * Kiểm tra trạng thái và lấy kết quả tạo mô hình 3D
     * @param id ID sản phẩm hoặc ID task 3D
     * @throws ApiError
     */
    public static getProducts3DStatus1(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/products/{id}/3d-status',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Tạo mô hình 3D preview từ nhiều góc ảnh (multi-view)
     * Hỗ trợ tối đa 4 ảnh: front (bắt buộc), back, left, right
     * @param requestBody
     * @returns any Đã nhận yêu cầu
     * @throws ApiError
     */
    public static postProducts3DPreviewViews(
        requestBody: {
            views: {
                front: string;
                back?: string;
                left?: string;
                right?: string;
            };
        },
    ): CancelablePromise<{
        success?: boolean;
        data?: {
            modelId?: number;
            status?: string;
            estimatedTime?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/products/3d-preview',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Thử lại tạo 3D cho sản phẩm hoặc task cụ thể
     * @param id ID task 3D (modelId)
     * @throws ApiError
     */
    public static postProducts3DRetry(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/products/{id}/3d-retry',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Lưu tạm các ảnh hướng 3D để persistence
     * @param requestBody
     * @returns any Thành công
     * @throws ApiError
     */
    public static postProducts3DStatusSaveViews(
        requestBody: {
            productId?: number | null;
            views: {
                front: string;
                back?: string;
                left?: string;
                right?: string;
            };
        },
    ): CancelablePromise<{
        success?: boolean;
        data?: {
            modelId?: number;
            productId?: number | null;
            sourceViews?: any;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/products/3d-status/save-views',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
