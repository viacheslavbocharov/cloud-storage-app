import { Injectable, HttpException } from '@nestjs/common';
import fetch from 'node-fetch';

@Injectable()
export class FetchProxyService {
  async forward<T>(
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    url: string,
    data?: any,
    headers: Record<string, string> = {},
  ): Promise<T> {
    const fetchOptions: any = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (['POST', 'PATCH'].includes(method) && data) {
      fetchOptions.body = JSON.stringify(data);
    }

    const response = await fetch(url, fetchOptions);
    const text = await response.text();

    if (!response.ok) {
      let parsed: any;

      try {
        // 1. Пробуем обычный парсинг
        parsed = JSON.parse(text);
      } catch {
        try {
          // 2. Пробуем двойной парсинг (строка содержащая JSON)
          parsed = JSON.parse(JSON.parse(text));
        } catch {
          parsed = {
            message: 'Internal error',
            error: text,
          };
        }
      }

      throw new HttpException(
        {
          message: parsed.message || 'Internal error',
          error: parsed.error || 'Error',
          statusCode: parsed.statusCode || response.status,
        },
        parsed.statusCode || response.status,
      );
    }

    try {
      return text ? JSON.parse(text) : null;
    } catch {
      return text as unknown as T;
    }
  }
}
