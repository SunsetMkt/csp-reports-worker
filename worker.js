export default {
  async fetch(request, env, ctx) {
    const maxSize = 1 * 1024 * 1024; // 1 MB

    // 检查请求方法和路径
    if (request.method !== 'POST' || !request.url.endsWith('/csp-reports')) {
      return new Response('Endpoint not found. Please POST to /csp-reports', {
        status: 404,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    // 检查请求体大小
    const contentLength = request.headers.get('Content-Length');
    if (contentLength && parseInt(contentLength) > maxSize) {
      return new Response('Payload Too Large: Request body must be less than 1 MB', {
        status: 413,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    try {
      const json = await request.json();

      // 验证JSON结构
      if (json.type !== 'csp-violation' && !json['csp-report']) {
        return new Response('Invalid JSON format: Must contain "type" as "csp-violation" or "csp-report" key. For more details, see: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/report-to#violation_report_syntax', {
          status: 400,
          headers: { 'Content-Type': 'text/plain' }
        });
      }

      // 生成UUID
      const uuid = crypto.randomUUID();
      const reportId = `${uuid}-${Date.now()}`; // 生成随机ID
      const timestamp = Date.now();

      // 存入D1数据库
      await env.DB.prepare(
        'INSERT INTO csp_reports (id, report_data, created_at) VALUES (?, ?, ?)'
      ).bind(reportId, JSON.stringify(json), timestamp).run();

      return new Response(`Report stored successfully. ID: ${reportId}`, {
        status: 201,
        headers: { 'Content-Type': 'text/plain' }
      });
    } catch (error) {
      return new Response('Bad Request: Unable to parse JSON. For more details, see: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/report-to#violation_report_syntax', {
        status: 400,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  },
};
