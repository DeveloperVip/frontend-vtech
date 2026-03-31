/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ContactsService {
    /**
     * Gửi form liên hệ
     * @param requestBody
     * @returns any Gửi thành công
     * @throws ApiError
     */
    public static postContacts(
        requestBody: {
            fullName: string;
            email: string;
            subject?: string;
            phone?: number;
            message: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/contacts',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Lấy danh sách contact (admin)
     * @param page
     * @param limit
     * @param status
     * @param search
     * @returns any Thành công
     * @throws ApiError
     */
    public static getContacts(
        page?: number,
        limit?: number,
        status?: string,
        search?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/contacts',
            query: {
                'page': page,
                'limit': limit,
                'status': status,
                'search': search,
            },
        });
    }
    /**
     * Lấy chi tiết contact
     * @param id
     * @returns any Thành công
     * @throws ApiError
     */
    public static getContacts1(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/contacts/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Xóa contact
     * @param id
     * @returns any Xóa thành công
     * @throws ApiError
     */
    public static deleteContacts(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/contacts/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Cập nhật trạng thái contact
     * @param id
     * @param requestBody
     * @returns any Cập nhật thành công
     * @throws ApiError
     */
    public static patchContactsStatus(
        id: number,
        requestBody: {
            status: 'pending' | 'processing' | 'resolved' | 'rejected';
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/contacts/{id}/status',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
