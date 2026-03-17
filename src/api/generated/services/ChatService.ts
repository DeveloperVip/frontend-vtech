/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ChatService {
    /**
     * Lấy thông tin phòng chat theo ID
     * @param id
     * @returns any Thành công
     * @throws ApiError
     */
    public static getChatRooms(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/chat/rooms/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Lấy danh sách tin nhắn theo room
     * @param roomId
     * @param page
     * @param limit
     * @returns any Thành công
     * @throws ApiError
     */
    public static getChatRoomsMessages(
        roomId: number,
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/chat/rooms/{roomId}/messages',
            path: {
                'roomId': roomId,
            },
            query: {
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * Lấy số tin nhắn chưa đọc
     * @returns any Thành công
     * @throws ApiError
     */
    public static getChatUnreadCount(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/chat/unread-count',
        });
    }
}
