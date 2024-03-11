import express from "express";

const app = express();
const PORT = process.env.PORT || 7569;

app.use(express.json());

const server = app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});

process.on("SIGTERM", () => {
    console.debug("SIGTERM received: shutting down server.");
    server.close(() => {
        console.debug("HTTP server closed.");
    });
});
