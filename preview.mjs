import http from 'node:http';
import { handlePreview } from './tools/preview-handler.mjs';
const server = http.createServer(handlePreview);
server.listen(43220,'127.0.0.1',()=>console.log(`Mail DNS Check preview http://127.0.0.1:43220 · owned PID ${process.pid} · 20-minute maximum`));function stop(){server.close(()=>process.exit(0));setTimeout(()=>process.exit(0),1000).unref();}setTimeout(stop,20*60*1000).unref();process.on('SIGINT',stop);process.on('SIGTERM',stop);
