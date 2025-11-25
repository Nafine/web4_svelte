import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from './api';
import { sendDot, fetchPage, fetchLastPage, type Dot, type DotDto } from './dotApi';

vi.mock('./api');

describe('dotApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('sendDot', () => {
        it('should send dot with POST request to /hit endpoint', async () => {
            const dot: DotDto = {
                x: 0.5,
                y: 0.5,
                r: 1,
                timestamp: '2025-11-25T10:00:00Z'
            };

            const mockResponse = { data: { result: true } };
            vi.mocked(api).mockResolvedValue(mockResponse);

            const result = await sendDot(dot);

            expect(api).toHaveBeenCalledWith({
                method: 'post',
                url: '/hit',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify(dot)
            });
            expect(result).toEqual(mockResponse);
        });

        it('should stringify dot data correctly', async () => {
            const dot: DotDto = {
                x: 1.5,
                y: 2.5,
                r: 2,
                timestamp: '2025-11-25T10:00:00Z'
            };

            vi.mocked(api).mockResolvedValue({ data: {} });

            await sendDot(dot);

            const callArgs = vi.mocked(api).mock.calls[0][0];
            expect(callArgs.data).toBe(JSON.stringify(dot));
        });

        it('should handle API errors', async () => {
            const dot: DotDto = {
                x: 0.5,
                y: 0.5,
                r: 1,
                timestamp: '2025-11-25T10:00:00Z'
            };

            vi.mocked(api).mockRejectedValue(new Error('Network error'));

            await expect(sendDot(dot)).rejects.toThrow('Network error');
        });
    });

    describe('fetchPage', () => {
        it('should fetch page with correct query parameters', async () => {
            const mockPage = {
                dots: [
                    {
                        x: 0.5,
                        y: 0.5,
                        r: 1,
                        result: true,
                        timestamp: '2025-11-25T10:00:00Z',
                        executionTime: 5
                    }
                ],
                hasNext: true,
                page: 0
            };

            vi.mocked(api.get).mockResolvedValue({ data: mockPage });

            const result = await fetchPage(0, 10);

            expect(api.get).toHaveBeenCalledWith('/dots?page=0&size=10');
            expect(result).toEqual(mockPage);
        });

        it('should handle pagination correctly', async () => {
            const mockPage = {
                dots: [],
                hasNext: false,
                page: 5
            };

            vi.mocked(api.get).mockResolvedValue({ data: mockPage });

            const result = await fetchPage(5, 20);

            expect(api.get).toHaveBeenCalledWith('/dots?page=5&size=20');
            expect(result.page).toBe(5);
            expect(result.hasNext).toBe(false);
        });

        it('should return data from response', async () => {
            const mockDots: Dot[] = [
                {
                    x: 0.1,
                    y: 0.2,
                    r: 0.5,
                    result: false,
                    timestamp: '2025-11-25T10:00:00Z',
                    executionTime: 3
                }
            ];

            const mockPage = {
                dots: mockDots,
                hasNext: true,
                page: 1
            };

            vi.mocked(api.get).mockResolvedValue({ data: mockPage });

            const result = await fetchPage(1, 15);

            expect(result.dots).toEqual(mockDots);
        });

        it('should handle API errors', async () => {
            vi.mocked(api.get).mockRejectedValue(new Error('Failed to fetch'));

            await expect(fetchPage(0, 10)).rejects.toThrow('Failed to fetch');
        });
    });

    describe('fetchLastPage', () => {
        it('should fetch last page with correct size parameter', async () => {
            const mockPage = {
                dots: [
                    {
                        x: 0.3,
                        y: 0.7,
                        r: 1.5,
                        result: true,
                        timestamp: '2025-11-25T10:00:00Z',
                        executionTime: 7
                    }
                ],
                hasNext: false,
                page: 10
            };

            vi.mocked(api.get).mockResolvedValue({ data: mockPage });

            const result = await fetchLastPage(10);

            expect(api.get).toHaveBeenCalledWith('/dots/last?size=10');
            expect(result).toEqual(mockPage);
        });

        it('should indicate no next page for last page', async () => {
            const mockPage = {
                dots: [],
                hasNext: false,
                page: 999
            };

            vi.mocked(api.get).mockResolvedValue({ data: mockPage });

            const result = await fetchLastPage(5);

            expect(result.hasNext).toBe(false);
        });

        it('should handle different page sizes', async () => {
            vi.mocked(api.get).mockResolvedValue({ data: { dots: [], hasNext: false, page: 0 } });

            await fetchLastPage(50);
            expect(api.get).toHaveBeenCalledWith('/dots/last?size=50');

            await fetchLastPage(100);
            expect(api.get).toHaveBeenCalledWith('/dots/last?size=100');
        });

        it('should handle API errors', async () => {
            vi.mocked(api.get).mockRejectedValue(new Error('Server error'));

            await expect(fetchLastPage(10)).rejects.toThrow('Server error');
        });
    });
});