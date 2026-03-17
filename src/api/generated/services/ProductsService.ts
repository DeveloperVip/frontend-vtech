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
}
