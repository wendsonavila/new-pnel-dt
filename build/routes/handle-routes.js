"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const csrf_protection_1 = __importDefault(require("../utils/csrf-protection"));
const render_config_1 = require("../config/render-config");
const get_files_dir_1 = __importDefault(require("../utils/get-files-dir"));
const handler_errors_1 = __importDefault(require("../errors/handler-errors"));
function handler(fastify, _, done) {
    const routes = (0, get_files_dir_1.default)(__dirname, ['handle-routes.ts', 'handle-routes.js']);
    routes.forEach((file) => {
        try {
            const route = require(file).default;
            if (route && route.url)
                fastify.route(route);
        }
        catch (err) { }
    });
    fastify.decorateRequest('csrfProtection', { getter: () => csrf_protection_1.default });
    fastify.setNotFoundHandler((req, reply) => {
        reply.status(404);
        render_config_1.Render.page(req, reply, '/404/index.html');
    });
    fastify.setErrorHandler(handler_errors_1.default);
    done();
}
exports.default = handler;
