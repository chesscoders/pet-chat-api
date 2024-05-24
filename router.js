const { Router } = require("express");
const { middleware } = require("express-goodies");
const routes = require("./routes");

const router = Router();
module.exports = router;

// Use express context
router.use(middleware.httpContext);

// Use speed limiter for all requests
router.use(middleware.speedLimiter);

// Protect all non-public routes
router.all("/admin", middleware.authenticate);
router.all("/admin/*", middleware.authenticate);

// Useful middleware for testing
router.use(middleware.testError);
router.use(middleware.testLoading);

// use the router instances defined
router.use(routes.chat);

// matches any other HTTP method and route not matched before
router.all("*", middleware.notFound);

// finally, an error handler
router.use(middleware.errorHandler);
