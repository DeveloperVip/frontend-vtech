/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PostsService {
    /**
     * Lấy danh sách bài viết
     * @param page
     * @param limit
     * @param search
     * @param categoryId
     * @returns any Thành công
     * @throws ApiError
     */
    public static getPosts(
        page?: number,
        limit?: number,
        search?: string,
        categoryId?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/posts',
            query: {
                'page': page,
                'limit': limit,
                'search': search,
                'categoryId': categoryId,
            },
        });
    }
    /**
     * Tạo bài viết
     * @param requestBody
     * @returns any Tạo thành công
     * @throws ApiError
     */
    public static postPosts(
        requestBody: {
            title: string;
            slug?: string;
            content: string;
            thumbnail?: string;
            categoryId?: number;
            isPublished?: boolean;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/posts',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Lấy bài viết theo slug
     * @param slug
     * @returns any Thành công
     * @throws ApiError
     */
    public static getPostsSlug(
        slug: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/posts/slug/{slug}',
            path: {
                'slug': slug,
            },
        });
    }
    /**
     * Lấy bài viết theo ID
     * @param id
     * @returns any Thành công
     * @throws ApiError
     */
    public static getPosts1(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/posts/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Cập nhật bài viết
     * @param id
     * @param requestBody
     * @returns any Cập nhật thành công
     * @throws ApiError
     */
    public static putPosts(
        id: number,
        requestBody: {
            title?: string;
            slug?: string;
            content?: string;
            thumbnail?: string;
            isPublished?: boolean;
            categoryId?: number;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/posts/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Xóa bài viết
     * @param id
     * @returns any Xóa thành công
     * @throws ApiError
     */
    public static deletePosts(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/posts/{id}',
            path: {
                'id': id,
            },
        });
    }
}
