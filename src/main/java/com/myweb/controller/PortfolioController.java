package com.myweb.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class PortfolioController {

    @GetMapping("/profile")
    public Map<String, Object> profile() {
        Map<String, Object> profile = new LinkedHashMap<String, Object>();
        profile.put("name", "花千树");
        profile.put("englishName", "SakuraLoop");
        profile.put("role", "Java 后端工程师 / 独立开发者");
        profile.put("location", "武汉 · 中国");
        profile.put("intro", "我把复杂的业务，做成安静、可靠、值得依赖的产品。");
        profile.put("available", true);
        return profile;
    }

    @GetMapping("/stats")
    public List<Map<String, String>> stats() {
        return Arrays.asList(
                stat("01", "专注方向", "后端架构"),
                stat("01", "工作年限", "年"),
                stat("4", "交付项目", "个"),
                stat("∞", "保持好奇", "每天")
        );
    }

    @GetMapping("/projects")
    public List<Map<String, Object>> projects() {
        return Arrays.asList(
                project("01", "Luma Commerce", "重新想象电商后台的秩序感。", "Java · Spring Boot · Redis", "2024", "commerce", "#c5d7ff", "#e6edff"),
                project("02", "Mori Notes", "一个把灵感轻轻接住的写作空间。", "Java · MySQL · REST API", "2023", "product", "#c7eadc", "#e8f7ef"),
                project("03", "Signal Desk", "给团队的实时数据观察站。", "Spring Cloud · WebSocket", "2023", "data", "#f4d8b3", "#fff0da")
        );
    }

    @GetMapping("/timeline")
    public List<Map<String, String>> timeline() {
        return Arrays.asList(
                event("2026 — 现在", "独立开发 · 杭州", "把时间花在真正重要的产品细节上。"),
                event("2026 — 现在", "后端工程师 · TCL格创东智", "参与集团生产系统平台的服务化建设及运维支持。"),
                event("2021 — 2025", "开始写代码", "从一个 Spring Boot 接口开始，慢慢走到今天。")
        );
    }

    @PostMapping("/contact")
    public ResponseEntity<Map<String, String>> contact(@RequestBody ContactMessage message) {
        Map<String, String> response = new LinkedHashMap<String, String>();
        response.put("status", "received");
        response.put("message", "收到你的消息了，我会尽快回复。");
        return ResponseEntity.ok(response);
    }

    private Map<String, String> stat(String number, String label, String suffix) {
        Map<String, String> item = new LinkedHashMap<String, String>();
        item.put("number", number);
        item.put("label", label);
        item.put("suffix", suffix);
        return item;
    }

    private Map<String, Object> project(String number, String title, String description, String stack,
                                        String year, String category, String color, String secondaryColor) {
        Map<String, Object> item = new LinkedHashMap<String, Object>();
        item.put("number", number);
        item.put("title", title);
        item.put("description", description);
        item.put("stack", stack);
        item.put("year", year);
        item.put("category", category);
        item.put("color", color);
        item.put("secondaryColor", secondaryColor);
        return item;
    }

    private Map<String, String> event(String date, String title, String description) {
        Map<String, String> item = new LinkedHashMap<String, String>();
        item.put("date", date);
        item.put("title", title);
        item.put("description", description);
        return item;
    }

    public static class ContactMessage {
        private String name;
        private String email;
        private String message;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
