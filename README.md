# MyWeb · Linye Studio

一个采用前后端分离思路搭建的个人作品集网站第一版：后端使用 Java / Spring Boot，前端使用原生 HTML、CSS、JavaScript。

## 运行

环境要求：Java 8、Maven 3.6+

```bash
mvn spring-boot:run
```

浏览器打开 `http://localhost:8080`。

## API

- `GET /api/profile`：个人信息
- `GET /api/stats`：个人数据
- `GET /api/projects`：项目列表
- `GET /api/timeline`：经历时间线
- `POST /api/contact`：联系表单

前端静态文件位于 `src/main/resources/static`，后续可以直接替换为 Vue/React 等独立前端，通过这些 API 对接。
