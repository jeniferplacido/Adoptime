import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import path from 'path';
import { engine } from 'express-handlebars';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import { config } from 'dotenv';

const app = express();
const PORT = process.env.PORT || 8080;

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect('mongodb+srv://jeni:jeni@cluster0.5nyoc9n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('MongoDB conectado com sucesso'))
    .catch(err => console.error('MongoDB connection error:', err));

app.engine('handlebars', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    }
}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());

// Rotas principais da API
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);

// Rota para a página de boas-vindas
app.get('/', (req, res) => {
    res.render('welcome');  
});

// Middleware para documentação Swagger
const swaggerFilePath = path.resolve(__dirname, '../swagger.yaml');
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'AdoptMe API',
            description: 'API para adotar mascotes',
            version: '1.0.0'
        }
    },
    apis: [swaggerFilePath]
};
const specs = swaggerJSDoc(swaggerOptions);
app.use('/apidocs', swaggerUi.serve);
app.get('/apidocs', swaggerUi.setup(specs));

// Inicialização do servidor
app.listen(PORT, () => console.log(`Servidor iniciado na porta ${PORT}`));
